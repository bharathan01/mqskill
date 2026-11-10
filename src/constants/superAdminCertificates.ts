/* Super Admin · Certificates & CPD (Figma section 04) — sample data */

export type SuperAdminCertificateKpi = {
  id: string
  label: string
  value: string
  detail: string
}

export type SuperAdminChartPoint = { label: string; value: number }

/* ---------------------------- Issued certificates ---------------------------- */

export type SuperAdminCertificateStatus = 'Valid' | 'Expiring soon' | 'Expired'
export type SuperAdminCertificateType = 'Completion' | 'CPD'
export type SuperAdminLearnerType = 'Individual' | 'Organization'

export type SuperAdminIssuedCertificate = {
  id: string
  learner: string
  learnerType: SuperAdminLearnerType
  org: string
  course: string
  version: string
  type: SuperAdminCertificateType
  cpdHours: number
  issued: string
  expiry: string
  status: SuperAdminCertificateStatus
}

export const superAdminIssuedSubtitle = 'Issued certificates, CPD credits and public verification.'

export const superAdminIssuedKpis: SuperAdminCertificateKpi[] = [
  { id: 'issued', label: 'Issued this period', value: '1,402', detail: 'all types' },
  { id: 'cpd', label: 'CPD certificates', value: '918', detail: 'this period' },
  { id: 'hours', label: 'CPD hours awarded', value: '3,964.5', detail: 'this period' },
  { id: 'valid', label: 'Valid', value: '15,820', detail: 'cumulative' },
  { id: 'expired', label: 'Expired', value: '1,206', detail: 'cumulative' },
  { id: 'expiring', label: 'Expiring in 30 days', value: '38', detail: 'needs renewal' },
]

export const superAdminIssuedCertificates: SuperAdminIssuedCertificate[] = [
  { id: 'MQ-CERT-48201', learner: 'Fatima Al-Mutairi', learnerType: 'Organization', org: 'ABC Corp', course: 'Fire Warden Training', version: 'v2.1', type: 'CPD', cpdHours: 6, issued: '09 Nov 2026', expiry: '09 Nov 2028', status: 'Valid' },
  { id: 'MQ-CERT-48197', learner: 'Yousef Al-Rashidi', learnerType: 'Individual', org: '—', course: 'ISO 9001 Lead Auditor', version: 'v3.0', type: 'CPD', cpdHours: 35, issued: '08 Nov 2026', expiry: '08 Nov 2029', status: 'Valid' },
  { id: 'MQ-CERT-48183', learner: 'Noura Al-Sabah', learnerType: 'Organization', org: 'Gulf Logistics Co.', course: 'First Aid at Work', version: 'v3.0', type: 'CPD', cpdHours: 12, issued: '07 Nov 2026', expiry: '07 Nov 2029', status: 'Valid' },
  { id: 'MQ-CERT-48160', learner: 'Hassan Al-Enezi', learnerType: 'Organization', org: 'ABC Corp', course: 'Manual Handling', version: 'v1.6', type: 'Completion', cpdHours: 0, issued: '05 Nov 2026', expiry: '05 Nov 2027', status: 'Valid' },
  { id: 'MQ-CERT-47942', learner: 'Mariam Al-Kandari', learnerType: 'Individual', org: '—', course: 'ISO 14001 Internal Auditor', version: 'v2.0', type: 'CPD', cpdHours: 21, issued: '29 Oct 2026', expiry: '29 Oct 2029', status: 'Valid' },
  { id: 'MQ-CERT-47811', learner: 'Omar Al-Ajmi', learnerType: 'Organization', org: 'Kuwait Marine Services', course: 'Working at Height', version: 'v2.0', type: 'Completion', cpdHours: 0, issued: '21 Oct 2026', expiry: '21 Oct 2028', status: 'Valid' },
  { id: 'MQ-CERT-47650', learner: 'Dana Al-Failakawi', learnerType: 'Individual', org: '—', course: 'NEBOSH IGC Preparation', version: 'v2.1', type: 'CPD', cpdHours: 40, issued: '14 Oct 2026', expiry: '14 Oct 2029', status: 'Valid' },
  { id: 'MQ-CERT-31207', learner: 'Khalid Al-Dosari', learnerType: 'Organization', org: 'Al-Noor Contracting', course: 'COSHH Awareness', version: 'v1.4', type: 'Completion', cpdHours: 0, issued: '18 Nov 2025', expiry: '18 Nov 2026', status: 'Expiring soon' },
  { id: 'MQ-CERT-30944', learner: 'Sara Al-Hajri', learnerType: 'Organization', org: 'ABC Corp', course: 'Food Hygiene Level 2', version: 'v1.1', type: 'Completion', cpdHours: 0, issued: '24 Nov 2025', expiry: '24 Nov 2026', status: 'Expiring soon' },
  { id: 'MQ-CERT-27518', learner: 'Bader Al-Otaibi', learnerType: 'Organization', org: 'Burgan Facility Mgmt', course: 'Fire Warden Training', version: 'v1.8', type: 'CPD', cpdHours: 6, issued: '02 Nov 2024', expiry: '02 Nov 2026', status: 'Expired' },
  { id: 'MQ-CERT-26302', learner: 'Latifa Al-Azmi', learnerType: 'Individual', org: '—', course: 'First Aid at Work', version: 'v2.2', type: 'CPD', cpdHours: 12, issued: '11 Sep 2023', expiry: '11 Sep 2026', status: 'Expired' },
  { id: 'MQ-CERT-48120', learner: 'Faisal Al-Shammari', learnerType: 'Organization', org: 'Gulf Logistics Co.', course: 'Cybersecurity Awareness for Employees', version: 'v1.2', type: 'Completion', cpdHours: 0, issued: '03 Nov 2026', expiry: '03 Nov 2027', status: 'Valid' },
]

