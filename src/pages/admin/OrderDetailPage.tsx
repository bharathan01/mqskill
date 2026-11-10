import { useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  findSalesOrder,
  formatSalesDate,
  formatSalesKwd,
  salesLineTotal,
  salesOrderTotal,
  superAdminSalesOrders,
  type SuperAdminSalesOrder,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { SalesKpiGrid, SalesPageHeader, SalesSideCard, linkAction, theadRowClass, thClass, trClass } from './salesShared'

const round3 = (value: number) => Math.round(value * 1000) / 1000

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-navy">{children}</dd>
    </div>
  )
}

export function AdminOrderDetailPage() {
  const [params, setParams] = useSearchParams()
  const base = findSalesOrder(params.get('order'))
  const [overrides, setOverrides] = useState<Record<string, SuperAdminSalesOrder>>({})
  const [notice, setNotice] = useState<string | null>(null)

  const order = overrides[base?.id ?? ''] ?? base
  if (!order) return null

  const total = salesOrderTotal(order)
  const refundable = round3(total - order.refunded)
  const pendingLines = order.lines.filter((line) => line.fulfilment === 'Pending').length
  const partial = order.refunded > 0 && refundable > 0
  const subtotal = round3(order.lines.reduce((sum, line) => sum + line.unit * line.qty, 0))
  const discountTotal = round3(subtotal - total)

  const save = (next: SuperAdminSalesOrder, message: string) => {
    setOverrides((current) => ({ ...current, [next.id]: next }))
    setNotice(message)
  }

  const refund = (amount: number) => {
    const refunded = round3(order.refunded + amount)
    const full = refunded >= total
    save(
      { ...order, refunded, status: full ? 'Refunded' : order.status },
      `${formatSalesKwd(amount, 3)} refunded on ${order.id} to ${order.customer} (sample).`,
    )
  }

  const markDelivered = (index?: number) => {
    const lines = order.lines.map((line, i) =>
      line.fulfilment === 'Pending' && (index === undefined || index === i) ? { ...line, fulfilment: 'Delivered' as const } : line,
    )
    save({ ...order, lines }, index === undefined ? `All pending lines on ${order.id} marked delivered (sample).` : `Line marked delivered on ${order.id} (sample).`)
  }

  const statusLabel = partial ? 'Paid · partially refunded' : order.status

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Order Detail"
        subtitle="Line items, discounts and fulfilment for each order."
        actions={
          <>
            <Link to={paths.admin.orders} className={btnOutline}>
              Back to orders
            </Link>
            <button
              type="button"
              disabled={pendingLines === 0 || order.status !== 'Paid'}
              onClick={() => markDelivered()}
              className={btnOutline}
            >
              Mark delivered
            </button>
            <button
              type="button"
              disabled={refundable <= 0 || order.status !== 'Paid'}
              onClick={() => refund(refundable)}
              className={btnPrimary}
            >
              Refund order
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className={`${cardClass} flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-bold text-navy">{order.id}</h2>
            <StatusBadge value={order.status} />
            {partial ? <StatusBadge value="Partially refunded" /> : null}
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {order.customer} · {order.type === 'B2B' ? 'Organization' : 'Individual'} · {order.email}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Order
            <ContentSelect
              aria-label="Switch order"
              value={order.id}
              onChange={(event) => setParams({ order: event.target.value })}
              className="!h-10 min-w-[10rem]"
            >
              {superAdminSalesOrders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.customer}
                </option>
              ))}
            </ContentSelect>
          </label>
        </div>
      </section>

      <SalesKpiGrid
        kpis={[
          { id: 'total', label: 'Order total', value: formatSalesKwd(total, 3), detail: `${order.lines.length} line item${order.lines.length === 1 ? '' : 's'}` },
          { id: 'discount', label: 'Discounts', value: formatSalesKwd(discountTotal, 3), detail: `On ${formatSalesKwd(subtotal, 3)} list price` },
          {
            id: 'refunded',
            label: 'Refunded',
            value: order.refunded > 0 ? formatSalesKwd(order.refunded, 3) : '—',
            detail: order.refunded > 0 ? `${formatSalesKwd(refundable, 3)} remaining` : 'No refunds on this order',
            tone: order.refunded > 0 ? 'down' : undefined,
          },
          { id: 'status', label: 'Status', value: statusLabel, detail: `Placed ${formatSalesDate(order.date)}` },
        ]}
        className="sm:grid-cols-2 xl:grid-cols-4"
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-navy">Line items</h2>
            <p className="mt-0.5 text-sm text-slate-500">Prices in KWD</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Item</th>
                  <th className={`${thClass} text-right`}>Qty</th>
                  <th className={`${thClass} text-right`}>Unit</th>
                  <th className={`${thClass} text-right`}>Discount</th>
                  <th className={`${thClass} text-right`}>Line total</th>
                  <th className={thClass}>Fulfilment</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line, index) => (
                  <tr key={`${line.item}-${index}`} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{line.item}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{line.qty}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{formatSalesKwd(line.unit, 3)}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      {line.discount > 0 ? `${line.discount}%` : '—'}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {formatSalesKwd(salesLineTotal(line), 3)}
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={line.fulfilment} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {line.fulfilment === 'Pending' && order.status === 'Paid' ? (
                        <button type="button" onClick={() => markDelivered(index)} className={linkAction}>
                          Mark delivered
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/80 text-sm font-bold text-navy">
                  <td className="px-4 py-3" colSpan={4}>
                    Order total
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatSalesKwd(total, 3)}</td>
                  <td className="px-3 py-3" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Payment">
            <dl className="-my-2 divide-y divide-slate-100">
              <DetailRow label="Method">{order.method}</DetailRow>
              <DetailRow label="Reference">{order.reference}</DetailRow>
              <DetailRow label="Placed">{formatSalesDate(order.date)}</DetailRow>
              <DetailRow label="Paid on">{order.paidOn ? formatSalesDate(order.paidOn) : '—'}</DetailRow>
              <DetailRow label="Billing country">{order.country}</DetailRow>
            </dl>
          </SalesSideCard>

          <SalesSideCard icon={null} title="Refund summary">
            <dl className="-my-2 divide-y divide-slate-100">
              <DetailRow label="Order total">{formatSalesKwd(total, 3)}</DetailRow>
              <DetailRow label="Refunded">{order.refunded > 0 ? `−${formatSalesKwd(order.refunded, 3)}` : '—'}</DetailRow>
              <DetailRow label="Net received">
                {order.status === 'Paid' || order.status === 'Refunded' ? formatSalesKwd(round3(total - order.refunded), 3) : '—'}
              </DetailRow>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={refundable <= 0 || order.status !== 'Paid'}
                onClick={() => refund(round3(refundable / 2))}
                className={btnOutline}
              >
                Partial refund (50%)
              </button>
            </div>
            {order.status !== 'Paid' && order.status !== 'Refunded' ? (
              <p className="mt-3 text-xs text-slate-400">Refunds are available once the order is paid.</p>
            ) : null}
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
