-- Auto-create profile when user is created in auth.users
-- This ensures 100% reliability for new user profiles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a profile row for the new user
  INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    bio,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'New member on Swapill',
    NULL,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER public.auto_create_profile
AFTER INSERT ON public.auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
