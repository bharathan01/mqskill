import type { OrganizationCatalogIcon } from './organizationCatalog'
import type { OrganizationCartItem } from './organizationCart'

export type CheckoutPaymentMethod = 'knet' | 'card' | 'transfer'

export type OrganizationOrderItem = {
  id: string
  title: string
  seats: number
  totalSeats: number
  freeSeats: number
  icon: OrganizationCatalogIcon
  accent: string
}

export type OrganizationOrder = {
  orderId: string
  date: string
  paymentMethod: CheckoutPaymentMethod
  paymentLabel: string
  total: number
  items: OrganizationOrderItem[]
}

export function buildOrderFromCart(
  cartItems: OrganizationCartItem[],
  paymentMethod: CheckoutPaymentMethod,
  paymentLabel: string,
): OrganizationOrder {
  return {
    orderId: `MQ-${1000 + Math.floor(Math.random() * 900)}`,
    date: '3 Nov 2026',
    paymentMethod,
    paymentLabel,
    total: cartItems.reduce((sum, item) => sum + item.unitPrice * item.seats, 0),
    items: cartItems.map((item) => {
      const owned = item.id === 'digital-marketing' ? 10 : item.id === 'whs' ? 50 : 0
      const free = item.id === 'digital-marketing' ? 3 : item.id === 'whs' ? 5 : 0
      return {
        id: item.id,
        title: item.title,
        seats: item.seats,
        totalSeats: owned + item.seats,
        freeSeats: free + item.seats,
        icon: item.icon,
        accent: item.accent,
      }
    }),
  }
}

export const organizationCheckoutPage = {
  title: 'Checkout',
  steps: {
    cart: 'Cart',
    details: 'Details & payment',
    done: 'Done',
  },
  billingTitle: 'Billing details',
  company: 'Company name',
  billingEmail: 'Billing email',
  address: 'Address',
  poNumber: 'PO number (optional)',
  paymentTitle: 'How would you like to pay?',
  instant: 'Instant',
  methods: {
    knet: {
      label: 'KNET',
      description: 'Pay with any Kuwaiti bank card. You’ll go to the secure KNET page.',
    },
    card: {
      label: 'Credit / debit card',
      description: 'Visa or Mastercard',
    },
    transfer: {
      label: 'Bank transfer',
      description:
        'We email an invoice with our bank details. Seats unlock once payment arrives (1–2 working days).',
    },
  },
  summaryTitle: 'Order summary',
  subtotal: 'Subtotal',
  totalToPay: 'Total to pay',
  agree: 'I agree to the MaqSkillz terms of purchase',
  agreeRequired: 'Please agree to the terms to continue.',
  emptyCart: 'Your cart is empty. Add seats from the catalog first.',
  backToCart: 'Back to cart',
  pay: (amount: string) => `Pay ${amount}`,
  secureNote: 'Secure payment · Invoice emailed after payment',
  defaults: {
    company: 'ABC Corporation',
    email: 'accounts@abccorporation.com',
    address: 'Sharq, Kuwait City, Kuwait',
    poNumber: 'PO-2026-118',
  },
} as const

export const organizationPaymentSuccessPage = {
  title: 'Payment successful',
  subtitle:
    'Your seats are ready. Assign each seat to one employee — they’ll get an email to start learning.',
  order: 'Order',
  date: 'Date',
  paidWith: 'Paid with',
  totalPaid: 'Total paid',
  ready: 'Ready to assign',
  seatsLine: (added: number, total: number, free: number) =>
    `${added} new seats · now ${total} seats, ${free} free`,
  downloadInvoice: 'Download Invoice',
  assignSeats: 'Assign seats now →',
  invoiceToast: 'Invoice downloaded.',
} as const
