import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, Code, Smartphone, Palette, TrendingUp, Globe, PenTool, Music, ChefHat, Sparkles, Camera, Mic, Kanban, User, MessageCircle, Clock, Megaphone, Code2, BarChart3, Languages, Lightbulb, Share2, Utensils, Terminal, MessageSquare, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext.tsx';
import ProfilePreviewModal from '../components/ProfilePreviewModal';
import { usePresence, isOnline } from '../hooks/usePresence';
import { shareOrCopy, profileShareUrl } from '../utils/share';
import { getAvatarGradient } from '../utils/avatarColor';

// Icon mapping function for skill categories
const getSkillIcon = (category?: string) => {
  if (!category) return <Lightbulb size={18} />;

  const lowerCategory = category.toLowerCase();

  switch (lowerCategory) {
    case 'marketing':
    case 'social media':
      return <Megaphone size={18} />;
    case 'development':
    case 'coding':
    case 'web':
    case 'mobile':
      return <Code2 size={18} />;
    case 'design':
    case 'ui':
    case 'ux':
      return <Palette size={18} />;
    case 'writing':
    case 'content':
      return <PenTool size={18} />;
    case 'data':
    case 'analysis':
      return <BarChart3 size={18} />;
    case 'languages':
      return <Languages size={18} />;
    case 'cooking':
      return <Utensils size={18} />;
    case 'prompt':
    case 'prompt engineering':
      return <Terminal size={18} />;
    case 'photography':
      return <Camera size={18} />;
    case 'speaking':
    case 'public speaking':
      return <MessageSquare size={18} />;
    case 'management':
    case 'project management':
      return <Briefcase size={18} />;
    default:
      return <Lightbulb size={18} />;
  }
};

// Realtime subscription for instant updates
const useRealtimeProfiles = (onNewProfile: (profile: any) => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
        onNewProfile(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewProfile]);
};

// Skill Categories with icons (same as Profile)
const SKILL_CATEGORIES = [
  { id: 'all', name: 'All Skills', icon: Search },
  { id: 'web', name: 'Web Dev', icon: Code },
  { id: 'mobile', name: 'Mobile Dev', icon: Smartphone },
  { id: 'design', name: 'Design', icon: Palette },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'languages', name: 'Languages', icon: Globe },
  { id: 'writing', name: 'Writing', icon: PenTool },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'cooking', name: 'Cooking', icon: ChefHat },
  { id: 'prompt', name: 'Prompt Eng', icon: Sparkles },
  { id: 'photography', name: 'Photography', icon: Camera },
  { id: 'speaking', name: 'Speaking', icon: Mic },
  { id: 'management', name: 'Project Mgmt', icon: Kanban },
];

// Color palette for avatar circles
const AVATAR_COLORS = [
  'from-purple-500 to-violet-600',
  'from-red-500 to-rose-600',
  'from-green-500 to-emerald-600',
  'from-blue-500 to-indigo-600',
  'from-yellow-500 to-amber-600',
  'from-pink-500 to-rose-600',
  'from-teal-500 to-cyan-600',
  'from-orange-500 to-orange-600'
];

// Get initials from name
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Modern Avatar Component - shares getAvatarGradient with the rest of the app
function ModernAvatar({ name, size = "medium", avatarUrl }: {
  name: string;
  size?: "small" | "medium" | "large";
  avatarUrl?: string | null;
}) {
  const safeName = name || 'Member';
  const initials = getInitials(safeName);
  const sizeClasses = {
    small: "w-12 h-12 text-sm",
    medium: "w-14 h-14 text-base",
    large: "w-16 h-16 text-lg",
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

// Get icon for skill category
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: any } = {
    'web': Code,
    'mobile': Smartphone,
    'design': Palette,
    'marketing': TrendingUp,
    'languages': Globe,
    'writing': PenTool,
    'music': Music,
    'cooking': Utensils,
    'prompt': Terminal,
    'photography': Camera,
    'speaking': MessageSquare,
    'management': Briefcase
  };
  return iconMap[category] || Search;
};

