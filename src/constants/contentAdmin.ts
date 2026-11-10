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
      { id: 'validation', label: 'Validation report', to: paths.content.scormValidation },
    ],
  },
  {
    id: 'assessments',
    label: 'Assessments & Quizzes',
    icon: 'assessments' as const,
    children: [
      { id: 'builder', label: 'Final Assessment builder', to: paths.content.assessments },
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

export const contentAdminDashboardPage = {
  title: 'Content Dashboard',
  badge: 'Sample data',
  subtitle: 'Create, manage and publish learning content across MaqSkillz.',
  range: 'Last 30 days',
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
  status: {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  },
  activityTitle: 'Recent Content Activity',
  activitySubtitle: 'Across all courses',
  viewLog: 'View log',
  attentionTitle: 'Content Requiring Attention',
  issues: '5 issues',
  quickTitle: 'Quick Actions',
  quickSubtitle: 'Common content workflows',
} as const

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
    tone: 'green' as const,
  },
  {
    id: 'a2',
    title: 'Workplace Safety Essentials',
    detail: 'Module 2.3 updated in draft',
    time: '09:05 AM',
    tone: 'blue' as const,
  },
  {
    id: 'a3',
    title: 'ISO 27001 Awareness',
    detail: 'Module 1 Quiz edited',
    time: 'Yesterday',
    tone: 'blue' as const,
  },
  {
    id: 'a4',
    title: 'Fire Safety Awareness',
    detail: 'Captions uploaded for Lesson 04',
    time: 'Yesterday',
    tone: 'purple' as const,
  },
  {
    id: 'a5',
    title: 'GDPR Basics',
    detail: 'SCORM validation failed',
    time: '2 days ago',
    tone: 'red' as const,
  },
]

export const contentAdminAttention = [
  {
    id: 'i1',
    title: 'SCORM validation failed',
    detail: 'GDPR Basics · package upload',
    action: 'Validate',
    tone: 'red' as const,
  },
  {
    id: 'i2',
    title: 'Draft missing mandatory content',
    detail: 'Workplace Safety · Module 3',
    action: 'Open builder',
    tone: 'amber' as const,
  },
  {
    id: 'i3',
    title: 'Submodule missing primary video',
    detail: 'Project Management · 1.2',
    action: 'Add media',
    tone: 'amber' as const,
  },
  {
    id: 'i4',
    title: 'Certificate template outdated',
    detail: 'ISO 9001 CPD certificate',
    action: 'Update',
    tone: 'blue' as const,
  },
  {
    id: 'i5',
    title: 'Quiz below pass threshold',
    detail: 'Fire Safety · Module Quiz',
    action: 'Review',
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
    to: paths.content.dashboard,
  },
  {
    id: 'quiz',
    title: 'Create Module Quiz',
    detail: 'Add a quiz after a module’s submodules',
    to: paths.content.courseQuiz,
  },
  {
    id: 'cpd',
    title: 'Configure CPD Requirements',
    detail: 'Hours, accreditation and certificates',
    to: paths.content.dashboard,
  },
]
