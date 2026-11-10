import { employeeCourseLesson, type EmployeeQaQuestion } from './employeeCourses'

export type CurriculumItemStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type CurriculumItemType = 'video' | 'quiz' | 'assignment'

export type CurriculumQuizQuestion = {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
}

export type CurriculumAssignment = {
  brief: string
  dueLabel: string
  points: number
  accept: string
}

export type CurriculumVideo = {
  videoId: string
  durationLabel: string
  overview: string
  chapters: { id: string; time: number; label: string; title: string }[]
  transcript: { id: string; time: number; label: string; text: string }[]
  resources: { id: string; title: string; size: string }[]
  questions: EmployeeQaQuestion[]
}

export type CurriculumItem = {
  id: string
  type: CurriculumItemType
  title: string
  durationLabel: string
  status: CurriculumItemStatus
  video?: CurriculumVideo
  quiz?: {
    passScore: number
    questions: CurriculumQuizQuestion[]
  }
  assignment?: CurriculumAssignment
}

export type CurriculumModule = {
  id: string
  title: string
  summary: string
  status: CurriculumItemStatus
  items: CurriculumItem[]
}

export type EmployeeCourseCurriculum = {
  courseId: string
  description: string
  modules: CurriculumModule[]
}

const sharedVideoBase: Omit<CurriculumVideo, 'overview'> = {
  videoId: 'LiPNy_WyCTU',
  durationLabel: '12–18 min',
  chapters: employeeCourseLesson.chapters,
  transcript: employeeCourseLesson.transcript,
  resources: employeeCourseLesson.resources,
  questions: employeeCourseLesson.questions,
}

function videoItem(
  id: string,
  title: string,
  overview: string,
  status: CurriculumItemStatus,
  durationLabel = '14 min',
): CurriculumItem {
  return {
    id,
    type: 'video',
    title,
    durationLabel,
    status,
    video: {
      ...sharedVideoBase,
      durationLabel,
      overview,
    },
  }
}

function quizItem(
  id: string,
  title: string,
  status: CurriculumItemStatus,
  questions: CurriculumQuizQuestion[],
): CurriculumItem {
  return {
    id,
    type: 'quiz',
    title,
    durationLabel: '10 min',
    status,
    quiz: { passScore: 70, questions },
  }
}

function assignmentItem(
  id: string,
  title: string,
  status: CurriculumItemStatus,
  assignment: CurriculumAssignment,
): CurriculumItem {
  return {
    id,
    type: 'assignment',
    title,
    durationLabel: assignment.dueLabel,
    status,
    assignment,
  }
}

