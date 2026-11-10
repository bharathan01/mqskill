/* Super Admin · Students (Figma section 06) — sample data (Kuwait / GCC, KWD) */

export type SuperAdminStudentKpi = {
  id: string
  label: string
  value: string
  detail: string
}

export type SuperAdminStudentPoint = { label: string; value: number }

export type SuperAdminStudentTab<T extends string> = { id: 'all' | T; label: string }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_MS = 86_400_000
const TODAY_UTC = Date.UTC(2026, 10, 10)

export const superAdminStudentToday = '2026-11-10'

/** "2026-11-12" → "12 Nov 2026" */
export function formatStudentDate(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d} ${MONTHS[Number(m) - 1] ?? m} ${y}`
}

export function formatStudentKwd(value: number, decimals = 0) {
  return `KWD ${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

/** ISO date `days` before the reference day (2026-11-10). */
export function studentDaysAgo(days: number) {
  return new Date(TODAY_UTC - days * DAY_MS).toISOString().slice(0, 10)
}

/** Whole days between an ISO date and the reference day. */
export function studentDaysSince(iso: string) {
  return Math.round((TODAY_UTC - Date.parse(`${iso}T00:00:00Z`)) / DAY_MS)
}

function addDays(iso: string, days: number) {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)
}

const at = <T>(list: readonly T[], index: number): T => list[index % list.length] as T

/* -------------------------------- Courses -------------------------------- */

export const superAdminStudentCourses = [
  { name: 'ISO 9001 Lead Auditor', price: 49, cpd: 8 },
  { name: 'ISO 14001 Internal Auditor', price: 45, cpd: 6 },
  { name: 'Fire Warden Training', price: 28.5, cpd: 4 },
  { name: 'First Aid at Work', price: 32, cpd: 4 },
  { name: 'NEBOSH IGC Preparation', price: 120, cpd: 10 },
  { name: 'Working at Height', price: 35, cpd: 5 },
  { name: 'Manual Handling', price: 24.5, cpd: 3 },
  { name: 'Cybersecurity Awareness for Employees', price: 30, cpd: 3 },
] as const

export const superAdminStudentCourseNames: string[] = superAdminStudentCourses.map((item) => item.name)

const courseAt = (index: number) => at(superAdminStudentCourses, index)

export const superAdminStudentPaymentMethods = ['KNET', 'Visa', 'Mastercard', 'Apple Pay'] as const

/* ------------------------- All students / Details ------------------------ */

export type SuperAdminStudentStatus = 'Active' | 'Inactive' | 'Suspended'

export type SuperAdminStudentCourseLine = {
  course: string
  progress: number
  state: 'In progress' | 'Completed'
}

export type SuperAdminStudent = {
  id: string
  name: string
  email: string
  phone: string
  country: string
  city: string
  employer: string
  courses: number
  joined: string
  lastLogin: string
  spent: number
  profileComplete: number
  status: SuperAdminStudentStatus
  enrolled: SuperAdminStudentCourseLine[]
}

export const superAdminStudentNames = [
  'Fatima Al-Sabah',
  'Abdullah Al-Mutairi',
  'Noura Al-Enezi',
  'Yousef Al-Rashidi',
  'Maryam Al-Kandari',
  'Khalid Al-Ajmi',
  'Sara Al-Otaibi',
  'Hamad Al-Dosari',
  'Dana Al-Failakawi',
  'Omar Al-Harbi',
  'Layla Al-Khalifa',
  'Salem Al-Mazrouei',
  'Aisha Al-Thani',
  'Mohammed Al-Balushi',
  'Hessa Al-Qahtani',
  'Rashed Al-Nuaimi',
  'Reem Al-Hajri',
  'Faisal Al-Ghanim',
] as const

const employers = [
  'Kuwait Oil Company',
  'Gulf Bank',
  'Zain Kuwait',
  'KNPC',
  'Agility Logistics',
  'Burgan Bank',
  'Kuwait Airways',
] as const

const studentCountries = [
  'Kuwait', 'Kuwait', 'Saudi Arabia', 'Kuwait', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Kuwait',
  'Oman', 'Saudi Arabia', 'Kuwait', 'UAE', 'Kuwait', 'Qatar', 'Kuwait', 'Bahrain', 'Saudi Arabia',
] as const

