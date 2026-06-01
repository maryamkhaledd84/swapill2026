import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

const PRESENCE_CHANNEL = 'online-users';

let sharedChannel: RealtimeChannel | null = null;
let activeUserId: string | null = null;
let onlineIdsState = new Set<string>();
const listeners = new Set<(s: Set<string>) => void>();
let visibilityHandler: (() => void) | null = null;

function notify(ids: Set<string>) {
  onlineIdsState = ids;
  listeners.forEach((l) => l(ids));
}

function ensureChannel(userId: string): RealtimeChannel {
  if (sharedChannel && activeUserId === userId) return sharedChannel;

  if (sharedChannel) {
    try { supabase.removeChannel(sharedChannel); } catch { /* ignore */ }
    sharedChannel = null;
  }

  activeUserId = userId;
  const channel = supabase.channel(PRESENCE_CHANNEL, {
    config: { presence: { key: userId } },
  });

  const syncOnline = () => {
    const state = channel.presenceState() as Record<string, Array<{ user_id?: string }>>;
    const ids = new Set<string>();
    for (const key of Object.keys(state)) {
      const entries = state[key];
      if (entries && entries.length > 0) {
        ids.add(entries[0].user_id || key);
      }
    }
    notify(ids);
  };

  channel
    .on('presence', { event: 'sync' }, syncOnline)
    .on('presence', { event: 'join' }, syncOnline)
    .on('presence', { event: 'leave' }, syncOnline)
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

  if (!visibilityHandler) {
    visibilityHandler = async () => {
      if (!sharedChannel || !activeUserId) return;
      if (document.visibilityState === 'visible') {
        await sharedChannel.track({
          user_id: activeUserId,
          online_at: new Date().toISOString(),
        });
      } else {
        await sharedChannel.untrack();
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);
  }

  sharedChannel = channel;
  return channel;
}

export function usePresence(userId?: string | null) {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(onlineIdsState);

  useEffect(() => {
    if (!userId) {
      setOnlineIds(new Set());
      return;
    }
    ensureChannel(userId);
    listeners.add(setOnlineIds);
    setOnlineIds(onlineIdsState);
    return () => {
      listeners.delete(setOnlineIds);
    };
  }, [userId]);

  return onlineIds;
}

export function isOnline(onlineIds: Set<string>, userId?: string | null): boolean {
  if (!userId) return false;
  return onlineIds.has(userId);
}
