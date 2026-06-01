import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import SafeAvatar from '../shared/SafeAvatar';
import NotificationBell from './NotificationBell';

// Header avatar pill uses the shared SafeAvatar (auto fallback to initials)
function UserAvatar({ avatarUrl, name }: { avatarUrl?: string | null; name: string }) {
  return <SafeAvatar name={name} src={avatarUrl} size={36} />;
}

export default function Header() {
  const { user, loading } = useAuth();
  const { currentUser: userProfile } = useUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // This will be handled by the parent component
    const event = new CustomEvent('openLogoutModal');
    window.dispatchEvent(event);
  };

  const displayName = userProfile?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = userProfile?.avatar_url;

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
