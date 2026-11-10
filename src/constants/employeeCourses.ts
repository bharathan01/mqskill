import { employeeDashboardCourses, type EmployeeCourseStatus } from './employee'
import { employeeCoursePath as coursePath } from '@/routes/paths'

export type EmployeeCourseSort = 'due' | 'progress' | 'recent' | 'title'
export type EmployeeCourseDueFilter = 'all' | 'due_soon' | 'overdue'

export const employeeCoursesPage = {
  title: 'My Courses',
  subtitle: 'Training assigned by ABC Corporation — pick up where you left off.',
  searchPlaceholder: 'Search courses…',
  filtersButton: 'Filters',
  filtersTitle: 'Filter courses',
  clearFilters: 'Clear all',
  applyFilters: 'Apply',
  statusLabel: 'Status',
  dueLabel: 'Due date',
  sortLabel: 'Sort by',
  filters: {
    all: 'All',
    in_progress: 'In progress',
    not_started: 'Not started',
    completed: 'Completed',
  },
  dueFilters: {
    all: 'Any due date',
    due_soon: 'Due in 14 days',
    overdue: 'Overdue',
  },
  sorts: {
    due: 'Due soonest',
    progress: 'Highest progress',
    recent: 'Recently accessed',
    title: 'Title A–Z',
  },
  continue: 'Continue',
  start: 'Start',
  review: 'Review',
  details: 'Details',
  due: 'Due',
  completeLabel: (percent: number) => `${percent}% complete`,
  lessonsLeft: (count: number) =>
    count === 1 ? '1 lesson left' : `${count} lessons left`,
  cpd: (hours: number) => `${hours} CPD hrs`,
  duration: (hours: number) => `${hours} hrs`,
  lastAccessed: (value: string) => `Last opened ${value}`,
  certificateReady: 'Certificate ready',
  mandatory: 'Mandatory',
  dueSoonBadge: 'Due soon',
  overdueBadge: 'Overdue',
  status: {
    not_started: 'Not started',
    in_progress: 'In progress',
    completed: 'Completed',
  } satisfies Record<EmployeeCourseStatus, string>,
  empty: 'No courses match your search or filters.',
  showing: 'Showing',
  of: 'of',
  courses: 'courses',
  summary: {
    assigned: 'Assigned',
    inProgress: 'In progress',
    dueSoon: 'Due soon',
    cpdEarned: 'CPD earned',
  },
  nextUpTitle: 'Continue learning',
  nextUpCta: 'Resume course',
  requestTraining: 'Request training',
  requestToast: 'Training request sent to your admin.',
  visitHelp: 'Need help?',
  requestForm: {
    title: 'Request training',
    subtitle: 'Your admin will review this and assign a seat if approved.',
    course: 'Course',
    coursePlaceholder: 'Select a course',
    courseOther: 'Other / not listed',
    customCourse: 'Course name',
    customCoursePlaceholder: 'e.g. Leadership for first-time managers',
    reason: 'Why do you need this?',
    reasonPlaceholder: 'Explain how this supports your role or a project…',
    priority: 'Priority',
    priorities: {
      normal: 'Normal',
      urgent: 'Urgent',
    },
    timeframe: 'Preferred start',
    timeframes: {
      asap: 'As soon as possible',
      this_month: 'This month',
      next_quarter: 'Next quarter',
      flexible: 'Flexible',
    },
    manager: 'Manager / approver note (optional)',
    managerPlaceholder: 'Anyone who should be copied on this request…',
    cancel: 'Cancel',
    submit: 'Send request',
    required: 'Please complete the required fields.',
    hint: 'Requests usually get a response within 2–3 working days.',
  },
} as const

export const employeeTrainingRequestCourses = [
  'Project Management Fundamentals',
  'Professional Communication Skills',
  'Leadership Essentials',
  'Data Protection & Privacy',
  'Fire Safety Awareness',
  'Customer Service Excellence',
  'Excel for Business Reporting',
] as const

export type EmployeeTrainingPriority = 'normal' | 'urgent'
export type EmployeeTrainingTimeframe = 'asap' | 'this_month' | 'next_quarter' | 'flexible'

const courseExtras: Record<
  string,
  {
    instructor: string
    category: string
    durationHours: number
    modules: number
    lessonsTotal: number
    lastAccessed: string
    dueDate: string | null
    mandatory: boolean
    sortRecent: number
  }
