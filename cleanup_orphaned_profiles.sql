-- CLEAN UP ORPHANED PROFILES AND VERIFY CASCADE DELETE
-- Run this in Supabase SQL Editor to clean up ghost cards

-- Step 1: Check current foreign key setup
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
    AND tc.table_name = 'profiles'
ORDER BY tc.table_name, tc.constraint_name;

-- Step 2: Count orphaned profiles before cleanup
SELECT 
    'Orphaned profiles before cleanup' as status,
    COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL;

-- Step 3: Show sample of orphaned records (for review)
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.email,
    p.created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL
LIMIT 10;

-- Step 4: Delete orphaned profiles records
DELETE FROM public.profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Step 5: Verify cleanup was successful
SELECT 
    'Orphaned profiles after cleanup' as status,
    COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL;

-- Step 6: Check if cascade delete is properly set
-- If the delete_rule is not 'CASCADE', run the following:
/*
-- Fix cascade delete if missing
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey,
ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
*/

-- Step 7: Verify skills table cascade delete
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
    AND tc.table_name = 'skills'
ORDER BY tc.table_name, tc.constraint_name;

-- Step 8: Clean up orphaned skills records
DELETE FROM public.skills 
WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM auth.users);

-- Step 9: Final verification
SELECT 
    'Cleanup complete' as status,
    'Ghost cards should now be removed from Explore page' as message;

-- Step 10: Count remaining records
SELECT 
    'Total profiles remaining' as table_type,
    COUNT(*) as count
FROM public.profiles;

SELECT 
    'Total skills remaining' as table_type,
    COUNT(*) as count
FROM public.skills;
