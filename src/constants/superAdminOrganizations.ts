/* Super Admin · Organizations (Figma section 07) — sample data (Kuwait / GCC, AST, KWD) */

export type SuperAdminOrgKpi = {
  id: string
  label: string
  value: string
  detail: string
}

export type SuperAdminOrgPoint = { label: string; value: number }

export type SuperAdminOrgTab<T extends string = string> = { id: 'all' | T; label: string }

export const superAdminOrgPageSize = 6

/** "KWD 1,820" / "KWD 4,250.000" */
export function formatOrgKwd(value: number, digits = 0) {
  return `KWD ${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

/** "2026-11-12" → "12 Nov 2026" */
export function formatOrgDate(iso: string) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d} ${months[Number(m) - 1] ?? m} ${y}`
}

export const superAdminOrgToday = '2026-11-10'

const tabs = <T extends string>(ids: readonly T[]): SuperAdminOrgTab<T>[] => [
  { id: 'all', label: 'All' },
  ...ids.map((id) => ({ id, label: id })),
]

/* ----------------------------- Base organizations ----------------------------- */

export type SuperAdminOrgStatus = 'Active' | 'Trial' | 'Suspended'
export type SuperAdminOrgPlan = 'Enterprise' | 'Business' | 'Starter'

type OrgSeed = {
  id: string
  name: string
  short: string
  industry: string
  country: string
  employees: number
  plan: SuperAdminOrgPlan
  joined: string
  status: SuperAdminOrgStatus
  contact: string
  email: string
  phone: string
  manager: string
  profileStatus: 'Active' | 'Onboarding'
}

const hessa = 'Hessa Al-Sabah'
const bader = 'Bader Al-Failakawi'
const vikram = 'Vikram Iyer'

const orgSeeds: OrgSeed[] = [
  { id: 'ORG-1001', name: 'ABC Corp', short: 'ABC', industry: 'Oil & Gas', country: 'Kuwait', employees: 1820, plan: 'Enterprise', joined: '2024-03-12', status: 'Active', contact: 'Fatima Al-Mutairi', email: 'fatima.almutairi@abccorp.com.kw', phone: '+965 2245 1180', manager: hessa, profileStatus: 'Active' },
  { id: 'ORG-1002', name: 'Gulf Logistics', short: 'Gulf Log.', industry: 'Logistics', country: 'Kuwait', employees: 940, plan: 'Business', joined: '2024-06-02', status: 'Active', contact: 'Omar Al-Harbi', email: 'omar.alharbi@gulflogistics.com', phone: '+965 2230 4471', manager: bader, profileStatus: 'Active' },
  { id: 'ORG-1003', name: 'Kuwait Marine Services', short: 'Marine', industry: 'Marine', country: 'Kuwait', employees: 610, plan: 'Business', joined: '2024-09-18', status: 'Active', contact: 'Capt. Salem Al-Ajmi', email: 'salem.alajmi@kuwaitmarine.com.kw', phone: '+965 2298 3320', manager: hessa, profileStatus: 'Active' },
  { id: 'ORG-1004', name: 'Al-Noor Contracting', short: 'Al-Noor', industry: 'Construction', country: 'Kuwait', employees: 1240, plan: 'Enterprise', joined: '2025-01-21', status: 'Active', contact: 'Yaqoub Al-Noor', email: 'yaqoub@alnoorcontracting.com', phone: '+965 2262 7715', manager: vikram, profileStatus: 'Active' },
  { id: 'ORG-1005', name: 'Burgan Facility Mgmt', short: 'Burgan', industry: 'Facility Management', country: 'Kuwait', employees: 380, plan: 'Starter', joined: '2025-04-09', status: 'Trial', contact: '', email: '', phone: '', manager: '', profileStatus: 'Onboarding' },
  { id: 'ORG-1006', name: 'Ahmadi Petrochemicals', short: 'Ahmadi', industry: 'Petrochemicals', country: 'Kuwait', employees: 1560, plan: 'Enterprise', joined: '2023-11-27', status: 'Active', contact: 'Dr. Latifa Al-Dosari', email: 'latifa.aldosari@ahmadipetro.com', phone: '+965 2326 9042', manager: bader, profileStatus: 'Active' },
  { id: 'ORG-1007', name: 'Al-Rashed Engineering', short: 'Al-Rashed', industry: 'Engineering', country: 'Saudi Arabia', employees: 720, plan: 'Business', joined: '2025-02-14', status: 'Active', contact: 'Khalid Al-Rashed', email: 'khalid@alrasheng.com.sa', phone: '+966 11 482 5530', manager: vikram, profileStatus: 'Active' },
  { id: 'ORG-1008', name: 'Sabah Healthcare Group', short: 'Sabah HC', industry: 'Healthcare', country: 'Kuwait', employees: 1130, plan: 'Business', joined: '2024-12-05', status: 'Active', contact: 'Dr. Mariam Al-Qattan', email: 'mariam.alqattan@sabahhc.com', phone: '+965 2481 6608', manager: hessa, profileStatus: 'Active' },
  { id: 'ORG-1009', name: 'Al-Kout Hospitality', short: 'Al-Kout', industry: 'Hospitality', country: 'Kuwait', employees: 450, plan: 'Starter', joined: '2025-07-30', status: 'Trial', contact: 'Nasser Al-Kout', email: 'nasser@alkouthospitality.com', phone: '+965 2224 1190', manager: '', profileStatus: 'Onboarding' },
  { id: 'ORG-1010', name: 'Salmiya Manufacturing Co.', short: 'Salmiya', industry: 'Manufacturing', country: 'Bahrain', employees: 860, plan: 'Business', joined: '2024-08-11', status: 'Suspended', contact: 'Hamad Al-Khalifa', email: 'hamad@salmiyamfg.com.bh', phone: '+973 1721 4408', manager: bader, profileStatus: 'Active' },
  { id: 'ORG-1011', name: 'Bayan Education Group', short: 'Bayan', industry: 'Education', country: 'Kuwait', employees: 520, plan: 'Starter', joined: '2025-09-16', status: 'Active', contact: 'Reem Al-Bader', email: 'reem.albader@bayaned.com', phone: '+965 2251 7743', manager: vikram, profileStatus: 'Active' },
  { id: 'ORG-1012', name: 'Fahaheel Power & Water', short: 'Fahaheel', industry: 'Utilities', country: 'Kuwait', employees: 1490, plan: 'Enterprise', joined: '2023-07-04', status: 'Active', contact: 'Eng. Jassim Al-Enezi', email: 'jassim.alenezi@fpw.com.kw', phone: '+965 2398 5521', manager: hessa, profileStatus: 'Active' },
]

