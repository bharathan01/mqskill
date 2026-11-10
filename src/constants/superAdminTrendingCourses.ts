import { rnd } from './superAdminCatalogKit'
import {
  SUPER_ADMIN_ALL_COUNTRIES,
  superAdminExecutiveBusinessOptions,
  superAdminExecutiveCountryOptions,
  superAdminExecutiveRanges,
  type SuperAdminExecutiveBusiness,
  type SuperAdminExecutiveRangeId,
} from './superAdminDashboard'

export type SuperAdminIntelligenceSort =
  | 'growth'
  | 'views'
  | 'conversion'
  | 'purchases'
  | 'enrolled'
  | 'complete'
  | 'revenue'

export type SuperAdminIntelligenceRow = {
  id: string
  course: string
  category: string
  views: number
  conversion: number
  purchases: number
  enrolled: number
  complete: number
  revenue: number
  growth: number
  spark: number[]
  checkoutRate: number
}

export const superAdminIntelligenceSortTabs: { id: SuperAdminIntelligenceSort; label: string }[] = [
  { id: 'growth', label: 'By growth' },
  { id: 'views', label: 'By views' },
  { id: 'conversion', label: 'By conversion' },
  { id: 'purchases', label: 'By purchases' },
  { id: 'enrolled', label: 'By enrolled' },
  { id: 'complete', label: 'By completion' },
  { id: 'revenue', label: 'By revenue' },
]

export const superAdminIntelligenceRanges = superAdminExecutiveRanges
export const superAdminIntelligenceCountries = superAdminExecutiveCountryOptions
export const superAdminIntelligenceBusiness = superAdminExecutiveBusinessOptions
export const superAdminIntelligenceVersions = [
  { id: 'latest', label: 'Version: latest' },
  { id: 'all', label: 'Version: all' },
] as const

const seed: Omit<SuperAdminIntelligenceRow, 'id' | 'spark'>[] = [
  {
    course: 'ISO 45001: Occupational Health & Safety',
    category: 'Health & Safety',
    views: 9842,
    conversion: 4.2,
    purchases: 412,
    enrolled: 371,
    complete: 71,
    revenue: 6180,
    growth: 64,
    checkoutRate: 11,
  },
  {
    course: 'Fire Warden Training',
    category: 'Health & Safety',
    views: 7315,
    conversion: 5,
    purchases: 366,
    enrolled: 340,
    complete: 78,
    revenue: 3294,
    growth: 41.2,
    checkoutRate: 12.4,
  },
  {
    course: 'ISO 9001: Quality Management Systems',
    category: 'Quality & Compliance',
    views: 8904,
    conversion: 4.9,
    purchases: 438,
    enrolled: 402,
    complete: 68,
    revenue: 5256,
    growth: 28.5,
    checkoutRate: 10.8,
  },
  {
    course: 'First Aid at Work',
    category: 'Health & Safety',
    views: 6120,
    conversion: 4.6,
    purchases: 284,
    enrolled: 265,
    complete: 82,
    revenue: 2272,
    growth: 22.1,
    checkoutRate: 9.6,
  },
  {
    course: 'ISO 27001: Information Security',
    category: 'Information Security',
    views: 5476,
    conversion: 3.6,
    purchases: 198,
    enrolled: 176,
    complete: 53,
    revenue: 3960,
    growth: 17.9,
    checkoutRate: 8.2,
  },
  {
    course: 'Food Safety Level 2',
    category: 'Food & Hygiene',
    views: 4210,
    conversion: 4.2,
    purchases: 176,
    enrolled: 168,
    complete: 74,
    revenue: 1232,
    growth: 12.4,
    checkoutRate: 9.1,
  },
  {
    course: 'Project Management Fundamentals',
    category: 'Business Skills',
    views: 3880,
    conversion: 3.1,
    purchases: 121,
    enrolled: 108,
    complete: 49,
    revenue: 1815,
    growth: 6.2,
    checkoutRate: 7.4,
  },
  {
    course: 'Manual Handling at Work',
    category: 'Health & Safety',
    views: 3512,
    conversion: 4,
    purchases: 142,
    enrolled: 139,
    complete: 90,
    revenue: 852,
    growth: 3.1,
    checkoutRate: 8.8,
  },
]

export const superAdminIntelligenceCategories = ['All categories', ...new Set(seed.map((row) => row.category))]

function scaleFor(
  rangeId: SuperAdminExecutiveRangeId,
  country: string,
  business: SuperAdminExecutiveBusiness,
) {
  const range = superAdminIntelligenceRanges.find((item) => item.id === rangeId) ?? superAdminIntelligenceRanges[1]
  const countryMul = country === SUPER_ADMIN_ALL_COUNTRIES ? 1 : 0.42 + country.length * 0.01
  const businessMul = business === 'all' ? 1 : business === 'b2c' ? 0.68 : 0.32
  return { range, mul: range.factor * countryMul * businessMul, changeMul: range.changeMul }
}

