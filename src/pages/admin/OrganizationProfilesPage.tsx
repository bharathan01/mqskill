import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { LightbulbIcon, UsersIcon } from '@/components/ui'
import {
  superAdminOrgAccountManagers,
  superAdminOrgPageSize,
  superAdminOrgProfiles,
  superAdminOrgProfilesSubtitle,
  superAdminOrgProfileTabs,
  type SuperAdminOrgProfile,
  type SuperAdminOrgProfileStatus,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
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

const ALL_MANAGERS = 'All account managers'

export function AdminOrganizationProfilesPage() {
  const [rows, setRows] = useState<SuperAdminOrgProfile[]>(superAdminOrgProfiles)
  const [tab, setTab] = useState<'all' | SuperAdminOrgProfileStatus>('all')
  const [query, setQuery] = useState('')
  const [manager, setManager] = useState(ALL_MANAGERS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const missing = rows.filter((row) => !row.contact)

  const kpis = useMemo(
    () => [
      { id: 'profiles', label: 'Profiles', value: '186', detail: 'one per organization' },
      { id: 'missing', label: 'Missing contact', value: String(5 + missing.length), detail: 'need a primary contact' },
      { id: 'manager', label: 'With account manager', value: String(142 + rows.filter((r) => r.manager).length - 10), detail: 'of 186 profiles' },
    ],
    [rows, missing.length],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (manager !== ALL_MANAGERS && row.manager !== manager) return false
      if (!needle) return true
      return `${row.name} ${row.contact} ${row.email}`.toLowerCase().includes(needle)
    })
  }, [manager, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const patch = (row: SuperAdminOrgProfile, change: Partial<SuperAdminOrgProfile>, message: string) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, ...change } : item)))
    setNotice(message)
  }

  const assignManager = (row: SuperAdminOrgProfile) => {
    const next = superAdminOrgAccountManagers[rows.filter((item) => item.manager).length % superAdminOrgAccountManagers.length]
    patch(row, { manager: next }, `${next} assigned as account manager for ${row.name} (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Organization Profiles"
        subtitle={superAdminOrgProfilesSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Profiles exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('New profile form opened (sample).')} className={btnPrimary}>
              Add profile
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgProfileTabs}
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
            placeholder="Search organization, contact or email"
          >
            <OrgSelect
              label="Account manager"
              value={manager}
              options={[ALL_MANAGERS, ...superAdminOrgAccountManagers]}
              onChange={(value) => {
                setManager(value)
                setPage(1)
              }}
            />
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Primary contact</th>
                  <th className={thClass}>Email</th>
                  <th className={thClass}>Phone</th>
                  <th className={thClass}>Account manager</th>
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
                    <td className="px-3 py-3.5 text-sm text-slate-600">
                      {row.contact || <span className="font-semibold text-rose-600">Missing</span>}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.email || '—'}</td>
                    <td className="px-3 py-3.5 text-sm tabular-nums text-slate-600">{row.phone || '—'}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">
                      {row.manager || <span className="text-slate-400">Unassigned</span>}
                    </td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {!row.contact ? (
                        <button type="button" onClick={() => setNotice(`Contact request emailed to ${row.name} (sample).`)} className={linkAction}>
                          Request contact
                        </button>
                      ) : !row.manager ? (
                        <button type="button" onClick={() => assignManager(row)} className={linkAction}>
                          Assign manager
                        </button>
                      ) : row.status === 'Onboarding' ? (
                        <button type="button" onClick={() => patch(row, { status: 'Active' }, `${row.name} onboarding completed (sample).`)} className={linkAction}>
                          Complete onboarding
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No profiles match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="profiles" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<UsersIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Needs attention" subtitle="Profiles missing a primary contact">
            {missing.length ? (
              <ul className="space-y-2.5">
                {missing.map((row) => (
                  <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-semibold text-navy">{row.name}</p>
                    <button type="button" onClick={() => setNotice(`Contact request emailed to ${row.name} (sample).`)} className="mt-1 text-xs font-semibold text-brand hover:underline">
                      Request contact
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Every profile has a primary contact.</p>
            )}
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Assign an account manager to every Enterprise profile so renewal quotes go out on time.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
