import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon, TrendingUpIcon } from '@/components/ui'
import {
  formatStudentKwd,
  superAdminStudentCountries,
  superAdminStudentCountriesKpis,
  superAdminStudentCountriesSubtitle,
  superAdminStudentCountriesTip,
} from '@/constants'
import { btnOutline, cardClass } from './catalogUtils'
import {
  StudentBarChart,
  StudentEmptyRow,
  StudentHBars,
  StudentKpiGrid,
  StudentPageHeader,
  StudentSearch,
  StudentSideCard,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
} from './studentShared'

type SortKey = 'students' | 'newStudents' | 'revenue' | 'growth'

const sortOptions: { id: SortKey; label: string }[] = [
  { id: 'students', label: 'Sort: Students' },
  { id: 'newStudents', label: 'Sort: New (30d)' },
  { id: 'revenue', label: 'Sort: Revenue' },
  { id: 'growth', label: 'Sort: Growth' },
]

export function AdminStudentsByCountryPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('students')
  const [notice, setNotice] = useState<string | null>(null)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminStudentCountries
      .filter((row) => !needle || `${row.country} ${row.topCourse}`.toLowerCase().includes(needle))
      .sort((a, b) => b[sort] - a[sort])
  }, [query, sort])

  const chartItems = superAdminStudentCountries.map((row) => ({ label: row.country, value: row.students }))
  const growth = [...superAdminStudentCountries]
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 4)
    .map((row) => ({ label: row.country, value: row.growth }))

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Country-Wise Students"
        subtitle={superAdminStudentCountriesSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Country report exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={superAdminStudentCountriesKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Students by country</h2>
            <p className="mt-0.5 text-sm text-slate-500">Top 10 of 34 countries · registered learners</p>
            <div className="mt-5">
              <StudentBarChart items={chartItems} showValues heightClass="h-52" />
            </div>
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <div className={toolbarClass}>
              <StudentSearch value={query} onChange={setQuery} placeholder="Search country or top course" />
              <ContentSelect
                aria-label="Sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="!h-10 lg:max-w-[12rem]"
              >
                {sortOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </ContentSelect>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-left">
                <thead>
                  <tr className={theadRowClass}>
                    <th className="px-4 py-2.5 font-semibold">Country</th>
                    <th className={`${thClass} text-right`}>Students</th>
                    <th className={`${thClass} text-right`}>New (30d)</th>
                    <th className={`${thClass} text-right`}>Active %</th>
                    <th className={`${thClass} text-right`}>Revenue</th>
                    <th className={thClass}>Top course</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.country} className={trClass}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.country}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                        {row.students.toLocaleString('en-US')}
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                        {row.newStudents.toLocaleString('en-US')}
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.activePct}%</td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                        {formatStudentKwd(row.revenue)}
                      </td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{row.topCourse}</td>
                    </tr>
                  ))}
                  {rows.length === 0 ? <StudentEmptyRow colSpan={6}>No countries match this search.</StudentEmptyRow> : null}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
              Showing {rows.length} of 34 countries
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <StudentSideCard
            icon={<TrendingUpIcon className="h-4 w-4 text-emerald-600" />}
            title="Fastest growing"
            subtitle="Learner growth, last 30 days"
          >
            <StudentHBars items={growth} color="#059669" format={(value) => `+${value}%`} />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentCountriesTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
