import { paths } from '@/routes/paths'

export type CourseBuilderStepId = 'details' | 'content' | 'settings' | 'preview'

export const courseBuilderSteps = [
  {
    id: 'details' as CourseBuilderStepId,
    number: 1,
    label: 'Details',
    hint: 'Basic information',
    to: paths.content.createCourse,
  },
  {
    id: 'content' as CourseBuilderStepId,
    number: 2,
    label: 'Content',
    hint: 'Modules & quizzes',
    to: paths.content.courseBuilder,
  },
  {
    id: 'settings' as CourseBuilderStepId,
    number: 3,
    label: 'Settings',
    hint: 'Access & certification',
    to: paths.content.courseSettings,
  },
  {
    id: 'preview' as CourseBuilderStepId,
    number: 4,
    label: 'Preview',
    hint: 'Review & publish',
    to: paths.content.coursePreview,
  },
]

export const courseBuilderShell = {
  title: 'Create New Course',
  subtitle: 'Build a course in four steps. Your progress is saved as a draft.',
  backToCourses: 'All Courses',
  draftBadge: 'Draft · v1.0',
  saveDraft: 'Save Draft',
  saved: 'Saved',
  back: 'Back',
  continue: 'Continue',
  publish: 'Publish Course',
  cancel: 'Cancel',
  stepOf: 'Step',
  of: 'of',
  validationBanner: 'Complete the highlighted required fields to continue.',
  publishModal: {
    title: 'Publish this course?',
    body: 'Learners will be able to enrol as soon as the course is published. You can release further changes as a new version.',
    confirm: 'Yes, publish',
    cancel: 'Keep editing',
    working: 'Publishing…',
  },
  published: {
    title: 'Course published',
    body: 'is now live and available in the learner catalogue.',
    allCourses: 'Go to All Courses',
    versions: 'View version history',
    another: 'Create another course',
  },
} as const

/* --------------------------------- Details data --------------------------------- */

export const courseBuilderCategories = [
  'Quality & Compliance',
  'Health & Safety',
  'Business Skills',
  'Information Security',
  'Compliance',
] as const

export const courseBuilderLevels = ['Beginner', 'Intermediate', 'Advanced'] as const
export const courseBuilderLanguages = ['English', 'Arabic', 'English & Arabic'] as const
export const courseBuilderInstructors = [
  'Priya Nair',
  'Aisha Khan',
  'Rahul Menon',
  'Daniel Joseph',
] as const
export const courseBuilderDeliveryModes = [
  { id: 'self-paced', label: 'Self-paced', hint: 'Learners progress on their own schedule' },
  { id: 'scheduled', label: 'Scheduled', hint: 'Fixed start and end dates' },
] as const

export type CourseBuilderDeliveryMode = (typeof courseBuilderDeliveryModes)[number]['id'] | ''

export type CourseBuilderDetails = {
  title: string
  code: string
  category: string
  level: string
  language: string
  instructor: string
  duration: string
  deliveryMode: CourseBuilderDeliveryMode
  shortDescription: string
  description: string
  outcomes: string[]
  prerequisites: string
  audience: string
  tags: string[]
  thumbnailName: string
  /** Local blob URL for the uploaded thumbnail preview. */
  thumbnailPreviewUrl: string
}

