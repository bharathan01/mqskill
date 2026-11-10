export type ScormPackageStatus = 'validated' | 'failed' | 'processing'
export type ScormVersion = 'SCORM 1.2' | 'SCORM 2004 3rd Ed.' | 'SCORM 2004 4th Ed.'
export type ScormIssueSeverity = 'error' | 'warning' | 'info'
export type ScormCheckResult = 'pass' | 'fail' | 'warn' | 'skip' | 'pending'

export type ScormPackage = {
  id: string
  name: string
  file: string
  course: string
  courseVersion: string
  version: ScormVersion
  size: string
  files: number
  source: string
  status: ScormPackageStatus
  uploadedBy: string
  uploaded: string
  errors: number
  warnings: number
}

export type ScormValidationCheck = {
  id: string
  group: string
  label: string
  result: ScormCheckResult
  detail?: string
  fix?: string
}

export type ScormValidationIssue = {
  id: string
  packageId: string
  severity: ScormIssueSeverity
  code: string
  title: string
  detail: string
  file: string
  line?: number
  fix: string
}

export type ScormValidationRun = {
  id: string
  packageId: string
  at: string
  errors: number
  warnings: number
  status: 'failed' | 'passed'
}

export const contentScormPage = {
  title: 'SCORM Packages',
  subtitle: 'Upload, validate and manage SCORM content packages used across your courses.',
  upload: 'Upload Package',
  searchPlaceholder: 'Search by package, file or course…',
  allStatuses: 'All statuses',
  allVersions: 'All versions',
  status: {
    validated: 'Validated',
    failed: 'Failed',
    processing: 'Processing',
  },
  metrics: {
    total: 'Total packages',
    validated: 'Validated',
    failed: 'Failed',
    processing: 'Processing',
  },
  columns: {
    package: 'Package',
    course: 'Linked course',
    version: 'Standard',
    size: 'Size',
    status: 'Status',
    issues: 'Issues',
    uploaded: 'Uploaded',
    actions: 'Actions',
  },
  actions: {
    report: 'View validation report',
    revalidate: 'Re-validate',
    download: 'Download package',
    remove: 'Delete package',
  },
  noIssues: 'None',
  emptyTitle: 'No SCORM packages found',
  emptyBody: 'Upload a package or adjust your search and filters to see results.',
  clearFilters: 'Clear filters',
  showing: 'Showing',
  of: 'of',
  packages: 'packages',
  dropzoneTitle: 'Drag and drop a SCORM .zip here',
  dropzoneBody: 'Supports SCORM 1.2 and SCORM 2004 packages up to 500 MB.',
  dropzoneBrowse: 'Browse files',
  uploadNotice: 'uploaded. Validation has started.',
  revalidateNotice: 'queued for re-validation.',
  removeNotice: 'deleted from the library.',
  downloadNotice: 'download started.',
} as const

