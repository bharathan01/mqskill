import { paths } from '@/routes/paths'
import { rnd } from './superAdminCatalogKit'

/* ------------------------------------------------------------------ */
/* Executive Overview                                                  */
/* ------------------------------------------------------------------ */

export type SuperAdminExecutiveRangeId = '7d' | '30d' | '90d' | 'ytd'
export type SuperAdminExecutiveBusiness = 'all' | 'b2c' | 'b2b'
export type SuperAdminExecutiveCurrency = 'KWD' | 'USD' | 'SAR'
export type SuperAdminExecutiveGrain = 'day' | 'week' | 'month' | 'year'

export type SuperAdminExecutiveFilters = {
  range: SuperAdminExecutiveRangeId
  country: string
  business: SuperAdminExecutiveBusiness
  currency: SuperAdminExecutiveCurrency
  compare: boolean
}

export const SUPER_ADMIN_ALL_COUNTRIES = 'All countries'

export const superAdminExecutiveDefaultFilters: SuperAdminExecutiveFilters = {
  range: '30d',
  country: SUPER_ADMIN_ALL_COUNTRIES,
  business: 'all',
  currency: 'KWD',
  compare: true,
}

export const superAdminExecutiveRanges = [
  { id: '7d' as const, label: 'Last 7 days', days: 7, factor: 0.24, changeMul: 0.55, current: '02 Nov – 08 Nov 2026', previous: '26 Oct – 01 Nov 2026', prevDays: 'previous 7 days' },
  { id: '30d' as const, label: 'Last 30 days', days: 30, factor: 1, changeMul: 1, current: '10 Oct – 08 Nov 2026', previous: '10 Sep – 09 Oct 2026', prevDays: 'previous 30 days' },
  { id: '90d' as const, label: 'Last 90 days', days: 90, factor: 3.1, changeMul: 1.8, current: '11 Aug – 08 Nov 2026', previous: '13 May – 10 Aug 2026', prevDays: 'previous 90 days' },
  { id: 'ytd' as const, label: 'Year to date', days: 312, factor: 10.6, changeMul: 3.2, current: '01 Jan – 08 Nov 2026', previous: '01 Jan – 08 Nov 2025', prevDays: 'same period last year' },
]

export const superAdminExecutiveBusinessOptions: { id: SuperAdminExecutiveBusiness; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'b2c', label: 'B2C' },
  { id: 'b2b', label: 'B2B' },
]

export const superAdminExecutiveCurrencies: SuperAdminExecutiveCurrency[] = ['KWD', 'USD', 'SAR']

const currencyRate: Record<SuperAdminExecutiveCurrency, number> = { KWD: 1, USD: 3.26, SAR: 12.23 }

export const superAdminExecutiveCountries = [
  { code: 'KW', name: 'Kuwait', students: 6842, revenueShare: 38.4, orgs: 52 },
  { code: 'SA', name: 'Saudi Arabia', students: 3915, revenueShare: 19.6, orgs: 31 },
  { code: 'AE', name: 'UAE', students: 2960, revenueShare: 16.2, orgs: 24 },
  { code: 'QA', name: 'Qatar', students: 1388, revenueShare: 7.1, orgs: 12 },
  { code: 'BH', name: 'Bahrain', students: 1021, revenueShare: 5.3, orgs: 8 },
  { code: 'OM', name: 'Oman', students: 907, revenueShare: 4.6, orgs: 7 },
  { code: 'IN', name: 'Other countries', students: 1871, revenueShare: 8.8, orgs: 12 },
]

export const superAdminExecutiveCountryOptions = [
  SUPER_ADMIN_ALL_COUNTRIES,
  ...superAdminExecutiveCountries.filter((item) => item.code !== 'IN').map((item) => item.name),
]

/* ------------------------------ formatting ------------------------------ */

export function superAdminExecutiveMoney(kwdAmount: number, currency: SuperAdminExecutiveCurrency, signed = false) {
  const decimals = currency === 'KWD' ? 3 : 2
  const value = kwdAmount * currencyRate[currency]
  const text = Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  const sign = value < 0 ? '− ' : signed ? '+ ' : ''
  return `${sign}${currency} ${text}`
}

export function superAdminExecutiveCompactMoney(kwdAmount: number, currency: SuperAdminExecutiveCurrency) {
  const value = (kwdAmount * currencyRate[currency]) / 1000
  return value >= 100 ? `${Math.round(value)}k` : `${value.toFixed(1)}k`
}

export const superAdminExecutiveInt = (n: number) => Math.round(n).toLocaleString('en-US')

const pct1 = (n: number) => `${n.toFixed(1)}%`

export function superAdminExecutiveInfoLine(filters: SuperAdminExecutiveFilters) {
  const range = rangeOf(filters.range)
  const business = filters.business === 'all' ? 'B2C + B2B' : filters.business.toUpperCase()
  const period = filters.compare ? `${range.current} vs ${range.previous}` : range.current
  return `Showing ${period} · ${filters.country} · ${business} · amounts in ${filters.currency}. Cumulative metrics are labelled.`
}

/* ------------------------------ factors --------------------------------- */

function rangeOf(id: SuperAdminExecutiveRangeId) {
  return superAdminExecutiveRanges.find((item) => item.id === id) ?? superAdminExecutiveRanges[1]
}

const STUDENT_TOTAL = 18904
const ORG_TOTAL = 146
const B2C_NET = 26980.25
const B2B_NET = 22085.5
const NET_TOTAL = B2C_NET + B2B_NET

function countryFactor(country: string, kind: 'students' | 'revenue' | 'orgs') {
  if (country === SUPER_ADMIN_ALL_COUNTRIES) return 1
  const row = superAdminExecutiveCountries.find((item) => item.name === country)
  if (!row) return 1
  if (kind === 'students') return row.students / STUDENT_TOTAL
  if (kind === 'orgs') return row.orgs / ORG_TOTAL
  return row.revenueShare / 100
}

function businessFactor(business: SuperAdminExecutiveBusiness, b2cShare: number) {
  if (business === 'all') return 1
  return business === 'b2c' ? b2cShare : 1 - b2cShare
}

