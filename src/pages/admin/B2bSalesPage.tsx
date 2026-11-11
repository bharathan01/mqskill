import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminB2bSales,
  superAdminSalesPageSize,
  type SuperAdminB2bSale,
  type SuperAdminB2bStatus,
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

const ALL_ORGS = 'All organizations'
const TABS: { id: 'all' | SuperAdminB2bStatus; label: string }[] = [
  { id: 'all', label: 'All deals' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Invoiced', label: 'Invoiced' },
  { id: 'Quote sent', label: 'Quote sent' },
]

const paidTotal = (rows: SuperAdminB2bSale[]) =>
  rows.filter((row) => row.status === 'Paid').reduce((sum, row) => sum + row.amount, 0)
const basePaid = paidTotal(superAdminB2bSales)

export function AdminB2bSalesPage() {
  const [rows, setRows] = useState<SuperAdminB2bSale[]>(superAdminB2bSales)
  const [tab, setTab] = useState<'all' | SuperAdminB2bStatus>('all')
  const [query, setQuery] = useState('')
  const [org, setOrg] = useState(ALL_ORGS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const orgs = useMemo(() => Array.from(new Set(superAdminB2bSales.map((row) => row.org))), [])

  const kpis = useMemo<SuperAdminSalesKpi[]>(
    () => [
      { id: 'rev', label: 'B2B revenue', value: formatSalesKwd(21310 + paidTotal(rows) - basePaid, 0), detail: '+23.4% vs previous period' },
      { id: 'seats', label: 'Seats sold', value: (2540 + rows.reduce((sum, row) => sum + row.seats, 0) - superAdminB2bSales.reduce((sum, row) => sum + row.seats, 0)).toLocaleString('en-US'), detail: '+21% vs previous period' },
      { id: 'avg', label: 'Avg. deal size', value: 'KWD 3,820', detail: 'Across paid and invoiced deals' },
    ],
    [rows],
  )

  const seatsByOrg = useMemo(() => {
    const totals = new Map<string, number>()
    rows.forEach((row) => totals.set(row.org, (totals.get(row.org) ?? 0) + row.seats))
    return Array.from(totals, ([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (org !== ALL_ORGS && row.org !== org) return false
      return !needle || `${row.org} ${row.course} ${row.id}`.toLowerCase().includes(needle)
    })
  }, [org, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminB2bSale, status: SuperAdminB2bStatus, message: string) => {
    setRows((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  const createQuote = () => {
    const id = `B2B-${9150 + rows.length}`
    setRows((current) => [
      { id, org: 'ABC Corp', course: 'ISO 45001 Lead Auditor', seats: 40, amount: 7870, date: '2026-11-10', status: 'Quote sent' },
      ...current,
    ])
    setTab('all')
    setPage(1)
    setNotice(`Quote ${id} for ABC Corp (40 seats) created and sent (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="B2B Sales"
        subtitle="Seat purchases and enterprise contracts."
        actions={
          <>
            <button type="button" onClick={() => setNotice('B2B sales exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={createQuote} className={btnPrimary}>
              Create quote
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
              placeholder="Search organization, course or deal ID"
            />
            <ContentSelect
              aria-label="Organization"
              value={org}
              onChange={(event) => {
                setOrg(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[13rem]"
            >
              <option>{ALL_ORGS}</option>
              {orgs.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Course</th>
                  <th className={`${thClass} text-right`}>Seats</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.org}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-navy tabular-nums">{row.seats}</td>
                    <td className="px-3 py-3.5 text-right">
                      <MoneyCell value={row.amount} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {row.status === 'Quote sent' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Invoiced', `${row.id} converted to an invoice for ${row.org} (sample).`)}
                            className={linkAction}
                          >
                            Convert to invoice
                          </button>
                        ) : null}
                        {row.status !== 'Paid' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Paid', `${row.id} marked as paid (sample).`)}
                            className={linkAction}
                          >
                            Mark as paid
                          </button>
                        ) : (
                          <span className="text-sm text-slate-300">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No B2B deals match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="deals" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Seats by organization" subtitle="Top 5 in this list">
            <SalesHBars items={seatsByOrg} />
          </SalesSideCard>
          <SalesSideCard icon={null} title="Quote → invoice → paid">
            <p className="-mt-3 text-sm text-slate-500">
              Convert an accepted quote to an invoice, then mark it paid once the bank transfer or card payment clears.
            </p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
