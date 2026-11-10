import { useEffect, type ReactNode } from 'react'
import { ContentBadge } from '@/components/common'
import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from '@/components/ui'
import type { SuperAdminCatalogKpi } from '@/constants'
import { statusTone } from './catalogUtils'

export function StatusBadge({ value }: { value: string }) {
  return <ContentBadge tone={statusTone(value)}>{value}</ContentBadge>
}

/* ------------------------------ shared UI -------------------------------- */

export function KpiCard({ kpi, value }: { kpi: SuperAdminCatalogKpi; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
      <p className="text-sm text-slate-500">{kpi.label}</p>
      <p className="mt-1 text-[22px] leading-7 font-bold tracking-tight text-navy">{value}</p>
      {kpi.delta ? (
        <p
          className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
            kpi.tone === 'down' ? 'text-rose-600' : kpi.tone === 'flat' ? 'text-slate-500' : 'text-emerald-600'
          }`}
        >
          {kpi.tone === 'down' ? (
            <ArrowDownIcon className="h-3 w-3" />
          ) : kpi.tone === 'flat' ? null : (
            <ArrowUpIcon className="h-3 w-3" />
          )}
          {kpi.delta}
        </p>
      ) : (
        <p className="mt-2 text-xs text-slate-400">Live from this list</p>
      )}
    </div>
  )
}

export function Modal({
  title,
  description,
  onClose,
  children,
  footer,
  width = 'max-w-xl',
}: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[#0F2340]/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[90vh] w-full flex-col rounded-xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,40,80,0.25)] ${width}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-navy">{title}</h2>
            {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-navy"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

