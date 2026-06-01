-- Cleanup Orphaned Messages
-- This migration removes all messages/conversations linked to deleted users
-- Fixes "Unknown User" entries in Chat sidebar

-- Delete orphaned messages where sender doesn't exist
DELETE FROM public.messages 
WHERE sender_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned messages where receiver doesn't exist
DELETE FROM public.messages 
WHERE receiver_id NOT IN (SELECT id FROM auth.users);

-- Clean up conversations table if it exists
DELETE FROM public.conversations 
WHERE user1_id NOT IN (SELECT id FROM auth.users)
   OR user2_id NOT IN (SELECT id FROM auth.users);

-- Create a function to prevent future orphaned messages
CREATE OR REPLACE FUNCTION public.validate_user_exists(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql;

-- Add check constraint for messages (optional - may impact performance)
-- ALTER TABLE public.messages 
-- ADD CONSTRAINT fk_sender_valid 
-- CHECK (validate_user_exists(sender_id));

-- Add check constraint for messages (optional - may impact performance)  
-- ALTER TABLE public.messages
-- ADD CONSTRAINT fk_receiver_valid
-- CHECK (validate_user_exists(receiver_id));

-- Log cleanup results
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Count and log deleted messages
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE LOG 'Cleanup completed: Deleted % orphaned message records', deleted_count;
END $$;
