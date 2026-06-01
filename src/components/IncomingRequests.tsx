import React, { useState, useEffect } from 'react';
import { User, Check, X, Bell } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

interface SwapRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface IncomingRequestsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IncomingRequests({ isOpen, onClose }: IncomingRequestsProps) {
  const { user: currentUser } = useAuth();
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch incoming requests
  const fetchRequests = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('receiver_id', currentUser.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load requests');
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error in fetchRequests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // Accept request: create conversation + welcome message, then mark accepted
  const handleAccept = async (requestId: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        toast.error('Request not found');
        return;
      }
      const { sender_id, receiver_id } = request;

      // Look up an existing conversation between the two users
      const { data: existing, error: lookupError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_one.eq.${sender_id},participant_two.eq.${receiver_id}),` +
          `and(participant_one.eq.${receiver_id},participant_two.eq.${sender_id})`,
        )
        .maybeSingle();

      if (lookupError) {
        console.error('Error looking up conversation:', lookupError);
        toast.error('Failed to accept request');
        return;
      }

      let conversationId = existing?.id;

      if (!conversationId) {
        const { data: created, error: createError } = await supabase
          .from('conversations')
          .insert({ participant_one: sender_id, participant_two: receiver_id })
          .select('id')
          .single();

        if (createError || !created) {
          console.error('Error creating conversation:', createError);
          toast.error('Failed to accept request');
          return;
        }
        conversationId = created.id;
      }

      // Welcome message from the original sender
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id,
          content: "Hi! Excited to start swapping skills with you 👋",
        });

      const { error: statusError } = await supabase
        .from('swap_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (statusError) {
        console.error('Error updating request status:', statusError);
        toast.error('Failed to accept request');
        return;
      }

      toast.success('Request accepted! Say hi in chat.');
      setRequests(prev => prev.filter(req => req.id !== requestId));
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
        // Remove from list
        setRequests(prev => prev.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error('Error in handleReject:', error);
      toast.error('Failed to reject request');
    }
  };

  // Fetch requests when component opens
  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              Incoming Requests
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400">No incoming requests</p>
              </div>
            ) : (
              requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {request.sender?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-slate-400 text-sm">
                        wants to swap with you
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all flex items-center justify-center gap-1 text-sm font-medium shadow-lg shadow-green-500/20"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 px-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-medium border border-white/10"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
