import {
  organizationEmployees,
  type EmployeeStatus,
  type OrganizationEmployee,
} from './organizationEmployees'

export type EmployeeCourseStatus = 'in_progress' | 'completed'
export type EmployeeAssessmentResult = 'passed' | 'not_yet' | 'failed'
export type EmployeeDetailTab =
  | 'overview'
  | 'courses'
  | 'assessments'
  | 'certificates'
  | 'activity'

export type OrganizationEmployeeDetail = {
  id: string
  name: string
  email: string
  initials: string
  status: EmployeeStatus
  jobTitle: string
  department: string
  employeeCode: string
  addedOn: string
  lastActive: string
  metrics: {
    courses: number
    completed: number
    avgProgress: number
    assessmentAvg: number | null
    certificates: number
    cpdHours: number
    rank: number
    rankOf: number
  }
  courses: Array<{
    id: string
    title: string
    progress: number
    status: EmployeeCourseStatus
    dueLabel: string
  }>
  assessments: Array<{
    id: string
    title: string
    bestScore: number | null
    attemptsUsed: number
    attemptsMax: number
    result: EmployeeAssessmentResult
  }>
  activity: {
    hoursThisWeek: number
    streakDays: number
    bars: number[]
  }
  interests: Array<{
    id: string
    label: string
    percent: number
  }>
  certificates: Array<{
    id: string
    title: string
    issuedOn: string
    expiresOn: string
  }>
  activityLog: Array<{
    id: string
    title: string
    detail: string
    time: string
  }>
}

export const organizationEmployeeDetailPage = {
  back: 'Back to employees',
  assignCourse: '+ Assign course',
  report: 'Report',
  deactivate: 'Deactivate',
  reactivate: 'Reactivate',
  resendInvitation: 'Resend invitation',
  addedPrefix: 'Added',
  lastActivePrefix: 'Last active',
  notFoundTitle: 'Employee not found',
  notFoundBody: 'This employee is not in your organization list.',
  metrics: {
    courses: 'Courses',
    completed: 'Completed',
    avgProgress: 'Avg progress',
    assessmentAvg: 'Assessment avg',
    certificates: 'Certificates',
    cpdHours: 'CPD hours',
    rank: 'Rank',
  },
  tabs: {
    overview: 'Overview',
    courses: 'Courses',
    assessments: 'Assessments',
    certificates: 'Certificates',
    activity: 'Activity',
  },
  coursesHeaders: ['Course', 'Progress', 'Status', 'Due'],
  assessmentsHeaders: ['Assessment', 'Best score', 'Attempts', 'Result'],
  courseStatus: {
    in_progress: 'In progress',
    completed: 'Completed',
  },
  assessmentResult: {
    passed: 'Passed',
    not_yet: 'Not yet',
    failed: 'Failed',
  },
  activityTitle: 'Learning activity',
  activitySubtitle: (hours: number, streak: number) =>
    `${hours} hours this week · ${streak}-day streak`,
  interestTitle: 'Learning interest',
  interestSubtitle: 'Share of learning time by category',
  certificatesTitle: 'Certificates',
  issuedPrefix: 'Issued',
  expiresPrefix: 'Expires',
  emptyCourses: 'No courses assigned yet.',
  emptyAssessments: 'No assessments yet.',
  emptyCertificates: 'No certificates yet.',
  emptyActivity: 'No recent activity.',
  assignTitle: 'Assign course',
  assignSubtitle: 'Choose courses to assign to this employee.',
  assignSubmit: 'Assign selected courses',
  assignRequired: 'Select at least one course.',
  assignSuccess: 'Courses assigned.',
  cancel: 'Cancel',
  confirm: 'Confirm',
  deactivateSuccess: 'Employee deactivated.',
  reactivateSuccess: 'Employee reactivated.',
  reportReady: 'Employee report downloaded.',
  resendSuccess: 'Invitation resent.',
} as const

