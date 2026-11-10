import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  formatLiveDate,
  superAdminCompletedKpis,
  superAdminCompletedPageSize,
  superAdminCompletedSessions,
  superAdminCompletedSubtitle,
  type SuperAdminCompletedSession,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
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

const seededAvailable = superAdminCompletedSessions.filter((row) => row.recording === 'Available').length

export function AdminCompletedSessionsPage() {
  const [sessions, setSessions] = useState<SuperAdminCompletedSession[]>(superAdminCompletedSessions)
  const [query, setQuery] = useState('')
  const [recording, setRecording] = useState('Any recording')
  const [instructor, setInstructor] = useState('All instructors')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const instructors = useMemo(
    () => ['All instructors', ...Array.from(new Set(superAdminCompletedSessions.map((row) => row.instructor)))],
    [],
  )

  const kpis = useMemo(() => {
    const available = sessions.filter((row) => row.recording === 'Available').length
    return superAdminCompletedKpis.map((kpi) =>
      kpi.id === 'recordings' ? { ...kpi, value: String(38 + available - seededAvailable) } : kpi,
    )
  }, [sessions])

  const topRated = useMemo(
    () => [...sessions].sort((a, b) => b.rating - a.rating || b.attendees - a.attendees).slice(0, 4),
    [sessions],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return sessions.filter((row) => {
      if (recording !== 'Any recording' && row.recording !== recording) return false
      if (instructor !== 'All instructors' && row.instructor !== instructor) return false
      if (!needle) return true
      return `${row.title} ${row.instructor}`.toLowerCase().includes(needle)
    })
  }, [instructor, query, recording, sessions])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminCompletedPageSize)

  const publish = (row: SuperAdminCompletedSession) => {
    setSessions((current) => current.map((item) => (item.id === row.id ? { ...item, recording: 'Available' } : item)))
    setNotice(`Recording for “${row.title}” published to learners (sample).`)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="Completed Sessions"
        subtitle={superAdminCompletedSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Completed sessions exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
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
              aria-label="Recording"
              value={recording}
              onChange={(event) => {
                setRecording(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[11rem]"
            >
              <option>Any recording</option>
              <option>Available</option>
              <option>Processing</option>
              <option>Not recorded</option>
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
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Class</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Instructor</th>
                  <th className={`${thClass} text-right`}>Attendees</th>
                  <th className={`${thClass} text-right`}>Rating</th>
                  <th className={thClass}>Recording</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.title}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatLiveDate(row.isoDate)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.instructor}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.attendees}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {row.rating.toFixed(1)}
                    </td>
                    <td className="px-3 py-3.5">
                      {row.recording === 'Not recorded' ? (
                        <ContentBadge tone="slate">Not recorded</ContentBadge>
                      ) : (
                        <StatusBadge value={row.recording} />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.recording === 'Processing' ? (
                        <button type="button" onClick={() => publish(row)} className={linkAction}>
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={row.recording !== 'Available'}
                          onClick={() => setNotice(`Recording for “${row.title}” opened (sample).`)}
                          className={linkAction}
                        >
                          View recording
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <LiveEmptyRow colSpan={7}>No completed sessions match these filters.</LiveEmptyRow>
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

        <section className={`${cardClass} h-fit p-5`}>
          <h2 className="text-base font-bold text-navy">Top-rated sessions</h2>
          <p className="mt-0.5 text-sm text-slate-500">Highest learner ratings</p>
          <ol className="mt-4 space-y-3">
            {topRated.map((row, index) => (
              <li key={row.id} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF4FF] text-xs font-bold text-brand">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy">{row.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{row.instructor}</p>
                </div>
                <span className="text-sm font-bold text-navy">{row.rating.toFixed(1)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
