/* ---------------------------- Module quizzes ---------------------------- */

export type SuperAdminQuizRow = {
  id: string
  quiz: string
  course: string
  version: string
  questions: number
  attempts: number
  avgScore: number
  firstTryPass: number
  avgTimeMin: number
  status: 'Live' | 'Draft' | 'Paused'
}

export const superAdminQuizKpis = [
  { id: 'count', label: 'Module quizzes', value: '684', detail: null as string | null },
  { id: 'attempts', label: 'Attempts (Oct)', value: '9,840', detail: '+7.4% vs Sep' },
  { id: 'score', label: 'Average score', value: '76%', detail: null },
  { id: 'first', label: 'First-try pass rate', value: '71%', detail: null },
  { id: 'flags', label: 'Flagged questions', value: '14', detail: null },
]

export const superAdminQuizAlerts = [
  { id: 'a1', title: 'NEBOSH IGC · Element 4', detail: '41% pass first time · 3 questions flagged' },
  { id: 'a2', title: 'COSHH Awareness · Module 3', detail: '52% pass first time · 2 questions flagged' },
  { id: 'a3', title: 'Working at Height · Module 4', detail: '70% pass first time' },
]

export const superAdminQuizFlagStats = [
  { label: 'Open flags', value: '14' },
  { label: 'Resolved this month', value: '9' },
  { label: 'Average time to resolve', value: '2.4 days' },
]

export const superAdminQuizRows: SuperAdminQuizRow[] = [
  { id: 'q1', quiz: 'Module 3 · Using fire extinguishers', course: 'Fire Warden Training', version: 'v3.0', questions: 10, attempts: 1184, avgScore: 82, firstTryPass: 79, avgTimeMin: 6, status: 'Live' },
  { id: 'q2', quiz: 'Module 2 · Primary survey and CPR', course: 'First Aid at Work', version: 'v2.2', questions: 12, attempts: 962, avgScore: 77, firstTryPass: 72, avgTimeMin: 9, status: 'Live' },
  { id: 'q3', quiz: 'Element 4 · Risk assessment', course: 'NEBOSH IGC Preparation', version: 'v2.1', questions: 20, attempts: 410, avgScore: 58, firstTryPass: 41, avgTimeMin: 22, status: 'Live' },
  { id: 'q4', quiz: 'Module 1 · Spotting hazards', course: 'Workplace Safety Basics', version: 'v3.0', questions: 8, attempts: 1540, avgScore: 88, firstTryPass: 90, avgTimeMin: 4, status: 'Live' },
  { id: 'q5', quiz: 'Module 4 · Ladders and platforms', course: 'Working at Height', version: 'v2.0', questions: 10, attempts: 688, avgScore: 74, firstTryPass: 70, avgTimeMin: 7, status: 'Live' },
  { id: 'q6', quiz: 'Module 2 · Safe lifting technique', course: 'Manual Handling', version: 'v1.6', questions: 8, attempts: 1120, avgScore: 85, firstTryPass: 86, avgTimeMin: 5, status: 'Live' },
  { id: 'q7', quiz: 'Module 3 · Reading safety data sheets', course: 'COSHH Awareness', version: 'v1.4', questions: 10, attempts: 168, avgScore: 61, firstTryPass: 52, avgTimeMin: 8, status: 'Live' },
  { id: 'q8', quiz: 'Module 5 · Allergen control', course: 'Food Hygiene Level 2', version: 'v1.1', questions: 10, attempts: 246, avgScore: 79, firstTryPass: 75, avgTimeMin: 6, status: 'Live' },
]

export const superAdminQuizTotal = 212
export const superAdminQuizPageSize = 8

/* ----------------------------- Question bank ---------------------------- */

export type SuperAdminQuestionRow = {
  id: string
  question: string
  course: string
  module: string
  type: 'Multiple choice' | 'True / false' | 'Scenario'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  usedIn: string
  correct: number
  answers?: { label: string; pct: number; correct?: boolean }[]
  timesAnswered?: number
  owner?: string
  hint?: string
}

export const superAdminQuestionTypeStats = [
  { id: 'all', label: 'Questions', value: '3,840', share: null as string | null },
  { id: 'mc', label: 'Multiple choice', value: '2,765', share: '72%' },
  { id: 'tf', label: 'True / false', value: '691', share: '18%' },
  { id: 'sc', label: 'Scenario-based', value: '384', share: '10%' },
  { id: 'unused', label: 'Never used', value: '210', share: null },
]

