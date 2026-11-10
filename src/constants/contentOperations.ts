export type ContentMediaStatus = 'ready' | 'processing' | 'failed'

export type ContentMediaVideo = {
  id: string
  title: string
  duration: string
  durationSeconds: number
  size: string
  status: ContentMediaStatus
  captions: boolean
  uploaded: string
  uploadedBy: string
  usedIn: string[]
  accent: string
  /** Local blob URL for uploaded videos so the library can preview them. */
  previewUrl?: string
}

export const contentMediaPage = {
  title: 'Media Library',
  subtitle: 'Videos uploaded for course lessons. Track where each asset is used.',
  badge: 'Videos',
  upload: 'Upload video',
  searchPlaceholder: 'Search videos or courses…',
  allStatuses: 'All statuses',
  allCourses: 'All courses',
  sortLabel: 'Sort',
  sortOptions: [
    { id: 'recent', label: 'Recently added' },
    { id: 'title', label: 'Title A–Z' },
    { id: 'duration', label: 'Longest first' },
  ],
  status: { ready: 'Ready', processing: 'Processing', failed: 'Failed' },
  view: { grid: 'Grid', list: 'List' },
  columns: {
    video: 'Video',
    duration: 'Duration',
    usedIn: 'Used in courses',
    status: 'Status',
    uploaded: 'Uploaded',
    actions: 'Actions',
  },
  unused: 'Not used in any course',
  captionsOn: 'Captions',
  captionsOff: 'No captions',
  emptyTitle: 'No videos found',
  emptyBody: 'Try a different search or filter, or upload a new video to the library.',
  clearFilters: 'Clear filters',
  uploadNotice: 'uploaded and ready to preview.',
  editNotice: 'details updated.',
  deleteNotice: 'removed from the library.',
  edit: 'Edit video',
  saveEdit: 'Save changes',
  cancelEdit: 'Cancel',
  editTitle: 'Video title',
  editCaptions: 'Captions available',
  previewLabel: 'Preview',
  showing: 'Showing',
  of: 'of',
  videos: 'videos',
  stats: {
    total: 'Total videos',
    storage: 'Storage used',
    processing: 'Processing',
    noCaptions: 'Missing captions',
  },
} as const

export const contentMediaVideos: ContentMediaVideo[] = [
  {
    id: 'v1',
    title: 'ISO 9001 · Introduction to QMS',
    duration: '12:40',
    durationSeconds: 760,
    size: '182 MB',
    status: 'ready',
    captions: true,
    uploaded: '08 Nov 2026',
    uploadedBy: 'Content Admin',
    usedIn: ['ISO 9001: Quality Management Systems'],
    accent: 'from-[#004EA8] to-[#3B82F6]',
  },
  {
    id: 'v2',
    title: 'Workplace hazards walkthrough',
    duration: '08:15',
    durationSeconds: 495,
    size: '121 MB',
    status: 'ready',
    captions: true,
    uploaded: '07 Nov 2026',
    uploadedBy: 'Priya Nair',
    usedIn: ['Workplace Safety Essentials', 'Fire Safety Awareness'],
    accent: 'from-[#0F766E] to-[#34D399]',
  },
  {
    id: 'v3',
    title: 'Fire extinguisher types (Lesson 04)',
    duration: '06:02',
    durationSeconds: 362,
    size: '88 MB',
    status: 'ready',
    captions: true,
    uploaded: '07 Nov 2026',
    uploadedBy: 'Content Admin',
    usedIn: ['Fire Safety Awareness'],
    accent: 'from-[#B45309] to-[#FBBF24]',
  },
  {
    id: 'v4',
    title: 'Project charter masterclass',
    duration: '21:30',
    durationSeconds: 1290,
    size: '342 MB',
    status: 'processing',
    captions: false,
    uploaded: '06 Nov 2026',
    uploadedBy: 'Rahul Menon',
    usedIn: ['Project Management Fundamentals'],
    accent: 'from-[#7C3AED] to-[#A78BFA]',
  },
  {
    id: 'v5',
    title: 'Information security principles',
    duration: '15:48',
    durationSeconds: 948,
    size: '236 MB',
    status: 'ready',
    captions: false,
    uploaded: '05 Nov 2026',
    uploadedBy: 'Content Admin',
    usedIn: ['ISO 27001: Information Security'],
    accent: 'from-[#102A4C] to-[#3B6BA5]',
  },
  {
    id: 'v6',
    title: 'GDPR data subject rights',
    duration: '09:12',
    durationSeconds: 552,
    size: '134 MB',
    status: 'failed',
    captions: false,
    uploaded: '03 Nov 2026',
    uploadedBy: 'Priya Nair',
    usedIn: ['Data Privacy & GDPR Basics'],
    accent: 'from-[#BE123C] to-[#FB7185]',
  },
  {
    id: 'v7',
    title: 'Welcome & course orientation',
    duration: '03:20',
    durationSeconds: 200,
    size: '46 MB',
    status: 'ready',
    captions: true,
    uploaded: '28 Oct 2026',
    uploadedBy: 'Content Admin',
    usedIn: [],
    accent: 'from-[#0369A1] to-[#38BDF8]',
  },
]

