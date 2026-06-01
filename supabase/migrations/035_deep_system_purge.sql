-- Deep System Purge to eliminate Unknown User and Member-unknown entries
-- This migration performs aggressive cleanup of orphaned data

-- 1. Identify & Destroy Orphaned Messages
DELETE FROM public.messages WHERE sender_id NOT IN (SELECT id FROM auth.users);

-- Note: messages table only has sender_id, no receiver_id based on current schema

-- 2. Clean Room/Conversation Table
DELETE FROM public.conversations WHERE id NOT IN (SELECT conversation_id FROM public.messages);

-- 3. Force Profile Cleanup
DELETE FROM public.profiles WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Additional cleanup for profiles with null/unknown names
DELETE FROM public.profiles 
WHERE full_name IS NULL 
   OR full_name = 'Unknown User' 
   OR full_name = 'Member-unknown'
   OR full_name = 'null'
   OR full_name = '';

-- Log cleanup results
DO $$
DECLARE
  messages_count INTEGER;
  conversations_count INTEGER;
  profiles_count INTEGER;
BEGIN
  RAISE LOG 'Deep System Purge completed successfully';
END $$;
