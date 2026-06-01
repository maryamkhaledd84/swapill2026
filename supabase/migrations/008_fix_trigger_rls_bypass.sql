-- Fix trigger to bypass RLS policies
-- The trigger needs to be able to insert profiles regardless of RLS policies

-- First, drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the function to properly handle the INSERT with RLS bypass
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use SET LOCAL to bypass RLS for this specific operation
  SET LOCAL row_security = off;
  
  INSERT INTO public.profiles (user_id, full_name, rating, swaps_count, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@')[1]),
    0.0, -- Default rating
    0,   -- Default swaps_count
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add a policy to allow the service role to bypass RLS for profile creation
CREATE POLICY "Service role can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Update comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile entry for new authenticated users with RLS bypass and default values';
