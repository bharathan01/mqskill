import { superAdminLearningRows, type SuperAdminReportsKpi } from '@/constants'
import { StatusBadge } from './catalogShared'
import {
  ReportsBarChart,
  ReportsChartCard,
  ReportsFilterSelect,
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
  numCellClass,
  toolbarClass,
  trClass,
  useReportList,
} from './reportsShared'

const rows = superAdminLearningRows

const kpis: SuperAdminReportsKpi[] = [
  { id: 'completion', label: 'Completion rate', value: '71%', detail: '+2% vs last quarter' },
  { id: 'study', label: 'Avg. weekly study', value: '2.6 h', detail: 'Per active learner' },
  { id: 'dropoff', label: 'Drop-off risk', value: '12%', detail: '−1% vs last quarter' },
]

export function AdminLearningAnalyticsPage() {
  const list = useReportList(rows, (row) => `${row.course} ${row.dropOff}`, [{ key: 'health', test: (row, value) => row.health === value }])
  const { setNotice } = list

  return (
    <ReportsPageShell
      page="Learning Analytics"
      subtitle="Engagement, completion and drop-off by course."
      exportNotice="Learning analytics exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Completion rate" subtitle="By course">
              <ReportsBarChart items={rows.map((row) => ({ label: row.course.split(' ')[0], value: row.completion }))} heightClass="h-56" />
            </ReportsChartCard>
            <ReportsChartCard title="Engagement" subtitle="Score out of 100">
              <ReportsHBars items={rows.map((row) => ({ label: row.course, value: row.engagement }))} />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="blue">Courses with completion under 70% are marked Watch so content teams can review the drop-off module (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search course or module" />
          <ReportsFilterSelect label="Health" value={list.filter('health')} options={['Healthy', 'Watch']} onChange={(v) => list.setFilter('health', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[860px]"
          columns={[
            { label: 'Course' },
            { label: 'Avg. hours', align: 'right' },
            { label: 'Completion', align: 'right' },
            { label: 'Biggest drop-off' },
            { label: 'Engagement', align: 'right' },
            { label: 'Health' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No courses match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.course}</td>
              <td className={`${numCellClass} text-right`}>{row.hours.toFixed(1)} h</td>
              <td className={`${boldNumCellClass} text-right`}>{row.completion}%</td>
              <td className={cellClass}>{row.dropOff}</td>
              <td className={`${numCellClass} text-right`}>{row.engagement}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.health} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.course} learning report exported as CSV (sample).`)} className={linkAction}>
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