function changeOffset(filters: SuperAdminExecutiveFilters, seed: number) {
  const countryIndex = superAdminExecutiveCountryOptions.indexOf(filters.country)
  const businessIndex = superAdminExecutiveBusinessOptions.findIndex((item) => item.id === filters.business)
  if (countryIndex <= 0 && businessIndex <= 0) return 0
  return ((rnd(countryIndex + businessIndex * 5, seed, 0, 40) - 20) / 10) * 0.5
}

/* -------------------------------- money --------------------------------- */

export type SuperAdminExecutiveMoneyState = {
  b2c: number
  b2b: number
  net: number
  gross: number
  discounts: number
  refunds: number
  fees: number
  afterFees: number
  collected: number
  pending: number
  previous: number
  orders: number
  b2cOrders: number
  b2bOrders: number
  aov: number
  b2cAov: number
  b2bAov: number
  netChange: number
}

export function superAdminExecutiveMoneyState(filters: SuperAdminExecutiveFilters): SuperAdminExecutiveMoneyState {
  const range = rangeOf(filters.range)
  const scale = range.factor * countryFactor(filters.country, 'revenue')
  const b2c = filters.business === 'b2b' ? 0 : B2C_NET * scale
  const b2b = filters.business === 'b2c' ? 0 : B2B_NET * scale
  const net = b2c + b2b
  const ratio = (value: number) => (net * value) / NET_TOTAL
  const netChange = Math.max(1.2, 12.4 * range.changeMul + changeOffset(filters, 1))
  const b2cOrders = filters.business === 'b2b' ? 0 : Math.round(1084 * scale)
  const b2bOrders = filters.business === 'b2c' ? 0 : Math.round(141 * scale)
  const orders = b2cOrders + b2bOrders
  const fees = ratio(1029.38)
  return {
    b2c,
    b2b,
    net,
    gross: ratio(54120.5),
    discounts: ratio(3870.75),
    refunds: ratio(1184),
    fees,
    afterFees: net - fees,
    collected: ratio(46812.25),
    pending: ratio(2253.5),
    previous: net / (1 + netChange / 100),
    orders,
    b2cOrders,
    b2bOrders,
    aov: orders ? net / orders : 0,
    b2cAov: b2cOrders ? b2c / b2cOrders : 0,
    b2bAov: b2bOrders ? b2b / b2bOrders : 0,
    netChange,
  }
}

/* --------------------------------- KPIs --------------------------------- */

export type SuperAdminExecutiveKpi = {
  id: string
  label: string
  badge?: 'Cumulative' | 'Unique'
  value: string
  change?: string
  changeTone: 'up' | 'down' | 'warn'
  detail: string
  linkLabel: string
  to: string
  tile: 'blue' | 'sky' | 'purple' | 'green' | 'amber'
  icon: 'revenue' | 'purchases' | 'students' | 'orgs' | 'employees' | 'courses' | 'refunds' | 'aov'
}

export function superAdminExecutiveKpis(filters: SuperAdminExecutiveFilters): SuperAdminExecutiveKpi[] {
  const range = rangeOf(filters.range)
  const rf = range.factor
  const mul = range.changeMul
  const { currency } = filters
  const money = (n: number) => superAdminExecutiveMoney(n, currency)
  const m = superAdminExecutiveMoneyState(filters)
  const revenueGeo = countryFactor(filters.country, 'revenue')
  const studentsGeo = countryFactor(filters.country, 'students')
  const orgsGeo = countryFactor(filters.country, 'orgs')
  const delta = (base: number, seed: number) => {
    const value = base * mul + changeOffset(filters, seed)
    return `+${Math.max(0.4, value).toFixed(1)}%`
  }

  const b2cCourses = filters.business === 'b2b' ? 0 : Math.round(1126 * rf * revenueGeo)
  const b2bSeats = filters.business === 'b2c' ? 0 : Math.round(2716 * rf * revenueGeo)

  const studentsShare = businessFactor(filters.business, 0.74)
  const students = Math.round(STUDENT_TOTAL * studentsGeo * studentsShare)
  const newRegistrations = Math.round(1212 * rf * studentsGeo * studentsShare)

  const orgs = Math.max(0, Math.round(ORG_TOTAL * orgsGeo))
  const newOrgs = Math.round(9 * rf * orgsGeo)
  const employees = Math.round(7385 * orgsGeo)
  const activeEmployees = Math.round(5902 * orgsGeo)
  const assignedEmployees = Math.round(6410 * orgsGeo)

  const newCourses = Math.max(1, Math.round(6 * rf))
  const updatedCourses = Math.max(1, Math.round(14 * rf))

  const refundTx = Math.round(23 * rf * revenueGeo * (filters.business === 'all' ? 1 : filters.business === 'b2c' ? 0.7 : 0.3))
  const refundRate = m.orders ? Math.min(9.9, Math.max(0.2, 1.9 + changeOffset(filters, 5) * 0.2)) : 0
  const refundPts = Math.max(0.1, 0.3 * mul)

  return [
    {
      id: 'revenue',
      label: 'Total Revenue · Net sales',
      value: money(m.net),
      change: `+${m.netChange.toFixed(1)}% vs prev.`,
      changeTone: 'up',
      detail: `Gross ${money(m.gross)} less discounts and refunds`,
      linkLabel: 'View financial report',
      to: paths.admin.finance,
      tile: 'blue',
      icon: 'revenue',
    },
    {
      id: 'purchases',
      label: 'Course Purchases',
      value: superAdminExecutiveInt(b2cCourses + b2bSeats),
      change: delta(8.1, 2),
      changeTone: 'up',
      detail: `B2C ${superAdminExecutiveInt(b2cCourses)} courses · B2B ${superAdminExecutiveInt(b2bSeats)} seats (seats ≠ enrolments)`,
      linkLabel: 'View purchase report',
      to: paths.admin.orders,
      tile: 'sky',
      icon: 'purchases',
    },
    {
      id: 'students',
      label: 'Total Students',
      badge: 'Cumulative',
      value: superAdminExecutiveInt(students),
      change: `${delta(6.9, 3)} registrations`,
      changeTone: 'up',
      detail: `+${superAdminExecutiveInt(newRegistrations)} new registrations this period`,
      linkLabel: 'View students',
      to: paths.admin.students,
      tile: 'purple',
      icon: 'students',
    },
    {
      id: 'orgs',
      label: 'Active Organizations',
      value: superAdminExecutiveInt(orgs),
      change: delta(6.6, 4),
      changeTone: 'up',
      detail: `+${superAdminExecutiveInt(newOrgs)} new organizations this period`,
      linkLabel: 'View organizations',
      to: paths.admin.organizations,
      tile: 'green',
      icon: 'orgs',
    },
    {
      id: 'employees',
      label: 'Total Employees',
      badge: 'Cumulative',
      value: superAdminExecutiveInt(employees),
      change: delta(4.3, 6),
      changeTone: 'up',
      detail: `${superAdminExecutiveInt(activeEmployees)} active · ${superAdminExecutiveInt(assignedEmployees)} assigned to courses`,
      linkLabel: 'View employees',
      to: paths.admin.organizationEmployees,
      tile: 'blue',
      icon: 'employees',
    },
    {
      id: 'courses',
      label: 'Published Courses',
      badge: 'Unique',
      value: '128',
      change: `+${newCourses} new this period`,
      changeTone: 'up',
      detail: `212 published versions · ${updatedCourses} courses updated`,
      linkLabel: 'View courses',
      to: paths.admin.courses,
      tile: 'purple',
      icon: 'courses',
    },
    {
      id: 'refunds',
      label: 'Refunds',
      value: money(m.refunds),
      change: `+${refundPts.toFixed(1)} pts refund rate`,
      changeTone: 'warn',
      detail: `${superAdminExecutiveInt(refundTx)} refunded transactions · ${pct1(filters.country === SUPER_ADMIN_ALL_COUNTRIES && filters.business === 'all' ? 1.9 : refundRate)} refund rate`,
      linkLabel: 'View refunds',
      to: paths.admin.refunds,
      tile: 'amber',
      icon: 'refunds',
    },
    {
      id: 'aov',
      label: 'Average Order Value',
      value: money(m.aov),
      change: delta(3.2, 7),
      changeTone: 'up',
      detail: `B2C ${money(m.b2cAov)} · B2B ${money(m.b2bAov)}`,
      linkLabel: 'View order analysis',
      to: paths.admin.orders,
      tile: 'sky',
      icon: 'aov',
    },
  ]
}

