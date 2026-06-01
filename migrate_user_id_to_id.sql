-- Migration: Rename user_id to id in profiles table and update all foreign key references
-- This standardizes the primary key to use 'id' across all tables

-- Step 1: Drop existing foreign key constraints
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_user_id_fkey;
ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_sender_id_fkey;
ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_receiver_id_fkey;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_participant_one_fkey;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_participant_two_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- Step 2: Rename user_id to id in profiles table
ALTER TABLE profiles RENAME COLUMN user_id TO id;

-- Step 3: Update foreign key references in skills table
ALTER TABLE skills ADD CONSTRAINT skills_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 4: Update foreign key references in swap_requests table
ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_receiver_id_fkey 
    FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 5: Update foreign key references in conversations table
ALTER TABLE conversations ADD CONSTRAINT conversations_participant_one_fkey 
    FOREIGN KEY (participant_one) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE conversations ADD CONSTRAINT conversations_participant_two_fkey 
    FOREIGN KEY (participant_two) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 6: Update foreign key references in messages table
ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 7: Update RLS policies to use id instead of user_id
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Update other RLS policies that reference profiles
DROP POLICY IF EXISTS "Users can view their own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can manage their own skills" ON public.skills;

CREATE POLICY "Users can view their own skills" ON public.skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own skills" ON public.skills FOR ALL USING (auth.uid() = user_id);

-- Step 9: Update swap_requests RLS policies
DROP POLICY IF EXISTS "Users can view swap requests" ON public.swap_requests;
DROP POLICY IF EXISTS "Users can create swap requests" ON public.swap_requests;
DROP POLICY IF EXISTS "Users can update swap requests" ON public.swap_requests;

CREATE POLICY "Users can view swap requests" ON public.swap_requests FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can create swap requests" ON public.swap_requests FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);
CREATE POLICY "Users can update swap requests" ON public.swap_requests FOR UPDATE USING (
    auth.uid() = receiver_id
);

-- Step 10: Update conversations RLS policies
DROP POLICY IF EXISTS "Users can view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

CREATE POLICY "Users can view conversations" ON public.conversations FOR SELECT USING (
    auth.uid() = participant_one OR auth.uid() = participant_two
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
    auth.uid() = participant_one OR auth.uid() = participant_two
);

-- Step 11: Update messages RLS policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() IN (SELECT participant_one FROM conversations WHERE id = conversation_id) OR 
    auth.uid() IN (SELECT participant_two FROM conversations WHERE id = conversation_id)
);
CREATE POLICY "Users can create messages" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);

-- Step 12: Recreate indexes if needed
DROP INDEX IF EXISTS idx_profiles_user_id;
CREATE INDEX idx_profiles_id ON public.profiles(id);

-- Migration complete
SELECT 'Migration completed: user_id renamed to id in profiles table and all foreign key references updated' as status;
