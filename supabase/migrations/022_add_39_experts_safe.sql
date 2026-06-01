-- SAFE ADDITION OF 39 EXPERTS - Preserving existing users
-- This script adds 39 expert profiles while preserving Maryam and any existing users

-- Step 1: Add 39 expert profiles with unique UUIDs (not conflicting with real users)
INSERT INTO public.profiles (id, user_id, full_name, bio, avatar_url, created_at, updated_at) VALUES
-- Expert 1: Ahmed Mansour
(gen_random_uuid(), gen_random_uuid(), 'Ahmed Mansour', 'Passionate Web Developer with 3 years experience in modern React applications', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 2: Sara Hassan
(gen_random_uuid(), gen_random_uuid(), 'Sara Hassan', 'Professional chef specializing in authentic Middle Eastern and Egyptian cuisine', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 3: Omar Sherif
(gen_random_uuid(), gen_random_uuid(), 'Omar Sherif', 'AI specialist helping businesses leverage cutting-edge language models', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 4: Mariam Ali
(gen_random_uuid(), gen_random_uuid(), 'Mariam Ali', 'Certified Arabic teacher with expertise in Modern Standard Arabic and Egyptian dialect', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 5: Khaled Ibrahim
(gen_random_uuid(), gen_random_uuid(), 'Khaled Ibrahim', 'Mobile app developer creating intuitive cross-platform applications', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 6: Fatima Mahmoud
(gen_random_uuid(), gen_random_uuid(), 'Fatima Mahmoud', 'Creative designer focused on user-centered digital experiences', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 7: Youssef Abdel
(gen_random_uuid(), gen_random_uuid(), 'Youssef Abdel', 'Professional photographer capturing moments across Egypt and the Middle East', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 8: Nadia Kamel
(gen_random_uuid(), gen_random_uuid(), 'Nadia Kamel', 'Communication expert helping professionals master the art of public speaking', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 9: Mohamed Elsayed
(gen_random_uuid(), gen_random_uuid(), 'Mohamed Elsayed', 'PMP certified project manager with 8 years in tech and construction', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 10: Layla Hussein
(gen_random_uuid(), gen_random_uuid(), 'Layla Hussein', 'Marketing strategist helping brands grow their online presence', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 11: Karim Nabil
(gen_random_uuid(), gen_random_uuid(), 'Karim Nabil', 'Music producer creating beats for artists across the Middle East', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 12: Rania Salah
(gen_random_uuid(), gen_random_uuid(), 'Rania Salah', 'Technical writer making complex concepts simple and accessible', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 13: Hassan Ali
(gen_random_uuid(), gen_random_uuid(), 'Hassan Ali', 'Full-stack developer specializing in Python web frameworks', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 14: Mona Fathy
(gen_random_uuid(), gen_random_uuid(), 'Mona Fathy', 'English language coach specializing in business communication', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 15: Tarek Omar
(gen_random_uuid(), gen_random_uuid(), 'Tarek Omar', 'Data scientist helping businesses make data-driven decisions', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 16: Dalia Magdy
(gen_random_uuid(), gen_random_uuid(), 'Dalia Magdy', 'Graphic designer creating memorable brand identities', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 17: Amr Ahmed
(gen_random_uuid(), gen_random_uuid(), 'Amr Ahmed', 'Master chef preserving authentic Egyptian culinary traditions', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 18: Salwa Gamal
(gen_random_uuid(), gen_random_uuid(), 'Salwa Gamal', 'Content writer creating engaging stories for digital platforms', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 19: Mahmoud Reda
(gen_random_uuid(), gen_random_uuid(), 'Mahmoud Reda', 'AI consultant helping businesses integrate artificial intelligence', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 20: Aya Khaled
(gen_random_uuid(), gen_random_uuid(), 'Aya Khaled', 'Social media expert building strong online communities', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 21: Mostafa Ahmed
(gen_random_uuid(), gen_random_uuid(), 'Mostafa Ahmed', 'Python developer specializing in web applications and data analysis', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 22: Nourhan Mohamed
(gen_random_uuid(), gen_random_uuid(), 'Nourhan Mohamed', 'Fashion designer creating modern and traditional Egyptian clothing', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 23: Ali Hassan
(gen_random_uuid(), gen_random_uuid(), 'Ali Hassan', 'DevOps engineer optimizing deployment pipelines and infrastructure', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 24: Salma Mahmoud
(gen_random_uuid(), gen_random_uuid(), 'Salma Mahmoud', 'Professional translator providing accurate language services', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 25: Omar Khaled
(gen_random_uuid(), gen_random_uuid(), 'Omar Khaled', 'Game developer creating engaging mobile and PC games', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 26: Hend Ahmed
(gen_random_uuid(), gen_random_uuid(), 'Hend Ahmed', 'Certified yoga instructor promoting health and mindfulness', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 27: Mahmoud Fathy
(gen_random_uuid(), gen_random_uuid(), 'Mahmoud Fathy', 'Blockchain developer building decentralized applications', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 28: Rania Ali
(gen_random_uuid(), gen_random_uuid(), 'Rania Ali', 'Video editor creating compelling visual content', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 29: Khaled Mohamed
(gen_random_uuid(), gen_random_uuid(), 'Khaled Mohamed', 'Cybersecurity expert protecting digital assets and infrastructure', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 30: Mona Ahmed
(gen_random_uuid(), gen_random_uuid(), 'Mona Ahmed', 'Business consultant helping companies grow and optimize operations', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 31: Adel Emam
(gen_random_uuid(), gen_random_uuid(), 'Adel Emam', 'Video editor creating compelling visual content', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 32: Samar Ali
(gen_random_uuid(), gen_random_uuid(), 'Samar Ali', 'Fashion designer creating modern Egyptian-inspired collections', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 33: Bassem Youssef
(gen_random_uuid(), gen_random_uuid(), 'Bassem Youssef', 'Comedy writer and content creator bringing joy to audiences', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 34: Sherif Ali
(gen_random_uuid(), gen_random_uuid(), 'Sherif Ali', 'Machine learning engineer developing predictive models', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 35: Hossam ElDin
(gen_random_uuid(), gen_random_uuid(), 'Hossam ElDin', 'Full-stack developer specializing in scalable web applications', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 36: Amira Said
(gen_random_uuid(), gen_random_uuid(), 'Amira Said', 'Digital artist creating stunning visual designs for brands', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 37: Tarek Hosny
(gen_random_uuid(), gen_random_uuid(), 'Tarek Hosny', 'Business consultant helping startups achieve sustainable growth', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 38: Mona Khalil
(gen_random_uuid(), gen_random_uuid(), 'Mona Khalil', 'Data analyst turning raw data into actionable business insights', 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face', NOW(), NOW()),
-- Expert 39: Ali Reda
(gen_random_uuid(), gen_random_uuid(), 'Ali Reda', 'Cybersecurity expert protecting businesses from digital threats', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicates

-- Step 2: Add skills for all 39 experts
-- Ahmed Mansour - Web Development
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React Development', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ahmed Mansour' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'TypeScript', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ahmed Mansour' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Node.js', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ahmed Mansour' ON CONFLICT (profile_id, title) DO NOTHING;

-- Sara Hassan - Cooking
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Egyptian Cuisine', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sara Hassan' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Levantine Dishes', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sara Hassan' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Desserts', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sara Hassan' ON CONFLICT (profile_id, title) DO NOTHING;

-- Omar Sherif - AI/Prompt Engineering
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'AI Prompts', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Sherif' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'ChatGPT', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Sherif' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Midjourney', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Sherif' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mariam Ali - Languages
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Modern Arabic', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mariam Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Classical Arabic', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mariam Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Egyptian Dialect', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mariam Ali' ON CONFLICT (profile_id, title) DO NOTHING;

-- Khaled Ibrahim - Mobile Development
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'iOS', 'mobile', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Ibrahim' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Android', 'mobile', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Ibrahim' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React Native', 'mobile', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Ibrahim' ON CONFLICT (profile_id, title) DO NOTHING;

-- Fatima Mahmoud - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Figma', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Fatima Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Adobe XD', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Fatima Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Prototyping', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Fatima Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;

-- Youssef Abdel - Photography
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Photography', 'photography', NOW(), NOW() FROM public.profiles WHERE full_name = 'Youssef Abdel' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Portrait', 'photography', NOW(), NOW() FROM public.profiles WHERE full_name = 'Youssef Abdel' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Event Photography', 'photography', NOW(), NOW() FROM public.profiles WHERE full_name = 'Youssef Abdel' ON CONFLICT (profile_id, title) DO NOTHING;

-- Nadia Kamel - Speaking
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Public Speaking', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nadia Kamel' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Presentation Skills', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nadia Kamel' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Debate Coaching', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nadia Kamel' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mohamed Elsayed - Management
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Agile', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mohamed Elsayed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Scrum', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mohamed Elsayed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Team Leadership', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mohamed Elsayed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Layla Hussein - Marketing
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'SEO', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Layla Hussein' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Social Media', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Layla Hussein' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Content Strategy', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Layla Hussein' ON CONFLICT (profile_id, title) DO NOTHING;

-- Karim Nabil - Music
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Beat Making', 'music', NOW(), NOW() FROM public.profiles WHERE full_name = 'Karim Nabil' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Audio Engineering', 'music', NOW(), NOW() FROM public.profiles WHERE full_name = 'Karim Nabil' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'MIDI Production', 'music', NOW(), NOW() FROM public.profiles WHERE full_name = 'Karim Nabil' ON CONFLICT (profile_id, title) DO NOTHING;

-- Rania Salah - Writing
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Technical Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Salah' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Documentation', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Salah' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'API Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Salah' ON CONFLICT (profile_id, title) DO NOTHING;

-- Hassan Ali - Web Development
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Vue.js', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hassan Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Python', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hassan Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Django', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hassan Ali' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mona Fathy - Languages
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Business English', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Fathy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'IELTS Prep', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Fathy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Corporate Training', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Fathy' ON CONFLICT (profile_id, title) DO NOTHING;

-- Tarek Omar - Data Science
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Machine Learning', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Omar' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Python', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Omar' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Data Analysis', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Omar' ON CONFLICT (profile_id, title) DO NOTHING;

-- Dalia Magdy - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Branding', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Dalia Magdy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Logo Design', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Dalia Magdy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Print Design', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Dalia Magdy' ON CONFLICT (profile_id, title) DO NOTHING;

-- Amr Ahmed - Cooking
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Traditional Egyptian', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amr Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Street Food', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amr Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Halal Cooking', 'cooking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amr Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Salwa Gamal - Writing
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Blog Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salwa Gamal' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Copywriting', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salwa Gamal' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'SEO Content', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salwa Gamal' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mahmoud Reda - AI
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'ChatGPT', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Reda' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Automation', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Reda' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'AI Strategy', 'prompt', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Reda' ON CONFLICT (profile_id, title) DO NOTHING;

-- Aya Khaled - Marketing
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Instagram', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Aya Khaled' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Facebook', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Aya Khaled' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Content Strategy', 'marketing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Aya Khaled' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mostafa Ahmed - Web Development
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Python', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mostafa Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Django', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mostafa Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Data Science', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mostafa Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Nourhan Mohamed - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Fashion Sketching', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nourhan Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Pattern Making', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nourhan Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Styling', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Nourhan Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Ali Hassan - DevOps
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Docker', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Hassan' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Kubernetes', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Hassan' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'CI/CD', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Hassan' ON CONFLICT (profile_id, title) DO NOTHING;

-- Salma Mahmoud - Languages
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'English-Arabic', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salma Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'French-Arabic', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salma Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Technical Translation', 'languages', NOW(), NOW() FROM public.profiles WHERE full_name = 'Salma Mahmoud' ON CONFLICT (profile_id, title) DO NOTHING;

-- Omar Khaled - Game Development
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Unity', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Khaled' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'C#', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Khaled' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, '2D/3D Graphics', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Omar Khaled' ON CONFLICT (profile_id, title) DO NOTHING;

-- Hend Ahmed - Speaking
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Hatha Yoga', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hend Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Meditation', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hend Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Wellness Coaching', 'speaking', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hend Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mahmoud Fathy - Blockchain
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Solidity', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Fathy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Web3', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Fathy' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Smart Contracts', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mahmoud Fathy' ON CONFLICT (profile_id, title) DO NOTHING;

-- Rania Ali - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Adobe Premiere', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Final Cut Pro', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Motion Graphics', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Rania Ali' ON CONFLICT (profile_id, title) DO NOTHING;

-- Khaled Mohamed - Cybersecurity
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Network Security', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Ethical Hacking', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Risk Assessment', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Khaled Mohamed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mona Ahmed - Management
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Strategy Planning', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Market Analysis', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Business Development', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Ahmed' ON CONFLICT (profile_id, title) DO NOTHING;

-- Adel Emam - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Video Editing', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Adel Emam' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Storytelling', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Adel Emam' ON CONFLICT (profile_id, title) DO NOTHING;

-- Samar Ali - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Fashion Illustration', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Samar Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Fashion Design', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Samar Ali' ON CONFLICT (profile_id, title) DO NOTHING;

-- Bassem Youssef - Management
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Comedy Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Bassem Youssef' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Script Writing', 'writing', NOW(), NOW() FROM public.profiles WHERE full_name = 'Bassem Youssef' ON CONFLICT (profile_id, title) DO NOTHING;

-- Sherif Ali - Data Science
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'TensorFlow', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sherif Ali' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'PyTorch', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Sherif Ali' ON CONFLICT (profile_id, title) DO NOTHING;

-- Hossam ElDin - Web Development
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'React', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hossam ElDin' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Node.js', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Hossam ElDin' ON CONFLICT (profile_id, title) DO NOTHING;

-- Amira Said - Design
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Digital Art', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amira Said' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Digital Painting', 'design', NOW(), NOW() FROM public.profiles WHERE full_name = 'Amira Said' ON CONFLICT (profile_id, title) DO NOTHING;

-- Tarek Hosny - Management
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Strategy Planning', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Hosny' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Market Analysis', 'management', NOW(), NOW() FROM public.profiles WHERE full_name = 'Tarek Hosny' ON CONFLICT (profile_id, title) DO NOTHING;

-- Mona Khalil - Data Analysis
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Python', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Khalil' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Data Visualization', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Mona Khalil' ON CONFLICT (profile_id, title) DO NOTHING;

-- Ali Reda - Cybersecurity
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Network Security', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Reda' ON CONFLICT (profile_id, title) DO NOTHING;
INSERT INTO public.skills (profile_id, title, category, created_at, updated_at)
SELECT id, 'Ethical Hacking', 'web', NOW(), NOW() FROM public.profiles WHERE full_name = 'Ali Reda' ON CONFLICT (profile_id, title) DO NOTHING;

-- Step 3: Verification
DO $$
DECLARE
  total_profiles INTEGER;
  expert_profiles INTEGER;
  maryam_found BOOLEAN;
  total_skills INTEGER;
BEGIN
  -- Count total profiles
  SELECT COUNT(*) INTO total_profiles FROM public.profiles;
  
  -- Count expert profiles (not Maryam)
  SELECT COUNT(*) INTO expert_profiles FROM public.profiles WHERE user_id != 'e08b5109-a903-4fd3-8979-a5707fb11cbe';
  
  -- Check if Maryam exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = 'e08b5109-a903-4fd3-8979-a5707fb11cbe') INTO maryam_found;
  
  -- Count total skills
  SELECT COUNT(*) INTO total_skills FROM public.skills;
  
  RAISE NOTICE '=== VERIFICATION RESULTS ===';
  RAISE NOTICE 'Total profiles: %', total_profiles;
  RAISE NOTICE 'Expert profiles: %', expert_profiles;
  RAISE NOTICE 'Maryam Khaled found: %', maryam_found;
  RAISE NOTICE 'Total skills: %', total_skills;
  
  IF expert_profiles = 39 THEN
    RAISE NOTICE '✅ SUCCESS: 39 expert profiles added';
  ELSE
    RAISE NOTICE '❌ ISSUE: Expected 39 expert profiles, found %', expert_profiles;
  END IF;
  
  IF maryam_found THEN
    RAISE NOTICE '✅ SUCCESS: Maryam Khaled profile preserved';
  ELSE
    RAISE NOTICE '❌ ISSUE: Maryam Khaled profile not found';
  END IF;
  
  IF total_skills >= 80 THEN
    RAISE NOTICE '✅ SUCCESS: Sufficient skills added';
  ELSE
    RAISE NOTICE '❌ ISSUE: Expected at least 80 skills, found %', total_skills;
  END IF;
END $$;