export const superAdminOrgNames = orgSeeds.map((org) => org.name)
export const superAdminOrgShort: Record<string, string> = Object.fromEntries(orgSeeds.map((org) => [org.name, org.short]))

/* ------------------------------ 07.01 All organizations ------------------------------ */

export type SuperAdminOrganization = Pick<
  OrgSeed,
  'id' | 'name' | 'industry' | 'country' | 'employees' | 'joined'
> & { plan: SuperAdminOrgPlan; status: SuperAdminOrgStatus }

export const superAdminOrganizations: SuperAdminOrganization[] = orgSeeds.map(
  ({ id, name, industry, country, employees, plan, joined, status }) => ({ id, name, industry, country, employees, plan, joined, status }),
)

export const superAdminOrganizationsSubtitle = 'Corporate customers using the organization portal.'

export const superAdminOrganizationsKpis: SuperAdminOrgKpi[] = [
  { id: 'orgs', label: 'Organizations', value: '186', detail: '+8 this quarter' },
  { id: 'employees', label: 'Total employees', value: '14,920', detail: '+3.2% vs last month' },
  { id: 'active', label: 'Active', value: '171', detail: 'of 186 organizations' },
  { id: 'seats', label: 'Seats sold (30d)', value: '2,540', detail: '+21% vs previous 30 days' },
]

export const superAdminOrganizationTabs = tabs(['Active', 'Trial', 'Suspended'] as const)
export const superAdminOrganizationsTip =
  'Seats stay tied to the course version chosen at purchase. Review unused seats before a renewal conversation.'

/* ------------------------------ 07.02 Organization profiles ------------------------------ */

export type SuperAdminOrgProfileStatus = 'Active' | 'Onboarding'

export type SuperAdminOrgProfile = {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  manager: string
  status: SuperAdminOrgProfileStatus
}

export const superAdminOrgProfiles: SuperAdminOrgProfile[] = orgSeeds.map(
  ({ id, name, contact, email, phone, manager, profileStatus }) => ({ id, name, contact, email, phone, manager, status: profileStatus }),
)

