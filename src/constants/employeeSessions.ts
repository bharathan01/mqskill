import { paths } from '@/routes/paths'

export type LiveSessionStatus = 'upcoming' | 'registered' | 'recording'
export type LiveSessionTab = 'upcoming' | 'registered' | 'recordings'

export type LiveSession = {
  id: string
  title: string
  summary: string
  track: string
  instructor: string
  instructorRole: string
  instructorInitials: string
  dateLabel: string
  timeLabel: string
  durationLabel: string
  cpdHours: number
  platform: string
  status: LiveSessionStatus
  registered: boolean
  startsIn?: string
  dayBadge?: string
  relatedCourse: string
  relatedCourseId?: string
  attendedLive?: boolean
  videoId: string
  chapters: { id: string; time: number; label: string; title: string }[]
  transcript: { id: string; time: number; label: string; text: string }[]
  resources: { id: string; title: string; size: string }[]
  questionsCount: number
  overview: string
}

export const employeeSessionsPage = {
  title: 'Live Sessions',
  badge: 'Expert-led',
  subtitle:
    'Join live webinars and watch recordings. Times are shown in Arabia Standard Time (GMT+3).',
  syncCalendar: 'Sync to calendar',
  syncedToast: 'Calendar sync enabled for upcoming sessions.',
  tabs: {
    upcoming: 'Upcoming',
    registered: 'Registered',
    recordings: 'Recordings',
  },
  featuredLabel: 'Featured',
  startsIn: (value: string) => `Starts in ${value}`,
  registered: 'Registered',
  register: 'Register',
  join: 'Join session',
  addCalendar: 'Add to calendar',
  askQuestion: 'Submit a question',
  upcomingTitle: 'Upcoming sessions',
  recordingsTitle: 'Recent recordings',
  viewAll: (count: number) => `View all ${count}`,
  watch: 'Watch recording',
  registeredToast: 'You’re registered for this session.',
  questionToast: 'Question submitted to the instructor.',
  calendarToast: 'Session added to your calendar.',
  joinToast: 'Opening Zoom webinar…',
  empty: 'No sessions in this view.',
  duration: (minutes: string, cpd: number) => `${minutes} · ${cpd} CPD hours`,
} as const

export const employeeSessionDetailPage = {
  back: 'Back to Live Sessions',
  recording: 'Recording',
  captionsAvailable: 'Captions available',
  tabs: {
    overview: 'Overview',
    transcript: 'Transcript',
    resources: 'Resources',
    questions: 'Questions',
  },
  aboutTitle: 'About this session',
  chaptersTitle: 'Chapters',
  transcriptHint: 'Click a line to jump in the recording.',
  detailsTitle: 'Session details',
  resourcesTitle: 'Resources',
  date: 'Date',
  duration: 'Duration',
  instructor: 'Instructor',
  relatedCourse: 'Related course',
  attendance: 'Attendance',
  attendedLive: 'You attended live',
  download: 'Download',
  askPlaceholder: 'Ask about this session…',
  post: 'Post',
  askNote: 'Questions are visible to everyone who registered for this session.',
  postedToast: 'Question posted.',
} as const

const sharedChapters = [
  { id: 'c1', time: 0, label: '00:00', title: 'Introduction and agenda' },
  { id: 'c2', time: 492, label: '08:12', title: 'Organizational controls' },
  { id: 'c3', time: 1248, label: '20:48', title: 'People controls' },
  { id: 'c4', time: 2115, label: '35:15', title: 'Physical controls' },
  { id: 'c5', time: 3180, label: '53:00', title: 'Technological controls' },
  { id: 'c6', time: 4020, label: '1:07:00', title: 'Q&A and next steps' },
]

const sharedTranscript = [
  {
    id: 't1',
    time: 0,
    label: '00:00',
    text: 'Welcome. Today we walk through Annex A controls and how to apply them in practice.',
  },
  {
    id: 't2',
    time: 492,
    label: '08:12',
    text: 'Organizational controls set the policies and responsibilities that keep the ISMS coherent.',
  },
  {
    id: 't3',
    time: 1248,
    label: '20:48',
    text: 'People controls cover competence, awareness, and acceptable use.',
  },
  {
    id: 't4',
    time: 2115,
    label: '35:15',
    text: 'Physical controls protect facilities, equipment, and secure areas.',
  },
  {
    id: 't5',
    time: 3180,
    label: '53:00',
    text: 'Technological controls include access, logging, malware protection, and backup.',
  },
]

