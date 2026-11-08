export const paths = {
  home: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
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
  organization: {
    root: '/organization',
    dashboard: '/organization',
    employees: '/organization/employees',
    employeeDetail: '/organization/employees/:employeeId',
    requests: '/organization/requests',
    catalog: '/organization/catalog',
    cart: '/organization/cart',
    checkout: '/organization/checkout',
    paymentSuccess: '/organization/checkout/success',
    purchased: '/organization/purchased',
    purchasedDetail: '/organization/purchased/:courseId',
    reports: '/organization/reports',
    announcements: '/organization/announcements',
    newAnnouncement: '/organization/announcements/new',
    billing: '/organization/billing',
    invoiceDetail: '/organization/billing/:invoiceId',
    settings: '/organization/settings',
    help: '/organization/help',
    newTicket: '/organization/help/new',
    ticketDetail: '/organization/help/:ticketId',
  },
  employee: {
    root: '/employee',
    dashboard: '/employee',
    invite: '/invite',
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

export function organizationEmployeePath(employeeId: string) {
  return `/organization/employees/${employeeId}`
}

export function organizationPurchasedCoursePath(courseId: string) {
  return `/organization/purchased/${courseId}`
}

export function organizationInvoicePath(invoiceId: string) {
  return `/organization/billing/${invoiceId}`
}

export function organizationHelpTicketPath(ticketId: string) {
  return `/organization/help/${ticketId}`
}