export const superAdminIssuedTabs = [
  { id: 'all', label: 'All issued' },
  { id: 'Valid', label: 'Valid' },
  { id: 'Expired', label: 'Expired' },
  { id: 'Expiring soon', label: 'Expiring soon' },
] as const

export type SuperAdminIssuedTabId = (typeof superAdminIssuedTabs)[number]['id']

export const superAdminIssuedPageSize = 6

/* ---------------------------- Verification ---------------------------- */

export type SuperAdminVerificationResult = 'Verified' | 'Expired' | 'Not found'

export type SuperAdminVerificationCheck = {
  id: string
  code: string
  certificate: string
  holder: string
  requestedBy: string
  result: SuperAdminVerificationResult
  date: string
}

export const superAdminVerificationSubtitle =
  'Look up a certificate by its verification code and review recent public checks.'

export const superAdminVerificationKpis: SuperAdminCertificateKpi[] = [
  { id: 'checks', label: 'Checks (30d)', value: '2,184', detail: 'public + internal' },
  { id: 'verified', label: 'Verified %', value: '97.6%', detail: 'of all checks' },
  { id: 'notfound', label: 'Not found', value: '31', detail: 'codes not on record' },
]

export const superAdminVerificationChecks: SuperAdminVerificationCheck[] = [
  { id: 'v1', code: 'MQ-CERT-48201', certificate: 'Fire Warden Training', holder: 'Fatima Al-Mutairi', requestedBy: 'ABC Corp · HR', result: 'Verified', date: '10 Nov 2026 · 09:12' },
  { id: 'v2', code: 'MQ-CERT-48197', certificate: 'ISO 9001 Lead Auditor', holder: 'Yousef Al-Rashidi', requestedBy: 'Public · Kuwait', result: 'Verified', date: '10 Nov 2026 · 08:40' },
  { id: 'v3', code: 'MQ-CERT-26302', certificate: 'First Aid at Work', holder: 'Latifa Al-Azmi', requestedBy: 'Public · Saudi Arabia', result: 'Expired', date: '09 Nov 2026 · 17:05' },
  { id: 'v4', code: 'MQ-CERT-99999', certificate: '—', holder: '—', requestedBy: 'Public · UAE', result: 'Not found', date: '09 Nov 2026 · 14:22' },
  { id: 'v5', code: 'MQ-CERT-47650', certificate: 'NEBOSH IGC Preparation', holder: 'Dana Al-Failakawi', requestedBy: 'Kuwait Marine Services', result: 'Verified', date: '09 Nov 2026 · 11:48' },
  { id: 'v6', code: 'MQ-CERT-47942', certificate: 'ISO 14001 Internal Auditor', holder: 'Mariam Al-Kandari', requestedBy: 'Public · Qatar', result: 'Verified', date: '08 Nov 2026 · 16:30' },
  { id: 'v7', code: 'MQ-CERT-27518', certificate: 'Fire Warden Training', holder: 'Bader Al-Otaibi', requestedBy: 'Burgan Facility Mgmt', result: 'Expired', date: '08 Nov 2026 · 10:02' },
  { id: 'v8', code: 'MQ-CERT-00412', certificate: '—', holder: '—', requestedBy: 'Public · Kuwait', result: 'Not found', date: '07 Nov 2026 · 19:15' },
]