export const courseBuilderDetailsCopy = {
  title: 'Course Details',
  subtitle: 'Tell learners what this course is about and who it is for.',
  sections: {
    basics: 'Basic information',
    description: 'Description',
    outcomes: 'Learning outcomes',
    audience: 'Audience & tags',
    thumbnail: 'Course thumbnail',
  },
  fields: {
    title: 'Course title',
    code: 'Course code',
    category: 'Category',
    level: 'Level',
    language: 'Language',
    instructor: 'Lead instructor',
    duration: 'Estimated duration (hours)',
    deliveryMode: 'Delivery mode',
    shortDescription: 'Short description',
    description: 'Full description',
    outcomes: 'What learners will achieve',
    prerequisites: 'Prerequisites',
    audience: 'Target audience',
    tags: 'Tags',
  },
  placeholders: {
    title: 'e.g. ISO 14001: Environmental Management',
    code: 'e.g. ENV-140',
    shortDescription: 'One or two sentences shown on course cards (max 160 characters).',
    description: 'Describe the course scope, structure and benefits.',
    outcome: 'Add an outcome and press Enter',
    prerequisites: 'e.g. Basic understanding of management systems',
    audience: 'e.g. Site managers, quality officers, new joiners',
    tag: 'Add a tag and press Enter',
  },
  errors: {
    title: 'Course title is required',
    code: 'Course code is required',
    category: 'Select a category',
    shortDescription: 'Add a short description',
  },
  addOutcome: 'Add',
  addTag: 'Add',
  thumbnailHint: 'PNG or JPG, 1280 × 720 recommended',
  thumbnailUpload: 'Upload thumbnail',
  thumbnailReplace: 'Replace',
  charactersLeft: 'characters left',
} as const

/* ------------------------------ Content (modules) data ------------------------------ */

export type SubmoduleType = 'video' | 'reading' | 'scorm'

export type BuilderSubmodule = {
  id: string
  title: string
  type: SubmoduleType
  durationMin: number
  description: string
  required: boolean
  video: {
    source: 'upload' | 'url'
    fileName: string
    url: string
    /** Local blob URL or remote URL used for the builder preview player. */
    previewUrl: string
    captions: boolean
    transcript: string
    allowDownload: boolean
  }
}

export type QuizQuestionType = 'single' | 'multiple' | 'truefalse'

export type BuilderQuizOption = { id: string; text: string; correct: boolean }

export type BuilderQuizQuestion = {
  id: string
  prompt: string
  type: QuizQuestionType
  points: number
  explanation: string
  options: BuilderQuizOption[]
}

export type BuilderQuiz = {
  enabled: boolean
  title: string
  passMark: number
  maxAttempts: number
  timeLimitMin: number
  shuffle: boolean
  questions: BuilderQuizQuestion[]
}

export type BuilderModule = {
  id: string
  title: string
  summary: string
  submodules: BuilderSubmodule[]
  quiz: BuilderQuiz
}

export const courseBuilderContentCopy = {
  title: 'Course Content',
  subtitle: 'Organise modules and submodules, then add videos and quizzes.',
  tabs: { content: 'Content builder', quiz: 'Module quizzes' },
  outline: 'Course outline',
  addModule: 'Add Module',
  addSubmodule: 'Add Submodule',
  moduleTitle: 'Module title',
  moduleSummary: 'Module summary',
  moduleSummaryPlaceholder: 'What will learners cover in this module?',
  modulePrefix: 'Module',
  quizBadge: 'Quiz',
  addQuiz: 'Add module quiz',
  editQuiz: 'Edit quiz',
  moveUp: 'Move up',
  moveDown: 'Move down',
  remove: 'Remove',
  noVideo: 'No video',
  emptyOutlineTitle: 'No modules yet',
  emptyOutlineBody: 'Add your first module to start building the course.',
  emptyEditorTitle: 'Select a submodule',
  emptyEditorBody: 'Choose a submodule from the outline to edit its content and video.',
  editor: {
    title: 'Submodule details',
    submoduleTitle: 'Submodule title',
    type: 'Content type',
    duration: 'Duration (minutes)',
    description: 'Description',
    descriptionPlaceholder: 'Short description or learning objective',
    required: 'Mandatory for course completion',
    video: 'Primary video',
    source: 'Video source',
    sourceUpload: 'Upload file',
    sourceUrl: 'Video URL',
    upload: 'Upload video',
    replace: 'Replace video',
    uploadHint: 'MP4 or MOV, up to 2 GB',
    url: 'Video URL',
    urlPlaceholder: 'https://…',
    captions: 'Captions available',
    allowDownload: 'Allow learners to download',
    transcript: 'Transcript',
    transcriptPlaceholder: 'Paste the transcript for accessibility…',
    preview: 'Preview',
    videoMissing: 'This submodule has no primary video yet.',
    typeNotVideo: 'Video options apply to video submodules only.',
  },
  submoduleTypes: [
    { id: 'video' as SubmoduleType, label: 'Video lesson' },
    { id: 'reading' as SubmoduleType, label: 'Reading' },
    { id: 'scorm' as SubmoduleType, label: 'SCORM package' },
  ],
} as const

