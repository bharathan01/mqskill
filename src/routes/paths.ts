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
    courses: '/employee/courses',
    courseDetail: '/employee/courses/:courseId',
    assessments: '/employee/assessments',
    assessmentQuiz: '/employee/assessments/:assessmentId/quiz',
    assessmentSubmit: '/employee/assessments/:assessmentId/submit',
    assessmentResult: '/employee/assessments/:assessmentId/result',
    sessions: '/employee/sessions',
    sessionDetail: '/employee/sessions/:sessionId',
    certificates: '/employee/certificates',
    certificateDetail: '/employee/certificates/:certificateId',
    notifications: '/employee/notifications',
    help: '/employee/help',
    newTicket: '/employee/help/new',
    ticketDetail: '/employee/help/:ticketId',
    profile: '/employee/profile',
    invite: '/invite',
  },
  tutor: {
    root: '/tutor',
    dashboard: '/tutor',
  },
  admin: {
    root: '/admin',
    login: '/admin/login',
    dashboard: '/admin',
  },
  content: {
    root: '/content',
    dashboard: '/content',
    courses: '/content/courses',
    versions: '/content/versions',
    drafts: '/content/drafts',
    createCourse: '/content/courses/new',
    courseBuilder: '/content/courses/new/builder',
    courseQuiz: '/content/courses/new/quiz',
    courseSettings: '/content/courses/new/settings',
    coursePreview: '/content/courses/new/preview',
    scorm: '/content/scorm',
    scormValidation: '/content/scorm/validation',
    assessments: '/content/assessments',
    quizzes: '/content/quizzes',
    assignments: '/content/assignments',
    questionBank: '/content/question-bank',
    cpd: '/content/cpd',
    certificates: '/content/certificates',
    media: '/content/media',
    qa: '/content/qa',
    analytics: '/content/analytics',
    history: '/content/history',
    notifications: '/content/notifications',
    profile: '/content/profile',
    help: '/content/help',
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

export function employeeCoursePath(courseId: string) {
  return `/employee/courses/${courseId}`
}

export function employeeHelpTicketPath(ticketId: string) {
  return `/employee/help/${ticketId}`
}
