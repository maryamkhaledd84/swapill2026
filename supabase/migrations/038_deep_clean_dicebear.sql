-- Deep Clean: Wipe out every single dicebear link from profiles table
-- This will set all dicebear.com avatar URLs to NULL

UPDATE public.profiles SET avatar_url = NULL WHERE avatar_url LIKE '%dicebear.com%';