export const employeeLiveSessions: LiveSession[] = [
  {
    id: 'iso27001-qa',
    title: 'Live Q&A: ISO 27001 Audit Readiness',
    summary:
      'Bring your audit questions. We’ll cover evidence packs, common non-conformities, and how to brief your leadership team before the Stage 2 visit.',
    track: 'ISO 27001 track',
    instructor: 'Dr. Tariq Al-Sabah',
    instructorRole: 'Senior Lead Auditor · Instructor',
    instructorInitials: 'TA',
    dateLabel: 'Wed, 4 Nov 2026',
    timeLabel: '2:00 PM AST',
    durationLabel: '90 minutes',
    cpdHours: 1.5,
    platform: 'Zoom webinar',
    status: 'registered',
    registered: true,
    startsIn: '1 day',
    relatedCourse: 'ISO 27001 Lead Auditor',
    relatedCourseId: 'iso-9001',
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [
      { id: 'r1', title: 'Session slides.pdf', size: '4.2 MB' },
      { id: 'r2', title: 'Annex A checklist.pdf', size: '880 KB' },
      { id: 'r3', title: 'Q&A summary.pdf', size: '310 KB' },
    ],
    questionsCount: 19,
    overview:
      'A live walkthrough of audit readiness for ISO 27001 — evidence packs, common findings, and how to brief leadership before Stage 2.',
  },
  {
    id: 'incident-clinic',
    title: 'Incident Reporting Clinic: Workplace Health & Safety',
    summary: 'Practice clear incident write-ups with real workplace scenarios.',
    track: 'WHS track',
    instructor: 'Sara Al-Harbi',
    instructorRole: 'HSE Specialist · Instructor',
    instructorInitials: 'SH',
    dateLabel: 'Sat, 8 Nov 2026',
    timeLabel: '10:00 AM AST',
    durationLabel: '60 minutes',
    cpdHours: 1,
    platform: 'Zoom webinar',
    status: 'upcoming',
    registered: false,
    dayBadge: '08 NOV',
    relatedCourse: 'Workplace Health & Safety',
    relatedCourseId: 'whs',
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [
      { id: 'r1', title: 'Incident form template.docx', size: '220 KB' },
      { id: 'r2', title: 'Clinic slides.pdf', size: '2.1 MB' },
    ],
    questionsCount: 8,
    overview: 'Hands-on clinic for writing clear, auditable incident reports.',
  },
  {
    id: 'wbs-works',
    title: 'Building a WBS That Works',
    summary: 'Structure work breakdowns that survive scope changes.',
    track: 'Project track',
    instructor: 'Layla Hassan',
    instructorRole: 'PMO Lead · Instructor',
    instructorInitials: 'LH',
    dateLabel: 'Fri, 14 Nov 2026',
    timeLabel: '1:00 PM AST',
    durationLabel: '75 minutes',
    cpdHours: 1.25,
    platform: 'Zoom webinar',
    status: 'upcoming',
    registered: false,
    dayBadge: '14 NOV',
    relatedCourse: 'Project Management Fundamentals',
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [{ id: 'r1', title: 'WBS worksheet.xlsx', size: '540 KB' }],
    questionsCount: 5,
    overview: 'Practical patterns for a WBS your team can actually use.',
  },
  {
    id: 'ncr-writing',
    title: 'Writing Clear Non-Conformity Reports',
    summary: 'Write NCRs that are specific, evidence-based, and actionable.',
    track: 'Quality track',
    instructor: 'Dr. Tariq Al-Sabah',
    instructorRole: 'Senior Lead Auditor · Instructor',
    instructorInitials: 'TA',
    dateLabel: 'Sun, 22 Nov 2026',
    timeLabel: '11:00 AM AST',
    durationLabel: '60 minutes',
    cpdHours: 1,
    platform: 'Zoom webinar',
    status: 'registered',
    registered: true,
    dayBadge: '22 NOV',
    relatedCourse: 'ISO 9001:2015 Quality Management Awareness',
    relatedCourseId: 'iso-9001',
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [{ id: 'r1', title: 'NCR examples.pdf', size: '1.1 MB' }],
    questionsCount: 11,
    overview: 'How to write non-conformity reports auditors and process owners can act on.',
  },
  {
    id: 'annex-a-recording',
    title: 'Live Q&A: Annex A Controls Deep Dive',
    summary: 'Recording of the Annex A controls walkthrough and live Q&A.',
    track: 'ISO 27001 track',
    instructor: 'Dr. Tariq Al-Sabah',
    instructorRole: 'Senior Lead Auditor · Instructor',
    instructorInitials: 'TA',
    dateLabel: '21 Oct 2026',
    timeLabel: 'Recorded',
    durationLabel: '1h 28m',
    cpdHours: 1.5,
    platform: 'Recording',
    status: 'recording',
    registered: true,
    relatedCourse: 'ISO 27001 Lead Auditor',
    attendedLive: true,
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [
      { id: 'r1', title: 'Session slides.pdf', size: '4.2 MB' },
      { id: 'r2', title: 'Annex A checklist.pdf', size: '880 KB' },
      { id: 'r3', title: 'Q&A summary.pdf', size: '310 KB' },
    ],
    questionsCount: 19,
    overview:
      'A practical walkthrough of the 93 Annex A controls — what auditors look for, common gaps, and how to evidence each control family.',
  },
  {
    id: 'fire-safety-recording',
    title: 'Fire Safety Responsibilities for Employees',
    summary: 'Recording covering extinguisher types, exits, and assembly points.',
    track: 'WHS track',
    instructor: 'Sara Al-Harbi',
    instructorRole: 'HSE Specialist · Instructor',
    instructorInitials: 'SH',
    dateLabel: '12 Oct 2026',
    timeLabel: 'Recorded',
    durationLabel: '52m',
    cpdHours: 1,
    platform: 'Recording',
    status: 'recording',
    registered: true,
    relatedCourse: 'Workplace Health & Safety',
    relatedCourseId: 'whs',
    attendedLive: false,
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [
      { id: 'r1', title: 'Fire safety checklist.pdf', size: '640 KB' },
      { id: 'r2', title: 'Session slides.pdf', size: '2.8 MB' },
    ],
    questionsCount: 7,
    overview: 'Employee responsibilities for fire prevention, response, and reporting.',
  },
  {
    id: 'risk-registers-recording',
    title: 'Project Risk Registers in Practice',
    summary: 'How to build and maintain a living risk register.',
    track: 'Project track',
    instructor: 'Layla Hassan',
    instructorRole: 'PMO Lead · Instructor',
    instructorInitials: 'LH',
    dateLabel: '3 Oct 2026',
    timeLabel: 'Recorded',
    durationLabel: '1h 05m',
    cpdHours: 1,
    platform: 'Recording',
    status: 'recording',
    registered: true,
    relatedCourse: 'Project Management Fundamentals',
    attendedLive: true,
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [{ id: 'r1', title: 'Risk register template.xlsx', size: '480 KB' }],
    questionsCount: 9,
    overview: 'Practical risk register habits that keep risks visible and owned.',
  },
  {
    id: 'aml-redflags-recording',
    title: 'AML Red Flags Roundtable',
    summary: 'Recorded discussion of red-flag scenarios and escalation paths.',
    track: 'Compliance track',
    instructor: 'Omar Farid',
    instructorRole: 'Compliance Lead · Instructor',
    instructorInitials: 'OF',
    dateLabel: '28 Sep 2026',
    timeLabel: 'Recorded',
    durationLabel: '48m',
    cpdHours: 0.75,
    platform: 'Recording',
    status: 'recording',
    registered: true,
    relatedCourse: 'Anti-Money Laundering Essentials',
    relatedCourseId: 'aml',
    attendedLive: false,
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [{ id: 'r1', title: 'Red flag examples.pdf', size: '720 KB' }],
    questionsCount: 6,
    overview: 'Roundtable on spotting and escalating AML red flags.',
  },
  {
    id: 'doc-control-recording',
    title: 'Document Control Office Hours',
    summary: 'Office hours on SharePoint control and version history.',
    track: 'Quality track',
    instructor: 'Dr. Tariq Al-Sabah',
    instructorRole: 'Senior Lead Auditor · Instructor',
    instructorInitials: 'TA',
    dateLabel: '18 Sep 2026',
    timeLabel: 'Recorded',
    durationLabel: '41m',
    cpdHours: 0.75,
    platform: 'Recording',
    status: 'recording',
    registered: true,
    relatedCourse: 'ISO 9001:2015 Quality Management Awareness',
    relatedCourseId: 'iso-9001',
    attendedLive: true,
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [{ id: 'r1', title: 'Document control tips.pdf', size: '390 KB' }],
    questionsCount: 12,
    overview: 'Live office hours answering document control questions from learners.',
  },
  {
    id: 'marketing-metrics-recording',
    title: 'Marketing Metrics That Matter',
    summary: 'Choosing KPIs that connect campaigns to outcomes.',
    track: 'Business track',
    instructor: 'Layla Hassan',
    instructorRole: 'PMO Lead · Instructor',
    instructorInitials: 'LH',
    dateLabel: '5 Sep 2026',
    timeLabel: 'Recorded',
    durationLabel: '55m',
    cpdHours: 1,
    platform: 'Recording',
    status: 'recording',
    registered: true,
    relatedCourse: 'Digital Marketing Fundamentals',
    relatedCourseId: 'digital-marketing',
    attendedLive: false,
    videoId: 'LiPNy_WyCTU',
    chapters: sharedChapters,
    transcript: sharedTranscript,
    resources: [{ id: 'r1', title: 'KPI worksheet.xlsx', size: '260 KB' }],
    questionsCount: 4,
    overview: 'How to pick marketing metrics that leadership actually uses.',
  },
]

export function getEmployeeLiveSession(sessionId: string) {
  return employeeLiveSessions.find((item) => item.id === sessionId)
}

export function employeeSessionPath(sessionId: string) {
  return `${paths.employee.sessions}/${sessionId}`
}

export const employeeSessionsFeaturedId = 'iso27001-qa'
