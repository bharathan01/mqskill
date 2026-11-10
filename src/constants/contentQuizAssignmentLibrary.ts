import type { AssessmentQuestion } from './contentAssessments'
import { createAssessmentQuestion } from './contentAssessments'

export type LibraryCourseRef = { id: string; title: string }
export type AssignmentDelivery = 'questions' | 'pdf'

export type ContentLibraryQuiz = {
  id: string
  title: string
  description: string
  passMark: number
  maxAttempts: number
  timeLimitMin: number
  shuffle: boolean
  questionCount: number
  questions: AssessmentQuestion[]
  status: 'draft' | 'ready'
  updated: string
  usedInCourses: LibraryCourseRef[]
}

export type ContentLibraryAssignment = {
  id: string
  title: string
  brief: string
  points: number
  dueDays: number
  accept: string
  /** Online questions or PDF question paper upload. */
  delivery: AssignmentDelivery
  questions: AssessmentQuestion[]
  pdfFileName: string
  pdfPreviewUrl: string
  status: 'draft' | 'ready'
  updated: string
  usedInCourses: LibraryCourseRef[]
}

export const contentQuizzesPage = {
  title: 'Quizzes',
  subtitle:
    'Build quizzes from the question bank or create questions here, then attach them to modules when you create a course.',
  create: 'Create quiz',
  editTitle: 'Edit quiz',
  searchPlaceholder: 'Search quizzes…',
  emptyTitle: 'No quizzes yet',
  emptyBody: 'Create a quiz with questions from the bank or add them on the spot.',
  columns: {
    title: 'Quiz',
    questions: 'Questions',
    pass: 'Pass mark',
    courses: 'Used in courses',
    status: 'Status',
    updated: 'Updated',
    actions: 'Actions',
  },
  unused: 'Not attached yet',
  status: { draft: 'Draft', ready: 'Ready' },
  fields: {
    title: 'Quiz title',
    description: 'Description',
    passMark: 'Pass mark (%)',
    attempts: 'Max attempts',
    timeLimit: 'Time limit (minutes, 0 = none)',
    shuffle: 'Shuffle question order',
  },
  questionsTitle: 'Questions',
  save: 'Save quiz',
  cancel: 'Cancel',
  backToList: 'Back to quizzes',
  createNotice: 'Quiz saved. Attach it when creating a course.',
  updateNotice: 'Quiz updated.',
  edit: 'Edit',
  remove: 'Delete',
  removeNotice: 'Quiz deleted.',
  bankSaved: 'Question saved to the Question Bank.',
  metrics: {
    total: 'Total quizzes',
    ready: 'Ready',
    attached: 'Attached to a course',
    unused: 'Unused',
  },
} as const

export const contentAssignmentsPage = {
  title: 'Assignments',
  subtitle:
    'Build assignments with online questions or a PDF question paper, then attach them to modules or course completion.',
  create: 'Create assignment',
  editTitle: 'Edit assignment',
  searchPlaceholder: 'Search assignments…',
  emptyTitle: 'No assignments yet',
  emptyBody: 'Create an assignment with questions or upload a PDF question paper.',
  columns: {
    title: 'Assignment',
    format: 'Format',
    points: 'Points',
    courses: 'Used in courses',
    status: 'Status',
    updated: 'Updated',
    actions: 'Actions',
  },
  unused: 'Not attached yet',
  status: { draft: 'Draft', ready: 'Ready' },
  delivery: {
    questions: 'Online questions',
    pdf: 'PDF question paper',
  },
  deliveryHint: {
    questions: 'Learners answer questions in the platform (from bank or created here).',
    pdf: 'Upload a question paper PDF for learners to download, complete offline, and submit.',
  },
  fields: {
    title: 'Assignment title',
    brief: 'Brief for learners',
    points: 'Points',
    dueDays: 'Due in (days after unlock)',
    accept: 'Accepted submission formats',
    delivery: 'Assignment format',
    pdfUpload: 'Upload question paper (PDF)',
    pdfReplace: 'Replace PDF',
  },
  questionsTitle: 'Questions',
  save: 'Save assignment',
  cancel: 'Cancel',
  backToList: 'Back to assignments',
  createNotice: 'Assignment saved. Attach it when creating a course.',
  updateNotice: 'Assignment updated.',
  edit: 'Edit',
  remove: 'Delete',
  removeNotice: 'Assignment deleted.',
  bankSaved: 'Question saved to the Question Bank.',
  pdfUploaded: 'Question paper uploaded.',
  metrics: {
    total: 'Total assignments',
    ready: 'Ready',
    attached: 'Attached to a course',
    unused: 'Unused',
  },
} as const

