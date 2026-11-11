import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminSalesInvoices,
  superAdminSalesPageSize,
  type SuperAdminInvoiceStatus,
  type SuperAdminSalesInvoice,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
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

const ALL_TYPES = 'All types'
const TABS: { id: 'all' | SuperAdminInvoiceStatus; label: string }[] = [
  { id: 'all', label: 'All invoices' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Overdue', label: 'Overdue' },
  { id: 'Draft', label: 'Draft' },
]
const STATUSES: SuperAdminInvoiceStatus[] = ['Paid', 'Pending', 'Overdue', 'Draft']

export function AdminSalesInvoicesPage() {
  const [rows, setRows] = useState<SuperAdminSalesInvoice[]>(superAdminSalesInvoices)
  const [tab, setTab] = useState<'all' | SuperAdminInvoiceStatus>('all')
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL_TYPES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminSalesKpi[]>(() => {
    const outstanding = rows
      .filter((row) => row.status === 'Pending' || row.status === 'Overdue')
      .reduce((sum, row) => sum + row.amount, 0)
    const overdue = rows.filter((row) => row.status === 'Overdue').length
    return [
      { id: 'issued', label: 'Issued (30d)', value: String(1402 + rows.length - superAdminSalesInvoices.length), detail: 'Invoices created in the last 30 days' },
      { id: 'outstanding', label: 'Outstanding', value: formatSalesKwd(outstanding, 0), detail: 'Pending and overdue in this list' },
      { id: 'overdue', label: 'Overdue', value: String(overdue), detail: 'Past due date and unpaid' },
    ]
  }, [rows])

  const byStatus = useMemo(
    () =>
      STATUSES.map((label) => ({
        label,
        value: rows.filter((row) => row.status === label).reduce((sum, row) => sum + row.amount, 0),
      })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (type !== ALL_TYPES && row.type !== type) return false
      return !needle || `${row.id} ${row.customer}`.toLowerCase().includes(needle)
    })
  }, [query, rows, tab, type])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminSalesInvoice, status: SuperAdminInvoiceStatus, message: string) => {
    setRows((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  const create = () => {
    const id = `INV-${71265 + rows.length * 5}`
    setRows((current) => [
      { id, customer: 'ABC Corp', type: 'Organization', amount: 850, issued: '2026-11-10', due: '2026-11-24', status: 'Draft' },
      ...current,
    ])
    setTab('all')
    setPage(1)
    setNotice(`Draft invoice ${id} created for ABC Corp (sample). Use Send invoice to issue it.`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Invoices"
        subtitle="Customer invoices for individuals and organizations."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Invoices exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={create} className={btnPrimary}>
              Create invoice
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
              placeholder="Search invoice number or customer"
            />
            <ContentSelect
              aria-label="Type"
              value={type}
              onChange={(event) => {
                setType(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[11rem]"
            >
              <option>{ALL_TYPES}</option>
              <option>Individual</option>
              <option>Organization</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Invoice</th>
                  <th className={thClass}>Customer</th>
                  <th className={thClass}>Type</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Issued</th>
                  <th className={thClass}>Due</th>
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
                      <MoneyCell value={row.amount} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.issued)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.due)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {row.status === 'Draft' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Pending', `Invoice ${row.id} sent to ${row.customer} (sample).`)}
                            className={linkAction}
                          >
                            Send invoice
                          </button>
                        ) : null}
                        {row.status === 'Pending' || row.status === 'Overdue' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setNotice(`Payment reminder sent to ${row.customer} for ${row.id} (sample).`)}
                              className={linkAction}
                            >
                              Send reminder
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatus(row, 'Paid', `Invoice ${row.id} marked as paid (sample).`)}
                              className={linkAction}
                            >
                              Mark as paid
                            </button>
                          </>
                        ) : null}
                        {row.status === 'Paid' ? <span className="text-sm text-slate-300">—</span> : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={8}>No invoices match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="invoices" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Value by status" subtitle="KWD, invoices in this list">
            <SalesHBars items={byStatus} format={(value) => formatSalesKwd(value, 0)} />
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
