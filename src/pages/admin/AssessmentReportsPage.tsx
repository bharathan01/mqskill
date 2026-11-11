import { superAdminAssessmentReportRows, type SuperAdminReportsKpi } from '@/constants'
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
  firstCellClass,
  linkAction,
  numCellClass,
  toolbarClass,
  trClass,
  useReportList,
} from './reportsShared'

const rows = superAdminAssessmentReportRows

const kpis: SuperAdminReportsKpi[] = [
  { id: 'attempts', label: 'Attempts (30d)', value: '12,940', detail: '+6.2% vs previous 30 days' },
  { id: 'pass', label: 'Pass rate', value: '83%', detail: '+1.1% vs previous 30 days' },
  { id: 'flagged', label: 'Flagged', value: '7', detail: 'Assessments needing review' },
]

export function AdminAssessmentReportsPage() {
  const list = useReportList(rows, (row) => row.assessment, [{ key: 'difficulty', test: (row, value) => row.difficulty === value }])
  const { setNotice } = list

  return (
    <ReportsPageShell
      page="Assessment Reports"
      subtitle="Attempts, pass rates and difficulty trends."
      exportNotice="Assessment reports exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Pass rate" subtitle="By final assessment">
              <ReportsBarChart
                items={rows.map((row) => ({ label: row.assessment.replace(' · Final', '').split(' ')[0], value: row.passRate }))}
                heightClass="h-56"
              />
            </ReportsChartCard>
            <ReportsChartCard title="Attempts" subtitle="Last 30 days">
              <ReportsHBars items={rows.map((row) => ({ label: row.assessment.replace(' · Final', ''), value: row.attempts }))} />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="amber">Hard assessments pass below 75%. Review question quality before changing the pass mark (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search assessment" />
          <ReportsFilterSelect label="Difficulty" value={list.filter('difficulty')} options={['Easy', 'Balanced', 'Hard']} onChange={(v) => list.setFilter('difficulty', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[780px]"
          columns={[
            { label: 'Assessment' },
            { label: 'Attempts', align: 'right' },
            { label: 'Pass rate', align: 'right' },
            { label: 'Avg. score', align: 'right' },
            { label: 'Difficulty' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No assessments match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.assessment}</td>
              <td className={`${numCellClass} text-right`}>{row.attempts.toLocaleString('en-US')}</td>
              <td className={`${boldNumCellClass} text-right`}>{row.passRate}%</td>
              <td className={`${numCellClass} text-right`}>{row.avgScore}%</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.difficulty} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.assessment} results exported as CSV (sample).`)} className={linkAction}>
                  Export
                </button>
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="assessments" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
