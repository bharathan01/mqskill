import { useId, type ReactNode } from 'react'
import { ContentBadge } from '@/components/common'
import { AlertTriangleIcon, ArrowDownIcon, ArrowUpIcon } from '@/components/ui'
import type { SuperAdminSalesKpi } from '@/constants'
import { cardClass } from './catalogUtils'

export { paginate, theadRowClass, thClass, trClass } from './certificateShared'
export { dangerAction, linkAction } from './liveShared'
export {
  StudentEmptyRow as SalesEmptyRow,
  StudentHBars as SalesHBars,
  StudentPager as SalesPager,
  StudentSearch as SalesSearch,
  StudentSideCard as SalesSideCard,
  StudentTabs as SalesTabs,
  toolbarClass,
} from './studentShared'

const SECTION = 'Sales & Finance'

/* -------------------------------- Page header ----------------------------- */

export function SalesPageHeader({
  page,
  subtitle,
  actions,
}: {
  page: string
  subtitle: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm text-slate-400">
          {SECTION}
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

/* ---------------------------------- KPI grid ------------------------------ */

export function SalesKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-4',
}: {
  kpis: SuperAdminSalesKpi[]
  className?: string
}) {
  return (
    <section className={`grid gap-3 ${className}`}>
      {kpis.map((kpi) => (
        <article key={kpi.id} className={`${cardClass} p-4`}>
          <p className="text-sm text-slate-500">{kpi.label}</p>
          <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
          <p
            className={`mt-2 inline-flex items-center gap-1 text-xs ${
              kpi.tone === 'up'
                ? 'font-semibold text-emerald-600'
                : kpi.tone === 'down'
                  ? 'font-semibold text-rose-600'
                  : 'text-slate-400'
            }`}
          >
            {kpi.tone === 'up' ? <ArrowUpIcon className="h-3 w-3" /> : null}
            {kpi.tone === 'down' ? <ArrowDownIcon className="h-3 w-3" /> : null}
            {kpi.detail}
          </p>
        </article>
      ))}
    </section>
  )
}

export function SalesTrendPill({ dir, pct }: { dir: 'up' | 'down' | 'flat'; pct: number }) {
  if (dir === 'flat') {
    return <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Flat</span>
  }
  const Icon = dir === 'up' ? ArrowUpIcon : ArrowDownIcon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        dir === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <Icon className="h-3 w-3" />
      {pct}%
    </span>
  )
}

/* --------------------------------- Chart helpers -------------------------- */

export const SALES_NAVY = '#102A4C'
export const SALES_BLUE = '#2563EB'
export const SALES_SKY = '#60A5FA'

const kFormat = (value: number) => (value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value))

/** Round the max up to a tidy axis ceiling (e.g. 48,620 → 50,000). */
function niceCeil(value: number) {
  if (value <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalised = value / magnitude
  const step = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 2.5 ? 2.5 : normalised <= 5 ? 5 : 10
  return step * magnitude
}

export function SalesLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-500">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  )
}

export type SalesSeries = { name: string; color: string; values: number[] }

