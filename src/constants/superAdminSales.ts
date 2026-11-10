/* Super Admin · Sales & Finance (Figma section 08) — sample data (Kuwait / GCC, KWD) */

import { formatStudentDate, studentDaysAgo } from './superAdminStudents'

/* --------------------------------- Shared -------------------------------- */

export type SuperAdminSalesKpi = {
  id: string
  label: string
  value: string
  detail: string
  /** Colours the detail line (green up / red down). Omit for neutral. */
  tone?: 'up' | 'down'
}

export type SuperAdminSalesPoint = { label: string; value: number }

export type SuperAdminSalesTab<T extends string> = { id: 'all' | T; label: string }

export const superAdminSalesPageSize = 8

export const formatSalesDate = formatStudentDate

export function formatSalesKwd(value: number, decimals = 0) {
  return `KWD ${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

/** Missing values render as an em dash — never as zero. */
export function formatSalesKwdOrDash(value: number | null, decimals = 0) {
  return value === null ? '—' : formatSalesKwd(value, decimals)
}

const at = <T>(list: readonly T[], index: number): T => list[index % list.length] as T
const round3 = (value: number) => Math.round(value * 1000) / 1000

export const superAdminSalesCourses = [
  { name: 'ISO 9001 Lead Auditor', price: 49 },
  { name: 'ISO 14001 Internal Auditor', price: 45 },
  { name: 'Fire Warden Training', price: 28.5 },
  { name: 'First Aid at Work', price: 32 },
  { name: 'NEBOSH IGC Preparation', price: 120 },
  { name: 'Working at Height', price: 35 },
  { name: 'Manual Handling', price: 24.5 },
  { name: 'Cybersecurity Awareness for Employees', price: 30 },
  { name: 'ISO 45001 Lead Implementer', price: 58 },
] as const

const courseAt = (index: number) => at(superAdminSalesCourses, index)

export const superAdminSalesMethods = ['KNET', 'MyFatoorah', 'Apple Pay', 'Tap', 'Bank transfer'] as const

export const superAdminSalesMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] as const

/* ----------------------------- 08.01 Financial Overview ------------------ */

export const superAdminFinanceSubtitle =
  'Gross to net, collections and revenue mix. Amounts in KWD.'

export const superAdminFinanceKpis: SuperAdminSalesKpi[] = [
  { id: 'gross', label: 'Gross revenue', value: 'KWD 48,620', detail: '+12.4% vs Sep', tone: 'up' },
  { id: 'net', label: 'Net revenue', value: 'KWD 47,436', detail: '+12.8% vs Sep', tone: 'up' },
  { id: 'refunds', label: 'Refunds', value: 'KWD 1,184', detail: '−2.1% vs Sep', tone: 'up' },
  { id: 'aov', label: 'Avg. order value', value: 'KWD 37.9', detail: '+4.1% vs Sep', tone: 'up' },
]

/** Uneven on purpose — gross, refunds, and the B2C / B2B split per month. */
export const superAdminFinanceMonthly = [
  { month: 'Jan', b2c: 19200, b2b: 12220, refunds: 800 },
  { month: 'Feb', b2c: 21900, b2b: 7980, refunds: 1050 },
  { month: 'Mar', b2c: 20400, b2b: 16550, refunds: 940 },
  { month: 'Apr', b2c: 24600, b2b: 9610, refunds: 1320 },
  { month: 'May', b2c: 22400, b2b: 10900, refunds: 760 },
  { month: 'Jun', b2c: 23800, b2b: 16070, refunds: 1210 },
  { month: 'Jul', b2c: 20100, b2b: 16940, refunds: 1480 },
  { month: 'Aug', b2c: 26200, b2b: 16410, refunds: 990 },
  { month: 'Sep', b2c: 25980, b2b: 17270, refunds: 1210 },
  { month: 'Oct', b2c: 27310, b2b: 21310, refunds: 1184 },
] as const

export type SuperAdminFinanceChannel = 'B2C' | 'B2B'

export type SuperAdminRevenueStream = {
  id: string
  stream: string
  channel: SuperAdminFinanceChannel
  gross: number
  refunds: number
  trend: { dir: 'up' | 'down' | 'flat'; pct: number }
}

export const superAdminRevenueStreams: SuperAdminRevenueStream[] = [
  { id: 'rs-b2c', stream: 'B2C course sales', channel: 'B2C', gross: 24110, refunds: 760, trend: { dir: 'up', pct: 6.2 } },
  { id: 'rs-live', stream: 'Live class fees', channel: 'B2C', gross: 1900, refunds: 52, trend: { dir: 'up', pct: 11.8 } },
  { id: 'rs-retake', stream: 'Exam retake fees', channel: 'B2C', gross: 800, refunds: 28, trend: { dir: 'down', pct: 3.4 } },
  { id: 'rs-cert', stream: 'Certificate re-issue fees', channel: 'B2C', gross: 500, refunds: 12, trend: { dir: 'flat', pct: 0 } },
  { id: 'rs-b2b', stream: 'B2B seat sales', channel: 'B2B', gross: 15960, refunds: 218, trend: { dir: 'up', pct: 26.4 } },
  { id: 'rs-renew', stream: 'Enterprise renewals', channel: 'B2B', gross: 3850, refunds: 64, trend: { dir: 'up', pct: 9.1 } },
  { id: 'rs-bundle', stream: 'Corporate bundles', channel: 'B2B', gross: 1500, refunds: 50, trend: { dir: 'down', pct: 7.6 } },
]

export const superAdminFinanceStreamTabs: SuperAdminSalesTab<SuperAdminFinanceChannel>[] = [
  { id: 'all', label: 'All streams' },
  { id: 'B2C', label: 'B2C' },
  { id: 'B2B', label: 'B2B' },
]

export const superAdminFinanceNote =
  'Profitability isn’t shown: course cost records haven’t been entered yet, so costs aren’t counted as zero.'

/* ------------------------- 08.02 Orders and Transactions ----------------- */

export type SuperAdminSalesOrderStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'
export type SuperAdminSalesOrderType = 'B2C' | 'B2B'
export type SuperAdminSalesFulfilment = 'Delivered' | 'Pending' | 'Cancelled'

export type SuperAdminSalesOrderLine = {
  item: string
  qty: number
  unit: number
  /** Percent off the line (0–100). */
  discount: number
  fulfilment: SuperAdminSalesFulfilment
}

export type SuperAdminSalesOrder = {
  id: string
  customer: string
  email: string
  type: SuperAdminSalesOrderType
  country: string
  method: (typeof superAdminSalesMethods)[number]
  date: string
  paidOn: string | null
  reference: string
  status: SuperAdminSalesOrderStatus
  lines: SuperAdminSalesOrderLine[]
  refunded: number
}

export function salesLineTotal(line: SuperAdminSalesOrderLine) {
  return round3(line.unit * line.qty * (1 - line.discount / 100))
}

export function salesOrderTotal(order: Pick<SuperAdminSalesOrder, 'lines'>) {
  return round3(order.lines.reduce((total, line) => total + salesLineTotal(line), 0))
}

type LineSeed = readonly [course: number, qty: number, discount: number, fulfilment?: SuperAdminSalesFulfilment]
type OrderSeed = readonly [
  customer: string,
  type: SuperAdminSalesOrderType,
  country: string,
  method: (typeof superAdminSalesMethods)[number],
  daysAgo: number,
  status: SuperAdminSalesOrderStatus,
  lines: readonly LineSeed[],
  /** Partial refund amount (KWD) when the order is still Paid. */
  partialRefund?: number,
]

const orderSeeds: readonly OrderSeed[] = [
  ['Fatima Al-Sabah', 'B2C', 'Kuwait', 'KNET', 1, 'Paid', [[0, 1, 0]]],
  ['ABC Corp', 'B2B', 'Kuwait', 'Bank transfer', 2, 'Paid', [[2, 25, 15]]],
  ['Abdullah Al-Mutairi', 'B2C', 'Kuwait', 'MyFatoorah', 2, 'Pending', [[4, 1, 0]]],
  ['Noura Al-Enezi', 'B2C', 'Kuwait', 'KNET', 3, 'Paid', [[0, 1, 10], [3, 1, 0]], 32],
  ['Gulf Industrial Services', 'B2B', 'Saudi Arabia', 'Bank transfer', 4, 'Pending', [[1, 50, 10]]],
  ['Yousef Al-Rashidi', 'B2C', 'Kuwait', 'Apple Pay', 4, 'Failed', [[5, 1, 0]]],
  ['Maryam Al-Kandari', 'B2C', 'Kuwait', 'KNET', 5, 'Paid', [[8, 1, 0]]],
  ['Kuwait Safety Group', 'B2B', 'Kuwait', 'MyFatoorah', 6, 'Paid', [[3, 20, 0], [2, 20, 0, 'Pending']]],
  ['Khalid Al-Ajmi', 'B2C', 'UAE', 'Tap', 6, 'Refunded', [[6, 1, 0]]],
  ['Sara Al-Otaibi', 'B2C', 'Saudi Arabia', 'KNET', 7, 'Paid', [[7, 1, 0]]],
  ['Al-Mulla Logistics', 'B2B', 'Kuwait', 'Bank transfer', 8, 'Paid', [[5, 100, 18]]],
  ['Hamad Al-Dosari', 'B2C', 'Kuwait', 'MyFatoorah', 9, 'Failed', [[0, 1, 0]]],
  ['Dana Al-Failakawi', 'B2C', 'Kuwait', 'KNET', 10, 'Paid', [[4, 1, 10]]],
  ['Burgan Facilities', 'B2B', 'Kuwait', 'Bank transfer', 11, 'Pending', [[8, 30, 12]]],
  ['Omar Al-Harbi', 'B2C', 'Qatar', 'Apple Pay', 12, 'Paid', [[1, 1, 0]]],
  ['Layla Al-Khalifa', 'B2C', 'Bahrain', 'KNET', 13, 'Paid', [[2, 1, 0], [6, 1, 0]]],
  ['Zain Kuwait', 'B2B', 'Kuwait', 'MyFatoorah', 14, 'Paid', [[7, 200, 20]]],
  ['Salem Al-Mazrouei', 'B2C', 'UAE', 'Tap', 15, 'Pending', [[3, 1, 0]]],
  ['Aisha Al-Thani', 'B2C', 'Qatar', 'MyFatoorah', 17, 'Refunded', [[8, 1, 0]]],
  ['ABC Corp', 'B2B', 'Kuwait', 'Bank transfer', 19, 'Paid', [[0, 25, 12]]],
  ['Mohammed Al-Balushi', 'B2C', 'Oman', 'KNET', 21, 'Paid', [[5, 1, 0]]],
  ['Hessa Al-Qahtani', 'B2C', 'Saudi Arabia', 'Apple Pay', 22, 'Failed', [[4, 1, 0]]],
  ['KNPC', 'B2B', 'Kuwait', 'Bank transfer', 24, 'Paid', [[3, 60, 15]]],
  ['Rashed Al-Nuaimi', 'B2C', 'Kuwait', 'KNET', 26, 'Paid', [[0, 1, 0], [7, 1, 0]]],
]

const emailSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')

export const superAdminSalesOrders: SuperAdminSalesOrder[] = orderSeeds.map((seed, index) => {
  const [customer, type, country, method, daysAgo, status, lineSeeds, partialRefund] = seed
  const lines: SuperAdminSalesOrderLine[] = lineSeeds.map(([courseIndex, qty, discount, fulfilment]) => ({
    item: courseAt(courseIndex).name,
    qty,
    unit: courseAt(courseIndex).price,
    discount,
    fulfilment:
      fulfilment ?? (status === 'Paid' ? 'Delivered' : status === 'Pending' ? 'Pending' : 'Cancelled'),
  }))
  const total = salesOrderTotal({ lines })
  const date = studentDaysAgo(daysAgo)
  return {
    id: `ORD-${52300 + index * 11}`,
    customer,
    email: type === 'B2B' ? `accounts@${emailSlug(customer)}.com.kw` : `${emailSlug(customer)}@example.com`,
    type,
    country,
    method,
    date,
    paidOn: status === 'Paid' || status === 'Refunded' ? date : null,
    reference: `${method === 'Bank transfer' ? 'BT' : method.replace(/\s/g, '').slice(0, 4).toUpperCase()}-${7280000 + index * 931}`,
    status,
    lines,
    refunded: status === 'Refunded' ? total : (partialRefund ?? 0),
  }
})

export const superAdminOrdersSubtitle =
  'All paid, pending and failed orders across individuals and organizations.'

export const superAdminOrdersKpis: SuperAdminSalesKpi[] = [
  { id: 'paid', label: 'Paid orders (30d)', value: '1,284', detail: '+8.1% vs Sep', tone: 'up' },
  { id: 'pending', label: 'Pending', value: '41', detail: 'Awaiting payment' },
  { id: 'failed', label: 'Failed', value: '18', detail: 'Gateway declines' },
  { id: 'aov', label: 'Avg. order value', value: 'KWD 37.9', detail: '+4.1% vs Sep', tone: 'up' },
]

export const superAdminOrderTabs: SuperAdminSalesTab<SuperAdminSalesOrderStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Failed', label: 'Failed' },
  { id: 'Refunded', label: 'Refunded' },
]

export const superAdminOrdersTip =
  'Refund an order to return the money to the original payment method. KNET refunds usually land within 1–2 business days.'

export function findSalesOrder(id: string | null) {
  return superAdminSalesOrders.find((order) => order.id === id) ?? superAdminSalesOrders[0]
}

/* ---------------------------------- 08.03 B2C ---------------------------- */

export const superAdminB2cSubtitle = 'Direct purchases by individual learners.'

export const superAdminB2cKpis: SuperAdminSalesKpi[] = [
  { id: 'revenue', label: 'B2C revenue', value: 'KWD 27,310', detail: '+5.1% vs Sep', tone: 'up' },
  { id: 'orders', label: 'Orders', value: '812', detail: '+6.3% vs Sep', tone: 'up' },
  { id: 'country', label: 'Top country', value: 'Kuwait', detail: '58% of B2C revenue' },
]

export type SuperAdminB2cStatus = 'Paid' | 'Pending' | 'Refunded'

export const superAdminB2cTabs: SuperAdminSalesTab<SuperAdminB2cStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Refunded', label: 'Refunded' },
]

export type SuperAdminB2cSale = {
  id: string
  student: string
  course: string
  amount: number
  country: string
  date: string
  status: SuperAdminB2cStatus
}

/** Individual orders — failed attempts are not sales. */
export const superAdminB2cSales: SuperAdminB2cSale[] = superAdminSalesOrders
  .filter((order) => order.type === 'B2C' && order.status !== 'Failed')
  .map((order) => {
    const first = order.lines[0]?.item ?? 'Course'
    return {
      id: order.id,
      student: order.customer,
      course: order.lines.length > 1 ? `${first} + ${order.lines.length - 1} more` : first,
      amount: salesOrderTotal(order),
      country: order.country,
      date: order.date,
      status: order.status as SuperAdminB2cStatus,
    }
  })

export const superAdminB2cTip =
  'Individuals pay in KWD through KNET, cards or Apple Pay. Refunds return to the original payment method.'

/* ---------------------------------- 08.04 B2B ---------------------------- */

export const superAdminB2bSubtitle = 'Seat purchases and enterprise contracts.'

export const superAdminB2bKpis: SuperAdminSalesKpi[] = [
  { id: 'revenue', label: 'B2B revenue', value: 'KWD 21,310', detail: '+23.4% vs Sep', tone: 'up' },
  { id: 'seats', label: 'Seats sold', value: '2,540', detail: '+21.0% vs Sep', tone: 'up' },
  { id: 'deal', label: 'Avg. deal size', value: 'KWD 3,820', detail: 'Per paid contract' },
]

export type SuperAdminB2bStatus = 'Paid' | 'Invoiced' | 'Quote sent'

export const superAdminB2bTabs: SuperAdminSalesTab<SuperAdminB2bStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Invoiced', label: 'Invoiced' },
  { id: 'Quote sent', label: 'Quote sent' },
]

export type SuperAdminB2bDeal = {
  id: string
  org: string
  course: string
  seats: number
  amount: number
  date: string
  status: SuperAdminB2bStatus
}

type DealSeed = readonly [
  org: string,
  course: number,
  seats: number,
  discount: number,
  daysAgo: number,
  status: SuperAdminB2bStatus,
]

const dealSeeds: readonly DealSeed[] = [
  ['ABC Corp', 2, 25, 15, 2, 'Paid'],
  ['Gulf Industrial Services', 1, 50, 10, 4, 'Invoiced'],
  ['Kuwait Safety Group', 3, 20, 0, 6, 'Paid'],
  ['Al-Mulla Logistics', 5, 100, 18, 8, 'Paid'],
  ['Burgan Facilities', 8, 30, 12, 11, 'Quote sent'],
  ['Zain Kuwait', 7, 200, 20, 14, 'Paid'],
  ['ABC Corp', 0, 25, 12, 19, 'Paid'],
  ['KNPC', 3, 60, 15, 24, 'Invoiced'],
  ['Agility Logistics', 6, 40, 10, 28, 'Quote sent'],
  ['Kuwait Airways', 2, 120, 18, 33, 'Paid'],
  ['Gulf Bank', 7, 150, 22, 41, 'Paid'],
  ['Boubyan Petrochemicals', 0, 35, 8, 47, 'Quote sent'],
]

export const superAdminB2bDeals: SuperAdminB2bDeal[] = dealSeeds.map(
  ([org, courseIndex, seats, discount, daysAgo, status], index) => ({
    id: `B2B-${9100 + index * 6}`,
    org,
    course: courseAt(courseIndex).name,
    seats,
    amount: Math.round(courseAt(courseIndex).price * seats * (1 - discount / 100)),
    date: studentDaysAgo(daysAgo),
    status,
  }),
)

export const superAdminB2bTip =
  'Convert a quote to an invoice once the organization confirms seats. Seats are provisioned after payment.'

/* ----------------------------- 08.05 Revenue Reports --------------------- */

export const superAdminRevenueReportsSubtitle = 'Monthly and quarterly revenue statements.'

export const superAdminRevenueReportsKpis: SuperAdminSalesKpi[] = [
  { id: 'gross', label: 'YTD gross', value: 'KWD 412,880', detail: '+38% vs last year', tone: 'up' },
  { id: 'net', label: 'YTD net', value: 'KWD 404,150', detail: 'After refunds' },
  { id: 'reports', label: 'Reports generated', value: '37', detail: 'Last 12 months' },
]

export type SuperAdminRevenueReportStatus = 'Ready' | 'Generating'

export type SuperAdminRevenueReport = {
  id: string
  report: string
  period: string
  gross: number
  net: number
  generated: string
  status: SuperAdminRevenueReportStatus
}

export const superAdminRevenueReportTypes = [
  'Monthly revenue statement',
  'Quarterly revenue by channel',
  'Revenue by country',
  'Revenue by course category',
  'B2B renewals forecast',
  'Refund impact report',
  'Gateway settlement report',
  'Revenue vs target',
] as const

export const superAdminRevenueReportPeriods = ['Oct 2026', 'Q3 2026', 'YTD 2026'] as const

type ReportSeed = readonly [
  type: number,
  period: string,
  gross: number,
  net: number,
  daysAgo: number,
  status: SuperAdminRevenueReportStatus,
]

const reportSeeds: readonly ReportSeed[] = [
  [0, 'Oct 2026', 48620, 47436, 1, 'Ready'],
  [1, 'Q3 2026', 123100, 120780, 6, 'Ready'],
  [2, 'Oct 2026', 48620, 47436, 9, 'Generating'],
  [3, 'Sep 2026', 43250, 42040, 14, 'Ready'],
  [4, 'YTD 2026', 412880, 404150, 21, 'Ready'],
  [5, 'Q3 2026', 123100, 120780, 27, 'Ready'],
  [6, 'Sep 2026', 43250, 42040, 33, 'Ready'],
  [7, 'YTD 2026', 412880, 404150, 40, 'Ready'],
]

export const superAdminRevenueReports: SuperAdminRevenueReport[] = reportSeeds.map(
  ([type, period, gross, net, daysAgo, status], index) => ({
    id: `rep-${index + 1}`,
    report: at(superAdminRevenueReportTypes, type),
    period,
    gross,
    net,
    generated: studentDaysAgo(daysAgo),
    status,
  }),
)

export const superAdminRevenueReportsTip =
  'Reports are generated from settled orders only. Pending and failed payments are excluded.'

/* ----------------------------------- 08.06 Invoices ---------------------- */

export const superAdminInvoicesSubtitle = 'Customer invoices for individuals and organizations.'

export const superAdminInvoicesKpis: SuperAdminSalesKpi[] = [
  { id: 'issued', label: 'Issued (30d)', value: '1,402', detail: '+6.8% vs Sep', tone: 'up' },
  { id: 'outstanding', label: 'Outstanding', value: 'KWD 14,820', detail: 'Pending + overdue' },
  { id: 'overdue', label: 'Overdue', value: '3', detail: 'Past due date', tone: 'down' },
]

export type SuperAdminSalesInvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft'

export const superAdminInvoiceTabs: SuperAdminSalesTab<SuperAdminSalesInvoiceStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Overdue', label: 'Overdue' },
  { id: 'Draft', label: 'Draft' },
]

export type SuperAdminSalesInvoice = {
  id: string
  customer: string
  type: 'Individual' | 'Organization'
  amount: number
  issued: string
  due: string
  status: SuperAdminSalesInvoiceStatus
}

type InvoiceSeed = readonly [
  customer: string,
  type: 'Individual' | 'Organization',
  amount: number,
  issuedDaysAgo: number,
  status: SuperAdminSalesInvoiceStatus,
]

const invoiceSeeds: readonly InvoiceSeed[] = [
  ['ABC Corp', 'Organization', 605.625, 2, 'Paid'],
  ['Gulf Industrial Services', 'Organization', 1012.5, 4, 'Pending'],
  ['Fatima Al-Sabah', 'Individual', 49, 5, 'Paid'],
  ['Kuwait Safety Group', 'Organization', 1830, 6, 'Paid'],
  ['Burgan Facilities', 'Organization', 1531.2, 11, 'Draft'],
  ['Al-Mulla Logistics', 'Organization', 2870, 22, 'Overdue'],
  ['Noura Al-Enezi', 'Individual', 76.1, 9, 'Paid'],
  ['Zain Kuwait', 'Organization', 4800, 14, 'Paid'],
  ['KNPC', 'Organization', 3060, 38, 'Overdue'],
  ['Layla Al-Khalifa', 'Individual', 53, 13, 'Paid'],
  ['Agility Logistics', 'Organization', 882, 18, 'Pending'],
  ['Salem Al-Mazrouei', 'Individual', 32, 15, 'Pending'],
  ['Kuwait Airways', 'Organization', 2808, 33, 'Overdue'],
  ['Hamad Al-Dosari', 'Individual', 49, 9, 'Draft'],
  ['Gulf Bank', 'Organization', 3510, 41, 'Paid'],
  ['Dana Al-Failakawi', 'Individual', 108, 10, 'Paid'],
]

export const superAdminSalesInvoices: SuperAdminSalesInvoice[] = invoiceSeeds.map(
  ([customer, type, amount, daysAgo, status], index) => {
    const issued = studentDaysAgo(daysAgo)
    const due = studentDaysAgo(daysAgo - (type === 'Organization' ? 30 : 7))
    return { id: `INV-${71200 + index * 5}`, customer, type, amount, issued, due, status }
  },
)

export const superAdminInvoicesTip =
  'Send a reminder for overdue invoices. Organizations on net-30 terms are marked overdue the day after the due date.'

/* ----------------------------------- 08.07 Refunds ----------------------- */

export const superAdminRefundsSubtitle = 'Refund requests awaiting review and processed refunds.'

export const superAdminRefundsKpis: SuperAdminSalesKpi[] = [
  { id: 'amount', label: 'Refunds (30d)', value: 'KWD 1,184', detail: '−2.1% vs Sep', tone: 'up' },
  { id: 'rate', label: 'Refund rate', value: '2.4%', detail: 'Of paid orders' },
  { id: 'awaiting', label: 'Awaiting review', value: '3', detail: 'Requested, not decided' },
]

export type SuperAdminRefundStatus = 'Requested' | 'Approved' | 'Processed' | 'Rejected'

export const superAdminRefundTabs: SuperAdminSalesTab<SuperAdminRefundStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Requested', label: 'Requested' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Processed', label: 'Processed' },
  { id: 'Rejected', label: 'Rejected' },
]

export const superAdminRefundReasons = [
  'Duplicate purchase',
  'Course not as described',
  'Technical issue',
  'Schedule conflict',
  'Employer cancelled',
] as const

export type SuperAdminRefund = {
  id: string
  order: string
  customer: string
  amount: number
  reason: string
  requested: string
  status: SuperAdminRefundStatus
}

type RefundSeed = readonly [
  order: number,
  amount: number,
  reason: number,
  daysAgo: number,
  status: SuperAdminRefundStatus,
]

const refundSeeds: readonly RefundSeed[] = [
  [3, 32, 0, 1, 'Requested'],
  [8, 24.5, 1, 2, 'Processed'],
  [18, 58, 3, 3, 'Requested'],
  [0, 49, 0, 4, 'Requested'],
  [6, 58, 2, 6, 'Approved'],
  [12, 108, 1, 8, 'Rejected'],
  [14, 45, 3, 12, 'Processed'],
  [9, 30, 2, 15, 'Processed'],
  [1, 150, 4, 18, 'Approved'],
  [15, 28.5, 0, 21, 'Processed'],
]

export const superAdminRefunds: SuperAdminRefund[] = refundSeeds.map(
  ([orderIndex, amount, reason, daysAgo, status], index) => {
    const order = at(superAdminSalesOrders, orderIndex)
    return {
      id: `RF-${3100 + index * 3}`,
      order: order.id,
      customer: order.customer,
      amount,
      reason: at(superAdminRefundReasons, reason),
      requested: studentDaysAgo(daysAgo),
      status,
    }
  },
)

export const superAdminRefundsTip =
  'Approved refunds are returned to the original payment method. Mark a refund processed once the gateway confirms it.'

/* ----------------------------------- 08.08 Coupons ----------------------- */

export const superAdminCouponsSubtitle = 'Promotional codes for individuals and organizations.'

export const superAdminCouponsKpis: SuperAdminSalesKpi[] = [
  { id: 'active', label: 'Active coupons', value: '5', detail: 'Redeemable today' },
  { id: 'redemptions', label: 'Redemptions (30d)', value: '318', detail: '+14% vs Sep', tone: 'up' },
  { id: 'given', label: 'Discount given', value: 'KWD 2,140', detail: '4.4% of gross revenue' },
]

export type SuperAdminCouponStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled'

export const superAdminCouponTabs: SuperAdminSalesTab<SuperAdminCouponStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Active', label: 'Active' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'Expired', label: 'Expired' },
  { id: 'Disabled', label: 'Disabled' },
]

export type SuperAdminCoupon = {
  id: string
  code: string
  type: 'Percent' | 'Fixed (KWD)'
  value: string
  used: number
  limit: number
  validUntil: string
  status: SuperAdminCouponStatus
}

type CouponSeed = readonly [
  code: string,
  type: 'Percent' | 'Fixed (KWD)',
  value: string,
  used: number,
  limit: number,
  validDays: number,
  status: SuperAdminCouponStatus,
]

const couponSeeds: readonly CouponSeed[] = [
  ['WELCOME10', 'Percent', '10%', 186, 500, -45, 'Active'],
  ['SAFETY20', 'Percent', '20%', 74, 250, -21, 'Active'],
  ['ISOKUWAIT', 'Percent', '15%', 41, 100, -30, 'Active'],
  ['NATIONALDAY26', 'Percent', '25%', 0, 500, -60, 'Scheduled'],
  ['ABC-TEAM15', 'Percent', '15%', 25, 25, -10, 'Active'],
  ['RAMADAN25', 'Percent', '25%', 212, 250, 220, 'Expired'],
  ['EARLYBIRD', 'Fixed (KWD)', 'KWD 15', 96, 100, 40, 'Expired'],
  ['HSE-BULK', 'Percent', '20%', 18, 100, -90, 'Active'],
  ['PMPSTART', 'Fixed (KWD)', 'KWD 10', 33, 250, -14, 'Disabled'],
  ['BACK2SKILL', 'Percent', '10%', 7, 500, -75, 'Scheduled'],
]

export const superAdminCoupons: SuperAdminCoupon[] = couponSeeds.map(
  ([code, type, value, used, limit, validDays, status], index) => ({
    id: `cp-${index + 1}`,
    code,
    type,
    value,
    used,
    limit,
    validUntil: studentDaysAgo(validDays),
    status,
  }),
)

export const superAdminCouponsTip =
  'Disabled codes stop working at checkout immediately. Existing orders that used the code are not affected.'

/* ------------------------------ 08.09 Payment Gateways ------------------- */

export const superAdminGatewaysSubtitle = 'Gateway performance, fees and settlement times.'

export const superAdminGatewaysKpis: SuperAdminSalesKpi[] = [
  { id: 'success', label: 'Success rate', value: '96.8%', detail: '+0.4% vs Sep', tone: 'up' },
  { id: 'fees', label: 'Fees (30d)', value: 'KWD 1,046', detail: '2.2% of gross revenue' },
  { id: 'settlement', label: 'Avg. settlement', value: 'T+2', detail: 'Business days' },
]

export type SuperAdminGatewayStatus = 'Live' | 'Test' | 'Disabled'

export const superAdminGatewayTabs: SuperAdminSalesTab<SuperAdminGatewayStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Live', label: 'Live' },
  { id: 'Test', label: 'Test' },
  { id: 'Disabled', label: 'Disabled' },
]

export type SuperAdminSalesGateway = {
  id: string
  gateway: string
  methods: string
  fee: string
  transactions: number
  success: number
  settlement: string
  status: SuperAdminGatewayStatus
}

export const superAdminSalesGateways: SuperAdminSalesGateway[] = [
  { id: 'gw-knet', gateway: 'KNET', methods: 'Kuwaiti debit cards', fee: 'KWD 0.350', transactions: 612, success: 98.1, settlement: 'T+1', status: 'Live' },
  { id: 'gw-mf', gateway: 'MyFatoorah', methods: 'Visa, Mastercard, Mada', fee: '2.4%', transactions: 438, success: 95.4, settlement: 'T+2', status: 'Live' },
  { id: 'gw-apple', gateway: 'Apple Pay', methods: 'Wallet via MyFatoorah', fee: '2.4%', transactions: 164, success: 97.6, settlement: 'T+2', status: 'Live' },
  { id: 'gw-tap', gateway: 'Tap Payments', methods: 'Cards, Benefit, Fawry', fee: '2.2%', transactions: 52, success: 92.3, settlement: 'T+3', status: 'Test' },
  { id: 'gw-bank', gateway: 'Bank transfer', methods: 'Manual reconciliation', fee: 'Free', transactions: 86, success: 100, settlement: 'Manual', status: 'Live' },
]

export const superAdminGatewaysTip =
  'Gateways in Test mode accept sandbox payments only. Go live once settlement details are verified.'

/* ----------------------------------- 08.10 Tax and Fees ------------------ */

export const superAdminTaxFeesSubtitle = 'Tax rates and platform fees applied at checkout by region.'

export const superAdminTaxFeesKpis: SuperAdminSalesKpi[] = [
  { id: 'tax', label: 'Tax collected (30d)', value: 'KWD 3,820', detail: 'GCC VAT, non-Kuwait orders' },
  { id: 'regions', label: 'Regions configured', value: '6', detail: 'Kuwait + 5 GCC markets' },
  { id: 'waived', label: 'Fees waived', value: '12', detail: 'Manual overrides' },
]

export type SuperAdminTaxKind = 'Tax' | 'Fee'
export type SuperAdminTaxStatus = 'Active' | 'Scheduled' | 'Disabled'

export const superAdminTaxTabs: SuperAdminSalesTab<SuperAdminTaxKind>[] = [
  { id: 'all', label: 'All' },
  { id: 'Tax', label: 'VAT rules' },
  { id: 'Fee', label: 'Platform fees' },
]

export type SuperAdminTaxRule = {
  id: string
  item: string
  kind: SuperAdminTaxKind
  region: string
  rate: string
  applies: string
  effective: string
  status: SuperAdminTaxStatus
}

type TaxSeed = readonly [
  item: string,
  kind: SuperAdminTaxKind,
  region: string,
  rate: string,
  applies: string,
  effectiveDays: number,
  status: SuperAdminTaxStatus,
]

const taxSeeds: readonly TaxSeed[] = [
  ['VAT — Saudi Arabia', 'Tax', 'Saudi Arabia', '15%', 'B2C & B2B', 620, 'Active'],
  ['VAT — UAE', 'Tax', 'UAE', '5%', 'B2C & B2B', 410, 'Active'],
  ['VAT — Bahrain', 'Tax', 'Bahrain', '10%', 'B2C', 330, 'Active'],
  ['VAT — Oman', 'Tax', 'Oman', '5%', 'B2C', 210, 'Active'],
  ['Kuwait (no VAT)', 'Tax', 'Kuwait', '0%', 'All orders', 900, 'Active'],
  ['VAT — Qatar', 'Tax', 'Qatar', '0%', 'B2C', -30, 'Scheduled'],
  ['Platform service fee', 'Fee', 'All', '3%', 'B2C', 180, 'Active'],
  ['Gateway fee pass-through', 'Fee', 'All', '2.4%', 'B2C', 150, 'Disabled'],
  ['Certificate re-issue fee', 'Fee', 'All', 'KWD 2', 'Re-issue', 120, 'Active'],
]

export const superAdminTaxRules: SuperAdminTaxRule[] = taxSeeds.map(
  ([item, kind, region, rate, applies, effectiveDays, status], index) => ({
    id: `tx-${index + 1}`,
    item,
    kind,
    region,
    rate,
    applies,
    effective: studentDaysAgo(effectiveDays),
    status,
  }),
)

export const superAdminTaxFeesTip =
  'Kuwait does not charge VAT. GCC VAT is applied by the buyer’s billing country at checkout.'

/* --------------------------- 08.11 Costs and Profitability --------------- */

export const superAdminCostsSubtitle =
  'Course-level cost records and margins. Missing costs are not treated as zero.'

export const superAdminCostsKpis: SuperAdminSalesKpi[] = [
  { id: 'covered', label: 'Courses with costs', value: '54 / 128', detail: '42% of catalogue' },
  { id: 'margin', label: 'Avg. margin', value: '61%', detail: 'Only courses with costs' },
  { id: 'missing', label: 'Missing costs', value: '3', detail: 'Shown as — until entered', tone: 'down' },
]

export const superAdminCostsNote =
  'Profitability isn’t shown: course cost records haven’t been entered yet, so costs aren’t counted as zero.'

export type SuperAdminCostStatus = 'Costs entered' | 'Missing costs'

export const superAdminCostTabs: SuperAdminSalesTab<SuperAdminCostStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Costs entered', label: 'Costs entered' },
  { id: 'Missing costs', label: 'Missing costs' },
]

export type SuperAdminCostRecord = {
  id: string
  course: string
  revenue: number
  /** `null` = not entered. Never rendered as zero. */
  content: number | null
  instructor: number | null
  status: SuperAdminCostStatus
}

type CostSeed = readonly [course: number, revenue: number, content: number | null, instructor: number | null]

const costSeeds: readonly CostSeed[] = [
  [0, 28400, 3200, 4100],
  [1, 19650, 2400, 3300],
  [2, 12080, null, null],
  [3, 15230, 1800, 2500],
  [4, 31000, 6000, 5000],
  [5, 9420, null, null],
  [6, 6180, 900, 1200],
  [7, 11340, 1500, 1900],
  [8, 22750, 3800, 4400],
  [2, 8720, null, null],
]

export const superAdminCostRecords: SuperAdminCostRecord[] = costSeeds.map(
  ([courseIndex, revenue, content, instructor], index) => ({
    id: `cost-${index + 1}`,
    course: courseAt(courseIndex).name + (index >= 9 ? ' (Arabic)' : ''),
    revenue,
    content,
    instructor,
    status: content === null || instructor === null ? 'Missing costs' : 'Costs entered',
  }),
)

/** Margin % — `null` while any cost is missing. */
export function costMargin(record: Pick<SuperAdminCostRecord, 'revenue' | 'content' | 'instructor'>) {
  if (record.content === null || record.instructor === null) return null
  return Math.round(((record.revenue - record.content - record.instructor) / record.revenue) * 100)
}

/* ----------------------------- 08.12 Financial Exports ------------------- */

export const superAdminExportsSubtitle = 'CSV, Excel and PDF exports for accounting.'

export const superAdminExportsKpis: SuperAdminSalesKpi[] = [
  { id: 'exports', label: 'Exports (30d)', value: '31', detail: 'Across all formats' },
  { id: 'scheduled', label: 'Scheduled', value: '4', detail: 'Weekly and monthly' },
  { id: 'ready', label: 'Ready', value: '5', detail: 'Available to download' },
]

export type SuperAdminExportStatus = 'Ready' | 'Processing' | 'Expired'
export type SuperAdminExportFormat = 'CSV' | 'XLSX' | 'PDF'

export const superAdminExportTabs: SuperAdminSalesTab<SuperAdminExportStatus>[] = [
  { id: 'all', label: 'All' },
  { id: 'Ready', label: 'Ready' },
  { id: 'Processing', label: 'Processing' },
  { id: 'Expired', label: 'Expired' },
]

export const superAdminExportNames = [
  'Orders ledger',
  'Invoices register',
  'Refunds register',
  'Gateway settlements',
  'B2B contracts',
  'Tax summary',
  'Coupon redemptions',
  'Revenue by course',
] as const

export const superAdminExportFormats: SuperAdminExportFormat[] = ['CSV', 'XLSX', 'PDF']

export const superAdminExportRanges = ['Oct 2026', 'Q3 2026', 'YTD 2026', 'Last 30 days'] as const

export type SuperAdminFinancialExport = {
  id: string
  name: string
  format: SuperAdminExportFormat
  range: string
  by: string
  created: string
  status: SuperAdminExportStatus
}

type ExportSeed = readonly [
  name: number,
  format: SuperAdminExportFormat,
  range: number,
  by: string,
  daysAgo: number,
  status: SuperAdminExportStatus,
]

const exportSeeds: readonly ExportSeed[] = [
  [0, 'CSV', 0, 'Finance team', 1, 'Ready'],
  [1, 'XLSX', 1, 'Super Admin', 2, 'Ready'],
  [2, 'CSV', 3, 'Accountant', 3, 'Processing'],
  [3, 'PDF', 0, 'Finance team', 6, 'Ready'],
  [4, 'XLSX', 2, 'Super Admin', 9, 'Ready'],
  [5, 'PDF', 1, 'Accountant', 14, 'Ready'],
  [6, 'CSV', 3, 'Finance team', 38, 'Expired'],
  [7, 'XLSX', 2, 'Super Admin', 45, 'Expired'],
]

export const superAdminFinancialExports: SuperAdminFinancialExport[] = exportSeeds.map(
  ([name, format, range, by, daysAgo, status], index) => ({
    id: `exp-${index + 1}`,
    name: at(superAdminExportNames, name),
    format,
    range: at(superAdminExportRanges, range),
    by,
    created: studentDaysAgo(daysAgo),
    status,
  }),
)

export const superAdminExportsTip =
  'Exports stay available for 30 days. Re-run an expired export to generate a fresh file.'
