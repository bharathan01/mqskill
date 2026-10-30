export const paths = {
  home: '/',
  login: '/login',
  signup: '/signup',
  courses: '/courses',
  category: '/courses/:categoryId',
  course: '/course/:courseId',
  business: '/business',
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  blog: '/blog',
  help: '/help',
  faqs: '/faqs',
  terms: '/terms',
  privacy: '/privacy',
  student: {
    root: '/student',
    dashboard: '/student',
    courses: '/student/courses',
    certificates: '/student/certificates',
    payments: '/student/payments',
    profile: '/student/profile',
    settings: '/student/settings',
    language: '/student/language',
    help: '/student/help',
  },
  tutor: {
    root: '/tutor',
    dashboard: '/tutor',
  },
  admin: {
    root: '/admin',
    dashboard: '/admin',
  },
} as const

export function categoryPath(slug: string) {
  return `${paths.courses}/${slug}`
}

export function coursePath(slug: string) {
  return `/course/${slug}`
}