/* ------------------------------ revenue chart --------------------------- */

export type SuperAdminSeriesPoint = { label: string; b2c: number; b2b: number }

const END_DATE = Date.UTC(2026, 10, 8)
const DAY_MS = 86_400_000
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function dayLabel(timestamp: number) {
  const date = new Date(timestamp)
  return `${String(date.getUTCDate()).padStart(2, '0')} ${monthNames[date.getUTCMonth()]}`
}

export const superAdminExecutiveGrains: { id: SuperAdminExecutiveGrain; label: string; unit: string }[] = [
  { id: 'day', label: 'Day', unit: 'day' },
  { id: 'week', label: 'Week', unit: 'week' },
  { id: 'month', label: 'Month', unit: 'month' },
  { id: 'year', label: 'Year', unit: 'year' },
]

/** Values are in KWD; the page converts to the selected currency. */
export function superAdminExecutiveSeries(
  filters: SuperAdminExecutiveFilters,
  grain: SuperAdminExecutiveGrain,
): SuperAdminSeriesPoint[] {
  const range = rangeOf(filters.range)
  const m = superAdminExecutiveMoneyState(filters)
  const daily = { b2c: m.b2c / range.days, b2b: m.b2b / range.days }

  let count = 0
  let span = 1
  let labelAt: (index: number) => string
  if (grain === 'day') {
    count = Math.min(range.days, 30)
    labelAt = (i) => dayLabel(END_DATE - (count - 1 - i) * DAY_MS)
  } else if (grain === 'week') {
    count = Math.min(13, Math.max(4, Math.ceil(range.days / 7)))
    span = 7
    labelAt = (i) => dayLabel(END_DATE - (count - i) * 7 * DAY_MS + DAY_MS)
  } else if (grain === 'month') {
    count = Math.min(12, Math.max(6, Math.ceil(range.days / 30)))
    span = 30.4
    labelAt = (i) => {
      const date = new Date(Date.UTC(2026, 10 - (count - 1 - i), 1))
      return `${monthNames[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`
    }
  } else {
    count = 3
    span = 365
    labelAt = (i) => (i === 2 ? '2026 YTD' : String(2024 + i))
  }

  const seedBase = ['day', 'week', 'month', 'year'].indexOf(grain) * 11
  const weights = Array.from({ length: count }, (_, i) => {
    const trend = grain === 'year' ? [0.52, 0.76, 0.86][i] : 0.86 + (i / Math.max(1, count - 1)) * 0.28
    const weekend = grain === 'day' && [5, 6].includes((new Date(END_DATE - (count - 1 - i) * DAY_MS).getUTCDay() + 6) % 7) ? 0.78 : 1
    return {
      b2c: trend * weekend * (0.84 + rnd(i, seedBase + 3, 0, 32) / 100),
      b2b: trend * weekend * (0.7 + rnd(i, seedBase + 9, 0, 60) / 100),
    }
  })
  const sumB2c = weights.reduce((sum, item) => sum + item.b2c, 0) || 1
  const sumB2b = weights.reduce((sum, item) => sum + item.b2b, 0) || 1

  return weights.map((item, i) => {
    const b2cTotal = daily.b2c * span * count
    const b2bTotal = daily.b2b * span * count
    return {
      label: labelAt(i),
      b2c: (b2cTotal * item.b2c) / sumB2c,
      b2b: (b2bTotal * item.b2b) / sumB2b,
    }
  })
}

/* ----------------------------- trending courses ------------------------- */