/* ----------------------------- Course Q&A ----------------------------- */

export type ContentQaStatus = 'open' | 'answered'

export type ContentQaQuestion = {
  id: string
  student: string
  initials: string
  course: string
  lesson: string
  question: string
  asked: string
  status: ContentQaStatus
  replies: number
  answer?: string
  answeredBy?: string
}

export const contentQaPage = {
  title: 'Course Q&A',
  subtitle: 'Student questions raised on lessons. Reply to keep learners moving.',
  searchPlaceholder: 'Search questions, students or courses…',
  allCourses: 'All courses',
  tabs: { all: 'All', open: 'Open', answered: 'Answered' },
  status: { open: 'Open', answered: 'Answered' },
  reply: 'Reply',
  editReply: 'Edit reply',
  viewLesson: 'View lesson',
  markAnswered: 'Mark as answered',
  replyPlaceholder: 'Write a helpful answer for the student…',
  send: 'Send reply',
  cancel: 'Cancel',
  replyNotice: 'Reply sent to',
  markedNotice: 'marked as answered.',
  emptyTitle: 'No questions here',
  emptyBody: 'You’re all caught up. New student questions will appear in this list.',
  clearFilters: 'Clear filters',
  replyRequired: 'Write a reply before sending.',
  inLesson: 'in',
} as const

export const contentQaQuestions: ContentQaQuestion[] = [
  {
    id: 'q1',
    student: 'Aarav Sharma',
    initials: 'AS',
    course: 'ISO 9001: Quality Management Systems',
    lesson: 'Module 1 · Context of the organization',
    question:
      'Does an SME with fewer than 20 staff still need a documented quality policy to meet clause 5.2?',
    asked: '2 hours ago',
    status: 'open',
    replies: 0,
  },
  {
    id: 'q2',
    student: 'Meera Iyer',
    initials: 'MI',
    course: 'Workplace Safety Essentials',
    lesson: 'Module 2 · Hazard identification',
    question: 'Is there a downloadable checklist for the monthly workplace inspection shown in the video?',
    asked: '5 hours ago',
    status: 'open',
    replies: 0,
  },
  {
    id: 'q3',
    student: 'Daniel Fernandes',
    initials: 'DF',
    course: 'Fire Safety Awareness',
    lesson: 'Lesson 04 · Extinguisher types',
    question: 'Which extinguisher should be used on an electrical fire in a server room?',
    asked: 'Yesterday',
    status: 'answered',
    replies: 1,
    answer:
      'Use a CO₂ extinguisher for electrical fires in server rooms. Never use water or foam on live equipment.',
    answeredBy: 'Priya Nair',
  },
  {
    id: 'q4',
    student: 'Sana Khan',
    initials: 'SK',
    course: 'ISO 27001: Information Security',
    lesson: 'Module 3 · Risk assessment',
    question: 'Can we get a worked example of a risk treatment plan for a small company?',
    asked: 'Yesterday',
    status: 'open',
    replies: 0,
  },
  {
    id: 'q5',
    student: 'Vikram Rao',
    initials: 'VR',
    course: 'Project Management Fundamentals',
    lesson: 'Module 1 · Project charter',
    question: 'What is the difference between a project charter and a project brief?',
    asked: '3 days ago',
    status: 'answered',
    replies: 2,
    answer:
      'A brief summarises the idea before approval; the charter is the formal document that authorises the project and the project manager.',
    answeredBy: 'Rahul Menon',
  },
]

/* --------------------------- Course analytics --------------------------- */

export type ContentAnalyticsRangeId = '30d' | '3m' | '6m' | '12m'