export const superAdminVerificationPageSize = 6

/* ---------------------------- Valid / Expired ---------------------------- */

export type SuperAdminCertificateStatusRow = {
  id: string
  holder: string
  course: string
  expiry: string
  status: SuperAdminCertificateStatus
}

export const superAdminCertificateStatusSubtitle =
  'Track which certificates are valid, about to expire, or already expired.'

export const superAdminCertificateStatusKpis: SuperAdminCertificateKpi[] = [
  { id: 'valid', label: 'Valid', value: '15,820', detail: 'cumulative' },
  { id: 'expiring', label: 'Expiring in 60 days', value: '312', detail: 'renewal reminders pending' },
  { id: 'expired', label: 'Expired', value: '1,206', detail: 'cumulative' },
]

export const superAdminCertificateStatusRows: SuperAdminCertificateStatusRow[] = [
  { id: 'MQ-CERT-48201', holder: 'Fatima Al-Mutairi', course: 'Fire Warden Training', expiry: '09 Nov 2028', status: 'Valid' },
  { id: 'MQ-CERT-47811', holder: 'Omar Al-Ajmi', course: 'Working at Height', expiry: '21 Oct 2028', status: 'Valid' },
  { id: 'MQ-CERT-31207', holder: 'Khalid Al-Dosari', course: 'COSHH Awareness', expiry: '18 Nov 2026', status: 'Expiring soon' },
  { id: 'MQ-CERT-30944', holder: 'Sara Al-Hajri', course: 'Food Hygiene Level 2', expiry: '24 Nov 2026', status: 'Expiring soon' },
  { id: 'MQ-CERT-30511', holder: 'Abdullah Al-Qattan', course: 'Manual Handling', expiry: '02 Dec 2026', status: 'Expiring soon' },
  { id: 'MQ-CERT-29876', holder: 'Reem Al-Sayegh', course: 'First Aid at Work', expiry: '15 Dec 2026', status: 'Expiring soon' },
  { id: 'MQ-CERT-29340', holder: 'Jassim Al-Bahar', course: 'ISO 45001 Awareness', expiry: '09 Jan 2027', status: 'Expiring soon' },
  { id: 'MQ-CERT-27518', holder: 'Bader Al-Otaibi', course: 'Fire Warden Training', expiry: '02 Nov 2026', status: 'Expired' },
  { id: 'MQ-CERT-26302', holder: 'Latifa Al-Azmi', course: 'First Aid at Work', expiry: '11 Sep 2026', status: 'Expired' },
  { id: 'MQ-CERT-25188', holder: 'Meshal Al-Rumaihi', course: 'Working at Height', expiry: '30 Aug 2026', status: 'Expired' },
  { id: 'MQ-CERT-47650', holder: 'Dana Al-Failakawi', course: 'NEBOSH IGC Preparation', expiry: '14 Oct 2029', status: 'Valid' },
  { id: 'MQ-CERT-48120', holder: 'Faisal Al-Shammari', course: 'Cybersecurity Awareness for Employees', expiry: '03 Nov 2027', status: 'Valid' },
]

export const superAdminCertificateStatusPageSize = 6

export const superAdminCertificatesIssuedPerMonth: SuperAdminChartPoint[] = [
  { label: 'Nov', value: 1020 },
  { label: 'Dec', value: 880 },
  { label: 'Jan', value: 1190 },
  { label: 'Feb', value: 1110 },
  { label: 'Mar', value: 1260 },
  { label: 'Apr', value: 1180 },
  { label: 'May', value: 1240 },
  { label: 'Jun', value: 1090 },
  { label: 'Jul', value: 960 },
  { label: 'Aug', value: 1030 },
  { label: 'Sep', value: 1315 },
  { label: 'Oct', value: 1402 },
]

