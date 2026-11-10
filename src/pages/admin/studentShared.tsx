import type { ReactNode } from 'react'
import { ContentBadge, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import type { SuperAdminStudentKpi, SuperAdminStudentPoint } from '@/constants'
import { cardClass } from './catalogUtils'

export { paginate, theadRowClass, thClass, trClass } from './certificateShared'
export { CertPager as StudentPager } from './certificateShared'
export { dangerAction, linkAction } from './liveShared'

const SECTION = 'Students'

export function StudentPageHeader({
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

export function StudentKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-3',
}: {
  kpis: SuperAdminStudentKpi[]
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

export function StudentBarChart({
  items,
  color = '#2563EB',
  suffix = '',
  showValues = false,
  heightClass = 'h-40',
}: {
  items: SuperAdminStudentPoint[]
  color?: string
  suffix?: string
  showValues?: boolean
  heightClass?: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <div className={`flex items-end gap-1.5 ${heightClass}`}>
      {items.map((item) => (
        <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          {showValues ? (
            <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
              {item.value.toLocaleString('en-US')}
              {suffix}
            </span>
          ) : null}
          <div
            title={`${item.label}: ${item.value.toLocaleString('en-US')}${suffix}`}
            className="w-full rounded-t-md"
            style={{ height: `${Math.max(4, (item.value / max) * (showValues ? 75 : 85))}%`, background: color }}
          />
          <span className="max-w-full truncate text-[10px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Horizontal bar list — compact breakdowns for the right rail. */
export function StudentHBars({
  items,
  color = '#2563EB',
  format = (value: number) => value.toLocaleString('en-US'),
}: {
  items: SuperAdminStudentPoint[]
  color?: string
  format?: (value: number) => string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-slate-600">{item.label}</span>
            <span className="font-semibold text-navy tabular-nums">{format(item.value)}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function StudentTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3.5 pt-2">
      {tabs.map((item) => {
        const on = active === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              on ? 'border-brand text-navy' : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export function StudentSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="relative min-w-0 flex-1">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <ContentTextInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="!h-10 !pl-9"
      />
    </label>
  )
}

export const toolbarClass = 'flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center'

export function StudentEmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-slate-500">
        {children}
      </td>
    </tr>
  )
}

export function StudentSideCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className={`${cardClass} p-5`}>
      <div className="flex items-start gap-2">
        {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
        <div>
          <h2 className="text-base font-bold text-navy">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function StudentAvatar({ name, className = 'h-9 w-9 text-xs' }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#EFF4FF] font-bold text-brand ${className}`}
    >
      {initials}
    </span>
  )
}

export const kwdFmt = (value: number) => `KWD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
