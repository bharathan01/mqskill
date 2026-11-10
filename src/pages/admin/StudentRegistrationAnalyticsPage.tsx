import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  superAdminStudentAnalyticsKpis,
  superAdminStudentAnalyticsSubtitle,
  superAdminStudentAnalyticsTip,
  superAdminStudentRegistrationRanges,
  superAdminStudentRegistrationWeeks,
  superAdminStudentSources,
} from '@/constants'
import { btnOutline, cardClass } from './catalogUtils'
import {
  StudentBarChart,
  StudentEmptyRow,
  StudentHBars,
  StudentKpiGrid,
  StudentPageHeader,
  StudentSideCard,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
} from './studentShared'

const ALL_SOURCES = 'All sources'

export function AdminStudentRegistrationAnalyticsPage() {
  const [range, setRange] = useState('12')
  const [source, setSource] = useState(ALL_SOURCES)
  const [notice, setNotice] = useState<string | null>(null)

  const weeks = useMemo(() => {
    const count = superAdminStudentRegistrationRanges.find((item) => item.id === range)?.weeks ?? 12
    return superAdminStudentRegistrationWeeks.slice(-count)
  }, [range])

  const rows = useMemo(
    () => weeks.filter((row) => source === ALL_SOURCES || row.source === source).reverse(),
    [source, weeks],
  )

  const chartItems = weeks.map((row) => ({ label: `W${row.week}`, value: row.registrations }))
  const best = weeks.reduce((top, row) => (row.registrations > top.registrations ? row : top), weeks[0])
  const low = weeks.reduce((bottom, row) => (row.registrations < bottom.registrations ? row : bottom), weeks[0])

  const sources = useMemo(() => {
    const counts = new Map<string, number>()
    weeks.forEach((row) => counts.set(row.source, (counts.get(row.source) ?? 0) + row.registrations))
    return Array.from(counts, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [weeks])

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Registration Analytics"
        subtitle={superAdminStudentAnalyticsSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Registration analytics exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={superAdminStudentAnalyticsKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <section className={`${cardClass} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-navy">Weekly registrations</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Peak W{best?.week} · {best?.registrations} · lowest W{low?.week} · {low?.registrations}
                </p>
              </div>
              <ContentSelect
                aria-label="Range"
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="!h-10 min-w-[10rem]"
              >
                {superAdminStudentRegistrationRanges.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </ContentSelect>
            </div>
            <div className="mt-5">
              <StudentBarChart items={chartItems} showValues heightClass="h-52" />
            </div>
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <div className={toolbarClass}>
              <p className="min-w-0 flex-1 text-sm font-semibold text-navy">Registrations by week</p>
              <ContentSelect
                aria-label="Top source"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className="!h-10 lg:max-w-[13rem]"
              >
                <option>{ALL_SOURCES}</option>
                {superAdminStudentSources.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left">
                <thead>
                  <tr className={theadRowClass}>
                    <th className="px-4 py-2.5 font-semibold">Period</th>
                    <th className={`${thClass} text-right`}>Registrations</th>
                    <th className={`${thClass} text-right`}>Verified</th>
                    <th className={`${thClass} text-right`}>To purchase</th>
                    <th className={thClass}>Top source</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.week} className={trClass}>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-navy">Week {row.week}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{row.range}</p>
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.registrations}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                        {row.verified}
                        <span className="text-slate-400"> · {Math.round((row.verified / row.registrations) * 100)}%</span>
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.toPurchasePct}%</td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{row.source}</td>
                    </tr>
                  ))}
                  {rows.length === 0 ? <StudentEmptyRow colSpan={5}>No weeks match this source.</StudentEmptyRow> : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <StudentSideCard title="Registrations by source" subtitle="Selected range" icon={null}>
            <StudentHBars items={sources} />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentAnalyticsTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
