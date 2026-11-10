import type { ContentBadgeTone } from '@/components/common'
import { superAdminReferenceDate, type SuperAdminCatalogColumn, type SuperAdminCatalogRow } from '@/constants'

/* ----------------------------- value helpers ----------------------------- */
const numericOnly = /^-?\d+(\.\d+)?$/
const isoDate = /^\d{4}-\d{2}-\d{2}/
const looseNumber = /^(KWD\s)?[-+]?[\d,]+(\.\d+)?\s?(%|h|hrs|min|days|KB|MB|k)?$/i

export function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || !looseNumber.test(trimmed)) return null
  const parsed = Number(trimmed.replace(/KWD\s|[,%]|\s?(h|hrs|min|days|KB|MB|k)$/gi, ''))
  return Number.isNaN(parsed) ? null : parsed
}

export function formatCell(column: SuperAdminCatalogColumn, value: string) {
  if (!value) return '—'
  if (numericOnly.test(value)) {
    const n = Number(value)
    if (column.kind === 'money') return `KWD ${n.toLocaleString('en-US')}`
    if (column.kind === 'percent') return `${value}%`
    if (column.kind === 'number' && Number.isInteger(n)) return n.toLocaleString('en-US')
  }
  return value
}

export function sortValue(value: string): number | string {
  if (isoDate.test(value)) return value
  const parsed = parseNumber(value)
  return parsed ?? value.toLowerCase()
}

export function compareValues(a: string, b: string, direction: 'asc' | 'desc') {
  const av = sortValue(a)
  const bv = sortValue(b)
  let result: number
  if (typeof av === 'number' && typeof bv === 'number') result = av - bv
  else result = String(av).localeCompare(String(bv), undefined, { numeric: true })
  return direction === 'asc' ? result : -result
}

export type PeriodId = 'all' | '30' | '90' | 'year'

export const periodOptions: { id: PeriodId; label: string }[] = [
  { id: 'all', label: 'All time' },
  { id: '30', label: 'Within 30 days' },
  { id: '90', label: 'Within 90 days' },
  { id: 'year', label: 'This year' },
]

export function inPeriod(value: string, period: PeriodId) {
  if (period === 'all') return true
  if (!isoDate.test(value)) return true
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`).getTime()
  const ref = new Date(`${superAdminReferenceDate}T00:00:00Z`).getTime()
  if (period === 'year') return value.startsWith(superAdminReferenceDate.slice(0, 4))
  const limit = Number(period) * 86_400_000
  return Math.abs(date - ref) <= limit
}

export function statusTone(status: string): ContentBadgeTone {
  const s = status.toLowerCase()
  if (/(^|\s)(failed|expired|rejected|revoked|overdue|suspended|locked|blocked|cancelled|critical|high|urgent|error|missing|declining|not found|absent|behind|risk|deactivated|hidden|disabled)/.test(s)) {
    return /(disabled|hidden)/.test(s) ? 'slate' : 'red'
  }
  if (/(draft|pending|scheduled|upcoming|in review|in progress|open|processing|expiring|waiting|requested|unread|invited|trial|warnings|medium|late|review|paused|onboarding|generating|quote|invoiced|changes|needs|unanswered|escalated|reminder|retake|flagged|test|watch|low usage|upgrade|too easy)/.test(s)) {
    return 'amber'
  }
  if (/(archived|inactive|closed|read$|previous|retired|standard|disconnected|stable|expired)/.test(s)) return 'slate'
  if (/(published|active|paid|completed|resolved|valid|verified|approved|sent|passed|connected|enabled|issued|ready|live|current|confirmed|present|granted|healthy|success|delivered|available|growing|on track|healthy|fixed|featured|hot|visible|processed|costs entered|rising|full|top|low$|balanced|easy|low)/.test(s)) {
    return 'green'
  }
  return 'blue'
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function downloadCsv(filename: string, columns: SuperAdminCatalogColumn[], rows: SuperAdminCatalogRow[]) {
  try {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      columns.map((col) => escape(col.label)).join(','),
      ...rows.map((row) => columns.map((col) => escape(row.values[col.key] ?? '')).join(',')),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch {
    // Download is best-effort in the sample build.
  }
}

export const btnPrimary =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50'
export const btnOutline =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
export const btnDanger =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700'
export const cardClass =
  'rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]'
