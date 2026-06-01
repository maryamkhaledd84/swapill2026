import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Paperclip, Phone, Video, Search, MessageCircle, Plus, Smile, Mic, ArrowLeft, Share2 } from "lucide-react";
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import LogoutModal from '../components/shared/LogoutModal';
import { getSafeName, getSafeAvatar, getSafeInitials } from '../utils/safeFallbacks';
import { filterValidConversations } from '../utils/userValidation';
import { usePresence, isOnline } from '../hooks/usePresence';
import { shareOrCopy, profileShareUrl } from '../utils/share';

interface Profile { id: string; full_name: string | null; bio: string | null; avatar_url: string | null; }
interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  created_at: string;
  other_user?: Profile;
  last_message?: string;
  last_message_time?: string;
  participant_one_profile?: Profile;
  participant_two_profile?: Profile;
  unread_count?: number;
}
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  created_at: string;
  is_read: boolean;
  attachment_url?: string | null;
  attachment_name?: string | null;
  attachment_mime?: string | null;
}

import { getAvatarGradient } from '../utils/avatarColor';

// Modern Avatar Component with Colorful Initials
function ModernAvatar({ name, size = "medium", avatarUrl }: {
  name: string;
  size?: "small" | "medium" | "large";
  avatarUrl?: string | null;
  isCurrentUser?: boolean;
}) {
  const safeName = name || 'Member';
  const initials = getSafeInitials(safeName);
  const sizeClasses = {
    small: "w-12 h-12 text-sm",
    medium: "w-14 h-14 text-base",
    large: "w-16 h-16 text-lg",
  };
  const color = getAvatarGradient(safeName);

  if (avatarUrl && avatarUrl.trim() !== '') {
    return (
      <div className={`rounded-full overflow-hidden border border-white/20 ${sizeClasses[size]}`}>
        <img src={avatarUrl} alt={safeName} className="w-full h-full object-cover rounded-full aspect-square" />
      </div>
    );
  }

  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-semibold border border-white/20 ${sizeClasses[size]}`}>
      {initials}
    </div>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [, setIsSearching] = useState(false);
  const [, setLoadingConversations] = useState(true);
  const [, setLoadingMessages] = useState(false);
  const [, setLoadingConversation] = useState(false);
  const [, setLoadingUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesChannelRef = useRef<any>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  // Cache of messages per conversation id, so re-opening is instant.
  const messagesCacheRef = useRef<Map<string, Message[]>>(new Map());
  // Tracks the most recently opened conversation so we can ignore late-arriving
  // fetches from previous conversations (prevents flicker when switching fast).
  const activeConvIdRef = useRef<string | null>(null);

  // Mirror activeConversation in a ref so realtime handlers can read the
  // latest value without re-subscribing every time the user switches chat.
  const activeConversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeConversationIdRef.current = activeConversation?.id ?? null;
  }, [activeConversation?.id]);

  const onlineIds = usePresence(currentUser?.id);

  useEffect(() => {
    // Always dispatch (even at zero) so the sidebar badge clears when the
    // user has no conversations left.
    const event = new CustomEvent('updateConversationsCount', { detail: conversations.length });
    window.dispatchEvent(event);
  }, [conversations.length]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setCurrentUser(session.user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Global listener: bumps unread + last-message preview for any conversation,
  // and refreshes the conversation list when a new one appears (e.g. someone
  // accepts your swap request). The handler reads activeConversation via a
  // ref so we don't re-subscribe every time the user switches chats.
  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase
      .channel(`messages-global-${currentUser.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message;
          setConversations(prev =>
            prev.map(c => {
              if (c.id !== msg.conversation_id) return c;
              const isInbound = msg.sender_id !== currentUser.id;
              const isViewing = activeConversationIdRef.current === c.id;
              return {
                ...c,
                last_message: msg.content,
                last_message_time: msg.created_at,
                unread_count: isInbound && !isViewing ? (c.unread_count || 0) + 1 : c.unread_count,
              };
            }),
          );
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations', filter: `participant_one=eq.${currentUser.id}` },
        () => loadConversations(),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations', filter: `participant_two=eq.${currentUser.id}` },
        () => loadConversations(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    loadAllUsers(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // Handle URL parameter for direct user chat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('user');
    
    if (targetUserId && allUsers.length > 0) {
      const targetUser = allUsers.find(user => user.id === targetUserId);
      if (targetUser) {
        setSelectedUser(targetUser);
        startConversationWith(targetUser);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [allUsers, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    loadConversations(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [currentUser]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  useEffect(() => {
    if (!activeConversation) return;

    if (messagesChannelRef.current) {
      supabase.removeChannel(messagesChannelRef.current);
      messagesChannelRef.current = null;
    }

    const channel = supabase
      .channel(`messages:${activeConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            const next = [...prev, newMsg];
            // Keep the cache in sync so re-opens stay instant.
            messagesCacheRef.current.set(newMsg.conversation_id, next);
            return next;
          });
        },
      )
      .subscribe();

    messagesChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      messagesChannelRef.current = null;
    };
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(allUsers);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = allUsers.filter(user => 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, allUsers]);

  const loadAllUsers = async (isCancelled?: () => boolean) => {
    setLoadingUsers(true);

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_one_profile:participant_one (id, full_name, avatar_url, bio),
        participant_two_profile:participant_two (id, full_name, avatar_url, bio)
      `)
      .or(`participant_one.eq.${currentUser?.id},participant_two.eq.${currentUser?.id}`);

    if (isCancelled?.()) return;

    if (error) {
      console.error('Error loading users:', error);
    } else {
      // Process conversations to extract unique users (excluding current user)
      const conversations = data || [];
      const uniqueUsers: Profile[] = [];
      const seenUserIds = new Set();
      
      conversations.forEach(conv => {
        // Add participant_one if not current user and not already added
        if (conv.participant_one_profile && 
            conv.participant_one !== currentUser?.id && 
            !seenUserIds.has(conv.participant_one_profile.id)) {
          uniqueUsers.push(conv.participant_one_profile);
          seenUserIds.add(conv.participant_one_profile.id);
        }
        
        // Add participant_two if not current user and not already added
        if (conv.participant_two_profile && 
            conv.participant_two !== currentUser?.id && 
            !seenUserIds.has(conv.participant_two_profile.id)) {
          uniqueUsers.push(conv.participant_two_profile);
          seenUserIds.add(conv.participant_two_profile.id);
        }
      });
      
      const filteredData = uniqueUsers.filter(user => {
        // Skip null/undefined users
        if (!user || user === null) return false;
        
        return true;
      });
      
      setAllUsers(filteredData);
      setFilteredUsers(filteredData);

      // Don't auto-pick a selectedUser here. Auto-opening a conversation (in the
      // loadConversations effect) is the source of truth for both selectedUser and
      // activeConversation, which keeps the header in sync with the chat body.
    }
    setLoadingUsers(false);
  };

  const selectUser = (user: Profile) => {
    setSelectedUser(user);
    setSearchQuery('');
  };

  const loadConversations = async (isCancelled?: () => boolean) => {
    if (!currentUser) return;
    setLoadingConversations(true);
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_one_profile:participant_one (
          id,
          full_name,
          username,
          email,
          avatar_url,
          bio
        ),
        participant_two_profile:participant_two (
          id,
          full_name,
          username,
          email,
          avatar_url,
          bio
        )
      `)
      .or(`participant_one.eq.${currentUser.id},participant_two.eq.${currentUser.id}`)
      .order('created_at', { ascending: false });
    if (isCancelled?.()) return;
    if (error || !data || data.length === 0) { setLoadingConversations(false); return; }
    const enriched = await Promise.all(data.map(async (conv) => {
      const otherId = conv.participant_one === currentUser.id ? conv.participant_two : conv.participant_one;
      const isParticipantOne = conv.participant_one === currentUser.id;

      const profileData = isParticipantOne ? conv.participant_two_profile : conv.participant_one_profile;

      const [lastMsgRes, unreadRes] = await Promise.all([
        supabase
          .from('messages')
          .select('content, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', currentUser.id),
      ]);

      const safeName = getSafeName(profileData, { id: otherId });
      const safeProfile = profileData || {
        id: otherId,
        full_name: safeName,
        email: null,
        avatar_url: getSafeAvatar(profileData, safeName),
      };

      return {
        ...conv,
        other_user: safeProfile,
        last_message: lastMsgRes.data?.content || 'No messages yet',
        last_message_time: lastMsgRes.data?.created_at || conv.created_at,
        unread_count: unreadRes.count || 0,
      };
    }));

    if (isCancelled?.()) return;

    // Filter out corrupted conversations using validation utilities
    const validConversations = filterValidConversations(enriched);

    setConversations(validConversations);
    setLoadingConversations(false);
  };

  const loadMessages = async (conversationId: string) => {
    // Show cached messages instantly so the chat body doesn't flash empty.
    const cached = messagesCacheRef.current.get(conversationId);
    if (cached) {
      setMessages(cached);
    } else {
      setMessages([]);
    }

    setLoadingMessages(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Ignore the result if the user has since opened a different conversation.
    if (activeConvIdRef.current !== conversationId) {
      setLoadingMessages(false);
      return;
    }

    const fresh = data || [];
    messagesCacheRef.current.set(conversationId, fresh);
    setMessages(fresh);
    setLoadingMessages(false);
  };

  const markConversationRead = async (conv: Conversation) => {
    if (!currentUser?.id) return;
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conv.id)
      .eq('is_read', false)
      .neq('sender_id', currentUser.id);
    setConversations(prev =>
      prev.map(c => (c.id === conv.id ? { ...c, unread_count: 0 } : c)),
    );
  };

  const openConversation = (conv: Conversation) => {
    activeConvIdRef.current = conv.id;
    setActiveConversation(conv);
    // Hydrate selectedUser so the right pane (header, message avatars, input)
    // matches the open conversation. Without this, the chat looks "selected"
    // in the list but the body shows the empty state.
    if (conv.other_user) {
      setSelectedUser(conv.other_user);
    } else if (currentUser) {
      const isP1 = conv.participant_one === currentUser.id;
      const counterparty = (isP1 ? conv.participant_two_profile : conv.participant_one_profile) || null;
      if (counterparty) setSelectedUser(counterparty);
    }
    setSearchQuery('');
    loadMessages(conv.id);
    markConversationRead(conv);
    // Sync URL so the conversation is shareable / refreshable / back-navigable.
    if (conversationId !== conv.id) {
      navigate(`/chat/${conv.id}`);
    }
  };

  const startConversationWith = async (profile: Profile) => {
    if (!currentUser) return;
    setSearchQuery('');
    const existing = conversations.find(c => (c.participant_one === currentUser.id && c.participant_two === profile.id) || (c.participant_one === profile.id && c.participant_two === currentUser.id));
    if (existing) { openConversation(existing); return; }
    const { data, error } = await supabase.from('conversations').insert({ participant_one: currentUser.id, participant_two: profile.id }).select().single();
    if (error) { console.error('Error:', error); return; }
    const newConv: Conversation = { ...data, other_user: profile, last_message: 'No messages yet', last_message_time: data.created_at };
    setConversations(prev => [newConv, ...prev]);
    openConversation(newConv);
  };

  // Load conversation when conversationId is present in URL
  useEffect(() => {
    if (conversationId && currentUser) {
      const loadConversationFromUrl = async () => {
        setLoadingConversation(true);
        try {
          // Fetch conversation details
          const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .select(`
              *,
              participant_one_profile:participant_one (
                id, full_name, avatar_url, bio
              ),
              participant_two_profile:participant_two (
                id, full_name, avatar_url, bio
              )
            `)
            .eq('id', conversationId)
            .single();

          if (convError) {
            console.error('Error loading conversation:', convError);
            return;
          }

          if (conversation) {
            const otherUser: Profile | null = conversation.participant_one === currentUser.id
              ? conversation.participant_two_profile
              : conversation.participant_one_profile;

            const conversationWithUser: Conversation = {
              ...conversation,
              other_user: otherUser || undefined,
            };

            activeConvIdRef.current = conversationWithUser.id;
            setActiveConversation(conversationWithUser);
            setSelectedUser(otherUser || null);

            await loadMessages(conversationId);
            await markConversationRead(conversationWithUser);
          }
        } catch (error) {
          console.error('Error loading conversation from URL:', error);
        } finally {
          setLoadingConversation(false);
        }
      };

      loadConversationFromUrl();
    } else if (currentUser) {
      // Navigated from /chat/:id back to /chat — clear the open conversation
      // so the empty state shows instead of the previous chat.
      activeConvIdRef.current = null;
      setActiveConversation(null);
      setSelectedUser(null);
      setMessages([]);
    }
  }, [conversationId, currentUser]);

  const sendMessage = async () => {
    if (!inputVal.trim() || !currentUser || sending) return;

    // Resolve which conversation to send into. If activeConversation is null
    // (e.g. selectedUser was auto-picked from the list without opening it yet),
    // find or create the conversation with selectedUser.
    let conv = activeConversation;
    if (!conv && selectedUser) {
      const existing = conversations.find(c =>
        (c.participant_one === currentUser.id && c.participant_two === selectedUser.id) ||
        (c.participant_one === selectedUser.id && c.participant_two === currentUser.id),
      );
      if (existing) {
        conv = existing;
      } else {
        const { data, error } = await supabase
          .from('conversations')
          .insert({ participant_one: currentUser.id, participant_two: selectedUser.id })
          .select()
          .single();
        if (error || !data) {
          toast.error(error?.message || 'Failed to start conversation');
          return;
        }
        conv = { ...data, other_user: selectedUser, last_message: 'No messages yet', last_message_time: data.created_at };
        setConversations(prev => [conv as Conversation, ...prev]);
      }
      setActiveConversation(conv);
    }
    if (!conv) {
      toast.error('Pick a conversation first');
      return;
    }

    const content = inputVal.trim();
    setInputVal('');
    setSending(true);
    const tempMsg: Message = { id: `temp-${Date.now()}`, conversation_id: conv.id, sender_id: currentUser.id, content, created_at: new Date().toISOString(), is_read: false };
    setMessages(prev => [...prev, tempMsg]);
    const { data, error } = await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: currentUser.id, content }).select().single();
    if (error) {
      console.error('sendMessage failed:', error);
      toast.error(error.message || 'Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setInputVal(content);
    }
    else if (data) {
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? data : m));
      setConversations(prev => prev.map(c => c.id === conv!.id ? { ...c, last_message: content, last_message_time: data.created_at } : c));
    }
    setSending(false);
  };

  // Upload an attachment file to the `attachments` bucket and send it as a message.
  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // Resolve target conversation (same logic as sendMessage)
    let conv = activeConversation;
    if (!conv && selectedUser) {
      const existing = conversations.find(c =>
        (c.participant_one === currentUser.id && c.participant_two === selectedUser.id) ||
        (c.participant_one === selectedUser.id && c.participant_two === currentUser.id),
      );
      if (existing) {
        conv = existing;
      } else {
        const { data, error } = await supabase
          .from('conversations')
          .insert({ participant_one: currentUser.id, participant_two: selectedUser.id })
          .select()
          .single();
        if (error || !data) {
          toast.error(error?.message || 'Failed to start conversation');
          return;
        }
        conv = { ...data, other_user: selectedUser, last_message: 'No messages yet', last_message_time: data.created_at };
        setConversations(prev => [conv as Conversation, ...prev]);
      }
      setActiveConversation(conv);
    }
    if (!conv) {
      toast.error('Pick a conversation first');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be smaller than 10MB');
      return;
    }

    setUploadingAttachment(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${currentUser.id}/${conv.id}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('attachments')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });

      if (upErr) {
        toast.error(`Upload failed: ${upErr.message}`);
        return;
      }

      const { data: pub } = supabase.storage.from('attachments').getPublicUrl(path);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conv.id,
          sender_id: currentUser.id,
          content: null,
          attachment_url: pub.publicUrl,
          attachment_name: file.name,
          attachment_mime: file.type,
        })
        .select()
        .single();

      if (error) {
        toast.error(error.message || 'Failed to send attachment');
        return;
      }
      if (data) {
        setMessages(prev => (prev.some(m => m.id === data.id) ? prev : [...prev, data]));
        setConversations(prev =>
          prev.map(c => (c.id === conv!.id
            ? { ...c, last_message: '📎 ' + file.name, last_message_time: data.created_at }
            : c)),
        );
      }
    } catch (err: any) {
      console.error('Attachment upload error:', err);
      toast.error('Failed to upload attachment');
    } finally {
      setUploadingAttachment(false);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    }
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent">
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile when chat is open, visible on desktop */}
        <aside className={`${selectedUser ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 h-full lg:h-full bg-slate-800/50 backdrop-blur-md border-r border-purple-500/10 flex flex-col pt-0`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Messages ({conversations.length})</h2>
            <button
              onClick={() => navigate('/explore')}
              title="Find someone to chat with"
              className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Users Section - real online presence */}
          {(() => {
            const activeNow = filteredUsers.filter(p => isOnline(onlineIds, p.id));
            if (activeNow.length === 0) return null;
            return (
              <div className="px-5 py-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Active Now ({activeNow.length})
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {activeNow.slice(0, 6).map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => selectUser(profile)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-700/30 transition-all cursor-pointer group"
                    >
                      <div className="relative inline-block">
                        <ModernAvatar
                          name={getSafeName(profile)}
                          size="small"
                          avatarUrl={profile?.avatar_url}
                          isCurrentUser={false}
                        />
                        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-800" title="Online"></div>
                      </div>
                      <div className="text-xs text-slate-300 text-center max-w-[60px] truncate">
                        {getSafeName(profile).split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Unread Section - real per-conversation counts */}
          {(() => {
            const matchesSearch = (conv: Conversation) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              const friendProfile = conv.participant_one === currentUser?.id ? conv.participant_two_profile : conv.participant_one_profile;
              const name = getSafeName(friendProfile || {}).toLowerCase();
              const last = (conv.last_message || '').toLowerCase();
              return name.includes(q) || last.includes(q);
            };
            const unreadConvs = conversations.filter(c => (c.unread_count || 0) > 0 && matchesSearch(c));
            if (unreadConvs.length === 0) return null;
            return (
              <div className="px-5 py-3 border-t border-slate-700/30">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Unread</h3>
                <div className="space-y-1">
                  {unreadConvs.map((conv) => {
                    const friendProfile = conv.participant_one === currentUser?.id ? conv.participant_two_profile : conv.participant_one_profile;
                    const otherId = conv.participant_one === currentUser?.id ? conv.participant_two : conv.participant_one;
                    const friendOnline = isOnline(onlineIds, otherId);
                    return (
                      <button
                        key={conv.id}
                        onClick={() => openConversation(conv)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer relative ${
                          activeConversation?.id === conv.id
                            ? 'bg-purple-600/20 border-l-4 border-l-purple-500'
                            : 'hover:bg-slate-700/30'
                        }`}
                      >
                        <div className="relative">
                          <ModernAvatar
                            name={getSafeName(friendProfile || {})}
                            size="small"
                            avatarUrl={friendProfile?.avatar_url}
                            isCurrentUser={false}
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${friendOnline ? 'bg-green-500' : 'bg-slate-500'}`}
                            title={friendOnline ? 'Online' : 'Offline'}
                          />
                          <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {conv.unread_count}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-semibold text-white truncate">
                            {getSafeName(friendProfile || {})}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {conv.last_message || 'No messages yet'}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {conv.last_message_time ? formatTime(conv.last_message_time) : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* All Messages Section */}
          <div className="px-5 py-3 border-t border-slate-700/30">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">All Messages</h3>
            <div className="space-y-1">
              {(() => {
                const q = searchQuery.trim().toLowerCase();
                const visible = !q
                  ? conversations
                  : conversations.filter(conv => {
                      const friendProfile = conv.participant_one === currentUser?.id ? conv.participant_two_profile : conv.participant_one_profile;
                      const name = getSafeName(friendProfile || {}).toLowerCase();
                      const last = (conv.last_message || '').toLowerCase();
                      return name.includes(q) || last.includes(q);
                    });

                if (conversations.length === 0) {
                  return (
                    <p className="text-sm text-slate-500 px-2 py-3">
                      No conversations yet. Find someone in Explore to start swapping.
                    </p>
                  );
                }
                if (visible.length === 0) {
                  return (
                    <p className="text-sm text-slate-500 px-2 py-3">
                      No conversations match "{searchQuery}".
                    </p>
                  );
                }
                return visible.map((conv) => {
                  const friendProfile = conv.participant_one === currentUser?.id ? conv.participant_two_profile : conv.participant_one_profile;
                  const otherId = conv.participant_one === currentUser?.id ? conv.participant_two : conv.participant_one;
                  const friendOnline = isOnline(onlineIds, otherId);
                  const unread = conv.unread_count || 0;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => openConversation(conv)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer relative ${
                        activeConversation?.id === conv.id
                          ? 'bg-purple-600/20 border-l-4 border-l-purple-500'
                          : 'hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="relative">
                        <ModernAvatar
                          name={getSafeName(friendProfile || {})}
                          size="small"
                          avatarUrl={friendProfile?.avatar_url}
                          isCurrentUser={false}
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${friendOnline ? 'bg-green-500' : 'bg-slate-500'}`}
                          title={friendOnline ? 'Online' : 'Offline'}
                        />
                        {unread > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-semibold text-white truncate">
                          {getSafeName(friendProfile || {})}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {conv.last_message || 'No messages yet'}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {conv.last_message_time ? formatTime(conv.last_message_time) : ''}
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Window - Takes remaining space, full width on mobile */}
      <main className="flex-1 h-full min-h-0 flex flex-col bg-slate-900/30 backdrop-blur-sm w-full overflow-hidden">
        {selectedUser ? (
          <>
            {/* Chat Header - pinned at top while messages scroll under it */}
            <header className="flex-shrink-0 h-14 border-b border-slate-700/30 bg-slate-800/60 backdrop-blur-md flex items-center px-4 z-10">
              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-700/50 text-gray-300 transition-colors mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <ModernAvatar
                  name={selectedUser.full_name || 'User'}
                  size="small"
                  avatarUrl={selectedUser.avatar_url}
                  isCurrentUser={false}
                />
                <div>
                  <div className="font-semibold text-white text-sm">{selectedUser?.full_name || 'Unknown User'}</div>
                  {(() => {
                    const online = isOnline(onlineIds, selectedUser.id);
                    return (
                      <div className={`text-xs flex items-center gap-1 ${online ? 'text-green-400' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-400' : 'bg-slate-500'} relative`}>
                          {online && <div className="absolute inset-0 rounded-full bg-green-400 animate-ping" />}
                        </div>
                        {online ? 'Online' : 'Offline'}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectedUser && shareOrCopy({
                    url: profileShareUrl(selectedUser.id),
                    title: `${selectedUser.full_name || 'Member'} on Swapill`,
                    text: 'Check out this profile on Swapill',
                  })}
                  title="Share profile"
                  className="p-1.5 rounded-lg hover:bg-slate-700/50 text-gray-300 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toast('Voice calls are coming soon')}
                  title="Voice call (coming soon)"
                  className="p-1.5 rounded-lg hover:bg-slate-700/50 text-gray-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toast('Video calls are coming soon')}
                  title="Video call (coming soon)"
                  className="p-1.5 rounded-lg hover:bg-slate-700/50 text-gray-300 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
            </header>

            {/* Messages Area - the only scrollable region in the chat panel */}
            <motion.div
              ref={scrollRef}
              key={activeConversation?.id || 'no-conv'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Start the conversation</h3>
                  <p className="text-gray-400 text-sm">Send your first message to {selectedUser?.full_name || 'this user'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => {
                    const isMyMessage = message.sender_id === currentUser?.id;
                    return (
                      <div key={message.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md flex gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!isMyMessage && (
                            <ModernAvatar 
                              name={selectedUser?.full_name || 'User'} 
                              size="small" 
                              avatarUrl={selectedUser?.avatar_url}
                              isCurrentUser={false}
                            />
                          )}
                          <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`px-3 py-2 rounded-lg max-w-xs ${
                                isMyMessage
                                  ? 'bg-[#5C67F2] text-white rounded-br-md'
                                  : 'bg-[#2E3343] text-white rounded-bl-md'
                              }`}
                            >
                              {message.attachment_url && (
                                message.attachment_mime?.startsWith('image/') ? (
                                  <a href={message.attachment_url} target="_blank" rel="noreferrer" className="block">
                                    <img
                                      src={message.attachment_url}
                                      alt={message.attachment_name || 'attachment'}
                                      className="rounded-md max-h-64 object-cover mb-1"
                                      loading="lazy"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    href={message.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm underline mb-1 break-all"
                                  >
                                    <Paperclip className="w-4 h-4 flex-shrink-0" />
                                    <span>{message.attachment_name || 'Download file'}</span>
                                  </a>
                                )
                              )}
                              {message.content && (
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              )}
                            </div>
                            <div className={`text-xs mt-1 ${isMyMessage ? 'text-right' : 'text-left'} ${isMyMessage ? 'text-purple-300' : 'text-slate-400'} px-1`}>
                              {formatTime(message.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Message Input - pinned at the bottom of the chat panel */}
            <footer className="flex-shrink-0 border-t border-slate-700/30 bg-slate-800/30 backdrop-blur-md p-4">
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-600/50 rounded-full px-4 py-3 backdrop-blur-sm">
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />
                <button
                  onClick={() => attachmentInputRef.current?.click()}
                  disabled={uploadingAttachment}
                  title="Attach a file"
                  className="p-1.5 rounded-full hover:bg-slate-700/50 text-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingAttachment ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="text"
                  placeholder="Your message here..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-slate-400 outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={() => toast('Emoji picker is coming soon')}
                  title="Emoji (coming soon)"
                  className="p-1.5 rounded-full hover:bg-slate-700/50 text-slate-400 transition-colors"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toast('Voice messages are coming soon')}
                  title="Voice message (coming soon)"
                  className="p-1.5 rounded-full hover:bg-slate-700/50 text-slate-400 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!inputVal.trim() || sending}
                  className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </footer>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mb-8 border border-purple-500/30">
                <MessageCircle className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-200 mb-3">
                {conversations.length === 0 ? 'No conversations yet' : 'Select a conversation'}
              </h3>
              <p className="text-gray-400 text-base">
                {conversations.length === 0
                  ? 'Once someone accepts your swap request, your chat will show up here.'
                  : 'Pick a conversation from the list to start chatting.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
      </div>
    </div>
  );
}