export function superAdminIntelligenceRows(
  rangeId: SuperAdminExecutiveRangeId,
  country: string,
  business: SuperAdminExecutiveBusiness,
  category: string,
  version: string,
): SuperAdminIntelligenceRow[] {
  const { mul, changeMul } = scaleFor(rangeId, country, business)
  const versionMul = version === 'all' ? 1.08 : 1
  return seed
    .filter((row) => category === 'All categories' || row.category === category)
    .map((row, i) => {
      const noise = 0.97 + rnd(i, rangeId.length + 3, 0, 6) / 100
      const factor = mul * versionMul * noise
      return {
        id: `intel-${i}`,
        course: row.course,
        category: row.category,
        views: Math.round(row.views * factor),
        conversion: Number((row.conversion + (changeMul - 1) * 0.1).toFixed(1)),
        purchases: Math.max(1, Math.round(row.purchases * factor)),
        enrolled: Math.max(1, Math.round(row.enrolled * factor)),
        complete: Math.min(98, Math.round(row.complete + (changeMul - 1) * 0.8)),
        revenue: Math.round(row.revenue * factor * 1000) / 1000,
        growth: Number(Math.max(0.5, row.growth * (0.55 + 0.45 * changeMul)).toFixed(1)),
        checkoutRate: row.checkoutRate,
        spark: Array.from({ length: 8 }, (_, k) => 28 + k * (3 + row.growth / 25) + rnd(k, i + 5, 0, 14)),
      }
    })
}

export function sortIntelligenceRows(rows: SuperAdminIntelligenceRow[], sort: SuperAdminIntelligenceSort) {
  const copy = [...rows]
  copy.sort((a, b) => {
    switch (sort) {
      case 'views':
        return b.views - a.views
      case 'conversion':
        return b.conversion - a.conversion
      case 'purchases':
        return b.purchases - a.purchases
      case 'enrolled':
        return b.enrolled - a.enrolled
      case 'complete':
        return b.complete - a.complete
      case 'revenue':
        return b.revenue - a.revenue
      default:
        return b.growth - a.growth
    }
  })
  return copy
}

export type SuperAdminIntelligenceCompareRow = {
  metric: string
  previous: string
  current: string
  change: string
  up: boolean
}

export function superAdminIntelligenceCompare(
  row: SuperAdminIntelligenceRow,
  rangeId: SuperAdminExecutiveRangeId,
): { title: string; period: string; rows: SuperAdminIntelligenceCompareRow[] } {
  const range = superAdminIntelligenceRanges.find((item) => item.id === rangeId) ?? superAdminIntelligenceRanges[1]
  const prevFactor = 1 / (1 + row.growth / 100)
  const prevViews = Math.round(row.views * prevFactor)
  const prevPurchases = Math.round(row.purchases * prevFactor)
  const prevEnrolled = Math.round(row.enrolled * prevFactor)
  const prevComplete = Math.max(1, row.complete - 2)
  const prevRevenue = Math.round(row.revenue * prevFactor * 1000) / 1000
  const prevConv = Number((row.conversion - 0.2).toFixed(1))

  const pctChange = (current: number, previous: number) => {
    if (!previous) return '—'
    return `${(((current - previous) / previous) * 100).toFixed(1)}%`
  }

  return {
    title: `Period comparison · ${row.course.split(':')[0]}`,
    period: `${range.current} vs ${range.previous}`,
    rows: [
      {
        metric: 'Course-page views',
        previous: prevViews.toLocaleString('en-US'),
        current: row.views.toLocaleString('en-US'),
        change: pctChange(row.views, prevViews),
        up: row.views >= prevViews,
      },
      {
        metric: 'View → purchase conversion',
        previous: `${prevConv.toFixed(1)}%`,
        current: `${row.conversion.toFixed(1)}%`,
        change: `${(row.conversion - prevConv).toFixed(1)} pts`,
        up: row.conversion >= prevConv,
      },
      {
        metric: 'Purchases (courses + seats)',
        previous: prevPurchases.toLocaleString('en-US'),
        current: row.purchases.toLocaleString('en-US'),
        change: pctChange(row.purchases, prevPurchases),
        up: row.purchases >= prevPurchases,
      },
      {
        metric: 'Enrolments started',
        previous: prevEnrolled.toLocaleString('en-US'),
        current: row.enrolled.toLocaleString('en-US'),
        change: pctChange(row.enrolled, prevEnrolled),
        up: row.enrolled >= prevEnrolled,
      },
      {
        metric: 'Completion rate',
        previous: `${prevComplete}%`,
        current: `${row.complete}%`,
        change: `${row.complete - prevComplete} pts`,
        up: row.complete >= prevComplete,
      },
      {
        metric: 'Revenue (KWD)',
        previous: prevRevenue.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
        current: row.revenue.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
        change: pctChange(row.revenue, prevRevenue),
        up: row.revenue >= prevRevenue,
      },
      {
        metric: 'Rating',
        previous: 'Not collected',
        current: 'Not collected',
        change: '—',
        up: true,
      },
    ],
  }
}

export function superAdminIntelligenceFunnel(row: SuperAdminIntelligenceRow) {
  const checkout = Math.round(row.views * (row.checkoutRate / 100))
  const completed = Math.round(row.enrolled * (row.complete / 100))
  return [
    { label: 'Course-page views', value: row.views, detail: '100%', width: 100 },
    {
      label: 'Started checkout',
      value: checkout,
      detail: `${row.checkoutRate.toFixed(1)}% of views`,
      width: Math.max(8, row.checkoutRate * 4),
    },
    {
      label: 'Purchased',
      value: row.purchases,
      detail: `${row.conversion.toFixed(1)}% of views`,
      width: Math.max(6, row.conversion * 8),
    },
    {
      label: 'Enrolled',
      value: row.enrolled,
      detail: `${Math.round((row.enrolled / Math.max(1, row.purchases)) * 100)}% of purchases`,
      width: Math.max(6, (row.enrolled / Math.max(1, row.views)) * 100 * 8),
    },
    {
      label: 'Completed',
      value: completed,
      detail: `${row.complete}% of enrolments`,
      width: Math.max(5, row.complete * 0.7),
    },
  ]
}