export const contentAnalyticsRanges = [
  { id: '30d' as const, label: 'Last 30 days' },
  { id: '3m' as const, label: 'Last 3 months' },
  { id: '6m' as const, label: 'Last 6 months' },
  { id: '12m' as const, label: 'Last 12 months' },
]

export const contentAnalyticsPage = {
  title: 'Course Analytics',
  subtitle: 'Completion performance across published courses.',
  badge: 'Completion',
  range: 'Last 6 months',
  rangeLabel: 'Date range',
  chartTitle: 'Completion rate over time',
  chartSubtitle: 'Average completion across all published courses',
  tableTitle: 'Completion by course',
  tableSubtitle: 'Sorted by completion rate',
  searchPlaceholder: 'Search courses…',
  columns: {
    course: 'Course',
    enrolled: 'Enrolled',
    completed: 'Completed',
    rate: 'Completion',
    avgTime: 'Avg. time',
    dropOff: 'Top drop-off',
  },
  emptyTitle: 'No courses match',
  emptyBody: 'Try a different search term.',
  export: 'Export CSV',
  exportNotice: 'Analytics export prepared (sample).',
} as const

export type ContentAnalyticsKpi = {
  id: string
  label: string
  value: string
  trend: string
  detail: string
  tone: 'blue' | 'green' | 'purple' | 'amber'
}

export type ContentCompletionTrendPoint = { month: string; rate: number }

export type ContentCourseCompletionRow = {
  id: string
  title: string
  code: string
  enrolled: number
  completed: number
  avgTime: string
  dropOff: string
  accent: string
}

const analyticsKpisByRange: Record<ContentAnalyticsRangeId, ContentAnalyticsKpi[]> = {
  '30d': [
    { id: 'enrolled', label: 'Total enrolments', value: '1,840', trend: '+4.1%', detail: 'vs previous period', tone: 'blue' },
    { id: 'completion', label: 'Avg. completion rate', value: '71.2%', trend: '+1.4%', detail: 'across published courses', tone: 'green' },
    { id: 'time', label: 'Avg. time to complete', value: '5h 18m', trend: '-8m', detail: 'faster than last period', tone: 'purple' },
    { id: 'dropoff', label: 'At-risk courses', value: '4', trend: '', detail: 'completion below 60%', tone: 'amber' },
  ],
  '3m': [
    { id: 'enrolled', label: 'Total enrolments', value: '5,960', trend: '+6.4%', detail: 'vs previous period', tone: 'blue' },
    { id: 'completion', label: 'Avg. completion rate', value: '73.0%', trend: '+2.2%', detail: 'across published courses', tone: 'green' },
    { id: 'time', label: 'Avg. time to complete', value: '5h 30m', trend: '-10m', detail: 'faster than last period', tone: 'purple' },
    { id: 'dropoff', label: 'At-risk courses', value: '3', trend: '', detail: 'completion below 60%', tone: 'amber' },
  ],
  '6m': [
    { id: 'enrolled', label: 'Total enrolments', value: '12,480', trend: '+8.2%', detail: 'vs previous period', tone: 'blue' },
    { id: 'completion', label: 'Avg. completion rate', value: '74.6%', trend: '+3.1%', detail: 'across published courses', tone: 'green' },
    { id: 'time', label: 'Avg. time to complete', value: '5h 42m', trend: '-12m', detail: 'faster than last period', tone: 'purple' },
    { id: 'dropoff', label: 'At-risk courses', value: '3', trend: '', detail: 'completion below 60%', tone: 'amber' },
  ],
  '12m': [
    { id: 'enrolled', label: 'Total enrolments', value: '24,910', trend: '+11.5%', detail: 'vs previous period', tone: 'blue' },
    { id: 'completion', label: 'Avg. completion rate', value: '72.8%', trend: '+2.0%', detail: 'across published courses', tone: 'green' },
    { id: 'time', label: 'Avg. time to complete', value: '5h 55m', trend: '-6m', detail: 'faster than last period', tone: 'purple' },
    { id: 'dropoff', label: 'At-risk courses', value: '2', trend: '', detail: 'completion below 60%', tone: 'amber' },
  ],
}

