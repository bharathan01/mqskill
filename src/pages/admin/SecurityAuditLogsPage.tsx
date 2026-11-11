import { useMemo, useState } from 'react'
import {
  formatReportsDate,
  superAdminSecurityActions,
  superAdminSecurityEvents,
  superAdminSecurityWeek,
  superAdminSeverities,
  type SuperAdminSecurityEvent,
  type SuperAdminSeverity,
} from '@/constants'
import {
  cellClass,
  countBy,
  fillNotice,
  firstCellClass,
  StatusBadge,
  toolbarClass,
  trClass,
  updateById,
  UsersChartCard,
  UsersDonut,
  UsersChartGrid,
  UsersFilterSelect,
  UsersLayout,
  UsersLineChart,
  UsersNote,
  UsersPager,
  UsersPageShell,
  UsersRowActions,
  UsersSearch,
  UsersTable,
  useUsersList,
  usersKpi,
} from './usersShared'

const EVENTS = [...new Set(superAdminSecurityEvents.map((row) => row.event))]

export function AdminSecurityAuditLogsPage() {
  const [rows, setRows] = useState<SuperAdminSecurityEvent[]>(superAdminSecurityEvents)

  const list = useUsersList(rows, (row) => `${row.event} ${row.account} ${row.ip} ${row.location}`, [
    { key: 'severity', test: (row, value) => row.severity === value },
    { key: 'event', test: (row, value) => row.event === value },
  ])
  const { setNotice } = list

  const bySeverity = useMemo(() => countBy(rows, superAdminSeverities, (row) => row.severity), [rows])
  const high = rows.filter((row) => row.severity === 'High' || row.severity === 'Critical').length

  const kpis = [
    usersKpi('events', 'Events (24h)', '86', 'Sign-ins, role changes and key rotations'),
    usersKpi('high', 'High severity', String(high), 'High and Critical events awaiting review'),
    usersKpi('blocked', 'Blocked logins', '19', 'Stopped by IP rules and lockouts'),
  ]

  return (
    <UsersPageShell
      page="Security Audit Logs"
      subtitle="Authentication events, permission changes and suspicious activity."
      exportNotice="Security audit logs exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
    >
      <UsersLayout
        charts={
          <UsersChartGrid>
            <UsersChartCard title="Security events this week" subtitle="Events per day, Mon to Sun">
              <UsersLineChart
                fill
                points={superAdminSecurityWeek.map((item) => ({ label: item.label, values: [item.value] }))}
                series={[{ label: 'Security events', color: '#E11D48' }]}
              />
            </UsersChartCard>
            <UsersChartCard title="By severity" subtitle="Events in this list by severity">
              <UsersDonut
                items={bySeverity.map((item) => ({
                  ...item,
                  color: item.label === 'Critical' ? '#E11D48' : item.label === 'High' ? '#F59E0B' : item.label === 'Medium' ? '#2563EB' : '#94A3B8',
                }))}
              />
            </UsersChartCard>
          </UsersChartGrid>
        }
        rail={<UsersNote tone="amber">Acknowledging an event marks it reviewed and lowers its severity to Low (sample).</UsersNote>}
      >
        <div className={toolbarClass}>
          <UsersSearch value={list.query} onChange={list.setQuery} placeholder="Search event, account or IP" />
          <UsersFilterSelect label="Severity" value={list.filter('severity')} options={superAdminSeverities} onChange={(v) => list.setFilter('severity', v)} />
          <UsersFilterSelect label="Event" value={list.filter('event')} options={EVENTS} onChange={(v) => list.setFilter('event', v)} />
        </div>
        <UsersTable
          minWidth="min-w-[960px]"
          columns={[
            { label: 'Time' },
            { label: 'Event' },
            { label: 'Account' },
            { label: 'IP address' },
            { label: 'Location' },
            { label: 'Severity' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No security events match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>
                {formatReportsDate(row.time.slice(0, 10))} <span className="font-normal text-slate-500">{row.time.slice(11)}</span>
              </td>
              <td className={cellClass}>{row.event}</td>
              <td className={cellClass}>{row.account}</td>
              <td className={`${cellClass} font-mono text-xs`}>{row.ip}</td>
              <td className={cellClass}>{row.location}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.severity} />
              </td>
              <td className="px-3 py-3.5">
                <UsersRowActions
                  status={row.severity}
                  actions={superAdminSecurityActions}
                  onAct={(action) => {
                    setRows((current) => updateById(current, row.id, { severity: action.to as SuperAdminSeverity }))
                    setNotice(fillNotice(action.notice, row.account, `${row.event} acknowledged.`))
                  }}
                />
              </td>
            </tr>
          ))}
        </UsersTable>
        <UsersPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="events" onPage={list.setPage} />
      </UsersLayout>
    </UsersPageShell>
  )
}