export const courseBuilderQuizCopy = {
  title: 'Module Quizzes',
  subtitle: 'Add a quiz after a module’s submodules to check understanding.',
  selectModule: 'Module',
  enable: 'Enable quiz for this module',
  settings: 'Quiz settings',
  quizTitle: 'Quiz title',
  passMark: 'Pass mark (%)',
  attempts: 'Maximum attempts',
  timeLimit: 'Time limit (minutes, 0 = none)',
  shuffle: 'Shuffle question order',
  questions: 'Questions',
  addQuestion: 'Add Question',
  questionPrompt: 'Question',
  promptPlaceholder: 'Type your question…',
  type: 'Type',
  points: 'Points',
  options: 'Answer options',
  addOption: 'Add option',
  correct: 'Correct',
  explanation: 'Explanation (shown after answering)',
  explanationPlaceholder: 'Why is this the right answer?',
  removeQuestion: 'Remove question',
  emptyTitle: 'No questions yet',
  emptyBody: 'Add the first question to this quiz.',
  disabledTitle: 'Quiz is off for this module',
  disabledBody: 'Enable the quiz to start adding questions.',
  noModules: 'Add at least one module in the content builder before creating quizzes.',
  goToContent: 'Go to content builder',
  questionTypes: [
    { id: 'single' as QuizQuestionType, label: 'Single choice' },
    { id: 'multiple' as QuizQuestionType, label: 'Multiple choice' },
    { id: 'truefalse' as QuizQuestionType, label: 'True / False' },
  ],
  totalPoints: 'Total points',
  questionCount: 'questions',
} as const

