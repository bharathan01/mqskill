import { useMemo, useState, type FormEvent } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { LightbulbIcon, UsersIcon } from '@/components/ui'
import {
  superAdminOrgEmployeeDepartments,
  superAdminOrgEmployeeKpiBase,
  superAdminOrgEmployees,
  superAdminOrgEmployeesSubtitle,
  superAdminOrgEmployeeTabs,
  superAdminOrgNames,
  superAdminOrgPageSize,
  type SuperAdminOrgEmployee,
  type SuperAdminOrgEmployeeStatus,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  OrgEmptyRow,
  OrgKpiGrid,
  OrgPageHeader,
  OrgPager,
  OrgSelect,
  OrgSideCard,
  OrgStatusBadge,
  OrgTabs,
  OrgToolbar,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './orgShared'

const ALL_ORGS = 'All organizations'
const ALL_DEPTS = 'All departments'

export function AdminOrganizationEmployeesPage() {
  const [rows, setRows] = useState<SuperAdminOrgEmployee[]>(superAdminOrgEmployees)
  const [tab, setTab] = useState<'all' | SuperAdminOrgEmployeeStatus>('all')
  const [query, setQuery] = useState('')
  const [org, setOrg] = useState(ALL_ORGS)
  const [dept, setDept] = useState(ALL_DEPTS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteOrg, setInviteOrg] = useState(superAdminOrgNames[0])

  const count = (list: SuperAdminOrgEmployee[], status: SuperAdminOrgEmployeeStatus) =>
    list.filter((row) => row.status === status).length

  const kpis = useMemo(
    () => [
      {
        id: 'employees',
        label: 'Employees',
        value: (superAdminOrgEmployeeKpiBase.employees + rows.length - superAdminOrgEmployees.length).toLocaleString('en-US'),
        detail: '+3.2% vs last month',
      },
      {
        id: 'invites',
        label: 'Pending invites',
        value: String(superAdminOrgEmployeeKpiBase.invites + count(rows, 'Invited') - count(superAdminOrgEmployees, 'Invited')),
        detail: 'awaiting acceptance',
      },
      { id: 'deactivated', label: 'Deactivated', value: String(count(rows, 'Deactivated')), detail: 'in this list' },
    ],
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (org !== ALL_ORGS && row.org !== org) return false
      if (dept !== ALL_DEPTS && row.department !== dept) return false
      if (!needle) return true
      return `${row.name} ${row.org} ${row.department}`.toLowerCase().includes(needle)
    })
  }, [dept, org, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const setStatus = (row: SuperAdminOrgEmployee, status: SuperAdminOrgEmployeeStatus, message: string) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  const invite = (event: FormEvent) => {
    event.preventDefault()
    const name = inviteName.trim()
    if (!name) {
      setNotice('Enter the employee’s name to send an invite.')
      return
    }
    setRows((current) => [
      { id: `EMP-${7100 + current.length}`, name, org: inviteOrg, department: 'Operations', assigned: 0, completed: 0, status: 'Invited' },
      ...current,
    ])
    setInviteName('')
    setInviting(false)
    setTab('all')
    setPage(1)
    setNotice(`Invite sent to ${name} at ${inviteOrg} (sample).`)
  }

  const deactivated = rows.filter((row) => row.status === 'Deactivated').length

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Employee Lists"
        subtitle={superAdminOrgEmployeesSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Employee list exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setInviting((open) => !open)} className={btnPrimary}>
              Invite employee
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {inviting ? (
        <form onSubmit={invite} className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Employee name
            <ContentTextInput value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="e.g. Hamad Al-Bader" className="mt-1.5 !h-10" />
          </label>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Organization
            <ContentSelect value={inviteOrg} onChange={(event) => setInviteOrg(event.target.value)} className="mt-1.5 !h-10">
              {superAdminOrgNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </ContentSelect>
          </label>
          <div className="flex gap-2.5">
            <button type="submit" className={btnPrimary}>
              Send invite
            </button>
            <button type="button" onClick={() => setInviting(false)} className={btnOutline}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgEmployeeTabs}
            value={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />
          <OrgToolbar
            query={query}
            onQuery={(value) => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Search employee, organization or department"
          >
            <OrgSelect
              label="Organization"
              value={org}
              options={[ALL_ORGS, ...superAdminOrgNames]}
              onChange={(value) => {
                setOrg(value)
                setPage(1)
              }}
            />
            <OrgSelect
              label="Department"
              value={dept}
              options={superAdminOrgEmployeeDepartments}
              onChange={(value) => {
                setDept(value)
                setPage(1)
              }}
            />
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Employee</th>
                  <th className={thClass}>Organization</th>
                  <th className={thClass}>Department</th>
                  <th className={`${thClass} text-right`}>Courses assigned</th>
                  <th className={`${thClass} text-right`}>Completed</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.org}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.department}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.assigned}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.completed}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Deactivated' ? (
                        <button type="button" onClick={() => setStatus(row, 'Active', `${row.name} reactivated (sample).`)} className={linkAction}>
                          Reactivate
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          {row.status === 'Invited' ? (
                            <button type="button" onClick={() => setNotice(`Invite re-sent to ${row.name} (sample).`)} className={linkAction}>
                              Resend invite
                            </button>
                          ) : null}
                          <button type="button" onClick={() => setStatus(row, 'Deactivated', `${row.name} deactivated (sample).`)} className={dangerAction}>
                            Deactivate
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No employees match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="employees" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<UsersIcon className="mt-0.5 h-4 w-4 text-brand" />} title="List summary" subtitle="Across the current sample">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Active</dt>
                <dd className="font-semibold text-navy">{count(rows, 'Active')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Invited</dt>
                <dd className="font-semibold text-navy">{count(rows, 'Invited')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Deactivated</dt>
                <dd className="font-semibold text-navy">{deactivated}</dd>
              </div>
            </dl>
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Deactivating an employee frees their seat so it can be reassigned to another learner.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
