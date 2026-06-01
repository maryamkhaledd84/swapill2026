-- Ensure New User Defaults: Update profile trigger to explicitly set rating=0 and swaps_count=0
-- This ensures new users get proper default values on registration

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger with explicit default values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_id UUID := NEW.id;
  user_email TEXT := NEW.email;
  user_full_name TEXT := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(user_email, '@', 1));
  existing_profile_count INTEGER;
BEGIN
  -- Check if profile already exists
  SELECT COUNT(*) INTO existing_profile_count
  FROM public.profiles
  WHERE id = user_id;
  
  -- Only create profile if it doesn't already exist
  IF existing_profile_count = 0 THEN
    -- Insert complete profile record with explicit defaults
    INSERT INTO public.profiles (
      id,
      full_name,
      username,
      email,
      avatar_url,
      rating,
      swaps_count,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_full_name,
      user_full_name,
      user_email,
      NULL, -- No avatar initially
      0.0, -- Explicit default rating
      0, -- Explicit default swaps_count
      NOW(),
      NOW()
    );
    
    -- Log successful profile creation
    RAISE LOG 'Created profile for user: % with rating=0 and swaps_count=0', user_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
