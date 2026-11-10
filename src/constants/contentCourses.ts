import { contentAdminCourses, type ContentCourseStatus } from './contentAdmin'

export const contentAllCoursesPage = {
  title: 'All Courses',
  subtitle: 'Browse, search and manage every course in the MaqSkillz catalogue.',
  createCourse: 'Create New Course',
  searchPlaceholder: 'Search by title, code or category…',
  allCategories: 'All categories',
  allStatuses: 'All statuses',
  sortLabel: 'Sort by',
  sortOptions: [
    { id: 'updated', label: 'Last updated' },
    { id: 'title', label: 'Title (A–Z)' },
    { id: 'modules', label: 'Most modules' },
  ],
  tabs: {
    all: 'All',
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  },
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
  actions: {
    edit: 'Edit course',
    view: 'View course',
    versions: 'Version history',
    archive: 'Archive course',
    restore: 'Restore course',
  },
  emptyTitle: 'No courses match this view',
  emptyBody: 'Try a different search term or clear the filters to see every course.',
  clearFilters: 'Clear filters',
  showing: 'Showing',
  of: 'of',
  courses: 'courses',
  archiveNotice: 'moved to Archived. Learners with active enrolments keep access.',
  restoreNotice: 'restored as a draft.',
} as const

export type ContentCourseListItem = {
  id: string
  title: string
  code: string
  category: string
  version: string
  modules: number
  submodules: number
  status: ContentCourseStatus
  updated: string
  accent: string
}

const extraCourses: ContentCourseListItem[] = [
  {
    id: 'env-140',
    title: 'ISO 14001: Environmental Management',
    code: 'ENV-140',
    category: 'Quality & Compliance',
    version: 'v1.1',
    modules: 4,
    submodules: 11,
    status: 'published',
    updated: '04 Nov 2026 · 13:20',
    accent: 'from-[#15803D] to-[#4ADE80]',
  },
  {
    id: 'hse-150',
    title: 'First Aid at Work',
    code: 'HSE-150',
    category: 'Health & Safety',
    version: 'v2.2',
    modules: 3,
    submodules: 7,
    status: 'published',
    updated: '03 Nov 2026 · 09:48',
    accent: 'from-[#DC2626] to-[#F87171]',
  },
  {
    id: 'bus-340',
    title: 'Leadership & Team Management',
    code: 'BUS-340',
    category: 'Business Skills',
    version: 'v1.4',
    modules: 5,
    submodules: 14,
    status: 'published',
    updated: '01 Nov 2026 · 17:05',
    accent: 'from-[#4F46E5] to-[#818CF8]',
  },
  {
    id: 'ism-105',
    title: 'Cybersecurity Awareness for Employees',
    code: 'ISM-105',
    category: 'Information Security',
    version: 'v1.0',
    modules: 4,
    submodules: 10,
    status: 'draft',
    updated: '31 Oct 2026 · 12:12',
    accent: 'from-[#0369A1] to-[#38BDF8]',
  },
  {
    id: 'cmp-205',
    title: 'Anti-Money Laundering Essentials',
    code: 'CMP-205',
    category: 'Compliance',
    version: 'v2.0',
    modules: 4,
    submodules: 12,
    status: 'published',
    updated: '24 Oct 2026 · 10:30',
    accent: 'from-[#9333EA] to-[#C084FC]',
  },
  {
    id: 'hse-090',
    title: 'Manual Handling & Ergonomics',
    code: 'HSE-090',
    category: 'Health & Safety',
    version: 'v1.5',
    modules: 2,
    submodules: 6,
    status: 'archived',
    updated: '02 Aug 2026 · 15:55',
    accent: 'from-[#475569] to-[#94A3B8]',
  },
]

export const contentCoursesList: ContentCourseListItem[] = [
  ...contentAdminCourses,
  ...extraCourses,
]

/* ---------------------------------- Versions ---------------------------------- */

export type ContentVersionStatus = 'live' | 'draft' | 'superseded'

export type ContentCourseVersion = {
  id: string
  courseId: string
  courseTitle: string
  code: string
  version: string
  status: ContentVersionStatus
  summary: string
  author: string
  date: string
  modules: number
  submodules: number
}

