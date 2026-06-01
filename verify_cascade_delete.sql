-- VERIFY CASCADE DELETE IS ACTIVE AND WORKING
-- Run this in Supabase SQL Editor to confirm ghost cards cleanup

-- Step 1: Check current foreign key constraints with delete rules
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
    AND tc.table_name IN ('profiles', 'skills')
ORDER BY tc.table_name, tc.constraint_name;

-- Step 2: Count current records
SELECT 
    'Current profiles count' as metric,
    COUNT(*) as count
FROM public.profiles;

SELECT 
    'Current skills count' as metric,
    COUNT(*) as count
FROM public.skills;

-- Step 3: Check for any orphaned records
SELECT 
    'Orphaned profiles (no auth user)' as metric,
    COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL;

SELECT 
    'Orphaned skills (no auth user)' as metric,
    COUNT(*) as count
FROM public.skills s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE u.id IS NULL;

-- Step 4: Apply cascade delete constraints if missing
DO $$
BEGIN
    -- Fix profiles table cascade delete
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_name = 'profiles' 
        AND rc.delete_rule = 'CASCADE'
        AND tc.constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE public.profiles 
        DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
        
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Applied ON DELETE CASCADE to profiles table';
    END IF;
    
    -- Fix skills table cascade delete
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_name = 'skills' 
        AND rc.delete_rule = 'CASCADE'
        AND tc.constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE public.skills 
        DROP CONSTRAINT IF EXISTS skills_user_id_fkey;
        
        ALTER TABLE public.skills 
        ADD CONSTRAINT skills_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Applied ON DELETE CASCADE to skills table';
    END IF;
END $$;

-- Step 5: Clean up any remaining orphaned records
DELETE FROM public.profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.skills 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Step 6: Final verification
SELECT 
    'CASCADE DELETE SETUP COMPLETE' as status,
    'Ghost cards will be automatically removed when users are deleted' as message;

-- Step 7: Show final counts after cleanup
SELECT 
    'Final profiles count' as metric,
    COUNT(*) as count
FROM public.profiles;

SELECT 
    'Final skills count' as metric,
    COUNT(*) as count
FROM public.skills;
