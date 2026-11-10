import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatStudentDate,
  formatStudentKwd,
  superAdminStudentPageSize,
  superAdminStudentPayments,
  superAdminStudentPaymentMethods,
  superAdminStudentPaymentsKpis,
  superAdminStudentPaymentsSubtitle,
  superAdminStudentPaymentsTip,
  superAdminStudentPaymentTabs,
  type SuperAdminStudentPayment,
  type SuperAdminStudentPaymentStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  dangerAction,
  kwdFmt,
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

const ALL_METHODS = 'All methods'
const baseRefunded = superAdminStudentPayments
  .filter((row) => row.status === 'Refunded')
  .reduce((total, row) => total + row.amount, 0)

export function AdminStudentPaymentHistoryPage() {
  const [rows, setRows] = useState<SuperAdminStudentPayment[]>(superAdminStudentPayments)
  const [tab, setTab] = useState<'all' | SuperAdminStudentPaymentStatus>('all')
  const [query, setQuery] = useState('')
  const [method, setMethod] = useState(ALL_METHODS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const refunded = rows.filter((row) => row.status === 'Refunded').reduce((total, row) => total + row.amount, 0)
    const failed = rows.filter((row) => row.status === 'Failed').length
    const failedBase = superAdminStudentPayments.filter((row) => row.status === 'Failed').length
    return superAdminStudentPaymentsKpis.map((kpi) => {
      if (kpi.id === 'refunded') return { ...kpi, value: formatStudentKwd(412 + refunded - baseRefunded) }
      if (kpi.id === 'failed') return { ...kpi, value: String(38 + failed - failedBase) }
      return kpi
    })
  }, [rows])

  const byMethod = useMemo(
    () =>
      superAdminStudentPaymentMethods.map((label) => ({
        label,
        value: rows
          .filter((row) => row.method === label && row.status === 'Paid')
          .reduce((total, row) => total + row.amount, 0),
      })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (method !== ALL_METHODS && row.method !== method) return false
      if (!needle) return true
      return `${row.student} ${row.invoice}`.toLowerCase().includes(needle)
    })
  }, [method, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentPageSize)

  const setStatus = (row: SuperAdminStudentPayment, status: SuperAdminStudentPaymentStatus, message: string) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Payment History"
        subtitle={superAdminStudentPaymentsSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Payment history exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <StudentTabs
            tabs={superAdminStudentPaymentTabs}
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
              placeholder="Search student or invoice"
            />
            <ContentSelect
              aria-label="Method"
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
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Invoice</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Method</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.student}</td>
                    <td className="px-3 py-3.5 text-sm font-semibold text-brand">{row.invoice}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {formatStudentKwd(row.amount, 3)}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.method}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatStudentDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Pending' || row.status === 'Failed' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Paid', `${row.invoice} marked as paid (sample).`)}
                          className={linkAction}
                        >
                          Mark as paid
                        </button>
                      ) : row.status === 'Paid' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setStatus(
                              row,
                              'Refunded',
                              `${row.invoice} refunded ${formatStudentKwd(row.amount, 3)} to ${row.student} (sample).`,
                            )
                          }
                          className={dangerAction}
                        >
                          Refund
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={7}>No payments match these filters.</StudentEmptyRow>
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
            noun="payments"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <StudentSideCard icon={null} title="Collected by method" subtitle="Paid invoices in this list">
            <StudentHBars items={byMethod} format={kwdFmt} />
          </StudentSideCard>

          <StudentSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminStudentPaymentsTip}</p>
          </StudentSideCard>
        </div>
      </div>
    </div>
  )
}
