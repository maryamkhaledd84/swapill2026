import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { User, Check, X, UserPlus, Mail, Send, Search, Filter, MessageCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SenderSkill {
  id: string;
  title: string;
  category: string;
}

interface CounterpartyProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface SwapRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  // The "other" user shown in the card — sender for incoming, receiver for outgoing.
  counterparty?: CounterpartyProfile | null;
  // Backwards compatibility alias kept so existing template code reading `sender` still works.
  sender?: CounterpartyProfile | null;
  sender_skills?: SenderSkill[];
}

type Direction = 'incoming' | 'outgoing';

export default function RequestsPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'cancelled'>('pending');
  const [direction, setDirection] = useState<Direction>('incoming');
  const [recentlyAccepted, setRecentlyAccepted] = useState<Set<string>>(new Set());
  const acceptedTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    // Clear any pending "recently accepted" timers on unmount so we don't
    // call setRecentlyAccepted after this component is gone.
    return () => {
      acceptedTimers.current.forEach(clearTimeout);
      acceptedTimers.current.clear();
    };
  }, []);

  // Find or create the conversation with the counterparty, then route to /chat/:id
  const openChatWith = async (counterpartyId: string) => {
    if (!currentUser?.id) return;
    try {
      const { data: existing, error: lookupError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_one.eq.${currentUser.id},participant_two.eq.${counterpartyId}),` +
          `and(participant_one.eq.${counterpartyId},participant_two.eq.${currentUser.id})`,
        )
        .maybeSingle();

      if (lookupError) {
        console.error('Error looking up conversation:', lookupError);
        toast.error('Could not open chat');
        return;
      }

      if (existing?.id) {
        navigate(`/chat/${existing.id}`);
        return;
      }

      const { data: created, error: createError } = await supabase
        .from('conversations')
        .insert({ participant_one: currentUser.id, participant_two: counterpartyId })
        .select('id')
        .single();

      if (createError || !created) {
        console.error('Error creating conversation:', createError);
        toast.error('Could not start chat');
        return;
      }
      navigate(`/chat/${created.id}`);
    } catch (err) {
      console.error('openChatWith failed:', err);
      toast.error('Could not open chat');
    }
  };
  const [brokenAvatars, setBrokenAvatars] = useState<Set<string>>(new Set());

  // Fetch incoming requests, then enrich each with sender profile + skills
  const fetchRequests = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      // Incoming: requests sent TO me (counterparty = sender)
      // Outgoing: requests sent BY me (counterparty = receiver)
      const filterCol = direction === 'incoming' ? 'receiver_id' : 'sender_id';
      const counterpartyCol = direction === 'incoming' ? 'sender_id' : 'receiver_id';

      const { data: rawRequests, error } = await supabase
        .from('swap_requests')
        .select('id, status, created_at, sender_id, receiver_id')
        .eq(filterCol, currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load swap requests:', error);
        toast.error('Failed to load requests');
        return;
      }

      if (!rawRequests || rawRequests.length === 0) {
        setRequests([]);
        return;
      }

      const counterpartyIds = Array.from(
        new Set(rawRequests.map(r => (r as any)[counterpartyCol] as string))
      );

      const [profilesRes, skillsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', counterpartyIds),
        supabase
          .from('skills')
          .select('id, title, category, user_id')
          .in('user_id', counterpartyIds),
      ]);

      const profileById = new Map<string, CounterpartyProfile>();
      (profilesRes.data || []).forEach(p => profileById.set(p.id, p));

      const skillsByUser = new Map<string, SenderSkill[]>();
      (skillsRes.data || []).forEach((s: any) => {
        const list = skillsByUser.get(s.user_id) || [];
        list.push({ id: s.id, title: s.title, category: s.category });
        skillsByUser.set(s.user_id, list);
      });

      const enriched: SwapRequest[] = rawRequests.map(r => {
        const cpId = (r as any)[counterpartyCol] as string;
        const cp = profileById.get(cpId) || null;
        return {
          id: r.id,
          sender_id: r.sender_id,
          receiver_id: r.receiver_id,
          status: r.status,
          created_at: r.created_at,
          counterparty: cp,
          sender: cp, // alias so existing JSX reading `request.sender` still renders
          sender_skills: skillsByUser.get(cpId) || [],
        };
      });

      setRequests(enriched);
    } catch (err) {
      console.error('Error in fetchRequests:', err);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // Accept request: ensure conversation exists, send opening message, mark accepted
  const handleAccept = async (requestId: string) => {
    try {
      const { data: requestData, error: fetchError } = await supabase
        .from('swap_requests')
        .select('sender_id, receiver_id')
        .eq('id', requestId)
        .single();

      if (fetchError || !requestData) {
        console.error('Error fetching request details:', fetchError);
        toast.error('Failed to get request details');
        return;
      }

      const { sender_id, receiver_id } = requestData;

      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_one.eq.${sender_id},participant_two.eq.${receiver_id}),` +
          `and(participant_one.eq.${receiver_id},participant_two.eq.${sender_id})`,
        )
        .maybeSingle();

      if (checkError) {
        console.error('Error checking conversation:', checkError);
        toast.error('Failed to check conversation');
        return;
      }

      let conversationId = existingConv?.id;

      if (!conversationId) {
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({ participant_one: sender_id, participant_two: receiver_id })
          .select('id')
          .single();

        if (createError || !newConv) {
          console.error('Error creating conversation:', createError);
          toast.error('Failed to create conversation');
          return;
        }
        conversationId = newConv.id;
      }

      // Welcome message comes from the accepter (current user) — RLS requires
      // messages.sender_id = auth.uid().
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: "Hi! Excited to start swapping skills with you 👋",
        });
      if (messageError) {
        console.error('Error sending welcome message:', messageError);
      }

      const { error: statusError } = await supabase
        .from('swap_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (statusError) {
        console.error('Error updating request status:', statusError);
        toast.error('Failed to update request status');
        return;
      }

      toast.success('You are friends now! Start swapping skills.');
      
      // Track this request as recently accepted for UI feedback
      setRecentlyAccepted(prev => new Set(prev).add(requestId));
      
      // Update local state to remove or change request card
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'accepted' } : req
        )
      );

      // Remove the 'recently accepted' status after 2 seconds. Store the
      // handle so we can cancel on unmount and avoid setState-after-unmount.
      const existing = acceptedTimers.current.get(requestId);
      if (existing) clearTimeout(existing);
      const handle = setTimeout(() => {
        acceptedTimers.current.delete(requestId);
        setRecentlyAccepted(prev => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
      }, 2000);
      acceptedTimers.current.set(requestId, handle);

    } catch (error) {
      console.error('Error in handleAccept:', error);
      toast.error('Failed to accept request');
    }
  };

  // Reject request
  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('swap_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) {
        console.error('Error rejecting request:', error);
        toast.error('Failed to reject request');
      } else {
        toast.success('Request rejected');
        // Update local state
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'rejected' } : req
          )
        );
      }
    } catch (error) {
      console.error('Error in handleReject:', error);
      toast.error('Failed to reject request');
    }
  };

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.sender?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Get skill category color
  const getSkillColor = (category: string) => {
    const colors: Record<string, string> = {
      web: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      design: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      mobile: 'bg-green-500/20 text-green-300 border-green-500/30',
      backend: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      marketing: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      writing: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      video: 'bg-red-500/20 text-red-300 border-red-500/30',
      music: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      cooking: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      photography: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Cancel an outgoing request — sets status to 'cancelled'
  const handleCancel = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('swap_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (error) {
        console.error('Error cancelling request:', error);
        toast.error('Failed to cancel request');
      } else {
        toast.success('Request cancelled');
        setRequests(prev =>
          prev.map(req => (req.id === requestId ? { ...req, status: 'cancelled' } : req))
        );
      }
    } catch (err) {
      console.error('Error in handleCancel:', err);
      toast.error('Failed to cancel request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser, direction]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-white text-lg">Please log in to view your requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-16 max-w-5xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2.5">
          <UserPlus className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
          Swap Requests
        </h1>
        <p className="text-slate-400 text-sm">
          {direction === 'incoming'
            ? 'Manage requests other people sent to you'
            : 'Track requests you sent to other people'}
        </p>
      </div>

      {/* Direction tabs */}
      <div className="mb-4 inline-flex rounded-xl bg-slate-800/50 border border-white/10 p-1">
        <button
          onClick={() => setDirection('incoming')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            direction === 'incoming'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Incoming
        </button>
        <button
          onClick={() => setDirection('outgoing')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            direction === 'outgoing'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Outgoing
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={direction === 'incoming' ? 'Search by sender name...' : 'Search by recipient name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 rounded-xl px-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-transparent text-white text-sm border-none focus:outline-none py-2"
          >
            <option value="pending" className="bg-slate-800">Pending</option>
            <option value="all" className="bg-slate-800">All</option>
            <option value="accepted" className="bg-slate-800">Accepted</option>
            <option value="rejected" className="bg-slate-800">Rejected</option>
            {direction === 'outgoing' && (
              <option value="cancelled" className="bg-slate-800">Cancelled</option>
            )}
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {direction === 'incoming' ? (
              <Mail className="w-8 h-8 text-slate-600" />
            ) : (
              <Send className="w-8 h-8 text-slate-600" />
            )}
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            No requests found
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
            {direction === 'incoming'
              ? 'New requests will appear here when someone wants to swap with you.'
              : 'Requests you send to other people will show up here.'}
          </p>
          {direction === 'outgoing' && (
            <button
              onClick={() => navigate('/explore')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
              Find someone to swap with
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredRequests.map((request) => {
              const counterparty = request.counterparty || request.sender;
              const counterpartyName = counterparty?.full_name || 'Unknown User';
              const counterpartyAvatar = counterparty?.avatar_url;
              const initials = counterpartyName
                .split(/\s+/)
                .map((n) => n[0])
                .filter(Boolean)
                .join('')
                .toUpperCase()
                .slice(0, 2);
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 md:p-5 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {counterpartyAvatar
                      && !counterpartyAvatar.includes('dicebear.com')
                      && !brokenAvatars.has(request.id) ? (
                      <img
                        src={counterpartyAvatar}
                        alt=""
                        loading="lazy"
                        onError={() =>
                          setBrokenAvatars((prev) => {
                            const next = new Set(prev);
                            next.add(request.id);
                            return next;
                          })
                        }
                        className="w-11 h-11 rounded-full object-cover border border-white/10 flex-shrink-0 bg-slate-700"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                        {initials || <User className="w-5 h-5" />}
                      </div>
                    )}

                    {/* Request Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white truncate">{counterpartyName}</h3>
                          <p className="text-slate-400 text-xs">
                            {direction === 'incoming'
                              ? 'wants to swap skills with you'
                              : 'you sent them a swap request'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            request.status === 'pending'
                              ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                              : request.status === 'accepted'
                              ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                              : request.status === 'cancelled'
                              ? 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                              : 'bg-red-500/15 text-red-300 border border-red-500/30'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Sender Skills */}
                      {request.sender_skills && request.sender_skills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1.5">Skills offered</p>
                          <div className="flex flex-wrap gap-1.5">
                            {request.sender_skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill.id}
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getSkillColor(skill.category)}`}
                              >
                                {skill.title}
                              </span>
                            ))}
                            {request.sender_skills.length > 3 && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-700/50 text-slate-400">
                                +{request.sender_skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {request.status === 'pending' && direction === 'incoming' && (
                        <div className="flex gap-2">
                          {recentlyAccepted.has(request.id) ? (
                            <div className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg flex items-center gap-1.5 text-sm font-medium shadow-lg shadow-green-500/25">
                              <Check className="w-4 h-4" />
                              Connected
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleAccept(request.id)}
                                className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-medium shadow-lg shadow-green-500/25"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="px-4 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-medium border border-white/10"
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {request.status === 'pending' && direction === 'outgoing' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancel(request.id)}
                            className="px-4 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-medium border border-white/10"
                          >
                            <X className="w-4 h-4" />
                            Cancel request
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