export type SuperAdminTrendingRow = {
  id: string
  course: string
  category: string
  views: number
  purchases: number
  enrolments: number
  revenue: number
  growth: number
  spark: number[]
}

const trendingBase = [
  { course: 'ISO 45001 OH&S Lead Implementer', category: 'Quality & ISO', views: 9640, purchases: 168, enrolments: 612, revenue: 7420.5, growth: 62.4 },
  { course: 'Fire Warden Training', category: 'Health & Safety', views: 8915, purchases: 214, enrolments: 802, revenue: 5136, growth: 48.7 },
  { course: 'ISO 9001:2015 Internal Auditor', category: 'Quality & ISO', views: 7380, purchases: 142, enrolments: 398, revenue: 6248, growth: 41.3 },
  { course: 'First Aid & CPR Certification', category: 'Health & Safety', views: 6925, purchases: 236, enrolments: 740, revenue: 4012, growth: 36.9 },
  { course: 'Cybersecurity Awareness for Employees', category: 'IT & Security', views: 6110, purchases: 187, enrolments: 1264, revenue: 2805, growth: 31.5 },
  { course: 'PMP Exam Preparation', category: 'Project Management', views: 5402, purchases: 96, enrolments: 118, revenue: 7584, growth: 27.8 },
  { course: 'ISO 14001 Environmental Management', category: 'Quality & ISO', views: 4870, purchases: 88, enrolments: 226, revenue: 3960, growth: 22.4 },
  { course: 'Food Safety Level 2 (HACCP)', category: 'Health & Safety', views: 4215, purchases: 74, enrolments: 310, revenue: 1998, growth: 18.6 },
]

export const superAdminExecutiveTrendingCategories = ['All categories', ...new Set(trendingBase.map((row) => row.category))]

export function superAdminExecutiveTrending(
  rangeId: SuperAdminExecutiveRangeId,
  country: string,
  business: SuperAdminExecutiveBusiness,
): { rows: SuperAdminTrendingRow[]; minPurchases: number } {
  const range = rangeOf(rangeId)
  const factor = range.factor * countryFactor(country, 'revenue') * businessFactor(business, 0.293)
  const rows = trendingBase.map((row, i) => {
    const noise = 0.96 + rnd(i, rangeId.length + 4, 0, 8) / 100
    return {
      id: `trend-${i}`,
      course: row.course,
      category: row.category,
      views: Math.round(row.views * range.factor * noise * (country === SUPER_ADMIN_ALL_COUNTRIES ? 1 : countryFactor(country, 'students') * 2.4)),
      purchases: Math.max(1, Math.round(row.purchases * factor * noise)),
      enrolments: Math.max(1, Math.round(row.enrolments * factor * noise)),
      revenue: row.revenue * factor * noise,
      growth: Number(Math.max(1.5, row.growth * (0.6 + 0.4 * range.changeMul) + changeOffset({ ...superAdminExecutiveDefaultFilters, country, business }, i + 20)).toFixed(1)),
      spark: Array.from({ length: 8 }, (_, k) => 30 + k * (4 + (row.growth / 20)) + rnd(k, i + 2, 0, 18)),
    }
  })
  return { rows, minPurchases: Math.max(5, Math.round(50 * factor)) }
}

/* --------------------------- geographic intelligence -------------------- */

export type SuperAdminGeoTab = 'students' | 'revenue' | 'orgs'

export const superAdminExecutiveGeoTabs: { id: SuperAdminGeoTab; label: string; heading: string }[] = [
  { id: 'students', label: 'Students', heading: 'Students by country' },
  { id: 'revenue', label: 'Revenue', heading: 'Revenue by country' },
  { id: 'orgs', label: 'Organizations', heading: 'Organizations by country' },
]

export type SuperAdminGeoRow = { code: string; name: string; value: number; label: string; share: number }

export function superAdminExecutiveGeo(filters: SuperAdminExecutiveFilters, tab: SuperAdminGeoTab): SuperAdminGeoRow[] {
  const range = rangeOf(filters.range)
  const revenueScale = range.factor * businessFactor(filters.business, 0.5499)
  const values = superAdminExecutiveCountries.map((item) => {
    if (tab === 'students') return item.students * businessFactor(filters.business, 0.74)
    if (tab === 'orgs') return item.orgs
    return ((NET_TOTAL * item.revenueShare) / 100) * revenueScale
  })
  const total = values.reduce((sum, value) => sum + value, 0) || 1
  return superAdminExecutiveCountries.map((item, i) => ({
    code: item.code,
    name: item.name,
    value: values[i],
    label:
      tab === 'revenue'
        ? superAdminExecutiveMoney(values[i], filters.currency)
        : superAdminExecutiveInt(values[i]),
    share: (values[i] / total) * 100,
  }))
}

/* ---------------------------- organization performance ------------------ */

export type SuperAdminOrgRow = {
  id: string
  name: string
  country: string
  plan: 'Enterprise' | 'Business'
  employees: number
  purchased: number
  assigned: number
  unused: number
  revenue: number
}

const orgBase: Omit<SuperAdminOrgRow, 'id' | 'unused'>[] = [
  { name: 'ABC Corp', country: 'Kuwait', plan: 'Enterprise', employees: 1240, purchased: 420, assigned: 366, revenue: 9870.5 },
  { name: 'Gulf Horizon Logistics', country: 'Saudi Arabia', plan: 'Enterprise', employees: 860, purchased: 310, assigned: 268, revenue: 7412.25 },
  { name: 'Burgan Engineering', country: 'Kuwait', plan: 'Enterprise', employees: 500, purchased: 280, assigned: 241, revenue: 6230 },
  { name: 'Hawalli Education Trust', country: 'Kuwait', plan: 'Business', employees: 420, purchased: 240, assigned: 212, revenue: 5486.75 },
  { name: 'Emirates Safety Partners', country: 'UAE', plan: 'Business', employees: 360, purchased: 190, assigned: 151, revenue: 4720 },
  { name: 'Al Dhahran Industrial Group', country: 'Saudi Arabia', plan: 'Enterprise', employees: 640, purchased: 205, assigned: 178, revenue: 4318.5 },
  { name: 'Qatar Energy Services', country: 'Qatar', plan: 'Business', employees: 280, purchased: 160, assigned: 122, revenue: 3640 },
  { name: 'Manama Petrochemicals', country: 'Bahrain', plan: 'Business', employees: 210, purchased: 120, assigned: 84, revenue: 2905.25 },
]

