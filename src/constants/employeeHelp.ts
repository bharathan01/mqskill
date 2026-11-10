import { employeeUser } from './employee'
import { paths } from '@/routes/paths'

export type EmployeeTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type EmployeeTicketPriority = 'low' | 'normal' | 'high'
export type EmployeeTicketThreadKind = 'message' | 'event'

export type EmployeeTicketMessage = {
  id: string
  kind: 'message'
  author: string
  role: 'learner' | 'support'
  initials: string
  body: string
  time: string
  attachment?: { name: string; size: string }
}

export type EmployeeTicketEvent = {
  id: string
  kind: 'event'
  label: string
}

export type EmployeeTicketThreadItem = EmployeeTicketMessage | EmployeeTicketEvent

export type EmployeeTicket = {
  id: string
  number: string
  subject: string
  status: EmployeeTicketStatus
  category: string
  priority: EmployeeTicketPriority
  opened: string
  lastUpdate: string
  assignedTo: string
  responseTarget: string
  relatedCourseId?: string
  relatedCourseTitle?: string
  relatedLesson?: string
  thread: EmployeeTicketThreadItem[]
}

export const employeeHelpPage = {
  title: 'Help & Support',
  heroTitle: (name: string) => `How can we help, ${name}?`,
  searchPlaceholder: "Search guides — e.g. 'certificate download', 'quiz attempt'.",
  topics: ['Courses', 'Assessments', 'Certificates', 'Live sessions', 'Account'],
  channels: {
    ticket: {
      title: 'Raise a ticket',
      detail: 'Best for course, assessment or playback issues.',
      action: 'New ticket',
    },
    email: {
      title: 'Email us',
      detail: 'support@maqskillz.com',
      action: 'Copy email',
      copied: 'Email copied.',
    },
    call: {
      title: 'Call us',
      detail: 'Sun–Thu · 9:00–17:00 Kuwait time',
      action: 'Show number',
      hide: 'Hide number',
      number: '+965 2222 8800',
    },
    guide: {
      title: 'Learner guide',
      detail: 'Courses, assessments, CPD and sessions.',
      action: 'Open guide',
      toast: 'Opening learner guide…',
    },
  },
  faqsTitle: 'Common questions',
  ticketsTitle: 'My tickets',
  status: {
    open: 'Open',
    in_progress: 'In progress',
    resolved: 'Resolved',
    closed: 'Closed',
  } satisfies Record<EmployeeTicketStatus, string>,
  emptyFaqs: 'No guides match your search.',
  firstName: employeeUser.firstName,
} as const

export const employeeHelpFaqs = [
  {
    id: 'f1',
    question: 'Why is my course progress stuck at 0%?',
    answer:
      'Refresh the page, then reopen the lesson. If it still shows 0%, raise a ticket with the course name and module — we can re-sync your progress record.',
    topic: 'Courses',
  },
  {
    id: 'f2',
    question: 'How do I retake a failed quiz?',
    answer:
      'Open My Assessments, find the quiz, and choose Retake if attempts remain. Your admin may need to unlock another attempt after the limit is reached.',
    topic: 'Assessments',
  },
  {
    id: 'f3',
    question: 'Where do I download my CPD certificate?',
    answer:
      'Go to Certificates & CPD, open the certificate, then choose Download PDF. After expiry, downloads are disabled — save a copy while it is valid.',
    topic: 'Certificates',
  },
  {
    id: 'f4',
    question: 'How do I join a live session?',
    answer:
      'Open Live Sessions, select the upcoming session, and use Join when the host enables access. Recordings appear on the same page after the session ends.',
    topic: 'Live sessions',
  },
  {
    id: 'f5',
    question: 'How do I change my notification preferences?',
    answer:
      'Open Profile & Settings and update the notification rules for courses, assessments, certificates and live sessions.',
    topic: 'Account',
  },
]

