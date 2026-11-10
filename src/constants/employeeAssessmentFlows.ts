import { employeeAssessments } from './employeeAssessments'
import { paths } from '@/routes/paths'

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  topicId: string
}

export type QuizTopicReview = {
  id: string
  title: string
  lessonLabel: string
  correct: number
  total: number
  courseId: string
}

export type QuizQuestionReview = {
  id: string
  prompt: string
  correct: boolean
  marks: number
}

export type QuizResultDetail = {
  assessmentId: string
  percent: number
  passed: boolean
  score: number
  totalQuestions: number
  passingPercent: number
  passingNeeded: number
  timeTaken: string
  timeLimit: string
  attempt: number
  maxAttempts: number
  attemptsLeft: number
  submittedAt: string
  retakeHint: string
  topics: QuizTopicReview[]
  questions: QuizQuestionReview[]
  revealAnswers: boolean
}

export type AssignmentResultDetail = {
  assessmentId: string
  submittedAt: string
  fileName: string
  note: string
  statusLabel: string
  grade: number | null
  maxGrade: number
  feedback: string | null
  rubric: { label: string; score: string }[]
}

export const employeeQuizTakePage = {
  back: 'Back to My Assessments',
  progress: (current: number, total: number) => `Question ${current} of ${total}`,
  previous: 'Previous',
  next: 'Next',
  submit: 'Submit quiz',
  required: 'Select an answer to continue.',
  timeLeft: 'Time left',
  course: 'Course',
} as const

export const employeeAssignmentSubmitPage = {
  back: 'Back to My Assessments',
  title: 'Submit assignment',
  brief: 'Assignment brief',
  upload: 'Upload your file',
  uploadHint: 'PDF, DOCX, or PPTX up to 20 MB',
  chooseFile: 'Choose file',
  note: 'Note for reviewer (optional)',
  notePlaceholder: 'Anything your reviewer should know…',
  cancel: 'Cancel',
  submit: 'Submit assignment',
  required: 'Please choose a file before submitting.',
  relatedCourse: 'Related course',
} as const

export const employeeAssessmentResultPage = {
  back: 'Back to My Assessments',
  notPassed: 'Not passed',
  passed: 'Passed',
  attempt: (current: number, max: number) => `Attempt ${current} of ${max}`,
  score: 'Score',
  passingScore: 'Passing score',
  passingScoreValue: (percent: number, needed: number, total: number) =>
    `${percent}% (${needed} of ${total} needed)`,
  timeTaken: 'Time taken',
  timeTakenValue: (taken: string, limit: string) => `${taken} (of ${limit})`,
  attemptsLeft: 'Attempts left',
  attemptsLeftValue: (left: number) => `${left} (Highest score counts)`,
  reviewLessons: 'Review lessons',
  retakeQuiz: 'Retake quiz',
  topicsTitle: 'Topics to review',
  questionsTitle: 'Question review',
  reviewLesson: 'Review lesson →',
  correct: 'Correct',
  incorrect: 'Incorrect',
  markGained: '+1 mark',
  markZero: '0 marks',
  lockNote:
    'Correct answers are shown once you pass or use all attempts, so retakes stay fair.',
  ofCorrect: (correct: number, total: number) => `${correct} of ${total} correct`,
  assignmentTitle: 'Assignment submission',
  assignmentSubmitted: 'Submitted',
  assignmentPending: 'Awaiting review',
  file: 'Submitted file',
  note: 'Your note',
  grade: 'Grade',
  feedback: 'Feedback',
  rubric: 'Rubric',
  openCourse: 'Open course',
  noGrade: 'Pending',
} as const