const analyticsTrendByRange: Record<ContentAnalyticsRangeId, ContentCompletionTrendPoint[]> = {
  '30d': [
    { month: 'W1', rate: 69 },
    { month: 'W2', rate: 70 },
    { month: 'W3', rate: 72 },
    { month: 'W4', rate: 71 },
  ],
  '3m': [
    { month: 'Sep', rate: 71 },
    { month: 'Oct', rate: 73 },
    { month: 'Nov', rate: 75 },
  ],
  '6m': [
    { month: 'Jun', rate: 66 },
    { month: 'Jul', rate: 68 },
    { month: 'Aug', rate: 65 },
    { month: 'Sep', rate: 71 },
    { month: 'Oct', rate: 73 },
    { month: 'Nov', rate: 75 },
  ],
  '12m': [
    { month: 'Dec', rate: 62 },
    { month: 'Jan', rate: 64 },
    { month: 'Feb', rate: 63 },
    { month: 'Mar', rate: 66 },
    { month: 'Apr', rate: 67 },
    { month: 'May', rate: 69 },
    { month: 'Jun', rate: 66 },
    { month: 'Jul', rate: 68 },
    { month: 'Aug', rate: 65 },
    { month: 'Sep', rate: 71 },
    { month: 'Oct', rate: 73 },
    { month: 'Nov', rate: 75 },
  ],
}

const courseCompletionBase: ContentCourseCompletionRow[] = [
  { id: 'qms-101', title: 'ISO 9001: Quality Management Systems', code: 'QMS-101', enrolled: 3240, completed: 2784, avgTime: '6h 10m', dropOff: 'Module 2 quiz', accent: 'from-[#004EA8] to-[#3B82F6]' },
  { id: 'hse-110', title: 'Fire Safety Awareness', code: 'HSE-110', enrolled: 2860, completed: 2515, avgTime: '2h 25m', dropOff: 'Lesson 04', accent: 'from-[#B45309] to-[#FBBF24]' },
  { id: 'ism-220', title: 'ISO 27001: Information Security', code: 'ISM-220', enrolled: 2410, completed: 1806, avgTime: '8h 05m', dropOff: 'Module 3 risk', accent: 'from-[#102A4C] to-[#3B6BA5]' },
  { id: 'hse-204', title: 'Workplace Safety Essentials', code: 'HSE-204', enrolled: 1980, completed: 1327, avgTime: '4h 40m', dropOff: 'Module 3', accent: 'from-[#0F766E] to-[#34D399]' },
  { id: 'bus-301', title: 'Project Management Fundamentals', code: 'BUS-301', enrolled: 1120, completed: 616, avgTime: '9h 15m', dropOff: 'Module 4 project', accent: 'from-[#7C3AED] to-[#A78BFA]' },
  { id: 'cmp-118', title: 'Data Privacy & GDPR Basics', code: 'CMP-118', enrolled: 870, completed: 435, avgTime: '3h 30m', dropOff: 'Final assessment', accent: 'from-[#BE123C] to-[#FB7185]' },
]

const courseScaleByRange: Record<ContentAnalyticsRangeId, number> = {
  '30d': 0.15,
  '3m': 0.48,
  '6m': 1,
  '12m': 1.95,
}

export const contentAnalyticsKpis = analyticsKpisByRange['6m']
export const contentCompletionTrend = analyticsTrendByRange['6m']
export const contentCourseCompletion = courseCompletionBase

export function getAnalyticsKpis(rangeId: ContentAnalyticsRangeId) {
  return analyticsKpisByRange[rangeId]
}

export function getAnalyticsTrend(rangeId: ContentAnalyticsRangeId) {
  return analyticsTrendByRange[rangeId]
}

export function getAnalyticsCourses(rangeId: ContentAnalyticsRangeId) {
  const scale = courseScaleByRange[rangeId]
  return courseCompletionBase.map((course) => ({
    ...course,
    enrolled: Math.max(1, Math.round(course.enrolled * scale)),
    completed: Math.max(0, Math.round(course.completed * scale)),
  }))
}

/* --------------------------- Publishing history -------------------------- */

export type ContentPublishAction = 'published' | 'unpublished' | 'rolled-back' | 'scheduled' | 'failed'

export type ContentPublishEvent = {
  id: string
  course: string
  code: string
  version: string
  action: ContentPublishAction
  by: string
  at: string
  note: string
}

