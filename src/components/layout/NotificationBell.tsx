import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, UserPlus } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UnreadMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  attachment_url: string | null;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string | null;
}

interface PendingRequest {
  id: string;
  sender_id: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string | null;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UnreadMessage[]>([]);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const total = messages.length + requests.length;

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Fetch + subscribe
  useEffect(() => {
    if (!user?.id) {
      setMessages([]);
      setRequests([]);
      return;
    }

    let cancelled = false;

    const enrichWithProfiles = async <T extends { sender_id: string }>(
      rows: T[],
    ): Promise<(T & { sender_name?: string; sender_avatar?: string | null })[]> => {
      if (!rows.length) return [];
      const ids = Array.from(new Set(rows.map(r => r.sender_id)));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, name, avatar_url')
        .in('id', ids);
      const byId = new Map<string, { name: string; avatar: string | null }>();
      (profiles || []).forEach((p: any) => {
        byId.set(p.id, {
          name: p.full_name || p.name || 'Member',
          avatar: p.avatar_url || null,
        });
      });
      return rows.map(r => ({
        ...r,
        sender_name: byId.get(r.sender_id)?.name,
        sender_avatar: byId.get(r.sender_id)?.avatar ?? null,
      }));
    };

    const refresh = async () => {
      const [msgRes, reqRes] = await Promise.all([
        // RLS already restricts to messages in conversations I'm part of, so we
        // don't need to join conversations here.
        supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, attachment_url, created_at')
          .eq('is_read', false)
          .neq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('swap_requests')
          .select('id, sender_id, created_at')
          .eq('receiver_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (cancelled) return;

      const enrichedMessages = await enrichWithProfiles((msgRes.data || []) as any);
      const enrichedRequests = await enrichWithProfiles((reqRes.data || []) as any);

      if (cancelled) return;
      setMessages(enrichedMessages as UnreadMessage[]);
      setRequests(enrichedRequests as PendingRequest[]);
    };

    refresh();

    const channel = supabase
      .channel(`notification-bell-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'swap_requests' }, refresh)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full h-10 w-10 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-purple-600 text-white text-[10px] font-semibold flex items-center justify-center border-2 border-[#0f172a]">
            {total > 99 ? '99+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {total === 0 && <span className="text-xs text-slate-500">All caught up</span>}
          </div>

          {requests.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <UserPlus className="w-3 h-3" /> Swap requests ({requests.length})
              </div>
              {requests.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setOpen(false); navigate('/requests'); }}
                  className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {r.sender_avatar ? (
                    <img src={r.sender_avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {(r.sender_name || 'M').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">{r.sender_name || 'Someone'}</div>
                    <div className="text-xs text-slate-400">wants to swap skills</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {messages.length > 0 && (
            <div className="p-2 border-t border-white/5">
              <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3" /> Messages ({messages.length})
              </div>
              {messages.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setOpen(false); navigate(`/chat/${m.conversation_id}`); }}
                  className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {m.sender_avatar ? (
                    <img src={m.sender_avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {(m.sender_name || 'M').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">{m.sender_name || 'Someone'}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {m.attachment_url ? '📎 Attachment' : (m.content || '')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {total === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No new notifications
            </div>
          )}

          <div className="border-t border-white/5 p-2 flex gap-2">
            <Link
              to="/chat"
              onClick={() => setOpen(false)}
              className="flex-1 text-center text-xs text-slate-300 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              View all messages
            </Link>
            <Link
              to="/requests"
              onClick={() => setOpen(false)}
              className="flex-1 text-center text-xs text-slate-300 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              View all requests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
