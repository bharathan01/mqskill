import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentBadge, ContentSelect } from '@/components/common'
import { BookIcon, PlusIcon } from '@/components/ui'
import {
  filterRecentlyAdded,
  formatInsightDate,
  formatInsightKwd,
  superAdminRecentlyAddedCategories,
  superAdminRecentlyAddedKpis,
  superAdminRecentlyAddedRanges,
  superAdminRecentlyAddedStatuses,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnPrimary, cardClass } from './catalogUtils'

export function AdminRecentlyAddedCoursesPage() {
  const [rangeId, setRangeId] = useState<(typeof superAdminRecentlyAddedRanges)[number]['id']>('90d')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState<(typeof superAdminRecentlyAddedStatuses)[number]>('Any status')
  const rows = useMemo(
    () => filterRecentlyAdded(rangeId, category, status),
    [category, rangeId, status],
  )

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Course Management
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Recently Added Courses</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Recently Added Courses</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Courses created in the last 90 days and how they’ve performed since launch.
          </p>
        </div>
        <Link to={paths.admin.createCourse} className={btnPrimary}>
          <PlusIcon className="h-4 w-4" />
          Create course
        </Link>
      </header>

      <section className={`${cardClass} p-3.5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Period">
            {superAdminRecentlyAddedRanges.map((item) => {
              const active = rangeId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRangeId(item.id)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="min-w-[10rem] lg:max-w-[13rem]">
            <ContentSelect
              aria-label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="!h-10"
            >
              {superAdminRecentlyAddedCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>
          <div className="min-w-[10rem] lg:max-w-[12rem]">
            <ContentSelect
              aria-label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="!h-10"
            >
              {superAdminRecentlyAddedStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {superAdminRecentlyAddedKpis.map((kpi) => (
          <article key={kpi.id} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-[28px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
            <p className="mt-2 text-xs text-slate-400">{kpi.detail}</p>
          </article>
        ))}
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-4 py-2.5 font-semibold">Course</th>
                <th className="px-3 py-2.5 font-semibold">Added</th>
                <th className="px-3 py-2.5 font-semibold">Added by</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold text-right">B2C price</th>
                <th className="px-3 py-2.5 font-semibold text-right">Learners so far</th>
                <th className="px-3 py-2.5 font-semibold text-right">Revenue so far</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand">
                        <BookIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-navy">{row.course}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {row.category}
                          {row.note ? ` · ${row.note}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formatInsightDate(row.added)}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                        {row.byInitials}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-navy">{row.byName}</p>
                        <p className="text-xs text-slate-400">{row.byRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm font-medium tabular-nums text-navy">
                    {formatInsightKwd(row.price, 3)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                    {row.learners == null ? (
                      <span className="text-slate-400">Not live</span>
                    ) : (
                      row.learners.toLocaleString('en-US')
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm font-medium tabular-nums text-navy">
                    {row.revenue == null ? (
                      <span className="font-normal text-slate-400">Not live</span>
                    ) : (
                      formatInsightKwd(row.revenue)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">No courses match these filters.</div>
        ) : (
          <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            Showing {rows.length} course{rows.length === 1 ? '' : 's'}
          </div>
        )}
      </section>
    </div>
  )
}
