import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { CalendarIcon, LightbulbIcon, SearchIcon } from '@/components/ui'
import {
  formatLiveDate,
  superAdminLiveClasses,
  superAdminLiveClassesKpis,
  superAdminLiveClassesPageSize,
  superAdminLiveClassesSubtitle,
  superAdminLiveClassTabs,
  superAdminLiveTip,
  type SuperAdminLiveClass,
  type SuperAdminLiveClassTabId,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  LiveEmptyRow,
  LiveKpiGrid,
  LivePageHeader,
  LivePager,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './liveShared'

export function AdminAllLiveClassesPage() {
  const [classes, setClasses] = useState<SuperAdminLiveClass[]>(superAdminLiveClasses)
  const [tab, setTab] = useState<SuperAdminLiveClassTabId>('all')
  const [query, setQuery] = useState('')
  const [instructor, setInstructor] = useState('All instructors')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const instructors = useMemo(
    () => ['All instructors', ...Array.from(new Set(superAdminLiveClasses.map((row) => row.instructor)))],
    [],
  )

  const next = useMemo(
    () =>
      classes
        .filter((row) => row.status === 'Scheduled')
        .sort((a, b) => a.isoDate.localeCompare(b.isoDate))[0],
    [classes],
  )

  const kpis = useMemo(
    () =>
      superAdminLiveClassesKpis.map((kpi) =>
        kpi.id === 'scheduled'
          ? { ...kpi, value: String(classes.filter((row) => row.status === 'Scheduled').length), detail: 'upcoming classes' }
          : kpi,
      ),
    [classes],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return classes.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (instructor !== 'All instructors' && row.instructor !== instructor) return false
      if (!needle) return true
      return `${row.title} ${row.course} ${row.instructor}`.toLowerCase().includes(needle)
    })
  }, [classes, instructor, query, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminLiveClassesPageSize)

  const setStatus = (row: SuperAdminLiveClass, status: SuperAdminLiveClass['status'], message: string) => {
    setClasses((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="All Live Classes"
        subtitle={superAdminLiveClassesSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Live class list exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <Link to={paths.admin.scheduleLive} className={btnPrimary}>
              Schedule class
            </Link>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <LiveKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3.5 pt-2">
            {superAdminLiveClassTabs.map((item) => {
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id)
                    setPage(1)
                  }}
                  className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'border-brand text-navy' : 'border-transparent text-slate-500 hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ContentTextInput
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search class, course or instructor"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Instructor"
              value={instructor}
              onChange={(event) => {
                setInstructor(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[14rem]"
            >
              {instructors.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Class</th>
                  <th className={thClass}>Instructor</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Time (AST)</th>
                  <th className={`${thClass} text-right`}>Registered</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.course}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.instructor}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatLiveDate(row.isoDate)}</td>
                    <td className="px-3 py-3.5 text-sm tabular-nums text-slate-600">{row.time}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      <span className="font-semibold text-navy">{row.registered}</span>
                      <span className="text-slate-400"> / {row.capacity}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Scheduled' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Cancelled', `“${row.title}” cancelled. Registered learners will be notified (sample).`)}
                          className={dangerAction}
                        >
                          Cancel
                        </button>
                      ) : row.status === 'Live' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Completed', `“${row.title}” marked as completed (sample).`)}
                          className={linkAction}
                        >
                          Mark completed
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <LiveEmptyRow colSpan={7}>No live classes match these filters.</LiveEmptyRow>
                ) : null}
              </tbody>
            </table>
          </div>
          <LivePager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="classes"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <div className="flex items-start gap-2">
              <CalendarIcon className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <h2 className="text-base font-bold text-navy">Next session</h2>
                <p className="mt-0.5 text-sm text-slate-500">Coming up on the calendar</p>
              </div>
            </div>
            {next ? (
              <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-sm font-semibold text-navy">{next.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{next.instructor}</p>
                <p className="mt-2 text-xs font-semibold text-brand">
                  {formatLiveDate(next.isoDate)} · {next.time} AST
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {next.registered} of {next.capacity} registered
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No sessions are scheduled.</p>
            )}
            <Link to={paths.admin.upcomingSessions} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
              View upcoming sessions
            </Link>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="flex items-start gap-2">
              <LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />
              <div>
                <h2 className="text-base font-bold text-navy">Tip</h2>
                <p className="mt-1 text-sm text-slate-500">{superAdminLiveTip}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