export const superAdminOrgProfilesSubtitle = 'Primary contacts, account managers and commercial terms.'
export const superAdminOrgAccountManagers = [hessa, bader, vikram] as const
export const superAdminOrgProfileTabs = tabs(['Active', 'Onboarding'] as const)

/* ------------------------------ 07.03 Organization plans ------------------------------ */

export type SuperAdminOrgPlanStatus = 'Active' | 'Expiring' | 'Expired'

export type SuperAdminOrgPlanRow = {
  id: string
  org: string
  plan: SuperAdminOrgPlan
  seats: number
  fee: number
  renewal: string
  status: SuperAdminOrgPlanStatus
}

const planRow = (
  id: string,
  org: string,
  plan: SuperAdminOrgPlan,
  seats: number,
  fee: number,
  renewal: string,
  status: SuperAdminOrgPlanStatus,
): SuperAdminOrgPlanRow => ({ id, org, plan, seats, fee, renewal, status })

export const superAdminOrgPlans: SuperAdminOrgPlanRow[] = [
  planRow('PL-501', 'ABC Corp', 'Enterprise', 800, 26000, '2027-03-12', 'Active'),
  planRow('PL-502', 'Gulf Logistics', 'Business', 250, 9500, '2026-12-18', 'Expiring'),
  planRow('PL-503', 'Kuwait Marine Services', 'Business', 250, 9500, '2027-01-24', 'Active'),
  planRow('PL-504', 'Al-Noor Contracting', 'Enterprise', 500, 18000, '2027-02-21', 'Active'),
  planRow('PL-505', 'Burgan Facility Mgmt', 'Starter', 50, 1800, '2026-11-22', 'Expiring'),
  planRow('PL-506', 'Ahmadi Petrochemicals', 'Enterprise', 800, 26000, '2026-09-30', 'Expired'),
  planRow('PL-507', 'Al-Rashed Engineering', 'Business', 120, 5200, '2027-02-14', 'Active'),
  planRow('PL-508', 'Sabah Healthcare Group', 'Business', 250, 9500, '2026-12-05', 'Expiring'),
  planRow('PL-509', 'Al-Kout Hospitality', 'Starter', 50, 1800, '2027-07-30', 'Active'),
  planRow('PL-510', 'Salmiya Manufacturing Co.', 'Business', 120, 5200, '2026-10-11', 'Expired'),
  planRow('PL-511', 'Bayan Education Group', 'Starter', 50, 1800, '2027-09-16', 'Active'),
  planRow('PL-512', 'Fahaheel Power & Water', 'Enterprise', 500, 18000, '2027-07-04', 'Active'),
]

export const superAdminOrgPlansSubtitle = 'Plan tier, annual fee and renewal date for each customer.'
export const superAdminOrgPlanTabs = tabs(['Active', 'Expiring', 'Expired'] as const)
export const superAdminOrgPlanTiers = ['All plans', 'Enterprise', 'Business', 'Starter'] as const

/* ------------------------------ 07.04 Employee lists ------------------------------ */

export type SuperAdminOrgEmployeeStatus = 'Active' | 'Invited' | 'Deactivated'

export type SuperAdminOrgEmployee = {
  id: string
  name: string
  org: string
  department: string
  assigned: number
  completed: number
  status: SuperAdminOrgEmployeeStatus
}

const emp = (
  id: string,
  name: string,
  org: string,
  department: string,
  assigned: number,
  completed: number,
  status: SuperAdminOrgEmployeeStatus,
): SuperAdminOrgEmployee => ({ id, name, org, department, assigned, completed, status })

