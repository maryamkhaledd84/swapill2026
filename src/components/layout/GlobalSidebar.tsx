import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Compass,
  Info,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  Home,
  LogIn,
  User,
  UserPlus,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  requiresAuth?: boolean;
  badgeKey?: 'requests' | 'unread';
}

interface GlobalSidebarProps {
  setIsLogoutModalOpen: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function GlobalSidebar({ setIsLogoutModalOpen, isOpen, onClose }: GlobalSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  // Skip toasts on the very first load (we only want to notify on *new* events)
  const initializedRef = useRef(false);
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    if (!user?.id) {
      setPendingRequests(0);
      setUnreadMessages(0);
      initializedRef.current = false;
      return;
    }
    let cancelled = false;

    const refresh = async () => {
      const [pending, unread] = await Promise.all([
        supabase
          .from('swap_requests')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('status', 'pending'),
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('is_read', false)
          .neq('sender_id', user.id),
      ]);
      if (cancelled) return;
      setPendingRequests(pending.count || 0);
      setUnreadMessages(unread.count || 0);
      initializedRef.current = true;
    };

    refresh();

    const channel = supabase
      .channel(`sidebar-counters-${user.id}`)
      // Toast on a brand-new INSERT to messages addressed to me
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as { sender_id: string; conversation_id: string };
          if (
            initializedRef.current
            && msg.sender_id !== user.id
            && locationRef.current.pathname !== '/chat'
          ) {
            toast('New message', { icon: '💬' });
          }
          refresh();
        },
      )
      // Toast on a brand-new INSERT to swap_requests where I'm the receiver
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'swap_requests' },
        (payload) => {
          const req = payload.new as { receiver_id: string };
          if (
            initializedRef.current
            && req.receiver_id === user.id
            && locationRef.current.pathname !== '/requests'
          ) {
            toast('New swap request', { icon: '🤝' });
          }
          refresh();
        },
      )
      // Other status/read changes still bump the counters but no toast
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'swap_requests' }, refresh)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, refresh)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'swap_requests' }, refresh)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Info, label: 'How It Works', path: '/how-it-works' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', requiresAuth: true, badgeKey: 'unread' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { icon: UserPlus, label: 'Requests', path: '/requests', requiresAuth: true, badgeKey: 'requests' },
    { icon: User, label: 'Profile', path: '/profile', requiresAuth: true },
  ];

  const getBadge = (key?: 'requests' | 'unread'): number => {
    if (!key) return 0;
    if (key === 'requests') return pendingRequests;
    if (key === 'unread') return unreadMessages;
    return 0;
  };


  return (
    <>
      {/* Mobile Sidebar - Only render when open to prevent blocking interactions */}
      {isOpen && (
        <>
          {/* Mobile Sidebar Overlay */}
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
          
          {/* Mobile Sidebar */}
          <nav className="fixed left-0 top-0 h-screen bg-[#0f172a] flex flex-col py-6 border-r border-slate-800 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">Swapill</span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isDisabled = item.requiresAuth && !user;
                const badge = getBadge(item.badgeKey);

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      if (isDisabled) return;
                      navigate(item.path);
                      if (onClose) onClose();
                    }}
                    disabled={isDisabled}
                    className={cn(
                      'relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left',
                      isActive
                        ? 'bg-purple-600/20 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                      isDisabled && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-purple-500 rounded-r-full" />
                    )}
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold flex items-center justify-center">
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Auth Button */}
            <div className="mt-auto">
              {user ? (
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800/50"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left text-slate-400 hover:text-purple-400 hover:bg-slate-800/50"
                >
                  <LogIn className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
            </div>
          </nav>
        </>
      )}
      
      {/* Desktop Sidebar - Always visible on large screens */}
      <nav className="hidden lg:flex lg:relative lg:inset-0 lg:z-auto lg:flex-col lg:py-6 lg:bg-[#0f172a] lg:border-r lg:border-slate-800 lg:w-64">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Swapill</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDisabled = item.requiresAuth && !user;
            const badge = getBadge(item.badgeKey);

            return (
              <button
                key={item.path}
                onClick={() => !isDisabled && navigate(item.path)}
                disabled={isDisabled}
                className={cn(
                  'relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left',
                  isActive
                    ? 'bg-purple-600/20 text-white font-semibold border-l-4 border-purple-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold flex items-center justify-center">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Auth Button */}
        <div className="mt-auto">
          {user ? (
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800/50"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left text-slate-400 hover:text-purple-400 hover:bg-slate-800/50"
            >
              <LogIn className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Login</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