export const employeeQuizBanks: Record<string, QuizQuestion[]> = {
  'q-whs-m1': [
    {
      id: 'qw1',
      prompt: 'What is the first step when you discover a workplace hazard?',
      options: [
        'Ignore it if nobody is nearby',
        'Report it using the documented process',
        'Wait for the next audit',
        'Only tell a coworker informally',
      ],
      answerIndex: 1,
      topicId: 't1',
    },
    {
      id: 'qw2',
      prompt: 'Which extinguisher is typically used for electrical fires?',
      options: ['Water', 'Foam', 'CO₂', 'Wet chemical only'],
      answerIndex: 2,
      topicId: 't2',
    },
    {
      id: 'qw3',
      prompt: 'PPE should be…',
      options: [
        'Optional if you feel experienced',
        'Selected for the task and worn correctly',
        'Shared without cleaning',
        'Only used during inspections',
      ],
      answerIndex: 1,
      topicId: 't3',
    },
    {
      id: 'qw4',
      prompt: 'A near miss should be…',
      options: [
        'Ignored if no injury occurred',
        'Reported so controls can improve',
        'Discussed only after a real incident',
        'Deleted from records',
      ],
      answerIndex: 1,
      topicId: 't1',
    },
    {
      id: 'qw5',
      prompt: 'Emergency exits must remain…',
      options: ['Locked after hours', 'Clear and accessible', 'Used for storage', 'Blocked by carts'],
      answerIndex: 1,
      topicId: 't4',
    },
  ],
  'q-iso-m4': [
    {
      id: 'qi1',
      prompt: 'Version control is required for…',
      options: [
        'Procedures only',
        'Forms and procedures that affect how work is performed',
        'Emails only',
        'Marketing flyers',
      ],
      answerIndex: 1,
      topicId: 't-doc',
    },
    {
      id: 'qi2',
      prompt: 'SharePoint can store controlled documents when…',
      options: [
        'Anyone can edit freely',
        'Permissions, naming, and current-version rules are documented',
        'Files are never versioned',
        'Print copies are preferred',
      ],
      answerIndex: 1,
      topicId: 't-doc',
    },
    {
      id: 'qi3',
      prompt: 'A work instruction typically…',
      options: [
        'Replaces the quality policy',
        'Shows how a role carries out a procedure step by step',
        'Is never controlled',
        'Is only for auditors',
      ],
      answerIndex: 1,
      topicId: 't-proc',
    },
  ],
  'q-iso-m1': [
    {
      id: 'q1a',
      prompt: 'A QMS is primarily designed to…',
      options: [
        'Replace all department SOPs',
        'Provide a structured way to meet customer and regulatory requirements',
        'Automate every approval',
        'Remove the need for audits',
      ],
      answerIndex: 1,
      topicId: 't-qms',
    },
    {
      id: 'q1b',
      prompt: 'Which principle emphasizes decisions based on data?',
      options: [
        'Customer focus',
        'Evidence-based decision making',
        'Relationship management',
        'Engagement of people',
      ],
      answerIndex: 1,
      topicId: 't-qms',
    },
  ],
  'q-iso-m3': [
    {
      id: 'q3a',
      prompt: 'Quality objectives should be…',
      options: [
        'Vague motivational statements',
        'Measurable and consistent with the quality policy',
        'Hidden from employees',
        'Only financial KPIs',
      ],
      answerIndex: 1,
      topicId: 't-plan',
    },
    {
      id: 'q3b',
      prompt: 'Risk-based thinking means…',
      options: [
        'Ignoring small risks',
        'Considering risks and opportunities in planning',
        'Only documenting after incidents',
        'Avoiding all change',
      ],
      answerIndex: 1,
      topicId: 't-plan',
    },
  ],
  'q-aml-m2': [
    {
      id: 'qa1',
      prompt: 'When unsure about a requirement you should…',
      options: [
        'Ignore it',
        'Escalate using the documented process',
        'Invent a new policy',
        'Wait for the next audit only',
      ],
      answerIndex: 1,
      topicId: 't-aml',
    },
  ],
  'q-dm-m1': [
    {
      id: 'qd1',
      prompt: 'The main goal of this module is to…',
      options: [
        'Skip compliance entirely',
        'Build shared understanding of core requirements',
        'Replace manager approvals',
        'Avoid documentation',
      ],
      answerIndex: 1,
      topicId: 't-mkt',
    },
  ],
  'q-whs-m2': [
    {
      id: 'qh1',
      prompt: 'Hazard controls should prioritize…',
      options: [
        'PPE first always',
        'Elimination and engineering controls before PPE',
        'Ignoring low-likelihood risks',
        'Verbal warnings only',
      ],
      answerIndex: 1,
      topicId: 't-haz',
    },
  ],
}

