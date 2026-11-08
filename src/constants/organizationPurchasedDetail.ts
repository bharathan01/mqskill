import {
  organizationPurchasedCourses,
  type OrganizationPurchasedCourse,
} from './organizationPurchased'

export type SeatLearnerStatus = 'completed' | 'in_progress' | 'not_started' | 'invited'

export type PurchasedSeatLearner = {
  id: string
  name: string
  initials: string
  department: string
  assignedOn: string
  progress: number
  status: SeatLearnerStatus
}

export type OrganizationPurchasedCourseDetail = OrganizationPurchasedCourse & {
  orderId: string
  boughtOn: string
  pricePerSeat: string
  learners: PurchasedSeatLearner[]
}

export const organizationPurchasedDetailPage = {
  back: '← Back to purchased courses',
  orderPrefix: 'Order',
  boughtPrefix: 'bought',
  perSeat: 'per seat',
  bought: 'bought',
  assigned: 'assigned',
  free: 'free',
  completed: 'completed',
  assignSeats: '+ Assign seats',
  buyMoreSeats: 'Buy more seats',
  whoHasSeat: 'Who has a seat',
  tabs: {
    all: 'All',
    in_progress: 'In progress',
    completed: 'Completed',
    not_started: 'Not started',
  },
  headers: ['Employee', 'Assigned', 'Progress', 'Status', ''],
  status: {
    completed: 'Completed',
    in_progress: 'In progress',
    not_started: 'Not started',
    invited: 'Invited',
  },
  certificate: 'Certificate',
  seatInUse: 'Seat in use',
  moveSeat: 'Move seat',
  freeBanner: (count: number) =>
    `${count} free seats — Give them to employees who need this course`,
  assign: 'Assign',
  moveHint:
    'Move seat is only shown when the employee hasn’t started. Once they start, the seat stays with them.',
  notFoundTitle: 'Course not found',
  notFoundBody: 'This purchased course is not in your organization library.',
  assignSuccess: 'Seats assigned.',
  moveSuccess: 'Seat moved.',
  certificateToast: 'Certificate opened.',
  emptyLearners: 'No learners match this filter.',
  awaitingBody: 'This course unlocks after payment clears.',
  assignModal: {
    title: 'Assign seats',
    selectedOf: (selected: number, free: number) =>
      `${selected} of ${free} free seats selected`,
    left: (count: number) => `${count} left`,
    searchPlaceholder: 'Search employees',
    allDepartments: 'All departments',
    hasCourse: 'Has this course',
    completeBy: 'Complete by (optional)',
    completeByHint: 'Employees get a reminder 3 days before',
    emailNow: 'Email employees now',
    emailHint: 'They get a link to start the course',
    emailOn: 'On',
    emailOff: 'Off',
    cancel: 'Cancel',
    assignCount: (count: number) => `Assign ${count} seat${count === 1 ? '' : 's'}`,
    required: 'Select at least one employee.',
    defaultDeadline: '2026-11-30',
  },
} as const

export type AssignSeatCandidate = {
  id: string
  name: string
  initials: string
  department: string
  statusLabel?: string
  hasCourse?: boolean
}

export const organizationAssignSeatCandidates: AssignSeatCandidate[] = [
  {
    id: 'c1',
    name: 'Huda Nasser',
    initials: 'HN',
    department: 'Finance',
    statusLabel: 'Invited',
  },
  {
    id: 'c2',
    name: 'Bader Yousef',
    initials: 'BY',
    department: 'Operations',
  },
  {
    id: 'c3',
    name: 'Salem Al-Ajmi',
    initials: 'SA',
    department: 'Sales',
  },
  {
    id: 'c4',
    name: 'Ahmed Al-Mutawa',
    initials: 'AM',
    department: 'Operations',
    hasCourse: true,
  },
  {
    id: 'c5',
    name: 'Khalid Al-Hamad',
    initials: 'KH',
    department: 'HR',
  },
  {
    id: 'c6',
    name: 'Fatima Qassim',
    initials: 'FQ',
    department: 'Quality',
  },
  {
    id: 'c7',
    name: 'Reem Al-Dosari',
    initials: 'RD',
    department: 'Finance',
  },
]

