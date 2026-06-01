-- Final Database Cleanup: Remove any remaining dicebear links
-- This ensures all avatar_url values are either NULL or real uploaded photos

UPDATE public.profiles SET avatar_url = NULL WHERE avatar_url LIKE '%dicebear.com%';
