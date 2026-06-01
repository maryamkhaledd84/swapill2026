-- QUICK POPULATE 40 USERS - Execute this immediately in Supabase SQL Editor
-- This will populate your database with Maryam + 39 experts

-- Step 1: Insert Maryam Khaled with your real Auth UID
INSERT INTO public.profiles (id, user_id, full_name, bio, avatar_url, rating, swaps_count, created_at, updated_at) VALUES
(gen_random_uuid(), 'e08b5109-a903-4fd3-8979-a5707fb11cbe', 'Maryam Khaled', 'Frontend developer specializing in React and Supabase integrations. Passionate about creating beautiful and functional web applications.', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.9, 23, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  rating = EXCLUDED.rating,
  swaps_count = EXCLUDED.swaps_count,
  updated_at = NOW();

-- Step 2: Insert 39 expert profiles
INSERT INTO public.profiles (id, user_id, full_name, bio, avatar_url, rating, swaps_count, created_at, updated_at) VALUES
(gen_random_uuid(), gen_random_uuid(), 'Ahmed Mansour', 'Passionate Web Developer with 3 years experience in modern React applications', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 4.9, 23, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Ali Hassan', 'DevOps engineer optimizing deployment pipelines and infrastructure', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.9, 28, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Amr Ahmed', 'Master chef preserving authentic Egyptian culinary traditions', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 5.0, 35, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Sara Hassan', 'Professional chef specializing in authentic Middle Eastern and Egyptian cuisine', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 5.0, 31, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Omar Sherif', 'AI specialist helping businesses leverage cutting-edge language models', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 4.7, 18, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mariam Ali', 'Certified Arabic teacher with expertise in Modern Standard Arabic and Egyptian dialect', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 4.9, 27, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Khaled Ibrahim', 'Mobile app developer creating intuitive cross-platform applications', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.8, 22, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Fatima Mahmoud', 'Creative designer focused on user-centered digital experiences', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.6, 15, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Youssef Abdel', 'Professional photographer capturing moments across Egypt and the Middle East', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 4.9, 34, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Nadia Kamel', 'Communication expert helping professionals master the art of public speaking', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.8, 19, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mohamed Elsayed', 'PMP certified project manager with 8 years in tech and construction', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.7, 26, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Layla Hussein', 'Marketing strategist helping brands grow their online presence', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.5, 21, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Karim Nabil', 'Music producer creating beats for artists across the Middle East', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face', 4.8, 16, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Rania Salah', 'Technical writer making complex concepts simple and accessible', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.6, 13, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Hassan Ali', 'Full-stack developer specializing in Python web frameworks', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.7, 24, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mona Fathy', 'English language coach specializing in business communication', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 4.9, 29, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Tarek Omar', 'Data scientist helping businesses make data-driven decisions', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 4.8, 20, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Dalia Magdy', 'Graphic designer creating memorable brand identities', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.5, 17, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Salwa Gamal', 'Content writer creating engaging stories for digital platforms', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.4, 12, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mahmoud Reda', 'AI consultant helping businesses integrate artificial intelligence', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.6, 14, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Aya Khaled', 'Social media expert building strong online communities', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.7, 25, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mostafa Ahmed', 'Python developer specializing in web applications and data analysis', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 4.8, 19, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Nourhan Mohamed', 'Fashion designer creating modern and traditional Egyptian clothing', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 4.6, 22, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Salma Mahmoud', 'Professional translator providing accurate language services', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.7, 18, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Omar Khaled', 'Game developer creating engaging mobile and PC games', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 4.5, 15, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Hend Ahmed', 'Certified yoga instructor promoting health and mindfulness', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 4.8, 21, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mahmoud Fathy', 'Blockchain developer building decentralized applications', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 4.6, 17, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Rania Ali', 'Video editor creating compelling visual content', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.7, 24, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Khaled Mohamed', 'Cybersecurity expert protecting digital assets and infrastructure', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.9, 26, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mona Ahmed', 'Business consultant helping companies grow and optimize operations', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.8, 23, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Adel Emam', 'Video editor creating compelling visual content', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 4.7, 24, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Samar Ali', 'Fashion designer creating modern Egyptian-inspired collections', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 4.6, 22, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Bassem Youssef', 'Comedy writer and content creator bringing joy to audiences', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 4.9, 28, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Sherif Ali', 'Machine learning engineer developing predictive models', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 4.7, 18, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Hossam ElDin', 'Full-stack developer specializing in scalable web applications', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 4.7, 20, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Amira Said', 'Digital artist creating stunning visual designs for brands', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 4.6, 17, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Tarek Hosny', 'Business consultant helping startups achieve sustainable growth', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 4.6, 14, NOW(), NOW()),
(gen_random_uuid(), gen_random_uuid(), 'Mona Khalil', 'Data analyst turning raw data into actionable business insights', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', 4.5, 11, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Insert skills for Maryam Khaled
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Frontend Development', 'web', NOW(), NOW() FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React', 'web', NOW(), NOW() FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Supabase', 'web', NOW(), NOW() FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe' ON CONFLICT (profile_id, title) DO NOTHING;

-- Step 4: Insert key skills for experts (1-2 per expert for quick execution)
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ahmed Mansour' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'DevOps Engineering', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Hassan' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Egyptian Cuisine', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amr Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Middle Eastern Cuisine', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sara Hassan' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'AI Prompts', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Sherif' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Modern Arabic', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mariam Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'iOS Development', 'mobile', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Ibrahim' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Figma', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Fatima Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Photography', 'photography', NOW(), NOW() FROM public.profiles WHERE full_name = 'Youssef Abdel' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Public Speaking', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nadia Kamel' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Project Management', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mohamed Elsayed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Digital Marketing', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Layla Hussein' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Music Production', 'music', NOW(), NOW() FROM public.profiles WHERE full_name = 'Karim Nabil' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Technical Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Salah' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Python Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hassan Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Business English', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Fathy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Data Science', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Omar' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Graphic Design', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Dalia Magdy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Traditional Egyptian', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salwa Gamal' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Content Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Reda' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Social Media Marketing', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Aya Khaled' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Python Programming', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mostafa Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Fashion Design', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nourhan Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Translation Services', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salma Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Game Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Khaled' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Yoga Instruction', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hend Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Blockchain Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Fathy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Video Editing', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Cybersecurity', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Business Consulting', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Video Production', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Adel Emam' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Fashion Illustration', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Samar Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Comedy Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Bassem Youssef' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Machine Learning', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sherif Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Full-stack Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hossam ElDin' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Digital Art', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amira Said' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Strategy Planning', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Hosny' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Data Analysis', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Khalil' ON CONFLICT (profile_id, title) DO NOTHING;

-- Step 5: Verification
SELECT 
  'Total Profiles' as metric, 
  COUNT(*) as count 
FROM public.profiles

UNION ALL

SELECT 
  'Expert Profiles' as metric, 
  COUNT(*) as count 
FROM public.profiles 
WHERE user_id != 'e08b5109-a903-4fd3-8979-a5707fb11cbe'

UNION ALL

SELECT 
  'Maryam Found' as metric, 
  COUNT(*) as count 
FROM public.profiles 
WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe'

UNION ALL

SELECT 
  'Total Skills' as metric, 
  COUNT(*) as count 
FROM public.skills

UNION ALL

SELECT 
  'Maryam Skills' as metric, 
  COUNT(*) as count 
FROM public.skills 
WHERE profile_id = (SELECT id FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe');
