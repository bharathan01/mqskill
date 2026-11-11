import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminB2cSales,
  superAdminB2cWeekly,
  superAdminSalesPageSize,
  type SuperAdminB2cSale,
  type SuperAdminB2cStatus,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'
import {
  dangerAction,
  MoneyCell,
  paginate,
  SalesBarChart,
  SalesEmptyRow,
  SalesHBars,
  SalesKpiGrid,
  SalesPageHeader,
  SalesPager,
  SalesSearch,
  SalesSideCard,
  SalesTabs,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
  updateById,
} from './salesShared'

const ALL_COUNTRIES = 'All countries'
const ALL_COURSES = 'All courses'
const TABS: { id: 'all' | SuperAdminB2cStatus; label: string }[] = [
  { id: 'all', label: 'All sales' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Refunded', label: 'Refunded' },
]

const paidTotal = (rows: SuperAdminB2cSale[]) =>
  rows.filter((row) => row.status === 'Paid').reduce((sum, row) => sum + row.amount, 0)
const basePaid = paidTotal(superAdminB2cSales)

export function AdminB2cSalesPage() {
  const [rows, setRows] = useState<SuperAdminB2cSale[]>(superAdminB2cSales)
  const [tab, setTab] = useState<'all' | SuperAdminB2cStatus>('all')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState(ALL_COUNTRIES)
  const [course, setCourse] = useState(ALL_COURSES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const countries = useMemo(() => Array.from(new Set(superAdminB2cSales.map((row) => row.country))), [])
  const courses = useMemo(() => Array.from(new Set(superAdminB2cSales.map((row) => row.course))), [])

  const kpis = useMemo<SuperAdminSalesKpi[]>(
    () => [
      { id: 'rev', label: 'B2C revenue', value: formatSalesKwd(27310 + paidTotal(rows) - basePaid, 0), detail: '+5.1% vs previous period' },
      { id: 'orders', label: 'Orders', value: '812', detail: '+6.3% vs previous period' },
      { id: 'country', label: 'Top country', value: 'Kuwait', detail: '58% of B2C revenue' },
    ],
    [rows],
  )

  const byCountry = useMemo(() => {
    const totals = new Map<string, number>()
    rows
      .filter((row) => row.status === 'Paid')
      .forEach((row) => totals.set(row.country, (totals.get(row.country) ?? 0) + row.amount))
    return Array.from(totals, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (country !== ALL_COUNTRIES && row.country !== country) return false
      if (course !== ALL_COURSES && row.course !== course) return false
      return !needle || `${row.student} ${row.id}`.toLowerCase().includes(needle)
    })
  }, [country, course, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const refund = (row: SuperAdminB2cSale) => {
    setRows((current) => updateById(current, row.id, { status: 'Refunded' }))
    setNotice(`${formatSalesKwd(row.amount)} refunded to ${row.student} for ${row.course} (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="B2C Sales"
        subtitle="Direct purchases by individual learners."
        actions={
          <button type="button" onClick={() => setNotice('B2C sales exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs
            tabs={TABS}
            active={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />
          <div className={toolbarClass}>
            <SalesSearch
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search student or order ID"
            />
            <ContentSelect
              aria-label="Country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>{ALL_COUNTRIES}</option>
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
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
              {courses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Student</th>
                  <th className={thClass}>Course</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Country</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.student}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right">
                      <MoneyCell value={row.amount} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.country}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Paid' ? (
                        <button type="button" onClick={() => refund(row)} className={dangerAction}>
                          Refund
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No B2C sales match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="sales" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Weekly B2C revenue" subtitle="KWD, last 6 weeks">
            <SalesBarChart
              items={superAdminB2cWeekly}
              showValues
              format={(value) => `${(value / 1000).toFixed(1)}k`}
              heightClass="h-40"
            />
          </SalesSideCard>
          <SalesSideCard icon={null} title="Revenue by country" subtitle="Paid sales in this list">
            <SalesHBars items={byCountry} format={(value) => formatSalesKwd(value, 0)} />
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