export const contentScormPackages: ScormPackage[] = [
  {
    id: 'pkg-pm-fundamentals',
    name: 'PM Fundamentals',
    file: 'PM_Fundamentals_v1.0.zip',
    course: 'Project Management Fund.',
    courseVersion: 'v1.0 · draft',
    version: 'SCORM 1.2',
    size: '188.0 MB',
    files: 412,
    source: 'Uploaded',
    status: 'failed',
    uploadedBy: 'Sara Ahmed',
    uploaded: '06 Nov 2026, 11:30',
    errors: 2,
    warnings: 2,
  },
  {
    id: 'pkg-fire-safety',
    name: 'Fire Safety Essentials',
    file: 'fire-safety-essentials-v3.zip',
    course: 'Workplace Safety Fundamentals',
    courseVersion: 'v3.1 · live',
    version: 'SCORM 2004 4th Ed.',
    size: '84.2 MB',
    files: 186,
    source: 'Uploaded',
    status: 'validated',
    uploadedBy: 'Noura Al-Sabah',
    uploaded: '08 Nov 2026, 09:15',
    errors: 0,
    warnings: 1,
  },
  {
    id: 'pkg-data-privacy',
    name: 'Data Privacy & GDPR',
    file: 'data-privacy-gdpr.zip',
    course: 'Data Protection for Teams',
    courseVersion: 'v1.2 · draft',
    version: 'SCORM 1.2',
    size: '31.7 MB',
    files: 94,
    source: 'Uploaded',
    status: 'failed',
    uploadedBy: 'Faisal Al-Mutairi',
    uploaded: '07 Nov 2026, 14:22',
    errors: 3,
    warnings: 2,
  },
  {
    id: 'pkg-leadership',
    name: 'Leading High-Performing Teams',
    file: 'leadership-hpt-module1.zip',
    course: 'Leadership Essentials',
    courseVersion: 'v1.0 · draft',
    version: 'SCORM 2004 3rd Ed.',
    size: '122.9 MB',
    files: 240,
    source: 'Uploaded',
    status: 'processing',
    uploadedBy: 'Noura Al-Sabah',
    uploaded: '10 Nov 2026, 08:05',
    errors: 0,
    warnings: 0,
  },
  {
    id: 'pkg-cyber',
    name: 'Cybersecurity Awareness',
    file: 'cyber-awareness-2026.zip',
    course: 'Cybersecurity for Everyone',
    courseVersion: 'v2.0 · live',
    version: 'SCORM 2004 4th Ed.',
    size: '56.4 MB',
    files: 128,
    source: 'Imported',
    status: 'validated',
    uploadedBy: 'Hessa Al-Rashid',
    uploaded: '05 Nov 2026, 16:40',
    errors: 0,
    warnings: 0,
  },
  {
    id: 'pkg-hse-induction',
    name: 'HSE Site Induction',
    file: 'hse-site-induction.zip',
    course: 'HSE Induction',
    courseVersion: 'v1.0 · draft',
    version: 'SCORM 1.2',
    size: '18.3 MB',
    files: 52,
    source: 'Uploaded',
    status: 'failed',
    uploadedBy: 'Faisal Al-Mutairi',
    uploaded: '03 Nov 2026, 11:10',
    errors: 1,
    warnings: 0,
  },
  {
    id: 'pkg-customer-service',
    name: 'Customer Service Excellence',
    file: 'cs-excellence-v2.zip',
    course: 'Customer Service Skills',
    courseVersion: 'v2.0 · live',
    version: 'SCORM 1.2',
    size: '47.0 MB',
    files: 110,
    source: 'Uploaded',
    status: 'validated',
    uploadedBy: 'Hessa Al-Rashid',
    uploaded: '29 Oct 2026, 13:55',
    errors: 0,
    warnings: 3,
  },
]

