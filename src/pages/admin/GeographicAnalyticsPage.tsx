import { formatReportsKwd, superAdminGeoRows, type SuperAdminReportsKpi } from '@/constants'
import { StatusBadge } from './catalogShared'
import {
  GrowthCell,
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
  numCellClass,
  toolbarClass,
  trClass,
  useReportList,
} from './reportsShared'

const rows = superAdminGeoRows

export function AdminGeographicAnalyticsPage() {
  const list = useReportList(rows, (row) => `${row.country} ${row.topCity}`, [{ key: 'market', test: (row, value) => row.market === value }])
  const { setNotice } = list

  const fastest = rows.reduce((best, row) => (row.growth > best.growth ? row : best), rows[0])
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'countries', label: 'Countries', value: '34', detail: 'With at least one learner' },
    { id: 'gcc', label: 'GCC share', value: '88%', detail: 'Of all registered students' },
    { id: 'fastest', label: 'Fastest growing', value: fastest.country, detail: `+${fastest.growth}% year to date` },
  ]

  return (
    <ReportsPageShell
      page="Geographic Analytics"
      subtitle="Learners and revenue by country and city."
      exportNotice="Geographic analytics exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Students by country" subtitle="Top 10 markets">
              <ReportsBarChart items={rows.map((row) => ({ label: row.country, value: row.students }))} heightClass="h-56" />
            </ReportsChartCard>
            <ReportsChartCard title="Revenue by country" subtitle="KWD">
              <ReportsHBars items={rows.map((row) => ({ label: row.country, value: row.revenue }))} />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="blue">Core markets are Kuwait and Saudi Arabia; Growth markets are the rest of the GCC (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search country or city" />
          <ReportsFilterSelect label="Market" value={list.filter('market')} options={['Core', 'Growth', 'Emerging']} onChange={(v) => list.setFilter('market', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[820px]"
          columns={[
            { label: 'Country' },
            { label: 'Students', align: 'right' },
            { label: 'Revenue', align: 'right' },
            { label: 'Growth', align: 'right' },
            { label: 'Top city' },
            { label: 'Market' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No countries match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.country}</td>
              <td className={`${boldNumCellClass} text-right`}>{row.students.toLocaleString('en-US')}</td>
              <td className={`${numCellClass} text-right`}>{formatReportsKwd(row.revenue)}</td>
              <td className={`${cellClass} text-right`}>
                <GrowthCell value={row.growth} />
              </td>
              <td className={cellClass}>{row.topCity}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.market} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.country} city breakdown exported as CSV (sample).`)} className={linkAction}>
                  Export
                </button>
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="countries" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