// 30 Diverse Egyptian Experts with Professional Details
const EGYPTIAN_EXPERTS = [
  {
    id: 1,
    name: "Ahmed Mansour",
    initials: "AM",
    topSkill: { title: "React Development", category: "web", icon: Code },
    skills: ["React", "TypeScript", "Node.js"],
    rating: 4.9,
    swaps: 23,
    bio: "Passionate Web Developer with 3 years experience in modern React applications"
  },
  {
    id: 2,
    name: "Sara Hassan",
    initials: "SH",
    topSkill: { title: "Middle Eastern Cooking", category: "cooking", icon: ChefHat },
    skills: ["Egyptian Cuisine", "Levantine Dishes", "Desserts"],
    rating: 5.0,
    swaps: 31,
    bio: "Professional chef specializing in authentic Middle Eastern and Egyptian cuisine"
  },
  {
    id: 3,
    name: "Omar Sherif",
    initials: "OS",
    topSkill: { title: "Prompt Engineering", category: "prompt", icon: Sparkles },
    skills: ["AI Prompts", "ChatGPT", "Midjourney"],
    rating: 4.7,
    swaps: 18,
    bio: "AI specialist helping businesses leverage cutting-edge language models"
  },
  {
    id: 4,
    name: "Mariam Ali",
    initials: "MA",
    topSkill: { title: "Modern Arabic", category: "languages", icon: Globe },
    skills: ["Modern Arabic", "Classical Arabic", "Egyptian Dialect"],
    rating: 4.9,
    swaps: 27,
    bio: "Certified Arabic teacher with expertise in Modern Standard Arabic and Egyptian dialect"
  },
  {
    id: 5,
    name: "Khaled Ibrahim",
    initials: "KI",
    topSkill: { title: "iOS Development", category: "mobile", icon: Smartphone },
    skills: ["iOS", "Android", "React Native"],
    rating: 4.8,
    swaps: 22,
    bio: "Mobile app developer creating intuitive cross-platform applications"
  },
  {
    id: 6,
    name: "Fatima Mahmoud",
    initials: "FM",
    topSkill: { title: "UI/UX Design", category: "design", icon: Palette },
    skills: ["Figma", "Adobe XD", "Prototyping"],
    rating: 4.6,
    swaps: 15,
    bio: "Creative designer focused on user-centered digital experiences"
  },
  {
    id: 7,
    name: "Youssef Abdel",
    initials: "YA",
    topSkill: { title: "Photography", category: "photography", icon: Camera },
    skills: ["Portrait", "Event Photography", "Photo Editing"],
    rating: 4.9,
    swaps: 34,
    bio: "Professional photographer capturing moments across Egypt and the Middle East"
  },
  {
    id: 8,
    name: "Nadia Kamel",
    initials: "NK",
    topSkill: { title: "Public Speaking", category: "speaking", icon: Mic },
    skills: ["Public Speaking", "Presentation Skills", "Debate Coaching"],
    rating: 4.8,
    swaps: 19,
    bio: "Communication expert helping professionals master the art of public speaking"
  },
  {
    id: 9,
    name: "Mohamed Elsayed",
    initials: "ME",
    topSkill: { title: "Project Management", category: "management", icon: Kanban },
    skills: ["Agile", "Scrum", "Team Leadership"],
    rating: 4.7,
    swaps: 26,
    bio: "PMP certified project manager with 8 years in tech and construction"
  },
  {
    id: 10,
    name: "Layla Hussein",
    initials: "LH",
    topSkill: { title: "Digital Marketing", category: "marketing", icon: TrendingUp },
    skills: ["SEO", "Social Media", "Content Strategy"],
    rating: 4.5,
    swaps: 21,
    bio: "Marketing strategist helping brands grow their online presence"
  },
  {
    id: 11,
    name: "Karim Nabil",
    initials: "KN",
    topSkill: { title: "Music Production", category: "music", icon: Music },
    skills: ["Beat Making", "Audio Engineering", "MIDI Production"],
    rating: 4.8,
    swaps: 16,
    bio: "Music producer creating beats for artists across the Middle East"
  },
  {
    id: 12,
    name: "Rania Salah",
    initials: "RS",
    topSkill: { title: "Technical Writing", category: "writing", icon: PenTool },
    skills: ["Technical Writing", "Documentation", "API Writing"],
    rating: 4.6,
    swaps: 13,
    bio: "Technical writer making complex concepts simple and accessible"
  },
  {
    id: 13,
    name: "Hassan Ali",
    initials: "HA",
    topSkill: { title: "Python Development", category: "web", icon: Code },
    skills: ["Vue.js", "Python", "Django"],
    rating: 4.7,
    swaps: 24,
    bio: "Full-stack developer specializing in Python web frameworks"
  },
  {
    id: 14,
    name: "Mona Fathy",
    initials: "MF",
    topSkill: { title: "Business English", category: "languages", icon: Globe },
    skills: ["Business English", "IELTS Prep", "Corporate Training"],
    rating: 4.9,
    swaps: 29,
    bio: "English language coach specializing in business communication"
  },
  {
    id: 15,
    name: "Tarek Omar",
    initials: "TO",
    topSkill: { title: "Data Science", category: "web", icon: Code },
    skills: ["Machine Learning", "Python", "Data Analysis"],
    rating: 4.8,
    swaps: 20,
    bio: "Data scientist helping businesses make data-driven decisions"
  },
  {
    id: 16,
    name: "Dalia Magdy",
    initials: "DM",
    topSkill: { title: "Graphic Design", category: "design", icon: Palette },
    skills: ["Branding", "Logo Design", "Print Design"],
    rating: 4.5,
    swaps: 17,
    bio: "Graphic designer creating memorable brand identities"
  },
  {
    id: 17,
    name: "Salwa Gamal",
    initials: "SG",
    topSkill: { title: "Blog Writing", category: "writing", icon: PenTool },
    skills: ["Blog Writing", "Copywriting", "SEO Content"],
    rating: 4.4,
    swaps: 12,
    bio: "Content writer creating engaging stories for digital platforms"
  },
  {
    id: 18,
    name: "Mahmoud Reda",
    initials: "MR",
    topSkill: { title: "ChatGPT", category: "prompt", icon: Sparkles },
    skills: ["ChatGPT", "Automation", "AI Strategy"],
    rating: 4.6,
    swaps: 14,
    bio: "AI consultant helping businesses integrate artificial intelligence"
  },
  {
    id: 19,
    name: "Aya Khaled",
    initials: "AK",
    topSkill: { title: "Social Media", category: "marketing", icon: TrendingUp },
    skills: ["Instagram", "Facebook", "Content Strategy"],
    rating: 4.7,
    swaps: 25,
    bio: "Social media expert building strong online communities"
  },
  {
    id: 20,
    name: "Maryam Khaled",
    initials: "MK",
    topSkill: { title: "Frontend Development", category: "web", icon: Code },
    skills: ["Frontend Development", "React", "Supabase"],
    rating: 4.9,
    swaps: 23,
    bio: "Frontend developer specializing in React and Supabase integrations. Passionate about creating beautiful and functional web applications."
  },
  {
    id: 21,
    name: "Mostafa Ahmed",
    initials: "MA",
    topSkill: { title: "Python Programming", category: "web", icon: Code },
    skills: ["Python", "Django", "Data Science"],
    rating: 4.8,
    swaps: 19,
    bio: "Python developer specializing in web applications and data analysis"
  },
  {
    id: 22,
    name: "Nourhan Mohamed",
    initials: "NM",
    topSkill: { title: "Fashion Design", category: "design", icon: Palette },
    skills: ["Fashion Sketching", "Pattern Making", "Styling"],
    rating: 4.6,
    swaps: 22,
    bio: "Fashion designer creating modern and traditional Egyptian clothing"
  },
  {
    id: 23,
    name: "Salma Mahmoud",
    initials: "SM",
    topSkill: { title: "Translation Services", category: "languages", icon: Globe },
    skills: ["English-Arabic", "French-Arabic", "Technical Translation"],
    rating: 4.7,
    swaps: 18,
    bio: "Professional translator providing accurate language services"
  },
  {
    id: 24,
    name: "Omar Khaled",
    initials: "OK",
    topSkill: { title: "Game Development", category: "web", icon: Code },
    skills: ["Unity", "C#", "2D/3D Graphics"],
    rating: 4.5,
    swaps: 15,
    bio: "Game developer creating engaging mobile and PC games"
  },
  {
    id: 25,
    name: "Hend Ahmed",
    initials: "HA",
    topSkill: { title: "Yoga Instruction", category: "speaking", icon: Mic },
    skills: ["Hatha Yoga", "Meditation", "Wellness Coaching"],
    rating: 4.8,
    swaps: 21,
    bio: "Certified yoga instructor promoting health and mindfulness"
  },
  {
    id: 26,
    name: "Mahmoud Fathy",
    initials: "MF",
    topSkill: { title: "Blockchain Development", category: "web", icon: Code },
    skills: ["Solidity", "Web3", "Smart Contracts"],
    rating: 4.6,
    swaps: 17,
    bio: "Blockchain developer building decentralized applications"
  },
  {
    id: 27,
    name: "Rania Ali",
    initials: "RA",
    topSkill: { title: "Video Editing", category: "design", icon: Palette },
    skills: ["Adobe Premiere", "Final Cut Pro", "Motion Graphics"],
    rating: 4.7,
    swaps: 24,
    bio: "Video editor creating compelling visual content"
  },
  {
    id: 28,
    name: "Khaled Mohamed",
    initials: "KM",
    topSkill: { title: "Cybersecurity", category: "web", icon: Code },
    skills: ["Network Security", "Ethical Hacking", "Risk Assessment"],
    rating: 4.9,
    swaps: 26,
    bio: "Cybersecurity expert protecting digital assets and infrastructure"
  },
  {
    id: 29,
    name: "Mona Ahmed",
    initials: "MA",
    topSkill: { title: "Business Consulting", category: "management", icon: Kanban },
    skills: ["Strategy Planning", "Market Analysis", "Business Development"],
    rating: 4.8,
    swaps: 23,
    bio: "Business consultant helping companies grow and optimize operations"
  },
  {
    id: 30,
    name: "Adel Emam",
    initials: "AE",
    topSkill: { title: "Video Production", category: "design", icon: Palette },
    skills: ["Video Editing", "Storytelling"],
    rating: 4.7,
    swaps: 24,
    bio: "Video editor creating compelling visual content"
  }
];

