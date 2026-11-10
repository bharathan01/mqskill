import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { LightbulbIcon, RefreshIcon } from '@/components/ui'
import {
  superAdminOrgAllocations,
  superAdminOrgAllocationsSubtitle,
  superAdminOrgAllocationTabs,
  superAdminOrgNames,
  superAdminOrgPageSize,
  type SuperAdminOrgAllocation,
  type SuperAdminOrgAllocationStatus,
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

const ALL_ORGS = 'All organizations'

const countStatus = (list: SuperAdminOrgAllocation[], status: SuperAdminOrgAllocationStatus) =>
  list.filter((row) => row.status === status).length
const baseUpgrades = countStatus(superAdminOrgAllocations, 'Upgrade available')
const baseLocked = countStatus(superAdminOrgAllocations, 'Locked')

export function AdminOrganizationVersionAllocationsPage() {
  const [rows, setRows] = useState<SuperAdminOrgAllocation[]>(superAdminOrgAllocations)
  const [tab, setTab] = useState<'all' | SuperAdminOrgAllocationStatus>('all')
  const [query, setQuery] = useState('')
  const [org, setOrg] = useState(ALL_ORGS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo(
    () => [
      { id: 'allocations', label: 'Allocations', value: '412', detail: 'organization × course versions' },
      { id: 'upgrades', label: 'Upgrades available', value: String(23 + countStatus(rows, 'Upgrade available') - baseUpgrades), detail: 'newer version published' },
      { id: 'locked', label: 'Locked versions', value: String(61 + countStatus(rows, 'Locked') - baseLocked), detail: 'pinned at purchase' },
    ],
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (org !== ALL_ORGS && row.org !== org) return false
      if (!needle) return true
      return `${row.org} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [org, query, rows, tab])

  const pendingUpgrades = rows.filter((row) => row.status === 'Upgrade available')
  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const upgrade = (row: SuperAdminOrgAllocation) => {
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, version: item.latest, status: 'Upgraded' } : item)),
    )
    setNotice(`${row.org} upgraded from ${row.version} to ${row.latest} for ${row.course} (sample).`)
  }

  const upgradeAll = () => {
    if (!pendingUpgrades.length) {
      setNotice('No allocations have an upgrade available.')
      return
    }
    setRows((current) =>
      current.map((item) => (item.status === 'Upgrade available' ? { ...item, version: item.latest, status: 'Upgraded' } : item)),
    )
    setNotice(`${pendingUpgrades.length} allocations upgraded to the latest version (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Course Version Allocations"
        subtitle={superAdminOrgAllocationsSubtitle}
        actions={
          <>
            <button type="button" onClick={upgradeAll} className={btnOutline}>
              Upgrade all available
            </button>
            <button type="button" onClick={() => setNotice('Allocate version form opened (sample).')} className={btnPrimary}>
              Allocate version
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgAllocationTabs}
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
            placeholder="Search organization or course"
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
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Course</th>
                  <th className={thClass}>Allocated version</th>
                  <th className={thClass}>Latest</th>
                  <th className={`${thClass} text-right`}>Seats</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.org}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-sm font-semibold tabular-nums text-navy">{row.version}</td>
                    <td className="px-3 py-3.5 text-sm tabular-nums text-slate-600">{row.latest}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.seats.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Upgrade available' ? (
                        <button type="button" onClick={() => upgrade(row)} className={linkAction}>
                          Upgrade to latest
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No allocations match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="allocations" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<RefreshIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Pending upgrades" subtitle="Newer versions waiting">
            {pendingUpgrades.length ? (
              <ul className="space-y-2.5">
                {pendingUpgrades.slice(0, 4).map((row) => (
                  <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-semibold text-navy">{row.org}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{row.course}</p>
                    <p className="mt-1 text-xs font-semibold text-brand">
                      {row.version} → {row.latest}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Every allocation is on its latest version.</p>
            )}
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Seats belong to one course version. Upgrading moves every assigned seat to the latest version and keeps learner progress.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