export type SuperAdminOrgPerformance = {
  stats: { id: string; label: string; value: string; sub?: string; tone?: 'green' | 'amber' | 'blue' }[]
  rows: SuperAdminOrgRow[]
}

export function superAdminExecutiveOrgPerformance(filters: SuperAdminExecutiveFilters): SuperAdminOrgPerformance {
  const range = rangeOf(filters.range)
  const geo = countryFactor(filters.country, 'orgs')
  const scale = range.factor * geo
  const purchased = Math.round(2716 * scale)
  const assigned = Math.round(2284 * scale)
  const unused = Math.max(0, purchased - assigned)
  const delta = Math.max(0.4, 6.6 * range.changeMul + changeOffset(filters, 4))
  const assignedPct = purchased ? (assigned / purchased) * 100 : 0
  const rows = orgBase
    .filter((org) => filters.country === SUPER_ADMIN_ALL_COUNTRIES || org.country === filters.country)
    .map((org, i) => ({
      ...org,
      id: `org-${i}`,
      unused: org.purchased - org.assigned,
      revenue: org.revenue * range.factor,
    }))
  return {
    stats: [
      { id: 'active', label: 'Active orgs', value: superAdminExecutiveInt(ORG_TOTAL * geo), sub: filters.compare ? `+${delta.toFixed(1)}%` : undefined, tone: 'green' },
      { id: 'new', label: 'New orgs', value: superAdminExecutiveInt(9 * scale), sub: 'this period', tone: 'blue' },
      { id: 'purchased', label: 'Purchased seats', value: superAdminExecutiveInt(purchased), sub: 'B2B seats', tone: 'blue' },
      { id: 'assigned', label: 'Assigned seats', value: superAdminExecutiveInt(assigned), sub: pct1(assignedPct), tone: 'green' },
      { id: 'unused', label: 'Unused seats', value: superAdminExecutiveInt(unused), sub: pct1(purchased ? 100 - assignedPct : 0), tone: 'amber' },
      { id: 'learning', label: 'Employees learning', value: superAdminExecutiveInt(3118 * geo), sub: 'active in period', tone: 'blue' },
    ],
    rows,
  }
}

/* ----------------------------- financial snapshot ----------------------- */

export type SuperAdminFinanceLine = {
  id: string
  label: string
  value: string
  note?: string
  strong?: boolean
}

export function superAdminExecutiveFinance(filters: SuperAdminExecutiveFilters): SuperAdminFinanceLine[] {
  const m = superAdminExecutiveMoneyState(filters)
  const money = (n: number) => superAdminExecutiveMoney(n, filters.currency)
  const negative = (n: number) => `− ${money(n)}`
  const share = (n: number) => (m.net ? (n / m.net) * 100 : 0)
  const invoices = Math.round(9 * (m.net / NET_TOTAL))
  return [
    { id: 'gross', label: 'Gross sales', value: money(m.gross) },
    { id: 'discounts', label: 'Discounts & coupons', value: negative(m.discounts) },
    { id: 'refunds', label: 'Refunds', value: negative(m.refunds) },
    { id: 'net', label: 'Net sales', value: money(m.net), strong: true },
    { id: 'fees', label: 'Payment gateway fees', value: negative(m.fees) },
    { id: 'after-fees', label: 'Net after gateway fees', value: money(m.afterFees), strong: true },
    { id: 'collected', label: 'Payments collected', value: money(m.collected), note: pct1(share(m.collected)) },
    { id: 'pending', label: 'Pending payments', value: money(m.pending), note: `${pct1(share(m.pending))} · ${invoices} B2B invoices` },
    { id: 'aov', label: 'Average order value', value: money(m.aov), note: `${superAdminExecutiveInt(m.orders)} orders` },
  ]
}

/* ----------------------------- learning performance --------------------- */

export type SuperAdminLearning = {
  kpis: { id: string; label: string; value: string; change?: string }[]
  bars: { id: string; label: string; value: number; detail: string; color: string }[]
}

export function superAdminExecutiveLearning(filters: SuperAdminExecutiveFilters): SuperAdminLearning {
  const range = rangeOf(filters.range)
  const geo = countryFactor(filters.country, 'students') * businessFactor(filters.business, 0.74)
  const scale = range.factor * geo
  const learners = Math.round(6284 * Math.min(range.factor, 2.6) * geo)
  const completions = Math.round(1892 * scale)
  const certificates = Math.round(1604 * scale)
  const drift = { '7d': -1.4, '30d': 0, '90d': 1.1, ytd: 2.3 }[filters.range]
  const completionRate = Math.min(96, 68.4 + drift + changeOffset(filters, 8))
  const passRate = Math.min(97, 82.7 + drift * 0.6 + changeOffset(filters, 9))
  const certRate = completions ? (certificates / completions) * 100 : 0
  const change = (base: number, seed: number) => (filters.compare ? `+${Math.max(0.5, base * range.changeMul + changeOffset(filters, seed)).toFixed(1)}%` : undefined)
  return {
    kpis: [
      { id: 'learners', label: 'Unique learners', value: superAdminExecutiveInt(learners), change: change(5.2, 10) },
      { id: 'completions', label: 'Course completions', value: superAdminExecutiveInt(completions), change: change(7.8, 11) },
      { id: 'certificates', label: 'Certificates issued', value: superAdminExecutiveInt(certificates), change: change(6.4, 12) },
    ],
    bars: [
      { id: 'completion', label: 'Completion rate', value: completionRate, detail: `${superAdminExecutiveInt(completions)} of ${superAdminExecutiveInt(completions / (completionRate / 100))} enrolments`, color: '#2563EB' },
      { id: 'pass', label: 'Assessment pass rate', value: passRate, detail: 'Final assessments, first attempt', color: '#16A34A' },
      { id: 'certs', label: 'Certificates issued', value: certRate, detail: `${superAdminExecutiveInt(certificates)} of ${superAdminExecutiveInt(completions)} completions`, color: '#7C3AED' },
    ],
  }
}

