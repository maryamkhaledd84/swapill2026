-- Add image_url column to profiles table
-- This column will store the URL of the user's profile photo

ALTER TABLE public.profiles 
ADD COLUMN image_url TEXT;

-- Add comment for the new column
COMMENT ON COLUMN public.profiles.image_url IS 'URL to user profile photo stored in Supabase Storage';

-- Create index for better performance on image_url queries
CREATE INDEX IF NOT EXISTS profiles_image_url_idx ON public.profiles(image_url) WHERE image_url IS NOT NULL;
