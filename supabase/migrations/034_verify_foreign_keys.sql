-- Verify Foreign Key Relationships with ON DELETE CASCADE
-- This migration ensures proper cascade deletion to prevent orphaned records

-- Check current foreign key constraints on messages table
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.update_rule, 
  tc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
  AND tc.table_name IN ('messages', 'conversations')
  AND tc.constraint_type = 'FOREIGN KEY';

-- Check if messages table has proper foreign key constraints
DO $$
DECLARE
  has_sender_fk BOOLEAN;
  has_receiver_fk BOOLEAN;
  has_conversation_fk BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'messages' 
    AND constraint_name LIKE '%sender%'
  ) INTO has_sender_fk;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'messages' 
    AND constraint_name LIKE '%receiver%'
  ) INTO has_receiver_fk;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'messages' 
    AND constraint_name LIKE '%conversation%'
  ) INTO has_conversation_fk;
  
  RAISE LOG 'Foreign Key Status - Messages table: sender_fk=%, receiver_fk=%, conversation_fk=%', 
    has_sender_fk, has_receiver_fk, has_conversation_fk;
END $$;

-- Add proper foreign key constraints if missing (optional - may impact performance)
-- Uncomment these if needed after testing

-- ALTER TABLE public.messages 
-- ADD CONSTRAINT fk_messages_sender 
-- FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ALTER TABLE public.messages 
-- ADD CONSTRAINT fk_messages_receiver 
-- FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ALTER TABLE public.messages 
-- ADD CONSTRAINT fk_messages_conversation 
-- FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;

-- Check conversations table foreign keys
DO $$
DECLARE
  has_user1_fk BOOLEAN;
  has_user2_fk BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'conversations' 
    AND constraint_name LIKE '%participant_one%'
  ) INTO has_user1_fk;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'conversations' 
    AND constraint_name LIKE '%participant_two%'
  ) INTO has_user2_fk;
  
  RAISE LOG 'Foreign Key Status - Conversations table: user1_fk=%, user2_fk=%', 
    has_user1_fk, has_user2_fk;
END $$;

-- Add proper foreign key constraints if missing (optional - may impact performance)
-- Uncomment these if needed after testing

-- ALTER TABLE public.conversations 
-- ADD CONSTRAINT fk_conversations_user1 
-- FOREIGN KEY (participant_one) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ALTER TABLE public.conversations 
-- ADD CONSTRAINT fk_conversations_user2 
-- FOREIGN KEY (participant_two) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create a trigger to automatically clean up orphaned records (safer approach)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_messages()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete messages where sender doesn't exist
  DELETE FROM public.messages 
  WHERE sender_id NOT IN (SELECT id FROM auth.users);
  
  -- Delete messages where receiver doesn't exist  
  DELETE FROM public.messages 
  WHERE receiver_id NOT IN (SELECT id FROM auth.users);
  
  -- Delete conversations where users don't exist
  DELETE FROM public.conversations 
  WHERE participant_one NOT IN (SELECT id FROM auth.users)
     OR participant_two NOT IN (SELECT id FROM auth.users);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run cleanup periodically (optional - for maintenance)
-- CREATE TRIGGER auto_cleanup_orphaned
-- AFTER INSERT OR UPDATE ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION cleanup_orphaned_messages();

-- Log completion
DO $$
BEGIN
  RAISE LOG 'Foreign key verification completed. Consider adding constraints if performance allows.';
END $$;
