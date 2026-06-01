import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MapPin, MessageCircle, Send, User, Award, Globe, Share2 } from 'lucide-react';
import { shareOrCopy, profileShareUrl } from '../utils/share';
import { usePresence, isOnline } from '../hooks/usePresence';
import { getAvatarGradient } from '../utils/avatarColor';

interface UserSkill {
  title: string;
  category?: string;
}

interface UserProfile {
  id: string;
  name: string;
  initials: string;
  avatar_url?: string | null;
  bio?: string;
  skills?: UserSkill[];
  rating?: number;
  swaps?: number;
  topSkill?: {
    title: string;
    category: string;
    icon?: any;
  };
  availability?: 'online' | 'offline';
  location?: string;
  joined_date?: string;
  requestSent?: boolean;
}

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  currentUser: any;
  onRequestSwap: (user: UserProfile) => void;
  onEditProfile?: () => void;
  onMessage?: (userId: string) => void;
  friends?: string[];
}

// Modern Avatar Component
function ModernAvatar({ name, size = "medium", avatarUrl }: {
  name: string;
  size?: "small" | "medium" | "large";
  avatarUrl?: string | null;
}) {
  const safeName = name || 'Member';
  const initials = safeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const sizeClasses = {
    small: "w-16 h-16 text-xl",
    medium: "w-20 h-20 text-2xl",
    large: "w-24 h-24 text-3xl",
  };
  const color = getAvatarGradient(safeName);

  const isDicebear = !!avatarUrl && avatarUrl.includes('dicebear.com');
  const showImage = !!avatarUrl && !isDicebear;

  if (showImage) {
    return (
      <div className={`rounded-full overflow-hidden border border-white/20 ${sizeClasses[size]}`}>
        <img
          src={avatarUrl!}
          alt={safeName}
          className="w-full h-full object-cover rounded-full aspect-square"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.initials-fallback')) {
              const fallback = document.createElement('div');
              fallback.className = `initials-fallback absolute inset-0 flex items-center justify-center rounded-full text-white font-semibold ${sizeClasses[size]} bg-gradient-to-br ${color}`;
              fallback.textContent = initials;
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-semibold border border-white/20 ${sizeClasses[size]}`}>
      {initials}
    </div>
  );
}

export default function ProfilePreviewModal({ isOpen, onClose, user, currentUser, onRequestSwap, onEditProfile, onMessage, friends = [] }: ProfilePreviewModalProps) {
  const [isLoading] = React.useState(false);
  const onlineIds = usePresence(currentUser?.id);

  if (!user) return null;

  const userOnline = isOnline(onlineIds, user.id);
  const isOwnProfile = currentUser && user.id === currentUser.id;
  const requestSent = user.requestSent || false;
  const isFriend = friends.includes(user.id);

  const handleShare = () => {
    shareOrCopy({
      url: profileShareUrl(user.id),
      title: `${user.name} on Swapill`,
      text: `Check out ${user.name}'s profile on Swapill`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#334155] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600/20 to-violet-600/20 p-6 border-b border-[#334155]">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  title="Share profile"
                  className="p-2 rounded-lg bg-[#0f172a]/50 hover:bg-[#0f172a] text-gray-400 hover:text-white transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  title="Close"
                  className="p-2 rounded-lg bg-[#0f172a]/50 hover:bg-[#0f172a] text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-6">
                {/* Profile Image */}
                <div className="relative inline-block">
                  <ModernAvatar
                    name={user.name}
                    size="large"
                    avatarUrl={user.avatar_url}
                  />
                  <div
                    className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-[#1e293b] ${userOnline ? 'bg-green-500' : 'bg-slate-500'}`}
                    title={userOnline ? 'Online' : 'Offline'}
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>

                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {(user.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-white font-medium">{user.rating!.toFixed(1)}</span>
                        {(user.swaps ?? 0) > 0 && (
                          <span className="text-gray-400">({user.swaps} swaps)</span>
                        )}
                      </div>
                    )}

                    <div className={`flex items-center gap-1 ${userOnline ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${userOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                      <span className="text-sm">{userOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio */}
                  {user.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" />
                        About
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                          >
                            {skill.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Skill */}
                  {user.topSkill && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        Main Skill
                      </h3>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg">
                        {user.topSkill.icon && (
                          <user.topSkill.icon className="w-5 h-5 text-white" />
                        )}
                        <span className="text-white font-medium">{user.topSkill.title}</span>
                      </div>
                    </div>
                  )}

                  {/* Skill categories */}
                  {(() => {
                    const categories = Array.from(
                      new Set(
                        (user.skills || [])
                          .map(s => s.category)
                          .filter((c): c is string => Boolean(c)),
                      ),
                    );
                    if (categories.length === 0) return null;
                    return (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-purple-400" />
                          Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#334155] rounded-lg text-gray-300 text-sm capitalize"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Column - Stats & Actions */}
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="bg-[#0f172a] rounded-xl p-4 border border-[#334155]">
                    <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Swaps</span>
                        <span className="text-white font-medium">{user.swaps ?? 0}</span>
                      </div>
                      {(user.rating ?? 0) > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white font-medium">{user.rating!.toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                      {user.joined_date && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Joined</span>
                          <span className="text-white font-medium">
                            {new Date(user.joined_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Location</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-medium">{user.location}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {isOwnProfile ? (
                      <>
                        <button
                          onClick={onEditProfile}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                          <User className="w-5 h-5" />
                          My Profile
                        </button>
                      </>
                    ) : (
                      <>
                        {isFriend ? (
                          <button
                            onClick={() => onMessage && onMessage(user.id)}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Message
                          </button>
                        ) : (
                          <button
                            onClick={() => onRequestSwap(user)}
                            disabled={requestSent || isLoading}
                            className={`w-full py-3 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 ${
                              requestSent 
                                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white'
                            }`}
                          >
                            <Send className="w-5 h-5" />
                            {requestSent ? 'Request Sent' : 'Request Swap'}
                          </button>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={onClose}
                      className="w-full py-3 bg-[#334155] hover:bg-[#475569] text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
