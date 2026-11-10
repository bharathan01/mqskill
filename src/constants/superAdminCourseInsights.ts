import { courseCatalog } from './superAdminCatalogKit'

/* ----------------------------- Most viewed ------------------------------ */

export type SuperAdminMostViewedRow = {
  id: string
  course: string
  category: string
  views: number
  cart: number
  purchases: number
  conversion: number
}

export const superAdminMostViewedKpis = [
  { id: 'views', label: 'Course page views', value: '18,420', change: '+9.8% vs Sep', tone: 'up' as const },
  { id: 'visitors', label: 'Unique visitors', value: '11,260', change: '+7.1% vs Sep', tone: 'up' as const },
  { id: 'purchases', label: 'Purchases from views', value: '428', change: '+5.2% vs Sep', tone: 'up' as const },
  { id: 'rate', label: 'View-to-purchase rate', value: '3.8%', change: '+0.4 pt vs Sep', tone: 'up' as const },
]

export const superAdminMostViewedFunnel = [
  { label: 'Page views', value: 18420, width: 100 },
  { label: 'Unique visitors', value: 11260, width: 61 },
  { label: 'Added to cart', value: 1040, width: 28 },
  { label: 'Purchased', value: 428, width: 16 },
]

export const superAdminMostViewedAlerts = [
  {
    id: 'nebosh',
    course: 'NEBOSH IGC Preparation',
    detail: '2,860 views, 1.4% conversion. Review price and course page.',
  },
  {
    id: 'iso-45001',
    course: 'ISO 45001 Foundations',
    detail: '1,420 views, 1.0% conversion. Course page has no preview lesson.',
  },
]

const mostViewedSeed: SuperAdminMostViewedRow[] = [
  { id: 'mv-1', course: 'Workplace Safety Basics', category: 'Health & Safety', views: 3920, cart: 262, purchases: 118, conversion: 4.9 },
  { id: 'mv-2', course: 'Fire Warden Training', category: 'Fire Safety', views: 3140, cart: 210, purchases: 96, conversion: 4.8 },
  { id: 'mv-3', course: 'NEBOSH IGC Preparation', category: 'Health & Safety', views: 2860, cart: 88, purchases: 24, conversion: 1.4 },
  { id: 'mv-4', course: 'First Aid at Work', category: 'First Aid & Medical', views: 2310, cart: 124, purchases: 62, conversion: 4.2 },
  { id: 'mv-5', course: 'Working at Height', category: 'Construction', views: 1640, cart: 74, purchases: 38, conversion: 3.7 },
  { id: 'mv-6', course: 'ISO 45001 Foundations', category: 'Compliance & ISO', views: 1420, cart: 30, purchases: 9, conversion: 1.0 },
  { id: 'mv-7', course: 'Manual Handling', category: 'Health & Safety', views: 1180, cart: 58, purchases: 34, conversion: 4.5 },
  { id: 'mv-8', course: 'Food Hygiene Level 2', category: 'Food Safety', views: 880, cart: 29, purchases: 17, conversion: 3.0 },
]

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function padMostViewed(): SuperAdminMostViewedRow[] {
  const extras: SuperAdminMostViewedRow[] = []
  let i = 0
  while (mostViewedSeed.length + extras.length < 46) {
    const base = courseCatalog[i % courseCatalog.length]
    const cycle = Math.floor(i / courseCatalog.length)
    const name = cycle === 0 ? `${base.name} Insights` : `${base.name} (${cycle + 1})`
    if (![...mostViewedSeed, ...extras].some((row) => row.course === name)) {
      const views = Math.max(120, 820 - extras.length * 14 - (i % 9) * 7)
      const conversion = Number((1.2 + (i % 7) * 0.45).toFixed(1))
      const purchases = Math.max(1, Math.round((views * conversion) / 100))
      extras.push({
        id: `mv-${slugify(name)}`,
        course: name,
        category: base.category,
        views,
        cart: Math.max(purchases, Math.round(purchases * 1.8)),
        purchases,
        conversion,
      })
    }
    i += 1
    if (i > 200) break
  }
  return extras
}

export const superAdminMostViewedRows: SuperAdminMostViewedRow[] = [...mostViewedSeed, ...padMostViewed()]
export const superAdminMostViewedPageSize = 8

/* --------------------------- Highest revenue ---------------------------- */

export type SuperAdminHighestRevenueRow = {
  id: string
  course: string
  category: string
  b2c: number
  b2b: number
  refunds: number
  net: number
  share: number
}

export const superAdminHighestRevenueMonths = [
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-08', label: 'August 2026' },
] as const

export const superAdminHighestRevenueRows: SuperAdminHighestRevenueRow[] = [
  { id: 'hr-1', course: 'Fire Warden Training', category: 'Fire Safety', b2c: 3420, b2b: 2820, refunds: 135, net: 6105, share: 12.6 },
  { id: 'hr-2', course: 'First Aid at Work', category: 'First Aid & Medical', b2c: 3300, b2b: 2580, refunds: 90, net: 5790, share: 11.9 },
  { id: 'hr-3', course: 'NEBOSH IGC Preparation', category: 'Health & Safety', b2c: 1800, b2b: 3600, refunds: 180, net: 5220, share: 10.7 },
  { id: 'hr-4', course: 'Workplace Safety Basics', category: 'Health & Safety', b2c: 2650, b2b: 1500, refunds: 50, net: 4100, share: 8.4 },
  { id: 'hr-5', course: 'Working at Height', category: 'Construction', b2c: 1960, b2b: 1960, refunds: 70, net: 3850, share: 7.9 },
  { id: 'hr-6', course: 'Manual Handling', category: 'Health & Safety', b2c: 1700, b2b: 1160, refunds: 40, net: 2820, share: 5.8 },
  { id: 'hr-7', course: 'Risk Assessment Essentials', category: 'Health & Safety', b2c: 1320, b2b: 1320, refunds: 55, net: 2585, share: 5.3 },
  { id: 'hr-8', course: 'COSHH Awareness', category: 'Health & Safety', b2c: 900, b2b: 1100, refunds: 0, net: 2000, share: 4.1 },
  { id: 'hr-9', course: 'Food Hygiene Level 2', category: 'Food Safety', b2c: 990, b2b: 420, refunds: 18, net: 1392, share: 2.9 },
  { id: 'hr-10', course: 'Electrical Safety', category: 'Health & Safety', b2c: 760, b2b: 600, refunds: 0, net: 1360, share: 2.8 },
]

