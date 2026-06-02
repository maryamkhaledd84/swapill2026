-- Supabase RLS Fix Script
-- Run this in the Supabase SQL Editor to fix RLS policies

-- Enable RLS on messages table if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages" ON messages;
DROP POLICY IF EXISTS "Users can delete messages" ON messages;

-- Create SELECT policy for messages
-- Users can view messages in conversations they are part of
CREATE POLICY "Users can view messages in their conversations"
ON messages
FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE participant_one = auth.uid() OR participant_two = auth.uid()
  )
);

-- Create INSERT policy for messages
-- Users can insert messages into conversations they are part of
CREATE POLICY "Users can insert messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE participant_one = auth.uid() OR participant_two = auth.uid()
  )
);

-- Create UPDATE policy for messages
-- Users can update messages they sent (to mark as read, etc.)
-- Also allow updating is_read for messages received in their conversations
CREATE POLICY "Users can update messages"
ON messages
FOR UPDATE
TO authenticated
USING (
  -- Allow updating messages they sent
  sender_id = auth.uid()
  OR
  -- Allow updating is_read for messages in their conversations
  (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_one = auth.uid() OR participant_two = auth.uid()
    )
    AND is_read = false
  )
)
WITH CHECK (
  -- Allow updating messages they sent
  sender_id = auth.uid()
  OR
  -- Allow updating is_read for messages in their conversations
  (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_one = auth.uid() OR participant_two = auth.uid()
    )
    AND is_read = false
  )
);

-- Create DELETE policy for messages
-- Users can delete messages they sent
CREATE POLICY "Users can delete messages"
ON messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

-- Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create SELECT policy for profiles
-- Allow authenticated users to view all profiles (needed for chat avatars, etc.)
CREATE POLICY "Users can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Create UPDATE policy for profiles
-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create INSERT policy for profiles
-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());
