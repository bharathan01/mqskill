export type AssessmentQuestionType = 'single' | 'multiple' | 'truefalse' | 'short'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export type AssessmentQuestion = {
  id: string
  prompt: string
  type: AssessmentQuestionType
  points: number
  difficulty: QuestionDifficulty
  options: { id: string; text: string; correct: boolean }[]
}

export type QuestionBankItem = {
  id: string
  prompt: string
  type: AssessmentQuestionType
  tags: string[]
  difficulty: QuestionDifficulty
  points: number
  course: string
  usedIn: number
  updated: string
  options: { text: string; correct: boolean }[]
}

export const contentAssessmentCourses = [
  { id: 'workplace-safety', title: 'Workplace Safety Fundamentals' },
  { id: 'data-protection', title: 'Data Protection for Teams' },
  { id: 'leadership', title: 'Leadership Essentials' },
  { id: 'cybersecurity', title: 'Cybersecurity for Everyone' },
] as const

export const contentAssessmentTypes = [
  { id: 'single', label: 'Single choice' },
  { id: 'multiple', label: 'Multiple choice' },
  { id: 'truefalse', label: 'True / False' },
  { id: 'short', label: 'Short answer' },
] as const

export const contentDifficulties = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
] as const

export const contentAssessmentsPage = {
  title: 'Final Assessment',
  subtitle: 'Build the final assessment learners complete to earn a course certificate.',
  course: 'Course',
  save: 'Save assessment',
  saveNotice: 'Final assessment saved.',
  publishNotice: 'Assessment settings are valid and ready to publish.',
  publish: 'Publish',
  settings: 'Assessment settings',
  settingsDescription: 'Scoring, timing and attempt rules.',
  assessmentTitle: 'Assessment title',
  passScore: 'Pass score (%)',
  passScoreHint: 'Learners must reach this score to pass.',
  timeLimit: 'Time limit (minutes)',
  timeLimitHint: '0 means no time limit.',
  attempts: 'Max attempts',
  shuffleQuestions: 'Shuffle question order',
  shuffleQuestionsHint: 'Each learner sees questions in a random order.',
  showResults: 'Show results immediately',
  showResultsHint: 'Reveal score and correct answers after submission.',
  questions: 'Questions',
  questionCount: 'questions',
  totalPoints: 'Total points',
  addQuestion: 'Add question',
  addFromBank: 'Add from bank',
  addFromBankPlaceholder: 'Choose a question from the bank…',
  questionPrompt: 'Question',
  promptPlaceholder: 'Enter the question text…',
  type: 'Type',
  points: 'Points',
  difficulty: 'Difficulty',
  options: 'Answer options',
  addOption: 'Add option',
  removeOption: 'Remove option',
  removeQuestion: 'Remove question',
  moveUp: 'Move up',
  moveDown: 'Move down',
  correct: 'Correct',
  shortAnswerNote: 'Short answer questions are graded manually by a reviewer.',
  emptyTitle: 'No questions yet',
  emptyBody: 'Add questions manually or reuse existing ones from the question bank.',
  summary: 'Summary',
  summaryRows: {
    questions: 'Questions',
    points: 'Total points',
    pass: 'Pass score',
    time: 'Time limit',
    attempts: 'Max attempts',
  },
  noLimit: 'No limit',
  minutes: 'min',
  readiness: 'Readiness',
  checks: {
    title: 'Assessment has a title',
    questions: 'At least 5 questions',
    answers: 'Every question has a correct answer',
    prompts: 'No empty question text',
  },
} as const

export function createAssessmentQuestion(
  type: AssessmentQuestionType = 'single',
  seed = Math.random().toString(36).slice(2, 8),
): AssessmentQuestion {
  const id = `aq-${seed}`
  if (type === 'truefalse') {
    return {
      id,
      prompt: '',
      type,
      points: 1,
      difficulty: 'easy',
      options: [
        { id: `${id}-t`, text: 'True', correct: true },
        { id: `${id}-f`, text: 'False', correct: false },
      ],
    }
  }
  if (type === 'short') {
    return { id, prompt: '', type, points: 2, difficulty: 'medium', options: [] }
  }
  return {
    id,
    prompt: '',
    type,
    points: 1,
    difficulty: 'medium',
    options: [
      { id: `${id}-a`, text: '', correct: true },
      { id: `${id}-b`, text: '', correct: false },
      { id: `${id}-c`, text: '', correct: false },
      { id: `${id}-d`, text: '', correct: false },
    ],
  }
}

