import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminRefundReasons,
  superAdminRefunds,
  superAdminSalesPageSize,
  type SuperAdminRefund,
  type SuperAdminRefundStatus,
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

const ALL_REASONS = 'All reasons'
const TABS: { id: 'all' | SuperAdminRefundStatus; label: string }[] = [
  { id: 'all', label: 'All refunds' },
  { id: 'Requested', label: 'Requested' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Processed', label: 'Processed' },
  { id: 'Rejected', label: 'Rejected' },
]

const awaiting = (rows: SuperAdminRefund[]) => rows.filter((row) => row.status === 'Requested').length
const processed = (rows: SuperAdminRefund[]) =>
  rows.filter((row) => row.status === 'Processed').reduce((sum, row) => sum + row.amount, 0)
const baseProcessed = processed(superAdminRefunds)

export function AdminRefundsPage() {
  const [rows, setRows] = useState<SuperAdminRefund[]>(superAdminRefunds)
  const [tab, setTab] = useState<'all' | SuperAdminRefundStatus>('all')
  const [query, setQuery] = useState('')
  const [reason, setReason] = useState(ALL_REASONS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminSalesKpi[]>(
    () => [
      { id: 'refunds', label: 'Refunds (30d)', value: formatSalesKwd(1184 + processed(rows) - baseProcessed, 0), detail: '−2.1% vs previous 30 days' },
      { id: 'rate', label: 'Refund rate', value: '2.4%', detail: 'Refunded value ÷ gross revenue' },
      { id: 'awaiting', label: 'Awaiting review', value: String(awaiting(rows)), detail: 'Requested and not yet decided' },
    ],
    [rows],
  )

  const byReason = useMemo(
    () =>
      superAdminRefundReasons.map((label) => ({
        label,
        value: rows.filter((row) => row.reason === label).reduce((sum, row) => sum + row.amount, 0),
      })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (reason !== ALL_REASONS && row.reason !== reason) return false
      return !needle || `${row.id} ${row.order} ${row.customer}`.toLowerCase().includes(needle)
    })
  }, [query, reason, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminRefund, status: SuperAdminRefundStatus, message: string) => {
    setRows((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  const create = () => {
    const id = `RF-${3115 + rows.length}`
    setRows((current) => [
      { id, order: 'ORD-52329', customer: 'Fatima Al-Mutairi', amount: 85, reason: 'Schedule conflict', requested: '2026-11-10', status: 'Requested' },
      ...current,
    ])
    setTab('all')
    setPage(1)
    setNotice(`Refund request ${id} created for ORD-52329 (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Refunds"
        subtitle="Refund requests awaiting review and processed refunds."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Refunds exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={create} className={btnPrimary}>
              Create refund
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={kpis} />

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
              placeholder="Search refund, order or customer"
            />
            <ContentSelect
              aria-label="Reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[14rem]"
            >
              <option>{ALL_REASONS}</option>
              {superAdminRefundReasons.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Refund</th>
                  <th className={thClass}>Order</th>
                  <th className={thClass}>Customer</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Reason</th>
                  <th className={thClass}>Requested</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.id}</td>
                    <td className="px-3 py-3.5 text-sm font-semibold">
                      <Link to={`${paths.admin.orderDetail}?order=${row.order}`} className="text-brand hover:underline">
                        {row.order}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.customer}</td>
                    <td className="px-3 py-3.5 text-right">
                      <MoneyCell value={row.amount} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.reason}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.requested)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {row.status === 'Requested' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setStatus(row, 'Approved', `${row.id} approved for ${formatSalesKwd(row.amount)} (sample).`)}
                              className={linkAction}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatus(row, 'Rejected', `${row.id} rejected. ${row.customer} will be notified (sample).`)}
                              className={dangerAction}
                            >
                              Reject
                            </button>
                          </>
                        ) : null}
                        {row.status === 'Approved' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Processed', `${row.id} processed — ${formatSalesKwd(row.amount)} returned to ${row.customer} (sample).`)}
                            className={linkAction}
                          >
                            Mark processed
                          </button>
                        ) : null}
                        {row.status === 'Processed' || row.status === 'Rejected' ? (
                          <span className="text-sm text-slate-300">—</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={8}>No refunds match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="refunds" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Refunds by reason" subtitle="KWD, all statuses in this list">
            <SalesHBars items={byReason} format={(value) => formatSalesKwd(value, 0)} />
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
