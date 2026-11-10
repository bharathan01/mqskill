import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { ChartIcon, LightbulbIcon } from '@/components/ui'
import {
  superAdminOrgPageSize,
  superAdminOrgSeats,
  superAdminOrgSeatsSubtitle,
  superAdminOrgSeatsTip,
  superAdminOrgSeatStatus,
  superAdminOrgSeatTabs,
  superAdminOrgShort,
  type SuperAdminOrgSeatRow,
  type SuperAdminOrgSeatStatus,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  OrgBarChart,
  OrgEmptyRow,
  OrgKpiGrid,
  OrgPageHeader,
  OrgPager,
  OrgSideCard,
  OrgStatusBadge,
  OrgTabs,
  OrgToolbar,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './orgShared'

const total = (list: SuperAdminOrgSeatRow[], pick: (row: SuperAdminOrgSeatRow) => number) =>
  list.reduce((sum, row) => sum + pick(row), 0)

const baseline = {
  purchased: total(superAdminOrgSeats, (r) => r.purchased),
  assigned: total(superAdminOrgSeats, (r) => r.assigned),
}

export function AdminOrganizationSeatsPage() {
  const [rows, setRows] = useState<SuperAdminOrgSeatRow[]>(superAdminOrgSeats)
  const [tab, setTab] = useState<'all' | SuperAdminOrgSeatStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [nudged, setNudged] = useState<Set<string>>(new Set())

  const kpis = useMemo(() => {
    const purchased = 9420 + total(rows, (r) => r.purchased) - baseline.purchased
    const assigned = 5880 + total(rows, (r) => r.assigned) - baseline.assigned
    return [
      { id: 'purchased', label: 'Seats purchased', value: purchased.toLocaleString('en-US'), detail: 'across all organizations' },
      { id: 'assigned', label: 'Assigned', value: assigned.toLocaleString('en-US'), detail: `${Math.round((assigned / purchased) * 100)}% utilization` },
      { id: 'unused', label: 'Unused', value: (purchased - assigned).toLocaleString('en-US'), detail: 'available to reclaim' },
    ]
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && superAdminOrgSeatStatus(row) !== tab) return false
      if (!needle) return true
      return `${row.org} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [query, rows, tab])

  const chart = useMemo(
    () =>
      [...rows]
        .map((row) => ({ label: superAdminOrgShort[row.org] ?? row.org, value: row.purchased - row.assigned }))
        .sort((a, b) => b.value - a.value),
    [rows],
  )

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const reclaim = (row: SuperAdminOrgSeatRow) => {
    const unused = row.purchased - row.assigned
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, purchased: item.assigned } : item)))
    setNotice(`${unused} unused ${row.course} seats reclaimed from ${row.org} (sample).`)
  }

  const nudge = (row: SuperAdminOrgSeatRow) => {
    setNudged((current) => new Set(current).add(row.id))
    setNotice(`Utilization nudge emailed to ${row.org} (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Purchased / Assigned / Unused Seats"
        subtitle={superAdminOrgSeatsSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Seat report exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('Add seats form opened (sample).')} className={btnPrimary}>
              Add seats
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgSeatTabs}
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
          />

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Course version</th>
                  <th className={`${thClass} text-right`}>Purchased</th>
                  <th className={`${thClass} text-right`}>Assigned</th>
                  <th className={`${thClass} text-right`}>Unused</th>
                  <th className={thClass}>Utilization</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const unused = row.purchased - row.assigned
                  const utilization = Math.round((row.assigned / row.purchased) * 100)
                  const status = superAdminOrgSeatStatus(row)
                  return (
                    <tr key={row.id} className={trClass}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.org}</td>
                      <td className="px-3 py-3.5">
                        <p className="text-sm text-slate-600">{row.course}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{row.version}</p>
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.purchased.toLocaleString('en-US')}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.assigned.toLocaleString('en-US')}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{unused.toLocaleString('en-US')}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-brand" style={{ width: `${utilization}%` }} />
                          </div>
                          <span className="text-sm tabular-nums text-slate-600">{utilization}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <OrgStatusBadge value={status} />
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <span className="inline-flex items-center gap-3">
                          {status === 'Low usage' ? (
                            <button type="button" disabled={nudged.has(row.id)} onClick={() => nudge(row)} className={linkAction}>
                              {nudged.has(row.id) ? 'Nudge sent' : 'Send nudge'}
                            </button>
                          ) : null}
                          {unused > 0 ? (
                            <button type="button" onClick={() => reclaim(row)} className={dangerAction}>
                              Reclaim unused
                            </button>
                          ) : status === 'Full' ? (
                            <span className="text-sm text-slate-300">—</span>
                          ) : null}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={8}>No seat allocations match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="allocations" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<ChartIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Unused seats" subtitle="By organization">
            <OrgBarChart items={chart} heightClass="h-44" />
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Seat rules">
            <p className="text-sm text-slate-500">{superAdminOrgSeatsTip}</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
