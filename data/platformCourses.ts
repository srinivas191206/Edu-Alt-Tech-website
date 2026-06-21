function getThumbnail(title: string, folder: string): string {
  const seed = encodeURIComponent((title || folder || 'course').replace(/\s+/g, '-').toLowerCase().slice(0, 50));
  return `https://picsum.photos/seed/${seed}/400/225`;
}

export interface PlatformCourse {
  title: string;
  description: string;
  category: 'education' | 'alternative';
  price: number;
  thumbnailUrl: string;
  folder: string;
  duration: string;
  level: string;
  classLevel: string;
  comingSoon: boolean;
}

export const PLATFORM_COURSES: PlatformCourse[] = [
  {
  title: 'Artificial Intelligence Fundamentals',
  description: 'Industry aligned curriculum covering AI/ML concepts, neural networks, deep learning, NLP, and computer vision. Includes hands-on projects with Python and TensorFlow. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'alternative',
  price: 699,
  thumbnailUrl: getThumbnail('Artificial Intelligence Fundamentals', 'Artificial Intelligence'),
  folder: 'Artificial Intelligence',
  duration: '3 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Full Stack Development',
  description: 'Industry aligned curriculum covering HTML, CSS, JavaScript, React, Node.js, MongoDB, and deployment. Build real-world projects and portfolio. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'alternative',
  price: 799,
  thumbnailUrl: getThumbnail('Full Stack Development', 'Technology'),
  folder: 'Technology',
  duration: '4 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Entrepreneurship & Startups',
  description: 'Industry aligned curriculum covering business ideation, MVP development, funding strategies, marketing, and scaling. Learn from real startup founders. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'alternative',
  price: 499,
  thumbnailUrl: getThumbnail('Entrepreneurship & Startups', 'Entrepreneurship'),
  folder: 'Entrepreneurship',
  duration: '2 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Digital Marketing Growth',
  description: 'Industry aligned curriculum covering SEO, social media marketing, content strategy, paid ads, email marketing, and analytics. Hands-on campaigns with real budgets. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'alternative',
  price: 599,
  thumbnailUrl: getThumbnail('Digital Marketing Growth', 'Career Development'),
  folder: 'Career Development',
  duration: '2 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Advanced Mathematics',
  description: 'Industry aligned curriculum covering algebra, calculus, trigonometry, probability, statistics, and applied problem-solving. Designed for competitive exams and real-world applications. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'education',
  price: 699,
  thumbnailUrl: getThumbnail('Advanced Mathematics', 'Core Education'),
  folder: 'Core Education',
  duration: '4 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Physics Excellence Module',
  description: 'Industry aligned curriculum covering mechanics, electromagnetism, optics, thermodynamics, and modern physics. Interactive experiments and problem-solving sessions. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'education',
  price: 799,
  thumbnailUrl: getThumbnail('Physics Excellence Module', 'Core Education'),
  folder: 'Core Education',
  duration: '4 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Music & Creative Arts',
  description: 'Industry aligned curriculum covering vocal training, instrumental skills, music theory, composition, digital art, and design thinking. Showcase your talent in our student recitals. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'education',
  price: 599,
  thumbnailUrl: getThumbnail('Music & Creative Arts', 'Music'),
  folder: 'Music',
  duration: '3 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
  {
  title: 'Creative Digital Design',
  description: 'Industry aligned curriculum covering graphic design, UI/UX principles, Adobe Creative Suite, Figma, typography, color theory, and branding. Build a professional portfolio. Certificate provided upon completion. Demo class available for all ages before enrollment.',
  category: 'alternative',
  price: 699,
  thumbnailUrl: getThumbnail('Creative Digital Design', 'Arts & Creativity'),
  folder: 'Arts & Creativity',
  duration: '3 months',
  level: 'Beginner-Adv',
  classLevel: 'All Ages',
  comingSoon: false,
  },
];
