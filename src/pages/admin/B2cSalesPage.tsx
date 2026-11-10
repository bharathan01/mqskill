import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminB2cKpis,
  superAdminB2cSales,
  superAdminB2cSubtitle,
  superAdminB2cTabs,
  superAdminB2cTip,
  superAdminSalesPageSize,
  type SuperAdminB2cSale,
  type SuperAdminB2cStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  paginate,
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
} from './salesShared'

const ALL_COUNTRIES = 'All countries'

export function AdminB2cSalesPage() {
  const [sales, setSales] = useState<SuperAdminB2cSale[]>(superAdminB2cSales)
  const [tab, setTab] = useState<'all' | SuperAdminB2cStatus>('all')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState(ALL_COUNTRIES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const countries = useMemo(() => [ALL_COUNTRIES, ...Array.from(new Set(sales.map((row) => row.country)))], [sales])

  const byCountry = useMemo(() => {
    const totals = new Map<string, number>()
    sales
      .filter((row) => row.status === 'Paid')
      .forEach((row) => totals.set(row.country, (totals.get(row.country) ?? 0) + row.amount))
    return Array.from(totals, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [sales])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return sales.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (country !== ALL_COUNTRIES && row.country !== country) return false
      if (!needle) return true
      return `${row.id} ${row.student} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [country, query, sales, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminB2cSale, status: SuperAdminB2cStatus, message: string) => {
    setSales((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  const recordSale = () => {
    const next: SuperAdminB2cSale = {
      id: `ORD-${52600 + sales.length}`,
      student: 'Reem Al-Hajri',
      course: 'Fire Warden Training',
      amount: 28.5,
      country: 'Kuwait',
      date: '2026-11-10',
      status: 'Paid',
    }
    setSales((current) => [next, ...current])
    setTab('all')
    setPage(1)
    setNotice(`Sale ${next.id} recorded for ${next.student} (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="B2C Sales"
        subtitle={superAdminB2cSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('B2C sales exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={recordSale} className={btnPrimary}>
              Record sale
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={superAdminB2cKpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs
            tabs={superAdminB2cTabs}
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
              placeholder="Search student, course or order"
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
            <table className="min-w-[980px] w-full border-collapse text-left">
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
                      <Link to={`${paths.admin.orderDetail}?order=${row.id}`} className="mt-0.5 block text-xs text-brand hover:underline">
                        {row.id}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {formatSalesKwd(row.amount, 3)}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.country}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Paid', `${row.id} marked as paid (sample).`)}
                          className={linkAction}
                        >
                          Mark as paid
                        </button>
                      ) : row.status === 'Paid' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setStatus(row, 'Refunded', `${row.id} refunded ${formatSalesKwd(row.amount, 3)} to ${row.student} (sample).`)
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
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No B2C sales match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="sales"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Revenue by country" subtitle="Paid sales in this list">
            <SalesHBars items={byCountry} format={(value) => formatSalesKwd(value)} />
          </SalesSideCard>

          <SalesSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminB2cTip}</p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
