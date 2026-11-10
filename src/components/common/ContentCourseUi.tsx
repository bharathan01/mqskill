import type { ReactNode } from 'react'
import { BookIcon } from '@/components/ui'

const toneStyles = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  slate: 'bg-slate-100 text-slate-500',
  blue: 'bg-[#EFF4FF] text-brand',
  red: 'bg-rose-50 text-rose-600',
} as const

export type ContentBadgeTone = keyof typeof toneStyles

export function ContentBadge({ tone, children }: { tone: ContentBadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${toneStyles[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

export function ContentCourseThumb({ accent }: { accent: string }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accent}`}
    >
      <BookIcon className="h-4 w-4" />
    </span>
  )
}

type RowActionProps = {
  label: string
  onClick?: () => void
  children: ReactNode
  tone?: 'default' | 'danger'
}

export function ContentRowAction({ label, onClick, children, tone = 'default' }: RowActionProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50 ${
        tone === 'danger' ? 'text-rose-500 hover:border-rose-200 hover:bg-rose-50' : 'text-slate-500'
      }`}
    >
      {children}
    </button>
  )
}

type EmptyStateProps = {
  icon: ReactNode
  title: string
  body: string
  children?: ReactNode
}

export function ContentEmptyState({ icon, title, body, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF4FF] text-brand">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-bold text-navy">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{body}</p>
      {children ? <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  )
}

export function ContentNotice({
  tone = 'green',
  children,
  onDismiss,
}: {
  tone?: 'green' | 'amber' | 'blue'
  children: ReactNode
  onDismiss?: () => void
}) {
  const styles = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    blue: 'border-blue-200 bg-[#EFF4FF] text-brand',
  } as const
  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${styles[tone]}`}
    >
      <span>{children}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-semibold underline-offset-2 hover:underline"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  )
}