const isoCurriculum: EmployeeCourseCurriculum = {
  courseId: 'iso-9001',
  description:
    'Build practical ISO 9001 awareness — from QMS foundations and leadership through documented information, operations, and continual improvement — with videos, quizzes, and workplace assignments.',
  modules: [
    {
      id: 'm1',
      title: 'Module 01 · QMS foundations',
      summary: 'Context, principles, and why ISO 9001 matters.',
      status: 'completed',
      items: [
        videoItem(
          'iso-m1-v1',
          'What is a quality management system?',
          'Understand the purpose of a QMS and how ISO 9001 frames quality as a managed process.',
          'completed',
          '11 min',
        ),
        videoItem(
          'iso-m1-v2',
          'Seven quality management principles',
          'Walk through customer focus, leadership, engagement, process approach, improvement, evidence, and relationship management.',
          'completed',
          '16 min',
        ),
        quizItem('iso-m1-q1', 'Module 01 knowledge check', 'completed', [
          {
            id: 'qq1',
            prompt: 'A QMS is primarily designed to…',
            options: [
              'Replace all department SOPs',
              'Provide a structured way to meet customer and regulatory requirements',
              'Automate every approval',
              'Remove the need for audits',
            ],
            answerIndex: 1,
          },
          {
            id: 'qq2',
            prompt: 'Which principle emphasizes decisions based on data?',
            options: [
              'Customer focus',
              'Evidence-based decision making',
              'Relationship management',
              'Engagement of people',
            ],
            answerIndex: 1,
          },
        ]),
      ],
    },
    {
      id: 'm2',
      title: 'Module 02 · Context & leadership',
      summary: 'Interested parties, scope, and leadership commitment.',
      status: 'completed',
      items: [
        videoItem(
          'iso-m2-v1',
          'Understanding organizational context',
          'Identify internal and external issues that affect the QMS scope.',
          'completed',
          '13 min',
        ),
        assignmentItem('iso-m2-a1', 'Map interested parties', 'completed', {
          brief:
            'List at least 5 interested parties for your team and note their quality-related needs or expectations.',
          dueLabel: 'Submitted',
          points: 20,
          accept: 'PDF or DOCX',
        }),
        quizItem('iso-m2-q1', 'Leadership & commitment quiz', 'completed', [
          {
            id: 'qq3',
            prompt: 'Top management must…',
            options: [
              'Delegate all QMS ownership',
              'Demonstrate leadership and commitment to the QMS',
              'Only review certificates annually',
              'Approve every work instruction personally',
            ],
            answerIndex: 1,
          },
        ]),
      ],
    },
    {
      id: 'm3',
      title: 'Module 03 · Planning & risks',
      summary: 'Risks, opportunities, and quality objectives.',
      status: 'completed',
      items: [
        videoItem(
          'iso-m3-v1',
          'Risk-based thinking in practice',
          'Apply risk and opportunity thinking without over-documenting.',
          'completed',
          '15 min',
        ),
        quizItem('iso-m3-q1', 'Planning checkpoint', 'completed', [
          {
            id: 'qq4',
            prompt: 'Quality objectives should be…',
            options: [
              'Vague motivational statements',
              'Measurable and consistent with the quality policy',
              'Hidden from employees',
              'Only financial KPIs',
            ],
            answerIndex: 1,
          },
        ]),
      ],
    },
    {
      id: 'm4',
      title: 'Module 04 · Documented information',
      summary: 'Procedures, work instructions, and control of documents.',
      status: 'in_progress',
      items: [
        videoItem(
          'iso-m4-v1',
          'Documented information requirements',
          'Learn what ISO expects for creating and updating documented information.',
          'completed',
          '12 min',
        ),
        videoItem(
          'iso-m4-v2',
          'Implementing QMS procedures',
          employeeCourseLesson.overviewBody,
          'in_progress',
          '1h 28m',
        ),
        assignmentItem('iso-m4-a1', 'Draft a controlled procedure outline', 'available', {
          brief:
            'Create a one-page outline for a procedure in your area: purpose, scope, responsibilities, key steps, and related records.',
          dueLabel: 'Due 20 Nov',
          points: 30,
          accept: 'PDF, DOCX, or PPTX',
        }),
        quizItem('iso-m4-q1', 'Document control quiz', 'locked', [
          {
            id: 'qq5',
            prompt: 'Version control is required for…',
            options: [
              'Procedures only',
              'Forms and procedures that affect how work is performed',
              'Emails only',
              'Marketing flyers',
            ],
            answerIndex: 1,
          },
          {
            id: 'qq6',
            prompt: 'SharePoint can store controlled documents when…',
            options: [
              'Anyone can edit freely',
              'Permissions, naming, and current-version rules are documented',
              'Files are never versioned',
              'Print copies are preferred',
            ],
            answerIndex: 1,
          },
        ]),
      ],
    },
    {
      id: 'm5',
      title: 'Module 05 · Operations & support',
      summary: 'Competence, awareness, and operational control.',
      status: 'locked',
      items: [
        videoItem(
          'iso-m5-v1',
          'Competence and awareness',
          'Ensure people are competent for QMS-related roles and aware of quality policy impacts.',
          'locked',
          '14 min',
        ),
        assignmentItem('iso-m5-a1', 'Training needs snapshot', 'locked', {
          brief: 'Identify two roles that need documented competence criteria and propose how you would verify them.',
          dueLabel: 'Due after Module 04',
          points: 25,
          accept: 'PDF or DOCX',
        }),
        quizItem('iso-m5-q1', 'Support processes quiz', 'locked', [
          {
            id: 'qq7',
            prompt: 'Competence evidence can include…',
            options: [
              'Training records and on-the-job assessments',
              'Only job titles',
              'Only years of experience',
              'Social media activity',
            ],
            answerIndex: 0,
          },
        ]),
      ],
    },
    {
      id: 'm6',
      title: 'Module 06 · Performance & improvement',
      summary: 'Monitoring, internal audit, and continual improvement.',
      status: 'locked',
      items: [
        videoItem(
          'iso-m6-v1',
          'Monitoring, measurement & analysis',
          'Choose meaningful indicators and act on results.',
          'locked',
          '17 min',
        ),
        quizItem('iso-m6-q1', 'Final module quiz', 'locked', [
          {
            id: 'qq8',
            prompt: 'Continual improvement should be driven by…',
            options: [
              'Random changes',
              'Performance evaluation and corrective action',
              'Certificate expiry only',
              'Customer complaints alone',
            ],
            answerIndex: 1,
          },
        ]),
        assignmentItem('iso-m6-a1', 'Improvement action plan', 'locked', {
          brief: 'Propose one improvement action with owner, measure of success, and target date.',
          dueLabel: 'Due before certificate',
          points: 40,
          accept: 'PDF or DOCX',
        }),
      ],
    },
  ],
}

