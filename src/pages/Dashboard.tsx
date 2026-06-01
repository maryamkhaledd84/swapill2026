import { useState, useEffect } from "react";

import { Plus, BookOpen, MessageCircle, UserPlus, TrendingUp, Settings, ChevronRight, Edit, User, Trash2 } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from 'react-hot-toast';

import { supabase } from '../config/supabase';

import { useAuth } from '../contexts/AuthContext';

import { useUserProfile } from '../contexts/UserProfileContext.tsx';

import { getAvatarGradient, getInitials } from '../utils/avatarColor';

import SafeAvatar from '../components/shared/SafeAvatar';



interface UserProfile {

  name: string;

  email: string;

  bio: string;

  location: string;

  joinDate: string;

  avatar_url?: string;

  skills: any[];

  endorsements: number;

  exchanges: number;

  trustScore: number;

}



export default function Dashboard() {

  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const { currentUser, loading: profileLoading, updateProfile } = useUserProfile();

  const [pendingCount, setPendingCount] = useState<number>(0);

  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {

    if (!user?.id) return;

    let cancelled = false;

    const loadStats = async () => {

      const [pending, sent] = await Promise.all([

        supabase

          .from('swap_requests')

          .select('id', { count: 'exact', head: true })

          .eq('receiver_id', user.id)

          .eq('status', 'pending'),

        supabase

          .from('messages')

          .select('id', { count: 'exact', head: true })

          .eq('sender_id', user.id),

      ]);

      if (cancelled) return;

      setPendingCount(pending.count || 0);

      setMessageCount(sent.count || 0);

    };

    loadStats();

    return () => {

      cancelled = true;

    };

  }, [user?.id]);



  const handleDeleteSkill = async (skillId: string) => {

    try {

      if (!user?.id) {

        toast.error('User not authenticated');

        return;

      }

      

      const { error } = await supabase

        .from('skills')

        .delete()

        .eq('id', skillId)

        .eq('user_id', user.id);



      if (error) {

        console.error('Error deleting skill:', error);

        toast.error('Failed to delete skill');

        return;

      }



      toast.success('Skill deleted successfully!');

      

      // Refresh skills from database

      const { data: refreshedSkills, error: refreshError } = await supabase

        .from('skills')

        .select('*')

        .eq('user_id', user.id)

        .order('created_at', { ascending: false });



      if (refreshError) {

        console.error('Error refreshing skills:', refreshError);

        return;

      }



      // Update user state with refreshed skills

      updateProfile({ skills: refreshedSkills || [] });

      

    } catch (error) {

      console.error('Error in handleDeleteSkill:', error);

      toast.error('An error occurred while deleting the skill');

    }

  };



  const handleEditSkill = (skill: any) => {

    if (!user?.id) {

      toast.error('User not authenticated. Please refresh the page.');

      return;

    }

    // Navigate to profile page with skill context for editing

    navigate('/profile', { state: { userId: user.id, editingSkill: skill } });

  };



  const handleAddSkill = () => {

    if (!user?.id) {

      toast.error('User not authenticated. Please refresh the page.');

      return;

    }

    // Navigate to profile page with user context

    navigate('/profile', { state: { userId: user.id } });

  };



  const getAvatarDisplay = () => {

    if (!currentUser) return null;

    return (

      <div className="flex justify-center">

        <SafeAvatar name={currentUser.name} src={currentUser.avatar_url} size={88} />

      </div>

    );

  };



  if (profileLoading || authLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center max-w-md mx-auto px-6">

          {/* Loading Skeleton */}

          <div className="mb-8">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/20 ring-4 ring-purple-500/10 p-1 bg-slate-800 shadow-xl mx-auto mb-6 animate-pulse">

              <div className="w-full h-full rounded-full bg-slate-700/50"></div>

            </div>

            <div className="space-y-3">

              <div className="h-6 bg-slate-700/50 rounded-lg mx-auto w-32 animate-pulse"></div>

              <div className="h-4 bg-slate-700/30 rounded-lg mx-auto w-48 animate-pulse"></div>

            </div>

          </div>

          

          {/* Loading Spinner */}

          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

          

          {/* Loading Text */}

          <div className="text-white text-lg font-medium mb-2">

            {authLoading ? 'Initializing authentication...' : 'Loading your profile...'}

          </div>

          <div className="text-slate-400 text-sm">

            {authLoading ? 'Please wait while we establish your session' : 'Fetching your profile data'}

          </div>

          

          {/* Progress indicator */}

          <div className="mt-6 w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">

            <div className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>

          </div>

        </div>

      </div>

    );

  }



  if (!currentUser) {

    return null; // Will redirect to login

  }



  return (

    <div className="pt-4 pb-16 max-w-7xl mx-auto px-4 md:px-6">

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Profile Card Sidebar */}

        <aside className="lg:w-72 space-y-4">

          <div className="glass-card p-6 bg-gradient-to-br from-purple-500/5 to-transparent text-center">

            <div className="mb-4">

              {getAvatarDisplay()}

            </div>

            <h2 className="text-lg font-bold mb-0.5 truncate">{currentUser.name}</h2>

            <p className="text-slate-400 text-xs mb-4 truncate">{currentUser.location || 'Location not set'}</p>

            {(currentUser.skills?.length ?? 0) > 0 && (

              <div className="mb-5 flex flex-wrap justify-center gap-1.5">

                {(currentUser.skills || []).slice(0, 6).map((skill: any, index: number) => (

                  <span

                    key={skill.id || index}

                    className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[11px] rounded-full border border-purple-500/30"

                  >

                    {skill.title}

                  </span>

                ))}

                {(currentUser.skills?.length || 0) > 6 && (

                  <span className="px-2.5 py-0.5 text-[11px] text-slate-400">

                    +{(currentUser.skills?.length || 0) - 6}

                  </span>

                )}

              </div>

            )}

            <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">

               <div>

                  <div className="text-base font-bold text-white">{currentUser.exchanges ?? 0}</div>

                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Swaps</div>

               </div>

               <div>

                  <div className="text-base font-bold text-white">{(currentUser.trustScore ?? 0) > 0 ? (currentUser.trustScore as number).toFixed(1) : 'N/A'}</div>

                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Rating</div>

               </div>

            </div>

          </div>

          <div className="glass-card p-3 space-y-1">

             <button

                onClick={() => navigate('/dashboard')}

                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-purple-500/10 text-purple-400 font-medium text-sm"

             >

                <div className="flex items-center gap-3">

                   <TrendingUp className="w-4 h-4" />

                   Overview

                </div>

                <ChevronRight className="w-4 h-4" />

             </button>

             <button

                onClick={() => navigate('/profile')}

                className="w-full flex items-center justify-between p-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm"

             >

                <div className="flex items-center gap-3">

                   <Settings className="w-4 h-4" />

                   Edit Profile

                </div>

                <ChevronRight className="w-4 h-4" />

             </button>

          </div>

        </aside>



        {/* Main Content */}

        <div className="flex-grow space-y-6 min-w-0">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

             <div className="glass-card p-5 bg-gradient-to-br from-purple-500/5 to-transparent">

                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">

                   <BookOpen className="w-4 h-4" />

                </div>

                <div className="text-xl font-bold">{currentUser?.exchanges ?? 0}</div>

                <div className="text-xs text-slate-400 mt-0.5">Lessons Taught</div>

             </div>

             <button

                onClick={() => navigate('/chat')}

                className="glass-card p-5 bg-gradient-to-br from-blue-500/5 to-transparent text-left hover:from-blue-500/10 transition-colors"

             >

                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">

                   <MessageCircle className="w-4 h-4" />

                </div>

                <div className="text-xl font-bold">{messageCount}</div>

                <div className="text-xs text-slate-400 mt-0.5">Messages Sent</div>

             </button>

             <button

                onClick={() => navigate('/requests')}

                className="glass-card p-5 bg-gradient-to-br from-green-500/5 to-transparent text-left hover:from-green-500/10 transition-colors"

             >

                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-3">

                   <UserPlus className="w-4 h-4" />

                </div>

                <div className="text-xl font-bold">{pendingCount}</div>

                <div className="text-xs text-slate-400 mt-0.5">Pending Requests</div>

             </button>

          </div>

          <div className="glass-card p-6">

            <div className="flex items-center justify-between mb-5">

              <h3 className="text-lg font-bold">My Active Skills</h3>

              <button 

                onClick={handleAddSkill}

                className="text-purple-400 text-sm font-bold flex items-center gap-2 hover:underline"

              >

                <Plus className="w-4 h-4" />

                Add New

              </button>

            </div>

            {(currentUser.skills?.length ?? 0) > 0 ? (

              <div className="space-y-3">

                {(currentUser.skills || []).map((skill: any) => (

                  <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group gap-3">

                    <div className="flex items-center gap-3 min-w-0 flex-1">

                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm flex-shrink-0">

                        {skill.title.charAt(0).toUpperCase()}{skill.title.split(' ').length > 1 ? skill.title.split(' ')[1].charAt(0).toUpperCase() : ''}

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="font-semibold text-white group-hover:text-purple-400 transition-colors text-sm truncate">{skill.title}</div>

                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{skill.category}</div>

                        {skill.description && (

                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{skill.description}</div>

                        )}

                      </div>

                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">

                      <button

                        onClick={() => handleEditSkill(skill)}

                        className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-colors"

                        title="Edit skill"

                      >

                         <Edit className="w-3.5 h-3.5" />

                      </button>

                      <button

                        onClick={() => handleDeleteSkill(skill.id)}

                        className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"

                        title="Delete skill"

                      >

                         <Trash2 className="w-3.5 h-3.5" />

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center py-8">

                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3">

                  <Plus className="w-7 h-7 text-purple-400" />

                </div>

                <h4 className="text-base font-semibold text-white mb-1">No skills added yet</h4>

                <p className="text-slate-400 text-sm mb-5">Add your first skill to start swapping expertise</p>

                <button

                  onClick={handleAddSkill}

                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium rounded-lg hover:from-purple-400 hover:to-violet-500 transition-all"

                >

                  <Plus className="w-4 h-4" />

                  Add Your First Skill

                </button>

              </div>

            )}

          </div>

          <div className="glass-card p-6">

            <h3 className="text-lg font-bold mb-5">Recent Activity</h3>

            {(currentUser.exchanges ?? 0) > 0 ? (

              <div className="text-center py-6">

                <div className="text-slate-400 text-sm">Activity will appear here as you start swapping.</div>

              </div>

            ) : (

              <div className="text-center py-6">

                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3">

                  <User className="w-7 h-7 text-purple-400" />

                </div>

                <h4 className="text-base font-semibold text-white mb-1">No recent activity yet</h4>

                <p className="text-slate-400 text-sm mb-5">Start exploring to find a swap partner.</p>

                <Link

                  to="/explore"

                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium rounded-lg hover:from-purple-400 hover:to-violet-500 transition-all"

                >

                  Explore Experts

                </Link>

              </div>

            )}

          </div>



        </div>

      </div>

    </div>

  );

}