export const contentHistoryPage = {
  title: 'Publishing History',
  subtitle: 'Audit trail of every publish, rollback and unpublish across courses.',
  searchPlaceholder: 'Search course, version or person…',
  allActions: 'All actions',
  allUsers: 'All publishers',
  view: { timeline: 'Timeline', table: 'Table' },
  action: {
    published: 'Published',
    unpublished: 'Unpublished',
    'rolled-back': 'Rolled back',
    scheduled: 'Scheduled',
    failed: 'Failed',
  },
  columns: {
    course: 'Course',
    version: 'Version',
    action: 'Action',
    by: 'Published by',
    at: 'Timestamp',
    note: 'Note',
  },
  emptyTitle: 'No publish events',
  emptyBody: 'No events match these filters. Try clearing them to see the full history.',
  clearFilters: 'Clear filters',
  export: 'Export log',
  exportNotice: 'Publishing log export prepared (sample).',
  stats: { total: 'Events', published: 'Published', rollbacks: 'Rollbacks', failed: 'Failed' },
} as const

export const contentPublishEvents: ContentPublishEvent[] = [
  { id: 'h1', course: 'ISO 9001: Quality Management Systems', code: 'QMS-101', version: 'v2.0', action: 'published', by: 'Content Admin', at: '08 Nov 2026 · 10:24', note: 'Added revised clause 6 modules and updated quiz.' },
  { id: 'h2', course: 'Fire Safety Awareness', code: 'HSE-110', version: 'v3.1', action: 'published', by: 'Priya Nair', at: '07 Nov 2026 · 14:15', note: 'Captions added for lesson 04.' },
  { id: 'h3', course: 'Data Privacy & GDPR Basics', code: 'CMP-118', version: 'v1.2', action: 'failed', by: 'Priya Nair', at: '06 Nov 2026 · 17:40', note: 'SCORM validation failed — manifest missing.' },
  { id: 'h4', course: 'ISO 27001: Information Security', code: 'ISM-220', version: 'v2.4', action: 'published', by: 'Rahul Menon', at: '05 Nov 2026 · 16:42', note: 'Risk assessment module refreshed.' },
  { id: 'h5', course: 'Workplace Safety Essentials', code: 'HSE-204', version: 'v1.3', action: 'scheduled', by: 'Content Admin', at: '04 Nov 2026 · 09:30', note: 'Scheduled for 12 Nov 2026 · 08:00.' },
  { id: 'h6', course: 'ISO 9001: Quality Management Systems', code: 'QMS-101', version: 'v1.9', action: 'rolled-back', by: 'Content Admin', at: '29 Oct 2026 · 11:05', note: 'Rolled back from v2.0-rc to v1.9 after QA feedback.' },
  { id: 'h7', course: 'Data Privacy & GDPR Basics', code: 'CMP-118', version: 'v1.1', action: 'unpublished', by: 'Rahul Menon', at: '12 Sep 2026 · 08:10', note: 'Archived — replaced by new regulation course.' },
  { id: 'h8', course: 'Fire Safety Awareness', code: 'HSE-110', version: 'v3.0', action: 'published', by: 'Priya Nair', at: '21 Aug 2026 · 13:00', note: 'New evacuation procedures.' },
]

/* --------------------------- Profile & settings -------------------------- */

export const contentProfilePage = {
  title: 'Profile & Settings',
  subtitle: 'Manage your account details, notifications and security.',
  tabs: [
    { id: 'personal', label: 'Personal info' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ],
  personal: {
    title: 'Personal information',
    description: 'Shown to other staff and on publishing records.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Work email',
    phone: 'Phone',
    role: 'Role',
    timezone: 'Time zone',
    bio: 'Bio',
    bioHint: 'A short note for teammates.',
    save: 'Save changes',
    reset: 'Reset',
    saved: 'Profile updated.',
    required: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
  },
  notifications: {
    title: 'Notification preferences',
    description: 'Choose what you want to be notified about.',
    save: 'Save preferences',
    saved: 'Notification preferences saved.',
    items: [
      { id: 'publish', label: 'Publish results', description: 'Success or failure when a course is published.' },
      { id: 'qa', label: 'New student questions', description: 'When a learner asks a question on your courses.' },
      { id: 'scorm', label: 'SCORM validation', description: 'Alerts when package validation fails.' },
      { id: 'digest', label: 'Weekly analytics digest', description: 'Summary of completion and drop-off each Monday.' },
      { id: 'product', label: 'Product updates', description: 'New features and release notes.' },
    ],
  },
  security: {
    title: 'Security',
    description: 'Keep your account protected.',
    passwordTitle: 'Change password',
    current: 'Current password',
    next: 'New password',
    confirm: 'Confirm new password',
    update: 'Update password',
    hint: 'At least 8 characters, with a number.',
    saved: 'Password updated.',
    errors: {
      current: 'Enter your current password.',
      short: 'Password must be at least 8 characters.',
      number: 'Include at least one number.',
      mismatch: 'Passwords do not match.',
    },
    twoFactor: 'Two-factor authentication',
    twoFactorDescription: 'Require a verification code when signing in.',
    sessionsTitle: 'Active sessions',
    signOut: 'Sign out',
    signedOutNotice: 'Session signed out.',
  },
  profile: {
    name: 'Content Admin',
    email: 'content.admin@maqskillz.com',
    role: 'Content Administrator',
    org: 'MaqSkillz Staff',
    initials: 'CA',
    joined: 'Member since Jan 2025',
    stats: [
      { label: 'Courses managed', value: '128' },
      { label: 'Published', value: '96' },
      { label: 'Videos', value: '312' },
    ],
  },
} as const

export const contentProfileDefaults = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  timezone: '',
  bio: '',
}

