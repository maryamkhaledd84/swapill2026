import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import GlobalSidebar from './GlobalSidebar';
import Header from './Header';
import LogoutModal from '../shared/LogoutModal';
import SafeAvatar from '../shared/SafeAvatar';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';

interface MainLayoutProps {
  children: React.ReactNode;
  conversationsCount?: number;
}

export default function MainLayout({ children, conversationsCount }: MainLayoutProps) {
  const location = useLocation();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [localConversationsCount, setLocalConversationsCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { currentUser: userProfile, loading: profileLoading } = useUserProfile();

  // Listen for logout modal events and conversations count updates
  useEffect(() => {
    const handleOpenLogoutModal = () => {
      setLogoutModalOpen(true);
    };

    const handleUpdateConversationsCount = (event: any) => {
      setLocalConversationsCount(event.detail);
    };

    window.addEventListener('openLogoutModal', handleOpenLogoutModal);
    window.addEventListener('updateConversationsCount', handleUpdateConversationsCount);
    
    return () => {
      window.removeEventListener('openLogoutModal', handleOpenLogoutModal);
      window.removeEventListener('updateConversationsCount', handleUpdateConversationsCount);
    };
  }, []);

  const isChatPage = location.pathname === '/chat';
  
  // Show loading state if auth or profile is still loading
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0f172a]">
      {/* Mobile Header - Only shows on small screens */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 relative z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-white font-semibold">Menu</span>
        </div>
        
        {/* User Avatar in Mobile Header */}
        <div className="flex items-center gap-3">
          {user && (
            <Link to="/profile" className="flex items-center gap-2 group">
              <SafeAvatar
                src={userProfile?.avatar_url}
                name={userProfile?.name || user.email?.split('@')[0] || 'User'}
                size={32}
              />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Overlay - Handled in GlobalSidebar component */}
      
      {/* Global Sidebar - Hidden on mobile, visible on desktop */}
      <GlobalSidebar 
        setIsLogoutModalOpen={setLogoutModalOpen}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative z-0">
        {/* Desktop Header - Only shows on large screens */}
        <header className="hidden lg:block relative z-10">
          <Header />
        </header>
        
        {/* Page Content. Chat manages its own scroll regions internally so we
            disable the page-level scroll there and pin the chat header. */}
        <main className={`flex-1 w-full relative z-0 min-h-0 ${
          isChatPage
            ? 'p-0 overflow-hidden'
            : 'p-4 overflow-y-auto'
        }`}>
          {children}
        </main>
      </div>

      {/* Global Logout Modal */}
      <LogoutModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </div>
  );
}
