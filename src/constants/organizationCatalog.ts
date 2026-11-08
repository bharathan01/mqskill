export type OrganizationCatalogLevel = 'Beginner' | 'Intermediate' | 'All levels'
export type OrganizationCatalogSort = 'popular' | 'newest' | 'price-asc' | 'price-desc'
export type OrganizationCatalogIcon =
  | 'megaphone'
  | 'shield'
  | 'badge'
  | 'briefcase'
  | 'alert'
  | 'chat'

export type OrganizationCatalogCourse = {
  id: string
  title: string
  category: string
  level: OrganizationCatalogLevel
  duration: string
  cpdHours: number
  price: string
  ownedSeats: number | null
  freeSeats: number | null
  icon: OrganizationCatalogIcon
  accent: string
  popular: boolean
}

export const organizationCatalogPage = {
  title: 'Course catalog',
  subtitle: 'Buy seats for any course. 1 seat = 1 employee. Only the seats you buy are billed.',
  cart: 'Cart',
  searchPlaceholder: 'Search 40+ courses',
  allCategories: 'All categories',
  anyLevel: 'Any level',
  sortPopular: 'Most popular',
  sortNewest: 'Newest',
  sortPriceAsc: 'Price: low to high',
  sortPriceDesc: 'Price: high to low',
  allCourses: 'All courses',
  details: 'Details',
  addToCart: 'Add to cart',
  ownedSeats: (owned: number, free: number) => `Own ${owned} seats · ${free} free`,
  showing: 'Showing',
  of: 'of',
  courses: 'courses',
  loadMore: 'Load more',
  empty: 'No courses match your filters.',
  addedToast: 'Course added to cart.',
  requestHint: (course: string, name: string) =>
    `Approve seat for ${name}: find “${course}” and add it to cart.`,
} as const

export const organizationCatalogCategories = [
  { id: 'all', label: 'All courses' },
  { id: 'Compliance', label: 'Compliance' },
  { id: 'Health & safety', label: 'Health & safety' },
  { id: 'Quality', label: 'Quality' },
  { id: 'Management', label: 'Management' },
  { id: 'Marketing', label: 'Marketing' },
  { id: 'Soft skills', label: 'Soft skills' },
] as const

export const organizationCatalogLevels = [
  'Beginner',
  'Intermediate',
  'All levels',
] as const

export const organizationCatalogCourses: OrganizationCatalogCourse[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    category: 'Marketing',
    level: 'Beginner',
    duration: '4h 20m',
    cpdHours: 4,
    price: '15.000 KWD',
    ownedSeats: 10,
    freeSeats: 3,
    icon: 'megaphone',
    accent: 'from-[#7C3AED] to-[#A855F7]',
    popular: true,
  },
  {
    id: 'whs',
    title: 'Workplace Health & Safety',
    category: 'Health & safety',
    level: 'All levels',
    duration: '3h 10m',
    cpdHours: 3,
    price: '12.000 KWD',
    ownedSeats: 50,
    freeSeats: 5,
    icon: 'shield',
    accent: 'from-[#059669] to-[#34D399]',
    popular: true,
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Quality Awareness',
    category: 'Quality',
    level: 'Intermediate',
    duration: '5h 00m',
    cpdHours: 5,
    price: '18.000 KWD',
    ownedSeats: 20,
    freeSeats: 0,
    icon: 'badge',
    accent: 'from-[#2563EB] to-[#60A5FA]',
    popular: true,
  },
  {
    id: 'pm',
    title: 'Project Management Fundamentals',
    category: 'Management',
    level: 'Beginner',
    duration: '6h 15m',
    cpdHours: 6,
    price: '20.000 KWD',
    ownedSeats: 40,
    freeSeats: 16,
    icon: 'briefcase',
    accent: 'from-[#EA580C] to-[#FB923C]',
    popular: true,
  },
  {
    id: 'aml',
    title: 'Anti-Money Laundering (AML) Essentials',
    category: 'Compliance',
    level: 'All levels',
    duration: '3h 45m',
    cpdHours: 4,
    price: '14.000 KWD',
    ownedSeats: null,
    freeSeats: null,
    icon: 'alert',
    accent: 'from-[#DC2626] to-[#F87171]',
    popular: true,
  },
  {
    id: 'communication',
    title: 'Professional Communication Skills',
    category: 'Soft skills',
    level: 'Beginner',
    duration: '2h 50m',
    cpdHours: 3,
    price: '10.000 KWD',
    ownedSeats: null,
    freeSeats: null,
    icon: 'chat',
    accent: 'from-[#0D9488] to-[#2DD4BF]',
    popular: true,
  },
  {
    id: 'gdpr',
    title: 'Data Privacy & GDPR Basics',
    category: 'Compliance',
    level: 'Beginner',
    duration: '2h 30m',
    cpdHours: 2,
    price: '11.000 KWD',
    ownedSeats: 8,
    freeSeats: 2,
    icon: 'shield',
    accent: 'from-[#1D4ED8] to-[#3B82F6]',
    popular: false,
  },
  {
    id: 'leadership',
    title: 'Leadership Essentials',
    category: 'Management',
    level: 'Intermediate',
    duration: '5h 40m',
    cpdHours: 5,
    price: '22.000 KWD',
    ownedSeats: 12,
    freeSeats: 4,
    icon: 'briefcase',
    accent: 'from-[#7C2D12] to-[#EA580C]',
    popular: false,
  },
  {
    id: 'customer-service',
    title: 'Customer Service Excellence',
    category: 'Soft skills',
    level: 'All levels',
    duration: '3h 20m',
    cpdHours: 3,
    price: '9.500 KWD',
    ownedSeats: null,
    freeSeats: null,
    icon: 'chat',
    accent: 'from-[#BE185D] to-[#F472B6]',
    popular: false,
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety Awareness',
    category: 'Health & safety',
    level: 'Beginner',
    duration: '1h 45m',
    cpdHours: 2,
    price: '8.000 KWD',
    ownedSeats: 25,
    freeSeats: 10,
    icon: 'alert',
    accent: 'from-[#B45309] to-[#F59E0B]',
    popular: false,
  },
  {
    id: 'social-media',
    title: 'Social Media for Business',
    category: 'Marketing',
    level: 'Beginner',
    duration: '3h 55m',
    cpdHours: 4,
    price: '13.000 KWD',
    ownedSeats: null,
    freeSeats: null,
    icon: 'megaphone',
    accent: 'from-[#6D28D9] to-[#C084FC]',
    popular: false,
  },
  {
    id: 'iso-14001',
    title: 'ISO 14001 Environmental Awareness',
    category: 'Quality',
    level: 'Intermediate',
    duration: '4h 10m',
    cpdHours: 4,
    price: '16.000 KWD',
    ownedSeats: 6,
    freeSeats: 1,
    icon: 'badge',
    accent: 'from-[#047857] to-[#10B981]',
    popular: false,
  },
]
