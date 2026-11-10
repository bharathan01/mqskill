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

export type CourseBuilderVersionKind = 'new' | 'revision' | ''

export type CourseBuilderDetails = {
  title: string
  code: string
  category: string
  level: string
  language: string
  instructor: string
  duration: string
  deliveryMode: CourseBuilderDeliveryMode
  /** New course vs next version of an existing course. */
  versionKind: CourseBuilderVersionKind
  /** Existing course this revision belongs to (when versionKind is revision). */
  parentCourseId: string
  /** Display version label, e.g. v1.0 or v2.1. */
  versionName: string
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

export const courseBuilderVersionKinds = [
  {
    id: 'new' as const,
    label: 'New course',
    hint: 'Start a brand-new course in the catalogue',
  },
  {
    id: 'revision' as const,
    label: 'Next version',
    hint: 'Publish an update of an existing course',
  },
] as const

export function suggestNextVersionName(current: string) {
  const match = current.trim().match(/^v?(\d+)\.(\d+)/i)
  if (!match) return 'v1.1'
  return `v${Number(match[1])}.${Number(match[2]) + 1}`
}

export function isCourseBuilderVersionReady(details: CourseBuilderDetails) {
  if (!details.versionKind) return false
  if (!details.versionName.trim()) return false
  if (details.versionKind === 'revision' && !details.parentCourseId) return false
  return true
}

export const courseBuilderDetailsCopy = {
  title: 'Course Details',
  subtitle: 'Tell learners what this course is about and who it is for.',
  sections: {
    version: 'Version',
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
    versionKind: 'What are you creating?',
    parentCourse: 'Based on course',
    versionName: 'Version name',
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
    parentCourse: 'Select the course this version updates',
    versionName: 'e.g. v1.0 or v2.1',
    shortDescription: 'One or two sentences shown on course cards (max 160 characters).',
    description: 'Describe the course scope, structure and benefits.',
    outcome: 'Add an outcome and press Enter',
    prerequisites: 'e.g. Basic understanding of management systems',
    audience: 'e.g. Site managers, quality officers, new joiners',
    tag: 'Add a tag and press Enter',
  },
  versionHint:
    'New courses start at v1.0. For a next version, pick the live course and set the version name learners will see.',
  parentLiveVersion: 'Current live version',
  errors: {
    title: 'Course title is required',
    code: 'Course code is required',
    category: 'Select a category',
    shortDescription: 'Add a short description',
    versionKind: 'Choose new course or next version',
    parentCourse: 'Select which course this version updates',
    versionName: 'Enter a version name',
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
    source: 'upload' | 'url' | 'library'
    /** Media library asset id when source is library. */
    mediaId: string
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
  /** When set, quiz content is pulled from the Quizzes library. */
  libraryId: string
  title: string
  passMark: number
  maxAttempts: number
  timeLimitMin: number
  shuffle: boolean
  /** Learner must pass before unlocking the next module item. */
  mandatory: boolean
  questions: BuilderQuizQuestion[]
}

export type BuilderModuleAssignment = {
  enabled: boolean
  libraryId: string
  title: string
  brief: string
  points: number
  dueDays: number
  accept: string
  /** Learner must submit before unlocking the next module item. */
  mandatory: boolean
}

export type BuilderModule = {
  id: string
  title: string
  summary: string
  submodules: BuilderSubmodule[]
  quiz: BuilderQuiz
  assignment: BuilderModuleAssignment
}

export const courseBuilderContentCopy = {
  title: 'Course Content',
  subtitle: 'Organise modules and submodules, then attach module quizzes and assignments.',
  tabs: { content: 'Content builder', quiz: 'Module quizzes & assignments' },
  outline: 'Course outline',
  addModule: 'Add Module',
  addSubmodule: 'Add Submodule',
  moduleTitle: 'Module title',
  moduleSummary: 'Module summary',
  moduleSummaryPlaceholder: 'What will learners cover in this module?',
  modulePrefix: 'Module',
  quizBadge: 'Quiz',
  assignmentBadge: 'Assignment',
  addQuiz: 'Add quiz',
  editQuiz: 'Edit quiz',
  addAssignment: 'Add assignment',
  editAssignment: 'Edit assignment',
  assessmentsTitle: 'Module quiz & assignment',
  assessmentsHint:
    'Attach a quiz and/or assignment after this module’s content. Mark them mandatory to block progress until completed.',
  attachQuiz: 'Quiz from library',
  attachAssignment: 'Assignment from library',
  noLibraryQuiz: 'Custom quiz — edit questions on the quizzes tab',
  noLibraryAssignment: 'Choose an assignment from the library',
  quizMandatory: 'Quiz is mandatory to continue',
  assignmentMandatory: 'Assignment is mandatory to continue',
  configureQuiz: 'Open quiz editor',
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
    sourceLibrary: 'Media Library',
    upload: 'Upload video',
    replace: 'Replace video',
    uploadHint: 'MP4 or MOV, up to 2 GB',
    url: 'Video URL',
    urlPlaceholder: 'https://…',
    library: 'Choose from Media Library',
    libraryPlaceholder: 'Select a ready video…',
    libraryEmpty: 'No ready videos in the Media Library yet.',
    libraryHint: 'Only ready videos can be attached. Manage uploads in Media Library.',
    openLibrary: 'Open Media Library',
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
  title: 'Module Quizzes & Assignments',
  subtitle:
    'Attach a library quiz or assignment after a module to check understanding before learners continue.',
  selectModule: 'Module',
  enable: 'Enable quiz for this module',
  attachLibrary: 'Attach from Quizzes library',
  attachLibraryHint: 'Create quizzes under Assessments & Quizzes → Quizzes, then attach here.',
  attachNone: 'Custom quiz (edit questions below)',
  mandatory: 'Mandatory — must pass to unlock the next item',
  assignmentSection: 'Module assignment',
  enableAssignment: 'Enable assignment for this module',
  attachAssignment: 'Attach from Assignments library',
  attachAssignmentNone: 'No assignment',
  assignmentMandatory: 'Mandatory — must submit to unlock the next item',
  openLibrary: 'Manage quizzes library',
  openAssignments: 'Manage assignments library',
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
  emptyBody: 'Add the first question to this quiz, or attach one from the library.',
  disabledTitle: 'Quiz is off for this module',
  disabledBody: 'Enable the quiz to start adding questions.',
  noModules: 'Add a module first, then attach a quiz or assignment to it.',
  goToContent: 'Go to content builder',
  addFirstModule: 'Add first module',
  addFirstModuleHint: 'Creates Module 1 so you can attach a quiz or assignment right away.',
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
      mediaId: '',
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
    libraryId: '',
    title,
    passMark: 70,
    maxAttempts: 3,
    timeLimitMin: 0,
    shuffle: true,
    mandatory: true,
    questions: [],
  }
}

export function createBuilderModuleAssignment(): BuilderModuleAssignment {
  return {
    enabled: false,
    libraryId: '',
    title: '',
    brief: '',
    points: 20,
    dueDays: 7,
    accept: 'PDF, DOC, DOCX',
    mandatory: true,
  }
}

export function createBuilderModule(title = 'New module'): BuilderModule {
  return {
    id: builderId('mod'),
    title,
    summary: '',
    submodules: [],
    quiz: createBuilderQuiz(`${title} quiz`),
    assignment: createBuilderModuleAssignment(),
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
  /** Optional end-of-course quiz from the Quizzes library. */
  finalQuizId: string
  finalQuizMandatory: boolean
  /** Optional end-of-course assignment from the Assignments library. */
  finalAssignmentId: string
  finalAssignmentMandatory: boolean
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
    endAssessments: 'End-of-course quiz & assignment (optional)',
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
    finalAssessment: 'Include end-of-course assessments',
    finalPassMark: 'Final pass mark (%)',
    finalAttempts: 'Final attempts allowed',
    finalQuiz: 'Course completion quiz',
    finalQuizHint: 'Optional. Attach a quiz learners take after all modules.',
    finalQuizNone: 'No end-of-course quiz',
    finalQuizMandatory: 'Mandatory — must pass to complete the course',
    finalAssignment: 'Course completion assignment',
    finalAssignmentHint: 'Optional. Attach a final assignment after all modules.',
    finalAssignmentNone: 'No end-of-course assignment',
    finalAssignmentMandatory: 'Mandatory — must submit to complete the course',
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
  finalQuizId: '',
  finalQuizMandatory: false,
  finalAssignmentId: '',
  finalAssignmentMandatory: false,
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
    versionKind: '',
    parentCourseId: '',
    versionName: '',
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

export function createDefaultCourseBuilderModules(): BuilderModule[] {
  return []
}

export const courseBuilderPublishChecks = {
  title: 'Course title',
  code: 'Course code',
  category: 'Category selected',
  description: 'Short description',
  version: 'Version details',
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
      id: 'version',
      label: labels.version,
      passed: isCourseBuilderVersionReady(details),
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