export const superAdminCertificatesExpiringNextMonths: SuperAdminChartPoint[] = [
  { label: 'Nov', value: 38 },
  { label: 'Dec', value: 274 },
  { label: 'Jan', value: 186 },
  { label: 'Feb', value: 142 },
  { label: 'Mar', value: 211 },
  { label: 'Apr', value: 168 },
]

/* ---------------------------- CPD hours and credits ---------------------------- */

export type SuperAdminCpdStatus = 'Approved' | 'Pending' | 'Expired'

export type SuperAdminCpdRow = {
  id: string
  course: string
  hours: number
  body: string
  credits: string
  status: SuperAdminCpdStatus
  renewal: string
}

export const superAdminCpdSubtitle =
  'Monitor CPD hours and credits awarded across accredited courses.'

export const superAdminCpdKpis: SuperAdminCertificateKpi[] = [
  { id: 'hours', label: 'CPD hours awarded', value: '3,964.5', detail: 'this period' },
  { id: 'courses', label: 'Accredited courses', value: '26', detail: 'with a CPD mapping' },
  { id: 'approved', label: 'Approved', value: '22', detail: '3 pending · 1 expired' },
]

export const superAdminCpdRows: SuperAdminCpdRow[] = [
  { id: 'c1', course: 'Fire Warden Training', hours: 6, body: 'IOSH', credits: '6 CPD points', status: 'Approved', renewal: '31 Mar 2027' },
  { id: 'c2', course: 'ISO 9001 Lead Auditor', hours: 35, body: 'IRCA', credits: '35 CPD hours', status: 'Approved', renewal: '30 Jun 2027' },
  { id: 'c3', course: 'ISO 14001 Internal Auditor', hours: 21, body: 'IEMA', credits: '21 CPD hours', status: 'Approved', renewal: '30 Jun 2027' },
  { id: 'c4', course: 'First Aid at Work', hours: 12, body: 'CPD Standards Office', credits: '12 CPD points', status: 'Approved', renewal: '15 Jan 2027' },
  { id: 'c5', course: 'NEBOSH IGC Preparation', hours: 40, body: 'NEBOSH', credits: '40 CPD hours', status: 'Approved', renewal: '30 Sep 2027' },
  { id: 'c6', course: 'Working at Height', hours: 8, body: 'IOSH', credits: '8 CPD points', status: 'Pending', renewal: '—' },
  { id: 'c7', course: 'ISO 45001 Awareness', hours: 10, body: 'IRCA', credits: '10 CPD hours', status: 'Pending', renewal: '—' },
  { id: 'c8', course: 'COSHH Awareness', hours: 4, body: 'RoSPA', credits: '4 CPD points', status: 'Approved', renewal: '28 Feb 2027' },
  { id: 'c9', course: 'Food Hygiene Level 2', hours: 5, body: 'CPD Standards Office', credits: '5 CPD points', status: 'Expired', renewal: '30 Sep 2026' },
]

export const superAdminCpdPageSize = 6

export const superAdminCpdByBody: SuperAdminChartPoint[] = [
  { label: 'NEBOSH', value: 1240 },
  { label: 'IRCA', value: 1105 },
  { label: 'IOSH', value: 742 },
  { label: 'IEMA', value: 518 },
  { label: 'CPD SO', value: 359.5 },
]

/* ---------------------------- Certification requirements ---------------------------- */

export type SuperAdminRequirementStatus = 'Default' | 'Custom' | 'Draft'

export type SuperAdminRequirementRow = {
  id: string
  course: string
  minScore: number
  minProgress: number
  finalAssessment: 'Required' | 'Not required'
  validity: string
  status: SuperAdminRequirementStatus
}

export const superAdminRequirementsSubtitle =
  'Rules a learner must meet before a certificate is issued, per course.'

export const superAdminRequirementsKpis: SuperAdminCertificateKpi[] = [
  { id: 'sets', label: 'Rule sets', value: '38', detail: 'one per published course' },
  { id: 'default', label: 'Using default', value: '24', detail: '70% score · 100% progress' },
  { id: 'custom', label: 'Custom', value: '14', detail: 'overrides the default' },
]

