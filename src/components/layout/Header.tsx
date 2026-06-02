import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import SafeAvatar from '../shared/SafeAvatar';
import NotificationBell from './NotificationBell';
import { supabase } from '../../config/supabase';

// Header avatar pill with professional loading state and CSS fallback
function UserAvatar({ avatarUrl, name }: { avatarUrl?: string | null; name: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'MK';

  return (
    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white font-semibold shadow-lg">
      <span className="text-sm">{initials}</span>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Profile"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          className={`absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

export default function Header() {
  const { user, loading } = useAuth();
  const { currentUser: userProfile } = useUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stableAvatarUrl, setStableAvatarUrl] = useState<string | null>(() => {
    return localStorage.getItem('user_avatar_cache');
  });
  const [stableDisplayName, setStableDisplayName] = useState<string>(() => {
    return localStorage.getItem('user_name_cache') || 'User';
  });

  // CRITICAL FIX: Lock avatar_url into highly stable state using Supabase auth listeners
  // This prevents avatar from disappearing when auth session is unstable
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (currentUser?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', currentUser.id)
          .single();

        if (data) {
          if (data.avatar_url) {
            setStableAvatarUrl(data.avatar_url);
            localStorage.setItem('user_avatar_cache', data.avatar_url);
          }
          if (data.full_name) {
            setStableDisplayName(data.full_name);
            localStorage.setItem('user_name_cache', data.full_name);
          }
        } else {
          // Fallback to user metadata if profile fetch fails
          const avatar = currentUser.user_metadata?.avatar_url || null;
          const name = currentUser.email?.split('@')[0] || 'User';
          setStableAvatarUrl(avatar);
          setStableDisplayName(name);
        }
      } else {
        setStableAvatarUrl(null);
        setStableDisplayName('User');
      }
    };

    fetchUserProfile();

    // Set up a listener so if the session changes, it updates smoothly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile();
      } else {
        setStableAvatarUrl(null);
        setStableDisplayName('User');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    // Clear cached avatar and name on logout
    localStorage.removeItem('user_avatar_cache');
    localStorage.removeItem('user_name_cache');
    setStableAvatarUrl(null);
    setStableDisplayName('User');
    
    // This will be handled by the parent component
    const event = new CustomEvent('openLogoutModal');
    window.dispatchEvent(event);
  };

  // Use stable state to prevent avatar from disappearing
  const displayName = stableDisplayName || userProfile?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = stableAvatarUrl || userProfile?.avatar_url;

  return (
    <>
      <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
        {/* Logo/Brand - Empty */}
        <div className="flex items-center">
        </div>

        {/* User Actions - Responsive Layout */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Mobile Header - Menu + Auth Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Mobile Auth Buttons - Always visible when logged out */}
            {!user && (
              <>
                <Link 
                  to="/login"
                  className="text-xs font-medium text-gray-300 hover:text-white px-2 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-medium px-2 py-1.5 rounded-lg transition-all duration-200 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Desktop Header - Auth Buttons when logged out */}
          <div className="hidden lg:flex items-center gap-2">
            {!user ? (
              <>
                <Link 
                  to="/login"
                  className="text-sm md:text-base font-medium text-gray-300 hover:text-white px-3 py-1.5 md:px-4 md:py-2 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm md:text-base font-medium px-3 py-1.5 md:px-6 md:py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="h-10 flex items-center gap-2 group pl-1 pr-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <UserAvatar
                    avatarUrl={avatarUrl}
                    name={displayName}
                  />
                  <span className="text-sm font-medium text-gray-200 leading-none">
                    {displayName}
                  </span>
                </Link>
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full h-10 w-10 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-slate-900/95 backdrop-blur-xl w-80 max-w-[85vw] h-full border-r border-slate-700/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-white font-bold text-xl">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="mb-8 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200 text-center font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white transition-all duration-200 text-center font-medium shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              <nav className="space-y-2">
                <Link
                  to="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  Explore
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  How It Works
                </Link>
                {user && (
                  <>
                    <Link
                      to="/chat"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                    >
                      Chat
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
