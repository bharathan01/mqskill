import { paths } from '@/routes/paths'

export const organizationShell = {
  brandTag: 'Organization',
  searchPlaceholder: 'Search employees or courses.',
  orgName: 'ABC Corporation',
  cartCount: 2,
  notificationCount: 3,
  cartTitle: 'Cart',
  cartEmpty: 'Your cart is empty.',
  cartCheckout: 'Checkout',
  cartView: 'View cart',
  notificationsTitle: 'Notifications',
  notificationsEmpty: 'No new notifications.',
  notificationsView: 'View all',
} as const

export const organizationCartItems = [
  {
    id: 'iso-bundle',
    title: 'ISO 9001:2015 Quality Awareness',
    detail: '12 seats · Corporate license',
    price: 'BHD 480',
  },
  {
    id: 'pm-bundle',
    title: 'Project Management Fundamentals',
    detail: '8 seats · Corporate license',
    price: 'BHD 320',
  },
] as const

export type OrganizationNotification = {
  id: string
  title: string
  detail: string
  time: string
  unread: boolean
}

export const organizationNotifications: OrganizationNotification[] = [
  {
    id: 'n1',
    title: 'Training request pending',
    detail: '2 employees requested Digital Marketing Fundamentals.',
    time: '12m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Invoice ready',
    detail: 'Invoice #INV-2041 is awaiting payment.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Certificates issued',
    detail: '8 certificates were issued this week.',
    time: 'Yesterday',
    unread: false,
  },
]

export type OrganizationRangeId = '7d' | '30d' | '90d' | '12m'

export const organizationRanges = [
  { id: '7d' as const, label: 'Last 7 days' },
  { id: '30d' as const, label: 'Last 30 days' },
  { id: '90d' as const, label: 'Last 90 days' },
  { id: '12m' as const, label: 'Last 12 months' },
]

export const organizationUser = {
  name: 'Sara Al-Rashid',
  firstName: 'Sara',
  role: 'Organization Admin',
  initials: 'SR',
} as const

