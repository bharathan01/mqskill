import { useMemo } from 'react'
import {
  formatReportsChange,
  formatReportsKwd,
  reportsChange,
  reportsTrendFor,
  superAdminRevenueMonths,
  type SuperAdminReportsKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import {
  GrowthCell,
  ReportsBarChart,
  ReportsChartCard,
  ReportsFilterSelect,
  ReportsLineChart,
  ReportsLayout,
  ReportsNote,
  ReportsPageShell,
  ReportsPager,
  ReportsSearch,
  ReportsTable,
  boldNumCellClass,
  cellClass,
  firstCellClass,
  linkAction,
  numCellClass,
  toolbarClass,
  trClass,
  useReportList,
} from './reportsShared'

type Row = {
  id: string
  month: string
  gross: number
  b2c: number
  b2b: number
  growth: number | null
  trend: string
}

const TRENDS = ['Growing', 'Stable', 'Declining'] as const

export function AdminRevenueAnalyticsPage() {
  const rows = useMemo<Row[]>(
    () =>
      superAdminRevenueMonths
        .map((item, index, all) => {
          const prev = all[index - 1]
          const growth = prev ? reportsChange(item.gross, prev.gross) : null
          return { ...item, growth, trend: growth === null ? 'Stable' : reportsTrendFor(growth) }
        })
        .reverse(),
    [],
  )

  const list = useReportList(rows, (row) => row.month, [{ key: 'trend', test: (row, value) => row.trend === value }])
  const { setNotice } = list

  const oct = superAdminRevenueMonths[superAdminRevenueMonths.length - 1]
  const sep = superAdminRevenueMonths[superAdminRevenueMonths.length - 2]
  const b2cShare = Math.round((oct.b2c / oct.gross) * 100)
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'gross', label: 'Gross revenue (Oct)', value: formatReportsKwd(oct.gross), detail: `${formatReportsChange(reportsChange(oct.gross, sep.gross))} vs Sep` },
    { id: 'b2c', label: 'B2C share', value: `${b2cShare}%`, detail: `${formatReportsKwd(oct.b2c)} from learners` },
    { id: 'b2b', label: 'B2B share', value: `${100 - b2cShare}%`, detail: `${formatReportsKwd(oct.b2b)} from organizations` },
  ]

  const chart = superAdminRevenueMonths.map((item) => ({ label: item.short, value: item.gross }))
  const best = [...superAdminRevenueMonths].sort((a, b) => b.gross - a.gross)[0]

  return (
    <ReportsPageShell
      page="Revenue Analytics"
      subtitle="Monthly gross and net revenue by learner type."
      exportNotice="Revenue analytics exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Revenue trend" subtitle="Gross, B2C and B2B · KWD">
              <ReportsLineChart
                points={superAdminRevenueMonths.map((item) => ({ label: item.short, values: [item.gross, item.b2c, item.b2b] }))}
                series={[
                  { label: 'Gross', color: '#102A4C' },
                  { label: 'B2C', color: '#2563EB' },
                  { label: 'B2B', color: '#60A5FA' },
                ]}
              />
            </ReportsChartCard>
            <ReportsChartCard title="Gross revenue by month" subtitle="Nov 2025 to Oct 2026">
              <ReportsBarChart items={chart} format={formatReportsKwd} heightClass="h-56" />
              <p className="mt-3 text-xs text-slate-500">
                Best month: <span className="font-semibold text-navy">{best.month}</span> · {formatReportsKwd(best.gross)}
              </p>
            </ReportsChartCard>
          </div>
        }
        rail={
          <ReportsNote tone="blue">Gross revenue is before refunds. B2C is learner checkout; B2B is organization seat sales (sample).</ReportsNote>
        }
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search month" />
          <ReportsFilterSelect label="Trend" value={list.filter('trend')} options={TRENDS} onChange={(v) => list.setFilter('trend', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[760px]"
          columns={[
            { label: 'Month' },
            { label: 'Gross revenue', align: 'right' },
            { label: 'B2C', align: 'right' },
            { label: 'B2B', align: 'right' },
            { label: 'Growth MoM', align: 'right' },
            { label: 'Trend' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No months match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.month}</td>
              <td className={`${boldNumCellClass} text-right`}>{formatReportsKwd(row.gross)}</td>
              <td className={`${numCellClass} text-right`}>{formatReportsKwd(row.b2c)}</td>
              <td className={`${numCellClass} text-right`}>{formatReportsKwd(row.b2b)}</td>
              <td className={`${cellClass} text-right`}>
                {row.growth === null ? '—' : <GrowthCell value={row.growth} digits={1} />}
              </td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.trend} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.month} revenue breakdown exported as CSV (sample).`)} className={linkAction}>
                  Export
                </button>
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="months" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
