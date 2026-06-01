import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, LayoutDashboard, Compass, Info, User, LogOut, Menu, X, Loader2, Bell } from "lucide-react";
import { cn } from "../../lib/utils";
import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../contexts/UserProfileContext.tsx";
import toast from 'react-hot-toast';
import IncomingRequests from "../IncomingRequests";

// Modern Avatar Component for Navbar - Blocks dicebear URLs
function UserAvatar({ avatarUrl, name, size = "small" }: { avatarUrl?: string; name: string; size?: "small" | "medium" }) {
  const sizeClasses = {
    small: "w-8 h-8 text-xs",
    medium: "w-10 h-10 text-sm"
  };
  
  // Get first two letters of name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  // Professional calm colors for Navbar
  const getAvatarColor = (userName: string) => {
    const colors = [
      'from-slate-600 to-slate-700', 
      'from-gray-600 to-gray-700', 
      'from-neutral-600 to-neutral-700', 
      'from-stone-600 to-stone-700',
      'from-zinc-600 to-zinc-700'
    ];
    const color = colors[userName ? userName.charCodeAt(0) % colors.length : 0];
    return color;
  };
  
  // Handle image errors with fallback to initials
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to initials circle
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent && !parent.querySelector('.fallback-circle')) {
      const fallback = document.createElement('div');
      fallback.className = `fallback-circle absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(name)} rounded-full text-white font-semibold ${sizeClasses[size]}`;
      fallback.textContent = getInitials(name);
      parent.appendChild(fallback);
    }
  };
  
  // Handle image load success
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.opacity = '1';
  };
  
  // BLOCK dicebear URLs and show colored initials instead
  if (avatarUrl && avatarUrl.includes('dicebear.com')) {
    return (
      <div className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center border-2 border-white/20",
        getAvatarColor(name),
        sizeClasses[size]
      )}>
        <span className="text-white font-semibold">{getInitials(name)}</span>
      </div>
    );
  }
  
  // Show real photo only if it's NOT a dicebear URL
  if (avatarUrl && !avatarUrl.includes('dicebear.com')) {
    return (
      <div className="relative">
        <img 
          src={avatarUrl}
          alt={name}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
          className={cn(
            "rounded-full object-cover border-2 border-white/20",
            sizeClasses[size].split(' ')[0] + ' ' + sizeClasses[size].split(' ')[1] // Get only w/h classes
          )}
        />
      </div>
    );
  }
  
  // Default to professional circle with initials
  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br flex items-center justify-center border-2 border-white/20",
      getAvatarColor(name),
      sizeClasses[size]
    )}>
      <span className="text-white font-semibold">{getInitials(name)}</span>
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { currentUser: userProfile } = useUserProfile();
  const [isScrolled, setIsScrolled] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // All hooks are now defined at the top before any conditional logic

  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch pending requests count
  useEffect(() => {
    const fetchPendingRequestsCount = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('swap_requests')
          .select('id')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (error) {
          console.error('Error fetching pending requests count:', error);
        } else {
          setPendingRequestsCount(data?.length || 0);
        }
      } catch (error) {
        console.error('Error in fetchPendingRequestsCount:', error);
      }
    };

    fetchPendingRequestsCount();

    // Set up real-time subscription for new requests
    const channel = supabase
      .channel('swap_requests')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'swap_requests',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        fetchPendingRequestsCount(); // Refetch count on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

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
      
      
      setLogoutModalOpen(false);
            
      // Clear any localStorage data
      localStorage.removeItem('swapill_user');
      
      // Force navigation to login page
      window.location.replace('/login');
      
      toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast.error('An error occurred during logout');
      
      // Still try to clean up and redirect on error
      setLogoutModalOpen(false);
            localStorage.removeItem('swapill_user');
      window.location.replace('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    if (!isLoggingOut) {
      setLogoutModalOpen(false);
    }
  };

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass, requiresAuth: false },
    { name: 'Profile', path: '/profile', icon: User, requiresAuth: true },
    { name: 'Chat', path: '/chat', icon: MessageSquare, requiresAuth: true }
  ];

  // Conditionally render Navbar only when not on chat page
  if (location.pathname !== '/chat') {
    return (
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-3",
          isScrolled ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-2" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isDisabled = link.requiresAuth && !user;
              return (
                <div key={link.path}>
                  {isDisabled ? (
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-not-allowed">
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </span>
                  ) : (
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
                        location.pathname === link.path ? "text-white" : "text-slate-400"
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 group p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <UserAvatar 
                    avatarUrl={userProfile?.avatar_url} 
                    name={userProfile?.name || user.email?.split('@')[0] || 'User'} 
                    size="small" 
                  />
                  <span className="text-sm font-medium text-gray-200 hidden sm:block">{userProfile?.name || user.email?.split('@')[0]}</span>
                </Link>
                
                {/* Notification Bell */}
                <button
                  onClick={() => setRequestsModalOpen(true)}
                  className="relative p-2 rounded-full h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-400 transition-all"
                  title="Incoming Requests"
                >
                  <Bell className="w-5 h-5" />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full h-10 w-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="btn-primary text-sm px-6 py-2"
                >
                  Sign Up
                </button>
              </div>
            )}
            <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Return the logout modal for all pages except chat
  return (
    <>
      {/* Incoming Requests Modal */}
      <IncomingRequests 
        isOpen={requestsModalOpen} 
        onClose={() => setRequestsModalOpen(false)} 
      />
      
      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
          onClick={cancelLogout}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            {!isLoggingOut && (
              <button
                onClick={cancelLogout}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
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
                {isLoggingOut ? 'Logging out...' : 'Do you want to log out?'}
              </h3>
              
              <p className="text-gray-300 mb-8">
                {isLoggingOut 
                  ? 'Please wait while we sign you out securely...'
                  : 'You can always come back and continue your skill swapping journey.'
                }
              </p>

              {/* Loading spinner or buttons */}
              {isLoggingOut ? (
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={cancelLogout}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-400 hover:to-orange-500 transition-all font-medium shadow-lg shadow-red-500/25"
                  >
                    Yes, Log Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </>
  );
}

