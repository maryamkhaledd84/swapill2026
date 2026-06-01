import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase auto-detects the session from the URL hash on load. We just
    // wait for the auth state to settle, then route based on the result.
    let resolved = false;

    const finish = (path: string) => {
      if (resolved) return;
      resolved = true;
      navigate(path, { replace: true });
    };

    const check = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        finish('/login');
        return;
      }
      if (data.session) {
        toast.success('Welcome!');
        finish('/explore');
      }
    };

    // Run an initial check (covers the case where Supabase has already
    // finished processing the URL by the time we mount).
    check();

    // And subscribe in case the session arrives a tick later.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Welcome!');
        finish('/explore');
      } else if (event === 'SIGNED_OUT') {
        finish('/login');
      }
    });

    // Fallback: if nothing has happened in 5s, send the user back to login
    // rather than leaving them stranded on this loader screen.
    const timeout = setTimeout(() => {
      if (!resolved) {
        toast.error('Authentication timed out. Please try again.');
        finish('/login');
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in…</p>
      </div>
    </div>
  );
}
