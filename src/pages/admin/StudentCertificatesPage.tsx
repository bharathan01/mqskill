import { useMemo, useState, type FormEvent } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { CheckCircleIcon, DownloadIcon, LightbulbIcon } from '@/components/ui'
import {
  formatStudentDate,
  studentDaysAgo,
  superAdminStudentCertificates,
  superAdminStudentCertificatesKpis,
  superAdminStudentCertificatesSubtitle,
  superAdminStudentCertificatesTip,
  superAdminStudentCertificateTabs,
  superAdminStudentCourseNames,
  superAdminStudentCourses,
  superAdminStudentNames,
  superAdminStudentPageSize,
  type SuperAdminStudentCertificate,
  type SuperAdminStudentCertificateStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
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

export function AdminStudentCertificatesPage() {
  const [rows, setRows] = useState<SuperAdminStudentCertificate[]>(superAdminStudentCertificates)
  const [tab, setTab] = useState<'all' | SuperAdminStudentCertificateStatus>('all')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState(ALL_COURSES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [issuing, setIssuing] = useState(false)
  const [formStudent, setFormStudent] = useState<string>(superAdminStudentNames[0])
  const [formCourse, setFormCourse] = useState<string>(superAdminStudentCourseNames[0] ?? '')

  const latest = rows.find((row) => row.status === 'Valid') ?? rows[0]

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (course !== ALL_COURSES && row.course !== course) return false
      if (!needle) return true
      return `${row.id} ${row.student} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const revoke = (row: SuperAdminStudentCertificate) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status: 'Revoked' } : item)))
    setNotice(`Certificate ${row.id} revoked (sample).`)
  }

  const issue = (event: FormEvent) => {
    event.preventDefault()
    const info = superAdminStudentCourses.find((item) => item.name === formCourse)
    const issued = studentDaysAgo(0)
    const expiry = new Date(Date.parse(`${issued}T00:00:00Z`) + 730 * 86_400_000).toISOString().slice(0, 10)
    const id = `MQ-CERT-${27010 + rows.length * 9 + 1}`
    setRows((current) => [
      { id, student: formStudent, course: formCourse, issued, expiry, cpdHours: info?.cpd ?? 0, status: 'Valid' },
      ...current,
    ])
    setIssuing(false)
    setTab('all')
    setPage(1)
    setNotice(`Certificate ${id} issued to ${formStudent} (sample).`)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Certificates"
        subtitle={superAdminStudentCertificatesSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Student certificates exported as CSV (sample).')} className={btnOutline}>
              Export CSV
            </button>
            <button type="button" onClick={() => setIssuing((open) => !open)} className={btnPrimary}>
              Issue certificate
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={superAdminStudentCertificatesKpis} />

      {issuing ? (
        <form onSubmit={issue} className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Student
            <ContentSelect
              value={formStudent}
              onChange={(event) => setFormStudent(event.target.value)}
              className="mt-1.5 !h-10"
            >
              {superAdminStudentNames.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </label>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Course
            <ContentSelect
              value={formCourse}
              onChange={(event) => setFormCourse(event.target.value)}
              className="mt-1.5 !h-10"
            >
              {superAdminStudentCourseNames.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </label>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setIssuing(false)} className={btnOutline}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary}>
              Issue
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <StudentTabs
            tabs={superAdminStudentCertificateTabs}
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
              placeholder="Search student, certificate ID or course"
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
                  <th className={thClass}>Certificate ID</th>
                  <th className={thClass}>Course</th>
                  <th className={`${thClass} text-right`}>CPD h</th>
                  <th className={thClass}>Issued · valid to</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.student}</td>
                    <td className="px-3 py-3.5 text-sm font-semibold text-brand">{row.id}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.cpdHours}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">
                      {formatStudentDate(row.issued)}
                      <span className="text-slate-400"> → {formatStudentDate(row.expiry)}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-end gap-3">
                        {row.status === 'Valid' ? (
                          <button type="button" onClick={() => revoke(row)} className={dangerAction}>
                            Revoke
                          </button>
                        ) : null}
                        <button
                          type="button"
                          aria-label={`Download ${row.id}`}
                          onClick={() => setNotice(`Certificate ${row.id} downloaded (sample).`)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-navy"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={7}>No certificates match these filters.</StudentEmptyRow>
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
            noun="certificates"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          {latest ? (
            <StudentSideCard
              icon={<CheckCircleIcon className="h-4 w-4 text-emerald-600" />}
              title="Latest certificate"
              subtitle="Most recently issued"
            >
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-sm font-semibold text-navy">{latest.student}</p>
                <p className="mt-0.5 text-xs text-slate-500">{latest.course}</p>
                <p className="mt-2 text-xs font-semibold text-brand">{latest.id}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Issued {formatStudentDate(latest.issued)} · valid to {formatStudentDate(latest.expiry)}
                </p>
              </div>
            </StudentSideCard>
          ) : null}

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentCertificatesTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