export type ContentAssessmentDefaults = {
  course: string
  title: string
  passScore: number | ''
  timeLimit: number | ''
  attempts: number | ''
  shuffle: boolean
  showResults: boolean
}

export const contentAssessmentDefaults: ContentAssessmentDefaults = {
  course: '',
  title: '',
  passScore: '',
  timeLimit: '',
  attempts: '',
  shuffle: false,
  showResults: false,
}

export const contentAssessmentSeedQuestions: AssessmentQuestion[] = [
  {
    id: 'aq-seed-1',
    prompt: 'What is the first action to take when you discover a fire in the workplace?',
    type: 'single',
    points: 2,
    difficulty: 'easy',
    options: [
      { id: 'o1', text: 'Raise the alarm and alert others', correct: true },
      { id: 'o2', text: 'Try to put it out immediately', correct: false },
      { id: 'o3', text: 'Collect personal belongings', correct: false },
      { id: 'o4', text: 'Use the lift to evacuate', correct: false },
    ],
  },
  {
    id: 'aq-seed-2',
    prompt: 'Which of the following are valid controls in the hierarchy of controls?',
    type: 'multiple',
    points: 3,
    difficulty: 'medium',
    options: [
      { id: 'o1', text: 'Elimination', correct: true },
      { id: 'o2', text: 'Substitution', correct: true },
      { id: 'o3', text: 'Ignoring the hazard', correct: false },
      { id: 'o4', text: 'Engineering controls', correct: true },
    ],
  },
  {
    id: 'aq-seed-3',
    prompt: 'Personal protective equipment should be the first line of defence against a hazard.',
    type: 'truefalse',
    points: 1,
    difficulty: 'easy',
    options: [
      { id: 'o1', text: 'True', correct: false },
      { id: 'o2', text: 'False', correct: true },
    ],
  },
  {
    id: 'aq-seed-4',
    prompt: 'Describe how you would report a near-miss incident at your site.',
    type: 'short',
    points: 4,
    difficulty: 'hard',
    options: [],
  },
]

export const contentQuestionBankPage = {
  title: 'Question Bank',
  subtitle: 'Search, organise and reuse questions across course quizzes and final assessments.',
  addQuestion: 'New Question',
  searchPlaceholder: 'Search questions or tags…',
  allTypes: 'All types',
  allDifficulties: 'All difficulties',
  allCourses: 'All courses',
  allTags: 'All tags',
  metrics: {
    total: 'Total questions',
    reused: 'Reused',
    tags: 'Tags',
    hard: 'Hard questions',
  },
  columns: {
    question: 'Question',
    type: 'Type',
    tags: 'Tags',
    difficulty: 'Difficulty',
    usedIn: 'Used in',
    updated: 'Updated',
    actions: 'Actions',
  },
  usedInSuffix: 'assessments',
  actions: {
    reuse: 'Add to final assessment',
    preview: 'Preview question',
    duplicate: 'Duplicate question',
    remove: 'Delete question',
  },
  reuseNotice: 'added to the final assessment draft.',
  duplicateNotice: 'duplicated.',
  removeNotice: 'removed from the question bank.',
  previewTitle: 'Question preview',
  closePreview: 'Close preview',
  emptyTitle: 'No questions found',
  emptyBody: 'Try a different search or clear filters to see every question.',
  clearFilters: 'Clear filters',
  showing: 'Showing',
  of: 'of',
  questions: 'questions',
  selected: 'selected',
  bulkReuse: 'Add selected to assessment',
  clearSelection: 'Clear selection',
  selectAll: 'Select all',
} as const