> = {
  whs: {
    instructor: 'Sara Al-Harbi',
    category: 'Compliance',
    durationHours: 6,
    modules: 5,
    lessonsTotal: 12,
    lastAccessed: 'Today',
    dueDate: '2026-11-30',
    mandatory: true,
    sortRecent: 4,
  },
  'iso-9001': {
    instructor: 'Dr. Tariq Al-Sabah',
    category: 'Quality',
    durationHours: 5,
    modules: 6,
    lessonsTotal: 12,
    lastAccessed: 'Yesterday',
    dueDate: '2026-12-15',
    mandatory: true,
    sortRecent: 3,
  },
  'digital-marketing': {
    instructor: 'Layla Hassan',
    category: 'Business',
    durationHours: 8,
    modules: 4,
    lessonsTotal: 12,
    lastAccessed: 'Not started',
    dueDate: null,
    mandatory: false,
    sortRecent: 1,
  },
  aml: {
    instructor: 'Omar Farid',
    category: 'Compliance',
    durationHours: 4,
    modules: 4,
    lessonsTotal: 12,
    lastAccessed: '20 Oct 2026',
    dueDate: '2026-10-20',
    mandatory: true,
    sortRecent: 2,
  },
}

export const employeeCourses = employeeDashboardCourses.map((course) => {
  const extra = courseExtras[course.id] ?? {
    instructor: 'Instructor',
    category: 'Training',
    durationHours: course.cpdHours,
    modules: 4,
    lessonsTotal: 12,
    lastAccessed: '—',
    dueDate: null,
    mandatory: false,
    sortRecent: 0,
  }
  const lessonsDone =
    course.status === 'completed'
      ? extra.lessonsTotal
      : course.status === 'in_progress'
        ? Math.max(1, Math.round((course.progress / 100) * extra.lessonsTotal))
        : 0

  return {
    ...course,
    ...extra,
    lessonsDone,
    lessonsLeft: Math.max(0, extra.lessonsTotal - lessonsDone),
  }
})

export type EmployeeCourse = (typeof employeeCourses)[number]

export function isEmployeeCourseDueSoon(course: EmployeeCourse, today = '2026-11-09') {
  if (!course.dueDate || course.status === 'completed') return false
  const due = new Date(course.dueDate).getTime()
  const now = new Date(today).getTime()
  const days = (due - now) / (1000 * 60 * 60 * 24)
  return days >= 0 && days <= 14
}

export function isEmployeeCourseOverdue(course: EmployeeCourse, today = '2026-11-09') {
  if (!course.dueDate || course.status === 'completed') return false
  return new Date(course.dueDate).getTime() < new Date(today).getTime()
}

export const employeeCourseLessonPage = {
  back: 'Back to My Courses',
  recording: 'Recording',
  captionsAvailable: 'Captions available',
  captionsOn: 'CC on',
  captionsOff: 'CC',
  progress: (percent: number) => `${percent}% complete`,
  tabs: {
    overview: 'Overview',
    transcript: 'Transcript',
    resources: 'Resources',
    questions: 'Questions',
  },
  askPlaceholder: 'Ask about this lesson…',
  post: 'Post',
  askNote:
    'Questions are visible to everyone enrolled in this course. Don’t share personal or company-confidential information.',
  questionsCount: (count: number) => `${count} questions`,
  sortLabel: 'Sort by:',
  sortRecent: 'Most recent',
  likes: (count: number) => `${count}`,
  replies: (count: number) => (count === 1 ? '1 reply' : `${count} replies`),
  answered: 'Answered',
  awaiting: 'Awaiting answer',
  you: 'You',
  instructor: 'Instructor',
  guidelinesTitle: 'Q&A guidelines',
  guidelines: [
    'Keep questions about this lesson',
    'Search before posting',
    'Be respectful and specific',
    'Don’t share confidential company data',
  ],
  activityTitle: 'Your activity',
  activity: {
    asked: 'Questions asked',
    answered: 'Answered',
    upvotes: 'Upvotes received',
  },
  overviewTitle: 'About this session',
  chaptersTitle: 'Chapters',
  transcriptTitle: 'Transcript',
  transcriptHint: 'Click a line to jump in the video.',
  resourcesEmpty: 'No resources attached to this lesson yet.',
  download: 'Download',
  postedToast: 'Question posted.',
  likedToast: 'Thanks for the upvote.',
  markComplete: 'Mark lesson complete',
  markedCompleteToast: 'Lesson marked complete.',
} as const

