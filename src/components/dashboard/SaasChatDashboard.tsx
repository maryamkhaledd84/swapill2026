import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { 
  Home, 
  Compass, 
  MessageSquare, 
  LayoutDashboard, 
  User, 
  Settings,
  Search,
  Plus,
  Paperclip,
  Smile,
  Sparkles,
  Mic,
  Send,
  Phone,
  Video,
  MoreVertical,
  File,
  Clock,
  Check,
  CheckCheck,
  Circle
} from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  active?: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
  seen?: boolean;
}

const SaasChatDashboard: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeNav, setActiveNav] = useState('chat');
  
  // Get real profile data
  const { user } = useAuth();
  const { currentUser, loading: profileLoading } = useUserProfile();

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      profession: 'Product Designer',
      avatar: 'SC',
      lastMessage: 'Hey! Are you available for a quick call?',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      active: true
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      profession: 'Full Stack Developer',
      avatar: 'MJ',
      lastMessage: 'The new design looks amazing! 🎨',
      timestamp: '15 min ago',
      unread: 0,
      online: true
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      profession: 'Marketing Lead',
      avatar: 'ER',
      lastMessage: 'Can we schedule the sync for tomorrow?',
      timestamp: '1 hour ago',
      unread: 1,
      online: false
    },
    {
      id: '4',
      name: 'Alex Kim',
      profession: 'Data Scientist',
      avatar: 'AK',
      lastMessage: 'Thanks for the feedback!',
      timestamp: '3 hours ago',
      unread: 0,
      online: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hey! Are you available for a quick call?',
      timestamp: '10:30 AM',
      sender: 'them'
    },
    {
      id: '2',
      text: 'Sure! What time works for you?',
      timestamp: '10:32 AM',
      sender: 'me',
      seen: true
    },
    {
      id: '3',
      text: 'How about in 30 minutes?',
      timestamp: '10:33 AM',
      sender: 'them'
    },
    {
      id: '4',
      text: 'Perfect, talk to you then! 👍',
      timestamp: '10:34 AM',
      sender: 'me',
      seen: true
    }
  ];

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation) || conversations[0];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#070B14] via-[#0B1120] to-[#111827] overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-indigo-900/10 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
      
      <div className="relative h-full flex">
        {/* LEFT SIDEBAR */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-16 bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-6 gap-6"
        >
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25"
          >
            <span className="text-white font-bold text-lg">S</span>
          </motion.div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col gap-3">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveNav(item.id)}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeNav === item.id 
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {activeNav === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-400 to-indigo-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
          >
            <span className="text-white font-semibold text-sm">MK</span>
          </motion.div>
        </motion.div>

        {/* CONVERSATION LIST PANEL */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-80 bg-black/10 backdrop-blur-md border-r border-white/5 flex flex-col"
        >
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* New Message Button */}
          <div className="px-4 pb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Message
            </motion.button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent</h3>
            </div>
            <div className="space-y-1 px-2">
              {filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`relative p-3 rounded-xl cursor-pointer transition-all ${
                    selectedConversation === conv.id || (conv.active && !selectedConversation)
                      ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{conv.avatar}</span>
                      </div>
                      {conv.online && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B1120]"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium truncate">{conv.name}</h4>
                        <span className="text-xs text-gray-400">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate mb-1">{conv.profession}</p>
                      <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>

                    {/* Unread Badge */}
                    {conv.unread && conv.unread > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-medium">{conv.unread}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* MAIN CHAT AREA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col bg-black/10 backdrop-blur-sm"
        >
          {/* Chat Header */}
          <div className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{selectedConv?.avatar}</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B1120]"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{selectedConv?.name}</h3>
                  <p className="text-xs text-green-400">Active now</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <Video className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                      message.sender === 'me'
                        ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                        : 'bg-black/30 backdrop-blur-sm border border-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      message.sender === 'me' ? 'text-violet-200' : 'text-gray-400'
                    }`}>
                      <span>{message.timestamp}</span>
                      {message.sender === 'me' && (
                        <span>{message.seen ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}</span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-black/30 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-2xl">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.1
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Paperclip className="w-4 h-4" />
                </motion.button>

                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none text-sm"
                  rows={1}
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Smile className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 flex items-center justify-center text-white transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 flex items-center justify-center text-white transition-all"
                >
                  <Mic className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 flex items-center justify-center text-white transition-all shadow-lg shadow-violet-500/25"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT INFO PANEL */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-80 bg-black/10 backdrop-blur-md border-l border-white/5 flex flex-col"
        >
          {/* User Details */}
          <div className="p-6 border-b border-white/5">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">{selectedConv?.avatar}</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-1">{selectedConv?.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{selectedConv?.profession}</p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Circle className="w-2 h-2 fill-current" />
                <span>Active now</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-white/5">
            <h4 className="text-sm font-medium text-white mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm text-gray-300 hover:text-white transition-all flex items-center gap-3"
              >
                <Phone className="w-4 h-4" />
                Voice Call
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm text-gray-300 hover:text-white transition-all flex items-center gap-3"
              >
                <Video className="w-4 h-4" />
                Video Call
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm text-gray-300 hover:text-white transition-all flex items-center gap-3"
              >
                <User className="w-4 h-4" />
                View Profile
              </motion.button>
            </div>
          </div>

          {/* Shared Files */}
          <div className="p-6 border-b border-white/5">
            <h4 className="text-sm font-medium text-white mb-4">Shared Files</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">design-mockup.fig</p>
                  <p className="text-xs text-gray-400">2.4 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">project-plan.pdf</p>
                  <p className="text-xs text-gray-400">1.2 MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="flex-1 p-6">
            <h4 className="text-sm font-medium text-white mb-4">Activity</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-gray-400">Online</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-gray-400">Message sent</p>
                  <p className="text-xs text-gray-500">2 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-1.5" />
                <div>
                  <p className="text-xs text-gray-400">File shared</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SaasChatDashboard;