export const superAdminOrgEmployees: SuperAdminOrgEmployee[] = [
  emp('EMP-7001', 'Fatima Al-Mutairi', 'ABC Corp', 'HSE', 6, 5, 'Active'),
  emp('EMP-7002', 'Abdullah Al-Sayegh', 'ABC Corp', 'Operations', 4, 2, 'Active'),
  emp('EMP-7003', 'Priya Nair', 'Gulf Logistics', 'Quality', 3, 3, 'Active'),
  emp('EMP-7004', 'Mohammed Al-Azmi', 'Gulf Logistics', 'Operations', 5, 1, 'Invited'),
  emp('EMP-7005', 'Sara Al-Hajri', 'Kuwait Marine Services', 'HSE', 7, 6, 'Active'),
  emp('EMP-7006', 'Rahul Menon', 'Al-Noor Contracting', 'Engineering', 2, 0, 'Deactivated'),
  emp('EMP-7007', 'Dana Al-Kandari', 'Burgan Facility Mgmt', 'HR', 3, 1, 'Active'),
  emp('EMP-7008', 'Yousef Al-Roumi', 'Ahmadi Petrochemicals', 'HSE', 8, 7, 'Active'),
  emp('EMP-7009', 'Anwar Hussain', 'Ahmadi Petrochemicals', 'IT', 2, 2, 'Active'),
  emp('EMP-7010', 'Lulwa Al-Fares', 'Sabah Healthcare Group', 'Quality', 4, 3, 'Active'),
  emp('EMP-7011', 'Tariq Al-Mansour', 'Al-Rashed Engineering', 'Finance', 1, 0, 'Invited'),
  emp('EMP-7012', 'Noura Al-Thani', 'Al-Kout Hospitality', 'Operations', 3, 0, 'Invited'),
  emp('EMP-7013', 'Sanjay Pillai', 'Fahaheel Power & Water', 'Engineering', 5, 4, 'Active'),
  emp('EMP-7014', 'Reem Al-Jassar', 'Bayan Education Group', 'HR', 2, 1, 'Deactivated'),
]

export const superAdminOrgEmployeesSubtitle = 'Employees invited and managed through organization portals.'
export const superAdminOrgEmployeeTabs = tabs(['Active', 'Invited', 'Deactivated'] as const)
export const superAdminOrgEmployeeDepartments = ['All departments', 'HSE', 'Operations', 'Quality', 'HR', 'Finance', 'IT', 'Engineering'] as const
export const superAdminOrgEmployeeKpiBase = { employees: 14920, invites: 212 }

/* ------------------------------ 07.05 Course purchases ------------------------------ */

export type SuperAdminOrgPurchaseStatus = 'Paid' | 'Pending'

export type SuperAdminOrgPurchase = {
  id: string
  org: string
  course: string
  seats: number
  amount: number
  date: string
  status: SuperAdminOrgPurchaseStatus
}

const buy = (
  id: string,
  org: string,
  course: string,
  seats: number,
  amount: number,
  date: string,
  status: SuperAdminOrgPurchaseStatus,
): SuperAdminOrgPurchase => ({ id, org, course, seats, amount, date, status })

export const superAdminOrgPurchases: SuperAdminOrgPurchase[] = [
  buy('PUR-9101', 'ABC Corp', 'Fire Warden Training', 100, 3280, '2026-11-08', 'Paid'),
  buy('PUR-9102', 'Gulf Logistics', 'Manual Handling', 50, 1025, '2026-11-06', 'Pending'),
  buy('PUR-9103', 'Kuwait Marine Services', 'Working at Height', 25, 1148, '2026-11-05', 'Paid'),
  buy('PUR-9104', 'Al-Noor Contracting', 'NEBOSH IGC Preparation', 200, 12300, '2026-11-03', 'Paid'),
  buy('PUR-9105', 'Ahmadi Petrochemicals', 'First Aid at Work', 100, 3690, '2026-11-02', 'Paid'),
  buy('PUR-9106', 'Burgan Facility Mgmt', 'Cybersecurity Awareness for Employees', 20, 656, '2026-10-30', 'Pending'),
  buy('PUR-9107', 'Sabah Healthcare Group', 'First Aid at Work', 50, 1845, '2026-10-28', 'Paid'),
  buy('PUR-9108', 'Fahaheel Power & Water', 'ISO 14001 Internal Auditor', 25, 1435, '2026-10-24', 'Paid'),
  buy('PUR-9109', 'Al-Rashed Engineering', 'ISO 9001 Lead Auditor', 20, 1312, '2026-10-21', 'Paid'),
  buy('PUR-9110', 'Bayan Education Group', 'Manual Handling', 25, 512, '2026-10-18', 'Paid'),
  buy('PUR-9111', 'Al-Kout Hospitality', 'Fire Warden Training', 20, 656, '2026-10-15', 'Pending'),
  buy('PUR-9112', 'ABC Corp', 'Cybersecurity Awareness for Employees', 200, 6560, '2026-10-12', 'Paid'),
]