export const contentQuestionBank: QuestionBankItem[] = [
  {
    id: 'qb-1',
    prompt: 'What is the first action to take when you discover a fire in the workplace?',
    type: 'single',
    tags: ['Fire safety', 'Emergency'],
    difficulty: 'easy',
    points: 2,
    course: 'Workplace Safety Fundamentals',
    usedIn: 4,
    updated: 'Nov 6, 2026',
    options: [
      { text: 'Raise the alarm and alert others', correct: true },
      { text: 'Try to put it out immediately', correct: false },
      { text: 'Collect personal belongings', correct: false },
      { text: 'Use the lift to evacuate', correct: false },
    ],
  },
  {
    id: 'qb-2',
    prompt: 'Which of the following are valid controls in the hierarchy of controls?',
    type: 'multiple',
    tags: ['Risk', 'Controls'],
    difficulty: 'medium',
    points: 3,
    course: 'Workplace Safety Fundamentals',
    usedIn: 2,
    updated: 'Nov 4, 2026',
    options: [
      { text: 'Elimination', correct: true },
      { text: 'Substitution', correct: true },
      { text: 'Ignoring the hazard', correct: false },
      { text: 'Engineering controls', correct: true },
    ],
  },
  {
    id: 'qb-3',
    prompt: 'Personal data may be stored indefinitely without a documented retention period.',
    type: 'truefalse',
    tags: ['GDPR', 'Retention'],
    difficulty: 'easy',
    points: 1,
    course: 'Data Protection for Teams',
    usedIn: 3,
    updated: 'Nov 2, 2026',
    options: [
      { text: 'True', correct: false },
      { text: 'False', correct: true },
    ],
  },
  {
    id: 'qb-4',
    prompt: 'Which principle requires organisations to collect only the data they need?',
    type: 'single',
    tags: ['GDPR', 'Principles'],
    difficulty: 'medium',
    points: 2,
    course: 'Data Protection for Teams',
    usedIn: 1,
    updated: 'Oct 30, 2026',
    options: [
      { text: 'Data minimisation', correct: true },
      { text: 'Storage limitation', correct: false },
      { text: 'Accuracy', correct: false },
      { text: 'Integrity', correct: false },
    ],
  },
  {
    id: 'qb-5',
    prompt: 'Describe how you would respond to a suspected phishing email.',
    type: 'short',
    tags: ['Phishing', 'Incident response'],
    difficulty: 'hard',
    points: 5,
    course: 'Cybersecurity for Everyone',
    usedIn: 0,
    updated: 'Oct 28, 2026',
    options: [],
  },
  {
    id: 'qb-6',
    prompt: 'Which of these is the strongest password practice?',
    type: 'single',
    tags: ['Passwords', 'Authentication'],
    difficulty: 'easy',
    points: 1,
    course: 'Cybersecurity for Everyone',
    usedIn: 5,
    updated: 'Oct 22, 2026',
    options: [
      { text: 'A long, unique passphrase with MFA', correct: true },
      { text: 'Reusing one strong password everywhere', correct: false },
      { text: 'Writing it on a sticky note', correct: false },
      { text: 'Sharing it with trusted colleagues', correct: false },
    ],
  },
  {
    id: 'qb-7',
    prompt: 'Select the behaviours that characterise psychological safety in a team.',
    type: 'multiple',
    tags: ['Leadership', 'Culture'],
    difficulty: 'hard',
    points: 3,
    course: 'Leadership Essentials',
    usedIn: 2,
    updated: 'Oct 18, 2026',
    options: [
      { text: 'Admitting mistakes openly', correct: true },
      { text: 'Asking questions without fear', correct: true },
      { text: 'Blaming individuals for errors', correct: false },
      { text: 'Inviting dissenting views', correct: true },
    ],
  },
  {
    id: 'qb-8',
    prompt: 'A manager should give feedback only during annual reviews.',
    type: 'truefalse',
    tags: ['Leadership', 'Feedback'],
    difficulty: 'easy',
    points: 1,
    course: 'Leadership Essentials',
    usedIn: 1,
    updated: 'Oct 12, 2026',
    options: [
      { text: 'True', correct: false },
      { text: 'False', correct: true },
    ],
  },
]

const reuseKey = 'maqskillz.content.assessmentReuse'

/** Queue a question bank item so the final assessment builder can pick it up. */
export function queueReusedQuestion(id: string) {
  if (typeof window === 'undefined') return
  const current = readReuseQueue()
  if (!current.includes(id)) {
    window.sessionStorage.setItem(reuseKey, JSON.stringify([...current, id]))
  }
}

function readReuseQueue(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(reuseKey) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function takeReusedQuestions(): QuestionBankItem[] {
  const ids = readReuseQueue()
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(reuseKey)
  return ids
    .map((id) => contentQuestionBank.find((item) => item.id === id))
    .filter((item): item is QuestionBankItem => Boolean(item))
}

export function questionFromBank(item: QuestionBankItem): AssessmentQuestion {
  const seed = `${item.id}-${Math.random().toString(36).slice(2, 6)}`
  return {
    id: `aq-${seed}`,
    prompt: item.prompt,
    type: item.type,
    points: item.points,
    difficulty: item.difficulty,
    options: item.options.map((option, index) => ({
      id: `aq-${seed}-${index}`,
      text: option.text,
      correct: option.correct,
    })),
  }
}
