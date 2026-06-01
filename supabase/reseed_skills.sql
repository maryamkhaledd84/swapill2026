-- Re-seed skills so every skill of a seed user is within that user's primary category.
DO $$
DECLARE
  rec RECORD;
  uid UUID;
  user_email_pattern TEXT;
  email_slug TEXT;
  skill_count INT;
  s INT;
  picked_title TEXT;
  i INT := 0;
  cat_titles TEXT[];
  titles_by_cat JSONB := '{
    "web": ["React Development","TypeScript","Next.js","CSS Animations","Node.js APIs","GraphQL","Vue.js","Supabase","Tailwind","PostgreSQL"],
    "mobile": ["React Native","SwiftUI","Kotlin","Flutter","iOS Architecture","Android Performance"],
    "design": ["Figma","Brand Identity","UI Systems","Illustration","Logo Design","UX Research","Fashion Design"],
    "marketing": ["SEO","Email Funnels","Performance Ads","Brand Strategy","Copywriting","Growth Loops","Social Media"],
    "languages": ["Arabic","English Conversation","Modern Standard Arabic","Egyptian Dialect","French","Translation"],
    "writing": ["Technical Writing","Storytelling","Editing","Long-form Essays","Newsletter Craft","Content Strategy"],
    "music": ["Guitar","Piano","Music Production","Mixing","Singing","Songwriting","Oud","Beats"],
    "cooking": ["Egyptian Cuisine","Mahshi","Koshari","Pastry","Middle Eastern Cuisine","Vegan Baking"],
    "prompt": ["LLM Prompting","Agent Design","Eval Pipelines","RAG Systems","Tool Use","Fine-tuning","ML Models"],
    "photography": ["Portrait Lighting","Lightroom","Wedding Photography","Street Photography","Product Shots","Drone"],
    "speaking": ["Talk Structure","Slide Design","Vocal Delivery","Conf Pitching","Q&A Handling","Storytelling on Stage"],
    "management": ["1:1s","OKRs","Hiring","Sprint Planning","Roadmapping","Stakeholder Mgmt","PMP","Operations"]
  }'::jsonb;
  users JSONB := '[
    {"name":"Maryam Khaled","cat":"web"},
    {"name":"Ahmed Mansour","cat":"web"},
    {"name":"Ali Hassan","cat":"web"},
    {"name":"Amr Ahmed","cat":"cooking"},
    {"name":"Sara Hassan","cat":"cooking"},
    {"name":"Omar Sherif","cat":"prompt"},
    {"name":"Mariam Ali","cat":"languages"},
    {"name":"Khaled Ibrahim","cat":"mobile"},
    {"name":"Fatima Mahmoud","cat":"design"},
    {"name":"Youssef Abdel","cat":"photography"},
    {"name":"Nadia Kamel","cat":"speaking"},
    {"name":"Mohamed Elsayed","cat":"management"},
    {"name":"Layla Hussein","cat":"marketing"},
    {"name":"Karim Nabil","cat":"music"},
    {"name":"Rania Salah","cat":"writing"},
    {"name":"Hassan Ali","cat":"web"},
    {"name":"Mona Fathy","cat":"languages"},
    {"name":"Tarek Omar","cat":"prompt"},
    {"name":"Dalia Magdy","cat":"design"},
    {"name":"Salwa Gamal","cat":"writing"},
    {"name":"Mahmoud Reda","cat":"prompt"},
    {"name":"Aya Khaled","cat":"marketing"},
    {"name":"Mostafa Ahmed","cat":"web"},
    {"name":"Nourhan Mohamed","cat":"design"},
    {"name":"Salma Mahmoud","cat":"languages"},
    {"name":"Omar Khaled","cat":"mobile"},
    {"name":"Hend Ahmed","cat":"speaking"},
    {"name":"Mahmoud Fathy","cat":"web"},
    {"name":"Rania Ali","cat":"design"},
    {"name":"Khaled Mohamed","cat":"web"},
    {"name":"Mona Ahmed","cat":"management"},
    {"name":"Adel Emam","cat":"design"},
    {"name":"Samar Ali","cat":"design"},
    {"name":"Bassem Youssef","cat":"writing"},
    {"name":"Sherif Ali","cat":"prompt"},
    {"name":"Hossam ElDin","cat":"web"},
    {"name":"Amira Said","cat":"design"},
    {"name":"Tarek Hosny","cat":"management"},
    {"name":"Mona Khalil","cat":"prompt"},
    {"name":"Ahmed Sami","cat":"mobile"},
    {"name":"Heba Mostafa","cat":"design"},
    {"name":"Yara Hany","cat":"design"},
    {"name":"Mostafa Adel","cat":"web"},
    {"name":"Reem Wael","cat":"design"},
    {"name":"Ziad Tamer","cat":"web"},
    {"name":"Dina Hatem","cat":"cooking"},
    {"name":"Ramy Sami","cat":"mobile"},
    {"name":"Habiba Nasser","cat":"speaking"},
    {"name":"Adham Wael","cat":"web"},
    {"name":"Marwa Sherine","cat":"marketing"},
    {"name":"Nour Magdy","cat":"languages"},
    {"name":"Yehia Kareem","cat":"music"},
    {"name":"Engy Saad","cat":"design"},
    {"name":"Wael Ehab","cat":"photography"},
    {"name":"Aisha Ranya","cat":"writing"},
    {"name":"Marwan Hosny","cat":"web"},
    {"name":"Doaa Selim","cat":"cooking"},
    {"name":"Hany Ezz","cat":"speaking"},
    {"name":"Esraa Mansour","cat":"prompt"},
    {"name":"Tamer Saad","cat":"web"},
    {"name":"Farida Khalil","cat":"management"},
    {"name":"Sami Hisham","cat":"music"},
    {"name":"Nasser Hisham","cat":"web"},
    {"name":"Hala Selim","cat":"writing"},
    {"name":"Magdy Selim","cat":"photography"},
    {"name":"Mai Hassan","cat":"languages"},
    {"name":"Fady Naguib","cat":"management"},
    {"name":"Lina Hamdy","cat":"marketing"},
    {"name":"Hatem Wael","cat":"mobile"},
    {"name":"Riham Saad","cat":"speaking"},
    {"name":"Walid Magdy","cat":"web"},
    {"name":"Sherine Ramy","cat":"marketing"},
    {"name":"Adham Hany","cat":"mobile"},
    {"name":"Kareem Selim","cat":"web"},
    {"name":"Nourhan Hany","cat":"design"},
    {"name":"Mohamed Wael","cat":"photography"},
    {"name":"Salma Ehab","cat":"speaking"},
    {"name":"Bahaa Tamer","cat":"web"},
    {"name":"Yasmin Adel","cat":"languages"},
    {"name":"Karim Reda","cat":"design"},
    {"name":"Layla Hamdy","cat":"marketing"},
    {"name":"Omar Naguib","cat":"cooking"},
    {"name":"Iman Sherif","cat":"writing"},
    {"name":"Tamer Hatem","cat":"web"},
    {"name":"Rana Magdy","cat":"design"},
    {"name":"Selim Adel","cat":"music"},
    {"name":"Heba Sherif","cat":"web"},
    {"name":"Hossam Tamer","cat":"speaking"},
    {"name":"Salma Yehia","cat":"languages"},
    {"name":"Adel Ramy","cat":"management"},
    {"name":"Rana Hatem","cat":"photography"},
    {"name":"Mansour Adel","cat":"web"},
    {"name":"Nada Sherif","cat":"design"},
    {"name":"Karim Hamdy","cat":"speaking"},
    {"name":"Aya Selim","cat":"marketing"},
    {"name":"Hossam Adel","cat":"web"},
    {"name":"Esraa Hosny","cat":"design"},
    {"name":"Sami Hosny","cat":"management"},
    {"name":"Reem Sherine","cat":"music"},
    {"name":"Mostafa Ehab","cat":"speaking"},
    {"name":"Yasmin Hosny","cat":"cooking"},
    {"name":"Mohamed Hany","cat":"speaking"}
  ]'::jsonb;
