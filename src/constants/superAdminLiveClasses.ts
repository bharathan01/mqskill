/* Super Admin · Live Classes (Figma section 05) — sample data (Kuwait / GCC, AST) */

export type SuperAdminLiveKpi = {
  id: string
  label: string
  value: string
  detail: string
}

export type SuperAdminLivePoint = { label: string; value: number }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-11-12" → "12 Nov 2026" */
export function formatLiveDate(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d} ${MONTHS[Number(m) - 1] ?? m} ${y}`
}

export const superAdminLiveToday = '2026-11-10'

export const superAdminLiveInstructors = [
  'Capt. Mubarak Al-Rushaid',
  'Dr. Aisha Karim',
  'Eng. Yousef Al-Mutawa',
  'Ms. Noura Al-Sabah',
  'Mr. Faisal Al-Enezi',
] as const

export const superAdminLiveCourses = [
  'Fire Warden Training',
  'ISO 9001 Lead Auditor',
  'ISO 14001 Internal Auditor',
  'First Aid at Work',
  'NEBOSH IGC Preparation',
  'Working at Height',
  'Manual Handling',
  'Cybersecurity Awareness for Employees',
] as const

/* ------------------------------ All live classes ------------------------------ */

export type SuperAdminLiveClassStatus = 'Scheduled' | 'Live' | 'Completed' | 'Cancelled'

export type SuperAdminLiveClass = {
  id: string
  title: string
  course: string
  instructor: string
  isoDate: string
  time: string
  registered: number
  capacity: number
  status: SuperAdminLiveClassStatus
}

const cls = (
  id: string,
  title: string,
  course: string,
  instructor: string,
  isoDate: string,
  time: string,
  registered: number,
  capacity: number,
  status: SuperAdminLiveClassStatus,
): SuperAdminLiveClass => ({ id, title, course, instructor, isoDate, time, registered, capacity, status })

const [mubarak, aisha, yousef, noura, faisal] = superAdminLiveInstructors

export const superAdminLiveClassesSubtitle =
  'Every scheduled, live and completed Zoom class across all courses and instructors.'

export const superAdminLiveClassesKpis: SuperAdminLiveKpi[] = [
  { id: 'month', label: 'Sessions this month', value: '64', detail: '+8 vs last month' },
  { id: 'attendance', label: 'Avg. attendance', value: '82%', detail: '+3% vs last month' },
  { id: 'scheduled', label: 'Scheduled', value: '9', detail: 'next 7 days' },
]

export const superAdminLiveClasses: SuperAdminLiveClass[] = [
  cls('LC-2041', 'Fire Warden Refresher — Live Practical', 'Fire Warden Training', mubarak, '2026-11-12', '17:30', 84, 150, 'Scheduled'),
  cls('LC-2042', 'ISO 9001 Audit Clinic', 'ISO 9001 Lead Auditor', aisha, '2026-11-13', '14:00', 62, 100, 'Scheduled'),
  cls('LC-2040', 'First Aid at Work — CPR Masterclass', 'First Aid at Work', noura, '2026-11-10', '19:00', 118, 150, 'Live'),
  cls('LC-2043', 'Working at Height — Rescue Workshop', 'Working at Height', yousef, '2026-11-16', '09:00', 47, 80, 'Scheduled'),
  cls('LC-2044', 'ISO 14001 Internal Audit Q&A', 'ISO 14001 Internal Auditor', aisha, '2026-11-18', '14:00', 71, 120, 'Scheduled'),
  cls('LC-2045', 'NEBOSH IGC — Revision Session 3', 'NEBOSH IGC Preparation', faisal, '2026-11-19', '19:00', 96, 120, 'Scheduled'),
  cls('LC-2036', 'Manual Handling Practical', 'Manual Handling', yousef, '2026-11-08', '09:00', 58, 100, 'Completed'),
  cls('LC-2035', 'Cybersecurity Awareness Live Q&A', 'Cybersecurity Awareness for Employees', faisal, '2026-11-06', '14:00', 112, 150, 'Completed'),
  cls('LC-2033', 'Fire Warden Masterclass', 'Fire Warden Training', mubarak, '2026-11-04', '17:30', 101, 150, 'Completed'),
  cls('LC-2031', 'ISO 9001 Lead Auditor — Case Studies', 'ISO 9001 Lead Auditor', aisha, '2026-11-02', '19:00', 79, 100, 'Completed'),
  cls('LC-2030', 'First Aid at Work — Refresher', 'First Aid at Work', noura, '2026-10-30', '09:00', 66, 100, 'Cancelled'),
  cls('LC-2028', 'Working at Height — Equipment Check', 'Working at Height', yousef, '2026-10-28', '14:00', 54, 80, 'Completed'),
  cls('LC-2026', 'NEBOSH IGC — Revision Session 2', 'NEBOSH IGC Preparation', faisal, '2026-10-26', '19:00', 91, 120, 'Completed'),
  cls('LC-2024', 'ISO 14001 Implementation Workshop', 'ISO 14001 Internal Auditor', aisha, '2026-10-22', '17:30', 68, 120, 'Cancelled'),
]

export const superAdminLiveClassTabs = [
  { id: 'all', label: 'All' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'Live', label: 'Live' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Cancelled', label: 'Cancelled' },
] as const

export type SuperAdminLiveClassTabId = (typeof superAdminLiveClassTabs)[number]['id']

export const superAdminLiveClassesPageSize = 6

export const superAdminLiveTip =
  'Send reminders 24 hours and 1 hour before start — classes with both reminders average 9% higher attendance.'

/* ------------------------------ Schedule live class ------------------------------ */

export type SuperAdminLiveScheduleValues = {
  title: string
  course: string
  instructor: string
  description: string
  date: string
  startTime: string
  duration: string
  capacity: string
  audience: string
  zoom: string
  record: boolean
  reminders: boolean
}

export type SuperAdminLiveScheduledItem = {
  id: string
  title: string
  instructor: string
  isoDate: string
  startTime: string
}

export const superAdminLiveScheduleSubtitle =
  'Create a Zoom session, invite learners and send reminders automatically.'

export const superAdminLiveAudiences = ['All enrolled students', 'Organization cohort', 'Invite only'] as const

export const superAdminLiveScheduleDefaults: SuperAdminLiveScheduleValues = {
  title: '',
  course: superAdminLiveCourses[0],
  instructor: superAdminLiveInstructors[0],
  description: '',
  date: '',
  startTime: '17:30',
  duration: '90',
  capacity: '100',
  audience: superAdminLiveAudiences[0],
  zoom: '',
  record: true,
  reminders: true,
}

export const superAdminLiveRecentlyScheduled: SuperAdminLiveScheduledItem[] = [
  { id: 'rs-1', title: 'Fire Warden Refresher — Live Practical', instructor: mubarak, isoDate: '2026-11-12', startTime: '17:30' },
  { id: 'rs-2', title: 'ISO 9001 Audit Clinic', instructor: aisha, isoDate: '2026-11-13', startTime: '14:00' },
]

/* ------------------------------ Upcoming sessions ------------------------------ */

export type SuperAdminUpcomingStatus = 'Confirmed' | 'Pending' | 'Needs host'

export type SuperAdminUpcomingSession = {
  id: string
  title: string
  isoDate: string
  time: string
  instructor: string
  registered: number
  status: SuperAdminUpcomingStatus
}

export const superAdminUpcomingSubtitle =
  'Sessions scheduled for the coming weeks — confirm hosts and remind learners.'

export const superAdminUpcomingSessions: SuperAdminUpcomingSession[] = [
  { id: 'up-1', title: 'Fire Warden Refresher — Live Practical', isoDate: '2026-11-12', time: '17:30', instructor: mubarak, registered: 84, status: 'Confirmed' },
  { id: 'up-2', title: 'ISO 9001 Audit Clinic', isoDate: '2026-11-13', time: '14:00', instructor: aisha, registered: 62, status: 'Confirmed' },
  { id: 'up-3', title: 'Working at Height — Rescue Workshop', isoDate: '2026-11-16', time: '09:00', instructor: yousef, registered: 47, status: 'Pending' },
  { id: 'up-4', title: 'ISO 14001 Internal Audit Q&A', isoDate: '2026-11-18', time: '14:00', instructor: aisha, registered: 71, status: 'Confirmed' },
  { id: 'up-5', title: 'NEBOSH IGC — Revision Session 3', isoDate: '2026-11-19', time: '19:00', instructor: faisal, registered: 96, status: 'Needs host' },
  { id: 'up-6', title: 'Manual Handling Practical', isoDate: '2026-11-20', time: '09:00', instructor: yousef, registered: 39, status: 'Confirmed' },
  { id: 'up-7', title: 'First Aid at Work — CPR Masterclass', isoDate: '2026-11-23', time: '19:00', instructor: noura, registered: 118, status: 'Confirmed' },
  { id: 'up-8', title: 'Cybersecurity Awareness Live Q&A', isoDate: '2026-11-25', time: '14:00', instructor: faisal, registered: 88, status: 'Pending' },
  { id: 'up-9', title: 'Fire Warden Masterclass', isoDate: '2026-11-26', time: '17:30', instructor: mubarak, registered: 104, status: 'Needs host' },
  { id: 'up-10', title: 'ISO 9001 Lead Auditor — Mock Audit', isoDate: '2026-11-30', time: '19:00', instructor: aisha, registered: 73, status: 'Confirmed' },
]

export const superAdminUpcomingPageSize = 6

/* ------------------------------ Completed sessions ------------------------------ */

export type SuperAdminRecordingStatus = 'Available' | 'Processing' | 'Not recorded'

export type SuperAdminCompletedSession = {
  id: string
  title: string
  isoDate: string
  instructor: string
  attendees: number
  rating: number
  recording: SuperAdminRecordingStatus
}

export const superAdminCompletedSubtitle = 'Past sessions with attendance, ratings and recordings.'

export const superAdminCompletedKpis: SuperAdminLiveKpi[] = [
  { id: 'completed', label: 'Completed (30d)', value: '41', detail: 'sessions delivered' },
  { id: 'rating', label: 'Avg. rating', value: '4.7 / 5', detail: 'from learner feedback' },
  { id: 'recordings', label: 'Recordings ready', value: '38', detail: 'of 41 sessions' },
]

export const superAdminCompletedSessions: SuperAdminCompletedSession[] = [
  { id: 'cs-1', title: 'Manual Handling Practical', isoDate: '2026-11-08', instructor: yousef, attendees: 52, rating: 4.6, recording: 'Processing' },
  { id: 'cs-2', title: 'Cybersecurity Awareness Live Q&A', isoDate: '2026-11-06', instructor: faisal, attendees: 98, rating: 4.8, recording: 'Available' },
  { id: 'cs-3', title: 'Fire Warden Masterclass', isoDate: '2026-11-04', instructor: mubarak, attendees: 93, rating: 4.9, recording: 'Available' },
  { id: 'cs-4', title: 'ISO 9001 Lead Auditor — Case Studies', isoDate: '2026-11-02', instructor: aisha, attendees: 71, rating: 4.7, recording: 'Available' },
  { id: 'cs-5', title: 'Working at Height — Equipment Check', isoDate: '2026-10-28', instructor: yousef, attendees: 47, rating: 4.4, recording: 'Not recorded' },
  { id: 'cs-6', title: 'NEBOSH IGC — Revision Session 2', isoDate: '2026-10-26', instructor: faisal, attendees: 84, rating: 4.5, recording: 'Available' },
  { id: 'cs-7', title: 'First Aid at Work — CPR Masterclass', isoDate: '2026-10-23', instructor: noura, attendees: 109, rating: 4.9, recording: 'Available' },
  { id: 'cs-8', title: 'ISO 14001 Internal Audit Q&A', isoDate: '2026-10-21', instructor: aisha, attendees: 64, rating: 4.3, recording: 'Processing' },
  { id: 'cs-9', title: 'Fire Warden Refresher — Practical', isoDate: '2026-10-19', instructor: mubarak, attendees: 88, rating: 4.8, recording: 'Available' },
  { id: 'cs-10', title: 'Cybersecurity — Phishing Simulation Lab', isoDate: '2026-10-15', instructor: faisal, attendees: 76, rating: 4.6, recording: 'Available' },
]

export const superAdminCompletedPageSize = 6

/* ------------------------------ Zoom meeting links ------------------------------ */

export type SuperAdminZoomStatus = 'Active' | 'Expired' | 'Revoked'

export type SuperAdminZoomLink = {
  id: string
  title: string
  meetingId: string
  joinUrl: string
  host: string
  status: SuperAdminZoomStatus
  expires: string
}

export const superAdminZoomSubtitle = 'Meeting links, host accounts and access to join details for every live class.'

export const superAdminZoomPasscodeNote =
  'Passcodes are hidden here. Learners see the join link in their dashboard 30 minutes before start.'

export const superAdminZoomHosts = ['training1@maqskillz.com', 'training2@maqskillz.com', 'hse@maqskillz.com'] as const

export const superAdminZoomLinks: SuperAdminZoomLink[] = [
  { id: 'zl-1', title: 'Fire Warden Refresher — Live Practical', meetingId: '812 3400 5600', joinUrl: 'zoom.us/j/81234005600', host: 'hse@maqskillz.com', status: 'Active', expires: '12 Nov 2026' },
  { id: 'zl-2', title: 'ISO 9001 Audit Clinic', meetingId: '813 3417 5609', joinUrl: 'zoom.us/j/81334175609', host: 'training1@maqskillz.com', status: 'Active', expires: '13 Nov 2026' },
  { id: 'zl-3', title: 'Working at Height — Rescue Workshop', meetingId: '814 3434 5618', joinUrl: 'zoom.us/j/81434345618', host: 'hse@maqskillz.com', status: 'Active', expires: '16 Nov 2026' },
  { id: 'zl-4', title: 'ISO 14001 Internal Audit Q&A', meetingId: '815 3451 5627', joinUrl: 'zoom.us/j/81534515627', host: 'training2@maqskillz.com', status: 'Active', expires: '18 Nov 2026' },
  { id: 'zl-5', title: 'NEBOSH IGC — Revision Session 3', meetingId: '816 3468 5636', joinUrl: 'zoom.us/j/81634685636', host: 'training2@maqskillz.com', status: 'Active', expires: '19 Nov 2026' },
  { id: 'zl-6', title: 'Manual Handling Practical', meetingId: '817 3485 5645', joinUrl: 'zoom.us/j/81734855645', host: 'hse@maqskillz.com', status: 'Expired', expires: '08 Nov 2026' },
  { id: 'zl-7', title: 'Cybersecurity Awareness Live Q&A', meetingId: '818 3502 5654', joinUrl: 'zoom.us/j/81835025654', host: 'training1@maqskillz.com', status: 'Expired', expires: '06 Nov 2026' },
  { id: 'zl-8', title: 'First Aid at Work — Refresher', meetingId: '819 3519 5663', joinUrl: 'zoom.us/j/81935195663', host: 'training1@maqskillz.com', status: 'Revoked', expires: '30 Oct 2026' },
]

export const superAdminZoomPageSize = 6

/** Classes without a link yet — used by "Generate link". */
export const superAdminZoomPendingClasses = [
  'First Aid at Work — CPR Masterclass',
  'Cybersecurity Awareness Live Q&A',
  'Fire Warden Masterclass',
  'ISO 9001 Lead Auditor — Mock Audit',
]

/* ------------------------------ Attendance ------------------------------ */

export type SuperAdminAttendanceStatus = 'Present' | 'Late' | 'Absent'

export type SuperAdminAttendanceRow = {
  id: string
  student: string
  org: string
  title: string
  joinedAt: string
  durationMin: number
  percent: number
  status: SuperAdminAttendanceStatus
}

export const superAdminAttendanceSubtitle =
  'Who joined, how long they stayed and how engaged each learner was in live sessions.'

export const superAdminAttendanceKpis: SuperAdminLiveKpi[] = [
  { id: 'avg', label: 'Avg. attendance', value: '82%', detail: '+3% vs last month' },
  { id: 'time', label: 'Average time in session', value: '71 min', detail: 'of 90 min scheduled' },
  { id: 'late', label: 'Late joiners', value: '11%', detail: 'joined after 10 minutes' },
  { id: 'absent', label: 'Absent', value: '7%', detail: 'registered but did not join' },
]

export const superAdminAttendanceRows: SuperAdminAttendanceRow[] = [
  { id: 'at-1', student: 'Fatima Al-Mutairi', org: 'ABC Corp', title: 'Cybersecurity Awareness Live Q&A', joinedAt: '14:02', durationMin: 58, percent: 97, status: 'Present' },
  { id: 'at-2', student: 'Yousef Al-Rashidi', org: 'Individual', title: 'ISO 9001 Lead Auditor — Case Studies', joinedAt: '19:00', durationMin: 84, percent: 93, status: 'Present' },
  { id: 'at-3', student: 'Noura Al-Sabah', org: 'Gulf Logistics Co.', title: 'Fire Warden Masterclass', joinedAt: '17:41', durationMin: 62, percent: 69, status: 'Late' },
  { id: 'at-4', student: 'Hassan Al-Enezi', org: 'ABC Corp', title: 'Manual Handling Practical', joinedAt: '—', durationMin: 0, percent: 0, status: 'Absent' },
  { id: 'at-5', student: 'Mariam Al-Kandari', org: 'Individual', title: 'ISO 9001 Lead Auditor — Case Studies', joinedAt: '19:03', durationMin: 78, percent: 87, status: 'Present' },
  { id: 'at-6', student: 'Omar Al-Ajmi', org: 'Kuwait Marine Services', title: 'Working at Height — Equipment Check', joinedAt: '14:19', durationMin: 51, percent: 57, status: 'Late' },
  { id: 'at-7', student: 'Dana Al-Failakawi', org: 'Individual', title: 'NEBOSH IGC — Revision Session 2', joinedAt: '19:01', durationMin: 88, percent: 98, status: 'Present' },
  { id: 'at-8', student: 'Khalid Al-Dosari', org: 'Al-Noor Contracting', title: 'Fire Warden Masterclass', joinedAt: '—', durationMin: 0, percent: 0, status: 'Absent' },
  { id: 'at-9', student: 'Sara Al-Hajri', org: 'ABC Corp', title: 'Cybersecurity Awareness Live Q&A', joinedAt: '14:00', durationMin: 60, percent: 100, status: 'Present' },
  { id: 'at-10', student: 'Bader Al-Otaibi', org: 'Burgan Facility Mgmt', title: 'Manual Handling Practical', joinedAt: '09:24', durationMin: 44, percent: 61, status: 'Late' },
  { id: 'at-11', student: 'Latifa Al-Azmi', org: 'Individual', title: 'NEBOSH IGC — Revision Session 2', joinedAt: '19:05', durationMin: 82, percent: 91, status: 'Present' },
  { id: 'at-12', student: 'Faisal Al-Shammari', org: 'Gulf Logistics Co.', title: 'Working at Height — Equipment Check', joinedAt: '14:02', durationMin: 70, percent: 88, status: 'Present' },
]

export const superAdminAttendancePageSize = 6

export const superAdminAttendanceBySession: SuperAdminLivePoint[] = [
  { label: 'Manual', value: 74 },
  { label: 'Cyber', value: 91 },
  { label: 'Fire', value: 78 },
  { label: 'ISO 9001', value: 86 },
  { label: 'Height', value: 69 },
  { label: 'NEBOSH', value: 88 },
]

/* ------------------------------ Live class reports ------------------------------ */

export type SuperAdminLiveReportStatus = 'Ready' | 'Scheduled' | 'Generating'

export type SuperAdminLiveReportJob = {
  id: string
  name: string
  scope: string
  format: 'PDF' | 'XLSX' | 'CSV'
  requestedBy: string
  generated: string
  status: SuperAdminLiveReportStatus
}

export const superAdminLiveReportsSubtitle =
  'Delivery, attendance and engagement summaries for every live class.'

export const superAdminLiveReportsKpis: SuperAdminLiveKpi[] = [
  { id: 'hours', label: 'Hours delivered', value: '96', detail: 'last 30 days' },
  { id: 'attendance', label: 'Avg. attendance', value: '82%', detail: '+3% vs last month' },
  { id: 'cancel', label: 'Cancellation rate', value: '3.1%', detail: '2 of 64 sessions' },
  { id: 'month', label: 'Sessions this month', value: '64', detail: '+8 vs last month' },
]

/** Deliberately uneven week-to-week data. */
export const superAdminLiveSessionsByWeek: SuperAdminLivePoint[] = [
  { label: 'W1', value: 14 },
  { label: 'W2', value: 19 },
  { label: 'W3', value: 11 },
  { label: 'W4', value: 22 },
  { label: 'W5', value: 17 },
  { label: 'W6', value: 9 },
  { label: 'W7', value: 20 },
  { label: 'W8', value: 24 },
  { label: 'W9', value: 15 },
  { label: 'W10', value: 21 },
  { label: 'W11', value: 12 },
  { label: 'W12', value: 18 },
]

export const superAdminLiveAttendanceByWeek: SuperAdminLivePoint[] = [
  { label: 'W1', value: 78 },
  { label: 'W2', value: 85 },
  { label: 'W3', value: 74 },
  { label: 'W4', value: 88 },
  { label: 'W5', value: 81 },
  { label: 'W6', value: 72 },
  { label: 'W7', value: 84 },
  { label: 'W8', value: 90 },
  { label: 'W9', value: 79 },
  { label: 'W10', value: 86 },
  { label: 'W11', value: 76 },
  { label: 'W12', value: 83 },
]

export const superAdminLiveReportJobs: SuperAdminLiveReportJob[] = [
  { id: 'lr-1', name: 'Attendance by instructor', scope: 'Last 30 days · all courses', format: 'XLSX', requestedBy: 'Super Admin', generated: '09 Nov 2026', status: 'Ready' },
  { id: 'lr-2', name: 'Sessions by course', scope: 'Oct 2026 · all instructors', format: 'PDF', requestedBy: 'Super Admin', generated: '05 Nov 2026', status: 'Ready' },
  { id: 'lr-3', name: 'Cancellations & reschedules', scope: 'Q3 2026', format: 'CSV', requestedBy: 'Capt. Mubarak Al-Rushaid', generated: '02 Nov 2026', status: 'Ready' },
  { id: 'lr-4', name: 'Peak attendance times', scope: 'Last 90 days · AST', format: 'PDF', requestedBy: 'Super Admin', generated: '10 Nov 2026', status: 'Generating' },
  { id: 'lr-5', name: 'Org cohort attendance', scope: 'ABC Corp · Gulf Logistics Co.', format: 'XLSX', requestedBy: 'Dr. Aisha Karim', generated: '28 Oct 2026', status: 'Ready' },
  { id: 'lr-6', name: 'Zoom minutes usage', scope: 'Monthly · next run 01 Dec 2026', format: 'CSV', requestedBy: 'System', generated: '—', status: 'Scheduled' },
]

export const superAdminLiveReportsPageSize = 5