export const contentVersionsPage = {
  title: 'Course Versions',
  subtitle: 'Review every published revision, restore earlier versions and compare changes.',
  createCourse: 'Create New Course',
  searchPlaceholder: 'Search by course, code or change note…',
  allCourses: 'All courses',
  allStatuses: 'All statuses',
  columns: {
    course: 'Course',
    version: 'Version',
    status: 'Status',
    summary: 'Change summary',
    author: 'Author',
    date: 'Date',
    content: 'Content',
    actions: 'Actions',
  },
  status: {
    live: 'Live',
    draft: 'Draft',
    superseded: 'Superseded',
  },
  actions: {
    view: 'View version',
    compare: 'Compare with live',
    restore: 'Restore as draft',
  },
  emptyTitle: 'No versions found',
  emptyBody: 'No version history matches your filters.',
  clearFilters: 'Clear filters',
  restoreNotice: 'was restored as a new draft.',
  metrics: {
    total: 'Total versions',
    live: 'Live versions',
    pending: 'Draft revisions',
    courses: 'Courses tracked',
  },
} as const

export const contentCourseVersions: ContentCourseVersion[] = [
  {
    id: 'v-qms-20',
    courseId: 'qms-101',
    courseTitle: 'ISO 9001: Quality Management Systems',
    code: 'QMS-101',
    version: 'v2.0',
    status: 'live',
    summary: 'Added Module 3 on risk-based thinking and refreshed the final assessment.',
    author: 'Priya Nair',
    date: '08 Nov 2026 · 10:24',
    modules: 3,
    submodules: 9,
  },
  {
    id: 'v-qms-15',
    courseId: 'qms-101',
    courseTitle: 'ISO 9001: Quality Management Systems',
    code: 'QMS-101',
    version: 'v1.5',
    status: 'superseded',
    summary: 'Updated clause references to match the 2015 amendment.',
    author: 'Priya Nair',
    date: '14 Aug 2026 · 15:10',
    modules: 2,
    submodules: 7,
  },
  {
    id: 'v-qms-10',
    courseId: 'qms-101',
    courseTitle: 'ISO 9001: Quality Management Systems',
    code: 'QMS-101',
    version: 'v1.0',
    status: 'superseded',
    summary: 'Initial release.',
    author: 'Rahul Menon',
    date: '02 Mar 2026 · 11:00',
    modules: 2,
    submodules: 6,
  },
  {
    id: 'v-hse204-13',
    courseId: 'hse-204',
    courseTitle: 'Workplace Safety Essentials',
    code: 'HSE-204',
    version: 'v1.3',
    status: 'draft',
    summary: 'Module 2.3 rewritten; captions pending for Module 3 videos.',
    author: 'Aisha Khan',
    date: '08 Nov 2026 · 09:05',
    modules: 4,
    submodules: 12,
  },
  {
    id: 'v-hse204-12',
    courseId: 'hse-204',
    courseTitle: 'Workplace Safety Essentials',
    code: 'HSE-204',
    version: 'v1.2',
    status: 'live',
    summary: 'Added manual handling lesson and new module quiz.',
    author: 'Aisha Khan',
    date: '19 Sep 2026 · 14:42',
    modules: 4,
    submodules: 11,
  },
  {
    id: 'v-hse204-10',
    courseId: 'hse-204',
    courseTitle: 'Workplace Safety Essentials',
    code: 'HSE-204',
    version: 'v1.0',
    status: 'superseded',
    summary: 'Initial release.',
    author: 'Aisha Khan',
    date: '10 Jun 2026 · 10:15',
    modules: 3,
    submodules: 8,
  },
  {
    id: 'v-hse110-31',
    courseId: 'hse-110',
    courseTitle: 'Fire Safety Awareness',
    code: 'HSE-110',
    version: 'v3.1',
    status: 'live',
    summary: 'Captions uploaded for all lessons; evacuation video replaced.',
    author: 'Daniel Joseph',
    date: '07 Nov 2026 · 14:15',
    modules: 3,
    submodules: 8,
  },
  {
    id: 'v-hse110-30',
    courseId: 'hse-110',
    courseTitle: 'Fire Safety Awareness',
    code: 'HSE-110',
    version: 'v3.0',
    status: 'superseded',
    summary: 'Restructured into three modules aligned to the new CPD template.',
    author: 'Daniel Joseph',
    date: '22 Jul 2026 · 09:30',
    modules: 3,
    submodules: 8,
  },
  {
    id: 'v-ism220-24',
    courseId: 'ism-220',
    courseTitle: 'ISO 27001: Information Security',
    code: 'ISM-220',
    version: 'v2.4',
    status: 'live',
    summary: 'Annex A controls updated for the 2022 revision.',
    author: 'Rahul Menon',
    date: '05 Nov 2026 · 16:42',
    modules: 6,
    submodules: 18,
  },
  {
    id: 'v-ism220-23',
    courseId: 'ism-220',
    courseTitle: 'ISO 27001: Information Security',
    code: 'ISM-220',
    version: 'v2.3',
    status: 'superseded',
    summary: 'Fixed quiz scoring on Module 4.',
    author: 'Rahul Menon',
    date: '30 Sep 2026 · 12:08',
    modules: 6,
    submodules: 18,
  },
  {
    id: 'v-bus301-10',
    courseId: 'bus-301',
    courseTitle: 'Project Management Fundamentals',
    code: 'BUS-301',
    version: 'v1.0',
    status: 'draft',
    summary: 'First draft — Modules 4 and 5 still to be recorded.',
    author: 'Priya Nair',
    date: '06 Nov 2026 · 11:30',
    modules: 5,
    submodules: 15,
  },
  {
    id: 'v-cmp118-12',
    courseId: 'cmp-118',
    courseTitle: 'Data Privacy & GDPR Basics',
    code: 'CMP-118',
    version: 'v1.2',
    status: 'superseded',
    summary: 'Archived after replacement by CMP-205 series.',
    author: 'Daniel Joseph',
    date: '12 Sep 2026 · 08:10',
    modules: 3,
    submodules: 9,
  },
]

