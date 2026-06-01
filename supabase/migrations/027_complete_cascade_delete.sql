-- Complete Cascade Delete Solution for Swapill
-- This ensures when a user is deleted from auth.users, all their data is automatically cleaned up

-- First, drop existing trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate improved trigger function with better profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, bio, skills_offered, skills_wanted, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@')[1]),
    'Passionate about skill swapping and learning new things!',
    '{}',
    '{}',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create cascade delete function for auth user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the deletion for debugging
  RAISE NOTICE 'Deleting user and all related data for user_id: %', OLD.id;
  
  -- Delete user's skills
  DELETE FROM public.skills WHERE user_id = OLD.id;
  
  -- Delete user's conversations (this will cascade to messages)
  DELETE FROM public.conversations 
  WHERE participant_one = OLD.id OR participant_two = OLD.id;
  
  -- Delete user's messages (redundant but safe)
  DELETE FROM public.messages WHERE sender_id = OLD.id;
  
  -- Profile will be automatically deleted due to ON DELETE CASCADE in the table definition
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_deletion();

-- Add comments for documentation
COMMENT ON FUNCTION public.handle_user_deletion() IS 'Cascades deletion of all user data when auth user is deleted';
COMMENT ON TRIGGER on_auth_user_deleted IS 'Ensures complete cleanup of user data when account is deleted';

-- Ensure proper foreign key constraints with cascade delete
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_user_id_fkey,
  ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Check if skills table has proper foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'skills_user_id_fkey' 
    AND table_name = 'skills'
  ) THEN
    ALTER TABLE public.skills 
      ADD CONSTRAINT skills_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Check if messages table has proper foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_sender_id_fkey' 
    AND table_name = 'messages'
  ) THEN
    ALTER TABLE public.messages 
      ADD CONSTRAINT messages_sender_id_fkey 
      FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Check if conversations table has proper foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_participant_one_fkey' 
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE public.conversations 
      ADD CONSTRAINT conversations_participant_one_fkey 
      FOREIGN KEY (participant_one) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_participant_two_fkey' 
    AND table_name = 'conversations'
  ) THEN
    ALTER TABLE public.conversations 
      ADD CONSTRAINT conversations_participant_two_fkey 
      FOREIGN KEY (participant_two) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create a function to manually clean up orphaned data (for existing data)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_data()
RETURNS TABLE(table_name TEXT, deleted_count INTEGER) AS $$
DECLARE
  deleted_profiles INTEGER;
  deleted_skills INTEGER;
  deleted_messages INTEGER;
  deleted_conversations INTEGER;
BEGIN
  -- Clean up orphaned profiles
  DELETE FROM public.profiles 
  WHERE user_id NOT IN (SELECT id FROM auth.users);
  GET DIAGNOSTICS deleted_profiles = ROW_COUNT;
  
  -- Clean up orphaned skills
  DELETE FROM public.skills 
  WHERE user_id NOT IN (SELECT id FROM auth.users);
  GET DIAGNOSTICS deleted_skills = ROW_COUNT;
  
  -- Clean up orphaned messages
  DELETE FROM public.messages 
  WHERE sender_id NOT IN (SELECT id FROM auth.users);
  GET DIAGNOSTICS deleted_messages = ROW_COUNT;
  
  -- Clean up orphaned conversations
  DELETE FROM public.conversations 
  WHERE participant_one NOT IN (SELECT id FROM auth.users) 
  OR participant_two NOT IN (SELECT id FROM auth.users);
  GET DIAGNOSTICS deleted_conversations = ROW_COUNT;
  
  -- Return results
  RETURN QUERY VALUES 
    ('profiles', deleted_profiles),
    ('skills', deleted_skills),
    ('messages', deleted_messages),
    ('conversations', deleted_conversations);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for cleanup function
COMMENT ON FUNCTION public.cleanup_orphaned_data() IS 'Cleans up any orphaned data from deleted users';

-- Run cleanup once to fix existing data
SELECT * FROM public.cleanup_orphaned_data();
