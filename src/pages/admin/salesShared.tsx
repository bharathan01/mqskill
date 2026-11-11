import type { ReactNode } from 'react'
import { ContentBadge } from '@/components/common'
import type { SuperAdminSalesKpi, SuperAdminSalesPoint } from '@/constants'
import { cardClass } from './catalogUtils'

export { paginate, theadRowClass, thClass, trClass } from './certificateShared'
export { CertPager as SalesPager } from './certificateShared'
export { dangerAction, linkAction } from './liveShared'
export {
  StudentEmptyRow as SalesEmptyRow,
  StudentHBars as SalesHBars,
  StudentSearch as SalesSearch,
  StudentSideCard as SalesSideCard,
  StudentTabs as SalesTabs,
  toolbarClass,
} from './studentShared'

const SECTION = 'Sales & Finance'

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

export function SalesKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-3',
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
          <p className="mt-2 text-xs text-slate-400">{kpi.detail}</p>
        </article>
      ))}
    </section>
  )
}

export function SalesBarChart({
  items,
  color = '#2563EB',
  format = (value: number) => value.toLocaleString('en-US'),
  showValues = false,
  heightClass = 'h-44',
}: {
  items: SuperAdminSalesPoint[]
  color?: string
  format?: (value: number) => string
  showValues?: boolean
  heightClass?: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  const plot = heightClass.includes('56') ? 180 : 140
  return (
    <div className={`flex items-end gap-2 ${heightClass}`}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          {showValues ? (
            <span className="text-[10px] font-semibold text-slate-500 tabular-nums">{format(item.value)}</span>
          ) : null}
          <div
            title={`${item.label}: ${format(item.value)}`}
            className="w-full max-w-10 rounded-t-md"
            style={{ height: `${Math.max(8, Math.round((item.value / max) * plot))}px`, background: color }}
          />
          <span className="max-w-full truncate text-[10px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Two bars per group (e.g. gross vs net). */
export function SalesGroupedBars({
  items,
  aLabel,
  bLabel,
  aColor = '#2563EB',
  bColor = '#93C5FD',
  heightClass = 'h-56',
}: {
  items: { label: string; a: number; b: number }[]
  aLabel: string
  bLabel: string
  aColor?: string
  bColor?: string
  heightClass?: string
}) {
  const max = Math.max(...items.flatMap((item) => [item.a, item.b]), 1)
  const fmt = (value: number) => `KWD ${value.toLocaleString('en-US')}`
  return (
    <div>
      <div className={`flex items-end gap-2 ${heightClass}`}>
        {items.map((item) => (
          <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
            <div className="flex h-[180px] w-full items-end justify-center gap-1">
              <div
                title={`${item.label} ${aLabel}: ${fmt(item.a)}`}
                className="w-1/2 max-w-4 rounded-t-sm"
                style={{ height: `${Math.max(8, Math.round((item.a / max) * 180))}px`, background: aColor }}
              />
              <div
                title={`${item.label} ${bLabel}: ${fmt(item.b)}`}
                className="w-1/2 max-w-4 rounded-t-sm"
                style={{ height: `${Math.max(8, Math.round((item.b / max) * 180))}px`, background: bColor }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: aColor }} />
          {aLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: bColor }} />
          {bLabel}
        </span>
      </div>
    </div>
  )
}

export const kwd0 = (value: number) => `KWD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export function MoneyCell({ value, bold = true }: { value: number; bold?: boolean }) {
  return (
    <span className={`text-sm tabular-nums ${bold ? 'font-semibold text-navy' : 'text-slate-600'}`}>
      KWD {value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
    </span>
  )
}

/** Small inline notice-style card used for page notes (not dismissible). */
export function SalesNote({ tone = 'amber', children }: { tone?: 'amber' | 'blue'; children: ReactNode }) {
  const style =
    tone === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-blue-200 bg-[#EFF4FF] text-brand'
  return <p className={`rounded-xl border px-4 py-3 text-sm font-medium ${style}`}>{children}</p>
}

/** Adds or replaces the first matching id in a list. */
export function updateById<T extends { id: string }>(rows: T[], id: string, patch: Partial<T>): T[] {
  return rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
}
