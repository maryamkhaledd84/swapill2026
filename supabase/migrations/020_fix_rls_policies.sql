-- Fix RLS policies for profiles and skills tables
-- This ensures authenticated users can insert/update their own profiles and skills

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- Drop existing skills policies
DROP POLICY IF EXISTS "Users can view own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can insert own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can update own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can delete own skills" ON public.skills;

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for profiles table
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create proper RLS policies for skills table
CREATE POLICY "Users can view all skills" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own skills" ON public.skills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = skills.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own skills" ON public.skills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = skills.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own skills" ON public.skills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = skills.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.skills TO authenticated;

-- Add comments for clarity
COMMENT ON POLICY "Users can insert own profile" ON public.profiles IS 'Allows users to insert their own profile using their auth user ID';
COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 'Allows users to update their own profile using their auth user ID';
COMMENT ON POLICY "Users can insert own skills" ON public.skills IS 'Allows users to insert skills for their own profile through profile_id relationship';
COMMENT ON POLICY "Users can update own skills" ON public.skills IS 'Allows users to update skills for their own profile through profile_id relationship';
