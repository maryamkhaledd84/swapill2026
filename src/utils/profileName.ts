/**
 * Global utility for getting consistent profile names across the app
 * This ensures all components use the same logic for displaying user names
 */

import { AuthUser } from '../contexts/AuthContext';

/**
 * Get the display name for a user with proper fallbacks
 * Priority order: user.full_name > user.email prefix > 'Expert Member'
 */
export const getProfileName = (user: AuthUser | null): string => {
  if (!user) return 'Guest';
  
  // Priority 1: Use user.full_name if available
  if (user.full_name) {
    return user.full_name.trim();
  }
  
  // Priority 2: Use email prefix as fallback
  if (user.email) {
    const emailPrefix = user.email.split('@')[0];
    return emailPrefix.trim();
  }
  
  // Final fallback
  return 'Expert Member';
};

/**
 * Get user initials consistently across the app
 */
export const getProfileInitials = (user: AuthUser | null): string => {
  const name = getProfileName(user);
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if user has a complete profile
 */
export const hasCompleteProfile = (user: AuthUser | null): boolean => {
  return !!(user?.full_name && user?.full_name !== 'New member on Swapill');
};
