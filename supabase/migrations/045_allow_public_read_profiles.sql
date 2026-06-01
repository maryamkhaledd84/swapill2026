-- Allow public read access to profiles table
-- This fixes 401 Unauthorized errors when fetching profiles from the frontend

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT) for authenticated and anonymous users
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles 
FOR SELECT 
TO public, authenticated 
USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Allow authenticated users to insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Allow authenticated users to update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
