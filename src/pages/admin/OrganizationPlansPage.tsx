import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { CalendarIcon, LightbulbIcon } from '@/components/ui'
import {
  formatOrgDate,
  formatOrgKwd,
  superAdminOrgPageSize,
  superAdminOrgPlans,
  superAdminOrgPlansSubtitle,
  superAdminOrgPlanTabs,
  superAdminOrgPlanTiers,
  type SuperAdminOrgPlanRow,
  type SuperAdminOrgPlanStatus,
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

const arrOf = (list: SuperAdminOrgPlanRow[]) =>
  list.filter((row) => row.status !== 'Expired').reduce((sum, row) => sum + row.fee, 0)
const sampleArr = arrOf(superAdminOrgPlans)
const sampleRenewing = superAdminOrgPlans.filter((row) => row.status === 'Expiring').length

const nextYear = (iso: string) => `${Number(iso.slice(0, 4)) + 1}${iso.slice(4)}`

export function AdminOrganizationPlansPage() {
  const [rows, setRows] = useState<SuperAdminOrgPlanRow[]>(superAdminOrgPlans)
  const [tab, setTab] = useState<'all' | SuperAdminOrgPlanStatus>('all')
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState('All plans')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [quoted, setQuoted] = useState<Set<string>>(new Set())

  const kpis = useMemo(() => {
    const renewing = rows.filter((row) => row.status === 'Expiring').length
    const arr = arrOf(rows)
    return [
      { id: 'enterprise', label: 'Enterprise', value: String(24), detail: 'organizations on Enterprise' },
      { id: 'business', label: 'Business', value: String(71), detail: 'organizations on Business' },
      { id: 'renewing', label: 'Renewing in 60 days', value: String(19 + renewing - sampleRenewing), detail: 'plans need a renewal quote' },
      { id: 'arr', label: 'ARR', value: formatOrgKwd(318400 + arr - sampleArr), detail: '+14% vs last year' },
    ]
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (tier !== 'All plans' && row.plan !== tier) return false
      if (!needle) return true
      return `${row.org} ${row.plan}`.toLowerCase().includes(needle)
    })
  }, [query, rows, tab, tier])

  const upcoming = useMemo(
    () => rows.filter((row) => row.status === 'Expiring').sort((a, b) => a.renewal.localeCompare(b.renewal)),
    [rows],
  )

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const renew = (row: SuperAdminOrgPlanRow) => {
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, status: 'Active', renewal: nextYear(item.renewal) } : item)),
    )
    setNotice(`${row.org} renewed on the ${row.plan} plan for another year (sample).`)
  }

  const sendQuote = (row: SuperAdminOrgPlanRow) => {
    setQuoted((current) => new Set(current).add(row.id))
    setNotice(`Renewal quote of ${formatOrgKwd(row.fee)} sent to ${row.org} (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Organization Plans"
        subtitle={superAdminOrgPlansSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Plan list exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('New plan form opened (sample).')} className={btnPrimary}>
              Add plan
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgPlanTabs}
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
            placeholder="Search organization or plan"
          >
            <OrgSelect
              label="Plan"
              value={tier}
              options={superAdminOrgPlanTiers}
              onChange={(value) => {
                setTier(value)
                setPage(1)
              }}
            />
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Plan</th>
                  <th className={`${thClass} text-right`}>Seats</th>
                  <th className={`${thClass} text-right`}>Annual fee</th>
                  <th className={thClass}>Renewal</th>
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
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.plan} />
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.seats.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{formatOrgKwd(row.fee)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatOrgDate(row.renewal)}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Active' ? (
                        <span className="text-sm text-slate-300">—</span>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          <button type="button" onClick={() => renew(row)} className={linkAction}>
                            Renew
                          </button>
                          <button type="button" disabled={quoted.has(row.id)} onClick={() => sendQuote(row)} className={linkAction}>
                            {quoted.has(row.id) ? 'Quote sent' : 'Send renewal quote'}
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No plans match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="plans" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<CalendarIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Renewing soon" subtitle="Plans that need attention">
            {upcoming.length ? (
              <ul className="space-y-2.5">
                {upcoming.slice(0, 4).map((row) => (
                  <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-semibold text-navy">{row.org}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.plan} · {formatOrgKwd(row.fee)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand">Renews {formatOrgDate(row.renewal)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No plans are expiring soon.</p>
            )}
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Send renewal quotes at least 45 days before the renewal date to avoid lapsed access.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
