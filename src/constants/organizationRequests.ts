export type TrainingRequestStatus = 'new' | 'approved' | 'declined'

export type TrainingRequestAvailability =
  | {
      kind: 'owned'
      freeSeats: number
    }
  | {
      kind: 'purchase'
      price: string
    }

export type OrganizationTrainingRequest = {
  id: string
  employeeName: string
  employeeInitials: string
  department: string
  course: string
  note: string
  askedOn: string
  status: TrainingRequestStatus
  availability: TrainingRequestAvailability
  decisionNote: string
}

export const organizationRequestsPage = {
  eyebrow: 'People',
  title: 'Training requests',
  subtitle:
    'Employees can ask for a course from their portal. Approve to give them a seat, or decline with a note.',
  tabs: {
    new: 'New',
    approved: 'Approved',
    declined: 'Declined',
    all: 'All',
  },
  decline: 'Decline',
  approveAssign: 'Approve & assign seat',
  approveCart: 'Approve & add to cart',
  freeSeats: (count: number) => `${count} free seats — you can approve right away.`,
  purchaseHint: 'You don’t own this course yet. Approving adds 1 seat to your cart.',
  earlierTitle: 'Earlier requests',
  viewAll: 'View all',
  headers: ['Employee', 'Course', 'Asked', 'Decision', 'Note'],
  decision: {
    approved: 'Approved',
    declined: 'Declined',
    new: 'New',
  },
  emptyNew: 'No new training requests.',
  emptyFiltered: 'No requests in this view.',
  footer:
    'You can turn training requests off, or let employees request only courses you already own, in Organization settings → Learning.',
  settingsLink: 'Organization settings',
  declineTitle: (name: string) => `Decline ${name}?`,
  declinePrompt: 'Reason for declining',
  declinePlaceholder: 'e.g. Planned for Q1 2027',
  declineRequired: 'Please add a reason before declining.',
  declineConfirm: 'Decline request',
  cancel: 'Cancel',
  approveTitle: 'Approve & assign seat?',
  approveBody: (name: string, course: string) =>
    `Assign one free seat of “${course}” to ${name}? They’ll get access right away.`,
  approveConfirm: 'Approve & assign',
  approvedToast: 'Seat assigned and request approved.',
  declinedToast: 'Request declined.',
} as const

export const organizationTrainingRequests: OrganizationTrainingRequest[] = [
  {
    id: 'r1',
    employeeName: 'Noura Khalid',
    employeeInitials: 'NK',
    department: 'HR',
    course: 'Project Management Fundamentals',
    note: 'I’m leading the new HR system rollout next quarter and want to plan it properly.',
    askedOn: '28 Oct',
    status: 'new',
    availability: { kind: 'owned', freeSeats: 16 },
    decisionNote: '',
  },
  {
    id: 'r2',
    employeeName: 'Faisal Rashed',
    employeeInitials: 'FR',
    department: 'Sales',
    course: 'Professional Communication Skills',
    note: 'Our team is presenting to more clients — this would help me lead those meetings.',
    askedOn: '27 Oct',
    status: 'new',
    availability: { kind: 'purchase', price: '10.000 KWD' },
    decisionNote: '',
  },
  {
    id: 'r3',
    employeeName: 'Hamad Al-Enezi',
    employeeInitials: 'HA',
    department: 'Sales',
    course: 'Digital Marketing Fundamentals',
    note: 'Need stronger campaign planning skills for Q4.',
    askedOn: '24 Oct',
    status: 'approved',
    availability: { kind: 'owned', freeSeats: 8 },
    decisionNote: 'Seat assigned 25 Oct',
  },
  {
    id: 'r4',
    employeeName: 'Sara Nasser',
    employeeInitials: 'SN',
    department: 'Sales',
    course: 'Leadership Essentials',
    note: 'Preparing for a team lead role.',
    askedOn: '22 Oct',
    status: 'approved',
    availability: { kind: 'owned', freeSeats: 4 },
    decisionNote: 'Seat assigned 23 Oct',
  },
  {
    id: 'r5',
    employeeName: 'Omar Faisal',
    employeeInitials: 'OF',
    department: 'Sales',
    course: 'Customer Service Excellence',
    note: 'Client escalation training for the team.',
    askedOn: '20 Oct',
    status: 'approved',
    availability: { kind: 'owned', freeSeats: 12 },
    decisionNote: 'Seat assigned 21 Oct',
  },
  {
    id: 'r6',
    employeeName: 'Layla Hassan',
    employeeInitials: 'LH',
    department: 'HR',
    course: 'Workplace Health & Safety',
    note: 'Mandatory refresh for onboarding facilitators.',
    askedOn: '18 Oct',
    status: 'approved',
    availability: { kind: 'owned', freeSeats: 20 },
    decisionNote: 'Seat assigned 19 Oct',
  },
  {
    id: 'r7',
    employeeName: 'Khalid Mansoor',
    employeeInitials: 'KM',
    department: 'Finance',
    course: 'Data Privacy & GDPR Basics',
    note: 'Finance handles sensitive employee payroll data.',
    askedOn: '15 Oct',
    status: 'approved',
    availability: { kind: 'owned', freeSeats: 6 },
    decisionNote: 'Seat assigned 16 Oct',
  },
  {
    id: 'r8',
    employeeName: 'Noora Al-Kuwaiti',
    employeeInitials: 'NA',
    department: 'Operations',
    course: 'ISO 9001:2015 Quality Awareness',
    note: 'Supporting the upcoming audit prep.',
    askedOn: '12 Oct',
    status: 'approved',
    availability: { kind: 'owned', freeSeats: 9 },
    decisionNote: 'Seat assigned 13 Oct',
  },
  {
    id: 'r9',
    employeeName: 'Dana Mahmoud',
    employeeInitials: 'DM',
    department: 'HR',
    course: 'Advanced Excel for Business',
    note: 'Want this for reporting automation next year.',
    askedOn: '10 Oct',
    status: 'declined',
    availability: { kind: 'purchase', price: '8.500 KWD' },
    decisionNote: 'Planned for Q1 2027',
  },
]
