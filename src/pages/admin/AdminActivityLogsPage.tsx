import { useMemo } from 'react'
import {
  formatReportsDate,
  superAdminActivityHours,
  superAdminActivityLogs,
  superAdminActivityModules,
} from '@/constants'
import {
  cellClass,
  countBy,
  firstCellClass,
  linkAction,
  StatusBadge,
  toolbarClass,
  trClass,
  UsersBarChart,
  UsersChartCard,
  UsersChartGrid,
  UsersFilterSelect,
  UsersLayout,
  UsersLineChart,
  UsersNote,
  UsersPager,
  UsersPageShell,
  UsersSearch,
  UsersTable,
  useUsersList,
  usersKpi,
} from './usersShared'

const rows = superAdminActivityLogs
const RESULTS = ['Success', 'Failed'] as const
const ADMINS = [...new Set(rows.map((row) => row.admin))]

export function AdminActivityLogsPage() {
  const list = useUsersList(rows, (row) => `${row.admin} ${row.action} ${row.ip}`, [
    { key: 'result', test: (row, value) => row.result === value },
    { key: 'module', test: (row, value) => row.module === value },
    { key: 'admin', test: (row, value) => row.admin === value },
  ])
  const { setNotice } = list

  const total = superAdminActivityHours.reduce((sum, item) => sum + item.value, 0)
  const peak = superAdminActivityHours.reduce((best, item) => (item.value > best.value ? item : best))

  const kpis = useMemo(() => {
    const failed = rows.filter((row) => row.result === 'Failed').length
    const byAdmin = ADMINS.map((admin) => ({ admin, count: rows.filter((row) => row.admin === admin).length })).sort((a, b) => b.count - a.count)
    return [
      usersKpi('actions', 'Actions (24h)', String(total), `Peak at ${peak.label}:00 with ${peak.value} actions`),
      usersKpi('failed', 'Failed actions', String(failed), 'In the entries listed below'),
      usersKpi('active', 'Most active', byAdmin[0].admin, `${byAdmin[0].count} logged entries`),
    ]
  }, [total, peak])

  const byModule = useMemo(() => countBy(rows, superAdminActivityModules, (row) => row.module), [])

  return (
    <UsersPageShell
      page="Admin Activity Logs"
      subtitle="Who changed what across the Super Admin and Content Admin portals."
      exportNotice="Admin activity logs exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <UsersLayout
        charts={
          <UsersChartGrid>
            <UsersChartCard title="Actions by hour" subtitle="Today, hourly (Kuwait time)">
              <UsersLineChart
                fill
                points={superAdminActivityHours.map((item) => ({ label: item.label, values: [item.value] }))}
                series={[{ label: 'Actions', color: '#2563EB' }]}
              />
            </UsersChartCard>
            <UsersChartCard title="Actions by module" subtitle="Logged entries per module">
              <UsersBarChart items={byModule} showValues heightClass="h-56" color="#102A4C" />
            </UsersChartCard>
          </UsersChartGrid>
        }
        rail={<UsersNote tone="blue">Log entries are read-only and kept for 12 months. Export to CSV for audits (sample).</UsersNote>}
      >
        <div className={toolbarClass}>
          <UsersSearch value={list.query} onChange={list.setQuery} placeholder="Search admin, action or IP" />
          <UsersFilterSelect label="Result" value={list.filter('result')} options={RESULTS} onChange={(v) => list.setFilter('result', v)} />
          <UsersFilterSelect label="Module" value={list.filter('module')} options={superAdminActivityModules} onChange={(v) => list.setFilter('module', v)} />
          <UsersFilterSelect label="Admin" value={list.filter('admin')} options={ADMINS} onChange={(v) => list.setFilter('admin', v)} />
        </div>
        <UsersTable
          minWidth="min-w-[960px]"
          columns={[
            { label: 'Time' },
            { label: 'Admin' },
            { label: 'Action' },
            { label: 'Module' },
            { label: 'IP' },
            { label: 'Result' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No log entries match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>
                {formatReportsDate(row.time.slice(0, 10))} <span className="font-normal text-slate-500">{row.time.slice(11)}</span>
              </td>
              <td className={cellClass}>{row.admin}</td>
              <td className={cellClass}>{row.action}</td>
              <td className={cellClass}>{row.module}</td>
              <td className={`${cellClass} font-mono text-xs`}>{row.ip}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.result} />
              </td>
              <td className="px-3 py-3.5 text-right">
                <button type="button" onClick={() => setNotice(`Log entry “${row.action}” by ${row.admin} exported as CSV (sample).`)} className={linkAction}>
                  Export
                </button>
              </td>
            </tr>
          ))}
        </UsersTable>
        <UsersPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="entries" onPage={list.setPage} />
      </UsersLayout>
    </UsersPageShell>
  )
}
