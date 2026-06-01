export interface User {
  id: string;
  name: string;
  avatar_url?: string;
  role: string;
  bio: string;
  email: string;
  rating: number;
  completedExchanges: number;
}

export interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  userId: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export const USERS: User[] = [
  {
    id: '1',
    name: 'Ziad Amr',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ziad',
    role: 'React Developer',
    bio: 'React and TypeScript expert with 5+ years of experience building scalable web applications.',
    email: 'ziad@swapill.app',
    rating: 4.9,
    completedExchanges: 42,
  },
  {
    id: '2',
    name: 'Salma Ezz',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Salma',
    role: 'Python Developer',
    bio: 'Python specialist focusing on data science, machine learning, and backend development.',
    email: 'salma@swapill.app',
    rating: 5.0,
    completedExchanges: 56,
  },
  {
    id: '3',
    name: 'Hany Adel',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hany',
    role: 'Cybersecurity Expert',
    bio: 'Information security specialist with expertise in ethical hacking and network security.',
    email: 'hany@swapill.app',
    rating: 4.8,
    completedExchanges: 28,
  },
  {
    id: '4',
    name: 'Kareem Fouad',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kareem',
    role: 'Mobile App Developer',
    bio: 'iOS and Android app developer with React Native and Flutter expertise.',
    email: 'kareem@swapill.app',
    rating: 4.7,
    completedExchanges: 35,
  },
  {
    id: '5',
    name: 'Nour El-Sayed',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nour',
    role: 'Guitar Instructor',
    bio: 'Acoustic and electric guitar teacher with 10+ years of performance experience.',
    email: 'nour@swapill.app',
    rating: 4.9,
    completedExchanges: 64,
  },
  {
    id: '6',
    name: 'Youssef Khaled',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef',
    role: 'Piano Teacher',
    bio: 'Classical piano instructor with conservatory training and modern teaching methods.',
    email: 'youssef@swapill.app',
    rating: 5.0,
    completedExchanges: 31,
  },
  {
    id: '7',
    name: 'Mariam Said',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariam',
    role: 'Music Producer',
    bio: 'Music production specialist with DAW expertise and sound engineering skills.',
    email: 'mariam@swapill.app',
    rating: 4.6,
    completedExchanges: 29,
  },
  {
    id: '8',
    name: 'Omar Tarek',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    role: 'Creative Writer',
    bio: 'Fiction writer and storytelling coach with published works and workshop experience.',
    email: 'omar@swapill.app',
    rating: 4.8,
    completedExchanges: 47,
  },
  {
    id: '9',
    name: 'Fatima Hassan',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    role: 'Content Strategist',
    bio: 'Content strategy expert with focus on digital marketing and brand storytelling.',
    email: 'fatima@swapill.app',
    rating: 4.7,
    completedExchanges: 38,
  },
  {
    id: '10',
    name: 'Ahmed Mahmoud',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    role: 'Copywriter',
    bio: 'Professional copywriter specializing in advertising, marketing, and brand messaging.',
    email: 'ahmed@swapill.app',
    rating: 4.9,
    completedExchanges: 51,
  },
  {
    id: '11',
    name: 'Layla Kamel',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Layla',
    role: 'Arabic Poet',
    bio: 'Arabic poetry specialist with classical and contemporary verse expertise.',
    email: 'layla@swapill.app',
    rating: 4.8,
    completedExchanges: 33,
  },
  {
    id: '12',
    name: 'Karim Ali',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    role: 'English Tutor',
    bio: 'English conversation expert with business communication and accent training.',
    email: 'karim@swapill.app',
    rating: 4.6,
    completedExchanges: 27,
  },
  {
    id: '13',
    name: 'Mona Zaki',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mona',
    role: 'German Teacher',
    bio: 'German language instructor with B1 certification and business German focus.',
    email: 'mona@swapill.app',
    rating: 4.7,
    completedExchanges: 42,
  },
  {
    id: '14',
    name: 'Hassan El-Din',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan',
    role: 'French Instructor',
    bio: 'French teacher specializing in beginner level and conversational French.',
    email: 'hassan@swapill.app',
    rating: 4.9,
    completedExchanges: 22,
  },
  {
    id: '15',
    name: 'Salma Said',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Salma',
    role: 'Spanish Teacher',
    bio: 'Spanish language expert with Latin American culture and business Spanish.',
    email: 'salma.said@swapill.app',
    rating: 4.8,
    completedExchanges: 39,
  },
  {
    id: '16',
    name: 'Amir Khaled',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amir',
    role: 'SEO Specialist',
    bio: 'Search engine optimization expert with proven ranking improvement results.',
    email: 'amir@swapill.app',
    rating: 4.7,
    completedExchanges: 31,
  },
  {
    id: '17',
    name: 'Nour Adel',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nour',
    role: 'Italian Teacher',
    bio: 'Italian language instructor with native fluency and cultural expertise.',
    email: 'nour@swapill.app',
    rating: 4.6,
    completedExchanges: 25,
  },
  {
    id: '18',
    name: 'Dina Maher',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dina',
    role: 'Database Administrator',
    bio: 'Database management specialist with SQL and NoSQL expertise.',
    email: 'dina@swapill.app',
    rating: 4.8,
    completedExchanges: 19,
  },
  {
    id: '19',
    name: 'Bassem Youssef',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bassem',
    role: 'Network Engineer',
    bio: 'Network infrastructure and security specialist with cloud computing experience.',
    email: 'bassem@swapill.app',
    rating: 4.9,
    completedExchanges: 33,
  },
  {
    id: '20',
    name: 'Rania Samir',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rania',
    role: 'Translation Services',
    bio: 'Professional translator for Arabic, English, and French business communications.',
    email: 'rania@swapill.app',
    rating: 4.7,
    completedExchanges: 28,
  }
];

