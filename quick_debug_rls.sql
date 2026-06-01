-- QUICK DEBUG FOR 500 ERROR - Check RLS Policies and Tables
-- Run this in Supabase SQL Editor to debug the issue

-- Check if profiles table exists and has data
SELECT 
  'profiles table count' as metric,
  COUNT(*) as count
FROM public.profiles;

-- Check if skills table exists and has data
SELECT 
  'skills table count' as metric,
  COUNT(*) as count
FROM public.skills;

-- Check current RLS policies
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

-- Test a simple profiles query (this should work)
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  bio,
  rating,
  swaps_count,
  created_at
FROM public.profiles 
LIMIT 5;

-- Check if there are any authentication issues
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- Check if the user has proper permissions
SELECT 
  has_table_privilege('public.profiles', 'SELECT') as can_select_profiles,
  has_table_privilege('public.skills', 'SELECT') as can_select_skills;