const citiesByCountry: Record<string, string[]> = {
  Kuwait: ['Kuwait City', 'Hawalli', 'Salmiya', 'Farwaniya'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam'],
  UAE: ['Dubai', 'Abu Dhabi'],
  Qatar: ['Doha'],
  Bahrain: ['Manama'],
  Oman: ['Muscat'],
}

const dialByCountry: Record<string, string> = {
  Kuwait: '+965',
  'Saudi Arabia': '+966',
  UAE: '+971',
  Qatar: '+974',
  Bahrain: '+973',
  Oman: '+968',
}

const statuses: SuperAdminStudentStatus[] = [
  'Active', 'Active', 'Active', 'Inactive', 'Active', 'Active', 'Suspended', 'Active', 'Active',
  'Inactive', 'Active', 'Active', 'Active', 'Suspended', 'Active', 'Active', 'Inactive', 'Active',
]
const courseCounts = [6, 3, 8, 1, 4, 2, 5, 7, 3, 1, 9, 2, 4, 6, 2, 3, 1, 5]
const joinedDays = [412, 380, 351, 330, 298, 270, 244, 210, 185, 160, 140, 118, 92, 71, 48, 33, 17, 5]
const lastLoginDays = [1, 0, 3, 64, 2, 5, 41, 0, 7, 72, 1, 4, 0, 28, 2, 9, 55, 0]
const spentValues = [640, 210, 480, 45, 330, 96, 215, 590, 140, 49, 520, 88, 262, 305, 74, 130, 28, 62]
const completeness = [100, 96, 100, 62, 94, 88, 71, 100, 90, 58, 100, 84, 92, 76, 88, 95, 64, 100]

export const superAdminStudents: SuperAdminStudent[] = superAdminStudentNames.map((name, i) => {
  const country = at(studentCountries, i)
  const [first, last = ''] = name.split(' ')
  const phoneBody = `${5000 + ((i * 731) % 4000)} ${1000 + ((i * 397) % 8000)}`
  return {
    id: `STU-${40210 + i * 3}`,
    name,
    email: `${(first ?? '').toLowerCase()}.${last.replace('-', '').toLowerCase()}@gmail.com`,
    phone: `${dialByCountry[country] ?? '+965'} ${phoneBody}`,
    country,
    city: at(citiesByCountry[country] ?? ['Kuwait City'], i),
    employer: i % 3 === 0 ? 'Individual' : at(employers, i),
    courses: at(courseCounts, i),
    joined: studentDaysAgo(at(joinedDays, i)),
    lastLogin: studentDaysAgo(at(lastLoginDays, i)),
    spent: at(spentValues, i),
    profileComplete: at(completeness, i),
    status: at(statuses, i),
    enrolled: Array.from({ length: Math.min(3, at(courseCounts, i)) }, (_, k) => {
      const progress = ((i * 37 + k * 23) % 88) + 12
      return {
        course: courseAt(i + k * 2).name,
        progress,
        state: progress >= 90 ? ('Completed' as const) : ('In progress' as const),
      }
    }),
  }
})

export const superAdminStudentPageSize = 8
export const superAdminStudentDetailsPageSize = 7

export const superAdminAllStudentsSubtitle = 'Individual learners registered on MaqSkillz.'
export const superAdminAllStudentsKpis: SuperAdminStudentKpi[] = [
  { id: 'total', label: 'Total students', value: '24,310', detail: '+5.7% vs previous 30 days' },
  { id: 'new', label: 'New (30d)', value: '1,148', detail: '+5.7% vs previous 30 days' },
  { id: 'active', label: 'Active', value: '21,884', detail: '90% of all students' },
  { id: 'countries', label: 'Countries', value: '34', detail: 'Kuwait leads with 41%' },
]
export const superAdminAllStudentsTabs: SuperAdminStudentTab<SuperAdminStudentStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Active', label: 'Active' },
  { id: 'Inactive', label: 'Inactive' },
  { id: 'Suspended', label: 'Suspended' },
]
export const superAdminAllStudentsTip =
  'Suspended learners keep their certificates and purchase history, but cannot sign in or start new courses until reactivated.'

export const superAdminStudentDetailsSubtitle = 'Full learner profiles with contact, employer and spend.'
export const superAdminStudentDetailsKpis: SuperAdminStudentKpi[] = [
  { id: 'complete', label: 'Profiles complete', value: '88%', detail: '+2% vs last month' },
  { id: 'spend', label: 'Avg. lifetime spend', value: 'KWD 164', detail: '+KWD 9 vs last quarter' },
  { id: 'org', label: 'Linked to organization', value: '31%', detail: 'learners with an employer account' },
]