export const superAdminOrgPurchasesSubtitle = 'Bulk and per-seat course purchases by organizations.'
export const superAdminOrgPurchaseTabs = tabs(['Paid', 'Pending'] as const)
export const superAdminOrgPurchaseCourses = ['All courses', ...Array.from(new Set(superAdminOrgPurchases.map((row) => row.course)))]

/* ------------------------------ 07.06 Seats ------------------------------ */

export type SuperAdminOrgSeatRow = {
  id: string
  org: string
  course: string
  version: string
  purchased: number
  assigned: number
}

export type SuperAdminOrgSeatStatus = 'Healthy' | 'Low usage' | 'Full'

const seat = (id: string, org: string, course: string, version: string, purchased: number, assigned: number): SuperAdminOrgSeatRow => ({
  id,
  org,
  course,
  version,
  purchased,
  assigned,
})

export const superAdminOrgSeats: SuperAdminOrgSeatRow[] = [
  seat('SE-301', 'ABC Corp', 'Fire Warden Training', 'v2.1', 500, 410),
  seat('SE-302', 'Gulf Logistics', 'Manual Handling', 'v1.3', 250, 96),
  seat('SE-303', 'Kuwait Marine Services', 'Working at Height', 'v2.0', 120, 120),
  seat('SE-304', 'Al-Noor Contracting', 'NEBOSH IGC Preparation', 'v3.0', 800, 520),
  seat('SE-305', 'Burgan Facility Mgmt', 'Cybersecurity Awareness', 'v1.1', 300, 105),
  seat('SE-306', 'Ahmadi Petrochemicals', 'First Aid at Work', 'v2.2', 800, 690),
  seat('SE-307', 'Al-Rashed Engineering', 'ISO 9001 Lead Auditor', 'v1.4', 120, 64),
  seat('SE-308', 'Sabah Healthcare Group', 'First Aid at Work', 'v2.2', 250, 250),
  seat('SE-309', 'Fahaheel Power & Water', 'ISO 14001 Internal Auditor', 'v1.2', 500, 215),
  seat('SE-310', 'Bayan Education Group', 'Manual Handling', 'v1.3', 120, 71),
]

export function superAdminOrgSeatStatus(row: SuperAdminOrgSeatRow): SuperAdminOrgSeatStatus {
  if (row.assigned >= row.purchased) return 'Full'
  return row.assigned / row.purchased < 0.5 ? 'Low usage' : 'Healthy'
}

export const superAdminOrgSeatsSubtitle = 'Seat utilization so unused licences can be reclaimed or upsold.'
export const superAdminOrgSeatTabs = tabs(['Healthy', 'Low usage', 'Full'] as const)
export const superAdminOrgSeatsTip =
  'Seats are tied to the course version selected at purchase and cannot move to another version. Unused seats can be reclaimed before renewal.'

/* ------------------------------ 07.07 Version allocations ------------------------------ */

export type SuperAdminOrgAllocationStatus = 'Locked' | 'Upgrade available' | 'Upgraded'

export type SuperAdminOrgAllocation = {
  id: string
  org: string
  course: string
  version: string
  latest: string
  seats: number
  status: SuperAdminOrgAllocationStatus
}

const alloc = (
  id: string,
  org: string,
  course: string,
  version: string,
  latest: string,
  seats: number,
  status: SuperAdminOrgAllocationStatus,
): SuperAdminOrgAllocation => ({ id, org, course, version, latest, seats, status })

export const superAdminOrgAllocations: SuperAdminOrgAllocation[] = [
  alloc('VA-201', 'ABC Corp', 'Fire Warden Training', 'v2.1', 'v2.1', 410, 'Locked'),
  alloc('VA-202', 'Gulf Logistics', 'Manual Handling', 'v1.3', 'v2.0', 96, 'Upgrade available'),
  alloc('VA-203', 'Kuwait Marine Services', 'Working at Height', 'v2.0', 'v2.0', 120, 'Upgraded'),
  alloc('VA-204', 'Al-Noor Contracting', 'NEBOSH IGC Preparation', 'v2.2', 'v3.0', 520, 'Upgrade available'),
  alloc('VA-205', 'Burgan Facility Mgmt', 'Cybersecurity Awareness', 'v1.1', 'v1.1', 105, 'Locked'),
  alloc('VA-206', 'Ahmadi Petrochemicals', 'First Aid at Work', 'v2.2', 'v2.2', 690, 'Upgraded'),
  alloc('VA-207', 'Al-Rashed Engineering', 'ISO 9001 Lead Auditor', 'v1.2', 'v1.4', 64, 'Upgrade available'),
  alloc('VA-208', 'Sabah Healthcare Group', 'First Aid at Work', 'v2.0', 'v2.2', 250, 'Upgrade available'),
  alloc('VA-209', 'Fahaheel Power & Water', 'ISO 14001 Internal Auditor', 'v1.2', 'v1.2', 215, 'Locked'),
  alloc('VA-210', 'Bayan Education Group', 'Manual Handling', 'v1.3', 'v2.0', 71, 'Upgrade available'),
]

