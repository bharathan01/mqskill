import { paths } from '@/routes/paths'

export const superAdminShell = {
  brand: 'MAQSKILLZ',
  brandTag: 'Super Administration',
  breadcrumbRoot: 'Super Admin',
  searchPlaceholder: 'Search courses, students, organizations…',
  searchShortcut: '⌘K',
  userName: 'Super Admin',
  userOrg: 'Owner · MaqSkillz',
  initials: 'SA',
  profile: 'My Profile',
  help: 'Help & Support',
  logout: 'Logout',
  notifications: 8,
} as const

export type SuperAdminNavIcon =
  | 'dashboard'
  | 'courses'
  | 'assessments'
  | 'certificates'
  | 'live'
  | 'students'
  | 'organizations'
  | 'sales'
  | 'announcements'
  | 'support'
  | 'reports'
  | 'users'
  | 'settings'

export type SuperAdminNavChild = {
  id: string
  label: string
  to: string
  end?: boolean
}

export type SuperAdminNavGroup = {
  id: string
  label: string
  icon: SuperAdminNavIcon
  children: SuperAdminNavChild[]
}

export type SuperAdminNavSection = {
  id: string
  label: string
  groups: SuperAdminNavGroup[]
}

const a = paths.admin

export const superAdminNavSections: SuperAdminNavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    groups: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        children: [
          { id: 'executive', label: 'Executive Overview', to: a.dashboard, end: true },
          { id: 'business', label: 'Business Performance Summary', to: a.businessPerformance },
          { id: 'kpis', label: 'Key Performance Indicators', to: a.kpis },
          { id: 'activity', label: 'Recent Activity', to: a.activity },
        ],
      },
    ],
  },
  {
    id: 'learning',
    label: 'Learning Management',
    groups: [
      {
        id: 'courses',
        label: 'Course Management',
        icon: 'courses',
        children: [
          { id: 'all-courses', label: 'All Courses', to: a.courses },
          { id: 'create-course', label: 'Create Course', to: a.createCourse },
          { id: 'categories', label: 'Course Categories', to: a.courseCategories },
          { id: 'pricing', label: 'Course Pricing', to: a.coursePricing },
          { id: 'scorm', label: 'SCORM Packages', to: a.scorm },
          { id: 'scorm-validation', label: 'SCORM Validation', to: a.scormValidation },
          { id: 'versions', label: 'Course Versions', to: a.courseVersions },
          { id: 'publishing-history', label: 'Publishing History', to: a.publishingHistory },
          { id: 'course-analytics', label: 'Course Analytics', to: a.courseAnalytics },
          { id: 'media', label: 'Media Library', to: a.media },
          { id: 'course-intelligence', label: 'Course Intelligence', to: a.courseIntelligence },
        ],
      },
      {
        id: 'assessments',
        label: 'Assessments & Quizzes',
        icon: 'assessments',
        children: [
          { id: 'quizzes', label: 'Module Quizzes', to: a.quizzes },
          { id: 'assignments', label: 'Assignments', to: a.assignments },
          { id: 'bank', label: 'Question Bank', to: a.questionBank },
          { id: 'analytics', label: 'Assessment Analytics', to: a.assessmentAnalytics },
        ],
      },
      {
        id: 'certificates',
        label: 'Certificates & CPD',
        icon: 'certificates',
        children: [
          { id: 'issued', label: 'All Issued Certificates', to: a.certificates },
          { id: 'verify', label: 'Certificate Verification', to: a.certificateVerify },
          { id: 'status', label: 'Valid / Expired Certificates', to: a.certificateStatus },
          { id: 'cpd', label: 'CPD Hours and Credits', to: a.cpd },
          { id: 'requirements', label: 'Certification Requirements', to: a.certificateRequirements },
          { id: 'templates', label: 'Certificate Templates', to: a.certificateTemplates },
          { id: 'reports', label: 'Certificate Reports', to: a.certificateReports },
        ],
      },
      {
        id: 'live',
        label: 'Live Classes',
        icon: 'live',
        children: [
          { id: 'all-live', label: 'All Live Classes', to: a.liveClasses },
          { id: 'schedule', label: 'Schedule Live Class', to: a.scheduleLive },
          { id: 'upcoming', label: 'Upcoming Sessions', to: a.upcomingSessions },
          { id: 'completed', label: 'Completed Sessions', to: a.completedSessions },
          { id: 'zoom', label: 'Zoom Links', to: a.zoomLinks },
          { id: 'attendance', label: 'Attendance', to: a.attendance },
          { id: 'reports', label: 'Live Class Reports', to: a.liveReports },
        ],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business and User Management',
    groups: [
      {
        id: 'students',
        label: 'Students',
        icon: 'students',
        children: [
          { id: 'all-students', label: 'All Students', to: a.students },
          { id: 'details', label: 'Student Details', to: a.studentDetails },
          { id: 'by-country', label: 'Country-Wise Students', to: a.studentsByCountry },
          { id: 'analytics', label: 'Registration Analytics', to: a.studentAnalytics },
          { id: 'purchases', label: 'Purchased Courses', to: a.studentPurchases },
          { id: 'enrollments', label: 'Active Enrollments', to: a.enrollments },
          { id: 'progress', label: 'Learning Progress', to: a.studentProgress },
          { id: 'assessments', label: 'Assessment Results', to: a.studentAssessments },
          { id: 'certificates', label: 'Certificates', to: a.studentCertificates },
          { id: 'payments', label: 'Payment History', to: a.studentPayments },
        ],
      },
      {
        id: 'organizations',
        label: 'Organizations',
        icon: 'organizations',
        children: [
          { id: 'all-orgs', label: 'All Organizations', to: a.organizations },
          { id: 'profiles', label: 'Organization Profiles', to: a.organizationProfiles },
          { id: 'plans', label: 'Organization Plans', to: a.organizationPlans },
          { id: 'employees', label: 'Employee Lists', to: a.organizationEmployees },
          { id: 'purchases', label: 'Course Purchases', to: a.organizationPurchases },
          { id: 'seats', label: 'Purchased / Assigned / Unused Seats', to: a.organizationSeats },
          { id: 'versions', label: 'Version Allocations', to: a.organizationVersionAllocations },
          { id: 'training', label: 'Training Progress', to: a.organizationTraining },
          { id: 'invoices', label: 'Organization Invoices', to: a.organizationInvoices },
          { id: 'performance', label: 'Performance Analytics', to: a.organizationPerformance },
        ],
      },
      {
        id: 'sales',
        label: 'Sales & Finance',
        icon: 'sales',
        children: [
          { id: 'overview', label: 'Financial Overview', to: a.finance },
          { id: 'orders', label: 'Orders and Transactions', to: a.orders },
          { id: 'order-detail', label: 'Order Detail', to: a.orderDetail },
          { id: 'b2c', label: 'B2C Sales', to: a.b2cSales },
          { id: 'b2b', label: 'B2B Sales', to: a.b2bSales },
          { id: 'revenue-reports', label: 'Revenue Reports', to: a.revenueReports },
          { id: 'invoices', label: 'Invoices', to: a.salesInvoices },
          { id: 'refunds', label: 'Refunds', to: a.refunds },
          { id: 'coupons', label: 'Coupons and Discounts', to: a.coupons },
          { id: 'gateways', label: 'Payment Gateways', to: a.salesGateways },
          { id: 'tax', label: 'Tax and Fees', to: a.taxFees },
          { id: 'costs', label: 'Costs and Profitability', to: a.costs },
          { id: 'exports', label: 'Financial Exports', to: a.financialExports },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations and Intelligence',
    groups: [
      {
        id: 'announcements',
        label: 'Announcements',
        icon: 'announcements',
        children: [
          { id: 'all', label: 'All Announcements', to: a.announcements },
          { id: 'create', label: 'Create Announcement', to: a.createAnnouncement },
          { id: 'audience', label: 'Target Audience', to: a.announcementAudience },
          { id: 'scheduled', label: 'Scheduled Announcements', to: a.scheduledAnnouncements },
          { id: 'history', label: 'Announcement History', to: a.announcementHistory },
        ],
      },
      {
        id: 'support',
        label: 'Support & Queries',
        icon: 'support',
        children: [
          { id: 'tickets', label: 'All Support Tickets', to: a.support },
          { id: 'student', label: 'Student Queries', to: a.studentQueries },
          { id: 'org', label: 'Organization Queries', to: a.organizationQueries },
          { id: 'employee', label: 'Employee Support', to: a.employeeSupport },
          { id: 'qa', label: 'Course Q&A', to: a.courseQa },
          { id: 'categories', label: 'Ticket Categories', to: a.ticketCategories },
          { id: 'history', label: 'Resolution History', to: a.resolutionHistory },
        ],
      },
      {
        id: 'reports',
        label: 'Reports & Analytics',
        icon: 'reports',
        children: [
          { id: 'executive', label: 'Executive Reports', to: a.reports },
          { id: 'revenue', label: 'Revenue Analytics', to: a.revenueAnalytics },
          { id: 'trending', label: 'Trending Course Reports', to: a.trendingCourseReport },
          { id: 'geo', label: 'Geographic Analytics', to: a.geographicAnalytics },
          { id: 'growth', label: 'Student Growth', to: a.studentGrowth },
          { id: 'orgs', label: 'Organization Reports', to: a.organizationReports },
          { id: 'learning', label: 'Learning Analytics', to: a.learningAnalytics },
          { id: 'assessment', label: 'Assessment Reports', to: a.assessmentReports },
          { id: 'certification', label: 'Certification Reports', to: a.certificationReports },
          { id: 'exports', label: 'Report Exports', to: a.reportExports },
        ],
      },
    ],
  },
  {
    id: 'system',
    label: 'System Administration',
    groups: [
      {
        id: 'users',
        label: 'Users & Permissions',
        icon: 'users',
        children: [
          { id: 'admins', label: 'Administrator Accounts', to: a.admins },
          { id: 'content', label: 'Content Admin Accounts', to: a.contentAdmins },
          { id: 'roles', label: 'Role Permissions', to: a.roles },
          { id: 'access', label: 'Account Access', to: a.accountAccess },
          { id: 'status', label: 'Account Status', to: a.accountStatus },
          { id: 'logs', label: 'Admin Activity Logs', to: a.adminLogs },
          { id: 'security-logs', label: 'Security Audit Logs', to: a.securityLogs },
        ],
      },
      {
        id: 'settings',
        label: 'Platform Settings',
        icon: 'settings',
        children: [
          { id: 'general', label: 'General Settings', to: a.settings },
          { id: 'branding', label: 'Platform Branding', to: a.branding },
          { id: 'languages', label: 'Languages', to: a.languages },
          { id: 'payments', label: 'Payment Gateway Configuration', to: a.paymentGateways },
          { id: 'categories', label: 'Course Categories', to: a.settingsCategories },
          { id: 'certificates', label: 'Certificate Configuration', to: a.certificateConfig },
          { id: 'email', label: 'Email and Notifications', to: a.emailNotifications },
          { id: 'integrations', label: 'Zoom and Integrations', to: a.integrations },
          { id: 'security', label: 'Security Settings', to: a.security },
          { id: 'system', label: 'System Configuration', to: a.systemConfig },
        ],
      },
    ],
  },
]

export const superAdminBusinessPerformancePage = {
  title: 'Business Performance Summary',
  subtitle: 'Compare this period with the previous period and the same period last year.',
  badge: 'Sample data',
  breadcrumb: 'Business Performance Summary',
  exportPdf: 'Export PDF',
  schedule: 'Schedule report',
  exportNotice: 'Business performance PDF export prepared (sample).',
  scheduleNotice: 'Report schedule saved for the selected period (sample).',
  ranges: [
    { id: 'month' as const, label: 'Month' },
    { id: 'quarter' as const, label: 'Quarter' },
    { id: 'year' as const, label: 'Year' },
    { id: 'custom' as const, label: 'Custom' },
  ],
  periodLabel: 'October 2026',
  compareLabel: 'vs previous period',
  learnerLabel: 'All learner types',
  chartTitle: 'Revenue by learner type',
  chartSubtitle: 'Last 6 months · KWD',
  highlightsTitle: 'Highlights',
  note: 'Profitability isn’t shown: course cost records haven’t been entered yet, so costs aren’t counted as zero.',
  table: {
    metric: 'Metric',
    current: 'Oct 2026',
    previous: 'Sep 2026',
    change: 'Change',
    yoyPeriod: 'Oct 2025',
    yoy: 'YoY',
  },
  legend: {
    b2c: 'B2C · individuals',
    b2b: 'B2B · organizations',
  },
} as const

export type SuperAdminBusinessRangeId = (typeof superAdminBusinessPerformancePage.ranges)[number]['id']

export const superAdminBusinessKpis = [
  { id: 'revenue', label: 'Gross revenue', value: 'KWD 48,620', change: '+12.4% vs Sep', tone: 'up' as const },
  { id: 'orders', label: 'Paid orders', value: '1,284', change: '+8.1% vs Sep', tone: 'up' as const },
  { id: 'students', label: 'New students', value: '1,148', change: '+5.7% vs Sep', tone: 'up' as const },
  { id: 'seats', label: 'Org seats sold', value: '2,540', change: '+21.0% vs Sep', tone: 'up' as const },
  { id: 'certificates', label: 'Certificates issued', value: '418', change: '−3.2% vs Sep', tone: 'down' as const },
]

export const superAdminBusinessMetrics = [
  {
    id: 'gross',
    metric: 'Gross revenue',
    current: 'KWD 48,620',
    previous: 'KWD 43,250',
    change: '12.4%',
    changeTone: 'up' as const,
    yoy: 'KWD 31,880',
    yoyChange: '52.5%',
    yoyTone: 'up' as const,
  },
  {
    id: 'refunds',
    metric: 'Refunds',
    current: 'KWD 1,184',
    previous: 'KWD 1,210',
    change: '2.1%',
    changeTone: 'down' as const,
    yoy: 'KWD 940',
    yoyChange: '26.0%',
    yoyTone: 'up' as const,
  },
  {
    id: 'net',
    metric: 'Net revenue',
    current: 'KWD 47,436',
    previous: 'KWD 42,040',
    change: '12.8%',
    changeTone: 'up' as const,
    yoy: 'KWD 30,940',
    yoyChange: '53.3%',
    yoyTone: 'up' as const,
  },
  {
    id: 'b2c',
    metric: 'B2C revenue (individuals)',
    current: 'KWD 27,310',
    previous: 'KWD 25,980',
    change: '5.1%',
    changeTone: 'up' as const,
    yoy: 'KWD 21,400',
    yoyChange: '27.6%',
    yoyTone: 'up' as const,
  },
  {
    id: 'b2b',
    metric: 'B2B revenue (organizations)',
    current: 'KWD 21,310',
    previous: 'KWD 17,270',
    change: '23.4%',
    changeTone: 'up' as const,
    yoy: 'KWD 10,480',
    yoyChange: '103%',
    yoyTone: 'up' as const,
  },
  {
    id: 'orders',
    metric: 'Paid orders',
    current: '1,284',
    previous: '1,188',
    change: '8.1%',
    changeTone: 'up' as const,
    yoy: '902',
    yoyChange: '42.4%',
    yoyTone: 'up' as const,
  },
  {
    id: 'aov',
    metric: 'Average order value',
    current: 'KWD 37.9',
    previous: 'KWD 36.4',
    change: '4.1%',
    changeTone: 'up' as const,
    yoy: 'KWD 35.3',
    yoyChange: '7.4%',
    yoyTone: 'up' as const,
  },
  {
    id: 'registrations',
    metric: 'New student registrations',
    current: '1,148',
    previous: '1,086',
    change: '5.7%',
    changeTone: 'up' as const,
    yoy: '802',
    yoyChange: '43.1%',
    yoyTone: 'up' as const,
  },
  {
    id: 'orgs',
    metric: 'New organizations',
    current: '8',
    previous: '6',
    change: '2',
    changeTone: 'up' as const,
    yoy: '5',
    yoyChange: '3',
    yoyTone: 'up' as const,
  },
  {
    id: 'completions',
    metric: 'Course completions',
    current: '734',
    previous: '701',
    change: '4.7%',
    changeTone: 'up' as const,
    yoy: '520',
    yoyChange: '41.2%',
    yoyTone: 'up' as const,
  },
  {
    id: 'certs',
    metric: 'Certificates issued',
    current: '418',
    previous: '432',
    change: '3.2%',
    changeTone: 'down' as const,
    yoy: '300',
    yoyChange: '39.3%',
    yoyTone: 'up' as const,
  },
]

export const superAdminRevenueByType = [
  { month: 'May', b2c: 22.4, b2b: 10.9 },
  { month: 'Jun', b2c: 23.8, b2b: 12.6 },
  { month: 'Jul', b2c: 25.1, b2b: 13.5 },
  { month: 'Aug', b2c: 26.2, b2b: 16.2 },
  { month: 'Sep', b2c: 27.0, b2b: 17.9 },
  { month: 'Oct', b2c: 28.4, b2b: 22.2 },
]

export const superAdminBusinessHighlights = [
  {
    id: 'b2b',
    title: 'B2B grew fastest',
    detail: '+23.4% vs Sep, led by 3 new seat purchases',
    icon: 'trend' as const,
  },
  {
    id: 'course',
    title: 'Top course by revenue',
    detail: 'Fire Warden Training · KWD 6,240',
    icon: 'award' as const,
  },
  {
    id: 'country',
    title: 'Fastest-growing country',
    detail: 'Saudi Arabia · +31% new students',
    icon: 'globe' as const,
  },
  {
    id: 'seats',
    title: 'Watch: unused organization seats',
    detail: '3,540 seats bought but not yet assigned',
    icon: 'alert' as const,
  },
]

export function normalizeAdminPath(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

export function superAdminPageTitle(pathname: string) {
  const path = normalizeAdminPath(pathname)
  for (const section of superAdminNavSections) {
    for (const group of section.groups) {
      for (const child of group.children) {
        if (path === child.to) return child.label
      }
    }
  }
  if (path.startsWith(`${paths.admin.createCourse}/`)) return 'Create Course'
  if (path === paths.admin.profile) return 'My Profile'
  if (path === paths.admin.help) return 'Help & Support'
  if (path === paths.admin.notifications) return 'Notifications'
  return 'Dashboard'
}
