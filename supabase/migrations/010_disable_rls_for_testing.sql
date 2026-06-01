-- TEMPORARY: Disable RLS for testing to isolate the issue
-- RUN THIS ONLY FOR DEBUGGING PURPOSES

-- Check current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Command to re-enable RLS after testing (SAVE THIS FOR LATER):
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Test query to see if we can manually insert a profile
-- (This will help us identify if the issue is RLS or table structure)
-- TEST WITH ACTUAL USER ID AFTER RUNNING THIS:

-- INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
-- VALUES ('test-user-id', 'Test User', NOW(), NOW());