/* ----------------------------- Country-wise ------------------------------ */

export type SuperAdminStudentCountry = {
  country: string
  students: number
  newStudents: number
  activePct: number
  growth: number
  revenue: number
  topCourse: string
}

const countryRow = (
  country: string,
  students: number,
  newStudents: number,
  activePct: number,
  growth: number,
  revenue: number,
  topCourse: string,
): SuperAdminStudentCountry => ({ country, students, newStudents, activePct, growth, revenue, topCourse })

export const superAdminStudentCountries: SuperAdminStudentCountry[] = [
  countryRow('Kuwait', 9967, 468, 91, 6, 21400, 'Fire Warden Training'),
  countryRow('Saudi Arabia', 5120, 351, 88, 31, 14200, 'ISO 9001 Lead Auditor'),
  countryRow('UAE', 3340, 148, 86, 12, 9150, 'NEBOSH IGC Preparation'),
  countryRow('Qatar', 2160, 69, 84, 8, 5820, 'ISO 14001 Internal Auditor'),
  countryRow('Bahrain', 1480, 41, 87, 4, 3610, 'First Aid at Work'),
  countryRow('Oman', 1130, 33, 82, 14, 2740, 'Working at Height'),
  countryRow('Egypt', 520, 19, 74, 21, 980, 'Cybersecurity Awareness for Employees'),
  countryRow('Jordan', 310, 11, 79, 9, 640, 'Manual Handling'),
  countryRow('Lebanon', 180, 5, 71, -3, 310, 'First Aid at Work'),
  countryRow('India', 103, 3, 68, 17, 190, 'ISO 9001 Lead Auditor'),
]

export const superAdminStudentCountriesSubtitle = 'Learner distribution and revenue by country.'
export const superAdminStudentCountriesKpis: SuperAdminStudentKpi[] = [
  { id: 'countries', label: 'Countries', value: '34', detail: '+2 new this quarter' },
  { id: 'top', label: 'Top country', value: 'Kuwait · 41%', detail: '9,967 learners' },
  { id: 'growth', label: 'Fastest growing', value: 'Saudi Arabia +31%', detail: 'vs previous 30 days' },
]
export const superAdminStudentCountriesTip =
  'Saudi Arabia is growing three times faster than Kuwait. Consider Arabic-first marketing and KSA payment methods to keep the momentum.'

/* ------------------------- Registration analytics ------------------------ */

export type SuperAdminStudentRegistrationWeek = {
  week: number
  range: string
  registrations: number
  verified: number
  toPurchasePct: number
  source: string
}

const weekRow = (
  week: number,
  range: string,
  registrations: number,
  verified: number,
  toPurchasePct: number,
  source: string,
): SuperAdminStudentRegistrationWeek => ({ week, range, registrations, verified, toPurchasePct, source })

/** Oldest → newest; registrations deliberately rise and fall week to week. */
export const superAdminStudentRegistrationWeeks: SuperAdminStudentRegistrationWeek[] = [
  weekRow(34, '18–24 Aug', 238, 214, 34, 'Google search'),
  weekRow(35, '25–31 Aug', 291, 262, 36, 'Instagram'),
  weekRow(36, '1–7 Sep', 264, 239, 35, 'Google search'),
  weekRow(37, '8–14 Sep', 322, 297, 41, 'Organization invite'),
  weekRow(38, '15–21 Sep', 275, 251, 37, 'Referral'),
  weekRow(39, '22–28 Sep', 248, 224, 33, 'Instagram'),
  weekRow(40, '29 Sep–5 Oct', 301, 279, 39, 'Google search'),
  weekRow(41, '6–12 Oct', 336, 311, 42, 'LinkedIn'),
  weekRow(42, '13–19 Oct', 284, 262, 38, 'Google search'),
  weekRow(43, '20–26 Oct', 259, 236, 35, 'Referral'),
  weekRow(44, '27 Oct–2 Nov', 312, 288, 40, 'Organization invite'),
  weekRow(45, '3–9 Nov', 293, 271, 38, 'Google search'),
]

