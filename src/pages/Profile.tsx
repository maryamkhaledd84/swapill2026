import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { motion, AnimatePresence } from 'motion/react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { Camera, Edit2, Save, X, Star, MapPin, Calendar, Award, Users, TrendingUp, Check, ChevronLeft, Upload, Code, Smartphone, Palette, Globe, PenTool, Music, ChefHat, Sparkles, Mic, Kanban, Plus, User, ShieldCheck, Share2, MessageSquare, Mail, ChevronDown, Trash2, MessageCircle } from 'lucide-react';

import { supabase } from '../config/supabase';

import toast from 'react-hot-toast';

import { useAuth } from '../contexts/AuthContext';

import { useUserProfile } from '../contexts/UserProfileContext.tsx';

import { getAvatarGradient, getInitials as getSharedInitials } from '../utils/avatarColor';

import { shareOrCopy, profileShareUrl } from '../utils/share';



interface UserProfile {

  id: string;

  name: string;

  email: string;

  bio: string;

  location: string;

  joinDate: string;

  avatar_url?: string | null;

  skills: any[];

  endorsements: number;

  exchanges: number;

  trustScore: number;

}



// Skill Categories with icons

const SKILL_CATEGORIES = [

  { id: 'web', name: 'Web Development', icon: Code },

  { id: 'mobile', name: 'Mobile Development', icon: Smartphone },

  { id: 'design', name: 'Design', icon: Palette },

  { id: 'marketing', name: 'Marketing', icon: TrendingUp },

  { id: 'languages', name: 'Languages', icon: Globe },

  { id: 'writing', name: 'Writing Skills', icon: PenTool },

  { id: 'music', name: 'Music', icon: Music },

  { id: 'cooking', name: 'Cooking', icon: ChefHat },

  { id: 'prompt', name: 'Prompt Engineering', icon: Sparkles },

  { id: 'photography', name: 'Photography', icon: Camera },

  { id: 'speaking', name: 'Public Speaking', icon: Mic },

  { id: 'management', name: 'Project Management', icon: Kanban },

];