export const superAdminQuestionRows: SuperAdminQuestionRow[] = [
  {
    id: 'qb-1',
    question: 'Which extinguisher should you use on an electrical fire?',
    course: 'Fire Warden Training',
    module: 'Module 3',
    type: 'Multiple choice',
    difficulty: 'Medium',
    usedIn: '4 quizzes',
    correct: 92,
  },
  {
    id: 'qb-2',
    question: 'What is the correct compression depth for adult CPR?',
    course: 'First Aid at Work',
    module: 'Module 2',
    type: 'Multiple choice',
    difficulty: 'Medium',
    usedIn: '2 quizzes',
    correct: 68,
  },
  {
    id: 'qb-3',
    question: 'A risk assessment must be reviewed after every incident.',
    course: 'NEBOSH IGC',
    module: 'Element 4',
    type: 'True / false',
    difficulty: 'Hard',
    usedIn: '3 quizzes',
    correct: 38,
  },
  {
    id: 'qb-4',
    question: 'A colleague is lifting a 30 kg box alone. What should you do first?',
    course: 'Manual Handling',
    module: 'Module 2',
    type: 'Scenario',
    difficulty: 'Medium',
    usedIn: '1 quiz',
    correct: 71,
  },
  {
    id: 'qb-5',
    question: 'What does the flame pictogram on a safety data sheet mean?',
    course: 'COSHH Awareness',
    module: 'Module 3',
    type: 'Multiple choice',
    difficulty: 'Hard',
    usedIn: '2 quizzes',
    correct: 44,
    timesAnswered: 1284,
    owner: 'Lina Farouk',
    hint: 'Most wrong answers pick Oxidising. Ask the owner to review the wording or the lesson.',
    answers: [
      { label: 'Flammable', pct: 44, correct: true },
      { label: 'Oxidising', pct: 38 },
      { label: 'Explosive', pct: 11 },
      { label: 'Toxic', pct: 7 },
    ],
  },
  {
    id: 'qb-6',
    question: 'Ladders should be checked before each use.',
    course: 'Working at Height',
    module: 'Module 4',
    type: 'True / false',
    difficulty: 'Easy',
    usedIn: '5 quizzes',
    correct: 96,
  },
  {
    id: 'qb-7',
    question: 'Which of these is one of the 14 major allergens?',
    course: 'Food Hygiene Level 2',
    module: 'Module 5',
    type: 'Multiple choice',
    difficulty: 'Easy',
    usedIn: '2 quizzes',
    correct: 81,
  },
]

export const superAdminQuestionTotal = 3840
export const superAdminQuestionPageSize = 7

/* ------------------------- Passing statistics --------------------------- */

export const superAdminPassingKpis = [
  { id: 'overall', label: 'Overall pass rate', value: '78%', change: '−1.2 pt vs Sep', tone: 'down' as const },
  { id: 'individuals', label: 'Individuals', value: '74%', change: null, tone: 'flat' as const },
  { id: 'orgs', label: 'Organization employees', value: '83%', change: null, tone: 'flat' as const },
  { id: 'first', label: 'Passed on first attempt', value: '69%', change: null, tone: 'flat' as const },
  { id: 'avg', label: 'Average score', value: '74%', change: null, tone: 'flat' as const },
]

export const superAdminPassingDistribution = [
  { label: '0–9', value: 12 },
  { label: '10–19', value: 18 },
  { label: '20–29', value: 24 },
  { label: '30–39', value: 36 },
  { label: '40–49', value: 58 },
  { label: '50–59', value: 112 },
  { label: '60–69', value: 223 },
  { label: '70–79', value: 446 },
  { label: '80–89', value: 335 },
  { label: '90+', value: 156 },
]

export const superAdminPassingTrend = [
  { month: 'May', individuals: 68, orgs: 76 },
  { month: 'Jun', individuals: 61, orgs: 82 },
  { month: 'Jul', individuals: 74, orgs: 71 },
  { month: 'Aug', individuals: 66, orgs: 85 },
  { month: 'Sep', individuals: 79, orgs: 73 },
  { month: 'Oct', individuals: 72, orgs: 84 },
]

export type SuperAdminPassingRow = {
  id: string
  course: string
  passMark: number
  attempts: number
  passRate: number
  individuals: number
  orgs: number
  avgScore: number
  attemptsToPass: number
}