export const superAdminStudentRegistrationRanges = [
  { id: '4', label: 'Last 4 weeks', weeks: 4 },
  { id: '8', label: 'Last 8 weeks', weeks: 8 },
  { id: '12', label: 'Last 12 weeks', weeks: 12 },
] as const

export const superAdminStudentSources = [
  'Google search',
  'Instagram',
  'Organization invite',
  'Referral',
  'LinkedIn',
] as const

export const superAdminStudentAnalyticsSubtitle = 'New registrations, verification and conversion trends.'
export const superAdminStudentAnalyticsKpis: SuperAdminStudentKpi[] = [
  { id: 'registrations', label: 'Registrations (30d)', value: '1,148', detail: '+5.7% vs previous 30 days' },
  { id: 'verified', label: 'Email verified', value: '92%', detail: '+1% vs previous 30 days' },
  { id: 'purchase', label: 'Registration → purchase', value: '38%', detail: '+2% vs previous 30 days' },
]
export const superAdminStudentAnalyticsTip =
  'Weeks that follow an organization invite batch (37 and 44) convert best. Time reminder emails to land inside those windows.'

/* ----------------------------- Purchased courses ------------------------- */

export type SuperAdminStudentPurchase = {
  id: string
  student: string
  course: string
  order: string
  amount: number
  method: string
  date: string
}

const purchaseDays = [0, 0, 1, 1, 2, 3, 3, 4, 5, 6, 8, 9, 11, 13, 15, 18, 21, 24, 27, 29]

export const superAdminStudentPurchases: SuperAdminStudentPurchase[] = purchaseDays.map((days, i) => {
  const course = courseAt(i * 3 + 1)
  return {
    id: `pur-${i + 1}`,
    student: at(superAdminStudentNames, i + 1),
    course: course.name,
    order: `ORD-${52300 + i * 11}`,
    amount: course.price,
    method: at(superAdminStudentPaymentMethods, i * 2 + (i % 3)),
    date: studentDaysAgo(days),
  }
})

export const superAdminStudentPurchasesSubtitle = 'Course purchases made by individual students.'
export const superAdminStudentPurchasesKpis: SuperAdminStudentKpi[] = [
  { id: 'purchases', label: 'Purchases (30d)', value: '1,284', detail: '+8.1% vs previous 30 days' },
  { id: 'basket', label: 'Avg. basket', value: 'KWD 37.9', detail: '+4.1% vs previous 30 days' },
  { id: 'repeat', label: 'Repeat buyers', value: '27%', detail: 'bought two or more courses' },
]

/* ----------------------------- Active enrollments ------------------------ */

export type SuperAdminStudentEnrollmentStatus = 'Active' | 'Paused' | 'Overdue'

export type SuperAdminStudentEnrollment = {
  id: string
  student: string
  course: string
  progress: number
  enrolled: string
  lastActivity: string
  status: SuperAdminStudentEnrollmentStatus
}

const enrollmentProgress = [72, 45, 88, 60, 34, 91, 15, 22, 56, 18, 67, 80, 41, 95, 29, 38, 62, 74, 50, 85]
const enrollmentEnrolled = [48, 62, 80, 35, 120, 95, 27, 140, 66, 160, 52, 74, 110, 41, 88, 130, 58, 33, 70, 45]
const enrollmentActivity = [0, 1, 2, 3, 19, 5, 0, 24, 2, 31, 1, 4, 16, 0, 6, 22, 2, 1, 9, 3]
const enrollmentStatuses: SuperAdminStudentEnrollmentStatus[] = [
  'Active', 'Active', 'Active', 'Paused', 'Overdue', 'Active', 'Active', 'Overdue', 'Active', 'Overdue',
  'Paused', 'Active', 'Overdue', 'Active', 'Active', 'Overdue', 'Active', 'Paused', 'Active', 'Active',
]

export const superAdminStudentEnrollments: SuperAdminStudentEnrollment[] = enrollmentProgress.map((progress, i) => ({
  id: `enr-${i + 1}`,
  student: at(superAdminStudentNames, i + 6),
  course: courseAt(i * 3 + 2).name,
  progress,
  enrolled: studentDaysAgo(at(enrollmentEnrolled, i)),
  lastActivity: studentDaysAgo(at(enrollmentActivity, i)),
  status: at(enrollmentStatuses, i),
}))