export const employeeHelpTickets: EmployeeTicket[] = [
  {
    id: 'ms-0042',
    number: 'MS-0042',
    subject: 'ISO 9001 video playback error',
    status: 'in_progress',
    category: 'Technical issue',
    priority: 'normal',
    opened: '25 Oct 2026',
    lastUpdate: '27 Oct 2026',
    assignedTo: 'Tier-2 SCORM Team',
    responseTarget: '1 business day',
    relatedCourseId: 'iso-9001',
    relatedCourseTitle: 'ISO 9001:2015 Quality Management Awareness',
    relatedLesson: 'Module 04 · Lesson 02',
    thread: [
      {
        id: 'm1',
        kind: 'message',
        author: employeeUser.name,
        role: 'learner',
        initials: employeeUser.initials,
        body: 'The SCORM lesson in Module 04 fails to track. Video starts then jumps back, and progress stays at 0% even after I finish the clip.',
        time: '25 Oct · 08:45',
        attachment: { name: 'scorm_playback_error_log.png', size: '2.4 MB' },
      },
      {
        id: 'e1',
        kind: 'event',
        label: 'Assigned to Tier-2 SCORM Team · 25 Oct, 11:30 AM',
      },
      {
        id: 'm2',
        kind: 'message',
        author: 'MaqSkillz Technical Support',
        role: 'support',
        initials: 'MS',
        body: 'Thanks Ahmed — please clear your browser cache, reopen the lesson in Chrome, and tell us if the video still fails to track.',
        time: '25 Oct · 12:05',
      },
      {
        id: 'm3',
        kind: 'message',
        author: employeeUser.name,
        role: 'learner',
        initials: employeeUser.initials,
        body: 'Video plays after clearing cache, but progress is still stuck at 0% after completing Lesson 02.',
        time: '26 Oct · 09:20',
      },
      {
        id: 'm4',
        kind: 'message',
        author: 'MaqSkillz Technical Support',
        role: 'support',
        initials: 'MS',
        body: 'We’ve re-synced your progress record for Module 04. Please reopen the lesson — completion should now show correctly. Reply here if anything still looks wrong.',
        time: '27 Oct · 10:14',
      },
    ],
  },
  {
    id: 'ms-0038',
    number: 'MS-0038',
    subject: 'Certificate download button disabled',
    status: 'resolved',
    category: 'Certificates',
    priority: 'normal',
    opened: '12 Oct 2026',
    lastUpdate: '13 Oct 2026',
    assignedTo: 'Support',
    responseTarget: '1 business day',
    relatedCourseId: 'aml',
    relatedCourseTitle: 'Anti-Money Laundering Essentials',
    relatedLesson: 'Certificate',
    thread: [
      {
        id: 'm1',
        kind: 'message',
        author: employeeUser.name,
        role: 'learner',
        initials: employeeUser.initials,
        body: 'I completed AML Essentials but Download PDF is greyed out on the certificate page.',
        time: '12 Oct · 3:10 PM',
      },
      {
        id: 'm2',
        kind: 'message',
        author: 'MaqSkillz Support',
        role: 'support',
        initials: 'MS',
        body: 'Your certificate has been re-issued. Refresh Certificates & CPD and try Download PDF again.',
        time: '13 Oct · 9:40 AM',
      },
    ],
  },
  {
    id: 'ms-0031',
    number: 'MS-0031',
    subject: 'Cannot join live session from mobile',
    status: 'closed',
    category: 'Live sessions',
    priority: 'high',
    opened: '2 Oct 2026',
    lastUpdate: '4 Oct 2026',
    assignedTo: 'Support',
    responseTarget: '4 business hours',
    relatedCourseTitle: 'ISO 27001 Q&A',
    relatedLesson: 'Live session',
    thread: [
      {
        id: 'm1',
        kind: 'message',
        author: employeeUser.name,
        role: 'learner',
        initials: employeeUser.initials,
        body: 'Join button doesn’t open on my phone browser.',
        time: '2 Oct · 1:00 PM',
      },
      {
        id: 'm2',
        kind: 'message',
        author: 'MaqSkillz Support',
        role: 'support',
        initials: 'MS',
        body: 'Please use the desktop Join link or update your mobile browser. We’ve also emailed a direct meeting URL.',
        time: '2 Oct · 2:15 PM',
      },
    ],
  },
]

export const employeeNewTicketPage = {
  back: 'Back to Help & Support',
  title: 'Raise a ticket',
  subtitle: 'Tell us what’s going on. We usually reply within 1 working day.',
  category: 'Category',
  relatedCourse: 'Related course (optional)',
  relatedNone: 'None',
  subject: 'Subject',
  subjectPlaceholder: 'Short summary',
  message: 'Message',
  messagePlaceholder: 'Describe the issue…',
  attachments: 'Attachments',
  dropFiles: 'Drop files here or',
  browse: 'browse',
  fileHint: 'PDF, PNG or JPG — up to 10 MB.',
  priority: 'Priority',
  normal: 'Normal',
  normalDetail: 'Reply within 1 working day.',
  high: 'High',
  highDetail: 'Blocking my learning progress.',
  cancel: 'Cancel',
  send: 'Send ticket',
  notifyNote: (email: string) =>
    `We’ll send updates to ${email} and show them under My tickets.`,
  categories: [
    'Technical issue',
    'Courses',
    'Assessments',
    'Certificates',
    'Live sessions',
    'Account',
    'Other',
  ],
  relatedCourses: [
    { id: '', label: 'None' },
    { id: 'iso-9001', label: 'ISO 9001:2015 Quality Management Awareness' },
    { id: 'whs', label: 'Workplace Health & Safety' },
    { id: 'aml', label: 'Anti-Money Laundering Essentials' },
    { id: 'digital-marketing', label: 'Digital Marketing Fundamentals' },
  ],
  defaults: {
    category: 'Technical issue',
    relatedCourse: 'iso-9001',
    subject: 'ISO 9001 video playback error',
    message:
      'The SCORM lesson in Module 04 fails to track. Video starts then jumps back, and progress stays at 0%.',
    priority: 'normal' as const,
  },
  sentToast: 'Ticket sent. We’ll reply soon.',
} as const

export const employeeTicketDetailPage = {
  back: 'Back to Help & Support',
  conversation: 'Conversation',
  markResolved: 'Mark as resolved',
  closeTicket: 'Close ticket',
  details: 'Ticket details',
  status: 'Status',
  priority: 'Priority',
  category: 'Category',
  assignedTo: 'Assigned to',
  responseTarget: 'Response target',
  lastUpdate: 'Last update',
  relatedCourse: 'Related course',
  replyPlaceholder: 'Write a reply…',
  attach: 'Attach file',
  sendReply: 'Send reply',
  supportBadge: 'Support',
  openedPrefix: 'Opened',
  resolvedToast: 'Ticket marked as resolved.',
  closedToast: 'Ticket closed.',
  replyToast: 'Reply sent.',
  notFound: 'Ticket not found.',
  priorityLabel: {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
  } satisfies Record<EmployeeTicketPriority, string>,
} as const

export function getEmployeeTicket(ticketId: string) {
  return employeeHelpTickets.find(
    (item) => item.id === ticketId || item.number.toLowerCase() === ticketId.toLowerCase(),
  )
}

export function employeeHelpTicketPath(ticketId: string) {
  return `${paths.employee.help}/${ticketId}`
}
