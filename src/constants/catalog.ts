export const categoriesSection = {
  title: 'Explore Top Categories',
  viewAll: 'View all categories',
} as const

export const categories = [
  { id: 'development', name: 'Development', courseCount: '1,200+', icon: 'code' },
  { id: 'business', name: 'Business', courseCount: '800+', icon: 'briefcase' },
  { id: 'design', name: 'Design', courseCount: '700+', icon: 'layers' },
  { id: 'it-software', name: 'IT & Software', courseCount: '600+', icon: 'monitor' },
  { id: 'marketing', name: 'Marketing', courseCount: '600+', icon: 'megaphone' },
  { id: 'data-science', name: 'Data Science', courseCount: '450+', icon: 'database' },
  { id: 'personal-dev', name: 'Personal Dev', courseCount: '400+', icon: 'user' },
  { id: 'health-fitness', name: 'Health & Fitness', courseCount: '300+', icon: 'heart' },
] as const

export const trendingSection = {
  title: 'Trending Courses',
  subtitle: 'Most popular courses in Maqskillz right now',
  viewAll: 'View all courses',
} as const

export type Course = {
  id: string
  title: string
  instructor: {
    name: string
    avatar: string
  }
  rating: number
  reviews: number
  price: number
  originalPrice: number
  pricePrefix: string
  originalPrefix: string
  bestseller: boolean
  image: string
  skills: string[]
}

export const trendingCourses: Course[] = [
  {
    id: 'python-bootcamp',
    title: 'Complete Python Bootcamp From Zero to Hero',
    instructor: {
      name: 'Dr. Angela Yu',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80',
    },
    rating: 4.8,
    reviews: 12340,
    price: 449,
    originalPrice: 2999,
    pricePrefix: '₹',
    originalPrefix: '₹',
    bestseller: true,
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80',
    skills: ['Python', 'Django', 'Web Development'],
  },
  {
    id: 'uiux-masterclass',
    title: 'UI/UX Design Masterclass Build Real-World Projects',
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
    },
    rating: 4.7,
    reviews: 8210,
    price: 499,
    originalPrice: 3499,
    pricePrefix: '₹',
    originalPrefix: '₹',
    bestseller: false,
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    skills: ['Web Development', 'JavaScript', 'React', 'UI/UX', 'Figma', 'Web Design'],
  },
  {
    id: 'digital-marketing',
    title: 'The Complete Digital Marketing Course',
    instructor: {
      name: 'Mark Thompson',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80',
    },
    rating: 4.6,
    reviews: 9812,
    price: 499,
    originalPrice: 3999,
    pricePrefix: '₹',
    originalPrefix: '₹',
    bestseller: true,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    skills: ['SEO', 'Social Media', 'Content Marketing', 'Web Development'],
  },
  {
    id: 'data-science-ml',
    title: 'Data Science & Machine Learning A-Z',
    instructor: {
      name: 'Kirill Eremenko',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    },
    rating: 4.8,
    reviews: 15321,
    price: 599,
    originalPrice: 4999,
    pricePrefix: '₹',
    originalPrefix: '₹',
    bestseller: false,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    skills: ['Python', 'Data Science', 'Machine Learning'],
  },
]

export const popularSkillsSection = {
  title: 'Popular Skills',
  subtitle: 'Explore in-demand skills to boost your career',
  viewAll: 'View all skills',
} as const

export const popularSkillTabs = [
  {
    id: 'development',
    label: 'Development',
    skills: [
      'Python',
      'Web Development',
      'JavaScript',
      'React',
      'Node.js',
      'Django',
      'Data Science',
      'Machine Learning',
    ],
    courseIds: [
      'python-bootcamp',
      'uiux-masterclass',
      'digital-marketing',
      'data-science-ml',
    ],
  },
  {
    id: 'business',
    label: 'Business',
    skills: ['Excel', 'Finance', 'Management', 'Entrepreneurship', 'Leadership'],
    courseIds: ['digital-marketing'],
  },
  {
    id: 'design',
    label: 'Design',
    skills: ['UI/UX', 'Figma', 'Graphic Design', 'Web Design', 'Prototyping'],
    courseIds: ['uiux-masterclass'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    skills: ['SEO', 'Social Media', 'Content Marketing', 'Paid Ads', 'Branding'],
    courseIds: ['digital-marketing'],
  },
  {
    id: 'it-software',
    label: 'IT & Software',
    skills: ['Python', 'Node.js', 'Cloud', 'Cybersecurity', 'DevOps'],
    courseIds: ['python-bootcamp', 'data-science-ml'],
  },
  {
    id: 'personal-development',
    label: 'Personal Development',
    skills: ['Communication', 'Productivity', 'Career', 'Leadership'],
    courseIds: ['python-bootcamp', 'digital-marketing'],
  },
] as const

