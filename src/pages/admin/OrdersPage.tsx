import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminOrderMethods,
  superAdminOrders,
  superAdminSalesPageSize,
  type SuperAdminOrder,
  type SuperAdminOrderStatus,
  type SuperAdminSalesKpi,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  MoneyCell,
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
  updateById,
} from './salesShared'

const ALL_METHODS = 'All methods'
const ALL_TYPES = 'All types'
const TABS: { id: 'all' | SuperAdminOrderStatus; label: string }[] = [
  { id: 'all', label: 'All orders' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Failed', label: 'Failed' },
  { id: 'Refunded', label: 'Refunded' },
]

const baseCount = (status: SuperAdminOrderStatus) => superAdminOrders.filter((row) => row.status === status).length

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<SuperAdminOrder[]>(superAdminOrders)
  const [tab, setTab] = useState<'all' | SuperAdminOrderStatus>('all')
  const [query, setQuery] = useState('')
  const [method, setMethod] = useState(ALL_METHODS)
  const [type, setType] = useState(ALL_TYPES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminSalesKpi[]>(() => {
    const count = (status: SuperAdminOrderStatus) => orders.filter((row) => row.status === status).length
    const paid = orders.filter((row) => row.status === 'Paid')
    const aov = paid.length ? paid.reduce((sum, row) => sum + row.total, 0) / paid.length : 0
    return [
      { id: 'paid', label: 'Paid orders (30d)', value: (1284 + count('Paid') - baseCount('Paid')).toLocaleString('en-US'), detail: '+8.1% vs previous 30 days' },
      { id: 'pending', label: 'Pending', value: String(41 + count('Pending') - baseCount('Pending')), detail: 'Awaiting payment confirmation' },
      { id: 'failed', label: 'Failed', value: String(count('Failed')), detail: 'In this list' },
      { id: 'aov', label: 'Avg. order value', value: formatSalesKwd(aov, 1), detail: 'Paid orders in this list' },
    ]
  }, [orders])

  const byMethod = useMemo(
    () =>
      superAdminOrderMethods.map((label) => ({
        label,
        value: orders.filter((row) => row.method === label && row.status === 'Paid').reduce((sum, row) => sum + row.total, 0),
      })),
    [orders],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return orders.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (method !== ALL_METHODS && row.method !== method) return false
      if (type !== ALL_TYPES && row.type !== type) return false
      return !needle || `${row.id} ${row.customer}`.toLowerCase().includes(needle)
    })
  }, [method, orders, query, tab, type])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminOrder, status: SuperAdminOrderStatus, message: string) => {
    setOrders((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  const createManual = () => {
    const next = `ORD-${52350 + orders.length}`
    setOrders((current) => [
      { id: next, customer: 'Manual order — walk-in', type: 'B2C', total: 85, method: 'Bank transfer', date: '2026-11-10', status: 'Pending' },
      ...current,
    ])
    setTab('all')
    setPage(1)
    setNotice(`Manual order ${next} created as Pending (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Orders and Transactions"
        subtitle="All paid, pending and failed orders across individuals and organizations."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Orders exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={createManual} className={btnPrimary}>
              Create manual order
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-4" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs
            tabs={TABS}
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
              <option>{ALL_TYPES}</option>
              <option>B2C</option>
              <option>B2B</option>
            </ContentSelect>
            <ContentSelect
              aria-label="Method"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>{ALL_METHODS}</option>
              {superAdminOrderMethods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
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
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-brand">{row.id}</td>
                    <td className="px-3 py-3.5 text-sm font-semibold text-navy">{row.customer}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.type}</td>
                    <td className="px-3 py-3.5 text-right">
                      <MoneyCell value={row.total} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.method}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`${paths.admin.orderDetail}?order=${row.id}`} className={linkAction}>
                          View
                        </Link>
                        {row.status === 'Pending' || row.status === 'Failed' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Paid', `${row.id} marked as paid (sample).`)}
                            className={linkAction}
                          >
                            Mark as paid
                          </button>
                        ) : null}
                        {row.status === 'Paid' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Refunded', `${row.id} refunded ${formatSalesKwd(row.total)} (sample).`)}
                            className={dangerAction}
                          >
                            Refund order
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={8}>No orders match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="orders" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Collected by method" subtitle="Paid orders in this list">
            <SalesHBars items={byMethod} format={(value) => formatSalesKwd(value, 0)} />
          </SalesSideCard>
          <SalesSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">
              Open an order to see line items, tax and any partial refunds already issued.
            </p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
