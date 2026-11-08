import { paths } from '@/routes/paths'

export const starterCoursesSection = {
  title: 'Courses to get you started',
  subtitle: 'Explore courses from experienced, real-world experts.',
  viewAll: 'View all courses',
  viewAllTo: paths.courses,
  tabs: [
    { id: 'popular', label: 'Most popular' },
    { id: 'new', label: 'New' },
    { id: 'trending', label: 'Trending' },
  ],
} as const

export type StarterList = (typeof starterCoursesSection.tabs)[number]['id']

export type StarterCourse = {
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
  badge: 'bestseller' | 'new' | null
  topic: {
    id: string
    label: string
    icon: 'python' | 'react' | 'aws' | 'data'
  }
  gradient: string
  lists: StarterList[]
  categoryIds: string[]
}

const itIds = [
  'it-software',
  'it-certifications',
  'network-security',
  'hardware',
  'operating-systems-servers',
  'other-it-software',
]

const devIds = [
  'development',
  'web-development',
  'mobile-development',
  'programming-languages',
  'game-development',
]

export const starterCourses: StarterCourse[] = [
  {
    id: 'python-bootcamp',
    title: 'Complete Python Bootcamp',
    instructor: {
      name: 'Dr. Aneesh V V',
      avatar:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 12364,
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'bestseller',
    topic: { id: 'python', label: 'python', icon: 'python' },
    gradient: 'bg-gradient-to-br from-[#063226] via-[#0B6B4A] to-[#14B87A]',
    lists: ['popular', 'trending'],
    categoryIds: [...itIds, ...devIds, 'data-science'],
  },
  {
    id: 'react-projects',
    title: 'React.js – Build Real-World Projects',
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.7,
    reviews: 8721,
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'new',
    topic: { id: 'react', label: 'React', icon: 'react' },
    gradient: 'bg-gradient-to-br from-[#08142C] via-[#12325C] to-[#1E4F9A]',
    lists: ['popular', 'new', 'trending'],
    categoryIds: [...itIds, ...devIds],
  },
  {
    id: 'aws-clf-c02',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    instructor: {
      name: 'Stephanie N',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 9230,
    price: 599,
    originalPrice: 1999,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'bestseller',
    topic: { id: 'aws', label: 'aws', icon: 'aws' },
    gradient: 'bg-gradient-to-br from-[#3A1606] via-[#9A4310] to-[#E07A1A]',
    lists: ['popular', 'trending'],
    categoryIds: [...itIds],
  },
  {
    id: 'data-science-ml',
    title: 'Data Science & Machine Learning A-Z',
    instructor: {
      name: 'Neha Sharma',
      avatar:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.7,
    reviews: 7540,
    price: 599,
    originalPrice: 1999,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: null,
    topic: { id: 'data', label: 'Data & AI', icon: 'data' },
    gradient: 'bg-gradient-to-br from-[#07111F] via-[#12243F] to-[#1C3B66]',
    lists: ['popular', 'trending'],
    categoryIds: [...itIds, 'data-science', 'development', 'programming-languages'],
  },
  {
    id: 'nextjs-15',
    title: 'Next.js 15 & Server Actions',
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 4120,
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'new',
    topic: { id: 'react', label: 'React', icon: 'react' },
    gradient: 'bg-gradient-to-br from-[#0B1020] via-[#1B2A4A] to-[#2B4A86]',
    lists: ['new', 'trending'],
    categoryIds: [...devIds, 'it-software', 'other-it-software'],
  },
  {
    id: 'kubernetes-ops',
    title: 'Kubernetes & Cloud Native Ops',
    instructor: {
      name: 'Stephanie N',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.6,
    reviews: 3180,
    price: 599,
    originalPrice: 1999,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'new',
    topic: { id: 'aws', label: 'aws', icon: 'aws' },
    gradient: 'bg-gradient-to-br from-[#102033] via-[#16324A] to-[#1F6B8A]',
    lists: ['new'],
    categoryIds: [...itIds],
  },
  {
    id: 'figma-masterclass',
    title: 'Figma UI/UX Masterclass',
    instructor: {
      name: 'Neha Sharma',
      avatar:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 6400,
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'bestseller',
    topic: { id: 'data', label: 'Data & AI', icon: 'data' },
    gradient: 'bg-gradient-to-br from-[#2A1030] via-[#6B2158] to-[#C026D3]',
    lists: ['popular', 'new', 'trending'],
    categoryIds: ['design'],
  },
  {
    id: 'digital-marketing',
    title: 'The Complete Digital Marketing Course',
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.6,
    reviews: 8910,
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '$',
    badge: 'bestseller',
    topic: { id: 'data', label: 'Data & AI', icon: 'data' },
    gradient: 'bg-gradient-to-br from-[#1A1030] via-[#3B1D6B] to-[#6D28D9]',
    lists: ['popular', 'trending'],
    categoryIds: ['marketing', 'business'],
  },
]

export const popularTopicsSection = {
  title: 'Popular Topics',
  viewAll: 'View all topics',
  viewAllTo: paths.courses,
} as const

export const popularTopics = [
  { id: 'python', name: 'Python', icon: 'python' },
  { id: 'javascript', name: 'JavaScript', icon: 'javascript' },
  { id: 'java', name: 'Java', icon: 'java' },
  { id: 'react', name: 'React', icon: 'react' },
  { id: 'nodejs', name: 'Node.js', icon: 'nodejs' },
  { id: 'aws', name: 'AWS', icon: 'aws' },
  { id: 'cyber-security', name: 'Cyber Security', icon: 'cyber' },
  { id: 'data-analysis', name: 'Data Analysis', icon: 'data' },
  { id: 'machine-learning', name: 'Machine Learning', icon: 'ml' },
  { id: 'devops', name: 'DevOps', icon: 'devops' },
] as const

export const popularInstructorsSection = {
  title: 'Popular Instructors',
  viewAll: 'View all instructors',
  viewAllTo: paths.courses,
} as const

export const popularInstructors = [
  {
    id: 'aneesh-vv',
    name: 'Aneesh V V',
    role: 'Python Expert',
    rating: 4.8,
    students: '20k+',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'neha-sharma',
    name: 'Neha Sharma',
    role: 'Data Science Mentor',
    rating: 4.7,
    students: '18k+',
    avatar:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'rohit-verma',
    name: 'Rohit Verma',
    role: 'Cloud & DevOps Expert',
    rating: 4.6,
    students: '15k+',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Web Development Expert',
    rating: 4.8,
    students: '12k+',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'daniel-scott',
    name: 'Daniel Scott',
    role: 'React Specialist',
    rating: 4.7,
    students: '14k+',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'stephanie-n',
    name: 'Stephanie N',
    role: 'AWS Instructor',
    rating: 4.8,
    students: '16k+',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  },
] as const

export const catalogListSection = {
  titlePrefix: 'All',
  titleSuffix: 'Courses',
  subtitle: 'Discover the best IT and software courses to grow your career',
  allSubtitle: 'Discover the best courses to grow your career',
  sortLabel: 'Sort by',
  totalLabel: '1,200+ courses',
  allTotalLabel: '2,400+ courses',
  filtersTitle: 'Filters',
  clearAll: 'Clear all',
  sortOptions: [
    { id: 'popular', label: 'Most Popular' },
    { id: 'rated', label: 'Highest Rated' },
    { id: 'newest', label: 'Newest' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
  ],
  ratings: [
    { id: '4.5', value: 4.5, label: '4.5 & up', count: 620 },
    { id: '4.0', value: 4, label: '4.0 & up', count: 980 },
    { id: '3.5', value: 3.5, label: '3.5 & up', count: 1120 },
    { id: '3.0', value: 3, label: '3.0 & up', count: 1180 },
  ],
  durations: [
    { id: '0-2', label: '0-2 hours', count: 180, max: 2 },
    { id: '2-6', label: '2-6 hours', count: 560, min: 2, max: 6 },
    { id: '6-17', label: '6-17 hours', count: 980, min: 6, max: 17 },
    { id: '17+', label: '17+ hours', count: 420, min: 17 },
  ],
  levels: [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'expert', label: 'Expert' },
  ],
  languages: [
    { id: 'english', label: 'English' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'spanish', label: 'Spanish' },
  ],
  prices: [
    { id: 'paid', label: 'Paid' },
    { id: 'free', label: 'Free' },
  ],
  subtitles: [
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'hindi', label: 'Hindi' },
  ],
  pageSize: 5,
  totalPages: 80,
  firstPage: 'First page',
  lastPage: 'Last page',
} as const

export type CatalogSort = (typeof catalogListSection.sortOptions)[number]['id']
export type CatalogLevel = (typeof catalogListSection.levels)[number]['id']
export type CatalogTopicIcon = 'python' | 'react' | 'aws' | 'data' | 'cyber'

export type CatalogCourse = {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
  }
  rating: number
  reviews: number
  hours: number
  lectures: number
  level: CatalogLevel
  language: string
  subtitles: string[]
  price: number
  originalPrice: number
  pricePrefix: string
  originalPrefix: string
  badge: 'bestseller' | 'new' | null
  topic: {
    id: string
    label: string
    icon: CatalogTopicIcon
  }
  gradient: string
  tags: string[]
  isNew: boolean
  categoryIds: string[]
}

export const catalogCourses: CatalogCourse[] = [
  {
    id: 'python-bootcamp',
    title: 'Complete Python Bootcamp From Zero to Hero',
    description:
      'Learn Python programming with real projects, hands-on exercises and build a strong portfolio.',
    instructor: {
      name: 'Dr. Aneesh V V',
      avatar:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 12364,
    hours: 41,
    lectures: 220,
    level: 'all',
    language: 'english',
    subtitles: ['english'],
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: 'bestseller',
    topic: { id: 'python', label: 'python', icon: 'python' },
    gradient: 'bg-gradient-to-br from-[#063226] via-[#0B6B4A] to-[#14B87A]',
    tags: ['Python', 'Programming', 'Data Science'],
    isNew: false,
    categoryIds: [...itIds, ...devIds, 'data-science'],
  },
  {
    id: 'react-projects',
    title: 'React.js – Build Real-World Projects',
    description:
      'Master React.js from basics to advanced and build modern web applications.',
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.7,
    reviews: 8721,
    hours: 24,
    lectures: 180,
    level: 'intermediate',
    language: 'english',
    subtitles: ['english'],
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: 'new',
    topic: { id: 'react', label: 'React', icon: 'react' },
    gradient: 'bg-gradient-to-br from-[#08142C] via-[#12325C] to-[#1E4F9A]',
    tags: ['React', 'JavaScript', 'Frontend Development'],
    isNew: true,
    categoryIds: [...itIds, ...devIds],
  },
  {
    id: 'aws-clf-c02',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    description:
      'Prepare for AWS certification with real-world examples and practice tests.',
    instructor: {
      name: 'Stephanie N',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 9230,
    hours: 18,
    lectures: 150,
    level: 'all',
    language: 'english',
    subtitles: ['english'],
    price: 599,
    originalPrice: 1999,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: 'bestseller',
    topic: { id: 'aws', label: 'aws', icon: 'aws' },
    gradient: 'bg-gradient-to-br from-[#3A1606] via-[#9A4310] to-[#E07A1A]',
    tags: ['AWS', 'Cloud Computing', 'Certification'],
    isNew: false,
    categoryIds: [...itIds],
  },
  {
    id: 'cyber-fundamentals',
    title: 'Cyber Security Fundamentals – Go from Beginner to Pro',
    description:
      'Learn network security, ethical hacking and real-world security practices.',
    instructor: {
      name: 'Rohit Verma',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.6,
    reviews: 4980,
    hours: 22,
    lectures: 210,
    level: 'intermediate',
    language: 'english',
    subtitles: ['english'],
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: null,
    topic: { id: 'cyber', label: 'Cyber', icon: 'cyber' },
    gradient: 'bg-gradient-to-br from-[#07111F] via-[#12243F] to-[#1C3B66]',
    tags: ['Cyber Security', 'Ethical Hacking', 'Network Security'],
    isNew: false,
    categoryIds: [...itIds],
  },
  {
    id: 'data-science-ml',
    title: 'Data Science & Machine Learning A-Z',
    description:
      'Learn data analysis, machine learning, deep learning and build real projects.',
    instructor: {
      name: 'Neha Sharma',
      avatar:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.7,
    reviews: 7540,
    hours: 30,
    lectures: 250,
    level: 'all',
    language: 'english',
    subtitles: ['english'],
    price: 599,
    originalPrice: 1999,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: null,
    topic: { id: 'data', label: 'Data & AI', icon: 'data' },
    gradient: 'bg-gradient-to-br from-[#07111F] via-[#0B2A22] to-[#14532D]',
    tags: ['Python', 'Machine Learning', 'Data Analysis'],
    isNew: false,
    categoryIds: [...itIds, 'data-science', 'development', 'programming-languages'],
  },
  {
    id: 'figma-masterclass',
    title: 'Figma UI/UX Masterclass',
    description: 'Design modern interfaces and prototypes with Figma, from basics to advanced systems.',
    instructor: {
      name: 'Neha Sharma',
      avatar:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.8,
    reviews: 6400,
    hours: 16,
    lectures: 120,
    level: 'beginner',
    language: 'english',
    subtitles: ['english'],
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: 'bestseller',
    topic: { id: 'data', label: 'Design', icon: 'data' },
    gradient: 'bg-gradient-to-br from-[#2A1030] via-[#6B2158] to-[#C026D3]',
    tags: ['UI/UX', 'Figma', 'Web Design'],
    isNew: false,
    categoryIds: ['design'],
  },
  {
    id: 'digital-marketing',
    title: 'The Complete Digital Marketing Course',
    description: 'Learn SEO, social, and growth marketing with campaigns you can apply at work.',
    instructor: {
      name: 'Daniel Scott',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
    rating: 4.6,
    reviews: 8910,
    hours: 20,
    lectures: 160,
    level: 'all',
    language: 'english',
    subtitles: ['english', 'spanish'],
    price: 499,
    originalPrice: 1499,
    pricePrefix: '$',
    originalPrefix: '₹',
    badge: 'bestseller',
    topic: { id: 'data', label: 'Marketing', icon: 'data' },
    gradient: 'bg-gradient-to-br from-[#1A1030] via-[#3B1D6B] to-[#6D28D9]',
    tags: ['SEO', 'Social Media', 'Content Marketing'],
    isNew: false,
    categoryIds: ['marketing', 'business'],
  },
]

function durationId(hours: number) {
  if (hours < 2) return '0-2'
  if (hours < 6) return '2-6'
  if (hours < 17) return '6-17'
  return '17+'
}

export type CatalogFilters = {
  rating: number | null
  durations: string[]
  levels: string[]
  languages: string[]
  prices: string[]
  subtitles: string[]
}

function courseMatchesQuery(course: CatalogCourse, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return (
    course.title.toLowerCase().includes(needle) ||
    course.description.toLowerCase().includes(needle) ||
    course.instructor.name.toLowerCase().includes(needle) ||
    course.topic.label.toLowerCase().includes(needle) ||
    course.tags.some((tag) => tag.toLowerCase().includes(needle))
  )
}

export function searchCatalogCourses(query: string, limit = 6) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  return catalogCourses
    .filter((course) => courseMatchesQuery(course, needle))
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      const aExact = aTitle === needle ? 0 : aTitle.startsWith(needle) ? 1 : 2
      const bExact = bTitle === needle ? 0 : bTitle.startsWith(needle) ? 1 : 2
      if (aExact !== bExact) return aExact - bExact
      return b.reviews - a.reviews
    })
    .slice(0, limit)
}

export function findCatalogCourse(query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return undefined

  const exact = catalogCourses.find((course) => course.title.toLowerCase() === needle)
  if (exact) return exact

  const matches = searchCatalogCourses(needle, 2)
  if (matches.length === 1) return matches[0]
  if (matches.length > 0 && matches[0].title.toLowerCase().startsWith(needle)) {
    return matches[0]
  }
  return undefined
}

export function getCatalogCourses(
  categoryId: string,
  filters: CatalogFilters,
  sort: CatalogSort,
  topicId?: string | null,
  query?: string | null,
) {
  const inCategory =
    categoryId === 'all'
      ? catalogCourses
      : catalogCourses.filter((course) => course.categoryIds.includes(categoryId))
  const pool = categoryId === 'all' || inCategory.length > 0 ? inCategory : catalogCourses

  const filtered = pool.filter((course) => {
    if (filters.rating !== null && course.rating < filters.rating) return false
    if (filters.durations.length > 0 && !filters.durations.includes(durationId(course.hours))) {
      return false
    }
    if (filters.levels.length > 0 && !filters.levels.includes(course.level)) return false
    if (filters.languages.length > 0 && !filters.languages.includes(course.language)) {
      return false
    }
    if (filters.prices.length > 0) {
      const paid = course.price > 0
      const match = (filters.prices.includes('paid') && paid) || (filters.prices.includes('free') && !paid)
      if (!match) return false
    }
    if (
      filters.subtitles.length > 0 &&
      !filters.subtitles.some((item) => course.subtitles.includes(item))
    ) {
      return false
    }
    if (topicId) {
      const needle = topicId.toLowerCase()
      const topicMatch = course.topic.id.toLowerCase() === needle
      const tagMatch = course.tags.some((tag) => tag.toLowerCase().includes(needle))
      if (!topicMatch && !tagMatch) return false
    }
    if (query && !courseMatchesQuery(course, query)) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    if (sort === 'rated') return b.rating - a.rating
    if (sort === 'newest') return Number(b.isNew) - Number(a.isNew)
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    return 0
  })
}

export const categoryCtaSection = {
  badge: 'Start your learning journey',
  title: 'Upgrade Your Skills with Maqskillz',
  descriptionPrefix: 'Get unlimited access to thousands of',
  descriptionSuffix: 'courses and learn from industry experts.',
  primaryCta: 'Start Learning Today',
  primaryTo: paths.signup,
  image:
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
  words: ['Learn', 'Practice', 'Build', 'Grow'],
  accentWord: 'Grow',
} as const

export function getStarterCourses(categoryId: string, list: StarterList) {
  const inCategory =
    categoryId === 'all'
      ? starterCourses
      : starterCourses.filter((course) => course.categoryIds.includes(categoryId))
  const pool = categoryId === 'all' || inCategory.length > 0 ? inCategory : starterCourses
  const listed = pool.filter((course) => course.lists.includes(list))
  const result = listed.length > 0 ? listed : pool
  return result.slice(0, 4)
}