BEGIN
  FOR rec IN SELECT * FROM jsonb_array_elements(users) WITH ORDINALITY AS t(u, n) LOOP
    i := i + 1;

    -- Match auth user by full_name (raw_user_meta_data) to find their UUID
    SELECT u.id INTO uid
    FROM auth.users u
    WHERE u.raw_user_meta_data->>'full_name' = rec.u->>'name'
      AND u.email LIKE '%@swapill.test'
    ORDER BY u.created_at ASC
    LIMIT 1;

    IF uid IS NULL THEN CONTINUE; END IF;

    cat_titles := ARRAY(SELECT jsonb_array_elements_text(titles_by_cat->(rec.u->>'cat')));

    -- 1-4 skills, all within the user's primary category; ~12% have 0 skills
    skill_count := CASE WHEN i % 8 = 0 THEN 0 ELSE 1 + ((i * 3) % 4) END;

    FOR s IN 1..skill_count LOOP
      picked_title := cat_titles[1 + ((i + s*2) % array_length(cat_titles,1))];

      INSERT INTO public.skills (user_id, category, title, description, created_at)
      VALUES (
        uid,
        rec.u->>'cat',
        picked_title,
        'I can teach ' || picked_title || '. Looking to swap for something new.',
        NOW() - (s || ' days')::interval
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