export const superAdminPassingRows: SuperAdminPassingRow[] = [
  { id: 'p1', course: 'Workplace Safety Basics', passMark: 70, attempts: 246, passRate: 91, individuals: 89, orgs: 94, avgScore: 84, attemptsToPass: 1.1 },
  { id: 'p2', course: 'Manual Handling', passMark: 70, attempts: 202, passRate: 88, individuals: 86, orgs: 91, avgScore: 82, attemptsToPass: 1.2 },
  { id: 'p3', course: 'Fire Warden Training', passMark: 75, attempts: 214, passRate: 84, individuals: 80, orgs: 88, avgScore: 79, attemptsToPass: 1.3 },
  { id: 'p4', course: 'Working at Height', passMark: 75, attempts: 128, passRate: 80, individuals: 76, orgs: 84, avgScore: 77, attemptsToPass: 1.4 },
  { id: 'p5', course: 'First Aid at Work', passMark: 80, attempts: 182, passRate: 79, individuals: 77, orgs: 82, avgScore: 81, attemptsToPass: 1.4 },
  { id: 'p6', course: 'Food Hygiene Level 2', passMark: 80, attempts: 61, passRate: 74, individuals: 72, orgs: 78, avgScore: 76, attemptsToPass: 1.6 },
  { id: 'p7', course: 'COSHH Awareness', passMark: 75, attempts: 84, passRate: 66, individuals: 61, orgs: 72, avgScore: 71, attemptsToPass: 1.8 },
  { id: 'p8', course: 'NEBOSH IGC Preparation', passMark: 75, attempts: 96, passRate: 52, individuals: 48, orgs: 58, avgScore: 69, attemptsToPass: 2.1 },
]

/* ---------------------- Assessment performance -------------------------- */

export const superAdminPerformanceKpis = [
  { id: 'attempts', label: 'Attempts', value: '3,630', detail: 'all assessments' },
  { id: 'passed', label: 'Passed', value: '2,940', detail: 'attempts' },
  { id: 'rate', label: 'Pass rate', value: '81%', detail: 'passed ÷ attempts' },
  { id: 'first', label: 'First-attempt pass', value: '72%', detail: 'of learners' },
  { id: 'score', label: 'Average score', value: '76%', detail: 'all attempts' },
  { id: 'learners', label: 'Learners assessed', value: '2,318', detail: 'unique' },
]

export type SuperAdminPerformanceRow = {
  id: string
  assessment: string
  type: 'Final assessment' | 'Module quiz'
  attempts: number
  passRate: number
  avgScore: number
  tries: number
  flagged: number
}

export const superAdminPerformanceRows: SuperAdminPerformanceRow[] = [
  { id: 'pf1', assessment: 'ISO 9001 · Final assessment', type: 'Final assessment', attempts: 412, passRate: 74, avgScore: 71, tries: 1.4, flagged: 2 },
  { id: 'pf2', assessment: 'ISO 45001 · Final assessment', type: 'Final assessment', attempts: 356, passRate: 79, avgScore: 75, tries: 1.3, flagged: 1 },
  { id: 'pf3', assessment: 'Fire Warden · Module 2 Quiz', type: 'Module quiz', attempts: 520, passRate: 68, avgScore: 64, tries: 1.6, flagged: 3 },
  { id: 'pf4', assessment: 'First Aid · Module 1 Quiz', type: 'Module quiz', attempts: 610, passRate: 91, avgScore: 84, tries: 1.1, flagged: 0 },
  { id: 'pf5', assessment: 'ISO 27001 · Final assessment', type: 'Final assessment', attempts: 198, passRate: 63, avgScore: 66, tries: 1.8, flagged: 4 },
  { id: 'pf6', assessment: 'Food Safety L2 · Module 1 Quiz', type: 'Module quiz', attempts: 288, passRate: 88, avgScore: 81, tries: 1.2, flagged: 0 },
  { id: 'pf7', assessment: 'ISO 9001 · Module 1 Quiz', type: 'Module quiz', attempts: 466, passRate: 82, avgScore: 78, tries: 1.3, flagged: 1 },
]

export const superAdminPerformanceWeekly = [
  { week: 'W38', quizzes: 76, finals: 71 },
  { week: 'W39', quizzes: 84, finals: 78 },
  { week: 'W40', quizzes: 71, finals: 68 },
  { week: 'W41', quizzes: 88, finals: 74 },
  { week: 'W42', quizzes: 79, finals: 82 },
  { week: 'W43', quizzes: 91, finals: 69 },
  { week: 'W44', quizzes: 73, finals: 85 },
  { week: 'W45', quizzes: 86, finals: 77 },
]

export const superAdminHardestQuestions = [
  { id: 'h1', question: 'Which clause of ISO 9001 covers leadership?', source: 'ISO 9001 · Module 1 Quiz', correct: 41 },
  { id: 'h2', question: 'Which risk treatment options does ISO 27001 allow?', source: 'ISO 27001 · Final assessment', correct: 39 },
  { id: 'h3', question: 'Select all stages of the PDCA cycle.', source: 'ISO 9001 · Module 1 Quiz', correct: 48 },
  { id: 'h4', question: 'Which extinguisher is used on electrical fires?', source: 'Fire Warden · Module 2 Quiz', correct: 52 },
]
