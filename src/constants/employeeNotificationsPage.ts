import { paths } from '@/routes/paths'

export type EmployeeNotificationCategory =
  | 'courses'
  | 'assessments'
  | 'certificates'
  | 'sessions'
  | 'announcements'
  | 'support'

export type EmployeeNotificationGroup = 'today' | 'yesterday' | 'earlier'

export type EmployeeNotificationTone =
  | 'warning'
  | 'session'
  | 'assessment'
  | 'certificate'
  | 'announcement'
  | 'support'
  | 'course'

export type EmployeeInboxNotification = {
  id: string
  category: EmployeeNotificationCategory
  group: EmployeeNotificationGroup
  tone: EmployeeNotificationTone
  title: string
  body: string
  time: string
  unread: boolean
  actionLabel: string
  actionTo: string
}

export const employeeNotificationsPage = {
  eyebrow: 'Inbox',
  title: 'Notifications',
  subtitle: 'Updates about your courses, assessments, certificates and live sessions.',
  markAllRead: 'Mark all as read',
  settings: 'Settings',
  empty: 'No notifications in this view.',
  caughtUp: "You're all caught up for the last 30 days.",
  markedToast: 'All notifications marked as read.',
  filters: {
    all: 'All',
    unread: 'Unread',
    courses: 'Courses',
    assessments: 'Assessments',
    certificates: 'Certificates',
    sessions: 'Live sessions',
    announcements: 'Announcements',
  },
  groups: {
    today: 'Today',
    yesterday: 'Yesterday',
    earlier: 'Earlier this week',
  } satisfies Record<EmployeeNotificationGroup, string>,
} as const

export type EmployeeNotificationFilter = keyof typeof employeeNotificationsPage.filters

function courseLink(courseId: string) {
  return `${paths.employee.courses}/${courseId}`
}

function assessmentQuizLink(assessmentId: string) {
  return `${paths.employee.assessments}/${assessmentId}/quiz`
}

function assessmentSubmitLink(assessmentId: string) {
  return `${paths.employee.assessments}/${assessmentId}/submit`
}

function assessmentResultLink(assessmentId: string) {
  return `${paths.employee.assessments}/${assessmentId}/result`
}

function sessionLink(sessionId: string) {
  return `${paths.employee.sessions}/${sessionId}`
}

function certificateLink(certificateId: string) {
  return `${paths.employee.certificates}/${certificateId}`
}