/* ----------------------------- recent transactions ---------------------- */

export type SuperAdminTransaction = {
  id: string
  customer: string
  type: 'B2C' | 'B2B'
  item: string
  country: string
  amount: number
  method: string
  status: 'Paid' | 'Pending' | 'Refunded' | 'Failed'
  date: string
}

export const superAdminExecutiveTransactions: SuperAdminTransaction[] = [
  { id: 'TXN-2611-08412', customer: 'Noura Al-Mutairi', type: 'B2C', item: 'ISO 9001:2015 Internal Auditor', country: 'Kuwait', amount: 240, method: 'KNET', status: 'Paid', date: '08 Nov 2026 · 10:42' },
  { id: 'TXN-2611-08409', customer: 'ABC Corp', type: 'B2B', item: 'Fire Warden Training · 100 seats (ORD-52391)', country: 'Kuwait', amount: 6970, method: 'Bank transfer', status: 'Paid', date: '08 Nov 2026 · 10:05' },
  { id: 'TXN-2611-08405', customer: 'Faisal Al-Harbi', type: 'B2C', item: 'First Aid & CPR Certification', country: 'Saudi Arabia', amount: 55, method: 'Visa', status: 'Paid', date: '08 Nov 2026 · 09:48' },
  { id: 'TXN-2611-08398', customer: 'Gulf Horizon Logistics', type: 'B2B', item: 'ISO 45001 OH&S Implementer · 40 seats', country: 'Saudi Arabia', amount: 7056, method: 'Invoice (Net 30)', status: 'Pending', date: '08 Nov 2026 · 09:12' },
  { id: 'TXN-2611-08391', customer: 'Maria Santos', type: 'B2C', item: 'Cybersecurity Awareness for Employees', country: 'UAE', amount: -85, method: 'Mastercard', status: 'Refunded', date: '08 Nov 2026 · 08:12' },
  { id: 'TXN-2611-08384', customer: 'Layla Al-Dosari', type: 'B2C', item: 'PMP Exam Preparation', country: 'Qatar', amount: 295, method: 'Apple Pay', status: 'Paid', date: '07 Nov 2026 · 21:36' },
  { id: 'TXN-2611-08377', customer: 'Burgan Engineering', type: 'B2B', item: 'Enterprise plan · 500 seats', country: 'Kuwait', amount: 18000, method: 'Bank transfer', status: 'Pending', date: '07 Nov 2026 · 17:20' },
  { id: 'TXN-2611-08370', customer: 'Khalid Al-Busaidi', type: 'B2C', item: 'Lean Six Sigma Green Belt', country: 'Oman', amount: 180, method: 'Visa', status: 'Paid', date: '07 Nov 2026 · 15:02' },
  { id: 'TXN-2611-08362', customer: 'Hawalli Education Trust', type: 'B2B', item: 'Customer Service Excellence · 120 seats', country: 'Kuwait', amount: 3420, method: 'KNET', status: 'Paid', date: '07 Nov 2026 · 11:44' },
  { id: 'TXN-2611-08355', customer: 'Yousef Al-Khalifa', type: 'B2C', item: 'Food Safety Level 2 (HACCP)', country: 'Bahrain', amount: 65, method: 'Visa', status: 'Failed', date: '07 Nov 2026 · 09:30' },
]

/* ------------------------------ action required ------------------------- */

export type SuperAdminAttentionItem = {
  id: string
  title: string
  count: number
  severity: 'High' | 'Medium'
  detail: string
  to: string
  cta: string
}

export const superAdminExecutiveAttention: SuperAdminAttentionItem[] = [
  { id: 'failed-payments', title: 'Failed payments', count: 7, severity: 'High', detail: 'KNET and Visa declines in the last 24 hours · KWD 612.500 at risk', to: paths.admin.orders, cta: 'Review payments' },
  { id: 'tickets', title: 'Unresolved support tickets', count: 12, severity: 'High', detail: '4 tickets have breached the first-response SLA', to: paths.admin.support, cta: 'Open support queue' },
  { id: 'publish-failed', title: 'Course publishing failed', count: 1, severity: 'High', detail: 'Food Safety Level 2 v1.3 · thumbnail and Arabic subtitles missing', to: paths.admin.publishingHistory, cta: 'View publishing log' },
  { id: 'scorm', title: 'SCORM validation errors', count: 2, severity: 'Medium', detail: 'Manifest errors in 2 uploaded packages', to: paths.admin.scormValidation, cta: 'Fix packages' },
  { id: 'certs', title: 'Certificates expiring soon', count: 312, severity: 'Medium', detail: 'Expire within 60 days · renewal reminders not yet sent', to: paths.admin.certificateStatus, cta: 'Send reminders' },
  { id: 'seats', title: 'Unused organization seats', count: 432, severity: 'Medium', detail: '15.9% of purchased seats are not assigned to employees', to: paths.admin.organizationSeats, cta: 'View seat usage' },
  { id: 'invoices', title: 'Pending B2B invoices', count: 9, severity: 'Medium', detail: 'KWD 2,253.500 outstanding · 3 overdue', to: paths.admin.organizationInvoices, cta: 'Open invoices' },
]

/* ------------------------------------------------------------------ */
/* Key Performance Indicators                                          */
/* ------------------------------------------------------------------ */

export type SuperAdminKpiCategory = 'Revenue' | 'Learners' | 'Organizations' | 'Learning' | 'Certificates'
export type SuperAdminKpiOwner = 'Super Admin' | 'Content Admin'