export const organizationNavGroups = [
  {
    id: 'overview',
    label: 'Overview',
    links: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: paths.organization.dashboard,
        icon: 'dashboard' as const,
        end: true,
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    links: [
      {
        id: 'employees',
        label: 'Employees',
        to: paths.organization.employees,
        icon: 'employees' as const,
      },
      {
        id: 'requests',
        label: 'Training requests',
        to: paths.organization.requests,
        icon: 'requests' as const,
      },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    links: [
      {
        id: 'catalog',
        label: 'Course catalog',
        to: paths.organization.catalog,
        icon: 'catalog' as const,
      },
      {
        id: 'purchased',
        label: 'Purchased courses',
        to: paths.organization.purchased,
        icon: 'purchased' as const,
      },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    links: [
      {
        id: 'reports',
        label: 'Reports & analytics',
        to: paths.organization.reports,
        icon: 'reports' as const,
      },
    ],
  },
  {
    id: 'communicate',
    label: 'Communicate',
    links: [
      {
        id: 'announcements',
        label: 'Announcements',
        to: paths.organization.announcements,
        icon: 'announcements' as const,
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    links: [
      {
        id: 'billing',
        label: 'Billing & invoices',
        to: paths.organization.billing,
        icon: 'billing' as const,
      },
      {
        id: 'settings',
        label: 'Organization settings',
        to: paths.organization.settings,
        icon: 'settings' as const,
      },
      {
        id: 'help',
        label: 'Help & support',
        to: paths.organization.help,
        icon: 'help' as const,
      },
    ],
  },
] as const

export const organizationNavFooter = {
  signOut: { label: 'Log out', to: paths.login },
} as const

const bestEmployeesBase = [
  {
    id: '1',
    rank: 1,
    name: 'Mariam Saleh',
    department: 'Quality',
    courses: 6,
    score: 96,
  },
  {
    id: '2',
    rank: 2,
    name: 'Yousef Hamad',
    department: 'Operations',
    courses: 5,
    score: 94,
  },
  {
    id: '3',
    rank: 3,
    name: 'Layla Hassan',
    department: 'HR',
    courses: 5,
    score: 92,
  },
  {
    id: '4',
    rank: 4,
    name: 'Omar Faisal',
    department: 'Sales',
    courses: 4,
    score: 90,
  },
  {
    id: '5',
    rank: 5,
    name: 'Noora Al-Kuwaiti',
    department: 'Operations',
    courses: 4,
    score: 89,
  },
]

const courseProgressBase = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    assigned: 24,
    completed: 18,
    percent: 75,
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Quality Awareness',
    assigned: 36,
    completed: 22,
    percent: 61,
  },
  {
    id: 'whs',
    title: 'Workplace Health & Safety',
    assigned: 40,
    completed: 31,
    percent: 78,
  },
  {
    id: 'pm',
    title: 'Project Management Fundamentals',
    assigned: 18,
    completed: 9,
    percent: 50,
  },
]

export const organizationDashboard = {
  greeting: 'Good morning, Sara',
  intro: "Here's how ABC Corporation is learning this month.",
  addEmployees: '+ Add employees',
  buyCourses: 'Buy courses',
  bestEmployees: {
    title: 'Best employees',
    subtitle: 'By courses completed and average score',
    viewAll: 'View all',
  },
  courseProgress: {
    title: 'Course progress',
    subtitle: 'Across currently assigned seats',
    viewAll: 'View purchased courses',
    headers: ['Course', 'Assigned', 'Completed', 'Completion'],
  },
  attention: {
    title: 'Needs attention',
  },
  activityTitle: 'Learning activity',
} as const

export const organizationDashboardByRange: Record<
  OrganizationRangeId,
  {
    intro: string
    stats: { id: string; label: string; value: string; detail: string }[]
    activity: {
      subtitle: string
      change: string
      footer: string
      bars: number[]
    }
    bestEmployees: typeof bestEmployeesBase
    courseProgress: typeof courseProgressBase
    attention: {
      id: string
      title: string
      detail: string
      action: string
      tone: 'red' | 'amber' | 'blue' | 'violet'
    }[]
  }
> = {
  '7d': {
    intro: "Here's how ABC Corporation learned in the last 7 days.",
    stats: [
      { id: 'employees', label: 'Employees', value: '48', detail: '22 active learners' },
      { id: 'seats', label: 'Seats', value: '96 / 120', detail: '24 free to assign' },
      { id: 'completion', label: 'Completion', value: '18%', detail: 'Weekly progress' },
      { id: 'assessments', label: 'Assessments', value: '71%', detail: '9 attempts this week' },
      { id: 'certificates', label: 'Certificates', value: '4', detail: '4 issued this week' },
    ],
    activity: {
      subtitle: 'Hours learned per day · last 7 days',
      change: '+6% vs prior week',
      footer: 'This week: 48 learning hours by 22 employees.',
      bars: [28, 36, 22, 44, 38, 52, 60],
    },
    bestEmployees: [
      { ...bestEmployeesBase[0], courses: 2, score: 98 },
      { ...bestEmployeesBase[2], courses: 2, score: 95 },
      { ...bestEmployeesBase[1], courses: 1, score: 93 },
      { ...bestEmployeesBase[4], courses: 1, score: 91 },
      { ...bestEmployeesBase[3], courses: 1, score: 88 },
    ],
    courseProgress: [
      { ...courseProgressBase[2], completed: 8, percent: 20 },
      { ...courseProgressBase[0], completed: 5, percent: 21 },
      { ...courseProgressBase[1], completed: 4, percent: 11 },
      { ...courseProgressBase[3], completed: 2, percent: 11 },
    ],
    attention: [
      {
        id: 'overdue',
        title: '2 employees overdue',
        detail: 'Courses past due this week',
        action: 'View',
        tone: 'red',
      },
      {
        id: 'requests',
        title: '1 training request',
        detail: 'Waiting for approval',
        action: 'Review',
        tone: 'violet',
      },
      {
        id: 'seats',
        title: '24 seats not assigned',
        detail: 'Available in purchased courses',
        action: 'Assign',
        tone: 'blue',
      },
    ],
  },
  '30d': {
    intro: "Here's how ABC Corporation is learning this month.",
    stats: [
      { id: 'employees', label: 'Employees', value: '48', detail: '36 active learners' },
      { id: 'seats', label: 'Seats', value: '96 / 120', detail: '24 free to assign' },
      { id: 'completion', label: 'Completion', value: '64%', detail: 'Across all seats' },
      { id: 'assessments', label: 'Assessments', value: '78%', detail: '86% pass rate' },
      { id: 'certificates', label: 'Certificates', value: '30', detail: '8 issued this week' },
    ],
    activity: {
      subtitle: 'Hours learned per week · last 12 weeks',
      change: '+11% vs last week',
      footer: 'This week: 142 learning hours by 36 employees.',
      bars: [48, 62, 55, 70, 58, 66, 74, 68, 80, 76, 88, 100],
    },
    bestEmployees: bestEmployeesBase,
    courseProgress: courseProgressBase,
    attention: [
      {
        id: 'overdue',
        title: '5 employees overdue',
        detail: 'Courses past due date',
        action: 'View',
        tone: 'red',
      },
      {
        id: 'payment',
        title: '1 order awaiting payment',
        detail: 'Invoice #INV-2041',
        action: 'Pay',
        tone: 'amber',
      },
      {
        id: 'seats',
        title: '24 seats not assigned',
        detail: 'Available in purchased courses',
        action: 'Assign',
        tone: 'blue',
      },
      {
        id: 'requests',
        title: '2 training requests',
        detail: 'Waiting for approval',
        action: 'Review',
        tone: 'violet',
      },
    ],
  },
  '90d': {
    intro: "Here's how ABC Corporation learned over the last 90 days.",
    stats: [
      { id: 'employees', label: 'Employees', value: '48', detail: '41 active learners' },
      { id: 'seats', label: 'Seats', value: '104 / 120', detail: '16 free to assign' },
      { id: 'completion', label: 'Completion', value: '71%', detail: 'Quarterly average' },
      { id: 'assessments', label: 'Assessments', value: '82%', detail: '91% pass rate' },
      { id: 'certificates', label: 'Certificates', value: '54', detail: '19 issued this quarter' },
    ],
    activity: {
      subtitle: 'Hours learned per week · last 12 weeks',
      change: '+4% vs prior quarter',
      footer: 'This quarter: 1,240 learning hours by 41 employees.',
      bars: [58, 64, 70, 66, 72, 78, 74, 82, 88, 84, 90, 96],
    },
    bestEmployees: [
      { ...bestEmployeesBase[0], courses: 9, score: 97 },
      { ...bestEmployeesBase[1], courses: 8, score: 95 },
      { ...bestEmployeesBase[2], courses: 7, score: 94 },
      { ...bestEmployeesBase[3], courses: 7, score: 92 },
      { ...bestEmployeesBase[4], courses: 6, score: 91 },
    ],
    courseProgress: [
      { ...courseProgressBase[2], completed: 34, percent: 85 },
      { ...courseProgressBase[0], completed: 20, percent: 83 },
      { ...courseProgressBase[1], completed: 28, percent: 78 },
      { ...courseProgressBase[3], completed: 12, percent: 67 },
    ],
    attention: [
      {
        id: 'overdue',
        title: '3 employees overdue',
        detail: 'Courses past due this quarter',
        action: 'View',
        tone: 'red',
      },
      {
        id: 'payment',
        title: '1 order awaiting payment',
        detail: 'Invoice #INV-2041',
        action: 'Pay',
        tone: 'amber',
      },
      {
        id: 'seats',
        title: '16 seats not assigned',
        detail: 'Available in purchased courses',
        action: 'Assign',
        tone: 'blue',
      },
    ],
  },
  '12m': {
    intro: "Here's how ABC Corporation learned over the last 12 months.",
    stats: [
      { id: 'employees', label: 'Employees', value: '48', detail: '45 active learners' },
      { id: 'seats', label: 'Seats', value: '112 / 120', detail: '8 free to assign' },
      { id: 'completion', label: 'Completion', value: '79%', detail: 'Annual average' },
      { id: 'assessments', label: 'Assessments', value: '85%', detail: '93% pass rate' },
      { id: 'certificates', label: 'Certificates', value: '126', detail: '42 issued this year' },
    ],
    activity: {
      subtitle: 'Hours learned per month · last 12 months',
      change: '+19% vs prior year',
      footer: 'This year: 4,860 learning hours by 45 employees.',
      bars: [42, 48, 55, 60, 58, 66, 72, 70, 78, 84, 90, 95],
    },
    bestEmployees: [
      { ...bestEmployeesBase[0], courses: 14, score: 97 },
      { ...bestEmployeesBase[1], courses: 12, score: 96 },
      { ...bestEmployeesBase[2], courses: 11, score: 94 },
      { ...bestEmployeesBase[4], courses: 10, score: 93 },
      { ...bestEmployeesBase[3], courses: 10, score: 92 },
    ],
    courseProgress: [
      { ...courseProgressBase[2], completed: 38, percent: 95 },
      { ...courseProgressBase[0], completed: 22, percent: 92 },
      { ...courseProgressBase[1], completed: 33, percent: 92 },
      { ...courseProgressBase[3], completed: 15, percent: 83 },
    ],
    attention: [
      {
        id: 'seats',
        title: '8 seats not assigned',
        detail: 'Available in purchased courses',
        action: 'Assign',
        tone: 'blue',
      },
      {
        id: 'requests',
        title: '4 training requests',
        detail: 'Waiting for annual planning review',
        action: 'Review',
        tone: 'violet',
      },
    ],
  },
}

export function getOrganizationDashboard(rangeId: OrganizationRangeId) {
  return organizationDashboardByRange[rangeId]
}
