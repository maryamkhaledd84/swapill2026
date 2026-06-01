-- Row Level Security (RLS) policies for profiles table
-- These policies ensure users can only access their own profiles

-- Policy: Users can view all profiles (public read access)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add comments for policy documentation
COMMENT ON POLICY "Public profiles are viewable by everyone" ON public.profiles IS 'Allows anyone to view user profiles for discovery';
COMMENT ON POLICY "Users can insert their own profile" ON public.profiles IS 'Users can only create their own profile';
COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS 'Users can only update their own profile';
COMMENT ON POLICY "Users can delete their own profile" ON public.profiles IS 'Users can only delete their own profile';
