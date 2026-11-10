import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { AlertTriangleIcon, ArrowUpIcon, SearchIcon } from '@/components/ui'
import {
  superAdminQuizAlerts,
  superAdminQuizFlagStats,
  superAdminQuizKpis,
  superAdminQuizPageSize,
  superAdminQuizRows,
  superAdminQuizTotal,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'

export function AdminModuleQuizzesPage() {
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All courses')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const courses = useMemo(
    () => ['All courses', ...Array.from(new Set(superAdminQuizRows.map((row) => row.course)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminQuizRows.filter((row) => {
      if (course !== 'All courses' && row.course !== course) return false
      if (!needle) return true
      return `${row.quiz} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, query])

  const pageCount = Math.max(1, Math.ceil(Math.max(filtered.length, superAdminQuizTotal) / superAdminQuizPageSize))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice(0, superAdminQuizPageSize)

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Assessments & Quizzes
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Module Quizzes</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Module Quizzes</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-500">
            Quizzes at the end of each module. Content Admins build them; you monitor how learners perform.
          </p>
        </div>
        <button type="button" onClick={() => setNotice('Quiz performance exported (sample).')} className={btnOutline}>
          Export
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {superAdminQuizKpis.map((kpi) => (
          <article key={kpi.id} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
            {kpi.detail ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ArrowUpIcon className="h-3 w-3" />
                {kpi.detail}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ContentTextInput
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search quiz or module…"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Course"
              value={course}
              onChange={(event) => {
                setCourse(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[12rem]"
            >
              {courses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
            <ContentSelect aria-label="Version" defaultValue="All versions" className="!h-10 lg:max-w-[10rem]">
              <option>All versions</option>
              <option>Latest only</option>
            </ContentSelect>
            <ContentSelect aria-label="Status" defaultValue="Any status" className="!h-10 lg:max-w-[10rem]">
              <option>Any status</option>
              <option>Live</option>
              <option>Draft</option>
              <option>Paused</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-2.5 font-semibold">Quiz</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Questions</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Attempts</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Average score</th>
                  <th className="px-3 py-2.5 font-semibold text-right">First-try pass</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Avg time</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.quiz}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {row.course} {row.version}
                      </p>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.questions}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      {row.attempts.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.avgScore}%</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.firstTryPass}%</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.avgTimeMin} min</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            <span>
              Showing {pageRows.length} of {superAdminQuizTotal} quizzes
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
              >
                ‹
              </button>
              <span className="px-2 font-semibold text-navy">{safePage}</span>
              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Lowest first-try pass rates</h2>
            <ul className="mt-4 space-y-3">
              {superAdminQuizAlerts.map((item) => (
                <li key={item.id} className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className={`${cardClass} p-5`}>
            <div className="flex items-start gap-2">
              <AlertTriangleIcon className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <h2 className="text-base font-bold text-navy">Flagged questions</h2>
                <p className="mt-0.5 text-sm text-slate-500">Reported by learners as unclear or incorrect</p>
              </div>
            </div>
            <dl className="mt-4 space-y-3">
              {superAdminQuizFlagStats.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-slate-500">{item.label}</dt>
                  <dd className="font-semibold text-navy">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}
