import { paths } from '@/routes/paths'

export const employeeShell = {
  brandTag: 'Employee portal',
  orgName: 'ABC Corporation',
  breadcrumbRoot: 'Employee',
  notificationCount: 3,
  notificationsTitle: 'Notifications',
  notificationsEmpty: 'No new notifications.',
  notificationsView: 'View all notifications',
} as const

export const employeeUser = {
  name: 'Ahmed Al-Mutawa',
  firstName: 'Ahmed',
  role: 'Corporate Learner',
  initials: 'AA',
  email: 'ahmed@abccorporation.com',
} as const

export const employeeNavGroups = [
  {
    id: 'learning',
    label: 'Learning',
    links: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: paths.employee.dashboard,
        icon: 'dashboard' as const,
        end: true,
      },
      {
        id: 'courses',
        label: 'My Courses',
        to: paths.employee.courses,
        icon: 'courses' as const,
      },
      {
        id: 'assessments',
        label: 'My Assessments',
        to: paths.employee.assessments,
        icon: 'assessments' as const,
      },
      {
        id: 'sessions',
        label: 'Live Sessions',
        to: paths.employee.sessions,
        icon: 'sessions' as const,
      },
      {
        id: 'certificates',
        label: 'Certificates & CPD',
        to: paths.employee.certificates,
        icon: 'certificates' as const,
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    links: [
      {
        id: 'help',
        label: 'Help & Support',
        to: paths.employee.help,
        icon: 'help' as const,
      },
      {
        id: 'profile',
        label: 'Profile & Settings',
        to: paths.employee.profile,
        icon: 'profile' as const,
      },
    ],
  },
] as const

export const employeeNavFooter = {
  signOut: { label: 'Log out', to: paths.login },
} as const

export const employeeLogoutModal = {
  title: 'Log out?',
  body: 'You’ll need to sign in again to access your courses, assessments and certificates.',
  cancel: 'Cancel',
  confirm: 'Log out',
} as const

export type EmployeeCourseStatus = 'not_started' | 'in_progress' | 'completed'

export const employeeDashboardCourses = [
  {
    id: 'whs',
    title: 'Workplace Health & Safety',
    status: 'in_progress' as EmployeeCourseStatus,
    progress: 62,
    due: 'Due 30 Nov 2026',
    cpdHours: 8,
    accent: 'from-[#004EA8] to-[#3B82F6]',
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Quality Management Awareness',
    status: 'in_progress' as EmployeeCourseStatus,
    progress: 65,
    due: 'Due 15 Dec 2026',
    cpdHours: 6,
    accent: 'from-[#0F766E] to-[#14B8A6]',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    status: 'not_started' as EmployeeCourseStatus,
    progress: 0,
    due: 'Starts anytime',
    cpdHours: 10,
    accent: 'from-[#7C3AED] to-[#A855F7]',
  },
  {
    id: 'aml',
    title: 'Anti-Money Laundering Essentials',
    status: 'completed' as EmployeeCourseStatus,
    progress: 100,
    due: 'Completed 20 Oct 2026',
    cpdHours: 6,
    accent: 'from-[#B45309] to-[#F59E0B]',
  },
]

export const employeeDashboardSessions = [
  {
    id: 's1',
    title: 'Fire safety briefing',
    when: 'Tomorrow · 10:00 AM',
    duration: '45 min',
  },
  {
    id: 's2',
    title: 'ISO 9001 Q&A with tutor',
    when: '12 Nov · 2:00 PM',
    duration: '60 min',
  },
]

export const employeeDashboardPage = {
  heroBadge: 'ABC Corporation · Learning program',
  heroTitle: (name: string) => `Welcome back, ${name}!`,
  heroSubtitle:
    'You have 2 courses in progress. Keep going — your next assessment is due this week.',
  metrics: [
    {
      id: 'assigned',
      label: 'Assigned courses',
      value: '4',
      detail: '3 active · 1 done',
    },
    {
      id: 'progress',
      label: 'In progress',
      value: '2',
      detail: 'Avg 45% complete',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: '1',
      detail: 'Certificate earned',
    },
    {
      id: 'cpd',
      label: 'CPD hours',
      value: '6',
      detail: '24 hrs available',
    },
  ],
  coursesTitle: 'My learning',
  viewAllCourses: 'View all courses',
  continue: 'Continue',
  start: 'Start',
  review: 'Review',
  status: {
    not_started: 'Not started',
    in_progress: 'In progress',
    completed: 'Completed',
  },
  sessionsTitle: 'Upcoming sessions',
  noSessions: 'No upcoming sessions.',
  requestTraining: 'Request training',
  visitHelp: 'Visit Help & Support →',
  gettingStartedTitle: 'Getting started',
  gettingStartedProgress: '2 of 4',
  checklist: [
    { id: 'activate', label: 'Activate your account', done: true },
    { id: 'preferences', label: 'Set your preferences', done: true },
    { id: 'photo', label: 'Add a profile photo', done: false, to: paths.employee.profile },
    {
      id: '2fa',
      label: 'Turn on two-step verification',
      done: false,
      to: paths.employee.profile,
    },
  ],
  requestToast: 'Training request sent to your admin.',
} as const

export const employeePlaceholderPage = {
  comingSoon: 'This screen is coming next in the employee portal.',
} as const
