import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminMonthlyRevenue,
  superAdminReportPeriods,
  superAdminReportTypes,
  superAdminRevenueReports,
  superAdminSalesPageSize,
  superAdminSalesToday,
  type SuperAdminRevenueReportStatus,
  type SuperAdminRevenueReport,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  kwd0,
  linkAction,
  paginate,
  SalesEmptyRow,
  SalesGroupedBars,
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

const TABS: { id: 'all' | SuperAdminRevenueReportStatus; label: string }[] = [
  { id: 'all', label: 'All reports' },
  { id: 'Ready', label: 'Ready' },
  { id: 'Generating', label: 'Generating' },
]

export function AdminRevenueReportsPage() {
  const [rows, setRows] = useState<SuperAdminRevenueReport[]>(superAdminRevenueReports)
  const [tab, setTab] = useState<'all' | SuperAdminRevenueReportStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [type, setType] = useState<string>(superAdminReportTypes[0])
  const [period, setPeriod] = useState<string>(superAdminReportPeriods[0])

  const ytd = useMemo(
    () => ({
      gross: superAdminMonthlyRevenue.reduce((sum, row) => sum + row.gross, 0),
      net: superAdminMonthlyRevenue.reduce((sum, row) => sum + row.net, 0),
    }),
    [],
  )

  const kpis: SuperAdminSalesKpi[] = [
    { id: 'gross', label: 'YTD gross', value: formatSalesKwd(ytd.gross, 0), detail: '+38% vs last year' },
    { id: 'net', label: 'YTD net', value: formatSalesKwd(ytd.net, 0), detail: 'After refunds' },
    { id: 'count', label: 'Reports generated', value: String(37 + rows.length - superAdminRevenueReports.length), detail: 'Since January' },
  ]

  const chart = superAdminMonthlyRevenue.map((row) => ({ label: row.month, a: row.gross, b: row.net }))

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      return !needle || `${row.report} ${row.period}`.toLowerCase().includes(needle)
    })
  }, [query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const generate = () => {
    const monthly = superAdminMonthlyRevenue[superAdminMonthlyRevenue.length - 1]
    setRows((current) => [
      { id: `rr${current.length + 1}`, report: type, period, gross: monthly.gross, net: monthly.net, generated: superAdminSalesToday, status: 'Generating' },
      ...current,
    ])
    setCreating(false)
    setTab('all')
    setPage(1)
    setNotice(`${type} (${period}) is generating — it will appear as Ready shortly (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Revenue Reports"
        subtitle="Monthly and quarterly revenue statements."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Revenue summary exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setCreating((open) => !open)} className={btnPrimary}>
              Generate report
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {creating ? (
        <section className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
          <label className="block flex-1 text-sm font-semibold text-navy">
            Report
            <ContentSelect value={type} onChange={(event) => setType(event.target.value)} className="mt-1.5">
              {superAdminReportTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </label>
          <label className="block text-sm font-semibold text-navy lg:w-52">
            Period
            <ContentSelect value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-1.5">
              {superAdminReportPeriods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </label>
          <div className="flex gap-2.5">
            <button type="button" onClick={generate} className={btnPrimary}>
              Start generating
            </button>
            <button type="button" onClick={() => setCreating(false)} className={btnOutline}>
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      <SalesKpiGrid kpis={kpis} />

      <section className={`${cardClass} p-5`}>
        <h2 className="text-base font-bold text-navy">Monthly gross vs net revenue</h2>
        <p className="mt-0.5 text-sm text-slate-500">KWD, January to October 2026</p>
        <div className="mt-4">
          <SalesGroupedBars items={chart} aLabel="Gross" bLabel="Net" />
        </div>
      </section>

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
              placeholder="Search report or period"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Report</th>
                  <th className={thClass}>Period</th>
                  <th className={`${thClass} text-right`}>Gross</th>
                  <th className={`${thClass} text-right`}>Net</th>
                  <th className={thClass}>Generated</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.report}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.period}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{kwd0(row.gross)}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {row.net ? kwd0(row.net) : '—'}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.generated)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Ready' ? (
                        <div className="flex items-center justify-end gap-3">
                          <button type="button" onClick={() => setNotice(`${row.report} (${row.period}) downloaded as PDF (sample).`)} className={linkAction}>
                            Download
                          </button>
                          <button type="button" onClick={() => setNotice(`${row.report} (${row.period}) exported as CSV (sample).`)} className={linkAction}>
                            Export
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRows((current) => updateById(current, row.id, { status: 'Ready' }))
                            setNotice(`${row.report} regenerated and ready to download (sample).`)
                          }}
                          className={linkAction}
                        >
                          Regenerate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No reports match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="reports" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Best and weakest month" subtitle="By gross revenue, 2026">
            {(() => {
              const sorted = [...superAdminMonthlyRevenue].sort((a, b) => b.gross - a.gross)
              const best = sorted[0]
              const worst = sorted[sorted.length - 1]
              return (
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Best · {best.month}</dt>
                    <dd className="font-semibold text-emerald-600 tabular-nums">{kwd0(best.gross)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Weakest · {worst.month}</dt>
                    <dd className="font-semibold text-rose-600 tabular-nums">{kwd0(worst.gross)}</dd>
                  </div>
                </dl>
              )
            })()}
          </SalesSideCard>
          <SalesSideCard icon={null} title="About reports">
            <p className="-mt-3 text-sm text-slate-500">
              Net revenue is gross minus refunds. Reports in Generating status can be regenerated until they are Ready.
            </p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