export type QaStatus = 'answered' | 'awaiting'

export type EmployeeQaReply = {
  id: string
  author: string
  role: 'instructor' | 'learner'
  initials: string
  body: string
  time: string
}

export type EmployeeQaQuestion = {
  id: string
  author: string
  initials: string
  isYou?: boolean
  time: string
  body: string
  likes: number
  status: QaStatus
  replies: EmployeeQaReply[]
}

export const employeeCourseLesson = {
  courseId: 'iso-9001',
  courseTitle: 'ISO 9001:2015 Quality Management Awareness',
  moduleLabel: 'Module 04',
  lessonLabel: 'Lesson 02',
  lessonTitle: 'Implementing QMS Procedures',
  sessionTitle: 'Live Q&A: Implementing QMS Procedures',
  progress: 65,
  instructor: {
    name: 'Dr. Tariq Al-Sabah',
    initials: 'TA',
  },
  recordedOn: '21 Oct 2026',
  durationLabel: '1h 28m',
  videoId: 'LiPNy_WyCTU',
  videoUrl: 'https://www.youtube.com/embed/LiPNy_WyCTU?si=DHCKVWBcZClAq87f',
  overviewBody:
    'Walk through how to write, approve, and roll out QMS procedures so every department follows the same controlled process — including document control, work instructions, and SharePoint practices.',
  chapters: [
    { id: 'c1', time: 0, label: '00:00', title: 'Introduction and agenda' },
    { id: 'c2', time: 492, label: '08:12', title: 'Procedure vs work instruction' },
    { id: 'c3', time: 1248, label: '20:48', title: 'Document control essentials' },
    { id: 'c4', time: 2115, label: '35:15', title: 'Department manuals & ownership' },
    { id: 'c5', time: 3180, label: '53:00', title: 'SharePoint & version history' },
    { id: 'c6', time: 4020, label: '1:07:00', title: 'Q&A and next steps' },
  ],
  transcript: [
    {
      id: 't1',
      time: 0,
      label: '00:00',
      text: 'Welcome back. Today we dig into implementing QMS procedures and how they connect to Annex-style controls.',
    },
    {
      id: 't2',
      time: 48,
      label: '00:48',
      text: 'A procedure tells you what must happen. A work instruction shows how a role carries it out step by step.',
    },
    {
      id: 't3',
      time: 492,
      label: '08:12',
      text: 'Keep one company-level procedure manual when possible, and link department specifics as controlled work instructions.',
    },
    {
      id: 't4',
      time: 1248,
      label: '20:48',
      text: 'Version control applies to forms as well as procedures whenever the form affects how work is performed.',
    },
    {
      id: 't5',
      time: 2115,
      label: '35:15',
      text: 'Process owners approve content; Quality confirms the document is controlled before it becomes current.',
    },
    {
      id: 't6',
      time: 3180,
      label: '53:00',
      text: 'SharePoint is fine for controlled documents if permissions, naming, and current-version rules are documented.',
    },
    {
      id: 't7',
      time: 4020,
      label: '1:07:00',
      text: 'Before we close, drop questions in the portal — I’ll answer the ones we don’t cover live.',
    },
  ],
  resources: [
    { id: 'r1', title: 'QMS procedure template.docx', size: '180 KB' },
    { id: 'r2', title: 'Document control checklist.pdf', size: '420 KB' },
    { id: 'r3', title: 'Sample work instruction.pdf', size: '310 KB' },
  ],
  activity: {
    asked: 3,
    answered: 2,
    upvotes: 14,
  },
  questions: [
    {
      id: 'q1',
      author: 'Mariam S.',
      initials: 'MS',
      time: '2 days ago',
      body: 'Does the QMS procedure manual need a separate document for each department, or can one controlled manual cover the whole company?',
      likes: 12,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r1',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'One company-level manual is fine if department specifics are covered in work instructions linked from it. Keep the master list controlled.',
          time: '1 day ago',
        },
      ],
    },
    {
      id: 'q2',
      author: 'Yousef H.',
      initials: 'YH',
      time: '3 days ago',
      body: 'Is version control required for forms, or only for procedures?',
      likes: 5,
      status: 'awaiting' as QaStatus,
      replies: [],
    },
    {
      id: 'q3',
      author: 'You',
      initials: 'AA',
      isYou: true,
      time: '5 days ago',
      body: 'Can we keep controlled documents in SharePoint if access and version history are restricted?',
      likes: 8,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r2',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Yes — SharePoint works when permissions, naming, and the current-version policy are documented in your document control procedure.',
          time: '4 days ago',
        },
      ],
    },
    {
      id: 'q4',
      author: 'Layla K.',
      initials: 'LK',
      time: '6 days ago',
      body: 'How often should we review QMS procedures after the initial rollout?',
      likes: 7,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r3',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'At least annually, and whenever a process, regulation, or ownership change affects the procedure.',
          time: '5 days ago',
        },
      ],
    },
    {
      id: 'q5',
      author: 'Omar R.',
      initials: 'OR',
      time: '1 week ago',
      body: 'Do contractors need access to the same controlled procedure set as employees?',
      likes: 4,
      status: 'awaiting' as QaStatus,
      replies: [],
    },
    {
      id: 'q6',
      author: 'Noura A.',
      initials: 'NA',
      time: '1 week ago',
      body: 'What’s the difference between a procedure and a work instruction in practice?',
      likes: 11,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r4',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Procedures describe what must happen; work instructions show how a specific role carries it out step by step.',
          time: '6 days ago',
        },
      ],
    },
    {
      id: 'q7',
      author: 'You',
      initials: 'AA',
      isYou: true,
      time: '8 days ago',
      body: 'Should obsolete printed copies be stamped “obsolete” or destroyed immediately?',
      likes: 3,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r5',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Either works if your control procedure defines the method. Destruction is cleaner when reprints are easy.',
          time: '7 days ago',
        },
      ],
    },
    {
      id: 'q8',
      author: 'Hassan M.',
      initials: 'HM',
      time: '9 days ago',
      body: 'Can flowcharts replace text procedures for simple processes?',
      likes: 6,
      status: 'awaiting' as QaStatus,
      replies: [],
    },
    {
      id: 'q9',
      author: 'Sara D.',
      initials: 'SD',
      time: '10 days ago',
      body: 'Who should approve a procedure before it becomes the current controlled version?',
      likes: 9,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r6',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Process owner plus a quality representative is the usual pattern — document names and roles in your control matrix.',
          time: '9 days ago',
        },
      ],
    },
    {
      id: 'q10',
      author: 'Faisal B.',
      initials: 'FB',
      time: '11 days ago',
      body: 'Is a training record required every time a procedure is revised?',
      likes: 5,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r7',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Yes when the change affects how people work. Minor editorial fixes can be communicated without full re-training.',
          time: '10 days ago',
        },
      ],
    },
    {
      id: 'q11',
      author: 'You',
      initials: 'AA',
      isYou: true,
      time: '12 days ago',
      body: 'Where should temporary redline drafts live before formal approval?',
      likes: 2,
      status: 'awaiting' as QaStatus,
      replies: [],
    },
    {
      id: 'q12',
      author: 'Rania T.',
      initials: 'RT',
      time: '2 weeks ago',
      body: 'Do forms need document numbers if they are embedded in a procedure appendix?',
      likes: 4,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r8',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Give them identifiers so audits can trace the exact form version in use.',
          time: '13 days ago',
        },
      ],
    },
    {
      id: 'q13',
      author: 'Khalid N.',
      initials: 'KN',
      time: '2 weeks ago',
      body: 'Can we translate procedures into Arabic without creating a second controlled document?',
      likes: 10,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r9',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Treat each language as a controlled version of the same document family, with clear master/source designation.',
          time: '13 days ago',
        },
      ],
    },
    {
      id: 'q14',
      author: 'Maya P.',
      initials: 'MP',
      time: '3 weeks ago',
      body: 'What’s the best way to notify teams when a procedure reaches “current” status?',
      likes: 6,
      status: 'answered' as QaStatus,
      replies: [
        {
          id: 'r10',
          author: 'Dr. Tariq Al-Sabah',
          role: 'instructor' as const,
          initials: 'TA',
          body: 'Use your LMS or email distribution list tied to affected roles, and keep the acknowledgement with training records.',
          time: '2 weeks ago',
        },
      ],
    },
  ] satisfies EmployeeQaQuestion[],
}

export function employeeCoursePath(courseId: string) {
  return coursePath(courseId)
}

export function getEmployeeCourse(courseId: string) {
  return employeeCourses.find((item) => item.id === courseId)
}
