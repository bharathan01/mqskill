import type { ReactNode } from 'react'
import { ContentBadge } from '@/components/common'
import type { SuperAdminCertificateKpi } from '@/constants'
import { cardClass } from './catalogUtils'

const SECTION = 'Certificates & CPD'

export function CertPageHeader({
  page,
  subtitle,
  actions,
}: {
  page: string
  subtitle: string
  actions: ReactNode
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
      <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
    </header>
  )
}

export function CertKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-3',
}: {
  kpis: SuperAdminCertificateKpi[]
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

export function CertBarChart({
  items,
  color = '#2563EB',
}: {
  items: { label: string; value: number }[]
  color?: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <div className="flex h-44 items-end gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <div
            title={`${item.label}: ${item.value.toLocaleString('en-US')}`}
            className="w-full max-w-10 rounded-t-md"
            style={{ height: `${Math.max(8, Math.round((item.value / max) * 140))}px`, background: color }}
          />
          <span className="truncate text-[10px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function CertPager({
  page,
  pageCount,
  from,
  to,
  total,
  noun,
  onPage,
}: {
  page: number
  pageCount: number
  from: number
  to: number
  total: number
  noun: string
  onPage: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
      <span>
        {total === 0 ? `No ${noun} match` : `Showing ${from}–${to} of ${total} ${noun}`}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(Math.max(1, page - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
        >
          ‹
        </button>
        <span className="px-2 font-semibold text-navy">{page}</span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export const thClass = 'px-3 py-2.5 font-semibold'
export const theadRowClass =
  'border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase'
export const trClass = 'border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70'

export function paginate<T>(rows: T[], page: number, size: number) {
  const pageCount = Math.max(1, Math.ceil(rows.length / size))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * size
  const pageRows = rows.slice(start, start + size)
  return {
    pageCount,
    safePage,
    pageRows,
    from: rows.length === 0 ? 0 : start + 1,
    to: start + pageRows.length,
  }
}
