import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { CalendarIcon, LightbulbIcon } from '@/components/ui'
import {
  formatStudentDate,
  studentDaysSince,
  superAdminStudentCourseNames,
  superAdminStudentEnrollments,
  superAdminStudentEnrollmentsSubtitle,
  superAdminStudentEnrollmentsTip,
  superAdminStudentEnrollmentTabs,
  superAdminStudentPageSize,
  type SuperAdminStudentEnrollment,
  type SuperAdminStudentEnrollmentStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  paginate,
  StudentEmptyRow,
  StudentKpiGrid,
  StudentPageHeader,
  StudentPager,
  StudentSearch,
  StudentSideCard,
  StudentTabs,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
} from './studentShared'

const ALL_COURSES = 'All courses'
const basePaused = superAdminStudentEnrollments.filter((row) => row.status === 'Paused').length

export function AdminActiveEnrollmentsPage() {
  const [rows, setRows] = useState<SuperAdminStudentEnrollment[]>(superAdminStudentEnrollments)
  const [tab, setTab] = useState<'all' | SuperAdminStudentEnrollmentStatus>('all')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState(ALL_COURSES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const paused = rows.filter((row) => row.status === 'Paused').length
    const overdue = rows.filter((row) => row.status === 'Overdue').length
    return [
      {
        id: 'active',
        label: 'Active enrollments',
        value: (9842 - (paused - basePaused)).toLocaleString('en-US'),
        detail: '+4.3% vs previous 30 days',
      },
      { id: 'stalled', label: 'Stalled > 14 days', value: '1,120', detail: 'no activity in two weeks' },
      { id: 'overdue', label: 'Overdue', value: String(overdue), detail: 'past their target date' },
    ]
  }, [rows])

  const stalled = useMemo(
    () =>
      rows
        .filter((row) => row.status !== 'Paused' && studentDaysSince(row.lastActivity) > 14)
        .sort((a, b) => a.lastActivity.localeCompare(b.lastActivity))
        .slice(0, 4),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (course !== ALL_COURSES && row.course !== course) return false
      if (!needle) return true
      return `${row.student} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const setStatus = (row: SuperAdminStudentEnrollment, status: SuperAdminStudentEnrollmentStatus, message: string) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Active Enrollments"
        subtitle={superAdminStudentEnrollmentsSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Enrollments exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <StudentTabs
            tabs={superAdminStudentEnrollmentTabs}
            active={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />

          <div className={toolbarClass}>
            <StudentSearch
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search student or course"
            />
            <ContentSelect
              aria-label="Course"
              value={course}
              onChange={(event) => {
                setCourse(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[14rem]"
            >
              <option>{ALL_COURSES}</option>
              {superAdminStudentCourseNames.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Course</th>
                  <th className={thClass}>Progress</th>
                  <th className={thClass}>Enrolled</th>
                  <th className={thClass}>Last activity</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.student}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <span className="block h-full rounded-full bg-brand" style={{ width: `${row.progress}%` }} />
                        </span>
                        <span className="text-xs font-semibold text-navy tabular-nums">{row.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatStudentDate(row.enrolled)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatStudentDate(row.lastActivity)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {row.status === 'Overdue' ? (
                          <button
                            type="button"
                            onClick={() => setNotice(`Reminder sent to ${row.student} for ${row.course} (sample).`)}
                            className={linkAction}
                          >
                            Send reminder
                          </button>
                        ) : null}
                        {row.status === 'Paused' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Active', `${row.student}'s enrollment resumed (sample).`)}
                            className={linkAction}
                          >
                            Resume
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Paused', `${row.student}'s enrollment paused (sample).`)}
                            className={dangerAction}
                          >
                            Pause
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={7}>No enrollments match these filters.</StudentEmptyRow>
                ) : null}
              </tbody>
            </table>
          </div>
          <StudentPager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="enrollments"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <StudentSideCard
            icon={<CalendarIcon className="h-4 w-4 text-brand" />}
            title="Stalled learners"
            subtitle="No activity for over 14 days"
          >
            {stalled.length > 0 ? (
              <ul className="space-y-2.5">
                {stalled.map((row) => (
                  <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-semibold text-navy">{row.student}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{row.course}</p>
                    <p className="mt-1.5 text-xs font-semibold text-rose-600">
                      {studentDaysSince(row.lastActivity)} days inactive
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No learners are stalled.</p>
            )}
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentEnrollmentsTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
