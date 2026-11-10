import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { ChartIcon, LightbulbIcon } from '@/components/ui'
import {
  superAdminOrgPageSize,
  superAdminOrgShort,
  superAdminOrgTraining,
  superAdminOrgTrainingSubtitle,
  superAdminOrgTrainingTabs,
  type SuperAdminOrgTraining,
  type SuperAdminOrgTrainingStatus,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
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

export function AdminOrganizationTrainingPage() {
  const [tab, setTab] = useState<'all' | SuperAdminOrgTrainingStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [notified, setNotified] = useState<Set<string>>(new Set())

  const rows: SuperAdminOrgTraining[] = superAdminOrgTraining

  const kpis = useMemo(
    () => [
      { id: 'completion', label: 'Avg. completion', value: '64%', detail: '+4% vs last month' },
      { id: 'overdue', label: 'Overdue assignments', value: '312', detail: 'across all organizations' },
      {
        id: 'risk',
        label: 'At-risk organizations',
        value: String(9 - notified.size),
        detail: notified.size ? `${notified.size} escalated to account managers` : 'At risk or behind schedule',
      },
    ],
    [notified],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (!needle) return true
      return row.org.toLowerCase().includes(needle)
    })
  }, [query, rows, tab])

  const chart = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.completion - a.completion)
        .map((row) => ({ label: superAdminOrgShort[row.org] ?? row.org, value: row.completion })),
    [rows],
  )

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const notify = (row: SuperAdminOrgTraining) => {
    setNotified((current) => new Set(current).add(row.id))
    setNotice(`Account manager alerted about ${row.org} (${row.completion}% complete, ${row.overdue} overdue) (sample).`)
  }

  const notifyAll = () => {
    const targets = rows.filter((row) => row.status !== 'On track' && !notified.has(row.id))
    if (!targets.length) {
      setNotice('Every at-risk organization has already been escalated.')
      return
    }
    setNotified((current) => new Set([...current, ...targets.map((row) => row.id)]))
    setNotice(`Account managers alerted about ${targets.length} organizations (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Employee Training Progress"
        subtitle={superAdminOrgTrainingSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Training progress exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={notifyAll} className={btnPrimary}>
              Notify account managers
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgTrainingTabs}
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
            placeholder="Search organization"
          />

          <div className="overflow-x-auto">
            <table className="min-w-[880px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={`${thClass} text-right`}>Enrolled</th>
                  <th className={thClass}>Completion</th>
                  <th className={`${thClass} text-right`}>Overdue</th>
                  <th className={`${thClass} text-right`}>Avg. score</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.org}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.enrolled.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${row.completion}%` }} />
                        </div>
                        <span className="text-sm tabular-nums text-slate-600">{row.completion}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.overdue}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.score}%</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'On track' ? (
                        <span className="text-sm text-slate-300">—</span>
                      ) : (
                        <button type="button" disabled={notified.has(row.id)} onClick={() => notify(row)} className={linkAction}>
                          {notified.has(row.id) ? 'Notified' : 'Notify account manager'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No organizations match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="organizations" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<ChartIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Completion by organization" subtitle="Percent of assigned training completed">
            <OrgBarChart items={chart} suffix="%" heightClass="h-44" />
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Organizations under 50% completion with 20+ overdue assignments are flagged for an account manager call.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