export default function Profile() {

  const { user, loading, isInitialLoading } = useAuth();

  const { currentUser, loading: profileLoading, updateProfile, refreshProfile, setCurrentUser, setLoading } = useUserProfile();

  const { id: profileId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [skills, setSkills] = useState<any[]>([]);

  const [avatarLoading, setAvatarLoading] = useState(false);

  const [skillLoading, setSkillLoading] = useState(false);

  const [profileSaveLoading, setProfileSaveLoading] = useState(false);

  const [showSkillModal, setShowSkillModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({

    bio: '',

    location: ''

  });

  const [skillForm, setSkillForm] = useState({

    title: '',

    description: '',

    category: 'web'

  });

  const [editingSkill, setEditingSkill] = useState<any>(null);

  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const coverMenuRef = useRef<HTMLDivElement>(null);

  const [coverLoading, setCoverLoading] = useState(false);

  const [showCoverMenu, setShowCoverMenu] = useState(false);

  const [targetProfile, setTargetProfile] = useState<any>(null);

  const [isFetching, setIsFetching] = useState(false);

  const [targetProfileLoading, setTargetProfileLoading] = useState(false);

  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const [showOptimisticUI, setShowOptimisticUI] = useState(false);



  // Avatar color + initials use shared utils so the same person gets the
  // same color across Header, Chat, Explore, Modal and Profile.

  const getAvatarColor = getAvatarGradient;

  const getInitials = getSharedInitials;



  // Memoized refresh function to prevent unnecessary calls

  const handleRefreshProfile = useCallback(async () => {

    if (isFetching || !user?.id) return;

    

    setIsFetching(true);

    try {

      await refreshProfile();


    } catch (error) {

      console.error('Profile refresh error:', error);

    } finally {

      setIsFetching(false);

    }

  }, [isFetching, user?.id]);



  // Unified Profile Fetching with Instant UI using auth.onAuthStateChange

  useEffect(() => {

    let pendingRefresh: ReturnType<typeof setTimeout> | null = null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(

      async (event, session) => {

        if (event === 'SIGNED_IN' && session?.user) {

          const instantProfile = {

            id: session.user.id,

            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',

            email: session.user.email || '',

            bio: 'New member on Swapill',

            location: 'Location not set',

            joinDate: session.user.created_at || new Date().toISOString(),

            avatar_url: session.user.user_metadata?.avatar_url || null,

            skills: [],

            endorsements: 0,

            exchanges: 0,

            trustScore: 0,

          };

          setCurrentUser(instantProfile);

          setLoading(false);

          if (pendingRefresh) clearTimeout(pendingRefresh);

          pendingRefresh = setTimeout(() => {

            pendingRefresh = null;

            refreshProfile();

          }, 100);

        }

      }

    );

    return () => {

      if (pendingRefresh) clearTimeout(pendingRefresh);

      subscription.unsubscribe();

    };

  }, []);



  // Fetch specific profile data when profile ID is provided in URL.
  // Uses a `cancelled` flag so that fast nav between profiles doesn't allow
  // an earlier in-flight fetch to overwrite the newer one's result.

  useEffect(() => {

    let cancelled = false;

    const fetchProfileData = async () => {

      if (!profileId || !user?.id) return;




      

      setTargetProfileLoading(true);

      setIsFetching(true);

      

      try {
        const { data: profileWithSkills, error: fetchError } = await supabase
          .from('profiles')
          .select('*, skills!skills_user_id_fkey(*)')
          .eq('id', String(profileId))
          .maybeSingle();

        if (cancelled) return;

        if (fetchError) {
          console.error('Profile fetch error:', fetchError);
          if (fetchError.code === 'PGRST116') {
            setTargetProfile(null);
          }
          setTargetProfileLoading(false);
          return;
        }

        if (!profileWithSkills) {
          setTargetProfile({ skills: [] });
          setTargetProfileLoading(false);
          return;
        }

        setTargetProfile(profileWithSkills);
      } catch (error) {
        if (cancelled) return;
        console.error('Profile fetch unexpected error:', error instanceof Error ? error.message : String(error));
      } finally {
        if (!cancelled) setTargetProfileLoading(false);
      }
    };

    fetchProfileData();

    return () => {
      cancelled = true;
    };
  }, [profileId, user?.id]);



  

  // Set skills from UserProfileContext when it's available

  useEffect(() => {

    if (currentUser?.skills) {

      setSkills(currentUser.skills);

      setSkillLoading(false);

    }

  }, [currentUser?.skills]);



  // Helper function to get the correct profile data to display

  const getDisplayProfile = () => {

    if (profileId && targetProfile) {

      return targetProfile;

    }

    return currentUser;

  };



  // Helper function to get the correct skills to display

  const getDisplaySkills = () => {

    if (profileId && targetProfile) {

      // Skills are nested in the profile object from the direct query

      return targetProfile?.skills || [];

    }

    return skills || [];

  };



  // Helper function to check if we're viewing our own profile

  const isViewingOwnProfile = () => {

    if (!profileId) return true; // No profile ID means viewing own profile

    return user && user.id === profileId;

  };



  // Close dropdown when clicking outside

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {

        setShowSkillsDropdown(false);

      }

      if (coverMenuRef.current && !coverMenuRef.current.contains(event.target as Node)) {

        setShowCoverMenu(false);

      }

    };



    document.addEventListener('mousedown', handleClickOutside);

    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, []);



  const formatDate = (dateString: string) => {

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  };



  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (!file || !user) return;



    setAvatarLoading(true);

    

    try {




      

      // Upload to Supabase Storage

      const fileExt = file.name.split('.').pop();

      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      


      

      const { error: uploadError, data } = await supabase.storage

        .from('avatars')

        .upload(fileName, file, {

          cacheControl: '3600',

          upsert: false

        });



      if (uploadError) {

        console.error('Storage upload error:', uploadError);

        toast.error(`Failed to upload photo: ${uploadError.message}`);

        return;

      }






      // Get public URL

      const { data: { publicUrl } } = supabase.storage

        .from('avatars')

        .getPublicUrl(fileName);






      // Update profiles table with avatar_url

      const { error: updateError } = await supabase

        .from('profiles')

        .update({ avatar_url: publicUrl })

        .eq('id', user.id);



      if (updateError) {

        console.error('Profile update error:', updateError);

        toast.error(`Failed to update profile: ${updateError.message}`);

        return;

      }






      // Update local state

      updateProfile({ avatar_url: publicUrl });

      

      toast.success('Photo uploaded successfully!');

    } catch (error) {

      console.error('Error in handleImageUpload:', error);

      toast.error('Failed to upload photo');

    } finally {

      setAvatarLoading(false);

      // Reset file input

      if (fileInputRef.current) {

        fileInputRef.current.value = '';

      }

    }

  };



  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {

      toast.error('Please select an image file');

      return;

    }

    if (file.size > 5 * 1024 * 1024) {

      toast.error('Image must be smaller than 5MB');

      return;

    }

    setCoverLoading(true);

    try {

      const fileExt = file.name.split('.').pop();

      const fileName = `${user.id}/cover_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage

        .from('avatars')

        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {

        toast.error(`Failed to upload cover: ${uploadError.message}`);

        return;

      }

      const { data: { publicUrl } } = supabase.storage

        .from('avatars')

        .getPublicUrl(fileName);

      const { error: updateError } = await supabase

        .from('profiles')

        .update({ cover_url: publicUrl })

        .eq('id', user.id);

      if (updateError) {

        toast.error(`Failed to update profile: ${updateError.message}`);

        return;

      }

      updateProfile({ cover_url: publicUrl } as any);

      toast.success('Cover photo updated!');

      setShowCoverMenu(false);

    } catch (error) {

      console.error('Error in handleCoverUpload:', error);

      toast.error('Failed to upload cover photo');

    } finally {

      setCoverLoading(false);

      if (coverFileInputRef.current) coverFileInputRef.current.value = '';

    }

  };



  const handleRemoveCover = async () => {

    if (!user || !currentUser?.cover_url) return;

    setCoverLoading(true);

    try {

      const url = currentUser.cover_url;

      const marker = '/avatars/';

      const idx = url.indexOf(marker);

      const path = idx >= 0 ? url.slice(idx + marker.length) : null;

      if (path) {

        const { error: deleteError } = await supabase.storage.from('avatars').remove([path]);

        if (deleteError) console.error('Storage deletion error:', deleteError);

      }

      const { error: updateError } = await supabase

        .from('profiles')

        .update({ cover_url: null })

        .eq('id', user.id);

      if (updateError) {

        toast.error('Failed to remove cover photo');

        return;

      }

      updateProfile({ cover_url: null } as any);

      toast.success('Cover photo removed');

      setShowCoverMenu(false);

    } catch (error) {

      console.error('Error in handleRemoveCover:', error);

      toast.error('Failed to remove cover photo');

    } finally {

      setCoverLoading(false);

    }

  };



  const handleRemovePhoto = async () => {

    if (!user || !currentUser?.avatar_url) return;



    setAvatarLoading(true);

    

    try {






      // Extract storage path from avatar_url (everything after /avatars/) to delete from storage

      const url = currentUser?.avatar_url || '';

      const marker = '/avatars/';

      const idx = url.indexOf(marker);

      const fileName = idx >= 0 ? url.slice(idx + marker.length) : '';

      




      // Delete file from Supabase Storage

      const { error: deleteError } = await supabase.storage

        .from('avatars')

        .remove([fileName]);



      if (deleteError) {

        console.error('Storage deletion error:', deleteError);

        // Continue with profile update even if storage deletion fails

      } else {


      }



      // Update profiles table to remove avatar_url

      const { error: updateError } = await supabase

        .from('profiles')

        .update({ avatar_url: null })

        .eq('id', user.id);



      if (updateError) {

        console.error('Profile update error:', updateError);

        toast.error('Failed to remove photo');

        return;

      }






      // Update local state

      updateProfile({ avatar_url: null });

      

      toast.success('Photo removed successfully!');

    } catch (error) {

      console.error('Error in handleRemovePhoto:', error);

      toast.error('Failed to remove photo');

    } finally {

      setAvatarLoading(false);

    }

  };



  const handleSaveProfile = async () => {

    if (!user) {

      toast.error('You must be logged in to update your profile');

      return;

    }



    setProfileSaveLoading(true);



    try {

      const newBio = editForm.bio?.trim() || null;

      const newLocation = editForm.location?.trim() || null;



      const { error } = await supabase

        .from('profiles')

        .update({

          bio: newBio,

          location: newLocation,

          updated_at: new Date().toISOString(),

        })

        .eq('id', user.id);



      if (error) {

        console.error('Profile update error:', error);

        toast.error(`Failed to update profile: ${error.message}`);

        return;

      }



      updateProfile({

        bio: newBio || '',

        location: newLocation || '',

      });



      setShowEditModal(false);

      setIsEditing(false);

      toast.success('Profile updated');

    } catch (error) {

      console.error('Profile save error:', error);

      toast.error('Failed to update profile');

    } finally {

      setProfileSaveLoading(false);

    }

  };



  const handleAddSkill = () => {

    setShowSkillModal(true);

  };



  const handleDeleteSkill = async (skillId: string) => {

    if (!user?.id) return;

    try {




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

      setShowSkillsDropdown(false);

      

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



  const handleEditSkillFromDropdown = (skill: any) => {

    setEditingSkill(skill);

    setSkillForm({

      title: skill.title,

      description: skill.description,

      category: skill.category

    });

    setShowSkillsDropdown(false);

    setShowSkillModal(true);

  };



  const handleSaveSkill = async () => {

    if (!skillForm.title.trim() || !user) {

      toast.error('Please fill in all required fields');

      return;

    }



    setSkillLoading(true);

    

    try {




      

      // Get current user to verify ID and use auth.uid()

      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

      if (userError) {

        console.error('Error getting current user:', userError);

        toast.error('Authentication error. Please try again.');

        return;

      }

      



      

      // Prepare skill data for new skills table schema

      const skillData = {

        user_id: authUser?.id, // Use auth.uid() from getUser()

        title: skillForm.title.trim(),

        description: skillForm.description.trim(),

        category: skillForm.category,

        created_at: new Date().toISOString()

      };

      







      

      // Insert skill into skills table

      const { data: insertData, error: insertError } = await supabase

        .from('skills')

        .insert([skillData])

        .select();



      if (insertError) {

        console.error('=== SUPABASE INSERT ERROR ===');

        console.error('Full error object:', insertError);

        console.error('Error message:', insertError.message);

        console.error('Error details:', insertError.details);

        console.error('Error code:', insertError.code);

        console.error('Error hint:', insertError.hint);

        

        // Check if it's a permission error

        if (insertError.code === '42501' || insertError.message?.includes('permission denied')) {

          toast.error('Permission denied. Check RLS policies.');

        } else {

          toast.error(`Failed to save skill: ${insertError.message}`);

        }

        return;

      }





      

      // Update local state with new skill

      if (currentUser) {

        const { skills = [] } = currentUser;

        const updatedSkills = [...skills, ...(insertData || [])];

        updateProfile({ skills: updatedSkills });

      }

      

      toast.success('Skill added successfully!');

      setShowSkillModal(false);

      setSkillForm({ title: '', description: '', category: 'web' });

      setEditingSkill(null);

      

    } catch (error) {

      console.error('=== CATCH BLOCK ERROR ===');

      console.error('Full error object:', error);

      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');

      toast.error('An unexpected error occurred. Please try again.');

    } finally {

      setSkillLoading(false);

    }

  };



  // Initialize edit form when currentUser data is available

  useEffect(() => {

    if (currentUser?.bio && !loading) {

      setEditForm({

        bio: currentUser.bio || '',

        location: currentUser.location || ''

      });

    }

  }, [currentUser?.bio, currentUser?.location, loading]);



  // The Guard - Show loading spinner while initial auth is loading

  if (isInitialLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

          <div className="text-white text-lg">Loading...</div>

        </div>

      </div>

    );

  }



  // Redirect to login if no user session

  if (!user) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="text-white text-lg">Please log in</div>

        </div>

      </div>

    );

  }



  // Set timeout for optimistic UI (500ms) and loading timeout (30 seconds)

  useEffect(() => {

    const optimisticTimer = setTimeout(() => {

      if (profileLoading && !showOptimisticUI && user) {

        setShowOptimisticUI(true);


      }

    }, 500); // 500ms for optimistic UI



    const timeoutTimer = setTimeout(() => {

      if (profileLoading || (!currentUser && !targetProfile)) {

        setLoadingTimeout(true);

      }

    }, 30000); // 30 second timeout



    return () => {

      clearTimeout(optimisticTimer);

      clearTimeout(timeoutTimer);

    };

  }, [profileLoading, currentUser, targetProfile, showOptimisticUI, user]);



  // Show optimistic UI after 500ms if user exists but profile is still loading

  if (showOptimisticUI && user && !currentUser && !targetProfile) {

    const optimisticProfile = {

      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',

      email: user.email || '',

      bio: 'Loading your profile...',

      location: 'Loading...',

      joinDate: user.created_at || new Date().toISOString(),

      avatar_url: null,

      skills: [],

      endorsements: 0,

      exchanges: 0,

      trustScore: 0

    };



    return (

      <div className="pt-8 pb-24 max-w-7xl mx-auto px-6">

        {/* Header / Banner area */}

        <div className="relative h-64 rounded-3xl overflow-visible mb-24">

           <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-slate-900 to-blue-900 animate-gradient-x" />

           <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

           

           {/* Profile Image Container */}

           <div className="absolute bottom-[-60px] left-12 z-50">

              <div className="relative">

                 <div className="relative group">

                   <div className="w-[140px] h-[140px] rounded-full border-4 border-slate-950 shadow-2xl transition-all duration-300">

                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${getAvatarColor(optimisticProfile.name)} flex items-center justify-center`}>

                        <span className="text-white font-bold text-2xl">

                          {getInitials(optimisticProfile.name)}

                        </span>

                      </div>

                    </div>

                 </div>

              </div>

           </div>

        </div>

        

        {/* Profile Info Section */}

        <div className="max-w-7xl mx-auto px-6 pt-24">

           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">

              <div className="text-center md:text-left flex-1">

                 <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center md:justify-start gap-3 mb-3">

                    {optimisticProfile.name}

                    <div className="w-6 h-6 md:w-7 md:h-7 text-blue-400 animate-pulse">⏳</div>

                 </h1>

                 <p className="text-slate-300 font-medium text-lg mb-4">Expertise Swapper</p>

                 <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 text-sm text-slate-400">

                    <div className="flex items-center gap-2">

                       <MapPin className="w-4 h-4" />

                       {optimisticProfile.location}

                    </div>

                    <div className="flex items-center gap-2">

                       <Calendar className="w-4 h-4" />

                       Joined {formatDate(optimisticProfile.joinDate || '')}

                    </div>

                 </div>

              </div>

           </div>

        </div>



        {/* Loading indicator for skills and bio */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mt-8 md:mt-16 lg:mt-32">

          <div className="space-y-8">

             <div className="glass-card p-8">

                <h3 className="text-xl font-bold mb-6">About Me</h3>

                <div className="text-slate-400 animate-pulse">Loading your bio...</div>

             </div>

          </div>

          

          <div className="space-y-8">

             <div className="glass-card p-8">

                <h3 className="text-xl font-bold mb-6">My Skills</h3>

                <div className="text-slate-400 animate-pulse">Loading your skills...</div>

             </div>

          </div>

        </div>

      </div>

    );

  }



  // Show timeout error

  if (loadingTimeout) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">

            <User className="w-8 h-8 text-red-400" />

          </div>

          <div className="text-white text-xl mb-2">Profile Loading Timeout</div>

          <div className="text-slate-400 mb-6">Unable to load profile data. Please refresh the page.</div>

          <button

            onClick={() => window.location.reload()}

            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mr-3"

          >

            Refresh Page

          </button>

          <button

            onClick={() => navigate('/explore')}

            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"

          >

            Go to Explore

          </button>

        </div>

      </div>

    );

  }



  // Add guard to prevent rendering until profile data is available

  if (!currentUser && !targetProfile && !showOptimisticUI) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

          <div className="text-white text-lg">Loading profile...</div>

        </div>

      </div>

    );

  }



  // Show loading state while profile data is being fetched

  if (profileLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

          <div className="text-white text-lg">Loading profile...</div>

        </div>

      </div>

    );

  }



  // Show loading state when fetching target profile

  if (profileId && targetProfileLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

          <div className="text-white text-lg">Loading profile...</div>

        </div>

      </div>

    );

  }



  // Show error state when target profile is not found

  if (profileId && !targetProfileLoading && !targetProfile) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <div className="text-center">

          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">

            <User className="w-8 h-8 text-red-400" />

          </div>

          <div className="text-white text-xl mb-2">User Not Found</div>

          <div className="text-slate-400 mb-6">The profile you're looking for doesn't exist or has been removed.</div>

          <button

            onClick={() => navigate('/explore')}

            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"

          >

            Back to Explore

          </button>

        </div>

      </div>

    );

  }



  // Remove loading state check - page should render immediately with available data

  // if (loading) {

  //   return (

  //     <div className="min-h-screen flex items-center justify-center bg-slate-900">

  //       <div className="text-center">

  //         <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>

  //         <div className="text-white text-lg">Loading profile...</div>

  //       </div>

  //     </div>

  //   );

  // }



  // Add global guard to prevent null profile access - MUST be before any profile access

  const profile = getDisplayProfile();






  

  if (!profile) { 

    // Fallback profile creation for missing profiles

    const fallbackProfile = {

      id: user?.id || '',

      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',

      email: user?.email || '',

      bio: 'New member on Swapill',

      location: 'Location not set',

      joinDate: user?.created_at || new Date().toISOString(),

      avatar_url: user?.user_metadata?.avatar_url || null,

      skills: [],

      endorsements: 0,

      exchanges: 0,

      trustScore: 0

    };

    

    // Create profile in database if it doesn't exist

    const createProfileInDatabase = async () => {

      try {

        const profileData = {

          id: user.id,

          full_name: fallbackProfile.name,

          email: fallbackProfile.email,

          username: fallbackProfile.name,

          bio: fallbackProfile.bio,

          avatar_url: fallbackProfile.avatar_url,

          updated_at: new Date().toISOString(),

        };

        

        const { error: insertError } = await supabase

          .from('profiles')

          .insert(profileData);

          

        if (insertError) {

          console.error('Error creating fallback profile:', insertError);

        } else {


          setCurrentUser(fallbackProfile);

        }

      } catch (error) {

        console.error('Error in createProfileInDatabase:', error);

      }

    };

    

    // Auto-create profile if user exists but no profile found

    if (user && !currentUser) {

      createProfileInDatabase();

    }

    

    return (

      <div className="min-h-screen bg-slate-900">

        {/* Skeleton Loader for Profile Creation */}

        <div className="relative h-64 rounded-3xl overflow-visible mb-24">

          <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-slate-900 to-blue-900 animate-gradient-x" />

          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm" />

          

          {/* Skeleton Avatar */}

          <div className="absolute bottom-[-60px] left-12 z-50">

            <div className="w-[140px] h-[140px] rounded-full border-4 border-slate-950 shadow-2xl bg-slate-800 animate-pulse" />

          </div>

        </div>

        

        {/* Skeleton Content */}

        <div className="px-12 pt-20">

          <div className="max-w-4xl mx-auto">

            <div className="text-center mb-8">

              <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse mx-auto mb-2" />

              <div className="h-4 w-32 bg-slate-800 rounded-lg animate-pulse mx-auto" />

            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">

                <div className="h-6 w-24 bg-slate-700 rounded-lg animate-pulse mb-4" />

                <div className="h-4 w-full bg-slate-700 rounded-lg animate-pulse mb-2" />

                <div className="h-4 w-3/4 bg-slate-700 rounded-lg animate-pulse" />

              </div>

              

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">

                <div className="h-6 w-24 bg-slate-700 rounded-lg animate-pulse mb-4" />

                <div className="h-4 w-full bg-slate-700 rounded-lg animate-pulse mb-2" />

                <div className="h-4 w-3/4 bg-slate-700 rounded-lg animate-pulse" />

              </div>

              

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">

                <div className="h-6 w-24 bg-slate-700 rounded-lg animate-pulse mb-4" />

                <div className="h-4 w-full bg-slate-700 rounded-lg animate-pulse mb-2" />

                <div className="h-4 w-3/4 bg-slate-700 rounded-lg animate-pulse" />

              </div>

            </div>

          </div>

        </div>

        

        <div className="text-center mt-8">

          <div className="text-white text-lg">Creating your profile...</div>

        </div>

      </div>

    );

  }



  // Safe destructuring - ensures displaySkills is always an array

  const displaySkills = useMemo(() => profile?.skills || [], [profile?.skills]);

  

  // Memoize profile data to prevent unnecessary re-renders

  const memoizedProfile = useMemo(() => profile, [profile]);

  

  // Debug skills display (only in development)

  if (process.env.NODE_ENV === 'development') {





  }



  return (

    <div className="pt-4 pb-16 max-w-7xl mx-auto px-4 md:px-6">

      {/* Hidden file input for upload */}

      <input

        ref={fileInputRef}

        type="file"

        accept="image/*"

        onChange={handleImageUpload}

        className="hidden"

      />

      {/* Header / Banner area */}

      <div className="relative h-56 md:h-64 rounded-3xl overflow-visible mb-6">

         {(() => {

           const coverUrl = getDisplayProfile()?.cover_url;

           if (coverUrl) {

             return (

               <div

                 className="absolute inset-0 rounded-3xl bg-cover bg-center"

                 style={{ backgroundImage: `url(${coverUrl})` }}

               />

             );

           }

           return (

             <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-800 via-slate-900 to-blue-900 animate-gradient-x" />

           );

         })()}

         <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-[2px]" />



         {/* Glassmorphism effect on bottom edge */}

         <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm rounded-b-3xl" />



         {/* Hidden cover file input */}

         <input

           ref={coverFileInputRef}

           type="file"

           accept="image/*"

           onChange={handleCoverUpload}

           className="hidden"

         />



         {/* Edit Cover menu — only for own profile */}

         {isViewingOwnProfile() && (

           <div ref={coverMenuRef} className="absolute top-4 right-4 z-20">

             <button

               onClick={() => setShowCoverMenu((s) => !s)}

               disabled={coverLoading}

               className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2 text-white disabled:opacity-50"

               title="Edit cover photo"

             >

               {coverLoading ? (

                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

               ) : (

                 <Edit2 className="w-4 h-4" />

               )}

               <span className="text-xs font-medium hidden sm:inline">Edit cover</span>

             </button>

             <AnimatePresence>

               {showCoverMenu && (

                 <motion.div

                   initial={{ opacity: 0, y: -8 }}

                   animate={{ opacity: 1, y: 0 }}

                   exit={{ opacity: 0, y: -8 }}

                   className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"

                 >

                   <button

                     onClick={() => coverFileInputRef.current?.click()}

                     disabled={coverLoading}

                     className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 flex items-center gap-3 disabled:opacity-50"

                   >

                     <Upload className="w-4 h-4 text-purple-400" />

                     {currentUser?.cover_url ? 'Change cover photo' : 'Upload cover photo'}

                   </button>

                   {currentUser?.cover_url && (

                     <button

                       onClick={handleRemoveCover}

                       disabled={coverLoading}

                       className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-3 border-t border-white/5 disabled:opacity-50"

                     >

                       <Trash2 className="w-4 h-4" />

                       Remove cover photo

                     </button>

                   )}

                 </motion.div>

               )}

             </AnimatePresence>

           </div>

         )}

         

         {/* Profile Image Container - Absolutely Positioned with High Z-Index */}

         <div className="absolute bottom-[-48px] left-6 md:left-10 z-50">

            <div className="relative">

               {/* Profile Picture Area */}

               <div className="relative group">

                 <div className="relative">

                   <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full border-4 border-slate-950 shadow-2xl transition-all duration-300">

                      {(() => {

                        const avatarUrl = getDisplayProfile()?.avatar_url;

                        const profileName = getDisplayProfile()?.full_name || getDisplayProfile()?.name || 'User';

                        

                        // BLOCK dicebear URLs and show colored initials instead

                        if (avatarUrl && avatarUrl.includes('dicebear.com')) {

                          return (

                            <div className={`w-full h-full rounded-full bg-gradient-to-br ${getAvatarColor(profileName)} flex items-center justify-center`}>

                              <span className="text-white font-bold text-2xl">

                                {getInitials(profileName)}

                              </span>

                            </div>

                          );

                        }

                        

                        // Show real photo only if it's NOT a dicebear URL

                        if (avatarUrl && !avatarUrl.includes('dicebear.com')) {

                          return (

                            <img 

                              src={avatarUrl} 

                              alt="Profile" 

                              className="w-full h-full object-cover rounded-full"

                              style={{ aspectRatio: '1/1' }}

                              onError={(e) => {

                                const target = e.target as HTMLImageElement;

                                target.style.display = 'none';

                                const parent = target.parentElement;

                                if (parent && !parent.querySelector('.fallback-circle')) {

                                  const fallback = document.createElement('div');

                                  fallback.className = `fallback-circle absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(profileName)} rounded-full text-white font-bold text-2xl`;

                                  fallback.textContent = getInitials(profileName);

                                  parent.appendChild(fallback);

                                }

                              }}

                            />

                          );

                        }

                        

                        // Show colored initials if no avatar URL

                        return (

                          <div className={`w-full h-full rounded-full bg-gradient-to-br ${getAvatarColor(profileName)} flex items-center justify-center`}>

                            <span className="text-white font-bold text-2xl">

                              {getInitials(profileName)}

                            </span>

                          </div>

                        );

                      })()}

                    </div>

                   {/* Hover overlay with options */}

                   <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer">

                     {avatarLoading ? (

                       <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />

                     ) : (

                       <>

                         <Camera className="w-6 h-6 text-white mb-1" />

                         <span className="text-white text-xs font-medium">Change Photo</span>

                       </>

                     )}

                   </div>

                 </div>

                 

                 {/* Photo action buttons */}

                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                   <button

                     onClick={() => fileInputRef.current?.click()}

                     disabled={avatarLoading}

                     className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                   >

                     Change

                   </button>

                   {currentUser?.avatar_url && (

                     <button

                       onClick={handleRemovePhoto}

                       disabled={avatarLoading}

                       className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                     >

                       Remove

                     </button>

                   )}

                 </div>

                 </div>

               <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-green-500 border-[3px] border-slate-950 rounded-full" title="Online" />

            </div>

         </div>

      </div>

      

      {/* Hidden file input */}

      <input

        ref={fileInputRef}

        type="file"

        accept="image/*"

        onChange={handleImageUpload}

        className="hidden"

      />

      {/* Profile Info Section - sits beside the avatar on md+ */}

      <div className="px-2 md:pl-44 pt-16 md:pt-2">

         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">

            <div className="text-center md:text-left flex-1 min-w-0">

               <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-2 mb-1">

                  <span className="truncate">{getDisplayProfile()?.full_name || getDisplayProfile()?.name || getDisplayProfile()?.username || 'Member'}</span>

                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0" />

               </h1>

               <p className="text-slate-400 text-sm mb-2">Expertise Swapper</p>

               <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-500">

                  <div className="flex items-center gap-1.5">

                     <MapPin className="w-3.5 h-3.5" />

                     {currentUser?.location || 'Add your location'}

                  </div>

                  <div className="flex items-center gap-1.5">

                     <Calendar className="w-3.5 h-3.5" />

                     Joined {formatDate(currentUser?.joinDate || '')}

                  </div>

               </div>

            </div>



            <div className="flex gap-2 justify-center md:justify-end">

               <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const shareId = profileId || user?.id;
                    if (!shareId) {
                      toast.error('Unable to share profile');
                      return;
                    }
                    const displayName =
                      getDisplayProfile()?.full_name ||
                      getDisplayProfile()?.name ||
                      getDisplayProfile()?.username ||
                      'Member';
                    shareOrCopy({
                      url: profileShareUrl(shareId),
                      title: `${displayName} on Swapill`,
                      text: `Check out ${displayName}'s profile on Swapill`,
                    });
                  }}
                  className="btn-secondary p-2.5 rounded-xl cursor-pointer relative z-10"
                  aria-label="Share profile"
                  title="Share profile"
               >

                  <Share2 className="w-4 h-4 pointer-events-none" />

               </button>

               <button

                  onClick={() => navigate('/explore')}

                  className="btn-primary px-5 py-2.5 flex items-center gap-2 text-sm"

               >

                  <MessageSquare className="w-4 h-4" />

                  Start Exchange

               </button>

            </div>

         </div>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Left Column: About */}

        <div className="space-y-6">

           <section className="glass-card p-6">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-lg font-bold">About Me</h3>

                <button

                  onClick={() => setShowEditModal(true)}

                  title="Edit profile"

                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"

                >

                  <Edit2 className="w-3.5 h-3.5 text-gray-400" />

                </button>

              </div>

                {profile?.bio ? (

                  <p className="text-slate-400 leading-relaxed mb-6 text-sm">

                    {profile?.bio}

                  </p>

                ) : (

                  <p className="text-slate-500 leading-relaxed mb-6 italic text-sm">

                    No bio added yet. Tell others about yourself and what skills you can share...

                  </p>

                )}

                <div className="space-y-3 text-sm">

                 <div className="flex items-center gap-3 text-slate-300">

                    <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />

                    <span className="truncate">{currentUser?.location || 'Add your location'}</span>

                 </div>

                 <div className="flex items-center gap-3 text-slate-300">

                    <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />

                    Joined {formatDate(currentUser?.joinDate || '')}

                 </div>

                 <div className="flex items-center gap-3 text-slate-300">

                    <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />

                    <span className="truncate">{currentUser?.email || currentUser?.name || 'Expert Member'}</span>

                 </div>

                </div>

           </section>



           <section className="glass-card p-6">

              <h3 className="text-lg font-bold mb-4">Statistics</h3>

              <div className="space-y-4">

                 {(currentUser?.trustScore ?? 0) > 0 && (

                   <div>

                      <div className="flex justify-between text-sm mb-2">

                         <span className="text-slate-400">Trust Score</span>

                         <span className="text-green-400 font-bold">{currentUser?.trustScore}%</span>

                      </div>

                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">

                         <div className="h-full bg-green-500" style={{ width: `${currentUser?.trustScore}%` }} />

                      </div>

                   </div>

                 )}

                 <div className="grid grid-cols-2 gap-3">

                    <div className="p-3 rounded-xl bg-white/5 text-center">

                       <div className="text-xl font-bold">{currentUser?.endorsements || 0}</div>

                       <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Endorsements</div>

                    </div>

                    <div className="p-3 rounded-xl bg-white/5 text-center">

                       <div className="text-xl font-bold">{currentUser?.exchanges || 0}</div>

                       <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Exchanges</div>

                    </div>

                 </div>

              </div>

           </section>

        </div>



        {/* Right Column: Skills & Reviews */}

        <div className="lg:col-span-2 space-y-8">

          <section>

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">Active Offerings</h2>

              <div className="relative" ref={dropdownRef}>

                <button

                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}

                  className="text-slate-500 text-sm font-medium hover:text-purple-400 hover:underline cursor-pointer transition-all flex items-center gap-1"

                >

                  {currentUser?.skills?.length || 0} Skills Available

                  <ChevronDown className={`w-3 h-3 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />

                </button>

                

                <AnimatePresence>

                  {showSkillsDropdown && (

                    <motion.div

                      initial={{ opacity: 0, y: -10 }}

                      animate={{ opacity: 1, y: 0 }}

                      exit={{ opacity: 0, y: -10 }}

                      className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"

                    >

                      <div className="p-4">

                        <h4 className="text-sm font-semibold text-white mb-3">My Skills</h4>

                        {displaySkills.length > 0 ? (

                          <div className="space-y-2">

                            {displaySkills.map((skill: any) => (

                              <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">

                                <div className="flex-1">

                                  <div className="font-medium text-white text-sm">{skill.title}</div>

                                  <div className="text-xs text-slate-500 uppercase tracking-wider">{skill.category}</div>

                                </div>

                                <div className="flex items-center gap-2">

                                  <button

                                    onClick={() => handleEditSkillFromDropdown(skill)}

                                    className="text-slate-400 hover:text-white transition-colors p-1"

                                    title="Edit skill"

                                  >

                                    <Edit2 className="w-3 h-3" />

                                  </button>

                                  <button

                                    onClick={() => handleDeleteSkill(skill.id)}

                                    className="text-slate-400 hover:text-red-400 transition-colors p-1"

                                    title="Delete skill"

                                  >

                                    <Trash2 className="w-3 h-3" />

                                  </button>

                                </div>

                              </div>

                            ))}

                          </div>

                        ) : (

                          <div className="text-center py-4">

                            <p className="text-slate-400 text-sm">No skills added yet</p>

                          </div>

                        )}

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            </div>

            

            {/* Skills Grid with Categories */}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {SKILL_CATEGORIES.map((category, index) => {

                const hasSkills = displaySkills.some((skill: any) => skill.category === category.id);

                const categorySkills = displaySkills.filter((skill: any) => skill.category === category.id);

                

                return (

                  <motion.div

                    key={category.id}

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.5, delay: index * 0.1 }}

                    className={`relative group ${!hasSkills ? 'opacity-60' : ''}`}

                  >

                    <div className="glass-card p-4 h-full min-h-[140px] flex flex-col justify-between hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.02]">

                      {/* Category Header */}

                      <div className="flex items-center justify-between mb-3">

                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-violet-500/30 transition-all duration-300">

                          <category.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />

                        </div>

                        {!hasSkills && (

                          <button

                            onClick={() => {

                              setSkillForm(prev => ({ ...prev, category: category.id }));

                              setShowSkillModal(true);

                            }}

                            title={`Add ${category.name} skill`}

                            className="w-7 h-7 rounded-full bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110"

                          >

                            <Plus className="w-3.5 h-3.5 text-purple-400" />

                          </button>

                        )}

                      </div>

                      

                      {/* Category Info */}

                      <div className="flex-1 min-w-0">

                        <h3 className="text-sm font-semibold text-white mb-1.5 truncate">{category.name}</h3>

                        {hasSkills ? (

                          <div className="space-y-1">

                            {categorySkills.slice(0, 2).map((skill: any, skillIndex: number) => (

                              <div key={skillIndex} className="text-xs text-slate-300 truncate">

                                • {skill.title}

                              </div>

                            ))}

                            {categorySkills.length > 2 && (

                              <div className="text-xs text-purple-400 font-medium">

                                +{categorySkills.length - 2} more

                              </div>

                            )}

                          </div>

                        ) : (

                          <p className="text-xs text-slate-500 italic">

                            No skills added yet

                          </p>

                        )}

                      </div>

                      {/* Category Footer */}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">

                        <span className="text-[11px] text-slate-500">

                          {hasSkills ? `${categorySkills.length} skill${categorySkills.length > 1 ? 's' : ''}` : 'Add skills'}

                        </span>

                        {hasSkills && (

                          <button

                            onClick={() => {

                              setSkillForm(prev => ({ ...prev, category: category.id }));

                              setShowSkillModal(true);

                            }}

                            className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors duration-300"

                          >

                            Add more

                          </button>

                        )}

                      </div>

                    </div>

                  </motion.div>

                );

              })}

            </div>

            

            {/* Add All Skills Button */}

            <div className="mt-8 text-center">

              <button

                onClick={handleAddSkill}

                className="btn-primary px-6 py-3 rounded-full flex items-center gap-2 mx-auto"

              >

                <Plus className="w-5 h-5" />

                Add New Skill

              </button>

            </div>

          </section>



          <section className="glass-card p-6">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">Reviews & Feedback</h2>

              {(currentUser?.exchanges ?? 0) > 0 && (currentUser?.trustScore ?? 0) > 0 && (

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm font-semibold">

                   <Star className="w-3.5 h-3.5 fill-current" />

                   {(currentUser?.trustScore ?? 0).toFixed(1)}

                </div>

              )}

            </div>

            {(currentUser?.exchanges ?? 0) === 0 ? (

              <div className="text-center py-8">

                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3">

                  <MessageCircle className="w-7 h-7 text-purple-400" />

                </div>

                <div className="text-white text-base font-semibold mb-1">No reviews yet</div>

                <div className="text-slate-400 text-sm">Reviews will appear here after your first swap.</div>

              </div>

            ) : (

              <div className="text-slate-400 text-sm py-4 text-center">

                Reviews from your swap partners will appear here.

              </div>

            )}

          </section>

        </div>

      </div>

      

      {/* Edit Profile Modal */}

      <AnimatePresence>

        {showEditModal && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"

            onClick={() => setShowEditModal(false)}

          >

            <motion.div

              initial={{ opacity: 0, scale: 0.9, y: 20 }}

              animate={{ opacity: 1, scale: 1, y: 0 }}

              exit={{ opacity: 0, scale: 0.9, y: 20 }}

              className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20"

              onClick={(e) => e.stopPropagation()}

            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>

                <button

                  onClick={() => setShowEditModal(false)}

                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"

                >

                  <Plus className="w-5 h-5 text-gray-400 rotate-45" />

                </button>

              </div>

              

              <div className="space-y-6">

                <div>

                  <label className="block text-sm font-medium text-gray-300 mb-2">

                    About Me

                  </label>

                  <textarea

                    value={editForm.bio}

                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}

                    placeholder="Tell others about yourself and what skills you can share..."

                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"

                    rows={4}

                  />

                </div>

                

                <div>

                  <label className="block text-sm font-medium text-gray-300 mb-2">

                    Location

                  </label>

                  <input

                    type="text"

                    value={editForm.location}

                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}

                    placeholder="Enter your location"

                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"

                  />

                </div>

                

                <div className="flex gap-3 pt-4">

                  <button

                    onClick={() => setShowEditModal(false)}

                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all"

                  >

                    Cancel

                  </button>

                  <button

                    onClick={handleSaveProfile}

                    disabled={profileSaveLoading}

                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

                  >

                    {profileSaveLoading ? (

                      <>

                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                        <span>Saving...</span>

                      </>

                    ) : (

                      <span>Save Changes</span>

                    )}

                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      

            

      {/* Add Skill Modal */}

      <AnimatePresence>

        {showSkillModal && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"

            onClick={() => setShowSkillModal(false)}

          >

            <motion.div

              initial={{ opacity: 0, scale: 0.9, y: 20 }}

              animate={{ opacity: 1, scale: 1, y: 0 }}

              exit={{ opacity: 0, scale: 0.9, y: 20 }}

              className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20"

              onClick={(e) => e.stopPropagation()}

            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold text-white">Add New Skill</h2>

                <button

                  onClick={() => setShowSkillModal(false)}

                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"

                >

                  <Plus className="w-5 h-5 text-gray-400 rotate-45" />

                </button>

              </div>

              

              <div className="space-y-6">

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">

                    Category

                  </label>

                  <select

                    value={skillForm.category}

                    onChange={(e) => setSkillForm(prev => ({ ...prev, category: e.target.value }))}

                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"

                  >

                    {SKILL_CATEGORIES.map(category => (

                      <option key={category.id} value={category.id} className="bg-slate-900">

                        {category.name}

                      </option>

                    ))}

                  </select>

                </div>

                

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">

                    Skill Title

                  </label>

                  <input

                    type="text"

                    value={skillForm.title}

                    onChange={(e) => setSkillForm(prev => ({ ...prev, title: e.target.value }))}

                    placeholder="e.g., React Development, UI Design, Spanish"

                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"

                  />

                </div>

                

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">

                    Description

                  </label>

                  <textarea

                    value={skillForm.description}

                    onChange={(e) => setSkillForm(prev => ({ ...prev, description: e.target.value }))}

                    placeholder="Describe your expertise and what you can teach..."

                    rows={4}

                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"

                  />

                </div>

              </div>

              

              <div className="flex gap-4 mt-8">

                <button

                  onClick={() => setShowSkillModal(false)}

                  className="flex-1 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"

                >

                  Cancel

                </button>

                <button

                  onClick={handleSaveSkill}

                  disabled={!skillForm.title.trim() || skillLoading}

                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"

                >

                  {skillLoading ? (

                    <div className="flex items-center justify-center gap-2">

                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                      Saving...

                    </div>

                  ) : (

                    'Add Skill'

                  )}

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

}