let idCounter = 0
export function builderId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}${idCounter}`
}

export function createBuilderSubmodule(title = 'New submodule'): BuilderSubmodule {
  return {
    id: builderId('sm'),
    title,
    type: 'video',
    durationMin: 10,
    description: '',
    required: true,
    video: {
      source: 'upload',
      fileName: '',
      url: '',
      previewUrl: '',
      captions: false,
      transcript: '',
      allowDownload: false,
    },
  }
}

export function createBuilderQuiz(title = 'Module quiz'): BuilderQuiz {
  return {
    enabled: false,
    title,
    passMark: 70,
    maxAttempts: 3,
    timeLimitMin: 0,
    shuffle: true,
    questions: [],
  }
}

export function createBuilderModule(title = 'New module'): BuilderModule {
  return {
    id: builderId('mod'),
    title,
    summary: '',
    submodules: [],
    quiz: createBuilderQuiz(`${title} quiz`),
  }
}

export function createBuilderQuestion(type: QuizQuestionType = 'single'): BuilderQuizQuestion {
  if (type === 'truefalse') {
    return {
      id: builderId('q'),
      prompt: '',
      type,
      points: 1,
      explanation: '',
      options: [
        { id: builderId('o'), text: 'True', correct: true },
        { id: builderId('o'), text: 'False', correct: false },
      ],
    }
  }
  return {
    id: builderId('q'),
    prompt: '',
    type,
    points: 1,
    explanation: '',
    options: [
      { id: builderId('o'), text: '', correct: true },
      { id: builderId('o'), text: '', correct: false },
      { id: builderId('o'), text: '', correct: false },
    ],
  }
}

/* ------------------------------------ Settings ------------------------------------ */

export type CourseBuilderSettings = {
  visibility: 'public' | 'organizations' | 'invite' | ''
  enrolment: 'self' | 'assigned' | 'both' | ''
  completionRule: 'all' | 'percentage' | ''
  completionPercent: number | ''
  sequential: boolean
  finalAssessment: boolean
  finalPassMark: number | ''
  finalAttempts: number | ''
  certificateEnabled: boolean
  certificateTemplate: string
  cpdEnabled: boolean
  cpdHours: string
  accreditationBody: string
  validityMonths: string
  qaEnabled: boolean
  downloadsEnabled: boolean
  notifyOnEnrol: boolean
  scheduledPublish: boolean
  publishDate: string
}

export const courseBuilderSettingsCopy = {
  title: 'Course Settings',
  subtitle: 'Control who can take the course, how it is completed and how it is certified.',
  sections: {
    access: 'Access & enrolment',
    completion: 'Completion rules',
    certification: 'Certification & CPD',
    engagement: 'Learner experience',
    publishing: 'Publishing',
  },
  fields: {
    visibility: 'Visibility',
    enrolment: 'Enrolment',
    completionRule: 'Completion rule',
    completionPercent: 'Required progress (%)',
    sequential: 'Learners must complete submodules in order',
    finalAssessment: 'Include a final assessment',
    finalPassMark: 'Final pass mark (%)',
    finalAttempts: 'Final attempts allowed',
    certificate: 'Issue completion certificate',
    certificateTemplate: 'Certificate template',
    cpd: 'Award CPD hours',
    cpdHours: 'CPD hours',
    accreditationBody: 'Accreditation body',
    validityMonths: 'Certificate validity (months, 0 = no expiry)',
    qa: 'Enable course Q&A',
    downloads: 'Allow resource downloads',
    notifyOnEnrol: 'Email learners when enrolled',
    scheduledPublish: 'Schedule publish date',
    publishDate: 'Publish on',
  },
  visibilityOptions: [
    { id: 'public' as const, label: 'Public catalogue', hint: 'Visible to all learners' },
    {
      id: 'organizations' as const,
      label: 'Organisations only',
      hint: 'Purchased or assigned by organisations',
    },
    { id: 'invite' as const, label: 'Invite only', hint: 'Hidden unless a learner is invited' },
  ],
  enrolmentOptions: [
    { id: 'self' as const, label: 'Self enrolment' },
    { id: 'assigned' as const, label: 'Assigned by manager' },
    { id: 'both' as const, label: 'Self & assigned' },
  ],
  completionOptions: [
    { id: 'all' as const, label: 'Complete all mandatory submodules' },
    { id: 'percentage' as const, label: 'Reach a progress percentage' },
  ],
  certificateTemplates: [
    'MaqSkillz Standard Certificate',
    'CPD Accredited Certificate',
    'Compliance Completion Certificate',
  ],
  accreditationBodies: ['CPD Standards Office', 'IOSH', 'ISO Training Alliance', 'None'],
} as const

export const courseBuilderDefaultSettings: CourseBuilderSettings = {
  visibility: '',
  enrolment: '',
  completionRule: '',
  completionPercent: '',
  sequential: false,
  finalAssessment: false,
  finalPassMark: '',
  finalAttempts: '',
  certificateEnabled: false,
  certificateTemplate: '',
  cpdEnabled: false,
  cpdHours: '',
  accreditationBody: '',
  validityMonths: '',
  qaEnabled: false,
  downloadsEnabled: false,
  notifyOnEnrol: false,
  scheduledPublish: false,
  publishDate: '',
}

/* ------------------------------------ Preview ------------------------------------ */

export const courseBuilderPreviewCopy = {
  title: 'Preview & Publish',
  subtitle: 'Review everything before the course goes live.',
  learnerView: 'Learner preview',
  outline: 'Course outline',
  readiness: 'Publish readiness',
  readinessReady: 'All checks passed',
  readinessBlocked: 'Resolve required items before publishing',
  required: 'Required',
  recommended: 'Recommended',
  summary: 'Summary',
  fix: 'Fix',
  audience: 'Audience',
  outcomes: 'Learning outcomes',
  settingsSummary: 'Settings',
  labels: {
    category: 'Category',
    level: 'Level',
    language: 'Language',
    instructor: 'Instructor',
    duration: 'Duration',
    modules: 'Modules',
    submodules: 'Submodules',
    quizzes: 'Quizzes',
    visibility: 'Visibility',
    enrolment: 'Enrolment',
    certificate: 'Certificate',
    cpd: 'CPD hours',
    completion: 'Completion',
    version: 'Version',
  },
  hours: 'hrs',
  min: 'min',
  notSet: 'Not set',
  enabled: 'Enabled',
  disabled: 'Disabled',
} as const

export function createDefaultCourseBuilderDetails(): CourseBuilderDetails {
  return {
    title: '',
    code: '',
    category: '',
    level: '',
    language: '',
    instructor: '',
    duration: '',
    deliveryMode: '',
    shortDescription: '',
    description: '',
    outcomes: [],
    prerequisites: '',
    audience: '',
    tags: [],
    thumbnailName: '',
    thumbnailPreviewUrl: '',
  }
}

function seedSubmodule(
  title: string,
  durationMin: number,
  fileName: string,
  options: Partial<Pick<BuilderSubmodule, 'type' | 'required'>> = {},
): BuilderSubmodule {
  const base = createBuilderSubmodule(title)
  return {
    ...base,
    ...options,
    durationMin,
    description: `Learning objective for “${title}”.`,
    video: { ...base.video, fileName, captions: Boolean(fileName) },
  }
}

export function createDefaultCourseBuilderModules(): BuilderModule[] {
  return []
}

export const courseBuilderPublishChecks = {
  title: 'Course title',
  code: 'Course code',
  category: 'Category selected',
  description: 'Short description',
  modules: 'At least one module',
  submodules: 'Every module has a submodule',
  videos: 'Every video submodule has a primary video',
  quizzes: 'Quiz questions have a correct answer',
  certificate: 'Certificate template selected',
} as const

export type CourseBuilderCheck = {
  id: keyof typeof courseBuilderPublishChecks
  label: string
  passed: boolean
  required: boolean
  to: string
  detail?: string
}

export function computeCourseBuilderChecks(
  details: CourseBuilderDetails,
  modules: BuilderModule[],
  settings: CourseBuilderSettings,
): CourseBuilderCheck[] {
  const labels = courseBuilderPublishChecks
  const videoSubmodules = modules.flatMap((module) =>
    module.submodules.filter((submodule) => submodule.type === 'video'),
  )
  const missingVideos = videoSubmodules.filter(
    (submodule) => !submodule.video.fileName.trim() && !submodule.video.url.trim(),
  ).length
  const emptyModules = modules.filter((module) => !module.submodules.length).length
  const badQuestions = modules
    .filter((module) => module.quiz.enabled)
    .flatMap((module) => module.quiz.questions)
    .filter(
      (question) =>
        !question.prompt.trim() || !question.options.some((option) => option.correct),
    ).length

  return [
    {
      id: 'title',
      label: labels.title,
      passed: Boolean(details.title.trim()),
      required: true,
      to: paths.content.createCourse,
    },
    {
      id: 'code',
      label: labels.code,
      passed: Boolean(details.code.trim()),
      required: true,
      to: paths.content.createCourse,
    },
    {
      id: 'category',
      label: labels.category,
      passed: Boolean(details.category),
      required: true,
      to: paths.content.createCourse,
    },
    {
      id: 'description',
      label: labels.description,
      passed: Boolean(details.shortDescription.trim()),
      required: true,
      to: paths.content.createCourse,
    },
    {
      id: 'modules',
      label: labels.modules,
      passed: modules.length > 0,
      required: true,
      to: paths.content.courseBuilder,
    },
    {
      id: 'submodules',
      label: labels.submodules,
      passed: modules.length > 0 && emptyModules === 0,
      required: true,
      to: paths.content.courseBuilder,
      detail: emptyModules ? `${emptyModules} empty` : undefined,
    },
    {
      id: 'videos',
      label: labels.videos,
      passed: missingVideos === 0,
      required: false,
      to: paths.content.courseBuilder,
      detail: missingVideos ? `${missingVideos} missing` : undefined,
    },
    {
      id: 'quizzes',
      label: labels.quizzes,
      passed: badQuestions === 0,
      required: true,
      to: paths.content.courseQuiz,
      detail: badQuestions ? `${badQuestions} to fix` : undefined,
    },
    {
      id: 'certificate',
      label: labels.certificate,
      passed: !settings.certificateEnabled || Boolean(settings.certificateTemplate),
      required: false,
      to: paths.content.courseSettings,
    },
  ]
}
