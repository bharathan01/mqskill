import { paths } from '@/routes/paths'

export const contentAdminShell = {
  brand: 'MaqSkillz',
  brandTag: 'Content Administration',
  breadcrumbRoot: 'Content Admin',
  searchPlaceholder: 'Search courses, modules, media…',
  searchShortcut: '⌘K',
  userName: 'Content Admin',
  userOrg: 'MaqSkillz Staff',
  initials: 'CA',
  profile: 'Profile & Settings',
  help: 'Help & Support',
  logout: 'Logout',
} as const

export const contentAdminNavGroups = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard' as const,
    children: [{ id: 'overview', label: 'Overview', to: paths.content.dashboard, end: true }],
  },
  {
    id: 'courses',
    label: 'Course Management',
    icon: 'courses' as const,
    children: [
      { id: 'all-courses', label: 'All Courses', to: paths.content.courses, end: true },
      { id: 'versions', label: 'Course Versions', to: paths.content.versions },
      { id: 'drafts', label: 'Draft Courses', to: paths.content.drafts },
      { id: 'create', label: 'Create Course', to: paths.content.createCourse },
    ],
  },
  {
    id: 'scorm',
    label: 'SCORM Content',
    icon: 'scorm' as const,
    children: [
      { id: 'packages', label: 'SCORM Packages', to: paths.content.scorm },
      { id: 'validation', label: 'Package Validation', to: paths.content.scormValidation },
    ],
  },
  {
    id: 'assessments',
    label: 'Assessments & Quizzes',
    icon: 'assessments' as const,
    children: [
      { id: 'quizzes', label: 'Quizzes', to: paths.content.quizzes },
      { id: 'assignments', label: 'Assignments', to: paths.content.assignments },
      { id: 'bank', label: 'Question Bank', to: paths.content.questionBank },
    ],
  },
  {
    id: 'cpd',
    label: 'CPD & Certification',
    icon: 'cpd' as const,
    children: [
      { id: 'config', label: 'CPD Configuration', to: paths.content.cpd },
      { id: 'templates', label: 'Certificate Templates', to: paths.content.certificates },
    ],
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: 'media' as const,
    children: [{ id: 'videos', label: 'Videos', to: paths.content.media }],
  },
  {
    id: 'qa',
    label: 'Course Q&A',
    icon: 'qa' as const,
    children: [{ id: 'questions', label: 'Student questions', to: paths.content.qa }],
  },
  {
    id: 'analytics',
    label: 'Course Analytics',
    icon: 'analytics' as const,
    children: [{ id: 'completion', label: 'Completion', to: paths.content.analytics }],
  },
  {
    id: 'history',
    label: 'Activity & Version History',
    icon: 'history' as const,
    children: [{ id: 'publishing', label: 'Publishing History', to: paths.content.history }],
  },
] as const

export type ContentDashboardRangeId = '7d' | '30d' | '90d' | 'all'

export const contentAdminDashboardRanges: Array<{
  id: ContentDashboardRangeId
  label: string
  days: number | null
}> = [
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '90d', label: 'Last 90 days', days: 90 },
  { id: 'all', label: 'All time', days: null },
]

export const contentAdminDashboardPage = {
  title: 'Content Dashboard',
  badge: 'Sample data',
  subtitle: 'Create, manage and publish learning content across MaqSkillz.',
  rangeLabel: 'Date range',
  viewAll: 'View All Courses',
  createCourse: 'Create New Course',
  recentCourses: 'Recent Courses',
  searchCourses: 'Search courses…',
  allCategories: 'All categories',
  allStatuses: 'All statuses',
  columns: {
    course: 'Course',
    category: 'Category',
    version: 'Version',
    modules: 'Modules',
    submodules: 'Submodules',
    status: 'Status',
    updated: 'Last Updated',
    actions: 'Actions',
  },
  actions: {
    edit: 'Edit course',
    view: 'View course',
    versions: 'Version history',
    archive: 'Archive course',
    restore: 'Restore course',
  },
  status: {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  },
  metrics: {
    total: 'Total Courses',
    published: 'Published Courses',
    draft: 'Draft Courses',
    updates: 'Recent Course Updates',
    totalDetail: (count: number) =>
      count === 1 ? '1 course in this period' : `${count} courses in this period`,
    publishedDetail: 'Live and available to learners',
    draftDetail: 'In preparation',
    updatesDetail: 'Published or revised this period',
  },
  archiveNotice: 'moved to Archived.',
  restoreNotice: 'restored as a draft.',
  emptyCourses: 'No courses match this view.',
  activityTitle: 'Recent Content Activity',
  activitySubtitle: 'Across all courses',
  viewLog: 'View log',
  attentionTitle: 'Content Requiring Attention',
  issues: 'issues',
  quickTitle: 'Quick Actions',
  quickSubtitle: 'Common content workflows',
} as const

