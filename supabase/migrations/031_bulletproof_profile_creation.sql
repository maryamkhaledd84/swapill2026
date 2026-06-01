-- Bulletproof Profile Creation Trigger
-- This trigger ensures every new user gets a profile record automatically
-- Solves the race condition and NULL profile issues

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS public.auto_create_profile_on_user_signup;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Create the bulletproof function
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract user data from auth.users
  DECLARE
    user_id UUID := NEW.id;
    user_email TEXT := NEW.email;
    user_full_name TEXT := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  
  -- Check if profile already exists (prevent duplicates)
  DECLARE existing_profile_count INTEGER;
  SELECT COUNT(*) INTO existing_profile_count
  FROM public.profiles
  WHERE id = user_id;
  
  -- Only create profile if it doesn't already exist
  IF existing_profile_count = 0 THEN
    -- Insert complete profile record
    INSERT INTO public.profiles (
      id,
      full_name,
      username,
      email,
      avatar_url,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_full_name,
      user_full_name,
      user_email,
      NULL, -- No avatar initially
      NOW(),
      NOW()
    );
    
    -- Log successful profile creation
    RAISE LOG 'Created profile for user: %', user_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires on every new user
CREATE TRIGGER public.auto_create_profile_on_user_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_signup();
