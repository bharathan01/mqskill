import { useMemo, useState, type ReactNode } from 'react'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import { superAdminReportsPageSize, type SuperAdminReportsKpi, type SuperAdminReportsPoint } from '@/constants'
import { btnOutline, cardClass } from './catalogUtils'
import { paginate, theadRowClass, thClass } from './salesShared'

export { paginate, theadRowClass, thClass, trClass } from './salesShared'
export { dangerAction, linkAction } from './liveShared'
export {
  StudentHBars as ReportsHBars,
  StudentSearch as ReportsSearch,
  StudentSideCard as ReportsSideCard,
  toolbarClass,
} from './studentShared'
export { SalesBarChart as ReportsBarChart, SalesNote as ReportsNote, updateById } from './salesShared'

const SECTION = 'Reports & Analytics'

export function ReportsPageHeader({
  page,
  subtitle,
  actions,
  section = SECTION,
}: {
  page: string
  subtitle: string
  actions?: ReactNode
  section?: string
}) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm text-slate-400">
          {section}
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="text-slate-500">{page}</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">{page}</h1>
          <ContentBadge tone="slate">Sample data</ContentBadge>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </header>
  )
}

export function ReportsKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-3',
}: {
  kpis: SuperAdminReportsKpi[]
  className?: string
}) {
  return (
    <section className={`grid gap-3 ${className}`}>
      {kpis.map((kpi) => (
        <article key={kpi.id} className={`${cardClass} p-4`}>
          <p className="text-sm text-slate-500">{kpi.label}</p>
          <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
          <p className="mt-2 text-xs text-slate-400">{kpi.detail}</p>
        </article>
      ))}
    </section>
  )
}

/** Pager used by every report table. */
export { CertPager as ReportsPager } from './certificateShared'

/* ------------------------------ page scaffolding ------------------------------ */

/**
 * Header (breadcrumb, title, badge, subtitle) + Export button + notice + KPI grid,
 * then children (usually a two-column grid with the table and a right rail).
 */
export function ReportsPageShell({
  page,
  subtitle,
  exportNotice,
  actions,
  notice,
  onNotice,
  kpis,
  kpiClassName,
  topSlot,
  section,
  showExport = true,
  children,
}: {
  page: string
  subtitle: string
  exportNotice: string
  actions?: ReactNode
  notice: string | null
  onNotice: (message: string | null) => void
  kpis: SuperAdminReportsKpi[]
  kpiClassName?: string
  topSlot?: ReactNode
  section?: string
  showExport?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-5">
      <ReportsPageHeader
        section={section}
        page={page}
        subtitle={subtitle}
        actions={
          <>
            {showExport ? (
              <button type="button" onClick={() => onNotice(exportNotice)} className={btnOutline}>
                Export
              </button>
            ) : null}
            {actions}
          </>
        }
      />
      {notice ? <ContentNotice onDismiss={() => onNotice(null)}>{notice}</ContentNotice> : null}
      {topSlot}
      <ReportsKpiGrid kpis={kpis} className={kpiClassName} />
      {children}
    </div>
  )
}

