import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { ChartIcon, TrophyIcon } from '@/components/ui'
import {
  superAdminOrgCompletionTrend,
  superAdminOrgPageSize,
  superAdminOrgPerformance,
  superAdminOrgPerformanceSubtitle,
  superAdminOrgPerformanceTabs,
  superAdminOrgScoreTrend,
  superAdminOrgShort,
  type SuperAdminOrgPerformanceRow,
  type SuperAdminOrgTier,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  linkAction,
  OrgBarChart,
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

type TrendMetric = 'completion' | 'score'

const orgOptions = superAdminOrgPerformance.map((row) => row.org)

const compareMetrics: { label: string; read: (row: SuperAdminOrgPerformanceRow) => number; format: (value: number) => string }[] = [
  { label: 'Completion rate', read: (r) => r.completion, format: (v) => `${v}%` },
  { label: 'Avg. score', read: (r) => r.score, format: (v) => `${v}%` },
  { label: 'Hours / employee', read: (r) => r.hours, format: (v) => v.toFixed(1) },
  { label: 'Certificates', read: (r) => r.certificates, format: (v) => v.toLocaleString('en-US') },
]

export function AdminOrganizationPerformancePage() {
  const [tab, setTab] = useState<'all' | SuperAdminOrgTier>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [metric, setMetric] = useState<TrendMetric>('completion')
  const [compareA, setCompareA] = useState(orgOptions[0])
  const [compareB, setCompareB] = useState(orgOptions[7])

  const rows = superAdminOrgPerformance

  const kpis = useMemo(() => {
    const avgCompletion = Math.round(rows.reduce((sum, row) => sum + row.completion, 0) / rows.length)
    const avgHours = rows.reduce((sum, row) => sum + row.hours, 0) / rows.length
    return [
      { id: 'completion', label: 'Avg. completion', value: `${avgCompletion}%`, detail: 'across sampled organizations' },
      { id: 'hours', label: 'Avg. learning hours / employee', value: avgHours.toFixed(1), detail: '+0.6 vs last month' },
      { id: 'top', label: 'Top performer', value: rows[0].org, detail: `${rows[0].completion}% completion` },
    ]
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.tier !== tab) return false
      if (!needle) return true
      return row.org.toLowerCase().includes(needle)
    })
  }, [query, rows, tab])

  const completionByOrg = useMemo(
    () => rows.map((row) => ({ label: superAdminOrgShort[row.org] ?? row.org, value: row.completion })),
    [rows],
  )

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const orgA = rows.find((row) => row.org === compareA) ?? rows[0]
  const orgB = rows.find((row) => row.org === compareB) ?? rows[1]
  const trend = metric === 'completion' ? superAdminOrgCompletionTrend : superAdminOrgScoreTrend

  const compare = (row: SuperAdminOrgPerformanceRow) => {
    setCompareB(row.org)
    setNotice(`${row.org} loaded into the comparison panel (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Organization Performance Analytics"
        subtitle={superAdminOrgPerformanceSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Performance report exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('Comparison saved to your dashboard (sample).')} className={btnPrimary}>
              Compare organizations
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <ChartIcon className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <h2 className="text-base font-bold text-navy">Platform trend</h2>
                <p className="mt-0.5 text-sm text-slate-500">Monthly average across organizations</p>
              </div>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
              {(['completion', 'score'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMetric(id)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${metric === id ? 'bg-brand text-white' : 'text-slate-500 hover:text-navy'}`}
                >
                  {id === 'completion' ? 'Completion' : 'Avg. score'}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <OrgBarChart items={trend} suffix="%" color={metric === 'completion' ? '#2563EB' : '#10B981'} heightClass="h-48" />
          </div>
        </section>

        <section className={`${cardClass} p-5`}>
          <div className="flex items-start gap-2">
            <TrophyIcon className="mt-0.5 h-4 w-4 text-brand" />
            <div>
              <h2 className="text-base font-bold text-navy">Completion rate by organization</h2>
              <p className="mt-0.5 text-sm text-slate-500">Ranked from top performer down</p>
            </div>
          </div>
          <div className="mt-4">
            <OrgBarChart items={completionByOrg} suffix="%" heightClass="h-48" />
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgPerformanceTabs}
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
                  <th className={thClass}>Completion rate</th>
                  <th className={`${thClass} text-right`}>Avg. score</th>
                  <th className={`${thClass} text-right`}>Hours / employee</th>
                  <th className={`${thClass} text-right`}>Certificates</th>
                  <th className={thClass}>Tier</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.org}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${row.completion}%` }} />
                        </div>
                        <span className="text-sm tabular-nums text-slate-600">{row.completion}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.score}%</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.hours.toFixed(1)}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.certificates.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.tier} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <button type="button" onClick={() => compare(row)} className={linkAction}>
                        Compare
                      </button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No organizations match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="organizations" onPage={setPage} />
        </section>

        <OrgSideCard icon={<TrophyIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Compare organizations" subtitle="Pick two to see them side by side">
          <div className="space-y-2.5">
            <OrgSelect label="Organization A" value={compareA} options={orgOptions} onChange={setCompareA} />
            <OrgSelect label="Organization B" value={compareB} options={orgOptions} onChange={setCompareB} />
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="pb-2 font-semibold">Metric</th>
                <th className="pb-2 text-right font-semibold">{superAdminOrgShort[orgA.org] ?? orgA.org}</th>
                <th className="pb-2 text-right font-semibold">{superAdminOrgShort[orgB.org] ?? orgB.org}</th>
              </tr>
            </thead>
            <tbody>
              {compareMetrics.map((item) => {
                const a = item.read(orgA)
                const b = item.read(orgB)
                return (
                  <tr key={item.label} className="border-t border-slate-100">
                    <td className="py-2 text-slate-500">{item.label}</td>
                    <td className={`py-2 text-right tabular-nums ${a >= b ? 'font-bold text-navy' : 'text-slate-500'}`}>{item.format(a)}</td>
                    <td className={`py-2 text-right tabular-nums ${b >= a ? 'font-bold text-navy' : 'text-slate-500'}`}>{item.format(b)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </OrgSideCard>
      </div>
    </div>
  )
}
