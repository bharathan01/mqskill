import type { OrganizationCatalogIcon } from './organizationCatalog'

export type OrganizationCartItem = {
  id: string
  title: string
  shortLabel: string
  seats: number
  unitPrice: number
  priceLabel: string
  modules: number
  hours: string
  cpdHours: number
  icon: OrganizationCatalogIcon
  accent: string
  detail?: string
}

export const organizationCartPage = {
  eyebrow: 'Learning',
  title: 'Your cart',
  continueShopping: '← Continue shopping',
  coursesHeading: 'Courses',
  perSeat: 'per seat',
  meta: (modules: number, hours: string, cpd: number) =>
    `${modules} modules · ${hours} · ${cpd} CPD`,
  assignNote: 'After payment, assign each seat to one employee from Purchased courses.',
  summaryTitle: 'Order summary',
  subtotal: 'Subtotal',
  total: 'Total',
  checkout: 'Go to checkout →',
  benefit: 'No employee limits. You only pay for course seats.',
  emptyTitle: 'Your cart is empty',
  emptyBody: 'Browse the course catalog and add seats for your team.',
  browseCatalog: 'Browse catalog',
  coursesCount: (count: number) => (count === 1 ? '1 course' : `${count} courses`),
  seatsCount: (count: number) => (count === 1 ? '1 seat' : `${count} seats`),
  removedToast: 'Removed from cart.',
} as const

export function formatKwd(amount: number) {
  return `${amount.toFixed(3)} KWD`
}

export function parseKwdPrice(price: string) {
  const value = Number.parseFloat(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : 0
}

export const organizationCartSeed: OrganizationCartItem[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    shortLabel: 'Digital Marketing',
    seats: 10,
    unitPrice: 15,
    priceLabel: '15.000 KWD',
    modules: 8,
    hours: '12 hrs',
    cpdHours: 12,
    icon: 'megaphone',
    accent: 'from-[#7C3AED] to-[#A855F7]',
  },
  {
    id: 'whs',
    title: 'Workplace Health & Safety',
    shortLabel: 'Health & Safety',
    seats: 5,
    unitPrice: 12,
    priceLabel: '12.000 KWD',
    modules: 6,
    hours: '8 hrs',
    cpdHours: 8,
    icon: 'shield',
    accent: 'from-[#059669] to-[#34D399]',
  },
]