function buildGenericCurriculum(
  courseId: string,
  theme: { m1: string; m2: string; m3: string; m4: string; description: string },
): EmployeeCourseCurriculum {
  return {
    courseId,
    description: theme.description,
    modules: [
      {
        id: `${courseId}-m1`,
        title: `Module 01 · ${theme.m1}`,
        summary: 'Core concepts and expectations.',
        status: courseId === 'aml' ? 'completed' : 'in_progress',
        items: [
          videoItem(
            `${courseId}-m1-v1`,
            `Introduction to ${theme.m1}`,
            `Overview of ${theme.m1} and how it applies in your workplace.`,
            courseId === 'digital-marketing' ? 'available' : 'completed',
          ),
          videoItem(
            `${courseId}-m1-v2`,
            'Key responsibilities',
            'Roles, ownership, and day-to-day expectations for learners.',
            courseId === 'digital-marketing' ? 'locked' : 'in_progress',
          ),
          quizItem(`${courseId}-m1-q1`, 'Module 01 quiz', courseId === 'digital-marketing' ? 'locked' : 'available', [
            {
              id: `${courseId}-qq1`,
              prompt: 'The main goal of this module is to…',
              options: [
                'Skip compliance entirely',
                'Build shared understanding of core requirements',
                'Replace manager approvals',
                'Avoid documentation',
              ],
              answerIndex: 1,
            },
          ]),
        ],
      },
      {
        id: `${courseId}-m2`,
        title: `Module 02 · ${theme.m2}`,
        summary: 'Practical application and workplace scenarios.',
        status: courseId === 'aml' ? 'completed' : 'locked',
        items: [
          videoItem(
            `${courseId}-m2-v1`,
            `${theme.m2} in practice`,
            `Apply ${theme.m2} with realistic workplace examples.`,
            courseId === 'aml' ? 'completed' : 'locked',
          ),
          assignmentItem(`${courseId}-m2-a1`, 'Workplace scenario write-up', courseId === 'aml' ? 'completed' : 'locked', {
            brief: `Describe one workplace scenario related to ${theme.m2} and the correct response.`,
            dueLabel: courseId === 'aml' ? 'Submitted' : 'Unlocks after Module 01',
            points: 25,
            accept: 'PDF or DOCX',
          }),
          quizItem(`${courseId}-m2-q1`, 'Scenario quiz', courseId === 'aml' ? 'completed' : 'locked', [
            {
              id: `${courseId}-qq2`,
              prompt: 'When unsure about a requirement you should…',
              options: [
                'Ignore it',
                'Escalate using the documented process',
                'Invent a new policy',
                'Wait for the next audit only',
              ],
              answerIndex: 1,
            },
          ]),
        ],
      },
      {
        id: `${courseId}-m3`,
        title: `Module 03 · ${theme.m3}`,
        summary: 'Controls, records, and reporting.',
        status: courseId === 'aml' ? 'completed' : 'locked',
        items: [
          videoItem(
            `${courseId}-m3-v1`,
            `Controls for ${theme.m3}`,
            `Review the controls and records expected for ${theme.m3}.`,
            courseId === 'aml' ? 'completed' : 'locked',
          ),
          quizItem(`${courseId}-m3-q1`, 'Controls check', courseId === 'aml' ? 'completed' : 'locked', [
            {
              id: `${courseId}-qq3`,
              prompt: 'Records are kept to…',
              options: [
                'Fill folders',
                'Provide evidence that processes were followed',
                'Replace training',
                'Avoid leadership reviews',
              ],
              answerIndex: 1,
            },
          ]),
        ],
      },
      {
        id: `${courseId}-m4`,
        title: `Module 04 · ${theme.m4}`,
        summary: 'Assessment and next steps.',
        status: courseId === 'aml' ? 'completed' : 'locked',
        items: [
          videoItem(
            `${courseId}-m4-v1`,
            'Wrap-up and next steps',
            `Summarize ${theme.m4} and how to keep skills current.`,
            courseId === 'aml' ? 'completed' : 'locked',
          ),
          assignmentItem(`${courseId}-m4-a1`, 'Final reflection', courseId === 'aml' ? 'completed' : 'locked', {
            brief: 'Write a short reflection on one practice you will change after this course.',
            dueLabel: courseId === 'aml' ? 'Submitted' : 'Unlocks after Module 03',
            points: 30,
            accept: 'PDF or DOCX',
          }),
          quizItem(`${courseId}-m4-q1`, 'Final quiz', courseId === 'aml' ? 'completed' : 'locked', [
            {
              id: `${courseId}-qq4`,
              prompt: 'After completing the course you should…',
              options: [
                'Stop applying the controls',
                'Apply the controls and keep evidence up to date',
                'Delete all records',
                'Wait for a reminder email only',
              ],
              answerIndex: 1,
            },
          ]),
        ],
      },
    ],
  }
}