export const employeeQuizResults: Record<string, QuizResultDetail> = {
  'q-whs-m1': {
    assessmentId: 'q-whs-m1',
    percent: 60,
    passed: false,
    score: 9,
    totalQuestions: 15,
    passingPercent: 70,
    passingNeeded: 11,
    timeTaken: '17m 40s',
    timeLimit: '20 min',
    attempt: 2,
    maxAttempts: 3,
    attemptsLeft: 1,
    submittedAt: '2 Nov 2026, 4:18 PM',
    retakeHint:
      'You can retake this quiz. You need 2 more correct answers to pass. Review the topics below first — your highest score is the one that counts.',
    topics: [
      {
        id: 't2',
        title: 'Fire extinguisher types',
        lessonLabel: 'Module 03 · Lesson 2',
        correct: 0,
        total: 2,
        courseId: 'whs',
      },
      {
        id: 't4',
        title: 'Emergency exit access',
        lessonLabel: 'Module 02 · Lesson 4',
        correct: 1,
        total: 3,
        courseId: 'whs',
      },
      {
        id: 't3',
        title: 'PPE for the task',
        lessonLabel: 'Module 01 · Lesson 3',
        correct: 1,
        total: 2,
        courseId: 'whs',
      },
    ],
    questions: [
      { id: '1', prompt: 'First action when discovering a hazard', correct: true, marks: 1 },
      { id: '2', prompt: 'Extinguisher for electrical fires', correct: false, marks: 0 },
      { id: '3', prompt: 'Correct PPE selection', correct: true, marks: 1 },
      { id: '4', prompt: 'Reporting a near miss', correct: true, marks: 1 },
      { id: '5', prompt: 'Keeping emergency exits clear', correct: false, marks: 0 },
      { id: '6', prompt: 'Incident escalation path', correct: true, marks: 1 },
      { id: '7', prompt: 'Safe lifting technique', correct: false, marks: 0 },
      { id: '8', prompt: 'Chemical storage basics', correct: true, marks: 1 },
      { id: '9', prompt: 'Spill response first step', correct: false, marks: 0 },
      { id: '10', prompt: 'Visitor safety induction', correct: true, marks: 1 },
      { id: '11', prompt: 'Lockout / tagout awareness', correct: false, marks: 0 },
      { id: '12', prompt: 'Fire assembly point rules', correct: true, marks: 1 },
      { id: '13', prompt: 'Reporting damaged PPE', correct: true, marks: 1 },
      { id: '14', prompt: 'Manual handling assessment', correct: false, marks: 0 },
      { id: '15', prompt: 'First-aid kit location', correct: true, marks: 1 },
    ],
    revealAnswers: false,
  },
  'q-iso-m3': {
    assessmentId: 'q-iso-m3',
    percent: 55,
    passed: false,
    score: 55,
    totalQuestions: 100,
    passingPercent: 70,
    passingNeeded: 70,
    timeTaken: '8m 12s',
    timeLimit: '10 min',
    attempt: 1,
    maxAttempts: 3,
    attemptsLeft: 2,
    submittedAt: '10 Nov 2026, 11:05 AM',
    retakeHint:
      'You can retake this quiz. Review measurable objectives, then try again — your highest score counts.',
    topics: [
      {
        id: 't-plan',
        title: 'Quality objectives',
        lessonLabel: 'Module 03 · Lesson 1',
        correct: 0,
        total: 2,
        courseId: 'iso-9001',
      },
    ],
    questions: [
      { id: '1', prompt: 'Quality objectives should be measurable', correct: false, marks: 0 },
      { id: '2', prompt: 'Risk-based thinking in planning', correct: true, marks: 1 },
    ],
    revealAnswers: false,
  },
  'q-iso-m1': {
    assessmentId: 'q-iso-m1',
    percent: 90,
    passed: true,
    score: 90,
    totalQuestions: 100,
    passingPercent: 70,
    passingNeeded: 70,
    timeTaken: '6m 20s',
    timeLimit: '10 min',
    attempt: 1,
    maxAttempts: 3,
    attemptsLeft: 2,
    submittedAt: '2 Nov 2026, 10:12 AM',
    retakeHint: 'You already passed. You may retake if you want a higher score.',
    topics: [],
    questions: [
      { id: '1', prompt: 'Purpose of a QMS', correct: true, marks: 1 },
      { id: '2', prompt: 'Evidence-based decision making', correct: true, marks: 1 },
    ],
    revealAnswers: true,
  },
}