const detailById: Record<string, OrganizationEmployeeDetail> = {
  e8: {
    id: 'e8',
    name: 'Ahmed Al-Mutawa',
    email: 'ahmed@abccorporation.com',
    initials: 'AM',
    status: 'active',
    jobTitle: 'Operations Executive',
    department: 'Operations',
    employeeCode: 'ABC-EMP-0024',
    addedOn: '10 Oct 2026',
    lastActive: 'today',
    metrics: {
      courses: 4,
      completed: 2,
      avgProgress: 74,
      assessmentAvg: 88,
      certificates: 2,
      cpdHours: 20,
      rank: 3,
      rankOf: 48,
    },
    courses: [
      {
        id: 'c1',
        title: 'ISO 9001:2015 Quality Awareness',
        progress: 65,
        status: 'in_progress',
        dueLabel: 'Due 15 Nov 2026',
      },
      {
        id: 'c2',
        title: 'Project Management Fundamentals',
        progress: 30,
        status: 'in_progress',
        dueLabel: 'Due 15 Dec 2026',
      },
      {
        id: 'c3',
        title: 'Digital Marketing Fundamentals',
        progress: 100,
        status: 'completed',
        dueLabel: 'Done 24 Oct',
      },
      {
        id: 'c4',
        title: 'Workplace Health & Safety',
        progress: 100,
        status: 'completed',
        dueLabel: 'Done 29 Oct',
      },
    ],
    assessments: [
      {
        id: 'a1',
        title: 'Final assessment — Digital Marketing',
        bestScore: 88,
        attemptsUsed: 1,
        attemptsMax: 3,
        result: 'passed',
      },
      {
        id: 'a2',
        title: 'Final assessment — Health & Safety',
        bestScore: 90,
        attemptsUsed: 1,
        attemptsMax: 3,
        result: 'passed',
      },
      {
        id: 'a3',
        title: 'Module quiz — ISO 9001',
        bestScore: 86,
        attemptsUsed: 2,
        attemptsMax: 3,
        result: 'passed',
      },
      {
        id: 'a4',
        title: 'Final assessment — ISO 9001',
        bestScore: null,
        attemptsUsed: 0,
        attemptsMax: 3,
        result: 'not_yet',
      },
    ],
    activity: {
      hoursThisWeek: 10,
      streakDays: 5,
      bars: [2.2, 4.1, 3.4, 5.8, 1.6, 6.5, 8.8],
    },
    interests: [
      { id: 'i1', label: 'Quality & compliance', percent: 40 },
      { id: 'i2', label: 'Health & safety', percent: 30 },
      { id: 'i3', label: 'Management', percent: 20 },
      { id: 'i4', label: 'Marketing', percent: 10 },
    ],
    certificates: [
      {
        id: 'cert1',
        title: 'Workplace Health & Safety',
        issuedOn: '29 Oct 2026',
        expiresOn: '29 Oct 2028',
      },
      {
        id: 'cert2',
        title: 'Digital Marketing Fundamentals',
        issuedOn: '24 Oct 2026',
        expiresOn: '24 Oct 2028',
      },
    ],
    activityLog: [
      {
        id: 'l1',
        title: 'Completed Workplace Health & Safety',
        detail: 'Certificate issued',
        time: '29 Oct 2026',
      },
      {
        id: 'l2',
        title: 'Passed Digital Marketing final assessment',
        detail: 'Score 88%',
        time: '24 Oct 2026',
      },
      {
        id: 'l3',
        title: 'Started Project Management Fundamentals',
        detail: 'Assigned by organization',
        time: '18 Oct 2026',
      },
      {
        id: 'l4',
        title: 'Joined MaqSkillz',
        detail: 'Invitation accepted',
        time: '10 Oct 2026',
      },
    ],
  },
}

const demoCoursePool = [
  'ISO 9001:2015 Quality Awareness',
  'Project Management Fundamentals',
  'Digital Marketing Fundamentals',
  'Workplace Health & Safety',
  'Leadership Essentials',
  'Customer Service Excellence',
  'Data Privacy & GDPR Basics',
  'Effective Communication at Work',
] as const

const demoInterestPool = [
  'Quality & compliance',
  'Health & safety',
  'Management',
  'Marketing',
  'Operations',
  'People & HR',
] as const

