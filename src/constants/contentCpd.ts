export type CpdAccreditor = {
  id: string
  name: string
  region: string
  code: string
  enabled: boolean
  hoursPerYear: number
}

export type CpdCourseRequirement = {
  id: string
  course: string
  code: string
  accreditorId: string
  hours: number
  minScore: number
  minAttendance: number
  active: boolean
}

export const contentCpdPage = {
  title: 'CPD Configuration',
  subtitle: 'Define how CPD hours are awarded, which bodies accredit them and what each course requires.',
  save: 'Save changes',
  saveNotice: 'CPD configuration saved.',
  reset: 'Reset',
  resetNotice: 'Changes discarded.',
  metrics: {
    hours: 'Total CPD hours offered',
    courses: 'Courses with CPD',
    accreditors: 'Active accreditors',
    pending: 'Pending approvals',
  },
  rules: {
    title: 'Hour calculation rules',
    description: 'Controls how CPD hours are calculated across the catalogue.',
    method: 'Calculation method',
    methods: [
      { id: 'duration', label: 'Learning duration (video + reading time)' },
      { id: 'fixed', label: 'Fixed hours set per course' },
      { id: 'hybrid', label: 'Hybrid (fixed hours, capped by duration)' },
    ],
    rounding: 'Rounding',
    roundings: [
      { id: 'quarter', label: 'Nearest 0.25 hour' },
      { id: 'half', label: 'Nearest 0.5 hour' },
      { id: 'whole', label: 'Nearest whole hour' },
    ],
    maxPerCourse: 'Max hours per course',
    maxPerYear: 'Max hours per learner per year',
    expiry: 'CPD validity (months)',
    expiryHint: 'How long awarded hours remain valid for reporting.',
    minScore: 'Default minimum assessment score (%)',
    requireAssessment: 'Require passing the final assessment',
    requireAssessmentHint: 'CPD hours are only awarded once the final assessment is passed.',
    autoAward: 'Award hours automatically on completion',
    autoAwardHint: 'Disable to require manual approval by a Content Admin.',
    showOnCertificate: 'Show CPD hours on certificates',
    showOnCertificateHint: 'Prints the awarded hours and accreditor on the certificate.',
  },
  accreditation: {
    title: 'Accreditation settings',
    description: 'Enable the bodies that recognise your CPD hours.',
    region: 'Region',
    code: 'Accreditor code',
    hours: 'Hours / year',
    enabled: 'Enabled',
    disabled: 'Disabled',
    addAccreditor: 'Add accreditor',
    newAccreditor: 'New accreditor',
    newAccreditorRegion: 'Custom',
    toggle: 'Toggle accreditor',
    remove: 'Remove accreditor',
  },
  requirements: {
    title: 'Course requirements',
    description: 'Per-course CPD hours and completion criteria.',
    searchPlaceholder: 'Search courses…',
    columns: {
      course: 'Course',
      accreditor: 'Accreditor',
      hours: 'CPD hours',
      score: 'Min score %',
      attendance: 'Min attendance %',
      status: 'CPD',
    },
    active: 'Active',
    inactive: 'Off',
    emptyTitle: 'No courses match',
    emptyBody: 'Try a different search term.',
  },
  summary: {
    title: 'Configuration summary',
    labels: {
      method: 'Method',
      rounding: 'Rounding',
      cap: 'Course cap',
      annual: 'Annual cap',
      validity: 'Validity',
    },
    months: 'months',
    hours: 'hrs',
  },
} as const

export const contentCpdDefaults = {
  method: '',
  rounding: '',
  maxPerCourse: '',
  maxPerYear: '',
  expiry: '',
  minScore: '',
  requireAssessment: false,
  autoAward: false,
  showOnCertificate: false,
}

export const contentCpdAccreditors: CpdAccreditor[] = [
  {
    id: 'cpd-kw',
    name: 'Kuwait Institute for Professional Development',
    region: 'Kuwait',
    code: 'KIPD-2026',
    enabled: true,
    hoursPerYear: 40,
  },
  {
    id: 'cpd-iosh',
    name: 'IOSH',
    region: 'United Kingdom',
    code: 'IOSH-CPD-8841',
    enabled: true,
    hoursPerYear: 30,
  },
  {
    id: 'cpd-pmi',
    name: 'PMI Professional Development Units',
    region: 'Global',
    code: 'PMI-PDU-5520',
    enabled: false,
    hoursPerYear: 60,
  },
  {
    id: 'cpd-cipd',
    name: 'CIPD',
    region: 'United Kingdom',
    code: 'CIPD-AP-1190',
    enabled: true,
    hoursPerYear: 35,
  },
]

export const contentCpdRequirements: CpdCourseRequirement[] = [
  {
    id: 'req-1',
    course: 'Workplace Safety Fundamentals',
    code: 'HSE-101',
    accreditorId: 'cpd-iosh',
    hours: 6,
    minScore: 70,
    minAttendance: 90,
    active: true,
  },
  {
    id: 'req-2',
    course: 'Data Protection for Teams',
    code: 'DPT-210',
    accreditorId: 'cpd-kw',
    hours: 4,
    minScore: 75,
    minAttendance: 80,
    active: true,
  },
  {
    id: 'req-3',
    course: 'Leadership Essentials',
    code: 'LDR-120',
    accreditorId: 'cpd-cipd',
    hours: 8,
    minScore: 70,
    minAttendance: 85,
    active: true,
  },
  {
    id: 'req-4',
    course: 'Cybersecurity for Everyone',
    code: 'CYB-100',
    accreditorId: 'cpd-kw',
    hours: 3,
    minScore: 80,
    minAttendance: 75,
    active: false,
  },
  {
    id: 'req-5',
    course: 'Project Management Basics',
    code: 'PMG-130',
    accreditorId: 'cpd-pmi',
    hours: 10,
    minScore: 70,
    minAttendance: 90,
    active: false,
  },
]
