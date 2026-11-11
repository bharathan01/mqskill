/* Super Admin · Sales & Finance (Figma section 08) — sample data (Kuwait / GCC, KWD) */

export type SuperAdminSalesKpi = { id: string; label: string; value: string; detail: string }
export type SuperAdminSalesPoint = { label: string; value: number }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const superAdminSalesPageSize = 8
export const superAdminSalesToday = '2026-11-10'

/** "2026-11-12" → "12 Nov 2026" */
export function formatSalesDate(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d} ${MONTHS[Number(m) - 1] ?? m} ${y}`
}

/** KWD amount; money rows use 3 decimals, overview figures use 0. */
export function formatSalesKwd(value: number, decimals = 3) {
  return `KWD ${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

export const salesCourses = [
  'Fire Warden Training',
  'ISO 9001 Lead Auditor',
  'ISO 14001 Internal Auditor',
  'ISO 45001 Lead Auditor',
  'First Aid at Work',
  'NEBOSH IGC Preparation',
  'Working at Height',
  'Manual Handling',
  'Cybersecurity Awareness for Employees',
  'PMP Exam Preparation',
] as const

/* ----------------------------- Financial overview ---------------------------- */

export type SuperAdminRevenueTrend = 'Growing' | 'Stable' | 'Declining'

export type SuperAdminRevenueStream = {
  id: string
  stream: string
  gross: number
  refunds: number
  trend: SuperAdminRevenueTrend
}

/** Intentionally unsorted so the chart rises and falls. Gross 48,620 · refunds 1,184 · net 47,436. */
export const superAdminRevenueStreams: SuperAdminRevenueStream[] = [
  { id: 's1', stream: 'B2B seat sales', gross: 14860, refunds: 330, trend: 'Growing' },
  { id: 's2', stream: 'B2C course sales', gross: 18420, refunds: 410, trend: 'Growing' },
  { id: 's3', stream: 'Live class fees', gross: 3150, refunds: 96, trend: 'Stable' },
  { id: 's4', stream: 'Enterprise renewals', gross: 6240, refunds: 120, trend: 'Growing' },
  { id: 's5', stream: 'Certificate re-issue fees', gross: 1420, refunds: 40, trend: 'Declining' },
  { id: 's6', stream: 'Corporate bundles', gross: 2780, refunds: 88, trend: 'Stable' },
  { id: 's7', stream: 'Exam retake fees', gross: 1050, refunds: 60, trend: 'Declining' },
  { id: 's8', stream: 'Partner referrals', gross: 700, refunds: 40, trend: 'Growing' },
]

export const superAdminFinanceSubtitle = 'Gross to net, collections and revenue mix for the current period. Amounts in KWD.'
export const superAdminFinanceAov = 'KWD 37.9'
export const superAdminFinanceTip =
  'Net revenue is gross minus refunds. Gateway fees and tax are shown separately under Payment Gateways and Tax and Fees.'

/* ---------------------------------- Orders ---------------------------------- */

export type SuperAdminOrderStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'
export type SuperAdminOrderType = 'B2C' | 'B2B'
export const superAdminOrderMethods = ['KNET', 'Visa', 'Mastercard', 'Apple Pay', 'Bank transfer'] as const

export type SuperAdminOrder = {
  id: string
  customer: string
  type: SuperAdminOrderType
  total: number
  method: string
  date: string
  status: SuperAdminOrderStatus
}

const ord = (
  id: string,
  customer: string,
  type: SuperAdminOrderType,
  total: number,
  method: string,
  date: string,
  status: SuperAdminOrderStatus,
): SuperAdminOrder => ({ id, customer, type, total, method, date, status })

/** The default Order Detail sample (two line items, one partially refunded). */
export const superAdminPartialRefundOrderId = 'ORD-52340'

export const superAdminOrders: SuperAdminOrder[] = [
  ord('ORD-52340', 'ABC Corp', 'B2B', 1145, 'Bank transfer', '2026-11-09', 'Paid'),
  ord('ORD-52329', 'Fatima Al-Mutairi', 'B2C', 85, 'KNET', '2026-11-09', 'Paid'),
  ord('ORD-52318', 'Gulf Safety Training Co.', 'B2B', 2480, 'Visa', '2026-11-08', 'Pending'),
  ord('ORD-52307', 'Omar Al-Rashidi', 'B2C', 190, 'Apple Pay', '2026-11-08', 'Paid'),
  ord('ORD-52296', 'Noura Al-Sabah', 'B2C', 240, 'Mastercard', '2026-11-07', 'Failed'),
  ord('ORD-52285', 'Kuwait Oil Services', 'B2B', 4900, 'Bank transfer', '2026-11-06', 'Paid'),
  ord('ORD-52274', 'Yousef Al-Enezi', 'B2C', 120, 'KNET', '2026-11-05', 'Refunded'),
  ord('ORD-52263', 'Hessa Al-Kandari', 'B2C', 165, 'Visa', '2026-11-05', 'Paid'),
  ord('ORD-52252', 'Al-Ahli Logistics', 'B2B', 1850, 'KNET', '2026-11-04', 'Paid'),
  ord('ORD-52241', 'Mubarak Al-Dosari', 'B2C', 95, 'KNET', '2026-11-03', 'Pending'),
  ord('ORD-52230', 'Layla Hassan', 'B2C', 210, 'Apple Pay', '2026-11-02', 'Paid'),
  ord('ORD-52219', 'Pearl Hospitality Group', 'B2B', 3200, 'Visa', '2026-11-01', 'Paid'),
  ord('ORD-52208', 'Salem Al-Harbi', 'B2C', 85, 'Mastercard', '2026-10-30', 'Failed'),
  ord('ORD-52197', 'Dana Al-Sayegh', 'B2C', 190, 'KNET', '2026-10-29', 'Paid'),
  ord('ORD-52186', 'Bayan Construction', 'B2B', 5600, 'Bank transfer', '2026-10-27', 'Paid'),
  ord('ORD-52175', 'Rashed Al-Otaibi', 'B2C', 140, 'Visa', '2026-10-25', 'Paid'),
]

export type SuperAdminOrderLine = {
  id: string
  course: string
  qty: number
  unit: number
  discountPct: number
  fulfilment: 'Delivered' | 'Pending' | 'Refunded'
}

export type SuperAdminOrderDetail = {
  id: string
  customer: string
  email: string
  type: SuperAdminOrderType
  method: string
  date: string
  status: SuperAdminOrderStatus | 'Partially refunded'
  region: string
  taxRate: number
  refunded: number
  lines: SuperAdminOrderLine[]
}

const partialRefundDetail: SuperAdminOrderDetail = {
  id: superAdminPartialRefundOrderId,
  customer: 'ABC Corp',
  email: 'training@abccorp.com.kw',
  type: 'B2B',
  method: 'Bank transfer',
  date: '2026-11-09',
  status: 'Partially refunded',
  region: 'Kuwait',
  taxRate: 0,
  refunded: 380,
  lines: [
    { id: 'l1', course: 'Fire Warden Training', qty: 10, unit: 85, discountPct: 10, fulfilment: 'Delivered' },
    { id: 'l2', course: 'ISO 14001 Internal Auditor', qty: 2, unit: 190, discountPct: 0, fulfilment: 'Refunded' },
  ],
}

/** Full detail for the featured order, or a one-line detail derived from the list row. */
export function getSuperAdminOrderDetail(id: string | null): SuperAdminOrderDetail {
  if (!id || id === superAdminPartialRefundOrderId) return partialRefundDetail
  const row = superAdminOrders.find((order) => order.id === id)
  if (!row) return partialRefundDetail
  const index = superAdminOrders.indexOf(row)
  const course = salesCourses[index % salesCourses.length]
  const slug = row.customer.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')
  return {
    id: row.id,
    customer: row.customer,
    email: row.type === 'B2B' ? `finance@${slug.replace(/\./g, '')}.com.kw` : `${slug}@example.com`,
    type: row.type,
    method: row.method,
    date: row.date,
    status: row.status,
    region: 'Kuwait',
    taxRate: 0,
    refunded: row.status === 'Refunded' ? row.total : 0,
    lines: [
      {
        id: 'l1',
        course,
        qty: 1,
        unit: row.total,
        discountPct: 0,
        fulfilment: row.status === 'Refunded' ? 'Refunded' : row.status === 'Paid' ? 'Delivered' : 'Pending',
      },
    ],
  }
}

/* ------------------------------------ B2C ----------------------------------- */

export type SuperAdminB2cStatus = 'Paid' | 'Pending' | 'Refunded'

export type SuperAdminB2cSale = {
  id: string
  student: string
  course: string
  amount: number
  country: string
  date: string
  status: SuperAdminB2cStatus
}

const b2c = (
  id: string,
  student: string,
  course: string,
  amount: number,
  country: string,
  date: string,
  status: SuperAdminB2cStatus,
): SuperAdminB2cSale => ({ id, student, course, amount, country, date, status })

export const superAdminB2cSales: SuperAdminB2cSale[] = [
  b2c('ORD-52329', 'Fatima Al-Mutairi', 'Fire Warden Training', 85, 'Kuwait', '2026-11-09', 'Paid'),
  b2c('ORD-52307', 'Omar Al-Rashidi', 'ISO 14001 Internal Auditor', 190, 'Kuwait', '2026-11-08', 'Paid'),
  b2c('ORD-52263', 'Hessa Al-Kandari', 'First Aid at Work', 165, 'Saudi Arabia', '2026-11-05', 'Paid'),
  b2c('ORD-52241', 'Mubarak Al-Dosari', 'Manual Handling', 95, 'Kuwait', '2026-11-03', 'Pending'),
  b2c('ORD-52230', 'Layla Hassan', 'ISO 9001 Lead Auditor', 210, 'UAE', '2026-11-02', 'Paid'),
  b2c('ORD-52197', 'Dana Al-Sayegh', 'ISO 14001 Internal Auditor', 190, 'Kuwait', '2026-10-29', 'Paid'),
  b2c('ORD-52175', 'Rashed Al-Otaibi', 'Working at Height', 140, 'Bahrain', '2026-10-25', 'Paid'),
  b2c('ORD-52164', 'Maryam Al-Failakawi', 'NEBOSH IGC Preparation', 320, 'Kuwait', '2026-10-24', 'Paid'),
  b2c('ORD-52153', 'Khalid Al-Mansour', 'Cybersecurity Awareness for Employees', 75, 'Oman', '2026-10-22', 'Refunded'),
  b2c('ORD-52142', 'Sara Al-Qattan', 'Fire Warden Training', 85, 'Kuwait', '2026-10-21', 'Paid'),
  b2c('ORD-52131', 'Abdullah Al-Zayed', 'PMP Exam Preparation', 260, 'UAE', '2026-10-19', 'Pending'),
  b2c('ORD-52120', 'Reem Al-Ajmi', 'ISO 45001 Lead Auditor', 240, 'Kuwait', '2026-10-17', 'Paid'),
  b2c('ORD-52109', 'Talal Al-Hajri', 'First Aid at Work', 165, 'Saudi Arabia', '2026-10-15', 'Paid'),
  b2c('ORD-52098', 'Aisha Al-Kharafi', 'Manual Handling', 95, 'Kuwait', '2026-10-13', 'Paid'),
]

/** Weekly B2C revenue (KWD) — rises and falls. */
export const superAdminB2cWeekly: SuperAdminSalesPoint[] = [
  { label: 'W1', value: 5100 },
  { label: 'W2', value: 6850 },
  { label: 'W3', value: 5900 },
  { label: 'W4', value: 7420 },
  { label: 'W5', value: 6240 },
  { label: 'W6', value: 8120 },
]

/* ------------------------------------ B2B ----------------------------------- */

export type SuperAdminB2bStatus = 'Paid' | 'Invoiced' | 'Quote sent'

export type SuperAdminB2bSale = {
  id: string
  org: string
  course: string
  seats: number
  amount: number
  date: string
  status: SuperAdminB2bStatus
}

const b2b = (
  id: string,
  org: string,
  course: string,
  seats: number,
  amount: number,
  date: string,
  status: SuperAdminB2bStatus,
): SuperAdminB2bSale => ({ id, org, course, seats, amount, date, status })

export const superAdminB2bSales: SuperAdminB2bSale[] = [
  b2b('B2B-9142', 'ABC Corp', 'Fire Warden Training', 50, 3825, '2026-11-09', 'Paid'),
  b2b('B2B-9136', 'Kuwait Oil Services', 'ISO 45001 Lead Auditor', 100, 19680, '2026-11-06', 'Invoiced'),
  b2b('B2B-9130', 'Gulf Safety Training Co.', 'First Aid at Work', 25, 3380, '2026-11-05', 'Quote sent'),
  b2b('B2B-9124', 'Al-Ahli Logistics', 'Manual Handling', 200, 15580, '2026-11-04', 'Paid'),
  b2b('B2B-9118', 'Pearl Hospitality Group', 'Fire Warden Training', 100, 6970, '2026-11-01', 'Paid'),
  b2b('B2B-9112', 'Bayan Construction', 'Working at Height', 50, 5740, '2026-10-27', 'Invoiced'),
  b2b('B2B-9106', 'Zain Facilities', 'Cybersecurity Awareness for Employees', 20, 1230, '2026-10-24', 'Quote sent'),
  b2b('B2B-9100', 'ABC Corp', 'ISO 14001 Internal Auditor', 25, 3895, '2026-10-20', 'Paid'),
  b2b('B2B-9094', 'National Industries Group', 'NEBOSH IGC Preparation', 50, 13120, '2026-10-16', 'Paid'),
  b2b('B2B-9088', 'Gulf Safety Training Co.', 'ISO 9001 Lead Auditor', 25, 4305, '2026-10-12', 'Invoiced'),
]

/* -------------------------------- Revenue reports --------------------------- */

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

export const superAdminReportTypes = [
  'Monthly revenue statement',
  'Quarterly revenue by channel',
  'Revenue by country',
  'Revenue by course category',
  'B2B renewals forecast',
] as const
export const superAdminReportPeriods = ['Oct 2026', 'Q3 2026', 'YTD 2026', 'Last 30 days'] as const

const rep = (
  id: string,
  report: string,
  period: string,
  gross: number,
  net: number,
  generated: string,
  status: SuperAdminRevenueReportStatus,
): SuperAdminRevenueReport => ({ id, report, period, gross, net, generated, status })

export const superAdminRevenueReports: SuperAdminRevenueReport[] = [
  rep('rr1', 'Monthly revenue statement', 'Oct 2026', 48620, 47436, '2026-11-08', 'Ready'),
  rep('rr2', 'Quarterly revenue by channel', 'Q3 2026', 127260, 125124, '2026-11-02', 'Ready'),
  rep('rr3', 'Revenue by country', 'Oct 2026', 48620, 47436, '2026-11-06', 'Generating'),
  rep('rr4', 'Revenue by course category', 'YTD 2026', 412880, 404150, '2026-10-30', 'Ready'),
  rep('rr5', 'Refund impact report', 'Oct 2026', 1184, 0, '2026-10-28', 'Ready'),
  rep('rr6', 'Gateway settlement report', 'Sep 2026', 44900, 44304, '2026-10-05', 'Ready'),
  rep('rr7', 'B2B renewals forecast', 'Q4 2026', 38200, 38200, '2026-10-01', 'Ready'),
  rep('rr8', 'Revenue vs target', 'YTD 2026', 412880, 404150, '2026-09-28', 'Ready'),
]

export type SuperAdminMonthlyRevenue = { month: string; gross: number; net: number }

const monthly = (month: string, gross: number, refunds: number): SuperAdminMonthlyRevenue => ({
  month,
  gross,
  net: gross - refunds,
})

/** Jan–Oct 2026: gross KWD 412,880 · net KWD 404,150. Rises and falls month to month. */
export const superAdminMonthlyRevenue: SuperAdminMonthlyRevenue[] = [
  monthly('Jan', 36400, 1020),
  monthly('Feb', 33800, 760),
  monthly('Mar', 41200, 1100),
  monthly('Apr', 38100, 640),
  monthly('May', 44600, 1180),
  monthly('Jun', 39500, 720),
  monthly('Jul', 46300, 990),
  monthly('Aug', 40900, 540),
  monthly('Sep', 43460, 596),
  monthly('Oct', 48620, 1184),
]

/* ----------------------------------- Invoices -------------------------------- */

export type SuperAdminInvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft'
export type SuperAdminInvoiceType = 'Individual' | 'Organization'

export type SuperAdminSalesInvoice = {
  id: string
  customer: string
  type: SuperAdminInvoiceType
  amount: number
  issued: string
  due: string
  status: SuperAdminInvoiceStatus
}

const inv = (
  id: string,
  customer: string,
  type: SuperAdminInvoiceType,
  amount: number,
  issued: string,
  due: string,
  status: SuperAdminInvoiceStatus,
): SuperAdminSalesInvoice => ({ id, customer, type, amount, issued, due, status })

export const superAdminSalesInvoices: SuperAdminSalesInvoice[] = [
  inv('INV-71260', 'ABC Corp', 'Organization', 1145, '2026-11-09', '2026-11-23', 'Pending'),
  inv('INV-71255', 'Fatima Al-Mutairi', 'Individual', 85, '2026-11-09', '2026-11-09', 'Paid'),
  inv('INV-71250', 'Kuwait Oil Services', 'Organization', 19680, '2026-11-06', '2026-11-20', 'Pending'),
  inv('INV-71245', 'Gulf Safety Training Co.', 'Organization', 3380, '2026-10-20', '2026-11-03', 'Overdue'),
  inv('INV-71240', 'Omar Al-Rashidi', 'Individual', 190, '2026-11-08', '2026-11-08', 'Paid'),
  inv('INV-71235', 'Al-Ahli Logistics', 'Organization', 15580, '2026-11-04', '2026-11-18', 'Paid'),
  inv('INV-71230', 'Bayan Construction', 'Organization', 5740, '2026-10-27', '2026-11-10', 'Overdue'),
  inv('INV-71225', 'Hessa Al-Kandari', 'Individual', 165, '2026-11-05', '2026-11-05', 'Paid'),
  inv('INV-71220', 'Pearl Hospitality Group', 'Organization', 6970, '2026-11-01', '2026-11-15', 'Paid'),
  inv('INV-71215', 'Zain Facilities', 'Organization', 1230, '2026-11-10', '2026-11-24', 'Draft'),
  inv('INV-71210', 'Layla Hassan', 'Individual', 210, '2026-11-02', '2026-11-02', 'Paid'),
  inv('INV-71205', 'National Industries Group', 'Organization', 13120, '2026-10-16', '2026-10-30', 'Paid'),
]

/* ----------------------------------- Refunds --------------------------------- */

export type SuperAdminRefundStatus = 'Requested' | 'Approved' | 'Processed' | 'Rejected'
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

const rf = (
  id: string,
  order: string,
  customer: string,
  amount: number,
  reason: string,
  requested: string,
  status: SuperAdminRefundStatus,
): SuperAdminRefund => ({ id, order, customer, amount, reason, requested, status })

export const superAdminRefunds: SuperAdminRefund[] = [
  rf('RF-3112', 'ORD-52340', 'ABC Corp', 380, 'Employer cancelled', '2026-11-09', 'Processed'),
  rf('RF-3109', 'ORD-52274', 'Yousef Al-Enezi', 120, 'Duplicate purchase', '2026-11-08', 'Requested'),
  rf('RF-3106', 'ORD-52153', 'Khalid Al-Mansour', 75, 'Course not as described', '2026-11-07', 'Approved'),
  rf('RF-3103', 'ORD-52263', 'Hessa Al-Kandari', 165, 'Schedule conflict', '2026-11-05', 'Requested'),
  rf('RF-3100', 'ORD-52230', 'Layla Hassan', 210, 'Technical issue', '2026-11-03', 'Rejected'),
  rf('RF-3097', 'ORD-52197', 'Dana Al-Sayegh', 190, 'Duplicate purchase', '2026-11-01', 'Processed'),
  rf('RF-3094', 'ORD-52175', 'Rashed Al-Otaibi', 140, 'Schedule conflict', '2026-10-28', 'Processed'),
  rf('RF-3091', 'ORD-52142', 'Sara Al-Qattan', 85, 'Technical issue', '2026-10-25', 'Requested'),
  rf('RF-3088', 'ORD-52131', 'Abdullah Al-Zayed', 260, 'Course not as described', '2026-10-22', 'Approved'),
  rf('RF-3085', 'ORD-52120', 'Reem Al-Ajmi', 240, 'Employer cancelled', '2026-10-18', 'Processed'),
]

/* ----------------------------------- Coupons --------------------------------- */

export type SuperAdminCouponStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled'
export type SuperAdminCouponType = 'Percent' | 'Fixed (KWD)'

export type SuperAdminCoupon = {
  id: string
  code: string
  type: SuperAdminCouponType
  value: string
  used: number
  limit: number
  validUntil: string
  status: SuperAdminCouponStatus
}

const cpn = (
  code: string,
  type: SuperAdminCouponType,
  value: string,
  used: number,
  limit: number,
  validUntil: string,
  status: SuperAdminCouponStatus,
): SuperAdminCoupon => ({ id: code, code, type, value, used, limit, validUntil, status })

export const superAdminCoupons: SuperAdminCoupon[] = [
  cpn('WELCOME10', 'Percent', '10%', 186, 500, '2026-12-31', 'Active'),
  cpn('SAFETY20', 'Percent', '20%', 74, 250, '2026-12-15', 'Active'),
  cpn('ISOKUWAIT', 'Fixed (KWD)', 'KWD 15', 41, 100, '2027-01-31', 'Scheduled'),
  cpn('NATIONALDAY26', 'Percent', '25%', 250, 250, '2026-03-01', 'Expired'),
  cpn('ABC-TEAM15', 'Percent', '15%', 22, 100, '2026-12-01', 'Active'),
  cpn('RAMADAN25', 'Percent', '25%', 118, 250, '2026-04-30', 'Expired'),
  cpn('EARLYBIRD', 'Fixed (KWD)', 'KWD 15', 63, 100, '2026-11-30', 'Active'),
  cpn('HSE-BULK', 'Percent', '15%', 9, 100, '2026-12-20', 'Disabled'),
  cpn('PMPSTART', 'Percent', '10%', 35, 250, '2026-11-25', 'Active'),
  cpn('BACK2SKILL', 'Percent', '20%', 0, 500, '2027-02-15', 'Scheduled'),
]

/* ----------------------------------- Gateways -------------------------------- */

export type SuperAdminGatewayStatus = 'Live' | 'Test' | 'Disabled'

export type SuperAdminGateway = {
  id: string
  gateway: string
  fee: string
  transactions: number
  success: number
  settlement: string
  status: SuperAdminGatewayStatus
}

const gw = (
  id: string,
  gateway: string,
  fee: string,
  transactions: number,
  success: number,
  settlement: string,
  status: SuperAdminGatewayStatus,
): SuperAdminGateway => ({ id, gateway, fee, transactions, success, settlement, status })

export const superAdminGateways: SuperAdminGateway[] = [
  gw('g1', 'KNET', 'KWD 0.350', 612, 98.1, 'T+1', 'Live'),
  gw('g2', 'Visa / Mastercard (MyFatoorah)', '2.4%', 521, 96.4, 'T+2', 'Live'),
  gw('g3', 'Apple Pay', '2.4%', 342, 97.2, 'T+2', 'Live'),
  gw('g4', 'Tap Payments', '2.2%', 120, 94.6, 'T+3', 'Test'),
  gw('g5', 'Bank transfer', 'Free', 64, 100, 'Manual', 'Live'),
  gw('g6', 'Cash voucher', 'KWD 1.000', 0, 0, 'Manual', 'Disabled'),
]

/* ---------------------------------- Tax and fees ----------------------------- */

export type SuperAdminTaxStatus = 'Active' | 'Scheduled' | 'Disabled'

export type SuperAdminTaxRule = {
  id: string
  item: string
  region: string
  rate: string
  /** Percent value for charting; null for flat fees. */
  percent: number | null
  applies: string
  effective: string
  status: SuperAdminTaxStatus
}

const tax = (
  id: string,
  item: string,
  region: string,
  rate: string,
  percent: number | null,
  applies: string,
  effective: string,
  status: SuperAdminTaxStatus,
): SuperAdminTaxRule => ({ id, item, region, rate, percent, applies, effective, status })

export const superAdminTaxRules: SuperAdminTaxRule[] = [
  tax('t1', 'VAT — Saudi Arabia', 'Saudi Arabia', '15%', 15, 'B2C & B2B', '2026-01-01', 'Active'),
  tax('t2', 'VAT — UAE', 'UAE', '5%', 5, 'B2C & B2B', '2026-01-01', 'Active'),
  tax('t3', 'VAT — Bahrain', 'Bahrain', '10%', 10, 'B2C', '2026-01-01', 'Active'),
  tax('t4', 'VAT — Oman', 'Oman', '5%', 5, 'B2C', '2026-12-01', 'Scheduled'),
  tax('t5', 'Kuwait (no VAT)', 'Kuwait', '0%', 0, 'All orders', '2026-01-01', 'Active'),
  tax('t6', 'Platform service fee', 'All', '3%', 3, 'B2C', '2026-03-01', 'Active'),
  tax('t7', 'Gateway fee pass-through', 'All', '2.4%', 2.4, 'B2C', '2026-03-01', 'Disabled'),
  tax('t8', 'Certificate re-issue fee', 'All', 'KWD 2.000', null, 'Re-issue', '2026-05-01', 'Active'),
]

/* -------------------------------------- Costs -------------------------------- */

export type SuperAdminCostStatus = 'Costs entered' | 'Missing costs'

export type SuperAdminCostRecord = {
  id: string
  course: string
  revenue: number
  /** `null` = not entered. Missing costs are never treated as zero. */
  content: number | null
  instructor: number | null
  status: SuperAdminCostStatus
}

const cost = (
  id: string,
  course: string,
  revenue: number,
  content: number | null,
  instructor: number | null,
): SuperAdminCostRecord => ({
  id,
  course,
  revenue,
  content,
  instructor,
  status: content === null || instructor === null ? 'Missing costs' : 'Costs entered',
})

export const superAdminCostRecords: SuperAdminCostRecord[] = [
  cost('c1', 'Fire Warden Training', 31000, 4200, 3100),
  cost('c2', 'ISO 9001 Lead Auditor', 24800, 5200, 4800),
  cost('c3', 'ISO 14001 Internal Auditor', 18600, 3900, 3700),
  cost('c4', 'First Aid at Work', 15200, null, null),
  cost('c5', 'NEBOSH IGC Preparation', 22400, 6000, 4900),
  cost('c6', 'Working at Height', 12900, 2100, 2300),
  cost('c7', 'Manual Handling', 9800, null, null),
  cost('c8', 'Cybersecurity Awareness for Employees', 11300, 1600, 1900),
  cost('c9', 'ISO 45001 Lead Auditor', 20700, 4500, 4100),
  cost('c10', 'PMP Exam Preparation', 13600, null, null),
]

export const superAdminCostsNote =
  'Profitability isn’t shown until course cost records are entered, so missing costs aren’t counted as zero.'
export const superAdminCostsBaseEntered = 54
export const superAdminCostsTotalCourses = 128

/* ---------------------------------- Exports ---------------------------------- */

export type SuperAdminExportStatus = 'Ready' | 'Processing' | 'Expired'
export const superAdminExportDatasets = [
  'Orders ledger',
  'Invoices register',
  'Refunds register',
  'Gateway settlements',
  'B2B contracts',
  'Tax summary',
  'Coupon redemptions',
  'Revenue by course',
] as const
export const superAdminExportFormats = ['CSV', 'XLSX', 'PDF'] as const
export const superAdminExportRanges = ['Oct 2026', 'Q3 2026', 'YTD 2026', 'Last 30 days'] as const

export type SuperAdminFinancialExport = {
  id: string
  name: string
  format: string
  range: string
  by: string
  created: string
  protectedFile: boolean
  status: SuperAdminExportStatus
}

const exp = (
  id: string,
  name: string,
  format: string,
  range: string,
  by: string,
  created: string,
  protectedFile: boolean,
  status: SuperAdminExportStatus,
): SuperAdminFinancialExport => ({ id, name, format, range, by, created, protectedFile, status })

export const superAdminFinancialExports: SuperAdminFinancialExport[] = [
  exp('x1', 'Orders ledger', 'CSV', 'Oct 2026', 'Finance team', '2026-11-09', true, 'Ready'),
  exp('x2', 'Invoices register', 'XLSX', 'Q3 2026', 'Accountant', '2026-11-07', true, 'Ready'),
  exp('x3', 'Refunds register', 'PDF', 'Oct 2026', 'Super Admin', '2026-11-06', false, 'Processing'),
  exp('x4', 'Gateway settlements', 'CSV', 'Last 30 days', 'Finance team', '2026-11-04', false, 'Ready'),
  exp('x5', 'B2B contracts', 'XLSX', 'YTD 2026', 'Finance team', '2026-10-30', true, 'Ready'),
  exp('x6', 'Tax summary', 'PDF', 'Q3 2026', 'Accountant', '2026-10-12', false, 'Expired'),
  exp('x7', 'Coupon redemptions', 'CSV', 'Oct 2026', 'Super Admin', '2026-10-09', false, 'Ready'),
  exp('x8', 'Revenue by course', 'XLSX', 'YTD 2026', 'Finance team', '2026-09-30', false, 'Expired'),
]

export const superAdminExportsNote =
  'Exports containing personal data (customer names, emails, billing details) should be password-protected before sharing. Protection is simulated in this sample build.'