export const superAdminOrgAllocationsSubtitle = 'Which course version each organization has purchased and assigned.'
export const superAdminOrgAllocationTabs = tabs(['Locked', 'Upgrade available', 'Upgraded'] as const)

/* ------------------------------ 07.08 Training progress ------------------------------ */

export type SuperAdminOrgTrainingStatus = 'On track' | 'At risk' | 'Behind'

export type SuperAdminOrgTraining = {
  id: string
  org: string
  enrolled: number
  completion: number
  overdue: number
  score: number
  status: SuperAdminOrgTrainingStatus
}

const train = (
  id: string,
  org: string,
  enrolled: number,
  completion: number,
  overdue: number,
  score: number,
  status: SuperAdminOrgTrainingStatus,
): SuperAdminOrgTraining => ({ id, org, enrolled, completion, overdue, score, status })

export const superAdminOrgTraining: SuperAdminOrgTraining[] = [
  train('TR-401', 'ABC Corp', 820, 88, 6, 91, 'On track'),
  train('TR-402', 'Gulf Logistics', 340, 57, 31, 76, 'At risk'),
  train('TR-403', 'Kuwait Marine Services', 210, 79, 9, 84, 'On track'),
  train('TR-404', 'Al-Noor Contracting', 560, 42, 58, 70, 'Behind'),
  train('TR-405', 'Burgan Facility Mgmt', 125, 33, 24, 68, 'Behind'),
  train('TR-406', 'Ahmadi Petrochemicals', 740, 93, 3, 92, 'On track'),
  train('TR-407', 'Al-Rashed Engineering', 150, 61, 17, 79, 'At risk'),
  train('TR-408', 'Sabah Healthcare Group', 430, 82, 8, 87, 'On track'),
  train('TR-409', 'Fahaheel Power & Water', 610, 71, 14, 83, 'On track'),
  train('TR-410', 'Bayan Education Group', 140, 49, 22, 72, 'At risk'),
]

export const superAdminOrgTrainingSubtitle = 'Completion progress for each organization’s assigned training.'
export const superAdminOrgTrainingTabs = tabs(['On track', 'At risk', 'Behind'] as const)

/* ------------------------------ 07.09 Invoices ------------------------------ */

export type SuperAdminOrgInvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft'

export type SuperAdminOrgInvoice = {
  id: string
  number: string
  org: string
  amount: number
  issued: string
  due: string
  status: SuperAdminOrgInvoiceStatus
}

const inv = (
  number: string,
  org: string,
  amount: number,
  issued: string,
  due: string,
  status: SuperAdminOrgInvoiceStatus,
): SuperAdminOrgInvoice => ({ id: number, number, org, amount, issued, due, status })

export const superAdminOrgInvoices: SuperAdminOrgInvoice[] = [
  inv('ORG-INV-3236', 'ABC Corp', 3280, '2026-11-08', '2026-11-22', 'Pending'),
  inv('ORG-INV-3232', 'Gulf Logistics', 1025, '2026-11-06', '2026-11-20', 'Pending'),
  inv('ORG-INV-3228', 'Kuwait Marine Services', 1148, '2026-11-05', '2026-11-19', 'Paid'),
  inv('ORG-INV-3224', 'Al-Noor Contracting', 12300, '2026-11-03', '2026-11-17', 'Paid'),
  inv('ORG-INV-3220', 'Ahmadi Petrochemicals', 26000, '2026-10-02', '2026-10-30', 'Overdue'),
  inv('ORG-INV-3216', 'Burgan Facility Mgmt', 656, '2026-10-30', '2026-11-13', 'Draft'),
  inv('ORG-INV-3212', 'Sabah Healthcare Group', 1845, '2026-10-28', '2026-11-11', 'Paid'),
  inv('ORG-INV-3208', 'Fahaheel Power & Water', 1435, '2026-10-24', '2026-11-07', 'Overdue'),
  inv('ORG-INV-3204', 'Al-Rashed Engineering', 1312, '2026-10-21', '2026-11-04', 'Paid'),
  inv('ORG-INV-3200', 'Salmiya Manufacturing Co.', 5200, '2026-10-11', '2026-10-25', 'Overdue'),
  inv('ORG-INV-3196', 'Bayan Education Group', 512, '2026-10-18', '2026-11-01', 'Paid'),
  inv('ORG-INV-3192', 'Al-Kout Hospitality', 656, '2026-11-09', '2026-11-23', 'Draft'),
]

