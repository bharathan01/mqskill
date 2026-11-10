import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { GlobeIcon, LightbulbIcon } from '@/components/ui'
import {
  formatStudentDate,
  superAdminAllStudentsKpis,
  superAdminAllStudentsSubtitle,
  superAdminAllStudentsTabs,
  superAdminAllStudentsTip,
  superAdminStudentPageSize,
  superAdminStudents,
  type SuperAdminStudent,
  type SuperAdminStudentStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  paginate,
  StudentEmptyRow,
  StudentHBars,
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

const ALL_COUNTRIES = 'All countries'
const baseActive = superAdminStudents.filter((row) => row.status === 'Active').length

export function AdminAllStudentsPage() {
  const [students, setStudents] = useState<SuperAdminStudent[]>(superAdminStudents)
  const [tab, setTab] = useState<'all' | SuperAdminStudentStatus>('all')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState(ALL_COUNTRIES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const countries = useMemo(
    () => [ALL_COUNTRIES, ...Array.from(new Set(superAdminStudents.map((row) => row.country)))],
    [],
  )

  const kpis = useMemo(() => {
    const active = students.filter((row) => row.status === 'Active').length
    return superAdminAllStudentsKpis.map((kpi) =>
      kpi.id === 'active' ? { ...kpi, value: (21884 + active - baseActive).toLocaleString('en-US') } : kpi,
    )
  }, [students])

  const breakdown = useMemo(() => {
    const counts = new Map<string, number>()
    students.forEach((row) => counts.set(row.country, (counts.get(row.country) ?? 0) + 1))
    return Array.from(counts, ([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [students])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return students.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (country !== ALL_COUNTRIES && row.country !== country) return false
      if (!needle) return true
      return `${row.name} ${row.email} ${row.id}`.toLowerCase().includes(needle)
    })
  }, [country, query, students, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const setStatus = (row: SuperAdminStudent, status: SuperAdminStudentStatus, message: string) => {
    setStudents((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="All Students"
        subtitle={superAdminAllStudentsSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Student list exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button
              type="button"
              onClick={() => setNotice('Add student form opened (sample). New learners receive an invitation email.')}
              className={btnPrimary}
            >
              Add student
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-4" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <StudentTabs
            tabs={superAdminAllStudentsTabs}
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
              placeholder="Search name, email or student ID"
            />
            <ContentSelect
              aria-label="Country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[13rem]"
            >
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Email</th>
                  <th className={thClass}>Country</th>
                  <th className={`${thClass} text-right`}>Courses</th>
                  <th className={thClass}>Joined</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.email}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.country}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-navy tabular-nums">{row.courses}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatStudentDate(row.joined)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Suspended' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Active', `${row.name} reactivated (sample).`)}
                          className={linkAction}
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Suspended', `${row.name} suspended. Sign-in is blocked (sample).`)}
                          className={dangerAction}
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={7}>No students match these filters.</StudentEmptyRow>
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
            noun="students"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <StudentSideCard
            icon={<GlobeIcon className="h-4 w-4 text-brand" />}
            title="Top countries"
            subtitle="Students in this list"
          >
            <StudentHBars items={breakdown} />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminAllStudentsTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
