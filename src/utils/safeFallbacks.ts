// Safe fallback utilities to prevent null/undefined crashes

/**
 * Safe fallback for user names
 */
export const getSafeName = (profile?: any, user?: any): string => {
  return profile?.full_name || 
         profile?.username || 
         user?.email?.split("@")[0] || 
         `Member-${profile?.id?.slice(0, 8) || 'unknown'}`;
};

/**
 * Safe fallback for user bio
 */
export const getSafeBio = (profile?: any): string => {
  return profile?.bio || 'No bio yet';
};

/**
 * Safe fallback for user skills
 */
export const getSafeSkills = (profile?: any): any[] => {
  return profile?.skills || profile?.skills_offered || [];
};

/**
 * Safe fallback for avatar URL
 */
export const getSafeAvatar = (profile?: any, name?: string): string => {
  if (profile?.avatar_url) {
    return profile.avatar_url;
  }
  const safeName = name || getSafeName(profile);
  return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${safeName}`;
};

/**
 * Safe fallback for user initials
 */
export const getSafeInitials = (name?: string): string => {
  const safeName = name || 'Member';
  return safeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

/**
 * Check if user data is completely corrupted
 */
export const isUserCorrupted = (profile?: any, user?: any): boolean => {
  return !profile && !user;
};

/**
 * Safe fallback for user rating
 */
export const getSafeRating = (profile?: any): number => {
  return profile?.rating || 0;
};

/**
 * Safe fallback for user swaps/exchanges
 */
export const getSafeSwaps = (profile?: any): number => {
  return profile?.swaps || profile?.total_swaps || profile?.completedExchanges || 0;
};