// Skeleton component for loading state — matches the real card visually
const SkeletonCard = () => (
  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse flex flex-col h-full">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 bg-slate-700/50 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700/50 rounded w-3/4" />
        <div className="h-3 bg-slate-700/50 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-700/50 rounded w-full" />
      <div className="h-3 bg-slate-700/50 rounded w-5/6" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-slate-700/50 rounded-full w-16" />
      <div className="h-6 bg-slate-700/50 rounded-full w-20" />
    </div>
    <div className="mt-auto h-11 bg-slate-700/50 rounded-xl" />
  </div>
);

export default function Explore() {
  const { user: currentUser } = useAuth();
  const { friends } = useUserProfile();
  const navigate = useNavigate();
  const onlineIds = usePresence(currentUser?.id);
  const [relationshipStatus, setRelationshipStatus] = useState<Map<string, 'accepted' | 'pending_sent' | 'pending_received' | 'none'>>(new Map());

  // Realtime updates for instant new user appearance
  useRealtimeProfiles((newProfile) => {
    // Always add new profile to the list for instant appearance
    if (newProfile && newProfile.id) {
      setRealUsers(prevUsers => {
        // Check if profile already exists to avoid duplicates
        const exists = prevUsers.some(user => user.id === newProfile.id);
        if (!exists) {
          // Transform new profile to match expected format
          const transformedProfile = {
            id: newProfile.id,
            name: (newProfile as any).full_name || 'Expert Member',
            initials: (newProfile as any).full_name ? (newProfile as any).full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EM',
            avatar_url: newProfile.avatar_url || null,
            bio: newProfile.bio || 'No bio available',
            skills: newProfile.skills || [],
            rating: newProfile.rating || 0,
            swaps: newProfile.total_swaps || 0,
            trust_score: newProfile.rating || 0,
            exchanges: newProfile.total_swaps || 0,
            topSkill: {
              title: newProfile.skills?.[0]?.title || 'Learning',
              category: newProfile.skills?.[0]?.category || 'General',
              icon: getCategoryIcon(newProfile.skills?.[0]?.category || 'general')
            }
          };
          return [...prevUsers, transformedProfile];
        }
        return prevUsers;
      });
    }
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Fetch skills separately for each user
  const fetchUserSkills = async (userId: string) => {
    try {
      const { data: skills, error } = await supabase
        .from('skills')
        .select('title, category')
        .eq('user_id', userId) // Note: skills table still uses user_id foreign key
        .limit(3); // Limit to 3 skills per user
      
      if (error) {
        console.error(`Error fetching skills for user ${userId}:`, error);
        return [];
      }
      
      return skills || [];
    } catch (error) {
      console.error(`Error in fetchUserSkills for ${userId}:`, error);
      return [];
    }
  };

  // Helper function to fetch relationship status between current user and target
  const fetchRelationshipStatus = async (userId: string) => {
    if (!currentUser?.id) return 'none';

    try {
      const { data, error } = await supabase
        .from('swap_requests')
        .select('sender_id, receiver_id, status')
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),` +
          `and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`,
        )
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return 'none';

      if (data.status === 'accepted') return 'accepted';
      if (data.status === 'pending') {
        return data.sender_id === currentUser.id ? 'pending_sent' : 'pending_received';
      }
      return 'none';
    } catch (error) {
      console.error('Error fetching relationship status:', error);
      return 'none';
    }
  };

  // Fetch real users from Supabase
  useEffect(() => {
    const fetchRealUsers = async () => {
    setIsLoading(true);

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, bio, avatar_url, rating, total_swaps, full_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setRealUsers([]);
        setIsLoading(false);
        return;
      }

      console.log('Fetched profiles:', profiles);

      const validProfiles = profiles.filter(profile => profile.id);

      // Fetch skills for all profiles
      const profilesWithSkills = await Promise.all(validProfiles.map(async (profile) => {
        const { data: skills, error: skillsError } = await supabase
          .from('skills')
          .select('title, category')
          .eq('user_id', profile.id)
          .limit(3);

        if (skillsError) {
          console.error(`Error fetching skills for user ${profile.id}:`, skillsError);
        }

        return {
          ...profile,
          skills: skills || []
        };
      }));

      // Transform profiles to match the expected user structure with skills and fetch relationship status
      const transformedUsers = await Promise.all(profilesWithSkills.map(async (profile) => {
        const userSkills = profile.skills || [];
        const firstSkill = userSkills?.[0];

        const status = currentUser?.id ? await fetchRelationshipStatus(profile.id) : 'none';

        return {
          id: profile.id,
          name: (profile as any).full_name || 'Expert Member',
          initials: (profile as any).full_name ? (profile as any).full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EM',
          avatar_url: profile.avatar_url || null,
          bio: profile.bio || 'No bio available',
          skills: userSkills,
          rating: profile.rating || 0,
          swaps: profile.total_swaps || 0,
          trust_score: profile.rating || 0,
          exchanges: profile.total_swaps || 0,
          topSkill: {
            title: firstSkill?.title || 'Learning',
            category: firstSkill?.category || 'General',
            icon: getCategoryIcon(firstSkill?.category || 'general')
          },
          relationshipStatus: status
        };
      }));

        // Update relationship status map
        const statusMap = new Map<string, 'accepted' | 'pending_sent' | 'pending_received' | 'none'>();
        transformedUsers.forEach(user => {
          statusMap.set(user.id, user.relationshipStatus as 'accepted' | 'pending_sent' | 'pending_received' | 'none');
        });
        setRelationshipStatus(statusMap);

        setRealUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (error) {
        console.error('Error in fetchRealUsers:', error);
        setRealUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealUsers();
  }, [lastFetchTime]); // Re-fetch when lastFetchTime changes

  // Manual refresh function
  const refreshData = () => {
    setLastFetchTime(Date.now());
  };

  // Dynamic Global Filter - Computed filtered profiles
  const filteredProfiles = useMemo(() => {
    let filtered = realUsers;

    if (currentUser?.id) {
      filtered = filtered.filter(user => user.id !== currentUser.id);
    }

    if (activeCategory !== 'all') {
      const activeCat = activeCategory.toLowerCase();
      filtered = filtered.filter(user => {
        return !!user.skills && user.skills.some(
          (skill: any) => skill.category?.toLowerCase() === activeCat,
        );
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        (user.name?.toLowerCase().includes(q) || false) ||
        (user.bio?.toLowerCase().includes(q) || false) ||
        (user.skills?.some((skill: any) => skill.title?.toLowerCase().includes(q)) || false),
      );
    }

    return filtered;
  }, [realUsers, activeCategory, searchQuery]);

  // Update filteredUsers state for compatibility with existing code
  useEffect(() => {
    setFilteredUsers(filteredProfiles);
  }, [filteredProfiles]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const openProfileModal = (user: any) => {
    setSelectedUser(user);
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setSelectedUser(null);
  };

  const handleMessageClick = async (userId: string) => {
    if (!currentUser) {
      toast.error('Please log in to send messages');
      return;
    }

    try {
      // Check if conversation already exists between the two users
      const { data: existingConversation, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_one.eq.${currentUser.id},participant_two.eq.${userId}),` +
          `and(participant_one.eq.${userId},participant_two.eq.${currentUser.id})`,
        )
        .maybeSingle();

      if (checkError) {
        console.error('Error checking conversation:', checkError);
        toast.error('Failed to check conversation');
        return;
      }

      let conversationId: string;

      if (existingConversation) {
        // Use existing conversation
        conversationId = existingConversation.id;
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            participant_one: currentUser.id,
            participant_two: userId
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          toast.error('Failed to create conversation');
          return;
        }

        conversationId = newConversation.id;
      }

      // Navigate to chat with conversation ID
      navigate(`/chat/${conversationId}`);
      closeProfileModal();
    } catch (error) {
      console.error('Error in handleMessageClick:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleSwapRequest = async (user: any) => {
    if (!currentUser) {
      toast.error('Please log in to send swap requests');
      return;
    }

    if (currentUser.id === user.id) {
      toast.error('You cannot send a swap request to yourself');
      return;
    }

    try {
      // Check for existing pending request (either direction)
      const { data: existingRequest, error: checkError } = await supabase
        .from('swap_requests')
        .select('id, sender_id, receiver_id')
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),` +
          `and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`,
        )
        .eq('status', 'pending')
        .maybeSingle();

      if (checkError) {
        if (checkError.message?.includes('relation') && checkError.message?.includes('does not exist')) {
          toast.error('Swap requests table not available. Please contact administrator.');
          return;
        }
        console.error('Error checking existing requests:', checkError);
        toast.error('Error checking swap requests');
        return;
      }

      if (existingRequest) {
        if (existingRequest.sender_id === currentUser.id) {
          toast.error('You already have a pending request to this user');
        } else {
          toast('They already sent you a request — review it in Requests');
          navigate('/requests');
        }
        return;
      }

      // Create new swap request
      const { error } = await supabase
        .from('swap_requests')
        .insert({
          sender_id: currentUser.id,
          receiver_id: user.id,
          status: 'pending',
        });

      if (error) {
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          toast.error('Swap requests table not available. Please contact administrator.');
        } else {
          console.error('Error creating swap request:', error);
          toast.error('Failed to send swap request');
        }
        return;
      }

      toast.success('Swap request sent');

      // Update the card behind the modal so it flips to "Request Sent" without a refresh
      setRelationshipStatus(prev => {
        const next = new Map(prev);
        next.set(user.id, 'pending_sent');
        return next;
      });

      // Mark the modal's CTA as sent
      if (selectedUser?.id === user.id) {
        setSelectedUser(prev => prev ? { ...prev, requestSent: true } : null);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
          Discover your next skill swap
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-6 max-w-xl mx-auto">
          Connect with talented people and exchange expertise — no money needed
        </p>
        
        {/* Glassmorphism Search Bar with Refresh */}
        <div className="relative max-w-2xl mx-auto group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors z-10" />
          <input 
            type="text" 
            placeholder="Search for specific skills or users..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-14 pr-20 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/70 backdrop-blur-xl transition-all"
          />
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Refresh data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {SKILL_CATEGORIES.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-purple-500 to-violet-600 border-purple-400 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border-white/20 text-slate-400 hover:border-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              {getSkillIcon(category.id)}
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Unified Loading State - Show 8 Skeleton Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* User Cards Grid - Show all at once when loading is complete */}
      <AnimatePresence>
        {!isLoading && filteredProfiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProfiles.map((user, index) => {
              const topSkill = user.topSkill;
              
              return (
                <motion.div
                  key={user.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 flex flex-col h-full"
                >
                  {/* Header with Avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative inline-block">
                      <ModernAvatar
                        name={user.name || 'Expert Member'}
                        size="medium"
                        avatarUrl={user.avatar_url}
                      />
                      {(() => {
                        const online = isOnline(onlineIds, user.id);
                        return (
                          <div
                            className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-slate-950 ${online ? 'bg-green-500' : 'bg-slate-500'}`}
                            title={online ? 'Online' : 'Offline'}
                          />
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-white mb-1">{user.name || 'Expert Member'}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareOrCopy({
                              url: profileShareUrl(user.id),
                              title: `${user.name} on Swapill`,
                              text: `Check out ${user.name}'s profile on Swapill`,
                            });
                          }}
                          title="Share profile"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        {(user.swaps || 0) > 0 && user.rating && user.rating > 0 ? (
                          <span> ⭐ {user.rating.toFixed(1)} • {user.swaps} swaps</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">New Member</span>
                        )}
                      </div>
                    </div>
                  </div>

                {/* Bio */}
                <div className="mb-4">
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{user.bio || 'No bio available'}</p>
                </div>

                {/* Top Skill */}
                {topSkill && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                        {getSkillIcon(topSkill.category)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{topSkill.title || 'New Member'}</h4>
                        <p className="text-xs text-slate-500 capitalize">{topSkill.category || 'all'}</p>
                      </div>
                    </div>
                    
                    {/* Additional Skills */}
                    {user.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {user.skills
                          .slice(0, 3)
                          .map((skill: any, skillIndex: number) => (
                            <span key={skill.id || skillIndex} className="text-xs px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300">
                              {skill.title || 'Skill'}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-auto">
                  {(() => {
                    // If user is not logged in, show sign up button
                    if (!currentUser?.id) {
                      return (
                        <button
                          onClick={() => navigate('/signup')}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          <span>Sign up to connect</span>
                        </button>
                      );
                    }
                    
                    // Check if user is in friends list from context
                    const isFriend = friends.includes(user.id);
                    
                    if (isFriend) {
                      return (
                        <button
                          onClick={() => openProfileModal(user)}
                          className="w-full px-4 py-3 bg-transparent border-2 border-green-500 text-green-400 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500/10 hover:border-green-400 hover:text-green-300 transition-all duration-300"
                        >
                          <span>Friends</span>
                        </button>
                      );
                    }
                    
                    // Keep existing relationship status logic for pending requests
                    const status = relationshipStatus.get(user.id) || 'none';
                    
                    switch (status) {
                      case 'pending_sent':
                        return (
                          <button
                            disabled
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Request Sent</span>
                          </button>
                        );
                      case 'pending_received':
                        return (
                          <button
                            onClick={() => navigate('/requests')}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Review Request</span>
                          </button>
                        );
                      default:
                        return (
                          <button
                            onClick={() => openProfileModal(user)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            <span>Request Swap</span>
                          </button>
                        );
                    }
                  })()}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>

    {/* No Results */}
    {!isLoading && filteredProfiles.length === 0 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-12 h-12 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {activeCategory !== 'all' 
            ? `No experts found in ${SKILL_CATEGORIES.find(cat => cat.id === activeCategory)?.name || activeCategory}`
            : 'No experts found'
          }
        </h3>
        <p className="text-slate-400 mb-6">
          {activeCategory !== 'all' 
            ? 'Try exploring other categories or clear all filters'
            : 'Try adjusting your search or filters'
          }
        </p>
        <button
          onClick={() => {
            setActiveCategory('all');
            setSearchQuery('');
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all"
        >
          Clear all filters
        </button>

      </motion.div>
    )}
    
      {/* Profile Preview Modal */}
      <ProfilePreviewModal 
        isOpen={profileModalOpen}
        onClose={closeProfileModal}
        user={selectedUser}
        currentUser={currentUser}
        onRequestSwap={handleSwapRequest}
        onEditProfile={() => navigate('/profile')}
        onMessage={handleMessageClick}
        friends={friends}
      />
    </div>
  );
}