function sampleQuestions(): AssessmentQuestion[] {
  const q1 = createAssessmentQuestion('single', 'sample1')
  q1.prompt = 'What should you do first when you spot a new workplace hazard?'
  q1.options = [
    { id: `${q1.id}-a`, text: 'Ignore it if nobody is hurt', correct: false },
    { id: `${q1.id}-b`, text: 'Report it through the agreed channel', correct: true },
    { id: `${q1.id}-c`, text: 'Only tell a colleague', correct: false },
    { id: `${q1.id}-d`, text: 'Wait until the next toolbox talk', correct: false },
  ]
  const q2 = createAssessmentQuestion('truefalse', 'sample2')
  q2.prompt = 'Near misses should be reported and reviewed.'
  q2.options = [
    { id: `${q2.id}-t`, text: 'True', correct: true },
    { id: `${q2.id}-f`, text: 'False', correct: false },
  ]
  return [q1, q2]
}

export const contentLibraryQuizzes: ContentLibraryQuiz[] = [
  {
    id: 'lib-quiz-whs-m1',
    title: 'WHS Module 01 knowledge check',
    description: 'Confirms hazard awareness after Module 1 videos.',
    passMark: 70,
    maxAttempts: 3,
    timeLimitMin: 15,
    shuffle: true,
    questionCount: 2,
    questions: sampleQuestions(),
    status: 'ready',
    updated: '08 Nov 2026',
    usedInCourses: [{ id: 'whs', title: 'Workplace Health & Safety' }],
  },
  {
    id: 'lib-quiz-whs-final',
    title: 'WHS course completion quiz',
    description: 'Optional end-of-course check before certificate eligibility.',
    passMark: 80,
    maxAttempts: 2,
    timeLimitMin: 25,
    shuffle: true,
    questionCount: 2,
    questions: sampleQuestions(),
    status: 'ready',
    updated: '09 Nov 2026',
    usedInCourses: [{ id: 'whs', title: 'Workplace Health & Safety' }],
  },
  {
    id: 'lib-quiz-iso-m2',
    title: 'ISO 9001 leadership quiz',
    description: 'Checks leadership and commitment concepts.',
    passMark: 70,
    maxAttempts: 3,
    timeLimitMin: 20,
    shuffle: false,
    questionCount: 0,
    questions: [],
    status: 'ready',
    updated: '05 Nov 2026',
    usedInCourses: [{ id: 'iso-9001', title: 'ISO 9001: Quality Management Systems' }],
  },
  {
    id: 'lib-quiz-fire-draft',
    title: 'Fire Safety draft quiz',
    description: 'Work in progress — not attached yet.',
    passMark: 70,
    maxAttempts: 3,
    timeLimitMin: 10,
    shuffle: true,
    questionCount: 0,
    questions: [],
    status: 'draft',
    updated: '10 Nov 2026',
    usedInCourses: [],
  },
]

export const contentLibraryAssignments: ContentLibraryAssignment[] = [
  {
    id: 'lib-asg-whs-m2',
    title: 'WHS workplace scenario write-up',
    brief:
      'Describe one hazard you observe at work, the risk, and the control you would apply.',
    points: 20,
    dueDays: 7,
    accept: 'PDF, DOC, DOCX',
    delivery: 'questions',
    questions: sampleQuestions(),
    pdfFileName: '',
    pdfPreviewUrl: '',
    status: 'ready',
    updated: '08 Nov 2026',
    usedInCourses: [{ id: 'whs', title: 'Workplace Health & Safety' }],
  },
  {
    id: 'lib-asg-whs-final',
    title: 'WHS course completion reflection',
    brief: 'Optional final reflection on three safety improvements you will apply.',
    points: 30,
    dueDays: 14,
    accept: 'PDF, DOC, DOCX',
    delivery: 'questions',
    questions: [],
    pdfFileName: '',
    pdfPreviewUrl: '',
    status: 'ready',
    updated: '09 Nov 2026',
    usedInCourses: [{ id: 'whs', title: 'Workplace Health & Safety' }],
  },
  {
    id: 'lib-asg-iso-procedure',
    title: 'Draft a controlled procedure outline',
    brief: 'Complete the attached question paper and upload your answers.',
    points: 25,
    dueDays: 10,
    accept: 'PDF, DOC, DOCX',
    delivery: 'pdf',
    questions: [],
    pdfFileName: 'ISO9001_Procedure_Paper.pdf',
    pdfPreviewUrl: '',
    status: 'ready',
    updated: '04 Nov 2026',
    usedInCourses: [{ id: 'iso-9001', title: 'ISO 9001: Quality Management Systems' }],
  },
  {
    id: 'lib-asg-unused',
    title: 'Generic evidence upload',
    brief: 'Upload supporting evidence for the learning outcome.',
    points: 10,
    dueDays: 5,
    accept: 'PDF, PNG, JPG',
    delivery: 'questions',
    questions: [],
    pdfFileName: '',
    pdfPreviewUrl: '',
    status: 'draft',
    updated: '10 Nov 2026',
    usedInCourses: [],
  },
]

export function getLibraryQuiz(id: string | null | undefined) {
  return contentLibraryQuizzes.find((item) => item.id === id)
}

export function getLibraryAssignment(id: string | null | undefined) {
  return contentLibraryAssignments.find((item) => item.id === id)
}

export function formatUsedInCourses(courses: LibraryCourseRef[], unusedLabel = 'Not attached yet') {
  if (!courses.length) return unusedLabel
  return courses.map((course) => course.title).join(', ')
}

export function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