/* ----------------------------------- Drafts ----------------------------------- */

export type ContentDraftStep = 'Details' | 'Content' | 'Settings' | 'Preview'

export type ContentDraftCourse = {
  id: string
  title: string
  code: string
  category: string
  step: ContentDraftStep
  progress: number
  modules: number
  submodules: number
  editor: string
  updated: string
  missing: string[]
  accent: string
}

export const contentDraftsPage = {
  title: 'Draft Courses',
  subtitle: 'Pick up where you left off — unpublished courses and in-progress revisions.',
  createCourse: 'Create New Course',
  searchPlaceholder: 'Search drafts by title, code or editor…',
  allCategories: 'All categories',
  progress: 'complete',
  lastEdited: 'Last edited',
  by: 'by',
  stepLabel: 'Currently at',
  missingLabel: 'Needs attention',
  nothingMissing: 'Ready to publish',
  continueEditing: 'Continue editing',
  preview: 'Preview',
  discard: 'Discard',
  discardNotice: 'draft discarded.',
  undo: 'Undo',
  emptySearchTitle: 'No drafts match',
  emptySearchBody:
    'We couldn’t find a draft for that search. Check the spelling, try a course code, or start something new.',
  emptyAllTitle: 'No drafts yet',
  emptyAllBody: 'Every course you create appears here until you publish it.',
  suggestionsLabel: 'Try searching for',
  suggestions: ['ISO', 'Safety', 'HSE-204', 'Priya'],
  clearSearch: 'Clear search',
} as const

export const contentDraftCourses: ContentDraftCourse[] = [
  {
    id: 'hse-204',
    title: 'Workplace Safety Essentials',
    code: 'HSE-204',
    category: 'Health & Safety',
    step: 'Content',
    progress: 72,
    modules: 4,
    submodules: 12,
    editor: 'Aisha Khan',
    updated: '08 Nov 2026 · 09:05',
    missing: ['Module 3 missing mandatory content', 'Captions pending for 3 videos'],
    accent: 'from-[#0F766E] to-[#34D399]',
  },
  {
    id: 'bus-301',
    title: 'Project Management Fundamentals',
    code: 'BUS-301',
    category: 'Business Skills',
    step: 'Content',
    progress: 54,
    modules: 5,
    submodules: 15,
    editor: 'Priya Nair',
    updated: '06 Nov 2026 · 11:30',
    missing: ['Submodule 1.2 missing primary video', 'Module 5 quiz not created'],
    accent: 'from-[#7C3AED] to-[#A78BFA]',
  },
  {
    id: 'ism-105',
    title: 'Cybersecurity Awareness for Employees',
    code: 'ISM-105',
    category: 'Information Security',
    step: 'Settings',
    progress: 86,
    modules: 4,
    submodules: 10,
    editor: 'Rahul Menon',
    updated: '31 Oct 2026 · 12:12',
    missing: ['CPD hours not configured'],
    accent: 'from-[#0369A1] to-[#38BDF8]',
  },
  {
    id: 'env-210',
    title: 'ISO 45001: Occupational Health & Safety',
    code: 'ENV-210',
    category: 'Health & Safety',
    step: 'Details',
    progress: 18,
    modules: 0,
    submodules: 0,
    editor: 'Daniel Joseph',
    updated: '29 Oct 2026 · 16:40',
    missing: ['No modules added', 'Description incomplete'],
    accent: 'from-[#B45309] to-[#FBBF24]',
  },
  {
    id: 'qms-130',
    title: 'ISO 9001: Internal Auditor Training',
    code: 'QMS-130',
    category: 'Quality & Compliance',
    step: 'Preview',
    progress: 96,
    modules: 5,
    submodules: 14,
    editor: 'Priya Nair',
    updated: '27 Oct 2026 · 10:02',
    missing: [],
    accent: 'from-[#004EA8] to-[#3B82F6]',
  },
]