export const employeeInboxNotifications: EmployeeInboxNotification[] = [
  {
    id: 'n-course-expire',
    category: 'courses',
    group: 'today',
    tone: 'warning',
    title: 'Course access expires in 5 days',
    body: 'ISO 9001:2015 Quality Management Awareness — 2 modules remaining. Finish before access ends.',
    time: '12 min ago',
    unread: true,
    actionLabel: 'Continue course',
    actionTo: courseLink('iso-9001'),
  },
  {
    id: 'n-session-tomorrow',
    category: 'sessions',
    group: 'today',
    tone: 'session',
    title: 'Live session starts tomorrow',
    body: 'ISO 27001 Q&A with Dr. Tariq Al-Sabah · Tomorrow at 2:00 PM (45 min).',
    time: '1h ago',
    unread: true,
    actionLabel: 'Add to calendar',
    actionTo: sessionLink('iso27001-qa'),
  },
  {
    id: 'n-assessment-unlocked',
    category: 'assessments',
    group: 'today',
    tone: 'assessment',
    title: 'New assessment unlocked',
    body: 'Workplace Health & Safety Quiz is ready — 15 questions · 70% to pass.',
    time: '3h ago',
    unread: true,
    actionLabel: 'Start assessment',
    actionTo: assessmentQuizLink('q-whs-m1'),
  },
  {
    id: 'n-cert-issued',
    category: 'certificates',
    group: 'yesterday',
    tone: 'certificate',
    title: 'Certificate issued',
    body: 'Your CPD certificate for Workplace Compliance Essentials is ready to download.',
    time: 'Yesterday · 4:20 PM',
    unread: false,
    actionLabel: 'View certificate',
    actionTo: certificateLink('cert-whs'),
  },
  {
    id: 'n-announcement',
    category: 'announcements',
    group: 'yesterday',
    tone: 'announcement',
    title: 'New announcement from ABC Corporation',
    body: 'Mandatory compliance training deadline: complete assigned courses by 30 Nov 2026.',
    time: 'Yesterday · 11:05 AM',
    unread: false,
    actionLabel: 'Read announcement',
    actionTo: paths.employee.dashboard,
  },
  {
    id: 'n-support-reply',
    category: 'support',
    group: 'earlier',
    tone: 'support',
    title: 'Support replied to ticket MS-0042',
    body: 'We’ve reset your assessment attempt window. You can retake the quiz from My Assessments.',
    time: 'Mon · 3:40 PM',
    unread: false,
    actionLabel: 'View ticket',
    actionTo: `${paths.employee.help}/ms-0042`,
  },
  {
    id: 'n-course-assigned',
    category: 'courses',
    group: 'earlier',
    tone: 'course',
    title: 'New course assigned',
    body: 'Digital Marketing Fundamentals was assigned by L&D · ABC Corporation.',
    time: 'Mon · 10:15 AM',
    unread: false,
    actionLabel: 'Open course',
    actionTo: courseLink('digital-marketing'),
  },
  {
    id: 'n-assessment-due',
    category: 'assessments',
    group: 'earlier',
    tone: 'assessment',
    title: 'Assessment due in 3 days',
    body: 'ISO 9001 Module 4 assignment is due Friday. Submit before the deadline.',
    time: 'Sun · 6:10 PM',
    unread: false,
    actionLabel: 'Open assessment',
    actionTo: assessmentSubmitLink('a-iso-m4'),
  },
  {
    id: 'n-recording-ready',
    category: 'sessions',
    group: 'earlier',
    tone: 'session',
    title: 'Session recording available',
    body: 'ISO 27001 Q&A recording and slides are ready to review.',
    time: 'Sun · 1:25 PM',
    unread: false,
    actionLabel: 'Watch recording',
    actionTo: sessionLink('iso27001-qa'),
  },
  {
    id: 'n-cert-expiring',
    category: 'certificates',
    group: 'earlier',
    tone: 'certificate',
    title: 'Certificate expiring soon',
    body: 'ISO 9001:2015 certificate expires on 12 Dec 2026. Download a copy for your records.',
    time: 'Sat · 9:00 AM',
    unread: false,
    actionLabel: 'View certificate',
    actionTo: certificateLink('cert-iso'),
  },
  {
    id: 'n-course-progress',
    category: 'courses',
    group: 'earlier',
    tone: 'course',
    title: 'Keep your streak going',
    body: 'You’re 62% through Workplace Health & Safety. Finish Module 3 this week.',
    time: 'Sat · 8:30 AM',
    unread: false,
    actionLabel: 'Continue course',
    actionTo: courseLink('whs'),
  },
  {
    id: 'n-assessment-graded',
    category: 'assessments',
    group: 'earlier',
    tone: 'assessment',
    title: 'Assessment graded',
    body: 'AML Essentials quiz scored 92%. Your certificate is being prepared.',
    time: 'Fri · 5:45 PM',
    unread: false,
    actionLabel: 'View result',
    actionTo: assessmentResultLink('q-aml-m2'),
  },
]

export function employeeNotificationFilterCounts(
  items: EmployeeInboxNotification[],
): Record<EmployeeNotificationFilter, number> {
  return {
    all: items.length,
    unread: items.filter((item) => item.unread).length,
    courses: items.filter((item) => item.category === 'courses').length,
    assessments: items.filter((item) => item.category === 'assessments').length,
    certificates: items.filter((item) => item.category === 'certificates').length,
    sessions: items.filter((item) => item.category === 'sessions').length,
    announcements: items.filter((item) => item.category === 'announcements').length,
  }
}

/** Short list used by the header dropdown. */
export const employeeNotifications = employeeInboxNotifications.slice(0, 3).map((item) => ({
  id: item.id,
  title: item.title,
  detail: item.body,
  time: item.time,
  unread: item.unread,
}))