export const superAdminHighestRevenueCategories = [
  'All categories',
  ...new Set(superAdminHighestRevenueRows.map((row) => row.category)),
]

export const superAdminHighestRevenueTotals = {
  b2c: 18800,
  b2b: 17060,
  refunds: 638,
  net: 35222,
  share: 72.4,
}

export function formatInsightKwd(value: number, decimals = 0) {
  return `KWD ${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/* --------------------------- Recently added ----------------------------- */

export type SuperAdminRecentlyAddedStatus = 'Published' | 'Draft' | 'In review'

export type SuperAdminRecentlyAddedRow = {
  id: string
  course: string
  category: string
  note?: string
  added: string
  byInitials: string
  byName: string
  byRole: string
  status: SuperAdminRecentlyAddedStatus
  price: number
  learners: number | null
  revenue: number | null
}

export const superAdminRecentlyAddedRanges = [
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: 'year', label: 'This year', days: 365 },
] as const

export const superAdminRecentlyAddedKpis = [
  { id: 'added', label: 'Added in last 90 days', value: '7', detail: '3 published · 4 drafts' },
  { id: 'learners', label: 'Learners on new courses', value: '450', detail: 'Since each course went live' },
  { id: 'publish', label: 'Average time to publish', value: '19 days', detail: 'From creation to catalogue' },
]

export const superAdminRecentlyAddedRows: SuperAdminRecentlyAddedRow[] = [
  {
    id: 'ra-1',
    course: 'Workplace Safety Basics v3.0',
    category: 'Health & Safety',
    note: 'new version of a live course',
    added: '2026-11-09',
    byInitials: 'FM',
    byName: 'Faisal M.',
    byRole: 'Super Admin',
    status: 'Published',
    price: 25,
    learners: 36,
    revenue: 900,
  },
  {
    id: 'ra-2',
    course: 'Confined Space Entry',
    category: 'Construction',
    added: '2026-11-04',
    byInitials: 'FM',
    byName: 'Faisal M.',
    byRole: 'Super Admin',
    status: 'Draft',
    price: 40,
    learners: null,
    revenue: null,
  },
  {
    id: 'ra-3',
    course: 'Scaffolding Inspection',
    category: 'Construction',
    added: '2026-10-29',
    byInitials: 'NA',
    byName: 'Noura A.',
    byRole: 'Super Admin',
    status: 'Draft',
    price: 45,
    learners: null,
    revenue: null,
  },
  {
    id: 'ra-4',
    course: 'Electrical Safety v2.0',
    category: 'Health & Safety',
    added: '2026-10-20',
    byInitials: 'FM',
    byName: 'Faisal M.',
    byRole: 'Super Admin',
    status: 'In review',
    price: 30,
    learners: null,
    revenue: null,
  },
  {
    id: 'ra-5',
    course: 'COSHH Awareness',
    category: 'Health & Safety',
    added: '2026-10-02',
    byInitials: 'NA',
    byName: 'Noura A.',
    byRole: 'Super Admin',
    status: 'Published',
    price: 22,
    learners: 168,
    revenue: 2480,
  },
  {
    id: 'ra-6',
    course: 'Lifting Operations (LOLER)',
    category: 'Construction',
    added: '2026-09-24',
    byInitials: 'FM',
    byName: 'Faisal M.',
    byRole: 'Super Admin',
    status: 'Draft',
    price: 50,
    learners: null,
    revenue: null,
  },
  {
    id: 'ra-7',
    course: 'Food Hygiene Level 2',
    category: 'Food Safety',
    added: '2026-08-16',
    byInitials: 'NA',
    byName: 'Noura A.',
    byRole: 'Super Admin',
    status: 'Published',
    price: 18,
    learners: 246,
    revenue: 3960,
  },
]

export const superAdminRecentlyAddedCategories = [
  'All categories',
  ...new Set(superAdminRecentlyAddedRows.map((row) => row.category)),
]

export const superAdminRecentlyAddedStatuses = ['Any status', 'Published', 'Draft', 'In review'] as const

const referenceDate = new Date('2026-11-10T00:00:00Z')

export function filterRecentlyAdded(
  rangeId: (typeof superAdminRecentlyAddedRanges)[number]['id'],
  category: string,
  status: string,
) {
  const range = superAdminRecentlyAddedRanges.find((item) => item.id === rangeId) ?? superAdminRecentlyAddedRanges[1]
  return superAdminRecentlyAddedRows.filter((row) => {
    if (category !== 'All categories' && row.category !== category) return false
    if (status !== 'Any status' && row.status !== status) return false
    const added = new Date(`${row.added}T00:00:00Z`).getTime()
    const ageDays = (referenceDate.getTime() - added) / 86_400_000
    return ageDays <= range.days
  })
}

export function formatInsightDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
