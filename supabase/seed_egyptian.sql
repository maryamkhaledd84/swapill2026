-- ============================================================
-- Seed: 100 Egyptian users (40 from the original project, 60 new)
-- Email convention: <first>.<last><n?>@swapill.test
-- Password (all seed users): Password123!
-- ============================================================

DO $$
DECLARE
  rec RECORD;
  uid UUID;
  pwd TEXT;
  user_email TEXT;
  email_slug TEXT;
  skill_count INT;
  s INT;
  picked_category TEXT;
  picked_title TEXT;
  i INT := 0;
  cats TEXT[] := ARRAY['web','mobile','design','marketing','languages','writing','music','cooking','prompt','photography','speaking','management'];
  titles_by_cat JSONB := '{
    "web": ["React Development","TypeScript","Next.js","CSS Animations","Node.js APIs","GraphQL","Vue.js","Supabase","Tailwind"],
    "mobile": ["React Native","SwiftUI","Kotlin","Flutter","iOS Architecture","Android Performance"],
    "design": ["Figma","Brand Identity","UI Systems","Illustration","Logo Design","UX Research","Fashion Design"],
    "marketing": ["SEO","Email Funnels","Performance Ads","Brand Strategy","Copywriting","Growth Loops","Social Media"],
    "languages": ["Arabic","English Conversation","Modern Standard Arabic","Egyptian Dialect","French","Translation"],
    "writing": ["Technical Writing","Storytelling","Editing","Long-form Essays","Newsletter Craft","Content Strategy"],
    "music": ["Guitar","Piano","Music Production","Mixing","Singing","Songwriting","Oud","Beats"],
    "cooking": ["Egyptian Cuisine","Mahshi","Koshari","Pastry","Middle Eastern Cuisine","Vegan Baking"],
    "prompt": ["LLM Prompting","Agent Design","Eval Pipelines","RAG Systems","Tool Use","Fine-tuning","ML Models"],
    "photography": ["Portrait Lighting","Lightroom","Wedding Photography","Street Photography","Product Shots","Drone"],
    "speaking": ["Talk Structure","Slide Design","Vocal Delivery","Conf Pitching","Q&A Handling","Storytelling"],
    "management": ["1:1s","OKRs","Hiring","Sprint Planning","Roadmapping","Stakeholder Mgmt","PMP","Operations"]
  }'::jsonb;
  cat_titles TEXT[];

  -- 100 users: full_name, bio (NULL = skip bio), location (NULL = skip), primary_category, rating, total_swaps
  -- First 40 are exact preserved data from migration 024
  users JSONB := '[
    {"name":"Maryam Khaled","bio":"Frontend developer specializing in React and Supabase integrations. Passionate about creating beautiful and functional web applications.","loc":"Cairo, Egypt","cat":"web","rating":4.9,"swaps":23,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Ahmed Mansour","bio":"Passionate Web Developer with 3 years experience in modern React applications","loc":"Cairo, Egypt","cat":"web","rating":4.9,"swaps":23,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Ali Hassan","bio":"DevOps engineer optimizing deployment pipelines and infrastructure","loc":"Alexandria, Egypt","cat":"web","rating":4.9,"swaps":28,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Amr Ahmed","bio":"Master chef preserving authentic Egyptian culinary traditions","loc":"Cairo, Egypt","cat":"cooking","rating":5.0,"swaps":35,"avatar":"https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop&crop=face"},
    {"name":"Sara Hassan","bio":"Professional chef specializing in authentic Middle Eastern and Egyptian cuisine","loc":"Cairo, Egypt","cat":"cooking","rating":5.0,"swaps":31,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Omar Sherif","bio":"AI specialist helping businesses leverage cutting-edge language models","loc":"Cairo, Egypt","cat":"prompt","rating":4.7,"swaps":18,"avatar":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mariam Ali","bio":"Certified Arabic teacher with expertise in Modern Standard Arabic and Egyptian dialect","loc":"Giza, Egypt","cat":"languages","rating":4.9,"swaps":27,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Khaled Ibrahim","bio":"Mobile app developer creating intuitive cross-platform applications","loc":"Cairo, Egypt","cat":"mobile","rating":4.8,"swaps":22,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Fatima Mahmoud","bio":"Creative designer focused on user-centered digital experiences","loc":"Alexandria, Egypt","cat":"design","rating":4.6,"swaps":15,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Youssef Abdel","bio":"Professional photographer capturing moments across Egypt and the Middle East","loc":"Cairo, Egypt","cat":"photography","rating":4.9,"swaps":34,"avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"},
    {"name":"Nadia Kamel","bio":"Communication expert helping professionals master the art of public speaking","loc":"Cairo, Egypt","cat":"speaking","rating":4.8,"swaps":19,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mohamed Elsayed","bio":"PMP certified project manager with 8 years in tech and construction","loc":"Cairo, Egypt","cat":"management","rating":4.7,"swaps":26,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Layla Hussein","bio":"Marketing strategist helping brands grow their online presence","loc":"Cairo, Egypt","cat":"marketing","rating":4.5,"swaps":21,"avatar":"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face"},
    {"name":"Karim Nabil","bio":"Music producer creating beats for artists across the Middle East","loc":"Cairo, Egypt","cat":"music","rating":4.8,"swaps":16,"avatar":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Rania Salah","bio":"Technical writer making complex concepts simple and accessible","loc":"Alexandria, Egypt","cat":"writing","rating":4.6,"swaps":13,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hassan Ali","bio":"Full-stack developer specializing in Python web frameworks","loc":"Cairo, Egypt","cat":"web","rating":4.7,"swaps":24,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mona Fathy","bio":"English language coach specializing in business communication","loc":"Cairo, Egypt","cat":"languages","rating":4.9,"swaps":29,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Tarek Omar","bio":"Data scientist helping businesses make data-driven decisions","loc":"Cairo, Egypt","cat":"prompt","rating":4.8,"swaps":20,"avatar":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Dalia Magdy","bio":"Graphic designer creating memorable brand identities","loc":"Giza, Egypt","cat":"design","rating":4.5,"swaps":17,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Salwa Gamal","bio":"Content writer creating engaging stories for digital platforms","loc":"Cairo, Egypt","cat":"writing","rating":4.4,"swaps":12,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mahmoud Reda","bio":"AI consultant helping businesses integrate artificial intelligence","loc":"Cairo, Egypt","cat":"prompt","rating":4.6,"swaps":14,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Aya Khaled","bio":"Social media expert building strong online communities","loc":"Cairo, Egypt","cat":"marketing","rating":4.7,"swaps":25,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mostafa Ahmed","bio":"Python developer specializing in web applications and data analysis","loc":"Cairo, Egypt","cat":"web","rating":4.8,"swaps":19,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Nourhan Mohamed","bio":"Fashion designer creating modern and traditional Egyptian clothing","loc":"Alexandria, Egypt","cat":"design","rating":4.6,"swaps":22,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Salma Mahmoud","bio":"Professional translator providing accurate language services","loc":"Cairo, Egypt","cat":"languages","rating":4.7,"swaps":18,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Omar Khaled","bio":"Game developer creating engaging mobile and PC games","loc":"Cairo, Egypt","cat":"mobile","rating":4.5,"swaps":15,"avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hend Ahmed","bio":"Certified yoga instructor promoting health and mindfulness","loc":"Cairo, Egypt","cat":"speaking","rating":4.8,"swaps":21,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mahmoud Fathy","bio":"Blockchain developer building decentralized applications","loc":"Cairo, Egypt","cat":"web","rating":4.6,"swaps":17,"avatar":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Rania Ali","bio":"Video editor creating compelling visual content","loc":"Alexandria, Egypt","cat":"design","rating":4.7,"swaps":24,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Khaled Mohamed","bio":"Cybersecurity expert protecting digital assets and infrastructure","loc":"Cairo, Egypt","cat":"web","rating":4.9,"swaps":26,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mona Ahmed","bio":"Business consultant helping companies grow and optimize operations","loc":"Cairo, Egypt","cat":"management","rating":4.8,"swaps":23,"avatar":"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face"},
    {"name":"Adel Emam","bio":"Video editor creating compelling visual content","loc":"Cairo, Egypt","cat":"design","rating":4.7,"swaps":24,"avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"},
    {"name":"Samar Ali","bio":"Fashion designer creating modern Egyptian-inspired collections","loc":"Cairo, Egypt","cat":"design","rating":4.6,"swaps":22,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Bassem Youssef","bio":"Comedy writer and content creator bringing joy to audiences","loc":"Cairo, Egypt","cat":"writing","rating":4.9,"swaps":28,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Sherif Ali","bio":"Machine learning engineer developing predictive models","loc":"Cairo, Egypt","cat":"prompt","rating":4.7,"swaps":18,"avatar":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hossam ElDin","bio":"Full-stack developer specializing in scalable web applications","loc":"Cairo, Egypt","cat":"web","rating":4.7,"swaps":20,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Amira Said","bio":"Digital artist creating stunning visual designs for brands","loc":"Alexandria, Egypt","cat":"design","rating":4.6,"swaps":17,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Tarek Hosny","bio":"Business consultant helping startups achieve sustainable growth","loc":"Cairo, Egypt","cat":"management","rating":4.6,"swaps":14,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mona Khalil","bio":"Data analyst turning raw data into actionable business insights","loc":"Cairo, Egypt","cat":"prompt","rating":4.5,"swaps":11,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Ahmed Sami","bio":"iOS developer crafting smooth native experiences","loc":"Cairo, Egypt","cat":"mobile","rating":4.8,"swaps":19,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Heba Mostafa","bio":"UX researcher uncovering insights that shape product strategy","loc":"Cairo, Egypt","cat":"design","rating":4.7,"swaps":16,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Yara Hany","bio":null,"loc":"Cairo, Egypt","cat":"design","rating":4.5,"swaps":9,"avatar":null},
    {"name":"Mostafa Adel","bio":"Backend engineer with deep PostgreSQL expertise","loc":"Alexandria, Egypt","cat":"web","rating":4.8,"swaps":22,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Reem Wael","bio":"Calligraphy artist teaching Arabic calligraphy fundamentals","loc":"Giza, Egypt","cat":"design","rating":4.6,"swaps":12,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Ziad Tamer","bio":"DevOps lead automating CI/CD pipelines and infra-as-code","loc":"Cairo, Egypt","cat":"web","rating":4.9,"swaps":31,"avatar":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Dina Hatem","bio":"Pastry chef trained in French and Egyptian baking traditions","loc":"Cairo, Egypt","cat":"cooking","rating":4.8,"swaps":17,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Ramy Sami","bio":"React Native consultant — Android and iOS, single codebase","loc":"Cairo, Egypt","cat":"mobile","rating":4.7,"swaps":14,"avatar":null},
    {"name":"Habiba Nasser","bio":"Voice coach helping speakers project confidence on stage","loc":"Cairo, Egypt","cat":"speaking","rating":4.8,"swaps":13,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Adham Wael","bio":null,"loc":null,"cat":"web","rating":4.4,"swaps":7,"avatar":null},
    {"name":"Marwa Sherine","bio":"Brand strategist crafting narratives for D2C startups","loc":"Cairo, Egypt","cat":"marketing","rating":4.7,"swaps":18,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Nour Magdy","bio":"Spanish + Arabic tutor running small group classes online","loc":"Alexandria, Egypt","cat":"languages","rating":4.6,"swaps":15,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Yehia Kareem","bio":"Oud player and music theory tutor for beginners","loc":"Cairo, Egypt","cat":"music","rating":4.9,"swaps":21,"avatar":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Engy Saad","bio":"Children''s book illustrator and digital artist","loc":"Cairo, Egypt","cat":"design","rating":4.7,"swaps":11,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Wael Ehab","bio":"Cinematographer and drone operator for travel videos","loc":"Hurghada, Egypt","cat":"photography","rating":4.8,"swaps":24,"avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"},
    {"name":"Aisha Ranya","bio":null,"loc":"Cairo, Egypt","cat":"writing","rating":4.5,"swaps":8,"avatar":null},
    {"name":"Marwan Hosny","bio":"Solidity smart-contract dev shipping audited DeFi tooling","loc":"Cairo, Egypt","cat":"web","rating":4.6,"swaps":12,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Doaa Selim","bio":"Cake decorator and pastry teacher running weekend workshops","loc":"Cairo, Egypt","cat":"cooking","rating":4.9,"swaps":20,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hany Ezz","bio":"Personal trainer focused on strength and mobility","loc":"Alexandria, Egypt","cat":"speaking","rating":4.7,"swaps":17,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Esraa Mansour","bio":"SQL + Tableau analyst — turning dashboards into decisions","loc":"Cairo, Egypt","cat":"prompt","rating":4.7,"swaps":14,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Tamer Saad","bio":"WordPress freelancer building fast custom themes","loc":"Cairo, Egypt","cat":"web","rating":4.4,"swaps":10,"avatar":null},
    {"name":"Farida Khalil","bio":"Product manager at a Cairo fintech, exploring side projects","loc":"Cairo, Egypt","cat":"management","rating":4.8,"swaps":19,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Sami Hisham","bio":"Mixing engineer specializing in Arabic pop and indie","loc":"Cairo, Egypt","cat":"music","rating":4.7,"swaps":13,"avatar":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Nasser Hisham","bio":null,"loc":"Cairo, Egypt","cat":"web","rating":4.3,"swaps":6,"avatar":null},
    {"name":"Hala Selim","bio":"Newsletter writer with 15K subscribers in MENA","loc":"Cairo, Egypt","cat":"writing","rating":4.8,"swaps":22,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Magdy Selim","bio":"Wedding photographer with 200+ weddings shot in Egypt","loc":"Alexandria, Egypt","cat":"photography","rating":4.9,"swaps":36,"avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mai Hassan","bio":"French and Arabic translator for legal and medical docs","loc":"Cairo, Egypt","cat":"languages","rating":4.7,"swaps":16,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Fady Naguib","bio":"Salesforce admin certified — helping teams ship faster","loc":"Cairo, Egypt","cat":"management","rating":4.6,"swaps":13,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Lina Hamdy","bio":"Email marketing strategist for SaaS startups","loc":"Cairo, Egypt","cat":"marketing","rating":4.7,"swaps":15,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hatem Wael","bio":null,"loc":null,"cat":"mobile","rating":4.2,"swaps":5,"avatar":null},
    {"name":"Riham Saad","bio":"Yoga and meditation instructor — Cairo studio","loc":"Cairo, Egypt","cat":"speaking","rating":4.8,"swaps":18,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Walid Magdy","bio":"Senior backend at a Cairo unicorn — Go and Postgres","loc":"Cairo, Egypt","cat":"web","rating":4.9,"swaps":29,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Sherine Ramy","bio":"Content marketer for B2B tech, ghost-writing thought leadership","loc":"Cairo, Egypt","cat":"marketing","rating":4.6,"swaps":11,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Adham Hany","bio":"Game designer passionate about narrative-driven indie games","loc":"Alexandria, Egypt","cat":"mobile","rating":4.7,"swaps":13,"avatar":null},
    {"name":"Kareem Selim","bio":"Bootcamp instructor teaching React and Node fundamentals","loc":"Cairo, Egypt","cat":"web","rating":4.8,"swaps":24,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Nourhan Hany","bio":null,"loc":"Cairo, Egypt","cat":"design","rating":4.4,"swaps":7,"avatar":null},
    {"name":"Mohamed Wael","bio":"Drone pilot and aerial videographer for real estate","loc":"Hurghada, Egypt","cat":"photography","rating":4.7,"swaps":15,"avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"},
    {"name":"Salma Ehab","bio":"Voice-over artist for ads and animation in Arabic and English","loc":"Cairo, Egypt","cat":"speaking","rating":4.9,"swaps":21,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Bahaa Tamer","bio":"Linux sysadmin running self-hosted infra on a budget","loc":"Cairo, Egypt","cat":"web","rating":4.5,"swaps":9,"avatar":null},
    {"name":"Yasmin Adel","bio":"Children''s storyteller and Arabic-language educator","loc":"Alexandria, Egypt","cat":"languages","rating":4.8,"swaps":14,"avatar":"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face"},
    {"name":"Karim Reda","bio":"Indie filmmaker shooting micro-budget shorts in Cairo","loc":"Cairo, Egypt","cat":"design","rating":4.6,"swaps":11,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Layla Hamdy","bio":"PR consultant for Cairo creative agencies","loc":"Cairo, Egypt","cat":"marketing","rating":4.7,"swaps":17,"avatar":"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face"},
    {"name":"Omar Naguib","bio":"Egyptian street-food chef teaching koshari and ful","loc":"Cairo, Egypt","cat":"cooking","rating":4.9,"swaps":26,"avatar":"https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop&crop=face"},
    {"name":"Iman Sherif","bio":null,"loc":"Cairo, Egypt","cat":"writing","rating":4.3,"swaps":6,"avatar":null},
    {"name":"Tamer Hatem","bio":"AWS solutions architect helping startups go cloud-native","loc":"Cairo, Egypt","cat":"web","rating":4.9,"swaps":31,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Rana Magdy","bio":"Color consultant for fashion and interior brands","loc":"Cairo, Egypt","cat":"design","rating":4.6,"swaps":12,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Selim Adel","bio":"Indie game audio designer making retro-inspired sound","loc":"Cairo, Egypt","cat":"music","rating":4.7,"swaps":13,"avatar":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Heba Sherif","bio":"Frontend dev — accessibility-focused React components","loc":"Cairo, Egypt","cat":"web","rating":4.8,"swaps":18,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hossam Tamer","bio":"Triathlon coach and nutritionist for amateur athletes","loc":"Cairo, Egypt","cat":"speaking","rating":4.7,"swaps":15,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Salma Yehia","bio":null,"loc":null,"cat":"languages","rating":4.4,"swaps":8,"avatar":null},
    {"name":"Adel Ramy","bio":"Notion power user and ops consultant for solo founders","loc":"Cairo, Egypt","cat":"management","rating":4.6,"swaps":12,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Rana Hatem","bio":"Photo-editing tutor — Lightroom and Photoshop fundamentals","loc":"Alexandria, Egypt","cat":"photography","rating":4.8,"swaps":16,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mansour Adel","bio":"Embedded engineer working on IoT for Egyptian agriculture","loc":"Mansoura, Egypt","cat":"web","rating":4.7,"swaps":14,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"},
    {"name":"Nada Sherif","bio":"Graphic illustrator working in tarot and mystical themes","loc":"Cairo, Egypt","cat":"design","rating":4.7,"swaps":11,"avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"},
    {"name":"Karim Hamdy","bio":"Strength coach and CrossFit Level 2 trainer","loc":"Cairo, Egypt","cat":"speaking","rating":4.5,"swaps":10,"avatar":null},
    {"name":"Aya Selim","bio":"Marketing automation expert (HubSpot, Customer.io)","loc":"Cairo, Egypt","cat":"marketing","rating":4.8,"swaps":22,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Hossam Adel","bio":"Java backend engineer at a logistics scale-up","loc":"Cairo, Egypt","cat":"web","rating":4.6,"swaps":13,"avatar":null},
    {"name":"Esraa Hosny","bio":"Calligrapher and brush-lettering teacher","loc":"Cairo, Egypt","cat":"design","rating":4.9,"swaps":20,"avatar":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"},
    {"name":"Sami Hosny","bio":"Senior PM coaching juniors via 1:1 swaps","loc":"Cairo, Egypt","cat":"management","rating":4.9,"swaps":25,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Reem Sherine","bio":null,"loc":"Alexandria, Egypt","cat":"music","rating":4.4,"swaps":7,"avatar":null},
    {"name":"Mostafa Ehab","bio":"Tech YouTuber covering Arabic-language dev tutorials","loc":"Cairo, Egypt","cat":"speaking","rating":4.8,"swaps":19,"avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"},
    {"name":"Yasmin Hosny","bio":"Skincare formulator and small-batch cosmetics maker","loc":"Cairo, Egypt","cat":"cooking","rating":4.7,"swaps":14,"avatar":"https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=400&h=400&fit=crop&crop=face"},
    {"name":"Mohamed Hany","bio":"Chess coach — FIDE rated — happy to swap for languages","loc":"Cairo, Egypt","cat":"speaking","rating":4.8,"swaps":17,"avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"}
  ]'::jsonb;
BEGIN
  pwd := crypt('Password123!', gen_salt('bf'));

  FOR rec IN SELECT * FROM jsonb_array_elements(users) WITH ORDINALITY AS t(u, n) LOOP
    i := i + 1;
    uid := gen_random_uuid();

    -- Build a unique email from the name
    email_slug := lower(regexp_replace(rec.u->>'name', '[^a-zA-Z]+', '.', 'g'));
    email_slug := trim(both '.' from email_slug);
    user_email := email_slug || lpad(i::text, 3, '0') || '@swapill.test';

    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token,
      email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      uid, 'authenticated', 'authenticated', user_email,
      pwd, NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', rec.u->>'name', 'name', rec.u->>'name'),
      NOW() - (i || ' days')::interval, NOW(), '',
      '', '', ''
    );

    UPDATE public.profiles
    SET
      bio = rec.u->>'bio',
      location = rec.u->>'loc',
      avatar_url = rec.u->>'avatar',
      cover_url = CASE WHEN i % 3 = 0
                       THEN 'https://picsum.photos/seed/swapill' || i::text || '/1200/400'
                       ELSE NULL END,
      endorsements = (i * 13) % 250,
      exchanges = (rec.u->>'swaps')::int,
      total_swaps = (rec.u->>'swaps')::int,
      rating = (rec.u->>'rating')::numeric,
      trust_score = ROUND(((rec.u->>'rating')::numeric * 20)::numeric, 2)
    WHERE id = uid;

    -- 0-5 skills per user; 12% have 0 skills, primary category is the user's listed cat
    skill_count := CASE WHEN i % 8 = 0 THEN 0 ELSE 1 + ((i * 3) % 5) END;
    FOR s IN 1..skill_count LOOP
      IF s = 1 THEN
        picked_category := rec.u->>'cat';
      ELSE
        picked_category := cats[1 + ((i + s) % array_length(cats,1))];
      END IF;
      cat_titles := ARRAY(SELECT jsonb_array_elements_text(titles_by_cat->picked_category));
      picked_title := cat_titles[1 + ((i + s*2) % array_length(cat_titles,1))];

      INSERT INTO public.skills (user_id, category, title, description, created_at)
      VALUES (
        uid,
        picked_category,
        picked_title,
        'I can teach ' || picked_title || '. Looking to swap for something new.',
        NOW() - (s || ' days')::interval
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- Swap requests across every status, between random user pairs
-- ============================================================
INSERT INTO public.swap_requests (sender_id, receiver_id, status, created_at, updated_at)
SELECT
  s.id, r.id,
  (ARRAY['pending','accepted','rejected','cancelled'])[1 + (row_number() OVER () % 4)::int],
  NOW() - ((row_number() OVER ())::int || ' hours')::interval,
  NOW() - ((row_number() OVER ())::int || ' hours')::interval
FROM (SELECT id, row_number() OVER (ORDER BY created_at) AS rn FROM public.profiles WHERE email LIKE '%@swapill.test') s
JOIN (SELECT id, row_number() OVER (ORDER BY created_at DESC) AS rn FROM public.profiles WHERE email LIKE '%@swapill.test') r
  ON s.rn = r.rn
WHERE s.id <> r.id
LIMIT 60
ON CONFLICT DO NOTHING;

-- ============================================================
-- Conversations + messages for every accepted swap request
-- ============================================================
INSERT INTO public.conversations (id, participant_one, participant_two, created_at)
SELECT gen_random_uuid(), sender_id, receiver_id, created_at
FROM public.swap_requests
WHERE status = 'accepted';

INSERT INTO public.messages (conversation_id, sender_id, content, is_read, created_at)
SELECT
  c.id,
  CASE WHEN m.n % 2 = 0 THEN c.participant_one ELSE c.participant_two END,
  (ARRAY[
    'Ahlan! Excited to swap.',
    'When works for you this week?',
    'I can do Tuesday evening — does that suit you?',
    'Tuesday is great. 7pm?',
    'Perfect. I''ll send a calendar invite.',
    'Looking forward to it!',
    'Quick question — what should I prep beforehand?',
    'Just bring your laptop, we''ll go from there.',
    'Sounds good 👍',
    'Thanks again, this was super helpful.'
  ])[1 + (m.n % 10)],
  m.n < 6,
  c.created_at + (m.n || ' minutes')::interval
FROM public.conversations c
CROSS JOIN generate_series(1, 8) AS m(n);
