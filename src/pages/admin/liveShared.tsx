import type { ReactNode } from 'react'
import { ContentBadge } from '@/components/common'
import type { SuperAdminLiveKpi, SuperAdminLivePoint } from '@/constants'
import { cardClass } from './catalogUtils'

export { paginate, theadRowClass, thClass, trClass } from './certificateShared'
export { CertPager as LivePager } from './certificateShared'

const SECTION = 'Live Classes'

export function LivePageHeader({
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

export function LiveKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-3',
}: {
  kpis: SuperAdminLiveKpi[]
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

export function LiveBarChart({
  items,
  color = '#2563EB',
  suffix = '',
}: {
  items: SuperAdminLivePoint[]
  color?: string
  suffix?: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <div className="flex h-40 items-end gap-1.5">
      {items.map((item) => (
        <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <div
            title={`${item.label}: ${item.value.toLocaleString('en-US')}${suffix}`}
            className="w-full rounded-t-md"
            style={{ height: `${Math.max(4, (item.value / max) * 85)}%`, background: color }}
          />
          <span className="truncate text-[10px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function LiveEmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-slate-500">
        {children}
      </td>
    </tr>
  )
}

export const linkAction =
  'text-sm font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline'
export const dangerAction =
  'text-sm font-semibold text-rose-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline'
