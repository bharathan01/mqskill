import { useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import {
  formatSalesDate,
  formatSalesKwd,
  getSuperAdminOrderDetail,
  superAdminRefundReasons,
  type SuperAdminOrderDetail,
  type SuperAdminOrderLine,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { MoneyCell, SalesPageHeader, theadRowClass, thClass, trClass } from './salesShared'

const lineTotal = (line: SuperAdminOrderLine) => line.qty * line.unit * (1 - line.discountPct / 100)

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-navy">{children}</dd>
    </div>
  )
}

function TotalRow({ label, value, strong, negative }: { label: string; value: number; strong?: boolean; negative?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 text-sm ${strong ? 'border-t border-slate-100 pt-3' : ''}`}>
      <span className={strong ? 'font-bold text-navy' : 'text-slate-500'}>{label}</span>
      <span className={`tabular-nums ${strong ? 'text-base font-bold text-navy' : negative ? 'font-semibold text-rose-600' : 'font-semibold text-navy'}`}>
        {negative && value > 0 ? '−' : ''}
        {formatSalesKwd(value)}
      </span>
    </div>
  )
}

function OrderDetailView({ initial }: { initial: SuperAdminOrderDetail }) {
  const [refunded, setRefunded] = useState(initial.refunded)
  const [baseStatus, setBaseStatus] = useState(initial.status)
  const [lines, setLines] = useState(initial.lines)
  const [amount, setAmount] = useState('100.000')
  const [reason, setReason] = useState<string>(superAdminRefundReasons[4])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.qty * line.unit, 0)
    const discount = lines.reduce((sum, line) => sum + line.qty * line.unit * (line.discountPct / 100), 0)
    const tax = (subtotal - discount) * (initial.taxRate / 100)
    const total = subtotal - discount + tax
    return { subtotal, discount, tax, total }
  }, [initial.taxRate, lines])

  const refundable = baseStatus === 'Paid' || baseStatus === 'Partially refunded'
  const remaining = Math.max(0, totals.total - refunded)
  const status =
    baseStatus === 'Paid' || baseStatus === 'Partially refunded'
      ? refunded >= totals.total
        ? 'Refunded'
        : refunded > 0
          ? 'Partially refunded'
          : 'Paid'
      : baseStatus

  const issueRefund = () => {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return setError('Enter a refund amount greater than zero.')
    if (value > remaining + 0.0005) return setError(`Refund can’t exceed the remaining ${formatSalesKwd(remaining)}.`)
    const next = Math.min(totals.total, refunded + value)
    setError(null)
    setRefunded(next)
    if (next >= totals.total) {
      setBaseStatus('Refunded')
      setLines((current) => current.map((line) => ({ ...line, fulfilment: 'Refunded' })))
    }
    setNotice(`Partial refund of ${formatSalesKwd(value)} issued for ${initial.id} — ${reason} (sample).`)
    setAmount(Math.min(100, Math.max(0, totals.total - next)).toFixed(3))
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Order Detail"
        subtitle={`Order ${initial.id} · line items, totals and refunds for a single order.`}
        actions={
          <>
            <Link to={paths.admin.orders} className={btnOutline}>
              ← Back to Orders
            </Link>
            <button type="button" onClick={() => setNotice(`Receipt for ${initial.id} sent to ${initial.email} (sample).`)} className={btnOutline}>
              Send receipt
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <section className={`${cardClass} p-5`}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-navy">{initial.id}</h2>
              <StatusBadge value={status} />
            </div>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="Customer">{initial.customer}</InfoItem>
              <InfoItem label="Email">{initial.email}</InfoItem>
              <InfoItem label="Type">{initial.type}</InfoItem>
              <InfoItem label="Date">{formatSalesDate(initial.date)}</InfoItem>
              <InfoItem label="Payment method">{initial.method}</InfoItem>
              <InfoItem label="Billing region">{initial.region}</InfoItem>
            </dl>
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-navy">Line items</h2>
              <p className="mt-0.5 text-sm text-slate-500">{lines.length} items on this order</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className={theadRowClass}>
                    <th className="px-4 py-2.5 font-semibold">Course</th>
                    <th className={`${thClass} text-right`}>Qty</th>
                    <th className={`${thClass} text-right`}>Unit price</th>
                    <th className={`${thClass} text-right`}>Discount</th>
                    <th className={`${thClass} text-right`}>Line total</th>
                    <th className={thClass}>Fulfilment</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.id} className={trClass}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-navy">{line.course}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{line.qty}</td>
                      <td className="px-3 py-3.5 text-right">
                        <MoneyCell value={line.unit} bold={false} />
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{line.discountPct}%</td>
                      <td className="px-3 py-3.5 text-right">
                        <MoneyCell value={lineTotal(line)} />
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge value={line.fulfilment} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Totals</h2>
            <div className="mt-4 space-y-3">
              <TotalRow label="Subtotal" value={totals.subtotal} />
              <TotalRow label="Discount" value={totals.discount} negative />
              <TotalRow label={`Tax (${initial.taxRate}% · ${initial.region})`} value={totals.tax} />
              <TotalRow label="Order total" value={totals.total} />
              <TotalRow label="Partial refund" value={refunded} negative />
              <TotalRow label="Amount paid (net)" value={totals.total - refunded} strong />
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Issue partial refund</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {refundable ? `${formatSalesKwd(remaining)} still refundable.` : `Refunds aren’t available while the order is ${status}.`}
            </p>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-semibold text-navy">
                Amount (KWD)
                <ContentTextInput
                  inputMode="decimal"
                  value={amount}
                  disabled={!refundable || remaining <= 0}
                  invalid={!!error}
                  onChange={(event) => setAmount(event.target.value)}
                  className="mt-1.5"
                />
              </label>
              <label className="block text-sm font-semibold text-navy">
                Reason
                <ContentSelect
                  value={reason}
                  disabled={!refundable || remaining <= 0}
                  onChange={(event) => setReason(event.target.value)}
                  className="mt-1.5"
                >
                  {superAdminRefundReasons.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </ContentSelect>
              </label>
              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
              <button type="button" onClick={issueRefund} disabled={!refundable || remaining <= 0} className={`${btnPrimary} w-full`}>
                Issue partial refund
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export function AdminOrderDetailPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const detail = useMemo(() => getSuperAdminOrderDetail(orderId), [orderId])
  return <OrderDetailView key={detail.id} initial={detail} />
}
