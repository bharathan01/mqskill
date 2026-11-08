export type InvoiceStatus = 'paid' | 'awaiting'

export type OrganizationInvoice = {
  id: string
  number: string
  date: string
  course: string
  courseDetail: string
  seats: number
  amount: number
  pricePerSeat: number
  paidWith: string
  status: InvoiceStatus
  dueDate?: string
  orderId: string
  poNumber: string
  year: number
}

export const organizationBillingPage = {
  title: 'Billing & invoices',
  subtitle:
    'Every course purchase creates an invoice. You only pay for the seats you buy — no subscription, no employee limit.',
  buyCourses: 'Buy courses',
  metrics: {
    paid: 'Paid in 2026',
    paidDetail: 'KWD · 4 invoices',
    awaiting: 'Awaiting payment',
    awaitingDetail: 'KWD · due 8 Nov',
    seats: 'Seats bought',
    seatsDetail: '+15 after payment',
    avg: 'Avg price per seat',
    avgDetail: 'KWD',
  },
  alertTitle: 'Invoice INV-1047 is waiting for your bank transfer.',
  alertBody: '210.000 KWD for 15 AML seats · due 8 Nov 2026. Seats unlock as soon as payment arrives.',
  viewBankDetails: 'View bank details',
  payByKnet: 'Pay by KNET instead',
  invoicesTitle: 'Invoices',
  export: 'Export',
  exportToast: 'Invoices exported.',
  year: '2026',
  headers: ['Invoice', 'Date', 'Course', 'Seats', 'KWD', 'Paid with', 'Status', ''],
  status: {
    paid: 'Paid',
    awaiting: 'Awaiting payment',
  },
  billingDetailsTitle: 'Billing details',
  edit: 'Edit',
  editToast: 'Open organization settings to edit billing details.',
  fields: {
    company: 'Company',
    invoicesSentTo: 'Invoices sent to',
    address: 'Address',
    currency: 'Currency',
  },
  waysToPayTitle: 'Ways to pay',
  waysToPay: [
    {
      id: 'knet',
      label: 'KNET',
      detail: 'Instant — any Kuwaiti bank card.',
    },
    {
      id: 'card',
      label: 'Credit / debit card',
      detail: 'Visa, Mastercard.',
    },
    {
      id: 'transfer',
      label: 'Bank transfer',
      detail: 'Seats unlock when payment arrives.',
    },
  ],
  company: 'ABC Corporation',
  email: 'accounts@abccorporation.com',
  address: 'Sharq, Kuwait City, Kuwait',
  currency: 'KWD',
  downloadToast: 'Invoice downloaded.',
} as const

export const organizationBillingMetrics = [
  {
    id: 'paid',
    label: organizationBillingPage.metrics.paid,
    value: '1,910.000',
    detail: organizationBillingPage.metrics.paidDetail,
    tone: 'green' as const,
  },
  {
    id: 'awaiting',
    label: organizationBillingPage.metrics.awaiting,
    value: '210.000',
    detail: organizationBillingPage.metrics.awaitingDetail,
    tone: 'amber' as const,
  },
  {
    id: 'seats',
    label: organizationBillingPage.metrics.seats,
    value: '120',
    detail: organizationBillingPage.metrics.seatsDetail,
    tone: 'blue' as const,
  },
  {
    id: 'avg',
    label: organizationBillingPage.metrics.avg,
    value: '15.917',
    detail: organizationBillingPage.metrics.avgDetail,
    tone: 'slate' as const,
  },
]

export const organizationInvoices: OrganizationInvoice[] = [
  {
    id: 'inv-1047',
    number: 'INV-1047',
    date: '1 Nov 2026',
    course: 'AML Essentials',
    courseDetail: 'Anti-Money Laundering (AML) Essentials',
    seats: 15,
    amount: 210,
    pricePerSeat: 14,
    paidWith: 'Bank transfer',
    status: 'awaiting',
    dueDate: '8 Nov 2026',
    orderId: 'MQ-1047',
    poNumber: 'PO-2026-114',
    year: 2026,
  },
  {
    id: 'inv-1031',
    number: 'INV-1031',
    date: '18 Oct 2026',
    course: 'Workplace Health & Safety',
    courseDetail: 'Workplace Health & Safety',
    seats: 45,
    amount: 675,
    pricePerSeat: 15,
    paidWith: 'KNET',
    status: 'paid',
    orderId: 'MQ-1031',
    poNumber: 'PO-2026-101',
    year: 2026,
  },
  {
    id: 'inv-1024',
    number: 'INV-1024',
    date: '2 Oct 2026',
    course: 'Project Management Fundamentals',
    courseDetail: 'Project Management Fundamentals',
    seats: 24,
    amount: 408,
    pricePerSeat: 17,
    paidWith: 'Card',
    status: 'paid',
    orderId: 'MQ-1024',
    poNumber: 'PO-2026-088',
    year: 2026,
  },
  {
    id: 'inv-1018',
    number: 'INV-1018',
    date: '12 Sep 2026',
    course: 'ISO 9001:2015 Quality Awareness',
    courseDetail: 'ISO 9001:2015 Quality Awareness',
    seats: 20,
    amount: 340,
    pricePerSeat: 17,
    paidWith: 'KNET',
    status: 'paid',
    orderId: 'MQ-1018',
    poNumber: 'PO-2026-072',
    year: 2026,
  },
  {
    id: 'inv-1012',
    number: 'INV-1012',
    date: '28 Aug 2026',
    course: 'Digital Marketing Fundamentals',
    courseDetail: 'Digital Marketing Fundamentals',
    seats: 16,
    amount: 277,
    pricePerSeat: 17.3125,
    paidWith: 'Bank transfer',
    status: 'paid',
    orderId: 'MQ-1012',
    poNumber: 'PO-2026-061',
    year: 2026,
  },
]

export const organizationInvoiceDetailPage = {
  back: 'Back to invoices',
  print: 'Print',
  downloadPdf: 'Download PDF',
  payByKnet: 'Pay by KNET',
  invoiceLabel: 'Invoice',
  billedTo: 'Billed to',
  from: 'From',
  order: 'Order',
  issued: 'Issued',
  due: 'Due',
  currency: 'Currency',
  poNumber: 'PO',
  headers: ['Description', 'Seats', 'Price per seat', 'Amount (KWD)'],
  lineDetail: 'Course seats · 5 modules · 6 CPD hours',
  subtotal: 'Subtotal',
  totalDue: 'Total due',
  bankTitle: 'Pay by bank transfer',
  accountName: 'Account name',
  bank: 'Bank',
  iban: 'IBAN',
  reference: 'Reference',
  referenceHint: 'please include this',
  bankNote: 'Or pay instantly with KNET using the button above.',
  thanks: 'Thank you for training your team with MaqSkillz.',
  brandTagline: 'Corporate learning',
  fromName: 'MaqSkillz',
  fromAddress: 'Kuwait City, Kuwait',
  fromEmail: 'billing@maqskillz.com',
  bankDetails: {
    accountName: 'MaqSkillz',
    bank: 'Your bank name here',
    iban: 'KW00 XXXX 0000 0000 0000 0000 0000 00',
  },
  paidToast: 'Redirecting to KNET…',
  printToast: 'Opening print dialog…',
  notFound: 'Invoice not found.',
} as const

export function getOrganizationInvoice(invoiceId: string) {
  return organizationInvoices.find((item) => item.id === invoiceId)
}
