/* Super Admin · Reports & Analytics (Figma section 11) — sample data (Kuwait / GCC, KWD) */

export type SuperAdminReportsKpi = { id: string; label: string; value: string; detail: string }
export type SuperAdminReportsPoint = { label: string; value: number }

export const superAdminReportsPageSize = 8
export const superAdminReportsToday = '2026-11-10'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-11-12" → "12 Nov 2026" */
export function formatReportsDate(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d} ${MONTHS[Number(m) - 1] ?? m} ${y}`
}

export const formatReportsKwd = (value: number) => `KWD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export const formatReportsSize = (kb: number) =>
  kb >= 1024 ? `${(kb / 1024).toFixed(kb >= 10240 ? 0 : 1)} MB` : `${kb} KB`

/** Percent change between two numbers, rounded to one decimal. */
export const reportsChange = (current: number, previous: number) =>
  Math.round(((current - previous) / previous) * 1000) / 10

export const formatReportsChange = (value: number) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(1)}%`

export type SuperAdminReportsTrend = 'Growing' | 'Stable' | 'Declining'

export const reportsTrendFor = (change: number, threshold = 2): SuperAdminReportsTrend =>
  change >= threshold ? 'Growing' : change <= -threshold ? 'Declining' : 'Stable'

/* ------------------------------ Executive reports ------------------------------ */

export type SuperAdminExecutiveStatus = 'Ready' | 'Scheduled' | 'Draft'
export type SuperAdminExecutiveAudience = 'Board' | 'Management' | 'Operations'

export type SuperAdminExecutivePack = {
  id: string
  report: string
  period: string
  audience: SuperAdminExecutiveAudience
  preparedBy: string
  generated: string
  status: SuperAdminExecutiveStatus
}

export const superAdminExecutiveAudiences: SuperAdminExecutiveAudience[] = ['Board', 'Management', 'Operations']
export const superAdminExecutiveStatuses: SuperAdminExecutiveStatus[] = ['Ready', 'Scheduled', 'Draft']
export const superAdminExecutivePackTypes = [
  'Monthly board pack',
  'Quarterly business review',
  'Commercial performance',
  'Learning outcomes summary',
  'Organization health',
  'Risk & compliance digest',
  'Growth & acquisition',
  'Annual review draft',
] as const
export const superAdminExecutivePeriods = ['Oct 2026', 'Q3 2026', 'Sep 2026', 'Q4 2026'] as const

export const superAdminExecutivePacks: SuperAdminExecutivePack[] = [
  { id: 'ex1', report: 'Monthly board pack', period: 'Oct 2026', audience: 'Board', preparedBy: 'Super Admin', generated: '2026-11-08', status: 'Ready' },
  { id: 'ex2', report: 'Quarterly business review', period: 'Q3 2026', audience: 'Management', preparedBy: 'Finance team', generated: '2026-10-28', status: 'Ready' },
  { id: 'ex3', report: 'Commercial performance', period: 'Oct 2026', audience: 'Board', preparedBy: 'Finance team', generated: '2026-11-12', status: 'Scheduled' },
  { id: 'ex4', report: 'Learning outcomes summary', period: 'Q3 2026', audience: 'Operations', preparedBy: 'Operations', generated: '2026-11-05', status: 'Draft' },
  { id: 'ex5', report: 'Organization health', period: 'Oct 2026', audience: 'Management', preparedBy: 'Operations', generated: '2026-11-06', status: 'Ready' },
  { id: 'ex6', report: 'Risk & compliance digest', period: 'Q3 2026', audience: 'Board', preparedBy: 'Super Admin', generated: '2026-11-14', status: 'Scheduled' },
  { id: 'ex7', report: 'Growth & acquisition', period: 'Oct 2026', audience: 'Management', preparedBy: 'Finance team', generated: '2026-11-03', status: 'Ready' },
  { id: 'ex8', report: 'Annual review draft', period: 'Q3 2026', audience: 'Board', preparedBy: 'Super Admin', generated: '2026-11-01', status: 'Draft' },
]

/* ------------------------------- Revenue analytics ------------------------------ */

export type SuperAdminRevenueMonth = {
  id: string
  month: string
  short: string
  gross: number
  b2c: number
  b2b: number
}

/** Chronological, deliberately uneven so the chart rises and falls. Oct 2026 gross = 48,620 (+12.4% vs Sep). */
export const superAdminRevenueMonths: SuperAdminRevenueMonth[] = [
  { id: 'm1', month: 'Nov 2025', short: 'Nov', gross: 31200, b2c: 19340, b2b: 11860 },
  { id: 'm2', month: 'Dec 2025', short: 'Dec', gross: 34850, b2c: 20480, b2b: 14370 },
  { id: 'm3', month: 'Jan 2026', short: 'Jan', gross: 33100, b2c: 19520, b2b: 13580 },
  { id: 'm4', month: 'Feb 2026', short: 'Feb', gross: 36400, b2c: 20910, b2b: 15490 },
  { id: 'm5', month: 'Mar 2026', short: 'Mar', gross: 39800, b2c: 22650, b2b: 17150 },
  { id: 'm6', month: 'Apr 2026', short: 'Apr', gross: 37900, b2c: 21380, b2b: 16520 },
  { id: 'm7', month: 'May 2026', short: 'May', gross: 41200, b2c: 23100, b2b: 18100 },
  { id: 'm8', month: 'Jun 2026', short: 'Jun', gross: 44100, b2c: 24640, b2b: 19460 },
  { id: 'm9', month: 'Jul 2026', short: 'Jul', gross: 42300, b2c: 23570, b2b: 18730 },
  { id: 'm10', month: 'Aug 2026', short: 'Aug', gross: 40600, b2c: 22940, b2b: 17660 },
  { id: 'm11', month: 'Sep 2026', short: 'Sep', gross: 43256, b2c: 24310, b2b: 18946 },
  { id: 'm12', month: 'Oct 2026', short: 'Oct', gross: 48620, b2c: 27230, b2b: 21390 },
]

/* ------------------------------ Trending course reports ------------------------------ */

export type SuperAdminTrendingSignal = 'Hot' | 'Steady'

export type SuperAdminTrendingCourseRow = {
  id: string
  rank: number
  course: string
  enrollments: number
  growth: number
  rankChange: number
  signal: SuperAdminTrendingSignal
}

/** Ranked by week-on-week growth, so enrollments are intentionally uneven. */
export const superAdminTrendingCourseRows: SuperAdminTrendingCourseRow[] = [
  { id: 't1', rank: 1, course: 'Cybersecurity Awareness', enrollments: 214, growth: 48, rankChange: 9, signal: 'Hot' },
  { id: 't2', rank: 2, course: 'Fire Warden Training', enrollments: 268, growth: 41, rankChange: 3, signal: 'Hot' },
  { id: 't3', rank: 3, course: 'ISO 45001 Lead Auditor', enrollments: 187, growth: 36, rankChange: 1, signal: 'Hot' },
  { id: 't4', rank: 4, course: 'First Aid at Work', enrollments: 242, growth: 31, rankChange: -2, signal: 'Hot' },
  { id: 't5', rank: 5, course: 'Working at Height', enrollments: 156, growth: 27, rankChange: 5, signal: 'Steady' },
  { id: 't6', rank: 6, course: 'ISO 9001 Lead Auditor', enrollments: 231, growth: 22, rankChange: 0, signal: 'Steady' },
  { id: 't7', rank: 7, course: 'Manual Handling', enrollments: 128, growth: 18, rankChange: -1, signal: 'Steady' },
  { id: 't8', rank: 8, course: 'NEBOSH IGC Preparation', enrollments: 174, growth: 14, rankChange: 2, signal: 'Steady' },
  { id: 't9', rank: 9, course: 'ISO 14001 Internal Auditor', enrollments: 119, growth: 9, rankChange: -3, signal: 'Steady' },
  { id: 't10', rank: 10, course: 'PMP Exam Preparation', enrollments: 142, growth: 6, rankChange: 1, signal: 'Steady' },
]

/* ------------------------------- Geographic analytics ------------------------------- */

export type SuperAdminMarketTier = 'Core' | 'Growth' | 'Emerging'

export type SuperAdminReportsGeoRow = {
  id: string
  country: string
  students: number
  revenue: number
  growth: number
  topCity: string
  market: SuperAdminMarketTier
}

export const superAdminGeoRows: SuperAdminReportsGeoRow[] = [
  { id: 'g1', country: 'Kuwait', students: 9420, revenue: 21400, growth: 12, topCity: 'Kuwait City', market: 'Core' },
  { id: 'g2', country: 'Saudi Arabia', students: 7860, revenue: 17950, growth: 31, topCity: 'Riyadh', market: 'Core' },
  { id: 'g3', country: 'United Arab Emirates', students: 5310, revenue: 12480, growth: 18, topCity: 'Dubai', market: 'Growth' },
  { id: 'g4', country: 'Qatar', students: 3640, revenue: 8120, growth: 14, topCity: 'Doha', market: 'Growth' },
  { id: 'g5', country: 'Bahrain', students: 1820, revenue: 3960, growth: 9, topCity: 'Manama', market: 'Growth' },
  { id: 'g6', country: 'Oman', students: 2140, revenue: 4780, growth: 22, topCity: 'Muscat', market: 'Growth' },
  { id: 'g7', country: 'Egypt', students: 1460, revenue: 2210, growth: 17, topCity: 'Cairo', market: 'Emerging' },
  { id: 'g8', country: 'India', students: 980, revenue: 1540, growth: 11, topCity: 'Mumbai', market: 'Emerging' },
  { id: 'g9', country: 'Jordan', students: 640, revenue: 1120, growth: 8, topCity: 'Amman', market: 'Emerging' },
  { id: 'g10', country: 'Philippines', students: 410, revenue: 620, growth: 5, topCity: 'Manila', market: 'Emerging' },
]

/* -------------------------------- Student growth -------------------------------- */

export type SuperAdminGrowthMonth = {
  id: string
  month: string
  short: string
  newStudents: number
  active: number
  retention: number
}

/** Chronological. Oct 2026: 1,148 new (+5.7% vs Sep), total 24,310 and 9,842 monthly active. */
export const superAdminGrowthMonths: SuperAdminGrowthMonth[] = [
  { id: 's1', month: 'Nov 2025', short: 'Nov', newStudents: 912, active: 8120, retention: 76 },
  { id: 's2', month: 'Dec 2025', short: 'Dec', newStudents: 846, active: 7890, retention: 75 },
  { id: 's3', month: 'Jan 2026', short: 'Jan', newStudents: 1034, active: 8460, retention: 77 },
  { id: 's4', month: 'Feb 2026', short: 'Feb', newStudents: 978, active: 8610, retention: 78 },
  { id: 's5', month: 'Mar 2026', short: 'Mar', newStudents: 1121, active: 8940, retention: 77 },
  { id: 's6', month: 'Apr 2026', short: 'Apr', newStudents: 1052, active: 8780, retention: 79 },
  { id: 's7', month: 'May 2026', short: 'May', newStudents: 1190, active: 9210, retention: 78 },
  { id: 's8', month: 'Jun 2026', short: 'Jun', newStudents: 1137, active: 9050, retention: 80 },
  { id: 's9', month: 'Jul 2026', short: 'Jul', newStudents: 1214, active: 9320, retention: 79 },
  { id: 's10', month: 'Aug 2026', short: 'Aug', newStudents: 1068, active: 9190, retention: 78 },
  { id: 's11', month: 'Sep 2026', short: 'Sep', newStudents: 1086, active: 9436, retention: 79 },
  { id: 's12', month: 'Oct 2026', short: 'Oct', newStudents: 1148, active: 9842, retention: 80 },
]

export const superAdminTotalStudents = 24310

/* ------------------------------ Organization analytics ------------------------------ */

export type SuperAdminRenewalRisk = 'Low' | 'Medium' | 'High'

export type SuperAdminOrgAnalyticsRow = {
  id: string
  org: string
  seats: number
  utilization: number
  completion: number
  revenue: number
  risk: SuperAdminRenewalRisk
}

export const superAdminOrgAnalyticsRows: SuperAdminOrgAnalyticsRow[] = [
  { id: 'o1', org: 'ABC Corp', seats: 500, utilization: 88, completion: 81, revenue: 26400, risk: 'Low' },
  { id: 'o2', org: 'Gulf Logistics', seats: 250, utilization: 64, completion: 69, revenue: 14250, risk: 'Medium' },
  { id: 'o3', org: 'Al Salam Contracting', seats: 120, utilization: 91, completion: 84, revenue: 8900, risk: 'Low' },
  { id: 'o4', org: 'Kuwait Safety Group', seats: 800, utilization: 47, completion: 52, revenue: 31800, risk: 'High' },
  { id: 'o5', org: 'Bayan Petrochemicals', seats: 300, utilization: 72, completion: 74, revenue: 17600, risk: 'Low' },
  { id: 'o6', org: 'Zain Training Partners', seats: 450, utilization: 58, completion: 61, revenue: 19350, risk: 'Medium' },
  { id: 'o7', org: 'Nour Healthcare', seats: 220, utilization: 83, completion: 78, revenue: 12100, risk: 'Low' },
  { id: 'o8', org: 'Boubyan Facilities', seats: 180, utilization: 39, completion: 44, revenue: 6700, risk: 'High' },
  { id: 'o9', org: 'Salmiya Hospitality', seats: 90, utilization: 52, completion: 58, revenue: 3850, risk: 'Medium' },
  { id: 'o10', org: 'Mishref Engineering', seats: 140, utilization: 67, completion: 71, revenue: 7420, risk: 'Low' },
]

/* ------------------------------- Learning analytics ------------------------------- */

export type SuperAdminLearningHealth = 'Healthy' | 'Watch'

export type SuperAdminLearningRow = {
  id: string
  course: string
  hours: number
  completion: number
  dropOff: string
  engagement: number
  health: SuperAdminLearningHealth
}

export const superAdminLearningRows: SuperAdminLearningRow[] = [
  { id: 'l1', course: 'Fire Warden Training', hours: 5.9, completion: 86, dropOff: 'Module 3', engagement: 84, health: 'Healthy' },
  { id: 'l2', course: 'ISO 9001 Lead Auditor', hours: 19.8, completion: 68, dropOff: 'Module 5', engagement: 71, health: 'Watch' },
  { id: 'l3', course: 'ISO 14001 Internal Auditor', hours: 16.6, completion: 74, dropOff: 'Module 4', engagement: 76, health: 'Healthy' },
  { id: 'l4', course: 'ISO 45001 Lead Auditor', hours: 18.9, completion: 63, dropOff: 'Module 6', engagement: 66, health: 'Watch' },
  { id: 'l5', course: 'First Aid at Work', hours: 6.8, completion: 91, dropOff: 'Module 2', engagement: 89, health: 'Healthy' },
  { id: 'l6', course: 'NEBOSH IGC Preparation', hours: 34.2, completion: 59, dropOff: 'Module 5', engagement: 62, health: 'Watch' },
  { id: 'l7', course: 'Working at Height', hours: 5.0, completion: 88, dropOff: 'Module 3', engagement: 82, health: 'Healthy' },
  { id: 'l8', course: 'Manual Handling', hours: 3.6, completion: 94, dropOff: 'Module 2', engagement: 91, health: 'Healthy' },
  { id: 'l9', course: 'Cybersecurity Awareness', hours: 3.2, completion: 79, dropOff: 'Module 4', engagement: 77, health: 'Healthy' },
  { id: 'l10', course: 'PMP Exam Preparation', hours: 36.0, completion: 66, dropOff: 'Module 6', engagement: 64, health: 'Watch' },
]

/* ------------------------------ Assessment analytics ------------------------------ */

export type SuperAdminAssessmentDifficulty = 'Easy' | 'Balanced' | 'Hard'

export type SuperAdminAssessmentReportRow = {
  id: string
  assessment: string
  attempts: number
  passRate: number
  avgScore: number
  difficulty: SuperAdminAssessmentDifficulty
}

export const superAdminAssessmentReportRows: SuperAdminAssessmentReportRow[] = [
  { id: 'a1', assessment: 'Fire Warden Training · Final', attempts: 1180, passRate: 91, avgScore: 84, difficulty: 'Easy' },
  { id: 'a2', assessment: 'ISO 9001 Lead Auditor · Final', attempts: 960, passRate: 78, avgScore: 74, difficulty: 'Balanced' },
  { id: 'a3', assessment: 'ISO 14001 Internal Auditor · Final', attempts: 742, passRate: 84, avgScore: 79, difficulty: 'Balanced' },
  { id: 'a4', assessment: 'ISO 45001 Lead Auditor · Final', attempts: 688, passRate: 72, avgScore: 70, difficulty: 'Hard' },
  { id: 'a5', assessment: 'First Aid at Work · Final', attempts: 1264, passRate: 94, avgScore: 88, difficulty: 'Easy' },
  { id: 'a6', assessment: 'NEBOSH IGC Preparation · Final', attempts: 534, passRate: 69, avgScore: 67, difficulty: 'Hard' },
  { id: 'a7', assessment: 'Working at Height · Final', attempts: 1096, passRate: 88, avgScore: 82, difficulty: 'Easy' },
  { id: 'a8', assessment: 'Manual Handling · Final', attempts: 1342, passRate: 96, avgScore: 90, difficulty: 'Easy' },
  { id: 'a9', assessment: 'Cybersecurity Awareness · Final', attempts: 1510, passRate: 81, avgScore: 77, difficulty: 'Balanced' },
  { id: 'a10', assessment: 'PMP Exam Preparation · Final', attempts: 418, passRate: 76, avgScore: 72, difficulty: 'Balanced' },
]

/* ----------------------------- Certification analytics ----------------------------- */

export type SuperAdminCertificationMonth = {
  id: string
  month: string
  short: string
  issued: number
  verifications: number
  revoked: number
  expiring: number
}

/** Chronological. Oct 2026: 418 issued (−3.2% vs Sep), 1,284 verifications, 312 expiring in 60 days. */
export const superAdminCertificationMonths: SuperAdminCertificationMonth[] = [
  { id: 'c1', month: 'Nov 2025', short: 'Nov', issued: 352, verifications: 842, revoked: 2, expiring: 188 },
  { id: 'c2', month: 'Dec 2025', short: 'Dec', issued: 331, verifications: 790, revoked: 1, expiring: 214 },
  { id: 'c3', month: 'Jan 2026', short: 'Jan', issued: 376, verifications: 910, revoked: 3, expiring: 196 },
  { id: 'c4', month: 'Feb 2026', short: 'Feb', issued: 398, verifications: 968, revoked: 2, expiring: 231 },
  { id: 'c5', month: 'Mar 2026', short: 'Mar', issued: 421, verifications: 1043, revoked: 4, expiring: 248 },
  { id: 'c6', month: 'Apr 2026', short: 'Apr', issued: 389, verifications: 996, revoked: 1, expiring: 226 },
  { id: 'c7', month: 'May 2026', short: 'May', issued: 447, verifications: 1120, revoked: 3, expiring: 269 },
  { id: 'c8', month: 'Jun 2026', short: 'Jun', issued: 462, verifications: 1184, revoked: 5, expiring: 283 },
  { id: 'c9', month: 'Jul 2026', short: 'Jul', issued: 404, verifications: 1038, revoked: 2, expiring: 255 },
  { id: 'c10', month: 'Aug 2026', short: 'Aug', issued: 441, verifications: 1067, revoked: 3, expiring: 291 },
  { id: 'c11', month: 'Sep 2026', short: 'Sep', issued: 432, verifications: 1126, revoked: 1, expiring: 298 },
  { id: 'c12', month: 'Oct 2026', short: 'Oct', issued: 418, verifications: 1284, revoked: 2, expiring: 312 },
]

/* ---------------------------------- Report exports ---------------------------------- */

export type SuperAdminExportFormat = 'PDF' | 'XLSX' | 'CSV'
export type SuperAdminReportExportStatus = 'Ready' | 'Processing' | 'Expired'

export type SuperAdminReportExport = {
  id: string
  report: string
  format: SuperAdminExportFormat
  requestedBy: string
  sizeKb: number
  created: string
  status: SuperAdminReportExportStatus
}

export const superAdminReportExportFormats: SuperAdminExportFormat[] = ['PDF', 'XLSX', 'CSV']
export const superAdminExportStatuses: SuperAdminReportExportStatus[] = ['Ready', 'Processing', 'Expired']
export const superAdminExportReports = [
  'Revenue Analytics',
  'Student Growth',
  'Executive pack',
  'Geographic Analytics',
  'Learning Analytics',
  'Certification Reports',
  'Organization Reports',
  'Assessment Reports',
  'Trending Courses',
] as const

export const superAdminReportExports: SuperAdminReportExport[] = [
  { id: 'e1', report: 'Revenue Analytics', format: 'PDF', requestedBy: 'Super Admin', sizeKb: 2480, created: '2026-11-10', status: 'Ready' },
  { id: 'e2', report: 'Student Growth', format: 'XLSX', requestedBy: 'Finance team', sizeKb: 49152, created: '2026-11-09', status: 'Ready' },
  { id: 'e3', report: 'Executive pack', format: 'PDF', requestedBy: 'Super Admin', sizeKb: 6240, created: '2026-11-08', status: 'Processing' },
  { id: 'e4', report: 'Geographic Analytics', format: 'CSV', requestedBy: 'Fatima Al-Sabah', sizeKb: 412, created: '2026-11-06', status: 'Ready' },
  { id: 'e5', report: 'Learning Analytics', format: 'XLSX', requestedBy: 'Operations', sizeKb: 15320, created: '2026-11-04', status: 'Ready' },
  { id: 'e6', report: 'Certification Reports', format: 'PDF', requestedBy: 'Finance team', sizeKb: 1860, created: '2026-10-21', status: 'Expired' },
  { id: 'e7', report: 'Organization Reports', format: 'CSV', requestedBy: 'Yousef Al-Rashid', sizeKb: 920, created: '2026-11-02', status: 'Ready' },
  { id: 'e8', report: 'Assessment Reports', format: 'PDF', requestedBy: 'Super Admin', sizeKb: 3150, created: '2026-10-18', status: 'Expired' },
  { id: 'e9', report: 'Trending Courses', format: 'CSV', requestedBy: 'Operations', sizeKb: 128, created: '2026-11-10', status: 'Processing' },
  { id: 'e10', report: 'Revenue Analytics', format: 'XLSX', requestedBy: 'Finance team', sizeKb: 8740, created: '2026-10-30', status: 'Ready' },
]
