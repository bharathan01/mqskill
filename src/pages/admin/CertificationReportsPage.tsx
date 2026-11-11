import { useMemo } from 'react'
import {
  formatReportsChange,
  reportsChange,
  reportsTrendFor,
  superAdminCertificationMonths,
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
  firstCellClass,
  linkAction,
  numCellClass,
  toolbarClass,
  trClass,
  useReportList,
} from './reportsShared'

export function AdminCertificationReportsPage() {
  const rows = useMemo(
    () =>
      superAdminCertificationMonths
        .map((item, index, all) => {
          const prev = all[index - 1]
          return { ...item, trend: prev ? reportsTrendFor(reportsChange(item.issued, prev.issued), 3) : 'Stable' }
        })
        .reverse(),
    [],
  )

  const list = useReportList(rows, (row) => row.month, [{ key: 'trend', test: (row, value) => row.trend === value }])
  const { setNotice } = list

  const last = superAdminCertificationMonths[superAdminCertificationMonths.length - 1]
  const prev = superAdminCertificationMonths[superAdminCertificationMonths.length - 2]
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'issued', label: 'Issued (Oct)', value: String(last.issued), detail: `${formatReportsChange(reportsChange(last.issued, prev.issued))} vs Sep` },
    { id: 'verifications', label: 'Verifications', value: last.verifications.toLocaleString('en-US'), detail: `${formatReportsChange(reportsChange(last.verifications, prev.verifications))} vs Sep` },
    { id: 'expiring', label: 'Expiring in 60 days', value: String(last.expiring), detail: 'Renewal reminders queued' },
  ]

  const chart = superAdminCertificationMonths.map((item) => ({ label: item.short, value: item.issued }))
  const peak = [...superAdminCertificationMonths].sort((a, b) => b.issued - a.issued)[0]

  return (
    <ReportsPageShell
      page="Certification Reports"
      subtitle="Certificates issued, verified and expiring by month."
      exportNotice="Certification reports exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Issued, verified and expiring" subtitle="Nov 2025 to Oct 2026">
              <ReportsLineChart
                points={superAdminCertificationMonths.map((item) => ({
                  label: item.short,
                  values: [item.issued, item.verifications, item.expiring],
                }))}
                series={[
                  { label: 'Issued', color: '#102A4C' },
                  { label: 'Verifications', color: '#2563EB' },
                  { label: 'Expiring', color: '#F59E0B' },
                ]}
              />
            </ReportsChartCard>
            <ReportsChartCard title="Certificates issued" subtitle={`Peak: ${peak.month} · ${peak.issued}`}>
              <ReportsBarChart items={chart} heightClass="h-56" />
            </ReportsChartCard>
          </div>
        }
        rail={<ReportsNote tone="blue">Trend compares certificates issued with the previous month; a change within ±3% is Stable (sample).</ReportsNote>}
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search month" />
          <ReportsFilterSelect label="Trend" value={list.filter('trend')} options={['Growing', 'Stable', 'Declining']} onChange={(v) => list.setFilter('trend', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[780px]"
          columns={[
            { label: 'Month' },
            { label: 'Issued', align: 'right' },
            { label: 'Verifications', align: 'right' },
            { label: 'Revoked', align: 'right' },
            { label: 'Expiring', align: 'right' },
            { label: 'Trend' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No months match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.month}</td>
              <td className={`${boldNumCellClass} text-right`}>{row.issued.toLocaleString('en-US')}</td>
              <td className={`${numCellClass} text-right`}>{row.verifications.toLocaleString('en-US')}</td>
              <td className={`${numCellClass} text-right`}>{row.revoked}</td>
              <td className={`${numCellClass} text-right`}>{row.expiring}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.trend} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`${row.month} certification report exported as CSV (sample).`)} className={linkAction}>
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
