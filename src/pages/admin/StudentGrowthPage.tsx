import { useMemo } from 'react'
import {
  formatReportsChange,
  reportsChange,
  reportsTrendFor,
  superAdminGrowthMonths,
  superAdminTotalStudents,
  type SuperAdminReportsKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import {
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
  newStudents: number
  total: number
  active: number
  retention: number
  trend: string
}

export function AdminStudentGrowthPage() {
  const rows = useMemo<Row[]>(() => {
    // Running total is derived backwards from the current total (24,310 in Oct 2026).
    const totals: number[] = []
    let running = superAdminTotalStudents
    for (let i = superAdminGrowthMonths.length - 1; i >= 0; i -= 1) {
      totals[i] = running
      running -= superAdminGrowthMonths[i].newStudents
    }
    return superAdminGrowthMonths
      .map((item, index, all) => {
        const prev = all[index - 1]
        const change = prev ? reportsChange(item.newStudents, prev.newStudents) : 0
        return {
          id: item.id,
          month: item.month,
          newStudents: item.newStudents,
          total: totals[index],
          active: item.active,
          retention: item.retention,
          trend: prev ? reportsTrendFor(change, 3) : 'Stable',
        }
      })
      .reverse()
  }, [])

  const list = useReportList(rows, (row) => row.month, [{ key: 'trend', test: (row, value) => row.trend === value }])
  const { setNotice } = list

  const last = superAdminGrowthMonths[superAdminGrowthMonths.length - 1]
  const prev = superAdminGrowthMonths[superAdminGrowthMonths.length - 2]
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'new', label: 'New students (Oct)', value: last.newStudents.toLocaleString('en-US'), detail: `${formatReportsChange(reportsChange(last.newStudents, prev.newStudents))} vs Sep` },
    { id: 'total', label: 'Total students', value: superAdminTotalStudents.toLocaleString('en-US'), detail: 'All registered learners' },
    { id: 'active', label: 'Monthly active', value: last.active.toLocaleString('en-US'), detail: `${formatReportsChange(reportsChange(last.active, prev.active))} vs Sep` },
  ]

  const chart = superAdminGrowthMonths.map((item) => ({ label: item.short, value: item.newStudents }))
  const peak = [...superAdminGrowthMonths].sort((a, b) => b.newStudents - a.newStudents)[0]

  return (
    <ReportsPageShell
      page="Student Growth"
      subtitle="Monthly registrations and active learner growth."
      exportNotice="Student growth exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Registrations and active learners" subtitle="Nov 2025 to Oct 2026">
              <ReportsLineChart
                points={superAdminGrowthMonths.map((item) => ({ label: item.short, values: [item.newStudents] }))}
                series={[{ label: 'New students', color: '#2563EB' }]}
              />
            </ReportsChartCard>
            <ReportsChartCard title="New students by month" subtitle={`Peak: ${peak.month} · ${peak.newStudents.toLocaleString('en-US')}`}>
              <ReportsBarChart items={chart} heightClass="h-56" />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="blue">Trend compares new registrations with the previous month; a change within ±3% is Stable (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search month" />
          <ReportsFilterSelect label="Trend" value={list.filter('trend')} options={['Growing', 'Stable', 'Declining']} onChange={(v) => list.setFilter('trend', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[780px]"
          columns={[
            { label: 'Month' },
            { label: 'New students', align: 'right' },
            { label: 'Total students', align: 'right' },
            { label: 'Monthly active', align: 'right' },
            { label: 'Retention', align: 'right' },
            { label: 'Trend' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No months match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.month}</td>
              <td className={`${boldNumCellClass} text-right`}>{row.newStudents.toLocaleString('en-US')}</td>
              <td className={`${numCellClass} text-right`}>{row.total.toLocaleString('en-US')}</td>
              <td className={`${numCellClass} text-right`}>{row.active.toLocaleString('en-US')}</td>
              <td className={`${cellClass} text-right tabular-nums`}>{row.retention}%</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.trend} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.month} registrations exported as CSV (sample).`)} className={linkAction}>
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
