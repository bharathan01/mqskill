export type SuperAdminTopSellingBuyer = 'all' | 'b2c' | 'b2b'
export type SuperAdminTopSellingRank = 'units' | 'revenue' | 'individual' | 'seats'

export type SuperAdminTopSellingRow = {
  id: string
  course: string
  category: string
  individual: number
  seats: number
  revenue: number
  /** Month-over-month change. Null means newly listed. */
  vsPrev: number | null
  vsPrevUp: boolean
}

export const superAdminTopSellingBuyers: { id: SuperAdminTopSellingBuyer; label: string }[] = [
  { id: 'all', label: 'All buyers' },
  { id: 'b2c', label: 'Individuals (B2C)' },
  { id: 'b2b', label: 'Organizations (B2B)' },
]

export const superAdminTopSellingMonths = [
  { id: '2026-10', label: 'October 2026', vsLabel: 'vs Sep' },
  { id: '2026-09', label: 'September 2026', vsLabel: 'vs Aug' },
  { id: '2026-08', label: 'August 2026', vsLabel: 'vs Jul' },
  { id: '2026-07', label: 'July 2026', vsLabel: 'vs Jun' },
] as const

export const superAdminTopSellingRankOptions: { id: SuperAdminTopSellingRank; label: string }[] = [
  { id: 'units', label: 'Rank by: Units sold' },
  { id: 'revenue', label: 'Rank by: Revenue' },
  { id: 'individual', label: 'Rank by: Individual orders' },
  { id: 'seats', label: 'Rank by: Org seats' },
]

const seed: SuperAdminTopSellingRow[] = [
  {
    id: 'workplace-safety',
    course: 'Workplace Safety Basics',
    category: 'Health & Safety',
    individual: 106,
    seats: 60,
    revenue: 4150,
    vsPrev: 18,
    vsPrevUp: true,
  },
  {
    id: 'fire-warden',
    course: 'Fire Warden Training',
    category: 'Fire Safety',
    individual: 76,
    seats: 74,
    revenue: 6240,
    vsPrev: 11,
    vsPrevUp: true,
  },
  {
    id: 'manual-handling',
    course: 'Manual Handling',
    category: 'Health & Safety',
    individual: 85,
    seats: 58,
    revenue: 2860,
    vsPrev: 6,
    vsPrevUp: true,
  },
  {
    id: 'working-at-height',
    course: 'Working at Height',
    category: 'Construction',
    individual: 56,
    seats: 65,
    revenue: 3920,
    vsPrev: 14,
    vsPrevUp: true,
  },
  {
    id: 'first-aid',
    course: 'First Aid at Work',
    category: 'First Aid & Medical',
    individual: 55,
    seats: 52,
    revenue: 5880,
    vsPrev: 3,
    vsPrevUp: false,
  },
  {
    id: 'coshh',
    course: 'COSHH Awareness',
    category: 'Health & Safety',
    individual: 41,
    seats: 61,
    revenue: 2000,
    vsPrev: null,
    vsPrevUp: true,
  },
  {
    id: 'food-hygiene',
    course: 'Food Hygiene Level 2',
    category: 'Food Safety',
    individual: 55,
    seats: 28,
    revenue: 1410,
    vsPrev: 4,
    vsPrevUp: true,
  },
  {
    id: 'risk-assessment',
    course: 'Risk Assessment Essentials',
    category: 'Health & Safety',
    individual: 24,
    seats: 29,
    revenue: 2640,
    vsPrev: 8,
    vsPrevUp: false,
  },
  {
    id: 'electrical-safety',
    course: 'Electrical Safety',
    category: 'Health & Safety',
    individual: 25,
    seats: 24,
    revenue: 1360,
    vsPrev: 2,
    vsPrevUp: true,
  },
  {
    id: 'nebosh-igc',
    course: 'NEBOSH IGC Preparation',
    category: 'Health & Safety',
    individual: 10,
    seats: 24,
    revenue: 5400,
    vsPrev: 21,
    vsPrevUp: true,
  },
]

export const superAdminTopSellingCategories = ['All categories', ...new Set(seed.map((row) => row.category))]

export function unitsSold(row: SuperAdminTopSellingRow, buyer: SuperAdminTopSellingBuyer) {
  if (buyer === 'b2c') return row.individual
  if (buyer === 'b2b') return row.seats
  return row.individual + row.seats
}

export function filteredTopSelling(
  buyer: SuperAdminTopSellingBuyer,
  category: string,
  monthId: string,
  rank: SuperAdminTopSellingRank,
): SuperAdminTopSellingRow[] {
  const monthIndex = superAdminTopSellingMonths.findIndex((item) => item.id === monthId)
  const monthFactor = monthIndex <= 0 ? 1 : 1 - monthIndex * 0.06

  const rows = seed
    .filter((row) => category === 'All categories' || row.category === category)
    .map((row) => ({
      ...row,
      individual: Math.max(1, Math.round(row.individual * monthFactor * (buyer === 'b2b' ? 0.35 : 1))),
      seats: Math.max(0, Math.round(row.seats * monthFactor * (buyer === 'b2c' ? 0.2 : 1))),
      revenue: Math.round(row.revenue * monthFactor * (buyer === 'all' ? 1 : buyer === 'b2c' ? 0.58 : 0.42)),
    }))

  rows.sort((a, b) => {
    switch (rank) {
      case 'revenue':
        return b.revenue - a.revenue
      case 'individual':
        return b.individual - a.individual
      case 'seats':
        return b.seats - a.seats
      default:
        return unitsSold(b, buyer) - unitsSold(a, buyer)
    }
  })

  return rows
}

export function formatTopSellingRevenue(value: number) {
  return `KWD ${value.toLocaleString('en-US')}`
}