export const contentProfileTimezones = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Europe/London',
  'America/New_York',
  'Australia/Sydney',
]

export const contentProfileSessions = [
  { id: 's1', device: 'Chrome on Windows', location: 'Hyderabad, IN', time: 'Active now', current: true },
  { id: 's2', device: 'Safari on iPhone', location: 'Hyderabad, IN', time: '2 days ago', current: false },
  { id: 's3', device: 'Edge on Windows', location: 'Bengaluru, IN', time: '6 days ago', current: false },
]

/* ---------------------------- Help & Support ----------------------------- */

export const contentHelpPage = {
  title: 'Help & Support',
  subtitle: 'Guides, contact options and reference examples of feedback states used in Content Admin.',
  searchPlaceholder: 'Search help articles…',
  faqTitle: 'Frequently asked questions',
  contactTitle: 'Contact support',
  contactDescription: 'Our team replies within one business day.',
  subject: 'Subject',
  message: 'Message',
  send: 'Send message',
  sent: 'Message sent. Support will reply by email.',
  subjectRequired: 'Add a subject.',
  messageRequired: 'Describe how we can help.',
  statesTitle: 'States & feedback',
  statesSubtitle: 'Toasts, empty states and errors used across Content Admin.',
  toasts: {
    success: 'Success toast',
    error: 'Error toast',
    info: 'Info toast',
    successText: 'Course published successfully.',
    errorText: 'Upload failed. Check the file and try again.',
    infoText: 'Autosave is on — drafts are saved every 30 seconds.',
    dismiss: 'Dismiss',
  },
  empty: {
    title: 'Empty state',
    heading: 'No items yet',
    body: 'Nothing to show here. Create your first item to get started.',
    cta: 'Create item',
  },
  error: {
    title: 'Error state',
    heading: 'Something went wrong',
    body: 'We couldn’t load this content. Check your connection and try again.',
    retry: 'Retry',
    retried: 'Retrying… (sample)',
  },
  validation: {
    title: 'Inline validation',
    label: 'Course title',
    placeholder: 'e.g. ISO 9001 Foundations',
    error: 'Course title is required.',
    hint: 'Use a clear, searchable title.',
    check: 'Validate',
  },
  loading: { title: 'Loading state', body: 'Skeleton placeholders while content loads.' },
} as const

export const contentHelpFaqs = [
  { id: 'f1', q: 'How do I publish a new course version?', a: 'Open the course in the builder, complete all publish checks on the Preview step, then choose Publish. A new version is recorded in Publishing History.' },
  { id: 'f2', q: 'Why did my SCORM validation fail?', a: 'The most common causes are a missing imsmanifest.xml or unsupported SCORM version. Open Validation report for the exact errors.' },
  { id: 'f3', q: 'Can I roll back to a previous version?', a: 'Yes. From Course Versions, pick an earlier version and choose Rollback. The action is logged in Publishing History.' },
  { id: 'f4', q: 'What video formats are supported?', a: 'MP4 (H.264) up to 2 GB. Upload captions as WebVTT to improve accessibility.' },
  { id: 'f5', q: 'Who can reply to student questions?', a: 'Any content admin assigned to the course. Replies are emailed to the student and shown on the lesson page.' },
]