export const contentScormValidationPage = {
  title: 'Validation Report',
  crumbScorm: 'SCORM Content',
  crumbValidation: 'Package Validation',
  back: 'Back to SCORM Packages',
  selectPackage: 'Package',
  download: 'Download report',
  revalidate: 'Re-run validation',
  uploadFixed: 'Upload fixed package',
  revalidateNotice: 'Re-validation queued. Results will refresh shortly.',
  downloadNotice: 'Validation report download started.',
  uploadFixedNotice: 'Choose a fixed .zip to replace this package and re-validate.',
  launchNotice: 'Opening package in the test player…',
  launchBlocked: 'Fix errors to test-launch',
  launch: 'Launch in test player',
  summary: {
    checks: 'Checks run',
    passed: 'Passed',
    warnings: 'Warnings',
    errors: 'Errors',
  },
  checksTitle: 'Validation checks',
  checksDescription: 'Errors block publishing. Warnings can be published but should be reviewed.',
  filterAll: 'All results',
  filterPass: 'Passed',
  filterFail: 'Errors',
  filterWarn: 'Warnings',
  filterSkip: 'Skipped',
  detailsTitle: 'Package details',
  details: {
    course: 'Course',
    version: 'Version',
    standard: 'Standard',
    size: 'Size',
    files: 'Files',
    source: 'Source',
  },
  testLaunchTitle: 'Test launch',
  historyTitle: 'Validation history',
  historyLink: 'Package History',
  severity: {
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
  resultLabel: {
    pass: 'Passed',
    fail: 'Error',
    warn: 'Warning',
    skip: 'Skipped',
    pending: 'Pending',
  },
  status: {
    validated: 'Validated',
    failed: 'Failed',
    processing: 'Processing',
    passed: 'Passed',
  },
  processingTitle: 'Validation in progress',
  processingBody: 'This package is still being processed. The report will be available shortly.',
  uploadedPrefix: 'uploaded',
  by: 'by',
} as const

const defaultChecks: Omit<ScormValidationCheck, 'result'>[] = [
  {
    id: 'manifest-root',
    group: 'Manifest',
    label: 'imsmanifest.xml not found at package root',
    detail: 'The manifest is inside /PM_Fundamentals/ instead of the .zip root.',
    fix: 'Re-zip the package so imsmanifest.xml sits at the top level.',
  },
  {
    id: 'zip-structure',
    group: 'Manifest',
    label: 'Zip structure readable',
    detail: '412 files extracted',
  },
  {
    id: 'package-size',
    group: 'Manifest',
    label: 'Package size under 2 GB',
    detail: '188.0 MB',
  },
  {
    id: 'launch-file',
    group: 'Runtime & API',
    label: 'Launch file "index_lms.html" is missing',
    detail: 'Referenced by the organisation item but not found in the package.',
    fix: 'Add the file or update the launch path in the manifest.',
  },
  {
    id: 'lesson-status',
    group: 'Runtime & API',
    label: 'cmi.core.lesson_status is not set on exit',
    detail: 'Completion may not be recorded if the learner closes the window.',
  },
  {
    id: 'api-calls',
    group: 'Runtime & API',
    label: 'SCORM API calls detected',
    detail: 'LMSInitialize, LMSSetValue, LMSCommit, LMSFinish',
  },
  {
    id: 'video-resolution',
    group: 'Content & Media',
    label: '2 videos are above 1080p',
    detail: 'Large files may buffer on slower connections. Consider re-encoding.',
  },
  {
    id: 'resource-refs',
    group: 'Content & Media',
    label: 'Resource references',
    detail: 'Skipped until the manifest error is fixed.',
  },
  {
    id: 'external-urls',
    group: 'Content & Media',
    label: 'No external URLs or trackers',
    detail: 'All assets are packaged locally',
  },
]

const checkResultsByPackage: Record<string, ScormCheckResult[]> = {
  'pkg-pm-fundamentals': ['fail', 'pass', 'pass', 'fail', 'warn', 'pass', 'warn', 'skip', 'pass'],
  'pkg-fire-safety': ['pass', 'pass', 'pass', 'pass', 'warn', 'pass', 'pass', 'pass', 'pass'],
  'pkg-data-privacy': ['pass', 'pass', 'pass', 'fail', 'warn', 'pass', 'warn', 'fail', 'pass'],
  'pkg-leadership': [
    'pass',
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
  ],
  'pkg-cyber': ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass'],
  'pkg-hse-induction': ['pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass'],
  'pkg-customer-service': ['pass', 'pass', 'pass', 'pass', 'warn', 'pass', 'warn', 'pass', 'warn'],
}

const checkOverrides: Record<
  string,
  Partial<Record<string, Pick<ScormValidationCheck, 'label' | 'detail' | 'fix'>>>
> = {
  'pkg-data-privacy': {
    'manifest-root': {
      label: 'Manifest schema version invalid',
      detail: 'schemaversion declares "1.3" which is not a recognised SCORM 1.2 value.',
      fix: 'Set schemaversion to "1.2" or re-export as SCORM 2004.',
    },
    'launch-file': {
      label: 'Referenced resource not found',
      detail: 'Resource "res_intro" points to content/intro.html, which is missing.',
      fix: 'Add content/intro.html or update the resource href.',
    },
    'resource-refs': {
      label: 'Asset missing: shared/scripts/scorm-wrapper.js',
      detail: 'The launch page loads scorm-wrapper.js but the file is not in the package.',
      fix: 'Include the wrapper script in the shared/scripts folder.',
    },
  },
  'pkg-fire-safety': {
    'manifest-root': {
      label: 'imsmanifest.xml present at package root',
      detail: 'Manifest found at archive root',
    },
    'launch-file': {
      label: 'Launch file resolves and loads',
      detail: 'index_lms.html loads without script errors',
    },
    'lesson-status': {
      label: 'Unused sequencing rule',
      detail: 'Rule "pre-condition-skip" is defined but never applies to any activity.',
    },
  },
  'pkg-cyber': {
    'manifest-root': {
      label: 'imsmanifest.xml present at package root',
      detail: 'Manifest found at archive root',
    },
    'launch-file': {
      label: 'Launch file resolves and loads',
      detail: 'index.html loads without script errors',
    },
    'lesson-status': {
      label: 'cmi.core.lesson_status set on exit',
      detail: 'Completion status is written before LMSFinish',
    },
    'video-resolution': {
      label: 'Video assets within 1080p',
      detail: 'All videos are 720p or 1080p',
    },
    'resource-refs': {
      label: 'All resource references resolve',
      detail: '128 of 128 resources found',
    },
  },
  'pkg-hse-induction': {
    'manifest-root': {
      label: 'imsmanifest.xml present at package root',
      detail: 'Manifest found at archive root',
    },
    'launch-file': {
      label: 'Launch file did not load',
      detail: 'index_lms.html returned "API is not defined" during initialisation.',
      fix: 'Call LMSInitialize only after the API adapter has been located.',
    },
  },
  'pkg-customer-service': {
    'manifest-root': {
      label: 'imsmanifest.xml present at package root',
      detail: 'Manifest found at archive root',
    },
    'launch-file': {
      label: 'Launch file resolves and loads',
      detail: 'index.html loads without script errors',
    },
    'external-urls': {
      label: 'Uncompressed images',
      detail: '14 PNG files exceed 1 MB each.',
      fix: 'Convert large PNG files to optimised JPEG or WebP.',
    },
  },
}

export function getScormValidationChecks(packageId: string): ScormValidationCheck[] {
  const results = checkResultsByPackage[packageId] ?? checkResultsByPackage['pkg-cyber']
  const overrides = checkOverrides[packageId] ?? {}
  const pkg = getScormPackage(packageId)

  return defaultChecks.map((check, index) => {
    const override = overrides[check.id]
    const detail =
      override?.detail ??
      (check.id === 'zip-structure' && pkg
        ? `${pkg.files} files extracted`
        : check.id === 'package-size' && pkg
          ? pkg.size
          : check.detail)
    return {
      ...check,
      ...override,
      detail,
      result: results[index] ?? 'pending',
    }
  })
}

export const contentScormValidationHistory: ScormValidationRun[] = [
  {
    id: 'run-pm-1',
    packageId: 'pkg-pm-fundamentals',
    at: '06 Nov 2026, 11:30',
    errors: 2,
    warnings: 2,
    status: 'failed',
  },
  {
    id: 'run-pm-2',
    packageId: 'pkg-pm-fundamentals',
    at: '05 Nov 2026, 17:02',
    errors: 3,
    warnings: 2,
    status: 'failed',
  },
  {
    id: 'run-pm-3',
    packageId: 'pkg-pm-fundamentals',
    at: '05 Nov 2026, 09:40',
    errors: 5,
    warnings: 4,
    status: 'failed',
  },
  {
    id: 'run-dp-1',
    packageId: 'pkg-data-privacy',
    at: '07 Nov 2026, 14:22',
    errors: 3,
    warnings: 2,
    status: 'failed',
  },
  {
    id: 'run-fs-1',
    packageId: 'pkg-fire-safety',
    at: '08 Nov 2026, 09:15',
    errors: 0,
    warnings: 1,
    status: 'passed',
  },
  {
    id: 'run-cyber-1',
    packageId: 'pkg-cyber',
    at: '05 Nov 2026, 16:40',
    errors: 0,
    warnings: 0,
    status: 'passed',
  },
]

export const contentScormIssues: ScormValidationIssue[] = [
  {
    id: 'iss-1',
    packageId: 'pkg-data-privacy',
    severity: 'error',
    code: 'MANIFEST_SCHEMA_001',
    title: 'Invalid manifest schema version',
    detail: 'The <schemaversion> element declares "1.3" which is not a recognised SCORM 1.2 value.',
    file: 'imsmanifest.xml',
    line: 6,
    fix: 'Set <schemaversion> to "1.2" or re-export the package as SCORM 2004.',
  },
  {
    id: 'iss-2',
    packageId: 'pkg-data-privacy',
    severity: 'error',
    code: 'RESOURCE_MISSING_004',
    title: 'Referenced resource not found',
    detail: 'Resource "res_intro" points to content/intro.html, which is missing from the archive.',
    file: 'imsmanifest.xml',
    line: 28,
    fix: 'Add content/intro.html to the package or update the resource href.',
  },
  {
    id: 'iss-3',
    packageId: 'pkg-data-privacy',
    severity: 'error',
    code: 'RESOURCE_MISSING_005',
    title: 'Asset missing: shared/scripts/scorm-wrapper.js',
    detail: 'The launch page loads scorm-wrapper.js but the file is not included in the package.',
    file: 'content/module1.html',
    line: 12,
    fix: 'Include the wrapper script in the shared/scripts folder.',
  },
  {
    id: 'iss-4',
    packageId: 'pkg-data-privacy',
    severity: 'warning',
    code: 'API_DISCOVERY_002',
    title: 'SCORM API found only in parent frame',
    detail:
      'The runtime API is located after traversing 9 parent frames; some LMS players limit this to 7.',
    file: 'content/module1.html',
    fix: 'Reduce frame nesting or include an API finder with a higher depth limit.',
  },
  {
    id: 'iss-5',
    packageId: 'pkg-data-privacy',
    severity: 'warning',
    code: 'SIZE_HINT_010',
    title: 'Large media file detected',
    detail:
      'media/intro-video.mp4 is 18.4 MB and may slow initial load on low bandwidth connections.',
    file: 'media/intro-video.mp4',
    fix: 'Compress the video or stream it from the Media Library.',
  },
  {
    id: 'iss-6',
    packageId: 'pkg-data-privacy',
    severity: 'info',
    code: 'METADATA_020',
    title: 'No LOM metadata supplied',
    detail: 'Optional learning object metadata was not found in the manifest.',
    file: 'imsmanifest.xml',
    fix: 'Add <metadata> with title and description for better catalogue search.',
  },
  {
    id: 'iss-7',
    packageId: 'pkg-hse-induction',
    severity: 'error',
    code: 'LAUNCH_FAIL_003',
    title: 'Launch file did not load',
    detail: 'index_lms.html returned a script error: "API is not defined" during initialisation.',
    file: 'index_lms.html',
    line: 41,
    fix: 'Call LMSInitialize only after the API adapter has been located.',
  },
  {
    id: 'iss-8',
    packageId: 'pkg-fire-safety',
    severity: 'warning',
    code: 'SEQUENCING_007',
    title: 'Unused sequencing rule',
    detail: 'Rule "pre-condition-skip" is defined but never applies to any activity.',
    file: 'imsmanifest.xml',
    line: 112,
    fix: 'Remove the rule or attach it to an activity.',
  },
  {
    id: 'iss-9',
    packageId: 'pkg-customer-service',
    severity: 'warning',
    code: 'MANIFEST_SCHEMA_011',
    title: 'Deprecated element used',
    detail: 'The <adlcp:datafromlms> element is deprecated in newer SCORM editions.',
    file: 'imsmanifest.xml',
    line: 34,
    fix: 'Use <adlcp:launchdata> instead.',
  },
  {
    id: 'iss-10',
    packageId: 'pkg-customer-service',
    severity: 'warning',
    code: 'SEQUENCING_008',
    title: 'Mastery score not defined',
    detail: 'No <adlcp:masteryscore> was found; completion will rely on lesson status only.',
    file: 'imsmanifest.xml',
    fix: 'Add a mastery score to enforce a pass threshold.',
  },
  {
    id: 'iss-11',
    packageId: 'pkg-customer-service',
    severity: 'warning',
    code: 'SIZE_HINT_011',
    title: 'Uncompressed images',
    detail: '14 PNG files exceed 1 MB each.',
    file: 'content/images/',
    fix: 'Convert large PNG files to optimised JPEG or WebP.',
  },
]

export function getScormPackage(id: string | null | undefined) {
  return contentScormPackages.find((item) => item.id === id)
}

export function getScormIssues(packageId: string) {
  return contentScormIssues.filter((issue) => issue.packageId === packageId)
}

export function getScormValidationHistory(packageId: string) {
  return contentScormValidationHistory.filter((run) => run.packageId === packageId)
}
