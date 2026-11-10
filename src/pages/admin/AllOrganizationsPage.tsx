import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { BuildingIcon, LightbulbIcon } from '@/components/ui'
import {
  formatOrgDate,
  superAdminOrganizations,
  superAdminOrganizationsKpis,
  superAdminOrganizationsSubtitle,
  superAdminOrganizationsTip,
  superAdminOrganizationTabs,
  superAdminOrgPageSize,
  type SuperAdminOrganization,
  type SuperAdminOrgStatus,
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

const baseActive = superAdminOrganizations.filter((row) => row.status === 'Active').length

export function AdminAllOrganizationsPage() {
  const [rows, setRows] = useState<SuperAdminOrganization[]>(superAdminOrganizations)
  const [tab, setTab] = useState<'all' | SuperAdminOrgStatus>('all')
  const [query, setQuery] = useState('')
  const [plan, setPlan] = useState('All plans')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (plan !== 'All plans' && row.plan !== plan) return false
      if (!needle) return true
      return `${row.name} ${row.industry} ${row.country}`.toLowerCase().includes(needle)
    })
  }, [plan, query, rows, tab])

  const kpis = useMemo(() => {
    const added = rows.length - superAdminOrganizations.length
    const activeNow = rows.filter((row) => row.status === 'Active').length
    return superAdminOrganizationsKpis.map((kpi) => {
      if (kpi.id === 'orgs') return { ...kpi, value: String(186 + added) }
      if (kpi.id === 'active') return { ...kpi, value: String(171 + activeNow - baseActive) }
      return kpi
    })
  }, [rows])

  const newest = useMemo(() => [...rows].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 4), [rows])
  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const setStatus = (row: SuperAdminOrganization, status: SuperAdminOrgStatus, message: string) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  const addOrganization = () => {
    const id = `ORG-${1100 + rows.length}`
    setRows((current) => [
      { id, name: `New Organization ${rows.length - superAdminOrganizations.length + 1}`, industry: 'Oil & Gas', country: 'Kuwait', employees: 0, plan: 'Starter', joined: '2026-11-10', status: 'Trial' },
      ...current,
    ])
    setTab('all')
    setPage(1)
    setNotice('Organization added on a 14-day trial (sample).')
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="All Organizations"
        subtitle={superAdminOrganizationsSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Organization list exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={addOrganization} className={btnPrimary}>
              Add organization
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrganizationTabs}
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
            placeholder="Search organization, industry or country"
          >
            <OrgSelect
              label="Plan"
              value={plan}
              options={['All plans', 'Enterprise', 'Business', 'Starter']}
              onChange={(value) => {
                setPlan(value)
                setPage(1)
              }}
            />
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Industry</th>
                  <th className={thClass}>Country</th>
                  <th className={`${thClass} text-right`}>Employees</th>
                  <th className={thClass}>Plan</th>
                  <th className={thClass}>Joined</th>
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
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.industry}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.country}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.employees.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.plan}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatOrgDate(row.joined)}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Suspended' ? (
                        <button type="button" onClick={() => setStatus(row, 'Active', `${row.name} reactivated (sample).`)} className={linkAction}>
                          Activate
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          {row.status === 'Trial' ? (
                            <button type="button" onClick={() => setStatus(row, 'Active', `${row.name} converted to an active customer (sample).`)} className={linkAction}>
                              Activate
                            </button>
                          ) : null}
                          <button type="button" onClick={() => setStatus(row, 'Suspended', `${row.name} suspended. Portal access is blocked (sample).`)} className={dangerAction}>
                            Suspend
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={8}>No organizations match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="organizations" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<BuildingIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Newest organizations" subtitle="Recently onboarded customers">
            <ul className="space-y-2.5">
              {newest.map((row) => (
                <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                  <p className="text-sm font-semibold text-navy">{row.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {row.industry} · {row.plan}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-brand">Joined {formatOrgDate(row.joined)}</p>
                </li>
              ))}
            </ul>
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">{superAdminOrganizationsTip}</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
