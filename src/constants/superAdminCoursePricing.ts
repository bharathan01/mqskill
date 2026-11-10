import { courseCatalog } from './superAdminCatalogKit'

export type SuperAdminPricingPlanId = 'basic' | 'standard' | 'business' | 'enterprise'

export type SuperAdminPricingPlan = {
  id: SuperAdminPricingPlanId
  label: string
  seatLimit: string
  /** Percentage off seat price. Null when not approved / contract-based. */
  discountPct: number | null
  badge: string
  note?: string
}

export type SuperAdminCoursePrice = {
  id: string
  name: string
  b2c: number
  seat: number
  effective: string
}

export const superAdminPricingPageSize = 7

export const superAdminPricingPlansSeed: SuperAdminPricingPlan[] = [
  {
    id: 'basic',
    label: 'Basic',
    seatLimit: 'Up to 10 employees',
    discountPct: 10,
    badge: '−10%',
  },
  {
    id: 'standard',
    label: 'Standard',
    seatLimit: 'Up to 50 employees',
    discountPct: 20,
    badge: '−20%',
  },
  {
    id: 'business',
    label: 'Business',
    seatLimit: 'Up to 100 employees',
    discountPct: null,
    badge: 'Pending',
    note: 'No discount applied until a rate is approved',
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    seatLimit: 'More than 100 employees',
    discountPct: null,
    badge: 'Contract',
    note: 'Set per contract',
  },
]

const featured: SuperAdminCoursePrice[] = [
  {
    id: 'iso-9001',
    name: 'ISO 9001: Quality Management Systems',
    b2c: 12,
    seat: 12,
    effective: '2026-10-01',
  },
  {
    id: 'iso-45001',
    name: 'ISO 45001: Occupational Health & Safety',
    b2c: 15,
    seat: 15,
    effective: '2026-09-15',
  },
  {
    id: 'fire-warden',
    name: 'Fire Warden Training',
    b2c: 9,
    seat: 9,
    effective: '2026-08-01',
  },
  {
    id: 'iso-27001',
    name: 'ISO 27001: Information Security',
    b2c: 20,
    seat: 20,
    effective: '2026-10-01',
  },
  {
    id: 'first-aid',
    name: 'First Aid at Work',
    b2c: 8,
    seat: 8,
    effective: '2026-07-01',
  },
  {
    id: 'food-safety',
    name: 'Food Safety Level 2',
    b2c: 7,
    seat: 7,
    effective: '2026-07-01',
  },
  {
    id: 'pm-fundamentals',
    name: 'Project Management Fundamentals',
    b2c: 15,
    seat: 15,
    effective: '2026-08-20',
  },
]

const featuredNames = new Set(featured.map((row) => row.name.toLowerCase()))

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function padCourses(): SuperAdminCoursePrice[] {
  const extras: SuperAdminCoursePrice[] = []
  let i = 0
  while (featured.length + extras.length < 128) {
    const base = courseCatalog[i % courseCatalog.length]
    const cycle = Math.floor(i / courseCatalog.length)
    const name = cycle === 0 ? base.name : `${base.name} (${cycle + 1})`
    if (!featuredNames.has(name.toLowerCase()) && !extras.some((row) => row.name === name)) {
      const price = Math.max(5, Math.round((base.price / 20) * 10) / 10)
      const month = ((i * 3) % 9) + 1
      const day = ((i * 5) % 27) + 1
      extras.push({
        id: slugify(name),
        name,
        b2c: price,
        seat: price,
        effective: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      })
    }
    i += 1
    if (i > 400) break
  }
  return extras
}

export const superAdminCoursePricesSeed: SuperAdminCoursePrice[] = [...featured, ...padCourses()]

export function formatKwdAmount(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

export function formatKwdLabel(value: number) {
  return `KWD ${formatKwdAmount(value)}`
}

export function formatPricingDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function discountedSeat(seat: number, discountPct: number | null) {
  if (discountPct == null) return null
  return Math.round(seat * (1 - discountPct / 100) * 1000) / 1000
}
