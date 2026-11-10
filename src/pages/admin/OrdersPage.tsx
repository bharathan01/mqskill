import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatSalesDate,
  formatSalesKwd,
  salesOrderTotal,
  superAdminOrderTabs,
  superAdminOrdersKpis,
  superAdminOrdersSubtitle,
  superAdminOrdersTip,
  superAdminSalesMethods,
  superAdminSalesOrders,
  superAdminSalesPageSize,
  type SuperAdminSalesOrder,
  type SuperAdminSalesOrderStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  paginate,
  SalesEmptyRow,
  SalesHBars,
  SalesKpiGrid,
  SalesPageHeader,
  SalesPager,
  SalesSearch,
  SalesSideCard,
  SalesTabs,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
} from './salesShared'

const ALL_TYPES = 'All types'
const ALL_METHODS = 'All methods'
const baseCount = (status: SuperAdminSalesOrderStatus) =>
  superAdminSalesOrders.filter((order) => order.status === status).length

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<SuperAdminSalesOrder[]>(superAdminSalesOrders)
  const [tab, setTab] = useState<'all' | SuperAdminSalesOrderStatus>('all')
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL_TYPES)
  const [method, setMethod] = useState(ALL_METHODS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const count = (status: SuperAdminSalesOrderStatus) => orders.filter((order) => order.status === status).length
    return superAdminOrdersKpis.map((kpi) => {
      if (kpi.id === 'paid') return { ...kpi, value: (1284 + count('Paid') - baseCount('Paid')).toLocaleString('en-US') }
      if (kpi.id === 'pending') return { ...kpi, value: String(41 + count('Pending') - baseCount('Pending')) }
      if (kpi.id === 'failed') return { ...kpi, value: String(18 + count('Failed') - baseCount('Failed')) }
      return kpi
    })
  }, [orders])

  const byMethod = useMemo(
    () =>
      superAdminSalesMethods.map((label) => ({
        label,
        value: orders
          .filter((order) => order.method === label && order.status === 'Paid')
          .reduce((total, order) => total + salesOrderTotal(order), 0),
      })),
    [orders],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return orders.filter((order) => {
      if (tab !== 'all' && order.status !== tab) return false
      if (type !== ALL_TYPES && order.type !== type) return false
      if (method !== ALL_METHODS && order.method !== method) return false
      if (!needle) return true
      return `${order.id} ${order.customer}`.toLowerCase().includes(needle)
    })
  }, [method, orders, query, tab, type])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const update = (order: SuperAdminSalesOrder, patch: Partial<SuperAdminSalesOrder>, message: string) => {
    setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, ...patch } : item)))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Orders and Transactions"
        subtitle={superAdminOrdersSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Orders exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs
            tabs={superAdminOrderTabs}
            active={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />

          <div className={toolbarClass}>
            <SalesSearch
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search order ID or customer"
            />
            <ContentSelect
              aria-label="Type"
              value={type}
              onChange={(event) => {
                setType(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[9rem]"
            >
              {[ALL_TYPES, 'B2C', 'B2B'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
            <ContentSelect
              aria-label="Method"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[11rem]"
            >
              <option>{ALL_METHODS}</option>
              {superAdminSalesMethods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1020px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Order</th>
                  <th className={thClass}>Customer</th>
                  <th className={thClass}>Type</th>
                  <th className={`${thClass} text-right`}>Total</th>
                  <th className={thClass}>Method</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((order) => (
                  <tr key={order.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-brand">{order.id}</td>
                    <td className="px-3 py-3.5">
                      <p className="text-sm font-semibold text-navy">{order.customer}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{order.country}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{order.type}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {formatSalesKwd(salesOrderTotal(order), 3)}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{order.method}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(order.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={order.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="inline-flex items-center justify-end gap-3">
                        <Link to={`${paths.admin.orderDetail}?order=${order.id}`} className={linkAction}>
                          View
                        </Link>
                        {order.status === 'Pending' || order.status === 'Failed' ? (
                          <button
                            type="button"
                            onClick={() =>
                              update(order, { status: 'Paid', paidOn: order.date }, `${order.id} marked as paid (sample).`)
                            }
                            className={linkAction}
                          >
                            Mark as paid
                          </button>
                        ) : null}
                        {order.status === 'Paid' ? (
                          <button
                            type="button"
                            onClick={() =>
                              update(
                                order,
                                { status: 'Refunded', refunded: salesOrderTotal(order) },
                                `${order.id} refunded ${formatSalesKwd(salesOrderTotal(order), 3)} to ${order.customer} (sample).`,
                              )
                            }
                            className={dangerAction}
                          >
                            Refund order
                          </button>
                        ) : null}
                      </span>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <SalesEmptyRow colSpan={8}>No orders match these filters.</SalesEmptyRow>
                ) : null}
              </tbody>
            </table>
          </div>
          <SalesPager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="orders"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Collected by method" subtitle="Paid orders in this list">
            <SalesHBars items={byMethod} format={(value) => formatSalesKwd(value)} />
          </SalesSideCard>

          <SalesSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminOrdersTip}</p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