export const employeeCourseCurricula: Record<string, EmployeeCourseCurriculum> = {
  'iso-9001': isoCurriculum,
  whs: buildGenericCurriculum('whs', {
    m1: 'Safety basics',
    m2: 'Hazard control',
    m3: 'Incident reporting',
    m4: 'Safe workplace habits',
    description:
      'Learn workplace health and safety essentials — hazard spotting, controls, incident reporting, and safe habits — through short videos, quizzes, and practical assignments.',
  }),
  'digital-marketing': buildGenericCurriculum('digital-marketing', {
    m1: 'Marketing fundamentals',
    m2: 'Channels & content',
    m3: 'Measurement',
    m4: 'Campaign planning',
    description:
      'A practical path through digital marketing fundamentals, channels, measurement, and campaign planning with videos, quizzes, and hands-on assignments.',
  }),
  aml: buildGenericCurriculum('aml', {
    m1: 'AML essentials',
    m2: 'Red flags',
    m3: 'Reporting duties',
    m4: 'Ongoing vigilance',
    description:
      'Understand anti-money laundering essentials, red flags, reporting duties, and ongoing vigilance with structured modules, quizzes, and assignments.',
  }),
}

export function getEmployeeCourseCurriculum(courseId: string) {
  return (
    employeeCourseCurricula[courseId] ??
    buildGenericCurriculum(courseId, {
      m1: 'Foundations',
      m2: 'Application',
      m3: 'Controls',
      m4: 'Assessment',
      description: 'A structured learning path with modules, videos, quizzes, and assignments.',
    })
  )
}

export function flattenCurriculumItems(curriculum: EmployeeCourseCurriculum) {
  return curriculum.modules.flatMap((module) =>
    module.items.map((item) => ({ module, item })),
  )
}

export function findCurriculumItem(curriculum: EmployeeCourseCurriculum, itemId: string) {
  for (const module of curriculum.modules) {
    const item = module.items.find((entry) => entry.id === itemId)
    if (item) return { module, item }
  }
  return null
}

export function getDefaultCurriculumItemId(curriculum: EmployeeCourseCurriculum) {
  const flat = flattenCurriculumItems(curriculum)
  const preferred =
    flat.find((entry) => entry.item.status === 'in_progress') ??
    flat.find((entry) => entry.item.status === 'available') ??
    flat.find((entry) => entry.item.status !== 'locked') ??
    flat[0]
  return preferred?.item.id ?? ''
}

export const employeeCourseCurriculumPage = {
  curriculum: 'Course Structure',
  curriculumHint: 'Modules run in order; each quiz unlocks the next module.',
  expandAll: 'Expand All',
  collapseAll: 'Collapse All',
  courseDescription: 'About this course',
  modulesCount: (count: number) => `${count} modules`,
  itemsCount: (count: number) => `${count} items`,
  type: {
    video: 'Video',
    quiz: 'Quiz',
    assignment: 'Assignment',
  },
  status: {
    locked: 'Locked',
    available: 'Available',
    in_progress: 'In progress',
    completed: 'Completed',
  },
  lockedHint: 'Complete the previous item to unlock this.',
  markComplete: 'Mark as complete',
  markedCompleteToast: 'Item marked complete.',
  next: 'Next',
  previous: 'Previous',
  assignmentsTab: 'Assignments',
  quizzesTab: 'Quizzes',
  assignmentsEmpty: 'No assignments in this course.',
  quizzesEmpty: 'No quizzes in this course.',
  openItem: 'Open',
  quizTitle: 'Knowledge check',
  quizPass: (score: number) => `Pass mark ${score}%`,
  quizSubmit: 'Submit quiz',
  quizRetry: 'Try again',
  quizResult: (score: number, passed: boolean) =>
    passed ? `You scored ${score}% — passed.` : `You scored ${score}% — try again.`,
  quizRequired: 'Answer every question before submitting.',
  assignmentTitle: 'Assignment',
  assignmentPoints: (points: number) => `${points} points`,
  assignmentDue: 'Due',
  assignmentAccept: 'Accepted formats',
  assignmentUpload: 'Choose file',
  assignmentSubmit: 'Submit assignment',
  assignmentSubmittedToast: 'Assignment submitted for review.',
  assignmentNote: 'Add a short note for your reviewer (optional)',
  assignmentNotePlaceholder: 'Anything your reviewer should know…',
} as const
