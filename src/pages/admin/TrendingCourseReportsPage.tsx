import { superAdminTrendingCourseRows, type SuperAdminReportsKpi } from '@/constants'
import { StatusBadge } from './catalogShared'
import {
  GrowthCell,
  RankChange,
  ReportsFilterSelect,
  ReportsBarChart,
  ReportsChartCard,
  ReportsHBars,
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
  toolbarClass,
  trClass,
  useReportList,
} from './reportsShared'

const rows = superAdminTrendingCourseRows

export function AdminTrendingCourseReportsPage() {
  const list = useReportList(rows, (row) => row.course, [{ key: 'signal', test: (row, value) => row.signal === value }])
  const { setNotice } = list

  const mover = rows.reduce((best, row) => (row.rankChange > best.rankChange ? row : best), rows[0])
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'up', label: 'Courses trending up', value: '38', detail: 'Of 62 published courses' },
    { id: 'new', label: 'New entrants', value: '4', detail: 'New in the weekly top 10' },
    { id: 'mover', label: 'Biggest mover', value: mover.course, detail: `+${mover.rankChange} ranks this week` },
  ]

  return (
    <ReportsPageShell
      page="Trending Course Reports"
      subtitle="Weekly ranking of the fastest-growing courses."
      exportNotice="Trending course ranking exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Enrollments (7 days)" subtitle="By course">
              <ReportsBarChart items={rows.map((row) => ({ label: row.course.split(' ')[0], value: row.enrollments }))} heightClass="h-56" />
            </ReportsChartCard>
            <ReportsChartCard title="Week-on-week growth" subtitle="Percent">
              <ReportsHBars items={rows.map((row) => ({ label: row.course, value: row.growth }))} format={(value) => `${value}%`} />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="blue">Ranking is by week-on-week growth, so a smaller course can outrank a larger one (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search course" />
          <ReportsFilterSelect label="Signal" value={list.filter('signal')} options={['Hot', 'Steady']} onChange={(v) => list.setFilter('signal', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[780px]"
          columns={[
            { label: 'Rank' },
            { label: 'Course' },
            { label: 'Enrollments (7d)', align: 'right' },
            { label: 'WoW growth', align: 'right' },
            { label: 'Rank change' },
            { label: 'Signal' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No courses match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>#{row.rank}</td>
              <td className={`${cellClass} font-semibold text-navy`}>{row.course}</td>
              <td className={`${boldNumCellClass} text-right`}>{row.enrollments.toLocaleString('en-US')}</td>
              <td className={`${cellClass} text-right`}>
                <GrowthCell value={row.growth} />
              </td>
              <td className="px-3 py-3.5">
                <RankChange value={row.rankChange} />
              </td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.signal} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.course} enrollment trend exported as CSV (sample).`)} className={linkAction}>
                  Export
                </button>
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="courses" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