export const superAdminStudentEnrollmentsSubtitle = 'Courses currently in progress across all learners.'
export const superAdminStudentEnrollmentTabs: SuperAdminStudentTab<SuperAdminStudentEnrollmentStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Active', label: 'Active' },
  { id: 'Paused', label: 'Paused' },
  { id: 'Overdue', label: 'Overdue' },
]
export const superAdminStudentEnrollmentsTip =
  'A reminder goes out by email and in-app. Learners who stay stalled after two reminders are flagged to their organization admin.'

/* ----------------------------- Learning progress ------------------------- */

export type SuperAdminStudentProgressStatus = 'On track' | 'Behind' | 'Completed'

export type SuperAdminStudentProgress = {
  id: string
  student: string
  course: string
  modules: number
  totalModules: number
  hours: number
  status: SuperAdminStudentProgressStatus
}

const progressModules = [12, 7, 9, 4, 10, 3, 12, 6, 8, 2, 11, 5, 7, 12, 4, 9, 6, 1, 10, 8]
const progressHours = [30, 14, 22, 6, 25, 4, 33, 12, 18, 3, 28, 9, 15, 31, 7, 20, 11, 2, 24, 17]

export const superAdminStudentProgress: SuperAdminStudentProgress[] = progressModules.map((modules, i) => ({
  id: `prg-${i + 1}`,
  student: at(superAdminStudentNames, i + 8),
  course: courseAt(i * 3 + 4).name,
  modules,
  totalModules: 12,
  hours: at(progressHours, i),
  status: modules === 12 ? 'Completed' : modules <= 4 ? 'Behind' : 'On track',
}))

export const superAdminStudentProgressSubtitle = 'Module completion and time spent for each learner.'
export const superAdminStudentProgressKpis: SuperAdminStudentKpi[] = [
  { id: 'avg', label: 'Avg. progress', value: '58%', detail: '+3% vs previous 30 days' },
  { id: 'completion', label: 'Completion rate', value: '71%', detail: 'of learners who started a course' },
  { id: 'weekly', label: 'Avg. weekly study', value: '2.6 h', detail: '+0.2 h vs previous 30 days' },
]
export const superAdminStudentProgressTip =
  'Learners who study at least twice a week finish courses 2.4× more often. Behind learners can be nudged from the table.'

/* ---------------------------- Assessment results ------------------------- */

export type SuperAdminStudentAssessmentResult = 'Passed' | 'Failed' | 'Retake allowed'

export type SuperAdminStudentAssessment = {
  id: string
  student: string
  assessment: string
  score: number
  attempts: number
  result: SuperAdminStudentAssessmentResult
  date: string
}

export const superAdminStudentPassMark = 60

const assessmentScores = [92, 88, 41, 76, 95, 54, 83, 67, 71, 38, 90, 48, 79, 86, 62, 97, 44, 81, 73, 58]
const assessmentAttempts = [1, 1, 2, 1, 1, 3, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2]
const assessmentDays = [1, 2, 3, 4, 6, 7, 9, 12, 14, 16, 19, 22, 25, 29, 33, 38, 44, 51, 60, 72]

export const superAdminStudentAssessments: SuperAdminStudentAssessment[] = assessmentScores.map((score, i) => ({
  id: `asm-${i + 1}`,
  student: at(superAdminStudentNames, i + 10),
  assessment: `${courseAt(i * 3 + 5).name} · Final`,
  score,
  attempts: at(assessmentAttempts, i),
  result: score >= superAdminStudentPassMark ? 'Passed' : 'Failed',
  date: studentDaysAgo(at(assessmentDays, i)),
}))

export const superAdminStudentAssessmentsSubtitle = 'Scores and attempts for individual learners.'
export const superAdminStudentAssessmentsKpis: SuperAdminStudentKpi[] = [
  { id: 'score', label: 'Avg. score', value: '78.4%', detail: '+1.2% vs previous 30 days' },
  { id: 'pass', label: 'Pass rate', value: '83%', detail: `pass mark ${superAdminStudentPassMark}%` },
  { id: 'retakes', label: 'Retakes pending', value: '46', detail: 'awaiting approval or attempt' },
]
export const superAdminStudentAssessmentTabs: SuperAdminStudentTab<SuperAdminStudentAssessmentResult>[] = [
  { id: 'all', label: 'All' },
  { id: 'Passed', label: 'Passed' },
  { id: 'Failed', label: 'Failed' },
  { id: 'Retake allowed', label: 'Retake allowed' },
]
export const superAdminStudentAssessmentsTip =
  'Allowing a retake resets the attempt timer. Learners are limited to three attempts per final assessment.'

