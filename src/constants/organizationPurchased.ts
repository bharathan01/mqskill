import type { OrganizationCatalogIcon } from './organizationCatalog'

export type PurchasedCourseStatus = 'active' | 'awaiting_payment'

export type OrganizationPurchasedCourse = {
  id: string
  title: string
  bought: number
  assigned: number
  free: number
  done: number
  status: PurchasedCourseStatus
  icon: OrganizationCatalogIcon
  accent: string
  orderNote?: string
  orderId?: string
}

export const organizationPurchasedPage = {
  eyebrow: 'Learning',
  title: 'Purchased courses',
  subtitle: 'Every seat you bought, and how many are still free to assign.',
  buyMoreSeats: 'Buy more seats',
  buyMore: 'Buy more',
  assignSeats: 'Assign seats',
  awaitingPayment: 'Awaiting payment',
  unlocksAfterPayment: 'Unlocks after payment',
  viewOrder: 'View order',
  freeLabel: (count: number) => `${count} free`,
  footer:
    'A seat can be moved to another employee only if the first person hasn’t started the course yet.',
  headers: ['Course', 'Bought', 'Assigned', 'Free', 'Done', 'Seat use', ''],
  metrics: {
    seatsBought: 'Seats bought',
    seatsBoughtDetail: (courses: number) =>
      courses === 1 ? '1 course' : `${courses} courses`,
    assigned: 'Assigned',
    assignedDetail: (percent: number) => `${percent}% of seats`,
    free: 'Free to assign',
    freeDetail: 'Ready now',
    completed: 'Completed',
    completedDetail: 'by employees',
  },
  assignToast: (course: string) => `Open employees to assign seats for “${course}”.`,
} as const

export const organizationPurchasedCourses: OrganizationPurchasedCourse[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    bought: 10,
    assigned: 7,
    free: 3,
    done: 2,
    status: 'active',
    icon: 'megaphone',
    accent: 'from-[#7C3AED] to-[#A855F7]',
  },
  {
    id: 'whs',
    title: 'Workplace Health & Safety',
    bought: 50,
    assigned: 45,
    free: 5,
    done: 17,
    status: 'active',
    icon: 'shield',
    accent: 'from-[#059669] to-[#34D399]',
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Quality Awareness',
    bought: 20,
    assigned: 20,
    free: 0,
    done: 9,
    status: 'active',
    icon: 'badge',
    accent: 'from-[#2563EB] to-[#60A5FA]',
  },
  {
    id: 'pm',
    title: 'Project Management Fundamentals',
    bought: 40,
    assigned: 24,
    free: 16,
    done: 2,
    status: 'active',
    icon: 'briefcase',
    accent: 'from-[#EA580C] to-[#FB923C]',
  },
  {
    id: 'aml',
    title: 'Anti-Money Laundering (AML) Essentials',
    bought: 0,
    assigned: 0,
    free: 0,
    done: 0,
    status: 'awaiting_payment',
    icon: 'alert',
    accent: 'from-[#DC2626] to-[#F87171]',
    orderId: 'MQ-1047',
    orderNote: 'bank transfer',
  },
]
