import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatSalesKwd,
  superAdminFinanceAov,
  superAdminFinanceSubtitle,
  superAdminFinanceTip,
  superAdminRevenueStreams,
  type SuperAdminRevenueTrend,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  kwd0,
  paginate,
  SalesBarChart,
  SalesEmptyRow,
  SalesHBars,
  SalesKpiGrid,
  SalesPageHeader,
  SalesPager,
  SalesSearch,
  SalesSideCard,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
} from './salesShared'

const ALL_TRENDS = 'All trends'
const TRENDS: SuperAdminRevenueTrend[] = ['Growing', 'Stable', 'Declining']

export function AdminFinancialOverviewPage() {
  const [query, setQuery] = useState('')
  const [trend, setTrend] = useState(ALL_TRENDS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const totals = useMemo(() => {
    const gross = superAdminRevenueStreams.reduce((sum, row) => sum + row.gross, 0)
    const refunds = superAdminRevenueStreams.reduce((sum, row) => sum + row.refunds, 0)
    return { gross, refunds, net: gross - refunds }
  }, [])

  const kpis: SuperAdminSalesKpi[] = [
    { id: 'gross', label: 'Gross revenue', value: formatSalesKwd(totals.gross, 0), detail: '+12.4% vs previous period' },
    { id: 'net', label: 'Net revenue', value: formatSalesKwd(totals.net, 0), detail: '+12.8% vs previous period' },
    { id: 'refunds', label: 'Refunds', value: formatSalesKwd(totals.refunds, 0), detail: '−2.1% vs previous period' },
    { id: 'aov', label: 'Avg. order value', value: superAdminFinanceAov, detail: '+4.1% vs previous period' },
  ]

  const rows = useMemo(
    () =>
      superAdminRevenueStreams.map((row) => ({
        ...row,
        net: row.gross - row.refunds,
        share: (row.gross / totals.gross) * 100,
      })),
    [totals.gross],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (trend !== ALL_TRENDS && row.trend !== trend) return false
      return !needle || row.stream.toLowerCase().includes(needle)
    })
  }, [query, rows, trend])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, 8)
  const chart = rows.map((row) => ({ label: row.stream.split(' ')[0], value: row.gross }))
  const mix = [...rows]
    .sort((a, b) => b.share - a.share)
    .slice(0, 5)
    .map((row) => ({ label: row.stream, value: Math.round(row.share * 10) / 10 }))

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Financial Overview"
        subtitle={superAdminFinanceSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Financial overview exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('Overview refreshed with the latest collections (sample).')} className={btnPrimary}>
              Refresh figures
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-4" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Gross revenue by stream</h2>
            <p className="mt-0.5 text-sm text-slate-500">KWD, current period</p>
            <div className="mt-4">
              <SalesBarChart items={chart} showValues format={(value) => `${(value / 1000).toFixed(1)}k`} heightClass="h-52" />
            </div>
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <div className={toolbarClass}>
              <SalesSearch
                value={query}
                onChange={(value) => {
                  setQuery(value)
                  setPage(1)
                }}
                placeholder="Search revenue stream"
              />
              <ContentSelect
                aria-label="Trend"
                value={trend}
                onChange={(event) => {
                  setTrend(event.target.value)
                  setPage(1)
                }}
                className="!h-10 lg:max-w-[11rem]"
              >
                <option>{ALL_TRENDS}</option>
                {TRENDS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                  <tr className={theadRowClass}>
                    <th className="px-4 py-2.5 font-semibold">Revenue stream</th>
                    <th className={`${thClass} text-right`}>Gross</th>
                    <th className={`${thClass} text-right`}>Refunds</th>
                    <th className={`${thClass} text-right`}>Net</th>
                    <th className={`${thClass} text-right`}>Share</th>
                    <th className={thClass}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.id} className={trClass}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.stream}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{kwd0(row.gross)}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{kwd0(row.refunds)}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{kwd0(row.net)}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.share.toFixed(1)}%</td>
                      <td className="px-3 py-3.5">
                        <StatusBadge value={row.trend} />
                      </td>
                    </tr>
                  ))}
                  {pageRows.length === 0 ? <SalesEmptyRow colSpan={6}>No revenue streams match these filters.</SalesEmptyRow> : null}
                </tbody>
              </table>
            </div>
            <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="streams" onPage={setPage} />
          </section>
        </div>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Revenue mix" subtitle="Top streams by share of gross">
            <SalesHBars items={mix} format={(value) => `${value}%`} />
          </SalesSideCard>
          <SalesSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminFinanceTip}</p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
