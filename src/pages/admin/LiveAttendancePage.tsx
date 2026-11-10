import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  superAdminAttendanceBySession,
  superAdminAttendanceKpis,
  superAdminAttendancePageSize,
  superAdminAttendanceRows,
  superAdminAttendanceSubtitle,
  type SuperAdminAttendanceRow,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  linkAction,
  LiveBarChart,
  LiveEmptyRow,
  LiveKpiGrid,
  LivePageHeader,
  LivePager,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './liveShared'

export function AdminLiveAttendancePage() {
  const [rows, setRows] = useState<SuperAdminAttendanceRow[]>(superAdminAttendanceRows)
  const [query, setQuery] = useState('')
  const [session, setSession] = useState('All classes')
  const [status, setStatus] = useState('Any status')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const sessions = useMemo(
    () => ['All classes', ...Array.from(new Set(superAdminAttendanceRows.map((row) => row.title)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (status !== 'Any status' && row.status !== status) return false
      if (session !== 'All classes' && row.title !== session) return false
      if (!needle) return true
      return `${row.student} ${row.title} ${row.org}`.toLowerCase().includes(needle)
    })
  }, [query, rows, session, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminAttendancePageSize)

  const markPresent = (row: SuperAdminAttendanceRow) => {
    setRows((current) =>
      current.map((item) =>
        item.id === row.id
          ? { ...item, status: 'Present', percent: Math.max(item.percent, 85), durationMin: Math.max(item.durationMin, 60) }
          : item,
      ),
    )
    setNotice(`${row.student} marked present for “${row.title}” (sample).`)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="Attendance and Participation"
        subtitle={superAdminAttendanceSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Attendance exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <LiveKpiGrid kpis={superAdminAttendanceKpis} className="sm:grid-cols-2 xl:grid-cols-4" />

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
                placeholder="Search student, organization or class"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Class"
              value={session}
              onChange={(event) => {
                setSession(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[16rem]"
            >
              {sessions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
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
              <option>Present</option>
              <option>Late</option>
              <option>Absent</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Class</th>
                  <th className={thClass}>Joined at</th>
                  <th className={`${thClass} text-right`}>Duration</th>
                  <th className={`${thClass} text-right`}>Attendance %</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.student}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.org}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.title}</td>
                    <td className="px-3 py-3.5 text-sm tabular-nums text-slate-600">{row.joinedAt}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      {row.durationMin > 0 ? `${row.durationMin} min` : '—'}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.percent}%</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <button
                        type="button"
                        disabled={row.status === 'Present'}
                        onClick={() => markPresent(row)}
                        className={linkAction}
                      >
                        Mark present
                      </button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <LiveEmptyRow colSpan={7}>No attendance records match these filters.</LiveEmptyRow>
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
            noun="records"
            onPage={setPage}
          />
        </section>

        <section className={`${cardClass} h-fit p-5`}>
          <h2 className="text-base font-bold text-navy">Attendance by session</h2>
          <p className="mt-0.5 text-sm text-slate-500">Average attendance % per recent class</p>
          <div className="mt-4">
            <LiveBarChart items={superAdminAttendanceBySession} color="#102A4C" suffix="%" />
          </div>
        </section>
      </div>
    </div>
  )
}
