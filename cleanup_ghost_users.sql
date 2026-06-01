-- SQL Cleanup: Delete orphaned profiles from public.profiles table
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Verify the cleanup worked
SELECT COUNT(*) as remaining_orphaned_profiles FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Check for any remaining 'Unknown User' profiles
SELECT * FROM public.profiles WHERE full_name = 'Unknown User' OR full_name IS NULL OR full_name = '';
