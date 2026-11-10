import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatStudentDate,
  superAdminStudentAssessments,
  superAdminStudentAssessmentsKpis,
  superAdminStudentAssessmentsSubtitle,
  superAdminStudentAssessmentsTip,
  superAdminStudentAssessmentTabs,
  superAdminStudentCourseNames,
  superAdminStudentPageSize,
  superAdminStudentPassMark,
  type SuperAdminStudentAssessment,
  type SuperAdminStudentAssessmentResult,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  linkAction,
  paginate,
  StudentBarChart,
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
const baseRetakes = superAdminStudentAssessments.filter((row) => row.result === 'Retake allowed').length
const buckets = [
  { label: '<50', min: 0, max: 49 },
  { label: '50s', min: 50, max: 59 },
  { label: '60s', min: 60, max: 69 },
  { label: '70s', min: 70, max: 79 },
  { label: '80s', min: 80, max: 89 },
  { label: '90+', min: 90, max: 100 },
]

export function AdminStudentAssessmentResultsPage() {
  const [rows, setRows] = useState<SuperAdminStudentAssessment[]>(superAdminStudentAssessments)
  const [tab, setTab] = useState<'all' | SuperAdminStudentAssessmentResult>('all')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState(ALL_COURSES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const retakes = rows.filter((row) => row.result === 'Retake allowed').length
    return superAdminStudentAssessmentsKpis.map((kpi) =>
      kpi.id === 'retakes' ? { ...kpi, value: String(46 + retakes - baseRetakes) } : kpi,
    )
  }, [rows])

  const distribution = useMemo(
    () =>
      buckets.map((bucket) => ({
        label: bucket.label,
        value: rows.filter((row) => row.score >= bucket.min && row.score <= bucket.max).length,
      })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.result !== tab) return false
      if (course !== ALL_COURSES && !row.assessment.startsWith(course)) return false
      if (!needle) return true
      return `${row.student} ${row.assessment}`.toLowerCase().includes(needle)
    })
  }, [course, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const allowRetake = (row: SuperAdminStudentAssessment) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, result: 'Retake allowed' } : item)))
    setNotice(`Retake allowed for ${row.student} on ${row.assessment} (sample).`)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Assessment Results"
        subtitle={superAdminStudentAssessmentsSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Assessment results exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <StudentTabs
            tabs={superAdminStudentAssessmentTabs}
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
              placeholder="Search student or assessment"
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
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Assessment</th>
                  <th className={`${thClass} text-right`}>Score</th>
                  <th className={`${thClass} text-right`}>Attempts</th>
                  <th className={thClass}>Result</th>
                  <th className={thClass}>Date</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.student}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.assessment}</td>
                    <td
                      className={`px-3 py-3.5 text-right text-sm font-semibold tabular-nums ${
                        row.score >= superAdminStudentPassMark ? 'text-navy' : 'text-rose-600'
                      }`}
                    >
                      {row.score}%
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.attempts}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.result} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatStudentDate(row.date)}</td>
                    <td className="px-3 py-3.5 text-right">
                      {row.result === 'Failed' ? (
                        <button type="button" onClick={() => allowRetake(row)} className={linkAction}>
                          Allow retake
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={7}>No assessment results match these filters.</StudentEmptyRow>
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
            noun="results"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <StudentSideCard icon={null} title="Score distribution" subtitle="Results in this list">
            <StudentBarChart items={distribution} color="#2563EB" showValues heightClass="h-36" />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentAssessmentsTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