export const superAdminRequirementRows: SuperAdminRequirementRow[] = [
  { id: 'r1', course: 'Fire Warden Training', minScore: 80, minProgress: 100, finalAssessment: 'Required', validity: '2 years', status: 'Custom' },
  { id: 'r2', course: 'First Aid at Work', minScore: 80, minProgress: 100, finalAssessment: 'Required', validity: '3 years', status: 'Custom' },
  { id: 'r3', course: 'ISO 9001 Lead Auditor', minScore: 75, minProgress: 100, finalAssessment: 'Required', validity: '3 years', status: 'Custom' },
  { id: 'r4', course: 'ISO 14001 Internal Auditor', minScore: 70, minProgress: 100, finalAssessment: 'Required', validity: '3 years', status: 'Default' },
  { id: 'r5', course: 'Manual Handling', minScore: 70, minProgress: 100, finalAssessment: 'Not required', validity: '1 year', status: 'Default' },
  { id: 'r6', course: 'Working at Height', minScore: 70, minProgress: 100, finalAssessment: 'Required', validity: '2 years', status: 'Default' },
  { id: 'r7', course: 'COSHH Awareness', minScore: 70, minProgress: 90, finalAssessment: 'Not required', validity: '1 year', status: 'Default' },
  { id: 'r8', course: 'NEBOSH IGC Preparation', minScore: 65, minProgress: 100, finalAssessment: 'Required', validity: 'Lifetime', status: 'Custom' },
  { id: 'r9', course: 'Cybersecurity Awareness for Employees', minScore: 70, minProgress: 100, finalAssessment: 'Not required', validity: '1 year', status: 'Draft' },
]

export const superAdminRequirementsPageSize = 6

/* ---------------------------- Certificate reports ---------------------------- */

export type SuperAdminReportStatus = 'Ready' | 'Scheduled' | 'Generating'

export type SuperAdminReportJob = {
  id: string
  name: string
  scope: string
  format: 'CSV' | 'PDF' | 'XLSX'
  requestedBy: string
  generated: string
  status: SuperAdminReportStatus
}

export const superAdminCertificateReportsSubtitle =
  'Certificates issued, expired and verified, by course and learner type.'

export const superAdminCertificateReportsKpis: SuperAdminCertificateKpi[] = [
  { id: 'generated', label: 'Reports generated', value: '148', detail: 'last 12 months' },
  { id: 'scheduled', label: 'Scheduled', value: '6', detail: 'weekly and monthly' },
  { id: 'ready', label: 'Ready', value: '12', detail: 'available to download' },
]

export const superAdminCertificateReportJobs: SuperAdminReportJob[] = [
  { id: 'j1', name: 'Certificates issued by course', scope: 'October 2026 · all courses', format: 'XLSX', requestedBy: 'Super Admin', generated: '01 Nov 2026', status: 'Ready' },
  { id: 'j2', name: 'Expiring certificates', scope: 'Next 60 days · all learners', format: 'CSV', requestedBy: 'Compliance team', generated: '09 Nov 2026', status: 'Ready' },
  { id: 'j3', name: 'Verification activity', scope: 'Last 30 days · public checks', format: 'PDF', requestedBy: 'Super Admin', generated: '08 Nov 2026', status: 'Ready' },
  { id: 'j4', name: 'CPD hours by organization', scope: 'Q3 2026 · ABC Corp and 11 others', format: 'XLSX', requestedBy: 'Accounts', generated: '—', status: 'Scheduled' },
  { id: 'j5', name: 'Certificates by learner type', scope: 'Individuals vs organizations', format: 'PDF', requestedBy: 'Super Admin', generated: '—', status: 'Scheduled' },
  { id: 'j6', name: 'Expired certificates', scope: 'Fire Warden Training · Kuwait', format: 'CSV', requestedBy: 'Compliance team', generated: '10 Nov 2026', status: 'Generating' },
  { id: 'j7', name: 'Pass-to-certificate funnel', scope: 'Last 90 days · all courses', format: 'PDF', requestedBy: 'Super Admin', generated: '28 Oct 2026', status: 'Ready' },
]

export const superAdminCertificateReportsPageSize = 5
