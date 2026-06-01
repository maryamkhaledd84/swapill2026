-- CASCADE DELETE SETUP AND ORPHANED RECORDS CLEANUP
-- Run this in Supabase SQL Editor to ensure proper cascade delete functionality

-- Step 1: Check current foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND (tc.table_name = 'profiles' OR tc.table_name = 'skills')
ORDER BY tc.table_name, tc.constraint_name;

-- Step 2: Check for orphaned records in profiles table
SELECT 
    'Orphaned profiles' as record_type,
    COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL;

-- Step 3: Check for orphaned records in skills table (both scenarios)
SELECT 
    'Orphaned skills (by user_id)' as record_type,
    COUNT(*) as count
FROM public.skills s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE u.id IS NULL AND s.user_id IS NOT NULL;

SELECT 
    'Orphaned skills (by profile_id)' as record_type,
    COUNT(*) as count
FROM public.skills s
LEFT JOIN public.profiles p ON s.profile_id = p.id
WHERE p.id IS NULL AND s.profile_id IS NOT NULL;

-- Step 4: Show sample of orphaned records (if any exist)
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL
LIMIT 5;

-- Step 5: Clean up orphaned records (UNCOMMENT TO EXECUTE)
/*
-- Delete orphaned profiles (no matching auth user)
DELETE FROM public.profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned skills (no matching auth user)
DELETE FROM public.skills 
WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned skills (no matching profile)
DELETE FROM public.skills 
WHERE profile_id IS NOT NULL AND profile_id NOT IN (SELECT id FROM public.profiles);
*/

-- Step 6: Ensure proper cascade delete setup
-- Check if skills table uses user_id or profile_id
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'skills' 
    AND table_schema = 'public'
    AND (column_name = 'user_id' OR column_name = 'profile_id');

-- Step 7: Add proper cascade delete if missing (UNCOMMENT TO EXECUTE)
/*
-- If skills table uses user_id and doesn't have cascade delete:
ALTER TABLE public.skills 
DROP CONSTRAINT IF EXISTS skills_user_id_fkey,
ADD CONSTRAINT skills_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- If skills table uses profile_id and doesn't have cascade delete:
ALTER TABLE public.skills 
DROP CONSTRAINT IF EXISTS skills_profile_id_fkey,
ADD CONSTRAINT skills_profile_id_fkey 
    FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
*/

-- Step 8: Verify RLS policies are still intact
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'skills')
ORDER BY tablename, policyname;

-- Step 9: Test cascade delete functionality (READ-ONLY TEST)
-- This shows what would be deleted if a user is removed
SELECT 
    'User to test' as table_type,
    u.id,
    u.email,
    u.created_at
FROM auth.users u
LIMIT 1;

-- Show dependent records for that user
SELECT 
    'Dependent profiles' as table_type,
    p.id,
    p.user_id,
    p.full_name
FROM public.profiles p
WHERE p.user_id = (SELECT id FROM auth.users LIMIT 1);

SELECT 
    'Dependent skills' as table_type,
    s.id,
    s.user_id,
    s.title
FROM public.skills s
WHERE s.user_id = (SELECT id FROM auth.users LIMIT 1);

-- Step 10: Final verification
SELECT 
    'Setup complete' as status,
    'Check foreign key rules above to confirm ON DELETE CASCADE is active' as message;
