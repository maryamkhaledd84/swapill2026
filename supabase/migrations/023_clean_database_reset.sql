-- CLEAN DATABASE RESET AND 40 USER INSERTION
-- This script will reset the database and insert exactly 40 users with specific details

-- Step 1: Clean Slate - Delete all existing data (preserve auth users)
DELETE FROM public.skills;
DELETE FROM public.profiles;

-- Step 2: Reset sequences if any
-- (Using UUIDs so no sequences needed)

-- Step 3: Insert Maryam Khaled with real Auth UID first
INSERT INTO public.profiles (id, user_id, full_name, bio, avatar_url, rating, swaps_count, created_at, updated_at) VALUES
(gen_random_uuid(), 'e08b5109-a903-4fd3-8979-a5707fb11cbe', 'Maryam Khaled', 'Frontend developer specializing in React and Supabase integrations. Passionate about creating beautiful and functional web applications.', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.9, 23, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  rating = EXCLUDED.rating,
  swaps_count = EXCLUDED.swaps_count,
  updated_at = NOW();

-- Step 4: Prepare for 39 expert profiles
-- The following will be a template - user will provide the specific list
-- Each expert will get a unique user_id using gen_random_uuid()

-- Example structure (will be replaced with actual data):
INSERT INTO public.profiles (id, user_id, full_name, bio, avatar_url, rating, swaps_count, created_at, updated_at) VALUES
-- Expert 1: Ahmed Mansour
(gen_random_uuid(), gen_random_uuid(), 'Ahmed Mansour', 'Passionate Web Developer with 3 years experience in modern React applications', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 4.9, 23, NOW(), NOW()),
-- Expert 2: Ali Hassan  
(gen_random_uuid(), gen_random_uuid(), 'Ali Hassan', 'DevOps engineer optimizing deployment pipelines and infrastructure', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.9, 28, NOW(), NOW()),
-- Expert 3: Amr Ahmed
(gen_random_uuid(), gen_random_uuid(), 'Amr Ahmed', 'Master chef preserving authentic Egyptian culinary traditions', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 5.0, 35, NOW(), NOW())
-- ... more experts will be added based on the user's specific list
ON CONFLICT (user_id) DO NOTHING;

-- Step 5: Insert skills for Maryam Khaled
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Frontend Development', 'web', NOW(), NOW() FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe' ON CONFLICT (profile_id, title) DO NOTHING;

INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React', 'web', NOW(), NOW() FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe' ON CONFLICT (profile_id, title) DO NOTHING;

INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Supabase', 'web', NOW(), NOW() FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe' ON CONFLICT (profile_id, title) DO NOTHING;

-- Step 6: Skills for experts (template - will be filled with actual data)
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ahmed Mansour' ON CONFLICT (profile_id, title) DO NOTHING;

INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'DevOps Engineering', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Hassan' ON CONFLICT (profile_id, title) DO NOTHING;

INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Egyptian Cuisine', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amr Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Step 7: Verification query
DO $$
DECLARE
  total_profiles INTEGER;
  expert_profiles INTEGER;
  maryam_found BOOLEAN;
  total_skills INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_profiles FROM public.profiles;
  SELECT COUNT(*) INTO expert_profiles FROM public.profiles WHERE user_id != 'e08b5109-a903-4fd3-8979-a5707fb11cbe';
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe') INTO maryam_found;
  SELECT COUNT(*) INTO total_skills FROM public.skills;
  
  RAISE NOTICE '=== DATABASE RESET RESULTS ===';
  RAISE NOTICE 'Total profiles: %', total_profiles;
  RAISE NOTICE 'Expert profiles: %', expert_profiles;
  RAISE NOTICE 'Maryam Khaled found: %', maryam_found;
  RAISE NOTICE 'Total skills: %', total_skills;
  
  IF total_profiles = 40 THEN
    RAISE NOTICE '✅ SUCCESS: All 40 profiles created';
  ELSE
    RAISE NOTICE '❌ ISSUE: Expected 40 profiles, found %', total_profiles;
  END IF;
  
  IF maryam_found THEN
    RAISE NOTICE '✅ SUCCESS: Maryam Khaled profile created with correct UID';
  ELSE
    RAISE NOTICE '❌ ISSUE: Maryam Khaled profile not found';
  END IF;
END $$;