/** Reference "today" aligned with sample content dates. */
export const contentAdminReferenceDate = new Date('2026-11-10T12:00:00')

export function parseContentUpdatedAt(value: string) {
  return new Date(value.replace(' · ', ' ')).getTime() || 0
}

export function isWithinDashboardRange(updated: string, rangeId: ContentDashboardRangeId) {
  const range = contentAdminDashboardRanges.find((item) => item.id === rangeId)
  if (!range || range.days == null) return true
  const updatedAt = parseContentUpdatedAt(updated)
  if (!updatedAt) return false
  const start = contentAdminReferenceDate.getTime() - range.days * 24 * 60 * 60 * 1000
  return updatedAt >= start && updatedAt <= contentAdminReferenceDate.getTime() + 24 * 60 * 60 * 1000
}

export const contentAdminMetrics = [
  {
    id: 'total',
    label: 'Total Courses',
    value: '128',
    detail: 'Managed across 14 categories',
    tone: 'blue' as const,
  },
  {
    id: 'published',
    label: 'Published Courses',
    value: '96',
    detail: 'Live and available to learners',
    trend: '+4',
    tone: 'green' as const,
  },
  {
    id: 'draft',
    label: 'Draft Courses',
    value: '24',
    detail: 'In preparation · 6 edited this week',
    tone: 'amber' as const,
  },
  {
    id: 'updates',
    label: 'Recent Course Updates',
    value: '18',
    detail: 'Published or revised this period',
    trend: '+7',
    tone: 'purple' as const,
  },
]

export type ContentCourseStatus = 'published' | 'draft' | 'archived'

export const contentAdminCourses = [
  {
    id: 'qms-101',
    title: 'ISO 9001: Quality Management Systems',
    code: 'QMS-101',
    category: 'Quality & Compliance',
    version: 'v2.0',
    modules: 3,
    submodules: 9,
    status: 'published' as ContentCourseStatus,
    updated: '08 Nov 2026 · 10:24',
    accent: 'from-[#004EA8] to-[#3B82F6]',
  },
  {
    id: 'hse-204',
    title: 'Workplace Safety Essentials',
    code: 'HSE-204',
    category: 'Health & Safety',
    version: 'v1.3',
    modules: 4,
    submodules: 12,
    status: 'draft' as ContentCourseStatus,
    updated: '08 Nov 2026 · 09:05',
    accent: 'from-[#0F766E] to-[#34D399]',
  },
  {
    id: 'hse-110',
    title: 'Fire Safety Awareness',
    code: 'HSE-110',
    category: 'Health & Safety',
    version: 'v3.1',
    modules: 3,
    submodules: 8,
    status: 'published' as ContentCourseStatus,
    updated: '07 Nov 2026 · 14:15',
    accent: 'from-[#B45309] to-[#FBBF24]',
  },
  {
    id: 'bus-301',
    title: 'Project Management Fundamentals',
    code: 'BUS-301',
    category: 'Business Skills',
    version: 'v1.0',
    modules: 5,
    submodules: 15,
    status: 'draft' as ContentCourseStatus,
    updated: '06 Nov 2026 · 11:30',
    accent: 'from-[#7C3AED] to-[#A78BFA]',
  },
  {
    id: 'ism-220',
    title: 'ISO 27001: Information Security',
    code: 'ISM-220',
    category: 'Information Security',
    version: 'v2.4',
    modules: 6,
    submodules: 18,
    status: 'published' as ContentCourseStatus,
    updated: '05 Nov 2026 · 16:42',
    accent: 'from-[#102A4C] to-[#3B6BA5]',
  },
  {
    id: 'cmp-118',
    title: 'Data Privacy & GDPR Basics',
    code: 'CMP-118',
    category: 'Compliance',
    version: 'v1.2',
    modules: 3,
    submodules: 9,
    status: 'archived' as ContentCourseStatus,
    updated: '12 Sep 2026 · 08:10',
    accent: 'from-[#BE123C] to-[#FB7185]',
  },
]

export const contentAdminActivity = [
  {
    id: 'a1',
    title: 'ISO 9001 Training',
    detail: 'Version 2.0 published',
    time: '10:24 AM',
    daysAgo: 0,
    tone: 'green' as const,
  },
  {
    id: 'a2',
    title: 'Workplace Safety Essentials',
    detail: 'Module 2.3 updated in draft',
    time: '09:05 AM',
    daysAgo: 0,
    tone: 'blue' as const,
  },
  {
    id: 'a3',
    title: 'ISO 27001 Awareness',
    detail: 'Module 1 Quiz edited',
    time: 'Yesterday',
    daysAgo: 1,
    tone: 'blue' as const,
  },
  {
    id: 'a4',
    title: 'Fire Safety Awareness',
    detail: 'Captions uploaded for Lesson 04',
    time: 'Yesterday',
    daysAgo: 1,
    tone: 'purple' as const,
  },
  {
    id: 'a5',
    title: 'GDPR Basics',
    detail: 'SCORM validation failed',
    time: '2 days ago',
    daysAgo: 2,
    tone: 'red' as const,
  },
  {
    id: 'a6',
    title: 'Project Management Fundamentals',
    detail: 'Outline draft saved',
    time: '12 days ago',
    daysAgo: 12,
    tone: 'blue' as const,
  },
  {
    id: 'a7',
    title: 'Data Privacy & GDPR Basics',
    detail: 'Archived from catalogue',
    time: '45 days ago',
    daysAgo: 45,
    tone: 'red' as const,
  },
]

