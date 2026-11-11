/* Super Admin · Users & Permissions (Figma section 12) — sample data (Kuwait staff, @maqskillz.com) */

export const superAdminUsersPageSize = 8
export const superAdminUsersToday = '2026-11-10'

export type SuperAdminUsersStatusAction = {
  label: string
  to: string
  from: string[]
  /** `{name}` is replaced with the row name. */
  notice?: string
  danger?: boolean
}

export const superAdminUsersEmail = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, '.')}@maqskillz.com`

/* ----------------------------- Administrator accounts ----------------------------- */

export type SuperAdminAdminRole = 'Owner' | 'Super Admin' | 'Finance Admin' | 'Support Admin' | 'Operations Admin'
export type SuperAdminAdminStatus = 'Active' | 'Invited' | 'Suspended'

export type SuperAdminAdministrator = {
  id: string
  name: string
  email: string
  role: SuperAdminAdminRole
  twoFa: boolean
  lastLogin: string | null
  /** Shown in the table, e.g. "Today, 9:12 AM" or "Never". */
  lastSeen: string
  status: SuperAdminAdminStatus
}

export const superAdminAdminRoles: readonly SuperAdminAdminRole[] = [
  'Super Admin',
  'Finance Admin',
  'Support Admin',
  'Operations Admin',
]

const admin = (
  id: string,
  name: string,
  email: string,
  role: SuperAdminAdminRole,
  twoFa: boolean,
  lastSeen: string,
  status: SuperAdminAdminStatus,
): SuperAdminAdministrator => ({
  id,
  name,
  email,
  role,
  twoFa,
  lastLogin: lastSeen === 'Never' ? null : '2026-11-11',
  lastSeen,
  status,
})

/** Matches the Figma Administrator Accounts frame: one Owner, three Super Admins, one invite pending. */
export const superAdminAdministrators: SuperAdminAdministrator[] = [
  admin('adm-1', 'Faisal Al-Mutawa', 'faisal@maqskillz.com', 'Owner', true, 'Today, 9:12 AM', 'Active'),
  admin('adm-2', 'Noura Al-Hamad', 'noura@maqskillz.com', 'Super Admin', true, 'Today, 8:40 AM', 'Active'),
  admin('adm-3', 'Tariq Al-Sabah', 'tariq@maqskillz.com', 'Super Admin', true, '6 Nov 2026', 'Active'),
  admin('adm-4', 'Hamad Al-Rashidi', 'hamad@maqskillz.com', 'Super Admin', false, 'Never', 'Invited'),
]

/** Sign-ins this week, Mon–Sun (uneven on purpose). */
export const superAdminAdminSignIns = [
  { label: 'Mon', value: 14 },
  { label: 'Tue', value: 22 },
  { label: 'Wed', value: 18 },
  { label: 'Thu', value: 31 },
  { label: 'Fri', value: 26 },
  { label: 'Sat', value: 9 },
  { label: 'Sun', value: 6 },
]

export const superAdminAdministratorActions: SuperAdminUsersStatusAction[] = [
  { label: 'Suspend', to: 'Suspended', from: ['Active', 'Invited'], danger: true, notice: '{name} suspended. They can no longer sign in (sample).' },
  { label: 'Reactivate', to: 'Active', from: ['Suspended'], notice: '{name} reactivated (sample).' },
  { label: 'Resend invite', to: 'Invited', from: ['Invited'], notice: 'Invite re-sent to {name}.' },
]

/* ----------------------------- Content admin accounts ----------------------------- */

export type SuperAdminContentAdminStatus = 'Active' | 'Invited' | 'Suspended'
export type SuperAdminContentScope = 'Health & Safety' | 'Quality & ISO' | 'Business Skills' | 'All categories' | 'IT & Security'

export const superAdminContentScopes: readonly SuperAdminContentScope[] = [
  'Health & Safety',
  'Quality & ISO',
  'Business Skills',
  'All categories',
  'IT & Security',
]

export type SuperAdminContentAdmin = {
  id: string
  name: string
  email: string
  scope: SuperAdminContentScope
  courses: number
  lastLogin: string | null
  status: SuperAdminContentAdminStatus
}

const contentAdmin = (
  id: string,
  name: string,
  scope: SuperAdminContentScope,
  courses: number,
  lastLogin: string | null,
  status: SuperAdminContentAdminStatus,
): SuperAdminContentAdmin => ({ id, name, email: superAdminUsersEmail(name), scope, courses, lastLogin, status })

export const superAdminContentAdmins: SuperAdminContentAdmin[] = [
  contentAdmin('cad-1', 'Noor Al-Hamad', 'Health & Safety', 34, '2026-11-10', 'Active'),
  contentAdmin('cad-2', 'Dana Al-Otaibi', 'Quality & ISO', 21, '2026-11-09', 'Active'),
  contentAdmin('cad-3', 'Faisal Al-Mutawa', 'Business Skills', 12, null, 'Invited'),
  contentAdmin('cad-4', 'Bader Al-Failakawi', 'All categories', 29, '2026-11-08', 'Active'),
  contentAdmin('cad-5', 'Anita Sharma', 'IT & Security', 8, '2026-10-19', 'Suspended'),
  contentAdmin('cad-6', 'Vikram Iyer', 'Health & Safety', 15, '2026-11-07', 'Active'),
  contentAdmin('cad-7', 'Mariam Al-Rashidi', 'Quality & ISO', 6, '2026-11-06', 'Active'),
  contentAdmin('cad-8', 'Yousef Al-Enezi', 'Business Skills', 3, '2026-11-03', 'Active'),
]

export const superAdminContentAdminActions: SuperAdminUsersStatusAction[] = [
  { label: 'Suspend', to: 'Suspended', from: ['Active', 'Invited'], danger: true, notice: '{name} suspended (sample).' },
  { label: 'Reactivate', to: 'Active', from: ['Suspended'], notice: '{name} reactivated (sample).' },
]

/* ------------------------------- Role permissions ------------------------------- */

export type SuperAdminRoleStatus = 'Active' | 'Draft'

export type SuperAdminRole = {
  id: string
  role: string
  description: string
  users: number
  modules: string
  updated: string
  status: SuperAdminRoleStatus
}

export const superAdminRoles: SuperAdminRole[] = [
  { id: 'rol-1', role: 'Super Admin', description: 'Full platform access', users: 1, modules: 'All', updated: '2026-10-02', status: 'Active' },
  { id: 'rol-2', role: 'Finance Admin', description: 'Sales, refunds and invoices', users: 2, modules: '4 of 13', updated: '2026-10-18', status: 'Active' },
  { id: 'rol-3', role: 'Support Admin', description: 'Tickets and queries', users: 4, modules: '3 of 13', updated: '2026-09-27', status: 'Active' },
  { id: 'rol-4', role: 'Operations Admin', description: 'Live classes and organizations', users: 2, modules: '5 of 13', updated: '2026-10-30', status: 'Active' },
  { id: 'rol-5', role: 'Content Admin', description: 'Courses and assessments', users: 8, modules: '6 of 13', updated: '2026-11-04', status: 'Active' },
  { id: 'rol-6', role: 'Report Viewer', description: 'Read-only analytics', users: 3, modules: '2 of 13', updated: '2026-08-15', status: 'Active' },
  { id: 'rol-7', role: 'Auditor', description: 'Read-only logs', users: 1, modules: '2 of 13', updated: '2026-11-06', status: 'Draft' },
]

export const superAdminRoleActions: SuperAdminUsersStatusAction[] = [
  { label: 'Activate', to: 'Active', from: ['Draft'], notice: '{name} role activated (sample).' },
]

/* ------------------------------- Account access ------------------------------- */

export type SuperAdminAccessLevel = 'Full' | 'Limited' | 'Read-only'
export type SuperAdminAccessStatus = 'Granted' | 'Pending review' | 'Revoked'
export type SuperAdminIpRule = 'Office only' | 'Any IP'

export type SuperAdminAccessRow = {
  id: string
  account: string
  role: string
  level: SuperAdminAccessLevel
  ip: SuperAdminIpRule
  /** ISO date the password was last changed. */
  password: string
  status: SuperAdminAccessStatus
}

export const superAdminAccessLevels: readonly SuperAdminAccessLevel[] = ['Full', 'Limited', 'Read-only']

export const superAdminAccessRows: SuperAdminAccessRow[] = [
  { id: 'acc-1', account: 'Hessa Al-Sabah', role: 'Super Admin', level: 'Full', ip: 'Office only', password: '2026-09-12', status: 'Granted' },
  { id: 'acc-2', account: 'Bader Al-Failakawi', role: 'Finance Admin', level: 'Full', ip: 'Office only', password: '2026-10-01', status: 'Granted' },
  { id: 'acc-3', account: 'Noor Al-Hamad', role: 'Support Admin', level: 'Limited', ip: 'Any IP', password: '2026-07-20', status: 'Pending review' },
  { id: 'acc-4', account: 'Faisal Al-Mutawa', role: 'Content Admin', level: 'Limited', ip: 'Office only', password: '2026-10-22', status: 'Granted' },
  { id: 'acc-5', account: 'Anita Sharma', role: 'Auditor', level: 'Read-only', ip: 'Any IP', password: '2026-06-30', status: 'Revoked' },
  { id: 'acc-6', account: 'Vikram Iyer', role: 'Support Admin', level: 'Limited', ip: 'Office only', password: '2026-10-15', status: 'Granted' },
  { id: 'acc-7', account: 'Dana Al-Otaibi', role: 'Content Admin', level: 'Limited', ip: 'Any IP', password: '2026-11-02', status: 'Granted' },
  { id: 'acc-8', account: 'Mariam Al-Rashidi', role: 'Super Admin', level: 'Full', ip: 'Office only', password: '2026-10-28', status: 'Granted' },
  { id: 'acc-9', account: 'Yousef Al-Enezi', role: 'Auditor', level: 'Read-only', ip: 'Any IP', password: '2026-08-30', status: 'Granted' },
]

export const superAdminAccessActions: SuperAdminUsersStatusAction[] = [
  { label: 'Grant', to: 'Granted', from: ['Pending review', 'Revoked'], notice: 'Access granted to {name} (sample).' },
  { label: 'Revoke', to: 'Revoked', from: ['Granted', 'Pending review'], danger: true, notice: 'Access revoked for {name} (sample).' },
]

/* ------------------------------- Account status ------------------------------- */

export type SuperAdminAccountState = 'Active' | 'Locked' | 'Suspended' | 'Deactivated'
export type SuperAdminAccountType = 'Student' | 'Employee' | 'Organization admin' | 'Instructor'

export type SuperAdminAccountStatusRow = {
  id: string
  account: string
  type: SuperAdminAccountType
  reason: string
  changed: string
  by: string
  status: SuperAdminAccountState
}

export const superAdminAccountStates: readonly SuperAdminAccountState[] = ['Active', 'Locked', 'Suspended', 'Deactivated']
export const superAdminAccountTypes: readonly SuperAdminAccountType[] = ['Student', 'Employee', 'Organization admin', 'Instructor']

export const superAdminAccountStatusRows: SuperAdminAccountStatusRow[] = [
  { id: 'st-1', account: 'Fatima Al-Mutairi', type: 'Student', reason: '—', changed: '2026-11-09', by: 'Hessa Al-Sabah', status: 'Active' },
  { id: 'st-2', account: 'Abdullah Al-Rashid', type: 'Employee', reason: 'Too many failed logins', changed: '2026-11-10', by: 'Noor Al-Hamad', status: 'Locked' },
  { id: 'st-3', account: 'Kuwait Gulf Logistics', type: 'Organization admin', reason: 'Payment dispute', changed: '2026-11-07', by: 'Bader Al-Failakawi', status: 'Suspended' },
  { id: 'st-4', account: 'Sara Al-Dosari', type: 'Student', reason: 'Requested by organization', changed: '2026-11-04', by: 'Faisal Al-Mutawa', status: 'Deactivated' },
  { id: 'st-5', account: 'Yousef Al-Kandari', type: 'Instructor', reason: '—', changed: '2026-11-08', by: 'Dana Al-Otaibi', status: 'Active' },
  { id: 'st-6', account: 'Reem Al-Ghanim', type: 'Student', reason: 'Too many failed logins', changed: '2026-11-10', by: 'Noor Al-Hamad', status: 'Locked' },
  { id: 'st-7', account: 'Hamad Al-Shatti', type: 'Employee', reason: 'Policy violation', changed: '2026-11-02', by: 'Vikram Iyer', status: 'Suspended' },
  { id: 'st-8', account: 'Layla Al-Qattan', type: 'Student', reason: '—', changed: '2026-11-06', by: 'Anita Sharma', status: 'Active' },
  { id: 'st-9', account: 'Salem Al-Azmi', type: 'Employee', reason: 'Too many failed logins', changed: '2026-11-09', by: 'Hessa Al-Sabah', status: 'Locked' },
  { id: 'st-10', account: 'Al-Bader Training Co.', type: 'Organization admin', reason: 'Policy violation', changed: '2026-10-29', by: 'Bader Al-Failakawi', status: 'Suspended' },
  { id: 'st-11', account: 'Mona Al-Hajeri', type: 'Student', reason: '—', changed: '2026-11-05', by: 'Dana Al-Otaibi', status: 'Active' },
  { id: 'st-12', account: 'Khaled Al-Enezi', type: 'Instructor', reason: '—', changed: '2026-11-01', by: 'Yousef Al-Enezi', status: 'Active' },
]

export const superAdminAccountStatusActions: SuperAdminUsersStatusAction[] = [
  { label: 'Reactivate', to: 'Active', from: ['Locked', 'Suspended', 'Deactivated'], notice: '{name} reactivated (sample).' },
  { label: 'Suspend', to: 'Suspended', from: ['Active', 'Locked'], danger: true, notice: '{name} suspended (sample).' },
  { label: 'Lock', to: 'Locked', from: ['Active'], danger: true, notice: '{name} locked (sample).' },
]

/* ------------------------------ Admin activity logs ------------------------------ */

export type SuperAdminActivityModule = 'Courses' | 'Sales' | 'Users' | 'Certificates'

export type SuperAdminActivityLog = {
  id: string
  time: string
  admin: string
  action: string
  module: SuperAdminActivityModule
  ip: string
  result: 'Success' | 'Failed'
}

export const superAdminActivityModules: readonly SuperAdminActivityModule[] = ['Courses', 'Sales', 'Users', 'Certificates']

const log = (
  id: string,
  time: string,
  admin: string,
  action: string,
  module: SuperAdminActivityModule,
  ip: string,
  result: 'Success' | 'Failed' = 'Success',
): SuperAdminActivityLog => ({ id, time, admin, action, module, ip, result })

export const superAdminActivityLogs: SuperAdminActivityLog[] = [
  log('log-1', '2026-11-10 16:41', 'Hessa Al-Sabah', 'Published course', 'Courses', '94.128.14.22'),
  log('log-2', '2026-11-10 15:20', 'Bader Al-Failakawi', 'Issued refund', 'Sales', '185.60.112.8'),
  log('log-3', '2026-11-10 13:48', 'Noor Al-Hamad', 'Updated course pricing', 'Courses', '94.128.14.90'),
  log('log-4', '2026-11-10 11:05', 'Faisal Al-Mutawa', 'Suspended account', 'Users', '41.208.70.15', 'Failed'),
  log('log-5', '2026-11-10 10:32', 'Anita Sharma', 'Edited certificate template', 'Certificates', '94.128.20.3'),
  log('log-6', '2026-11-10 09:14', 'Vikram Iyer', 'Exported orders', 'Sales', '94.128.14.22'),
  log('log-7', '2026-11-09 17:36', 'Dana Al-Otaibi', 'Changed role permissions', 'Users', '185.60.112.8'),
  log('log-8', '2026-11-09 15:02', 'Hessa Al-Sabah', 'Published course', 'Courses', '94.128.14.22'),
  log('log-9', '2026-11-09 13:15', 'Bader Al-Failakawi', 'Exported orders', 'Sales', '94.128.14.90'),
  log('log-10', '2026-11-09 11:40', 'Noor Al-Hamad', 'Published course', 'Courses', '94.128.14.90'),
  log('log-11', '2026-11-09 10:08', 'Hessa Al-Sabah', 'Added administrator', 'Users', '94.128.14.22'),
  log('log-12', '2026-11-08 16:25', 'Faisal Al-Mutawa', 'Issued refund', 'Sales', '41.208.70.15', 'Failed'),
  log('log-13', '2026-11-08 14:12', 'Dana Al-Otaibi', 'Edited certificate template', 'Certificates', '185.60.112.8'),
  log('log-14', '2026-11-08 09:50', 'Vikram Iyer', 'Updated course pricing', 'Courses', '94.128.20.3'),
  log('log-15', '2026-11-07 12:30', 'Hessa Al-Sabah', 'Suspended account', 'Users', '94.128.14.22'),
  log('log-16', '2026-11-07 10:03', 'Anita Sharma', 'Exported orders', 'Sales', '94.128.20.3'),
]

/** Actions by hour for today, 00–23 (uneven on purpose). */
export const superAdminActivityHours = [
  1, 0, 0, 1, 2, 5, 11, 24, 52, 71, 83, 58, 27, 36, 61, 49, 37, 22, 12, 7, 5, 3, 2, 1,
].map((value, hour) => ({ label: String(hour).padStart(2, '0'), value }))

/* ------------------------------ Security audit logs ------------------------------ */

export type SuperAdminSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

export type SuperAdminSecurityEvent = {
  id: string
  time: string
  event: string
  account: string
  ip: string
  location: string
  severity: SuperAdminSeverity
}

export const superAdminSeverities: readonly SuperAdminSeverity[] = ['Low', 'Medium', 'High', 'Critical']

const sec = (
  id: string,
  time: string,
  event: string,
  account: string,
  ip: string,
  location: string,
  severity: SuperAdminSeverity,
): SuperAdminSecurityEvent => ({ id, time, event, account, ip, location, severity })

export const superAdminSecurityEvents: SuperAdminSecurityEvent[] = [
  sec('sec-1', '2026-11-10 22:41', 'New device login', 'Hessa Al-Sabah', '94.128.14.22', 'Kuwait City, KW', 'Low'),
  sec('sec-2', '2026-11-10 18:20', '5 failed logins', 'Bader Al-Failakawi', '185.60.112.8', 'Dubai, AE', 'Medium'),
  sec('sec-3', '2026-11-10 14:48', '2FA disabled', 'Anita Sharma', '41.208.70.15', 'Riyadh, SA', 'Critical'),
  sec('sec-4', '2026-11-10 11:09', 'Role changed', 'Noor Al-Hamad', '94.128.14.90', 'Kuwait City, KW', 'High'),
  sec('sec-5', '2026-11-10 08:32', 'Password changed', 'Dana Al-Otaibi', '94.128.14.22', 'Kuwait City, KW', 'Low'),
  sec('sec-6', '2026-11-10 02:14', 'IP blocked', 'Unknown', '94.128.20.3', 'Unknown', 'High'),
  sec('sec-7', '2026-11-09 21:55', 'API key rotated', 'Vikram Iyer', '94.128.14.90', 'Kuwait City, KW', 'Low'),
  sec('sec-8', '2026-11-09 17:10', '5 failed logins', 'Faisal Al-Mutawa', '41.208.70.15', 'Riyadh, SA', 'Medium'),
  sec('sec-9', '2026-11-09 13:02', 'New device login', 'Hessa Al-Sabah', '94.128.14.22', 'Kuwait City, KW', 'Low'),
  sec('sec-10', '2026-11-09 09:44', 'Password changed', 'Mariam Al-Rashidi', '94.128.14.90', 'Kuwait City, KW', 'Low'),
  sec('sec-11', '2026-11-08 23:18', '5 failed logins', 'Unknown', '185.60.112.8', 'Dubai, AE', 'Medium'),
  sec('sec-12', '2026-11-08 15:36', 'Role changed', 'Yousef Al-Enezi', '94.128.14.22', 'Kuwait City, KW', 'Medium'),
  sec('sec-13', '2026-11-08 10:21', 'New device login', 'Dana Al-Otaibi', '94.128.14.90', 'Kuwait City, KW', 'Low'),
  sec('sec-14', '2026-11-07 19:03', 'API key rotated', 'Bader Al-Failakawi', '94.128.14.22', 'Kuwait City, KW', 'Medium'),
]

/** Security events this week, Mon–Sun (uneven on purpose). */
export const superAdminSecurityWeek = [
  { label: 'Mon', value: 9 },
  { label: 'Tue', value: 14 },
  { label: 'Wed', value: 7 },
  { label: 'Thu', value: 26 },
  { label: 'Fri', value: 18 },
  { label: 'Sat', value: 5 },
  { label: 'Sun', value: 12 },
]

export const superAdminSecurityActions: SuperAdminUsersStatusAction[] = [
  { label: 'Acknowledge', to: 'Low', from: ['Medium', 'High', 'Critical'], notice: 'Security event for {name} acknowledged.' },
]
