import type { ReactNode } from 'react'
import { ContentBadge, ContentSelect, ContentTextInput, type ContentBadgeTone } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import type { SuperAdminOrgKpi, SuperAdminOrgPoint, SuperAdminOrgTab } from '@/constants'
import { cardClass, statusTone } from './catalogUtils'

export { paginate, theadRowClass, thClass, trClass } from './certificateShared'
export { CertPager as OrgPager } from './certificateShared'
export { dangerAction, linkAction, LiveEmptyRow as OrgEmptyRow } from './liveShared'

const SECTION = 'Organizations'

export function OrgPageHeader({
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

export function OrgKpiGrid({
  kpis,
  className = 'sm:grid-cols-2 xl:grid-cols-4',
}: {
  kpis: SuperAdminOrgKpi[]
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

export function OrgBarChart({
  items,
  color = '#2563EB',
  suffix = '',
  heightClass = 'h-40',
}: {
  items: SuperAdminOrgPoint[]
  color?: string
  suffix?: string
  heightClass?: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <div className={`flex items-end gap-1.5 ${heightClass}`}>
      {items.map((item) => (
        <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[10px] font-semibold text-slate-500">
            {item.value.toLocaleString('en-US')}
            {suffix}
          </span>
          <div
            title={`${item.label}: ${item.value.toLocaleString('en-US')}${suffix}`}
            className="w-full rounded-t-md"
            style={{ height: `${Math.max(4, (item.value / max) * 70)}%`, background: color }}
          />
          <span className="w-full truncate text-center text-[10px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function OrgTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly SuperAdminOrgTab<T>[]
  value: 'all' | T
  onChange: (id: 'all' | T) => void
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3.5 pt-2">
      {tabs.map((item) => {
        const active = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              active ? 'border-brand text-navy' : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

const toneOverrides: Record<string, ContentBadgeTone> = {
  Locked: 'slate',
  Full: 'blue',
  Low: 'slate',
  Mid: 'blue',
  Upgraded: 'green',
  Starter: 'slate',
  Business: 'blue',
  Enterprise: 'green',
}

export function OrgStatusBadge({ value }: { value: string }) {
  return <ContentBadge tone={toneOverrides[value] ?? statusTone(value)}>{value}</ContentBadge>
}

export function OrgToolbar({
  query,
  onQuery,
  placeholder,
  children,
}: {
  query: string
  onQuery: (value: string) => void
  placeholder: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
      <label className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <ContentTextInput
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={placeholder}
          className="!h-10 !pl-9"
        />
      </label>
      {children}
    </div>
  )
}

export function OrgSelect({
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
      className="!h-10 lg:max-w-[14rem]"
    >
      {options.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </ContentSelect>
  )
}

export function OrgSideCard({
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
        {icon}
        <div>
          <h2 className="text-base font-bold text-navy">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}