export const superAdminOrgInvoicesSubtitle = 'Invoices issued to organizations and their payment status.'
export const superAdminOrgInvoiceTabs = tabs(['Paid', 'Pending', 'Overdue', 'Draft'] as const)

/* ------------------------------ 07.10 Performance analytics ------------------------------ */

export type SuperAdminOrgTier = 'Top' | 'Mid' | 'Low'

export type SuperAdminOrgPerformanceRow = {
  id: string
  org: string
  completion: number
  score: number
  hours: number
  certificates: number
  tier: SuperAdminOrgTier
}

const perf = (
  id: string,
  org: string,
  completion: number,
  score: number,
  hours: number,
  certificates: number,
  tier: SuperAdminOrgTier,
): SuperAdminOrgPerformanceRow => ({ id, org, completion, score, hours, certificates, tier })

export const superAdminOrgPerformance: SuperAdminOrgPerformanceRow[] = [
  perf('PF-01', 'Ahmadi Petrochemicals', 93, 92, 14.2, 540, 'Top'),
  perf('PF-02', 'ABC Corp', 88, 91, 12.6, 497, 'Top'),
  perf('PF-03', 'Sabah Healthcare Group', 82, 87, 11.4, 402, 'Top'),
  perf('PF-04', 'Kuwait Marine Services', 79, 84, 10.1, 318, 'Mid'),
  perf('PF-05', 'Fahaheel Power & Water', 71, 83, 9.3, 366, 'Mid'),
  perf('PF-06', 'Al-Rashed Engineering', 61, 79, 8.2, 148, 'Mid'),
  perf('PF-07', 'Gulf Logistics', 57, 76, 7.0, 190, 'Mid'),
  perf('PF-08', 'Bayan Education Group', 49, 72, 5.8, 74, 'Low'),
  perf('PF-09', 'Al-Noor Contracting', 42, 70, 5.1, 160, 'Low'),
  perf('PF-10', 'Burgan Facility Mgmt', 33, 68, 3.9, 41, 'Low'),
]

export const superAdminOrgPerformanceSubtitle = 'Compare organizations by completion, scores and learning hours.'
export const superAdminOrgPerformanceTabs = tabs(['Top', 'Mid', 'Low'] as const)

/** Volatile (up & down) 12-month platform trends — intentionally not monotonic. */
export const superAdminOrgCompletionTrend: SuperAdminOrgPoint[] = [
  { label: 'Dec', value: 58 },
  { label: 'Jan', value: 63 },
  { label: 'Feb', value: 55 },
  { label: 'Mar', value: 61 },
  { label: 'Apr', value: 68 },
  { label: 'May', value: 60 },
  { label: 'Jun', value: 57 },
  { label: 'Jul', value: 66 },
  { label: 'Aug', value: 71 },
  { label: 'Sep', value: 62 },
  { label: 'Oct', value: 69 },
  { label: 'Nov', value: 64 },
]

export const superAdminOrgScoreTrend: SuperAdminOrgPoint[] = [
  { label: 'Dec', value: 78 },
  { label: 'Jan', value: 74 },
  { label: 'Feb', value: 81 },
  { label: 'Mar', value: 76 },
  { label: 'Apr', value: 83 },
  { label: 'May', value: 79 },
  { label: 'Jun', value: 72 },
  { label: 'Jul', value: 80 },
  { label: 'Aug', value: 77 },
  { label: 'Sep', value: 84 },
  { label: 'Oct', value: 78 },
  { label: 'Nov', value: 82 },
]
