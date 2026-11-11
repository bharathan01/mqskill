import type { ReactNode } from 'react'
import { type SuperAdminReportsKpi, type SuperAdminUsersStatusAction } from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { dangerAction, linkAction, ReportsPageShell } from './reportsShared'

export {
  ReportsBarChart as UsersBarChart,
  ReportsChartCard as UsersChartCard,
  ReportsFilterSelect as UsersFilterSelect,
  ReportsHBars as UsersHBars,
  ReportsLayout as UsersLayout,
  ReportsLineChart as UsersLineChart,
  ReportsNote as UsersNote,
  ReportsPager as UsersPager,
  ReportsSearch as UsersSearch,
  ReportsTable as UsersTable,
  boldNumCellClass,
  cellClass,
  firstCellClass,
  linkAction,
  numCellClass,
  paginate,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
  updateById,
  useReportList as useUsersList,
} from './reportsShared'
export { StatusBadge } from './catalogShared'
export { ContentSelect, ContentTextInput } from '@/components/common'

const SECTION = 'Users & Permissions'

export type UsersKpi = SuperAdminReportsKpi

export const usersKpi = (id: string, label: string, value: string, detail: string): UsersKpi => ({ id, label, value, detail })

/** Breadcrumb "Users & Permissions / {page}", title, sample badge, Export, KPI grid. */
export function UsersPageShell({
  page,
  subtitle,
  exportNotice,
  notice,
  onNotice,
  kpis,
  primary,
  form,
  showExport = true,
  children,
}: {
  page: string
  subtitle: string
  exportNotice: string
  notice: string | null
  onNotice: (message: string | null) => void
  kpis: UsersKpi[]
  /** Optional primary action button (e.g. "Invite administrator"). */
  primary?: { label: string; onClick: () => void }
  /** Inline create form, rendered above the KPIs. */
  form?: ReactNode
  showExport?: boolean
  children: ReactNode
}) {
  return (
    <ReportsPageShell
      section={SECTION}
      page={page}
      subtitle={subtitle}
      exportNotice={exportNotice}
      notice={notice}
      onNotice={onNotice}
      kpis={kpis}
      kpiClassName="sm:grid-cols-2 xl:grid-cols-4"
      showExport={showExport}
      topSlot={form}
      actions={
        primary ? (
          <button type="button" onClick={primary.onClick} className={btnPrimary}>
            {primary.label}
          </button>
        ) : undefined
      }
    >
      {children}
    </ReportsPageShell>
  )
}

const AVATAR_COLORS = ['#2563EB', '#102A4C', '#0F766E', '#7C3AED', '#B45309', '#BE123C']

export function UsersPerson({ name, email }: { name: string; email?: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
  const color = AVATAR_COLORS[name.length % AVATAR_COLORS.length]
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
        style={{ background: color }}
      >
        {initials}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-navy">{name}</span>
        {email ? <span className="block truncate text-xs text-slate-400">{email}</span> : null}
      </span>
    </div>
  )
}

/** Donut with a center total. Slices use pixel geometry so the ring cannot collapse. */
export function UsersDonut({
  items,
}: {
  items: { label: string; value: number; color: string }[]
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1
  const radius = 54
  const circ = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-40 w-40 shrink-0" role="img">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="16" />
        {items.map((item) => {
          const length = (item.value / total) * circ
          const dash = `${length} ${circ - length}`
          const node = (
            <circle
              key={item.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="16"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
          )
          offset += length
          return node
        })}
        <text x="70" y="66" textAnchor="middle" fill="#102A4C" fontSize="22" fontWeight="700">
          {items.reduce((sum, item) => sum + item.value, 0)}
        </text>
        <text x="70" y="84" textAnchor="middle" fill="#94A3B8" fontSize="10">
          total
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-slate-600">{item.label}</span>
            <span className="font-semibold text-navy tabular-nums">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Horizontal bars tall enough to read as a chart. */
export function UsersThickBars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-slate-600">{item.label}</span>
            <span className="font-semibold text-navy tabular-nums">{item.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2563EB]"
              style={{ width: `${Math.max(item.value > 0 ? 8 : 0, (item.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Two charts side by side on desktop, stacked on small screens. Always full width of the page. */
export function UsersChartGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>
}

/** Inline "add" form card. */
export function UsersFormCard({
  children,
  error,
  saveLabel,
  onSave,
  onCancel,
}: {
  children: ReactNode
  error: string | null
  saveLabel: string
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <section className={`${cardClass} p-4`}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
      {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
      <div className="mt-4 flex gap-2.5">
        <button type="button" onClick={onSave} className={btnPrimary}>
          {saveLabel}
        </button>
        <button type="button" onClick={onCancel} className={btnOutline}>
          Cancel
        </button>
      </div>
    </section>
  )
}

export function UsersField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <span className="mt-1.5 block">{children}</span>
    </label>
  )
}

/** Renders the status actions that apply to the row's current status. */
export function UsersRowActions({
  status,
  actions,
  onAct,
  extra,
}: {
  status: string
  actions: SuperAdminUsersStatusAction[]
  onAct: (action: SuperAdminUsersStatusAction) => void
  extra?: ReactNode
}) {
  const available = actions.filter((action) => action.from.includes(status))
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
      {available.map((action) => (
        <button key={action.label} type="button" onClick={() => onAct(action)} className={action.danger ? dangerAction : linkAction}>
          {action.label}
        </button>
      ))}
      {extra}
      {available.length === 0 && !extra ? <span className="text-sm text-slate-300">—</span> : null}
    </div>
  )
}

export const fillNotice = (template: string | undefined, name: string, fallback: string) =>
  template ? template.replace('{name}', name) : fallback

export const countBy = <T,>(rows: T[], keys: readonly string[], pick: (row: T) => string) =>
  keys.map((key) => ({ label: key, value: rows.filter((row) => pick(row) === key).length }))

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export { formatReportsDate as formatUsersDate } from '@/constants'