const digitalMarketingLearners: PurchasedSeatLearner[] = [
  {
    id: 'l1',
    name: 'Mariam Saleh',
    initials: 'MS',
    department: 'Quality',
    assignedOn: '2 Oct 2026',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'l2',
    name: 'Yousef Hamad',
    initials: 'YH',
    department: 'Operations',
    assignedOn: '2 Oct 2026',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'l3',
    name: 'Layla Hassan',
    initials: 'LH',
    department: 'HR',
    assignedOn: '5 Oct 2026',
    progress: 62,
    status: 'in_progress',
  },
  {
    id: 'l4',
    name: 'Omar Faisal',
    initials: 'OF',
    department: 'Sales',
    assignedOn: '8 Oct 2026',
    progress: 35,
    status: 'in_progress',
  },
  {
    id: 'l5',
    name: 'Noora Al-Kuwaiti',
    initials: 'NA',
    department: 'Operations',
    assignedOn: '10 Oct 2026',
    progress: 18,
    status: 'in_progress',
  },
  {
    id: 'l6',
    name: 'Khalid Mansoor',
    initials: 'KM',
    department: 'Finance',
    assignedOn: '12 Oct 2026',
    progress: 0,
    status: 'not_started',
  },
  {
    id: 'l7',
    name: 'Sara Nasser',
    initials: 'SN',
    department: 'Sales',
    assignedOn: '14 Oct 2026',
    progress: 0,
    status: 'invited',
  },
]

const detailById: Record<string, OrganizationPurchasedCourseDetail> = {
  'digital-marketing': {
    ...organizationPurchasedCourses[0],
    orderId: 'MQ-1012',
    boughtOn: '1 Oct 2026',
    pricePerSeat: '15.000 KWD',
    learners: digitalMarketingLearners,
  },
}

function buildFallbackDetail(
  course: OrganizationPurchasedCourse,
): OrganizationPurchasedCourseDetail {
  const pool = digitalMarketingLearners
  const learners =
    course.status === 'awaiting_payment'
      ? []
      : pool.slice(0, Math.min(course.assigned, pool.length)).map((learner, index) => {
          if (index < course.done) {
            return { ...learner, id: `${course.id}-${learner.id}`, progress: 100, status: 'completed' as const }
          }
          if (index < course.done + Math.max(1, Math.floor(course.assigned / 3))) {
            return {
              ...learner,
              id: `${course.id}-${learner.id}`,
              progress: 40 + index * 8,
              status: 'in_progress' as const,
            }
          }
          return {
            ...learner,
            id: `${course.id}-${learner.id}`,
            progress: 0,
            status: index % 2 === 0 ? ('not_started' as const) : ('invited' as const),
          }
        })

  return {
    ...course,
    orderId: course.orderId ?? `MQ-${1000 + Number(course.id.replace(/\D/g, '') || 20)}`,
    boughtOn: '1 Oct 2026',
    pricePerSeat:
      course.id === 'whs'
        ? '12.000 KWD'
        : course.id === 'iso-9001'
          ? '18.000 KWD'
          : course.id === 'pm'
            ? '20.000 KWD'
            : '14.000 KWD',
    learners,
  }
}

export function getOrganizationPurchasedCourseDetail(
  courseId: string,
): OrganizationPurchasedCourseDetail | null {
  const curated = detailById[courseId]
  if (curated) return curated
  const course = organizationPurchasedCourses.find((item) => item.id === courseId)
  if (!course) return null
  return buildFallbackDetail(course)
}

export function organizationPurchasedPath(courseId: string) {
  return `/organization/purchased/${courseId}`
}