export const contentAdminAttention = [
  {
    id: 'i1',
    title: 'SCORM validation failed',
    detail: 'GDPR Basics · package upload',
    action: 'Validate',
    to: paths.content.scormValidation,
    tone: 'red' as const,
  },
  {
    id: 'i2',
    title: 'Draft missing mandatory content',
    detail: 'Workplace Safety · Module 3',
    action: 'Open builder',
    to: paths.content.courseBuilder,
    tone: 'amber' as const,
  },
  {
    id: 'i3',
    title: 'Submodule missing primary video',
    detail: 'Project Management · 1.2',
    action: 'Add media',
    to: paths.content.media,
    tone: 'amber' as const,
  },
  {
    id: 'i4',
    title: 'Certificate template outdated',
    detail: 'ISO 9001 CPD certificate',
    action: 'Update',
    to: paths.content.certificates,
    tone: 'blue' as const,
  },
  {
    id: 'i5',
    title: 'Quiz below pass threshold',
    detail: 'Fire Safety · Module Quiz',
    action: 'Review',
    to: paths.content.quizzes,
    tone: 'red' as const,
  },
]

export const contentAdminQuickActions = [
  {
    id: 'create',
    title: 'Create New Course',
    detail: 'Start the 4-step course builder',
    to: paths.content.createCourse,
  },
  {
    id: 'scorm',
    title: 'Upload / Generate SCORM',
    detail: 'Package and validate SCORM content',
    to: paths.content.scorm,
  },
  {
    id: 'quiz',
    title: 'Create Quiz',
    detail: 'Build a reusable quiz from the question bank',
    to: paths.content.quizzes,
  },
  {
    id: 'cpd',
    title: 'Configure CPD Requirements',
    detail: 'Hours, accreditation and certificates',
    to: paths.content.cpd,
  },
]

/* ----------------------------- Notifications ----------------------------- */

export type ContentNotificationTone = 'publish' | 'draft' | 'media' | 'scorm' | 'qa' | 'system'

export type ContentNotification = {
  id: string
  title: string
  detail: string
  time: string
  unread: boolean
  tone: ContentNotificationTone
  to: string
}

export const contentNotificationsPage = {
  title: 'Notifications',
  subtitle: 'Publishing, validation and learner feedback for content ops.',
  markAll: 'Mark all as read',
  markedToast: 'All notifications marked as read.',
  empty: 'You’re all caught up. No notifications in this view.',
  filters: {
    all: 'All',
    unread: 'Unread',
  },
  unreadBadge: 'Unread',
} as const

export const contentNotifications: ContentNotification[] = [
  {
    id: 'n1',
    title: 'ISO 9001 v2.0 published',
    detail: 'Learners can enrol in the updated Quality Management course.',
    time: '10:24 AM',
    unread: true,
    tone: 'publish',
    to: paths.content.courses,
  },
  {
    id: 'n2',
    title: 'SCORM validation failed',
    detail: 'GDPR Basics package needs fixes before publishing.',
    time: '2 hours ago',
    unread: true,
    tone: 'scorm',
    to: paths.content.scormValidation,
  },
  {
    id: 'n3',
    title: 'New student question',
    detail: 'Aarav Sharma asked about ISO 9001 clause 5.2.',
    time: '3 hours ago',
    unread: true,
    tone: 'qa',
    to: paths.content.qa,
  },
  {
    id: 'n4',
    title: 'Draft auto-saved',
    detail: 'Workplace Safety Essentials · Module 2.3',
    time: 'Yesterday',
    unread: false,
    tone: 'draft',
    to: paths.content.drafts,
  },
  {
    id: 'n5',
    title: 'Captions ready',
    detail: 'Fire Safety Lesson 04 captions finished processing.',
    time: 'Yesterday',
    unread: false,
    tone: 'media',
    to: paths.content.media,
  },
  {
    id: 'n6',
    title: 'Certificate template reminder',
    detail: 'ISO 9001 CPD certificate template is outdated.',
    time: '2 days ago',
    unread: true,
    tone: 'system',
    to: paths.content.certificates,
  },
]

export function contentUnreadNotificationCount(items: ContentNotification[] = contentNotifications) {
  return items.filter((item) => item.unread).length
}