export const SKILLS: Skill[] = [
  {
    id: 's1',
    title: 'React Development',
    category: 'Tech',
    description: 'Master React, hooks, state management, and build modern web applications.',
    userId: '1',
    level: 'Expert'
  },
  {
    id: 's2',
    title: 'Python Programming',
    category: 'Tech',
    description: 'Learn Python for data science, machine learning, and backend development.',
    userId: '2',
    level: 'Expert'
  },
  {
    id: 's3',
    title: 'Cybersecurity Fundamentals',
    category: 'Tech',
    description: 'Ethical hacking, network security, and information protection basics.',
    userId: '3',
    level: 'Intermediate'
  },
  {
    id: 's4',
    title: 'Mobile App Development',
    category: 'Tech',
    description: 'Build iOS and Android apps with React Native and Flutter frameworks.',
    userId: '4',
    level: 'Expert'
  },
  {
    id: 's5',
    title: 'Acoustic Guitar',
    category: 'Music',
    description: 'Learn acoustic guitar from basic chords to advanced fingerpicking techniques.',
    userId: '5',
    level: 'Beginner'
  },
  {
    id: 's6',
    title: 'Piano Basics',
    category: 'Music',
    description: 'Classical piano fundamentals for beginners with modern teaching methods.',
    userId: '6',
    level: 'Beginner'
  },
  {
    id: 's7',
    title: 'Music Production',
    category: 'Music',
    description: 'DAW expertise, sound engineering, and music production techniques.',
    userId: '7',
    level: 'Intermediate'
  },
  {
    id: 's8',
    title: 'Creative Writing',
    category: 'Writing',
    description: 'Fiction writing, storytelling techniques, and narrative development.',
    userId: '8',
    level: 'Intermediate'
  },
  {
    id: 's9',
    title: 'Content Strategy',
    category: 'Writing',
    description: 'Digital content planning, brand storytelling, and marketing strategy.',
    userId: '9',
    level: 'Expert'
  },
  {
    id: 's10',
    title: 'Copywriting Mastery',
    category: 'Writing',
    description: 'Professional copywriting for advertising, marketing, and brand messaging.',
    userId: '10',
    level: 'Expert'
  },
  {
    id: 's11',
    title: 'Arabic Poetry',
    category: 'Writing',
    description: 'Classical and contemporary Arabic poetry writing and appreciation.',
    userId: '11',
    level: 'Intermediate'
  },
  {
    id: 's12',
    title: 'English Conversation',
    category: 'Languages',
    description: 'Business English communication and accent training for professionals.',
    userId: '12',
    level: 'Intermediate'
  },
  {
    id: 's13',
    title: 'German B1 Level',
    category: 'Languages',
    description: 'German language fundamentals with business communication focus.',
    userId: '13',
    level: 'Intermediate'
  },
  {
    id: 's14',
    title: 'French for Beginners',
    category: 'Languages',
    description: 'French language basics with conversational and cultural elements.',
    userId: '14',
    level: 'Beginner'
  },
  {
    id: 's15',
    title: 'Spanish Language',
    category: 'Languages',
    description: 'Spanish for business and travel with Latin American cultural context.',
    userId: '15',
    level: 'Intermediate'
  },
  {
    id: 's16',
    title: 'SEO Optimization',
    category: 'Marketing',
    description: 'Search engine optimization with proven ranking improvement strategies.',
    userId: '16',
    level: 'Expert'
  },
  {
    id: 's17',
    title: 'Social Media Ads',
    category: 'Marketing',
    description: 'Facebook, Instagram, and LinkedIn advertising campaign management.',
    userId: '17',
    level: 'Expert'
  },
  {
    id: 's18',
    title: 'Branding Design',
    category: 'Marketing',
    description: 'Brand identity, logo design, and visual storytelling expertise.',
    userId: '18',
    level: 'Intermediate'
  },
  {
    id: 's19',
    title: 'Public Speaking',
    category: 'Soft Skills',
    description: 'Presentation skills, confidence building, and effective communication.',
    userId: '19',
    level: 'Intermediate'
  },
  {
    id: 's20',
    title: 'Time Management',
    category: 'Soft Skills',
    description: 'Productivity optimization, workflow management, and efficiency techniques.',
    userId: '20',
    level: 'Expert'
  }
];

export const CHATS = [
  {
    id: 'c1',
    participants: ['1', 'current'],
    lastMessage: 'Hey! I saw your request for design help.',
    time: '2m ago'
  },
  {
    id: 'c2',
    participants: ['2', 'current'],
    lastMessage: 'Are you still interested in learning React?',
    time: '1h ago'
  }
];
