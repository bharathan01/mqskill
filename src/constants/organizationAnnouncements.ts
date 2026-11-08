export type AnnouncementStatus = 'sent' | 'scheduled' | 'draft'

export type AnnouncementAudience =
  | { kind: 'everyone'; count: number }
  | { kind: 'department'; name: string; count: number }
  | { kind: 'people'; count: number }

export type OrganizationAnnouncement = {
  id: string
  title: string
  subtitle: string
  audience: AnnouncementAudience
  date: string
  readPercent: number | null
  status: AnnouncementStatus
}

export const organizationAnnouncementsPage = {
  eyebrow: 'Communicate',
  title: 'Announcements',
  subtitle: 'Send news, reminders and deadlines to everyone, a department, or selected people.',
  newAnnouncement: 'New announcement',
  filters: {
    all: 'All',
    sent: 'Sent',
    scheduled: 'Scheduled',
    drafts: 'Drafts',
  },
  headers: ['Announcement', 'Sent to', 'Date', 'Read', 'Status', ''],
  status: {
    sent: 'Sent',
    scheduled: 'Scheduled',
    draft: 'Draft',
  },
  audience: {
    everyone: (count: number) => `Everyone · ${count}`,
    people: (count: number) => `${count} people`,
    department: (name: string, count: number) => `${name} · ${count}`,
  },
  menu: {
    view: 'View',
    edit: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
  },
  createdToast: 'Announcement draft created.',
  duplicatedToast: 'Announcement duplicated.',
  deletedToast: 'Announcement deleted.',
} as const

export const organizationNewAnnouncementPage = {
  eyebrow: 'Communicate',
  title: 'New announcement',
  saveDraft: 'Save draft',
  sendTo: (count: number) => `Send to ${count} people`,
  titleLabel: 'Title',
  titlePlaceholder: 'Announcement title',
  messageLabel: 'Message',
  messagePlaceholder: 'Write your announcement…',
  sendToLabel: 'Send to',
  audience: {
    everyone: 'Everyone',
    everyoneDetail: '48 employees',
    departments: 'Departments',
    departmentsDetail: 'Pick one or more',
    people: 'Pick people',
    peopleDetail: 'Choose by name',
    addDepartment: 'Add department',
  },
  linkCourseLabel: 'Link a course (optional)',
  linkCoursePlaceholder: 'Select a course',
  whenLabel: 'When',
  whenOptions: [
    { id: 'now', label: 'Send now' },
    { id: 'schedule', label: 'Schedule for later' },
  ],
  showInPortal: 'Show in portal',
  sendByEmail: 'Also send by email',
  preview: 'Preview',
  previewJustNow: 'Just now',
  openCourse: 'Open course',
  willGetThis: (count: number, detail: string) =>
    `${count} people will get this: ${detail}.`,
  everyonePreview: 'Everyone (48)',
  draftSavedToast: 'Draft saved.',
  sentToast: 'Announcement sent.',
  defaults: {
    title: 'Finish Health & Safety by 30 Nov',
    message:
      'Hi team,\n\nPlease complete Workplace Health & Safety by 30 November. It takes about 8 hours and you’ll get a certificate at the end.\n\nThanks,\nSara',
    courseId: 'whs',
    when: 'now',
    showInPortal: true,
    sendByEmail: true,
    departmentIds: ['operations', 'quality'],
  },
} as const

export const organizationAnnouncementDepartments = [
  { id: 'operations', name: 'Operations', count: 18 },
  { id: 'quality', name: 'Quality', count: 8 },
  { id: 'hr', name: 'HR', count: 6 },
  { id: 'sales', name: 'Sales', count: 11 },
  { id: 'finance', name: 'Finance', count: 5 },
] as const

export const organizationAnnouncementCourses = [
  { id: 'whs', title: 'Workplace Health & Safety' },
  { id: 'digital-marketing', title: 'Digital Marketing Fundamentals' },
  { id: 'iso-9001', title: 'ISO 9001:2015 Quality Awareness' },
  { id: 'pm', title: 'Project Management Fundamentals' },
] as const

export const organizationAnnouncementPeople = [
  { id: 'e1', name: 'Mariam Saleh', initials: 'MS', department: 'Quality' },
  { id: 'e2', name: 'Yousef Hamad', initials: 'YH', department: 'Operations' },
  { id: 'e3', name: 'Layla Hassan', initials: 'LH', department: 'HR' },
  { id: 'e4', name: 'Omar Faisal', initials: 'OF', department: 'Sales' },
  { id: 'e5', name: 'Noora Al-Kuwaiti', initials: 'NA', department: 'Operations' },
  { id: 'e8', name: 'Ahmed Al-Mutawa', initials: 'AA', department: 'Operations' },
  { id: 'e13', name: 'Noura Khalifa', initials: 'NK', department: 'Sales' },
] as const

export const organizationAnnouncementEveryoneCount = 48

export const organizationAnnouncements: OrganizationAnnouncement[] = [
  {
    id: 'a1',
    title: 'Q4 learning goals',
    subtitle: 'Share team priorities and CPD targets for the quarter.',
    audience: { kind: 'everyone', count: 48 },
    date: '10 Nov, 9:00 AM',
    readPercent: null,
    status: 'scheduled',
  },
  {
    id: 'a2',
    title: 'Sales training plan',
    subtitle: 'Outline for the November sales enablement cohort.',
    audience: { kind: 'people', count: 5 },
    date: '—',
    readPercent: null,
    status: 'draft',
  },
  {
    id: 'a3',
    title: 'Digital Marketing seats available',
    subtitle: '7 seats ready to assign from the latest purchase.',
    audience: { kind: 'everyone', count: 48 },
    date: '2 Nov 2026',
    readPercent: 81,
    status: 'sent',
  },
  {
    id: 'a4',
    title: 'Finish Health & Safety by 30 Nov',
    subtitle: 'Reminder for Operations learners still in progress.',
    audience: { kind: 'department', name: 'Operations', count: 18 },
    date: '28 Oct 2026',
    readPercent: 94,
    status: 'sent',
  },
  {
    id: 'a5',
    title: 'ISO audit next month',
    subtitle: 'Quality team prep checklist and course links.',
    audience: { kind: 'department', name: 'Quality', count: 8 },
    date: '20 Oct 2026',
    readPercent: 100,
    status: 'sent',
  },
  {
    id: 'a6',
    title: 'Welcome to MaqSkillz!',
    subtitle: 'How to start learning and where to find support.',
    audience: { kind: 'everyone', count: 48 },
    date: '10 Oct 2026',
    readPercent: 96,
    status: 'sent',
  },
]