/* ------------------------------ Certificates ----------------------------- */

export type SuperAdminStudentCertificateStatus = 'Valid' | 'Expired' | 'Revoked'

export type SuperAdminStudentCertificate = {
  id: string
  student: string
  course: string
  issued: string
  expiry: string
  cpdHours: number
  status: SuperAdminStudentCertificateStatus
}

const certificateDays = [3, 5, 9, 14, 22, 31, 48, 67, 90, 120, 150, 200, 260, 320, 400, 520, 600, 700, 740, 800]

export const superAdminStudentCertificates: SuperAdminStudentCertificate[] = certificateDays.map((days, i) => {
  const course = courseAt(i * 3 + 2)
  const issued = studentDaysAgo(days)
  const expiry = addDays(issued, 730)
  return {
    id: `MQ-CERT-${27010 + i * 9}`,
    student: at(superAdminStudentNames, i + 12),
    course: course.name,
    issued,
    expiry,
    cpdHours: course.cpd,
    status: i === 6 ? 'Revoked' : days > 730 ? 'Expired' : 'Valid',
  }
})

export const superAdminStudentCertificatesSubtitle =
  'Certificates held by individual students, with validity and CPD hours.'
export const superAdminStudentCertificatesKpis: SuperAdminStudentKpi[] = [
  { id: 'held', label: 'Student certificates', value: '11,208', detail: '+2.4% vs previous 30 days' },
  { id: 'issued', label: 'Issued (30d)', value: '271', detail: '+6.3% vs previous 30 days' },
  { id: 'downloads', label: 'Downloads (30d)', value: '1,904', detail: '+11% vs previous 30 days' },
]
export const superAdminStudentCertificateTabs: SuperAdminStudentTab<SuperAdminStudentCertificateStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Valid', label: 'Valid' },
  { id: 'Expired', label: 'Expired' },
  { id: 'Revoked', label: 'Revoked' },
]
export const superAdminStudentCertificatesTip =
  'Certificates are valid for 24 months. Revoked certificates fail public verification immediately.'

/* ------------------------------ Payment history -------------------------- */

export type SuperAdminStudentPaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'

export type SuperAdminStudentPayment = {
  id: string
  student: string
  invoice: string
  amount: number
  method: string
  date: string
  status: SuperAdminStudentPaymentStatus
}

const paymentStatuses: SuperAdminStudentPaymentStatus[] = [
  'Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Failed', 'Paid', 'Paid', 'Refunded', 'Paid',
  'Paid', 'Pending', 'Paid', 'Failed', 'Paid', 'Paid', 'Paid', 'Refunded', 'Paid', 'Failed',
]
const paymentDays = [0, 1, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 14, 16, 18, 21, 23, 26, 28, 30]

export const superAdminStudentPayments: SuperAdminStudentPayment[] = paymentDays.map((days, i) => ({
  id: `pay-${i + 1}`,
  student: at(superAdminStudentNames, i + 14),
  invoice: `INV-${71200 + i * 5}`,
  amount: courseAt(i * 3 + 3).price,
  method: at(superAdminStudentPaymentMethods, i + (i % 2)),
  date: studentDaysAgo(days),
  status: at(paymentStatuses, i),
}))

export const superAdminStudentPaymentsSubtitle =
  'Individual learner payments, refunds and failed transactions.'
export const superAdminStudentPaymentsKpis: SuperAdminStudentKpi[] = [
  { id: 'collected', label: 'Collected (30d)', value: 'KWD 27,310', detail: '+5.1% vs previous 30 days' },
  { id: 'failed', label: 'Failed payments', value: '38', detail: 'retry or contact the learner' },
  { id: 'refunded', label: 'Refunded', value: 'KWD 412', detail: 'last 30 days' },
]
export const superAdminStudentPaymentTabs: SuperAdminStudentTab<SuperAdminStudentPaymentStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Failed', label: 'Failed' },
  { id: 'Refunded', label: 'Refunded' },
]
export const superAdminStudentPaymentsTip =
  'Refunds return to the original payment method within 5–7 business days. KNET refunds are usually faster.'
