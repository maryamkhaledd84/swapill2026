import { isUserCorrupted } from './safeFallbacks';

/**
 * Validates if a user profile should be rendered.
 * Conservative: only skip when there's literally nothing usable.
 */
export const shouldRenderUser = (profile?: any, user?: any): boolean => {
  if (isUserCorrupted(profile, user)) return false;

  // Need *some* identifier
  if (!profile?.id && !user?.id) return false;

  // Need *some* display name (full_name OR username OR email-derived).
  // The live DB legitimately has username=null on most rows, so we don't
  // require it as long as full_name is present.
  const fullName = (profile?.full_name || '').trim();
  const username = (profile?.username || '').trim();
  if (!fullName && !username) return false;

  if (fullName === 'Unknown User' || fullName === 'null') return false;

  return true;
};

/**
 * Validates a conversation should be displayed
 */
export const shouldRenderConversation = (conversation: any): boolean => {
  if (!conversation?.other_user) return false;
  if (!conversation.other_user.id) return false;
  return shouldRenderUser(conversation.other_user);
};

export const filterValidUsers = (users: any[]): any[] => users.filter(shouldRenderUser);

export const filterValidConversations = (conversations: any[]): any[] =>
  conversations.filter(shouldRenderConversation);

/**
 * Validates profile data completeness
 */
export const validateProfileCompleteness = (profile: any): {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
} => {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  if (!profile?.id) missingFields.push('id');
  if (!profile?.full_name && !profile?.username) missingFields.push('name');
  if (!profile?.email) warnings.push('email');

  if (!profile?.bio) warnings.push('bio');
  if (!profile?.avatar_url) warnings.push('avatar_url');
  if (!profile?.skills_offered?.length && !profile?.skills?.length) warnings.push('skills');

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
  };
};
