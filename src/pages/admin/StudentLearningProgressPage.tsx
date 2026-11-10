import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  superAdminStudentCourseNames,
  superAdminStudentPageSize,
  superAdminStudentProgress,
  superAdminStudentProgressKpis,
  superAdminStudentProgressSubtitle,
  superAdminStudentProgressTip,
  type SuperAdminStudentProgress,
  type SuperAdminStudentProgressStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  linkAction,
  paginate,
  StudentEmptyRow,
  StudentHBars,
  StudentKpiGrid,
  StudentPageHeader,
  StudentPager,
  StudentSearch,
  StudentSideCard,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
} from './studentShared'

const ALL_COURSES = 'All courses'
const ALL_STATUS = 'All statuses'
const statusOptions: SuperAdminStudentProgressStatus[] = ['On track', 'Behind', 'Completed']

const percent = (row: SuperAdminStudentProgress) => Math.round((row.modules / row.totalModules) * 100)

export function AdminStudentLearningProgressPage() {
  const [rows, setRows] = useState<SuperAdminStudentProgress[]>(superAdminStudentProgress)
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState(ALL_COURSES)
  const [status, setStatus] = useState(ALL_STATUS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (course !== ALL_COURSES && row.course !== course) return false
      if (status !== ALL_STATUS && row.status !== status) return false
      if (!needle) return true
      return `${row.student} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, query, rows, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const byCourse = useMemo(
    () =>
      superAdminStudentCourseNames
        .map((label) => {
          const list = rows.filter((row) => row.course === label)
          return {
            label,
            value: list.length ? Math.round(list.reduce((total, row) => total + percent(row), 0) / list.length) : 0,
          }
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
    [rows],
  )

  const nudge = (row: SuperAdminStudentProgress) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status: 'On track' } : item)))
    setNotice(`Study nudge sent to ${row.student} for ${row.course} (sample).`)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Learning Progress"
        subtitle={superAdminStudentProgressSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Learning progress exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={superAdminStudentProgressKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
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
            <ContentSelect
              aria-label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10.5rem]"
            >
              <option>{ALL_STATUS}</option>
              {statusOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Course</th>
                  <th className={`${thClass} text-right`}>Modules</th>
                  <th className={thClass}>Progress</th>
                  <th className={`${thClass} text-right`}>Time spent</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.student}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      <span className="font-semibold text-navy">{row.modules}</span>
                      <span className="text-slate-400"> / {row.totalModules}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <span
                            className={`block h-full rounded-full ${row.status === 'Completed' ? 'bg-emerald-500' : 'bg-brand'}`}
                            style={{ width: `${percent(row)}%` }}
                          />
                        </span>
                        <span className="text-xs font-semibold text-navy tabular-nums">{percent(row)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.hours} h</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Behind' ? (
                        <button type="button" onClick={() => nudge(row)} className={linkAction}>
                          Send nudge
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={7}>No learning records match these filters.</StudentEmptyRow>
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
            noun="records"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <StudentSideCard icon={null} title="Avg. progress by course" subtitle="Module completion">
            <StudentHBars items={byCourse} format={(value) => `${value}%`} />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentProgressTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
