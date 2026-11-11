import { useState } from 'react'
import { formatReportsKwd, superAdminOrgAnalyticsRows, type SuperAdminOrgAnalyticsRow, type SuperAdminReportsKpi } from '@/constants'
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
  updateById,
  useReportList,
} from './reportsShared'

export function AdminOrganizationAnalyticsPage() {
  const [rows, setRows] = useState<SuperAdminOrgAnalyticsRow[]>(superAdminOrgAnalyticsRows)
  const list = useReportList(rows, (row) => row.org, [{ key: 'risk', test: (row, value) => row.risk === value }])
  const { setNotice } = list

  const flagged = rows.filter((row, index) => row.risk === 'High' && superAdminOrgAnalyticsRows[index].risk !== 'High').length
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'orgs', label: 'Organizations', value: '186', detail: 'Active B2B accounts' },
    { id: 'util', label: 'Avg. seat utilization', value: '62%', detail: 'Across all organizations' },
    { id: 'risk', label: 'Renewal risk', value: String(9 + flagged), detail: 'Organizations rated High' },
  ]

  return (
    <ReportsPageShell
      page="Organization Reports"
      subtitle="Seat utilization, training completion and renewal risk per organization."
      exportNotice="Organization analytics exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Seat utilization" subtitle="Percent of purchased seats in use">
              <ReportsBarChart items={rows.map((row) => ({ label: row.org.split(' ')[0], value: row.utilization }))} heightClass="h-56" />
            </ReportsChartCard>
            <ReportsChartCard title="Completion" subtitle="By organization">
              <ReportsHBars items={rows.map((row) => ({ label: row.org, value: row.completion }))} format={(value) => `${value}%`} />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="amber">Organizations below 50% utilization are usually the first to churn at renewal (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search organization" />
          <ReportsFilterSelect label="Renewal risk" value={list.filter('risk')} options={['Low', 'Medium', 'High']} onChange={(v) => list.setFilter('risk', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[900px]"
          columns={[
            { label: 'Organization' },
            { label: 'Seats', align: 'right' },
            { label: 'Utilization', align: 'right' },
            { label: 'Completion', align: 'right' },
            { label: 'Revenue (YTD)', align: 'right' },
            { label: 'Renewal risk' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No organizations match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.org}</td>
              <td className={`${numCellClass} text-right`}>{row.seats.toLocaleString('en-US')}</td>
              <td className={`${boldNumCellClass} text-right`}>{row.utilization}%</td>
              <td className={`${cellClass} text-right tabular-nums`}>{row.completion}%</td>
              <td className={`${numCellClass} text-right`}>{formatReportsKwd(row.revenue)}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.risk} />
              </td>
              <td className="px-3 py-3.5 text-right">
                {row.risk === 'High' ? (
                  <span className="text-xs font-semibold text-slate-400">Flagged</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRows((current) => updateById(current, row.id, { risk: 'High' }))
                      setNotice(`${row.org} flagged for the account manager (sample).`)
                    }}
                    className={linkAction}
                  >
                    Flag for account manager
                  </button>
                )}
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="organizations" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