export type SuperAdminKpiRow = {
  id: string
  label: string
  category: SuperAdminKpiCategory
  definition: string
  current: string
  /** Display value without a leading +/−; direction comes from changeDirection. */
  change: string
  changeDirection: 'up' | 'down'
  lowerIsBetter?: boolean
  owner: SuperAdminKpiOwner
  /** Suggested sample target once “Set targets” is used. */
  sampleTarget: string
}

export type SuperAdminKpiUntracked = {
  id: string
  label: string
  reason: string
}

export const superAdminKpiCategories: { id: 'all' | SuperAdminKpiCategory; label: string }[] = [
  { id: 'all', label: 'All KPIs' },
  { id: 'Revenue', label: 'Revenue' },
  { id: 'Learners', label: 'Learners' },
  { id: 'Organizations', label: 'Organizations' },
  { id: 'Learning', label: 'Learning' },
  { id: 'Certificates', label: 'Certificates' },
]

export const superAdminKpiPageSize = 12

export const superAdminKpiRows: SuperAdminKpiRow[] = [
  {
    id: 'gross-revenue',
    label: 'Gross revenue',
    category: 'Revenue',
    definition: 'Sum of paid order totals before refunds',
    current: 'KWD 48,620',
    change: '12.4%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: 'KWD 52,000',
  },
  {
    id: 'net-revenue',
    label: 'Net revenue',
    category: 'Revenue',
    definition: 'Gross revenue minus refunds and reversals',
    current: 'KWD 47,436',
    change: '12.8%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: 'KWD 50,000',
  },
  {
    id: 'conversion-rate',
    label: 'Conversion rate',
    category: 'Revenue',
    definition: 'Purchases ÷ unique course page visitors',
    current: '3.8%',
    change: '0.4 pt',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '4.2%',
  },
  {
    id: 'average-order-value',
    label: 'Average order value',
    category: 'Revenue',
    definition: 'Gross revenue ÷ paid orders',
    current: 'KWD 37.9',
    change: '4.1%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: 'KWD 40.0',
  },
  {
    id: 'refund-rate',
    label: 'Refund rate',
    category: 'Revenue',
    definition: 'Refunded orders ÷ paid orders',
    current: '1.9%',
    change: '0.3 pt',
    changeDirection: 'up',
    lowerIsBetter: true,
    owner: 'Super Admin',
    sampleTarget: '1.5%',
  },
  {
    id: 'active-learners',
    label: 'Active learners',
    category: 'Learners',
    definition: 'Learners with course activity in the last 30 days',
    current: '4,812',
    change: '6.3%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '5,200',
  },
  {
    id: 'new-registrations',
    label: 'New registrations',
    category: 'Learners',
    definition: 'New student accounts created in the period',
    current: '1,212',
    change: '6.9%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '1,350',
  },
  {
    id: 'seat-utilisation',
    label: 'Seat utilisation',
    category: 'Organizations',
    definition: 'Assigned seats ÷ purchased seats, per course version',
    current: '81%',
    change: '2.1 pt',
    changeDirection: 'down',
    owner: 'Super Admin',
    sampleTarget: '85%',
  },
  {
    id: 'active-organizations',
    label: 'Active organizations',
    category: 'Organizations',
    definition: 'Organizations with at least one active seat',
    current: '146',
    change: '9',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '160',
  },
  {
    id: 'completion-rate',
    label: 'Completion rate',
    category: 'Learning',
    definition: 'Completed ÷ enrollments older than 30 days',
    current: '61%',
    change: '1.8 pt',
    changeDirection: 'up',
    owner: 'Content Admin',
    sampleTarget: '70%',
  },
  {
    id: 'assessment-pass-rate',
    label: 'Assessment pass rate',
    category: 'Learning',
    definition: 'Final assessments passed ÷ attempted',
    current: '78%',
    change: '1.2 pt',
    changeDirection: 'down',
    owner: 'Content Admin',
    sampleTarget: '80%',
  },
  {
    id: 'certificates-issued',
    label: 'Certificates issued',
    category: 'Certificates',
    definition: 'Certificates generated after all requirements are met',
    current: '418',
    change: '3.2%',
    changeDirection: 'down',
    owner: 'Super Admin',
    sampleTarget: '450',
  },
  {
    id: 'paid-orders',
    label: 'Paid orders',
    category: 'Revenue',
    definition: 'Completed B2C and B2B paid orders in the period',
    current: '1,284',
    change: '8.2%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '1,400',
  },
  {
    id: 'course-page-views',
    label: 'Course page views',
    category: 'Revenue',
    definition: 'Visits to public course pages in the period',
    current: '184,620',
    change: '11.3%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '200,000',
  },
  {
    id: 'enrollments',
    label: 'Enrollments',
    category: 'Learners',
    definition: 'Course enrollments started in the period',
    current: '8,412',
    change: '9.8%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '9,000',
  },
  {
    id: 'learning-hours',
    label: 'Learning hours',
    category: 'Learning',
    definition: 'Time spent in courses and live classes',
    current: '31,400 h',
    change: '5.4%',
    changeDirection: 'up',
    owner: 'Content Admin',
    sampleTarget: '34,000 h',
  },
  {
    id: 'live-attendance',
    label: 'Live attendance rate',
    category: 'Learning',
    definition: 'Attended ÷ registered for live sessions',
    current: '82%',
    change: '1.5 pt',
    changeDirection: 'up',
    owner: 'Content Admin',
    sampleTarget: '85%',
  },
  {
    id: 'cpd-hours',
    label: 'CPD hours awarded',
    category: 'Certificates',
    definition: 'CPD hours attached to certificates issued',
    current: '1,254',
    change: '4.7%',
    changeDirection: 'up',
    owner: 'Super Admin',
    sampleTarget: '1,400',
  },
]

export const superAdminKpiRules = [
  { label: 'Currency', value: 'KWD' },
  { label: 'Time zone', value: 'Asia/Kuwait (GMT+3)' },
  { label: 'Data refresh', value: 'Every 15 minutes' },
  { label: 'Revenue basis', value: 'Paid orders only' },
] as const

