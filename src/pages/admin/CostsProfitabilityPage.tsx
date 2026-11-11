import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import {
  superAdminCostRecords,
  superAdminCostsBaseEntered,
  superAdminCostsNote,
  superAdminCostsTotalCourses,
  superAdminSalesPageSize,
  type SuperAdminCostRecord,
  type SuperAdminCostStatus,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  kwd0,
  linkAction,
  paginate,
  SalesEmptyRow,
  SalesHBars,
  SalesKpiGrid,
  SalesNote,
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

const TABS: { id: 'all' | SuperAdminCostStatus; label: string }[] = [
  { id: 'all', label: 'All courses' },
  { id: 'Costs entered', label: 'Costs entered' },
  { id: 'Missing costs', label: 'Missing costs' },
]

/** Margin % when both costs are entered; `null` (shown as "—") otherwise. Never treats missing as zero. */
function marginOf(row: SuperAdminCostRecord): number | null {
  if (row.content === null || row.instructor === null || row.revenue <= 0) return null
  return ((row.revenue - row.content - row.instructor) / row.revenue) * 100
}

const entered = (rows: SuperAdminCostRecord[]) => rows.filter((row) => row.status === 'Costs entered').length
const baseEntered = entered(superAdminCostRecords)

export function AdminCostsProfitabilityPage() {
  const [rows, setRows] = useState<SuperAdminCostRecord[]>(superAdminCostRecords)
  const [tab, setTab] = useState<'all' | SuperAdminCostStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminSalesKpi[]>(() => {
    const margins = rows.map(marginOf).filter((value): value is number => value !== null)
    const avg = margins.length ? margins.reduce((sum, value) => sum + value, 0) / margins.length : null
    const missing = rows.filter((row) => row.status === 'Missing costs').length
    return [
      {
        id: 'covered',
        label: 'Courses with costs',
        value: `${superAdminCostsBaseEntered + entered(rows) - baseEntered} / ${superAdminCostsTotalCourses}`,
        detail: 'Cost records entered',
      },
      {
        id: 'margin',
        label: 'Avg. margin',
        value: avg === null ? '—' : `${avg.toFixed(0)}%`,
        detail: 'Courses with costs entered only',
      },
      { id: 'missing', label: 'Missing costs', value: String(missing), detail: 'Margin hidden until costs are entered' },
    ]
  }, [rows])

  const margins = useMemo(
    () =>
      rows
        .map((row) => ({ label: row.course, value: marginOf(row) }))
        .filter((item): item is { label: string; value: number } => item.value !== null)
        .map((item) => ({ label: item.label, value: Math.round(item.value) })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      return !needle || row.course.toLowerCase().includes(needle)
    })
  }, [query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const fillCosts = (row: SuperAdminCostRecord) => {
    const content = Math.round(row.revenue * 0.19)
    const instructor = Math.round(row.revenue * 0.17)
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, content, instructor, status: 'Costs entered' } : item)),
    )
    setNotice(`Sample costs entered for ${row.course}: content ${kwd0(content)}, instructor fees ${kwd0(instructor)}.`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Costs and Profitability"
        subtitle="Course-level cost records and margins. Missing costs are not treated as zero."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Costs and margins exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('Add cost record form opened (sample). Enter content cost and instructor fees per course.')} className={btnPrimary}>
              Add cost record
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesNote>{superAdminCostsNote}</SalesNote>

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
              placeholder="Search course"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Course</th>
                  <th className={`${thClass} text-right`}>Revenue (YTD)</th>
                  <th className={`${thClass} text-right`}>Content cost</th>
                  <th className={`${thClass} text-right`}>Instructor fees</th>
                  <th className={`${thClass} text-right`}>Margin</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const margin = marginOf(row)
                  return (
                    <tr key={row.id} className={trClass}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.course}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{kwd0(row.revenue)}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                        {row.content === null ? '—' : kwd0(row.content)}
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                        {row.instructor === null ? '—' : kwd0(row.instructor)}
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                        {margin === null ? '—' : `${margin.toFixed(1)}%`}
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge value={row.status} />
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        {row.status === 'Missing costs' ? (
                          <button type="button" onClick={() => fillCosts(row)} className={linkAction}>
                            Mark costs entered
                          </button>
                        ) : (
                          <span className="text-sm text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No courses match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="courses" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Margin by course" subtitle="Courses with costs entered">
            <SalesHBars items={margins} format={(value) => `${value}%`} />
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
