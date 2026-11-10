import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatStudentDate,
  formatStudentKwd,
  superAdminStudentCourseNames,
  superAdminStudentPageSize,
  superAdminStudentPaymentMethods,
  superAdminStudentPurchases,
  superAdminStudentPurchasesKpis,
  superAdminStudentPurchasesSubtitle,
} from '@/constants'
import { btnOutline, cardClass } from './catalogUtils'
import {
  kwdFmt,
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
const ALL_METHODS = 'All methods'

export function AdminStudentPurchasesPage() {
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState(ALL_COURSES)
  const [method, setMethod] = useState(ALL_METHODS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminStudentPurchases.filter((row) => {
      if (course !== ALL_COURSES && row.course !== course) return false
      if (method !== ALL_METHODS && row.method !== method) return false
      if (!needle) return true
      return `${row.student} ${row.course} ${row.order}`.toLowerCase().includes(needle)
    })
  }, [course, method, query])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const byMethod = useMemo(
    () =>
      superAdminStudentPaymentMethods.map((label) => ({
        label,
        value: filtered.filter((row) => row.method === label).reduce((total, row) => total + row.amount, 0),
      })),
    [filtered],
  )

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Purchased Courses"
        subtitle={superAdminStudentPurchasesSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Purchases exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={superAdminStudentPurchasesKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className={toolbarClass}>
            <StudentSearch
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search student, course or order"
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
              aria-label="Payment method"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>{ALL_METHODS}</option>
              {superAdminStudentPaymentMethods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Course</th>
                  <th className={thClass}>Order</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Payment</th>
                  <th className={thClass}>Date</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.student}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-sm font-semibold text-brand">{row.order}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {formatStudentKwd(row.amount, 3)}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.method}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatStudentDate(row.date)}</td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={6}>No purchases match these filters.</StudentEmptyRow>
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
            noun="purchases"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <StudentSideCard
            icon={null}
            title="Revenue by payment method"
            subtitle="Orders in the current filter"
          >
            <StudentHBars items={byMethod} format={kwdFmt} />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">
              Repeat buyers spend 2.1× more per year. Bundle ISO and Fire Warden courses at checkout to lift the basket.
            </p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
