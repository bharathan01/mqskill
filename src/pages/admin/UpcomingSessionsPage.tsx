import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { CalendarIcon, SearchIcon } from '@/components/ui'
import {
  formatLiveDate,
  superAdminLiveToday,
  superAdminUpcomingPageSize,
  superAdminUpcomingSessions,
  superAdminUpcomingSubtitle,
  type SuperAdminLiveKpi,
  type SuperAdminUpcomingSession,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
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

const DAY_MS = 86_400_000

export function AdminUpcomingSessionsPage() {
  const [sessions, setSessions] = useState<SuperAdminUpcomingSession[]>(superAdminUpcomingSessions)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Any status')
  const [instructor, setInstructor] = useState('All instructors')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const instructors = useMemo(
    () => ['All instructors', ...Array.from(new Set(superAdminUpcomingSessions.map((row) => row.instructor)))],
    [],
  )

  const kpis = useMemo<SuperAdminLiveKpi[]>(() => {
    const today = new Date(`${superAdminLiveToday}T00:00:00Z`).getTime()
    const nextWeek = sessions.filter((row) => {
      const diff = (new Date(`${row.isoDate}T00:00:00Z`).getTime() - today) / DAY_MS
      return diff >= 0 && diff <= 7
    }).length
    const needsHost = sessions.filter((row) => row.status === 'Needs host').length
    const registered = sessions.reduce((sum, row) => sum + row.registered, 0)
    return [
      { id: 'week', label: 'Next 7 days', value: String(nextWeek), detail: 'sessions scheduled' },
      { id: 'registered', label: 'Registered learners', value: registered.toLocaleString('en-US'), detail: 'across upcoming sessions' },
      { id: 'host', label: 'Needs host', value: String(needsHost), detail: needsHost ? 'assign an instructor' : 'all sessions hosted' },
    ]
  }, [sessions])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return sessions.filter((row) => {
      if (status !== 'Any status' && row.status !== status) return false
      if (instructor !== 'All instructors' && row.instructor !== instructor) return false
      if (!needle) return true
      return `${row.title} ${row.instructor}`.toLowerCase().includes(needle)
    })
  }, [instructor, query, sessions, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminUpcomingPageSize)
  const next = sessions[0]

  const confirm = (row: SuperAdminUpcomingSession) => {
    setSessions((current) => current.map((item) => (item.id === row.id ? { ...item, status: 'Confirmed' } : item)))
    setNotice(`“${row.title}” confirmed (sample).`)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="Upcoming Sessions"
        subtitle={superAdminUpcomingSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Upcoming sessions exported (sample).')} className={btnOutline}>
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
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ContentTextInput
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search class or instructor"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>Any status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Needs host</option>
            </ContentSelect>
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
            <table className="min-w-[960px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Class</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Time (AST)</th>
                  <th className={thClass}>Instructor</th>
                  <th className={`${thClass} text-right`}>Registered</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.title}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatLiveDate(row.isoDate)}</td>
                    <td className="px-3 py-3.5 text-sm tabular-nums text-slate-600">{row.time}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.instructor}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.registered}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          disabled={row.status === 'Confirmed'}
                          onClick={() => confirm(row)}
                          className={linkAction}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotice(`Reminder sent to ${row.registered} registered learners (sample).`)}
                          className={linkAction}
                        >
                          Send reminder
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <LiveEmptyRow colSpan={7}>No upcoming sessions match these filters.</LiveEmptyRow>
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
            noun="sessions"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          {next ? (
            <section className={`${cardClass} p-5`}>
              <div className="flex items-start gap-2">
                <CalendarIcon className="mt-0.5 h-4 w-4 text-brand" />
                <div>
                  <h2 className="text-base font-bold text-navy">Next session</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Starting soonest</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-sm font-semibold text-navy">{next.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{next.instructor}</p>
                <p className="mt-2 text-xs font-semibold text-brand">
                  {formatLiveDate(next.isoDate)} · {next.time} AST
                </p>
                <p className="mt-1 text-xs text-slate-400">{next.registered} learners registered</p>
              </div>
            </section>
          ) : null}
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Needs attention</h2>
            <ul className="mt-4 space-y-3">
              {sessions
                .filter((row) => row.status !== 'Confirmed')
                .map((row) => (
                  <li key={row.id} className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                    <p className="text-sm font-semibold text-navy">{row.title}</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {row.status} · {formatLiveDate(row.isoDate)}
                    </p>
                  </li>
                ))}
              {sessions.every((row) => row.status === 'Confirmed') ? (
                <li className="text-sm text-slate-500">Every upcoming session is confirmed.</li>
              ) : null}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