export const superAdminKpiUntracked: SuperAdminKpiUntracked[] = [
  {
    id: 'profit-margin',
    label: 'Profit margin',
    reason: 'Needs course cost records. Not shown until costs are entered.',
  },
  {
    id: 'customer-lifetime-value',
    label: 'Customer lifetime value',
    reason: 'Needs at least 12 months of order history.',
  },
]

export function superAdminKpiChangeTone(row: SuperAdminKpiRow): 'good' | 'bad' {
  const improving = row.changeDirection === 'up'
  if (row.lowerIsBetter) return improving ? 'bad' : 'good'
  return improving ? 'good' : 'bad'
}

/* ------------------------------------------------------------------ */
/* Recent activity                                                     */
/* ------------------------------------------------------------------ */

export type SuperAdminActivityType =
  | 'purchase'
  | 'publish'
  | 'support'
  | 'certificate'
  | 'security'
  | 'enrollment'
  | 'system'

export type SuperAdminActivityItem = {
  id: string
  type: SuperAdminActivityType
  title: string
  detail: string
  actor: string
  day: 'Today' | 'Yesterday' | 'Earlier this week'
  time: string
  needsAction?: boolean
  to: string
  toLabel: string
}

export const superAdminActivityTypes: { id: SuperAdminActivityType; label: string }[] = [
  { id: 'purchase', label: 'Purchases' },
  { id: 'publish', label: 'Publishing' },
  { id: 'support', label: 'Support' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'enrollment', label: 'Enrollments' },
  { id: 'security', label: 'Security' },
  { id: 'system', label: 'System' },
]

export const superAdminActivityItems: SuperAdminActivityItem[] = [
  { id: 'act-1', type: 'purchase', title: 'ABC Corp purchased 100 seats', detail: 'Fire Warden Training · KWD 6,970', actor: 'ABC Corp', day: 'Today', time: '10:42', to: paths.admin.b2bSales, toLabel: 'View sale' },
  { id: 'act-2', type: 'support', title: 'Urgent ticket TK-4127 opened', detail: 'Seat assignment not visible for employees · Gulf Horizon Logistics', actor: 'Gulf Horizon Logistics', day: 'Today', time: '10:05', needsAction: true, to: paths.admin.organizationQueries, toLabel: 'Open ticket' },
  { id: 'act-3', type: 'publish', title: 'ISO 45001 OH&S Implementer submitted for review', detail: 'Submitted by Eng. Bader Al-Failakawi', actor: 'Content Admin', day: 'Today', time: '09:31', needsAction: true, to: paths.admin.draftCourses, toLabel: 'Review course' },
  { id: 'act-4', type: 'certificate', title: '42 certificates issued', detail: 'Cybersecurity Awareness for Employees', actor: 'System', day: 'Today', time: '08:50', to: paths.admin.certificates, toLabel: 'View certificates' },
  { id: 'act-5', type: 'purchase', title: 'Refund requested for ORD-52344', detail: 'Duplicate purchase · KWD 85.000', actor: 'Maria Santos', day: 'Today', time: '08:12', needsAction: true, to: paths.admin.refunds, toLabel: 'Review refund' },
  { id: 'act-6', type: 'enrollment', title: '86 new enrollments in Lean Six Sigma Green Belt', detail: 'Spike after partner campaign', actor: 'System', day: 'Yesterday', time: '18:20', to: paths.admin.enrollments, toLabel: 'View enrollments' },
  { id: 'act-7', type: 'security', title: '5 failed admin logins from 185.60.112.8', detail: 'Account locked automatically', actor: 'Security', day: 'Yesterday', time: '16:44', needsAction: true, to: paths.admin.securityLogs, toLabel: 'Open audit log' },
  { id: 'act-8', type: 'publish', title: 'Fire Warden Training v2.1 published', detail: 'Arabic subtitles added', actor: 'Hessa Al-Sabah', day: 'Yesterday', time: '14:03', to: paths.admin.courseVersions, toLabel: 'View versions' },
  { id: 'act-9', type: 'system', title: 'Zoom link expired for ISO 9001 Audit Clinic', detail: 'Regenerate before Thursday 14:00', actor: 'Zoom integration', day: 'Yesterday', time: '11:30', needsAction: true, to: paths.admin.zoomLinks, toLabel: 'Fix link' },
  { id: 'act-10', type: 'purchase', title: 'Burgan Engineering signed an Enterprise plan', detail: '500 seats · KWD 18,000 / year', actor: 'Burgan Engineering', day: 'Yesterday', time: '09:15', to: paths.admin.organizationPlans, toLabel: 'View plan' },
  { id: 'act-11', type: 'support', title: 'Ticket TK-4098 resolved', detail: 'Certificate name spelling corrected · CSAT 5.0', actor: 'Noor Al-Hamad', day: 'Earlier this week', time: 'Mon 15:48', to: paths.admin.resolutionHistory, toLabel: 'View history' },
  { id: 'act-12', type: 'certificate', title: '312 certificates expire within 60 days', detail: 'Renewal reminders not yet sent', actor: 'System', day: 'Earlier this week', time: 'Mon 08:00', needsAction: true, to: paths.admin.certificateStatus, toLabel: 'Send reminders' },
  { id: 'act-13', type: 'enrollment', title: 'Hawalli Education Trust assigned 120 employees', detail: 'Customer Service Excellence', actor: 'Hawalli Education Trust', day: 'Earlier this week', time: 'Sun 13:22', to: paths.admin.organizationEmployees, toLabel: 'View employees' },
  { id: 'act-14', type: 'system', title: 'Payment gateway KNET latency elevated', detail: 'Avg. 4.2s, back to normal after 18 minutes', actor: 'Monitoring', day: 'Earlier this week', time: 'Sun 10:10', to: paths.admin.salesGateways, toLabel: 'View gateways' },
  { id: 'act-15', type: 'publish', title: 'Course pricing updated: PMP Exam Preparation', detail: 'KWD 320 → KWD 295 (National Day offer)', actor: 'Finance Admin', day: 'Earlier this week', time: 'Sat 17:05', to: paths.admin.coursePricing, toLabel: 'View pricing' },
]