export const employeeAssignmentResults: Record<string, AssignmentResultDetail> = {
  'a-iso-m2': {
    assessmentId: 'a-iso-m2',
    submittedAt: '28 Oct 2026, 3:40 PM',
    fileName: 'interested-parties-map.docx',
    note: 'Included HR, Operations, Quality, customers, and regulators.',
    statusLabel: 'Graded',
    grade: 85,
    maxGrade: 100,
    feedback: 'Good coverage of internal parties. Add one external regulator next time.',
    rubric: [
      { label: 'Completeness', score: '18/20' },
      { label: 'Clarity', score: '17/20' },
      { label: 'Relevance', score: '25/30' },
      { label: 'Presentation', score: '25/30' },
    ],
  },
  'a-aml-m4': {
    assessmentId: 'a-aml-m4',
    submittedAt: '20 Oct 2026, 1:15 PM',
    fileName: 'aml-reflection.pdf',
    note: 'Focused on escalation documentation.',
    statusLabel: 'Graded',
    grade: 88,
    maxGrade: 100,
    feedback: 'Clear action plan. Share with your compliance lead.',
    rubric: [
      { label: 'Insight', score: '22/25' },
      { label: 'Actionability', score: '23/25' },
      { label: 'Clarity', score: '20/25' },
      { label: 'Alignment', score: '23/25' },
    ],
  },
  'a-whs-m2': {
    assessmentId: 'a-whs-m2',
    submittedAt: '',
    fileName: '',
    note: '',
    statusLabel: 'Not submitted',
    grade: null,
    maxGrade: 100,
    feedback: null,
    rubric: [],
  },
}

export function getQuizBank(assessmentId: string) {
  return (
    employeeQuizBanks[assessmentId] ?? [
      {
        id: 'fallback-1',
        prompt: 'Select the best answer for this assessment.',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answerIndex: 1,
        topicId: 'general',
      },
    ]
  )
}

export function getQuizResult(assessmentId: string) {
  return employeeQuizResults[assessmentId] ?? null
}

export function getAssignmentResult(assessmentId: string) {
  return employeeAssignmentResults[assessmentId] ?? null
}

export function buildQuizResultFromAnswers(
  assessmentId: string,
  answers: Record<string, number>,
) {
  const bank = getQuizBank(assessmentId)
  const questions: QuizQuestionReview[] = bank.map((question) => {
    const correct = answers[question.id] === question.answerIndex
    return {
      id: question.id,
      prompt: question.prompt,
      correct,
      marks: correct ? 1 : 0,
    }
  })
  const score = questions.filter((item) => item.correct).length
  const total = bank.length
  const percent = Math.round((score / Math.max(total, 1)) * 100)
  const passingPercent = 70
  const passingNeeded = Math.ceil((passingPercent / 100) * total)
  const passed = percent >= passingPercent
  const assessment = employeeAssessments.find((item) => item.id === assessmentId)
  const attemptsUsed = Math.min((assessment?.attempts ?? 0) + 1, assessment?.maxAttempts ?? 3)
  const maxAttempts = assessment?.maxAttempts ?? 3

  return {
    assessmentId,
    percent,
    passed,
    score,
    totalQuestions: total,
    passingPercent,
    passingNeeded,
    timeTaken: '12m 05s',
    timeLimit: assessment?.durationLabel ?? '20 min',
    attempt: attemptsUsed,
    maxAttempts,
    attemptsLeft: Math.max(0, maxAttempts - attemptsUsed),
    submittedAt: 'Just now',
    retakeHint: passed
      ? 'You passed this quiz. You may retake if you want a higher score.'
      : `You can retake this quiz. You need ${Math.max(0, passingNeeded - score)} more correct answers to pass. Review the topics below first — your highest score is the one that counts.`,
    topics: [],
    questions,
    revealAnswers: passed || attemptsUsed >= maxAttempts,
  } satisfies QuizResultDetail
}

export function employeeAssessmentQuizPath(assessmentId: string) {
  return `${paths.employee.assessments}/${assessmentId}/quiz`
}

export function employeeAssessmentSubmitPath(assessmentId: string) {
  return `${paths.employee.assessments}/${assessmentId}/submit`
}

export function employeeAssessmentResultPath(assessmentId: string) {
  return `${paths.employee.assessments}/${assessmentId}/result`
}
