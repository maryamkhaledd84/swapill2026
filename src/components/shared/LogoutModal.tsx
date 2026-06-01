import React from "react";
import { motion } from "motion/react";
import { LogOut, X } from "lucide-react";
import { supabase } from "../../config/supabase";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      
      // Call supabase signOut directly to ensure proper logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        toast.error('Error signing out');
        return;
      }
      
      
      // Clear any localStorage data
      localStorage.removeItem('swapill_user');
      
      // Force navigation to home page with complete app reset
      window.location.href = '/';
      
      toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast.error('An error occurred during logout');
      
      // Still try to clean up and redirect on error
      localStorage.removeItem('swapill_user');
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20 z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {!isLoggingOut && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 z-[10001]"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-8 h-8 text-red-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            Are you sure you want to log out?
          </h3>
          
          <p className="text-gray-300 mb-8">
            You can always come back and continue your skill swapping journey.
          </p>

          {/* Loading spinner or buttons */}
          {isLoggingOut ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-400 hover:to-orange-500 transition-all font-medium shadow-lg shadow-red-500/25"
              >
                Yes, Logout
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