/** Multi-series line chart with soft area fill. Values move up and down — never a straight line. */
export function SalesLineChart({
  labels,
  series,
  format = kFormat,
  area = true,
}: {
  labels: readonly string[]
  series: SalesSeries[]
  format?: (value: number) => string
  area?: boolean
}) {
  const gradientId = useId().replace(/:/g, '')
  const width = 640
  const height = 230
  const pad = { top: 14, right: 16, bottom: 28, left: 44 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const all = series.flatMap((item) => item.values)
  const max = niceCeil(Math.max(...all, 1))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => max * ratio)
  const x = (index: number) => pad.left + (labels.length <= 1 ? 0 : (index / (labels.length - 1)) * innerW)
  const y = (value: number) => pad.top + innerH - (value / max) * innerH

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Line chart">
      <defs>
        {series.map((item, index) => (
          <linearGradient key={item.name} id={`${gradientId}-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={item.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={item.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="#E2E8F0" strokeDasharray={tick === 0 ? undefined : '3 4'} />
          <text x={pad.left - 8} y={y(tick) + 3.5} textAnchor="end" fontSize="10" fill="#94A3B8">
            {format(tick)}
          </text>
        </g>
      ))}
      {labels.map((label, index) => (
        <text key={label} x={x(index)} y={height - 8} textAnchor="middle" fontSize="10" fill="#94A3B8">
          {label}
        </text>
      ))}
      {series.map((item, seriesIndex) => {
        const points = item.values.map((value, index) => `${x(index)},${y(value)}`)
        return (
          <g key={item.name}>
            {area ? (
              <polygon
                points={`${x(0)},${y(0)} ${points.join(' ')} ${x(item.values.length - 1)},${y(0)}`}
                fill={`url(#${gradientId}-${seriesIndex})`}
              />
            ) : null}
            <polyline points={points.join(' ')} fill="none" stroke={item.color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
            {item.values.map((value, index) => (
              <circle key={labels[index]} cx={x(index)} cy={y(value)} r="3.5" fill="#fff" stroke={item.color} strokeWidth="2">
                <title>{`${item.name} · ${labels[index]}: ${format(value)}`}</title>
              </circle>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

/** Grouped or stacked columns with a y-axis. Each column can have uneven values. */
export function SalesBarChart({
  labels,
  series,
  mode = 'grouped',
  format = kFormat,
  heightClass = 'h-52',
}: {
  labels: readonly string[]
  series: SalesSeries[]
  mode?: 'grouped' | 'stacked'
  format?: (value: number) => string
  heightClass?: string
}) {
  const columnTotals = labels.map((_, index) => series.reduce((total, item) => total + (item.values[index] ?? 0), 0))
  const peak =
    mode === 'stacked' ? Math.max(...columnTotals, 1) : Math.max(...series.flatMap((item) => item.values), 1)
  const max = niceCeil(peak)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => max * ratio)

  return (
    <div>
      <div className={`relative ${heightClass}`}>
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute right-0 left-10 flex items-center"
            style={{ top: `${((max - tick) / max) * 100}%` }}
          >
            <span className="absolute -left-10 w-8 text-right text-[11px] text-slate-400">{format(tick)}</span>
            <div className="h-px w-full bg-slate-100" />
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 left-10 flex items-end justify-between gap-2">
          {labels.map((label, index) => (
            <div
              key={label}
              className={`flex h-full flex-1 items-end justify-center ${mode === 'grouped' ? 'gap-1' : ''}`}
            >
              {mode === 'grouped' ? (
                series.map((item) => {
                  const value = item.values[index] ?? 0
                  return (
                    <div
                      key={item.name}
                      title={`${item.name} · ${label}: ${format(value)}`}
                      className="w-full max-w-[18px] rounded-t-sm"
                      style={{ height: `${(value / max) * 100}%`, background: item.color }}
                    />
                  )
                })
              ) : (
                <div className="flex h-full w-full max-w-[30px] flex-col-reverse justify-start overflow-hidden rounded-t-sm">
                  {series.map((item) => {
                    const value = item.values[index] ?? 0
                    return (
                      <div
                        key={item.name}
                        title={`${item.name} · ${label}: ${format(value)}`}
                        className="w-full"
                        style={{ height: `${(value / max) * 100}%`, background: item.color }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between gap-2 pl-10 text-xs text-slate-500">
        {labels.map((label) => (
          <span key={label} className="flex-1 text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------- Misc ---------------------------------- */

/** Amber callout used for the profitability / missing-costs note. */
export function SalesNote({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-3">
        <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>{children}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export const SALES_DASH = '—'

export const salesMoneyCell = 'px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy'

export const salesChartCard = `${cardClass} p-5`
