-- FIX SKILLS RLS POLICIES - Use auth.uid() correctly
-- This fixes the skills table policies to properly work with auth.uid()

-- Drop existing skills policies
DROP POLICY IF EXISTS "Users can view all skills" ON public.skills;
DROP POLICY IF EXISTS "Users can insert own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can update own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can delete own skills" ON public.skills;

-- Create correct policies for skills table
CREATE POLICY "Users can view all skills" ON public.skills FOR SELECT USING (true);

CREATE POLICY "Users can insert own skills" ON public.skills FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = skills.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own skills" ON public.skills FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = skills.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own skills" ON public.skills FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = skills.profile_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Also ensure profiles policies are correct
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.skills TO authenticated;
