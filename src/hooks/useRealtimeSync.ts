import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeSyncOptions {
  onProfileUpdate?: (profile: any) => void;
  onNewUser?: (profile: any) => void;
  onSkillUpdate?: (skill: any) => void;
  onConversationUpdate?: (conversation: any) => void;
  userId?: string;
}

export const useRealtimeSync = (options: RealtimeSyncOptions) => {
  const channelRef = useRef<{
    profiles: RealtimeChannel | null;
    skills: RealtimeChannel | null;
    conversations: RealtimeChannel | null;
  } | null>(null);

  useEffect(() => {
    const setupRealtime = async () => {
      try {
        // Setup profiles table subscription
        const profilesChannel = supabase
          .channel('profiles_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'profiles' 
            }, 
            (payload) => {
              
              if (payload.eventType === 'INSERT' && options.onNewUser) {
                options.onNewUser(payload.new);
              } else if (payload.eventType === 'UPDATE' && options.onProfileUpdate) {
                options.onProfileUpdate(payload.new);
              }
            }
          );

        // Setup skills table subscription
        const skillsChannel = supabase
          .channel('skills_changes')
          .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'skills'
            },
            (payload) => {
              if (options.onSkillUpdate) {
                options.onSkillUpdate(payload.new);
              }
            }
          );

        // Setup conversations table subscription
        const conversationsChannel = supabase
          .channel('conversations_changes')
          .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'conversations'
            },
            (payload) => {
              if (options.onConversationUpdate) {
                options.onConversationUpdate(payload.new);
              }
            }
          );

        // Subscribe to all channels
        profilesChannel.subscribe();
        skillsChannel.subscribe();
        conversationsChannel.subscribe();

        
        // Store channels for cleanup
        channelRef.current = {
          profiles: profilesChannel as RealtimeChannel,
          skills: skillsChannel as RealtimeChannel,
          conversations: conversationsChannel as RealtimeChannel
        };

      } catch (error) {
        console.error('Realtime setup failed (non-critical):', error);
      }
    };

    setupRealtime();

    return () => {
      // Cleanup channels
      if (channelRef.current) {
        try {
          Object.values(channelRef.current).forEach((channel) => {
            if (channel) {
              supabase.removeChannel(channel as RealtimeChannel);
            }
          });
        } catch (error) {
          console.error('Realtime cleanup error (non-critical):', error);
        }
      }
    };
  }, [options.userId]);

  return channelRef.current;
};