function buildFallbackDetail(employee: OrganizationEmployee): OrganizationEmployeeDetail {
  const courseCount =
    employee.courses > 0
      ? employee.courses
      : employee.status === 'invited'
        ? 2
        : Math.max(1, employee.certificates)
  const completed = Math.max(
    0,
    Math.min(
      courseCount,
      employee.certificates ||
        (employee.progress >= 100 ? courseCount : Math.floor(courseCount / 2)),
    ),
  )
  const certificateCount =
    employee.status === 'invited'
      ? 0
      : Math.max(employee.certificates, completed > 0 ? completed : 0)

  const courses = Array.from({ length: courseCount }, (_, index) => {
    const title = demoCoursePool[index % demoCoursePool.length]
    const isCompleted = index < completed || employee.progress >= 100
    const progress = isCompleted
      ? 100
      : Math.max(8, Math.min(95, employee.progress - index * 12 + (index % 3) * 5))
    return {
      id: `${employee.id}-c${index + 1}`,
      title,
      progress,
      status: (progress >= 100 ? 'completed' : 'in_progress') as EmployeeCourseStatus,
      dueLabel: progress >= 100 ? `Done ${12 + index} Oct` : `Due ${10 + index} Dec 2026`,
    }
  })

  const assessments = courses.flatMap((course, index) => {
    const items: OrganizationEmployeeDetail['assessments'] = [
      {
        id: `${employee.id}-a${index + 1}`,
        title: `Final assessment — ${course.title.split(' ').slice(0, 3).join(' ')}`,
        bestScore: course.progress >= 70 ? Math.min(98, 78 + index * 3) : null,
        attemptsUsed: course.progress >= 70 ? 1 + (index % 2) : 0,
        attemptsMax: 3,
        result:
          course.progress >= 70
            ? ('passed' as const)
            : course.progress > 0
              ? ('not_yet' as const)
              : ('not_yet' as const),
      },
    ]
    if (index % 2 === 0 && course.progress >= 40) {
      items.push({
        id: `${employee.id}-q${index + 1}`,
        title: `Module quiz — ${course.title.split(' ').slice(0, 2).join(' ')}`,
        bestScore: Math.min(96, 72 + index * 4),
        attemptsUsed: 1,
        attemptsMax: 3,
        result: 'passed',
      })
    }
    return items
  })

  const passedScores = assessments
    .filter((item) => item.result === 'passed' && item.bestScore != null)
    .map((item) => item.bestScore as number)
  const assessmentAvg =
    passedScores.length > 0
      ? Math.round(passedScores.reduce((sum, score) => sum + score, 0) / passedScores.length)
      : null

  const certificates = courses
    .filter((course) => course.status === 'completed')
    .slice(0, Math.max(certificateCount, 0))
    .map((course, index) => ({
      id: `${employee.id}-cert${index + 1}`,
      title: course.title,
      issuedOn: `${12 + index} Oct 2026`,
      expiresOn: `${12 + index} Oct 2028`,
    }))

  // Pad certificates if list count is higher than completed courses
  while (certificates.length < certificateCount) {
    const index = certificates.length
    const title = demoCoursePool[index % demoCoursePool.length]
    certificates.push({
      id: `${employee.id}-cert${index + 1}`,
      title,
      issuedOn: `${8 + index} Sep 2026`,
      expiresOn: `${8 + index} Sep 2028`,
    })
  }

  const active = employee.status === 'active'
  const interests = demoInterestPool.slice(0, 4).map((label, index) => {
    const weights = [40, 30, 20, 10]
    return {
      id: `${employee.id}-i${index + 1}`,
      label:
        employee.department === 'HR' && index === 0
          ? 'People & HR'
          : employee.department === 'Sales' && index === 0
            ? 'Marketing'
            : label,
      percent: weights[index] ?? 10,
    }
  })

  const activityLog: OrganizationEmployeeDetail['activityLog'] =
    employee.status === 'invited'
      ? [
          {
            id: `${employee.id}-l1`,
            title: 'Invitation sent',
            detail: employee.email,
            time: 'Pending acceptance',
          },
          {
            id: `${employee.id}-l2`,
            title: 'Employee record created',
            detail: employee.department,
            time: '01 Oct 2026',
          },
        ]
      : [
          ...certificates.slice(0, 2).map((cert, index) => ({
            id: `${employee.id}-l-cert${index + 1}`,
            title: `Earned certificate — ${cert.title}`,
            detail: `Issued ${cert.issuedOn}`,
            time: cert.issuedOn,
          })),
          ...assessments
            .filter((item) => item.result === 'passed')
            .slice(0, 2)
            .map((item, index) => ({
              id: `${employee.id}-l-a${index + 1}`,
              title: `Passed ${item.title}`,
              detail: `Score ${item.bestScore}%`,
              time: `${20 - index} Oct 2026`,
            })),
          {
            id: `${employee.id}-l-join`,
            title: 'Joined MaqSkillz',
            detail: 'Invitation accepted',
            time: '01 Oct 2026',
          },
        ]

  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    initials: employee.initials,
    status: employee.status,
    jobTitle: `${employee.department} Specialist`,
    department: employee.department,
    employeeCode: `ABC-EMP-${employee.id.replace(/\D/g, '').padStart(4, '0') || '0000'}`,
    addedOn: '01 Oct 2026',
    lastActive: employee.lastActive.toLowerCase(),
    metrics: {
      courses: Math.max(employee.courses, courses.length),
      completed: courses.filter((course) => course.status === 'completed').length,
      avgProgress: employee.progress,
      assessmentAvg,
      certificates: certificates.length,
      cpdHours: Math.max(employee.courses * 4, certificates.length * 5),
      rank: Math.max(1, Number(employee.id.replace(/\D/g, '')) || 12),
      rankOf: organizationEmployees.length,
    },
    courses,
    assessments,
    activity: {
      hoursThisWeek: active ? 6 + (Number(employee.id.replace(/\D/g, '')) % 5) : 0,
      streakDays: active ? 2 + (Number(employee.id.replace(/\D/g, '')) % 4) : 0,
      bars: active
        ? [1.4, 3.2, 2.1, 4.5, 1.8, 5.2, 7.1]
        : employee.status === 'deactivated'
          ? [0.4, 0, 0.2, 0, 0, 0, 0]
          : [0, 0, 0, 0, 0, 0, 0],
    },
    interests: courses.length > 0 ? interests : [],
    certificates,
    activityLog,
  }
}

export function getOrganizationEmployeeDetail(
  employeeId: string,
): OrganizationEmployeeDetail | null {
  const curated = detailById[employeeId]
  if (curated) return curated
  const employee = organizationEmployees.find((item) => item.id === employeeId)
  if (!employee) return null
  return buildFallbackDetail(employee)
}
