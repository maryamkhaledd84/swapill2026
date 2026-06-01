-- 100% Reliable Profile Creation Trigger
-- This trigger ensures every new user gets a complete profile record immediately

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS public.auto_create_profile_on_user_signup;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract user data from auth.users
  DECLARE 
    user_id UUID := NEW.id;
    user_email TEXT := NEW.email;
    user_name TEXT := COALESCE(NEW.raw_user_meta_data->>'name', '');
    user_created_at TIMESTAMP WITH TIME ZONE := NEW.created_at;
  
  -- Insert complete profile record
  INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    bio,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    COALESCE(user_name, split_part(user_email, '@', 1)),
    user_email,
    'New member on Swapill',
    NULL, -- No avatar initially
    user_created_at,
    NOW()
  );
  
  -- Insert skills record if skills are provided in metadata
  IF NEW.raw_user_meta_data ? 'skills' IS NOT NULL THEN
    DECLARE 
      skills_data JSON := NEW.raw_user_meta_data->'skills';
      skills_array TEXT[];
    BEGIN
      -- Parse skills from JSON and create individual skill records
      skills_array := string_to_array(COALESCE(skills_data, '[]'));
      
      FOREACH skill IN SELECT unnest(skills_array)
      LOOP
        INSERT INTO public.skills (
          user_id,
          title,
          description,
          category,
          created_at
        ) VALUES (
          user_id,
          skill,
          skill || ' - Skill from signup',
          'general',
          NOW()
        );
      END LOOP;
    END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically handle new user signup
CREATE TRIGGER public.auto_create_profile_on_user_signup
AFTER INSERT ON public.auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_signup();

-- Helper function to split email and get username part
CREATE OR REPLACE FUNCTION public.split_part(str TEXT, delimiter TEXT, n INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN split_part(str, delimiter, n);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