export function ReportsChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className={`${cardClass} p-5`}>
      <h2 className="text-base font-bold text-navy">{title}</h2>
      {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Line chart with one or more series. Values are plotted in pixel space so the line stays visible. */
export function ReportsLineChart({
  points,
  series,
  fill = false,
}: {
  points: { label: string; values: number[] }[]
  series: { label: string; color: string }[]
  /** Paint a soft area under the first series so the trend reads as a graph, not a hairline. */
  fill?: boolean
}) {
  const all = points.flatMap((point) => point.values)
  const max = Math.max(...all, 1)
  const min = Math.min(...all, 0)
  const span = Math.max(1, max - min)
  const width = 640
  const height = 200
  const padX = 12
  const padY = 16
  const pathFor = (seriesIndex: number) =>
    points
      .map((point, index) => {
        const x = padX + (points.length === 1 ? 0 : (index / (points.length - 1)) * (width - padX * 2))
        const y = height - padY - ((point.values[seriesIndex] - min) / span) * (height - padY * 2)
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img">
        {[0.25, 0.5, 0.75].map((step) => (
          <line
            key={step}
            x1={padX}
            x2={width - padX}
            y1={padY + (height - padY * 2) * step}
            y2={padY + (height - padY * 2) * step}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        ))}
        {fill && points.length > 1 ? (
          <path
            d={`${pathFor(0)} L${(width - padX).toFixed(1)},${height - padY} L${padX},${height - padY} Z`}
            fill={series[0]?.color ?? '#2563EB'}
            opacity="0.16"
          />
        ) : null}
        {series.map((item, index) => (
          <path
            key={item.label}
            d={pathFor(index)}
            fill="none"
            stroke={item.color}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between gap-1 text-[10px] text-slate-400">
        {points.map((point) => (
          <span key={point.label} className="truncate">
            {point.label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        {series.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Charts sit full width above the table. Optional notes stay in the right rail. */
export function ReportsLayout({
  charts,
  rail,
  children,
}: {
  charts?: ReactNode
  rail?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-4">
      {charts}
      <div className={rail ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]' : ''}>
        <section className={`${cardClass} overflow-hidden`}>{children}</section>
        {rail ? <div className="space-y-4">{rail}</div> : null}
      </div>
    </div>
  )
}

export function ReportsFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <ContentSelect
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="!h-10 lg:max-w-[12rem]"
    >
      <option value="all">All {label.toLowerCase()}</option>
      {options.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </ContentSelect>
  )
}

export function ReportsTable({
  columns,
  minWidth = 'min-w-[820px]',
  emptyText,
  isEmpty,
  children,
}: {
  columns: { label: string; align?: 'left' | 'right' }[]
  minWidth?: string
  emptyText: string
  isEmpty: boolean
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidth} border-collapse text-left`}>
        <thead>
          <tr className={theadRowClass}>
            {columns.map((column, index) => (
              <th
                key={column.label}
                className={`${index === 0 ? 'px-4 py-2.5 font-semibold' : thClass} ${column.align === 'right' ? 'text-right' : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

export const cellClass = 'px-3 py-3.5 text-sm text-slate-600'
export const firstCellClass = 'px-4 py-3.5 text-sm font-semibold text-navy'
export const numCellClass = 'px-3 py-3.5 text-sm tabular-nums text-slate-600'
export const boldNumCellClass = 'px-3 py-3.5 text-sm font-semibold tabular-nums text-navy'
export function RankChange({ value }: { value: number }) {
  if (value === 0) return <span className="text-sm font-semibold text-slate-400">— 0</span>
  const up = value > 0
  return (
    <span className={`text-sm font-semibold tabular-nums ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
      {up ? '▲' : '▼'} {Math.abs(value)}
    </span>
  )
}

export function GrowthCell({ value, digits = 0 }: { value: number; digits?: number }) {
  return (
    <span className={`text-sm font-semibold tabular-nums ${value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
      {value >= 0 ? '+' : '−'}
      {Math.abs(value).toFixed(digits)}%
    </span>
  )
}

/* ----------------------------------- state ----------------------------------- */

export type ReportFilterDef<T> = { key: string; test: (row: T, value: string) => boolean }

/** Search + dropdown filters + pagination + notice state shared by every report list. */
export function useReportList<T>(rows: T[], searchText: (row: T) => string, defs: ReportFilterDef<T>[] = []) {
  const [query, setQueryState] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      for (const def of defs) {
        const value = filters[def.key] ?? 'all'
        if (value !== 'all' && !def.test(row, value)) return false
      }
      return !needle || searchText(row).toLowerCase().includes(needle)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, filters])

  const pageInfo = paginate(filtered, page, superAdminReportsPageSize)

  return {
    query,
    setQuery: (value: string) => {
      setQueryState(value)
      setPage(1)
    },
    filter: (key: string) => filters[key] ?? 'all',
    setFilter: (key: string, value: string) => {
      setFilters((current) => ({ ...current, [key]: value }))
      setPage(1)
    },
    page: pageInfo.safePage,
    setPage,
    filtered,
    pageRows: pageInfo.pageRows,
    pageCount: pageInfo.pageCount,
    from: pageInfo.from,
    to: pageInfo.to,
    notice,
    setNotice,
  }
}

export type { SuperAdminReportsPoint }
