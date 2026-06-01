-- Trigger to automatically create profile when user signs up
-- This trigger ensures every new user gets a profile entry

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@')[1]),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that calls the function for new users
DROP TRIGGER IF EXISTS on_auth_user_created;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comments for trigger documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile entry for new authenticated users';
COMMENT ON TRIGGER on_auth_user_created IS 'Automatically creates profile when user signs up via authentication';
