export type ScormPackageStatus = 'validated' | 'failed' | 'processing'
export type ScormVersion = 'SCORM 1.2' | 'SCORM 2004 3rd Ed.' | 'SCORM 2004 4th Ed.'
export type ScormIssueSeverity = 'error' | 'warning' | 'info'

export type ScormPackage = {
  id: string
  name: string
  file: string
  course: string
  version: ScormVersion
  size: string
  status: ScormPackageStatus
  uploadedBy: string
  uploaded: string
  errors: number
  warnings: number
}

export type ScormValidationCheck = {
  id: string
  label: string
  result: 'pass' | 'fail' | 'warn' | 'pending'
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
    id: 'pkg-fire-safety',
    name: 'Fire Safety Essentials',
    file: 'fire-safety-essentials-v3.zip',
    course: 'Workplace Safety Fundamentals',
    version: 'SCORM 2004 4th Ed.',
    size: '84.2 MB',
    status: 'validated',
    uploadedBy: 'Noura Al-Sabah',
    uploaded: 'Nov 8, 2026',
    errors: 0,
    warnings: 1,
  },
  {
    id: 'pkg-data-privacy',
    name: 'Data Privacy & GDPR',
    file: 'data-privacy-gdpr.zip',
    course: 'Data Protection for Teams',
    version: 'SCORM 1.2',
    size: '31.7 MB',
    status: 'failed',
    uploadedBy: 'Faisal Al-Mutairi',
    uploaded: 'Nov 7, 2026',
    errors: 3,
    warnings: 2,
  },
  {
    id: 'pkg-leadership',
    name: 'Leading High-Performing Teams',
    file: 'leadership-hpt-module1.zip',
    course: 'Leadership Essentials',
    version: 'SCORM 2004 3rd Ed.',
    size: '122.9 MB',
    status: 'processing',
    uploadedBy: 'Noura Al-Sabah',
    uploaded: 'Nov 10, 2026',
    errors: 0,
    warnings: 0,
  },
  {
    id: 'pkg-cyber',
    name: 'Cybersecurity Awareness',
    file: 'cyber-awareness-2026.zip',
    course: 'Cybersecurity for Everyone',
    version: 'SCORM 2004 4th Ed.',
    size: '56.4 MB',
    status: 'validated',
    uploadedBy: 'Hessa Al-Rashid',
    uploaded: 'Nov 5, 2026',
    errors: 0,
    warnings: 0,
  },
  {
    id: 'pkg-hse-induction',
    name: 'HSE Site Induction',
    file: 'hse-site-induction.zip',
    course: 'HSE Induction',
    version: 'SCORM 1.2',
    size: '18.3 MB',
    status: 'failed',
    uploadedBy: 'Faisal Al-Mutairi',
    uploaded: 'Nov 3, 2026',
    errors: 1,
    warnings: 0,
  },
  {
    id: 'pkg-customer-service',
    name: 'Customer Service Excellence',
    file: 'cs-excellence-v2.zip',
    course: 'Customer Service Skills',
    version: 'SCORM 1.2',
    size: '47.0 MB',
    status: 'validated',
    uploadedBy: 'Hessa Al-Rashid',
    uploaded: 'Oct 29, 2026',
    errors: 0,
    warnings: 3,
  },
]

export const contentScormValidationPage = {
  title: 'Package Validation',
  subtitle: 'Review manifest, structure and runtime checks for this SCORM package.',
  back: 'Back to SCORM Packages',
  selectPackage: 'Package',
  revalidate: 'Re-validate',
  download: 'Download report',
  revalidateNotice: 'Re-validation queued. Results will refresh shortly.',
  downloadNotice: 'Validation report download started.',
  summary: {
    errors: 'Errors',
    warnings: 'Warnings',
    passed: 'Checks passed',
    standard: 'Standard',
  },
  checksTitle: 'Validation checks',
  checksDescription: 'Automated checks run against the package on upload.',
  issuesTitle: 'Issues',
  issuesDescription: 'Fix errors before this package can be linked to a published course.',
  filters: {
    all: 'All',
    error: 'Errors',
    warning: 'Warnings',
    info: 'Info',
  },
  severity: {
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
  fileLabel: 'File',
  lineLabel: 'line',
  fixLabel: 'Suggested fix',
  allClearTitle: 'No issues in this view',
  allClearBody: 'This package has nothing to report for the selected severity.',
  processingTitle: 'Validation in progress',
  processingBody: 'This package is still being processed. The report will be available shortly.',
  failedBanner: 'This package failed validation and cannot be linked to a course.',
  passedBanner: 'This package passed validation and is ready to link to a course.',
  resultLabel: { pass: 'Passed', fail: 'Failed', warn: 'Warning', pending: 'Pending' },
} as const

const standardChecks: Pick<ScormValidationCheck, 'id' | 'label'>[] = [
  { id: 'zip', label: 'Archive is a valid .zip file' },
  { id: 'manifest', label: 'imsmanifest.xml present at package root' },
  { id: 'schema', label: 'Manifest conforms to the SCORM schema' },
  { id: 'resources', label: 'All referenced resources exist' },
  { id: 'launch', label: 'Launch file resolves and loads' },
  { id: 'api', label: 'SCORM runtime API discovered' },
  { id: 'sequencing', label: 'Sequencing & navigation rules valid' },
]

const checkResults: Record<string, ScormValidationCheck['result'][]> = {
  'pkg-fire-safety': ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'warn'],
  'pkg-data-privacy': ['pass', 'pass', 'fail', 'fail', 'pass', 'warn', 'pass'],
  'pkg-leadership': ['pass', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
  'pkg-cyber': ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass'],
  'pkg-hse-induction': ['pass', 'pass', 'pass', 'pass', 'fail', 'pass', 'pass'],
  'pkg-customer-service': ['pass', 'pass', 'warn', 'pass', 'pass', 'pass', 'warn'],
}

export function getScormValidationChecks(packageId: string): ScormValidationCheck[] {
  const results = checkResults[packageId] ?? checkResults['pkg-cyber']
  return standardChecks.map((check, index) => ({ ...check, result: results[index] }))
}

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
    detail: 'The runtime API is located after traversing 9 parent frames; some LMS players limit this to 7.',
    file: 'content/module1.html',
    fix: 'Reduce frame nesting or include an API finder with a higher depth limit.',
  },
  {
    id: 'iss-5',
    packageId: 'pkg-data-privacy',
    severity: 'warning',
    code: 'SIZE_HINT_010',
    title: 'Large media file detected',
    detail: 'media/intro-video.mp4 is 18.4 MB and may slow initial load on low bandwidth connections.',
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
