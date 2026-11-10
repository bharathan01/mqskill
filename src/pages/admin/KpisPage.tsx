import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice } from '@/components/common'
import { AlertTriangleIcon, ArrowDownIcon, ArrowUpIcon, DownloadIcon, InfoIcon } from '@/components/ui'
import {
  superAdminKpiCategories,
  superAdminKpiChangeTone,
  superAdminKpiPageSize,
  superAdminKpiRows,
  superAdminKpiRules,
  superAdminKpiUntracked,
  type SuperAdminKpiCategory,
  type SuperAdminKpiRow,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

type CategoryId = 'all' | SuperAdminKpiCategory

function ChangePill({ row }: { row: SuperAdminKpiRow }) {
  const tone = superAdminKpiChangeTone(row)
  const Icon = row.changeDirection === 'up' ? ArrowUpIcon : ArrowDownIcon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        tone === 'good' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <Icon className="h-3 w-3" />
      {row.change}
    </span>
  )
}

export function AdminKpisPage() {
  const [category, setCategory] = useState<CategoryId>('all')
  const [page, setPage] = useState(1)
  const [targets, setTargets] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(
    () => (category === 'all' ? superAdminKpiRows : superAdminKpiRows.filter((row) => row.category === category)),
    [category],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / superAdminKpiPageSize))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * superAdminKpiPageSize, safePage * superAdminKpiPageSize)
  const hasTargets = Object.keys(targets).length > 0

  function selectCategory(next: CategoryId) {
    setCategory(next)
    setPage(1)
  }

  function exportCsv() {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      ['KPI', 'Category', 'Definition', 'Current', 'vs prev.', 'Target', 'Owner'].map(escape).join(','),
      ...filtered.map((row) =>
        [
          row.label,
          row.category,
          row.definition,
          row.current,
          `${row.changeDirection === 'up' ? '↑' : '↓'} ${row.change}`,
          targets[row.id] ?? 'Not set',
          row.owner,
        ]
          .map(escape)
          .join(','),
      ),
    ]
    try {
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'key-performance-indicators.csv'
      link.click()
      URL.revokeObjectURL(url)
      setNotice(`Exported ${filtered.length} KPIs (sample).`)
    } catch {
      setNotice('Export failed in this browser (sample).')
    }
  }

  function setSampleTargets() {
    const next: Record<string, string> = {}
    for (const row of superAdminKpiRows) next[row.id] = row.sampleTarget
    setTargets(next)
    setNotice('Sample targets applied. Finance can replace these with live goals.')
  }

  function clearTargets() {
    setTargets({})
    setNotice('Targets cleared. KPIs again show change versus the previous period.')
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Dashboard
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Key Performance Indicators</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Key Performance Indicators</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            What each KPI measures, how it’s calculated and where it stands today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={exportCsv} className={btnOutline}>
            <DownloadIcon className="h-4 w-4" />
            Export
          </button>
          {hasTargets ? (
            <button type="button" onClick={clearTargets} className={btnOutline}>
              Clear targets
            </button>
          ) : null}
          <button type="button" onClick={setSampleTargets} className={btnPrimary}>
            Set targets
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="KPI category">
        {superAdminKpiCategories.map((item) => {
          const active = item.id === category
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectCategory(item.id)}
              className={`-mb-px border-b-2 px-3.5 py-2.5 text-sm transition ${
                active
                  ? 'border-brand font-semibold text-brand'
                  : 'border-transparent font-medium text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {!hasTargets ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-3 text-sm text-sky-900">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
          <p>No targets have been set yet. Until they are, each KPI shows its change versus the previous period.</p>
        </div>
      ) : null}

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-3.5 py-2.5 font-semibold">KPI</th>
                <th className="px-3.5 py-2.5 font-semibold">Definition</th>
                <th className="px-3.5 py-2.5 font-semibold">Current</th>
                <th className="px-3.5 py-2.5 font-semibold">vs prev.</th>
                <th className="px-3.5 py-2.5 font-semibold">Target</th>
                <th className="px-3.5 py-2.5 font-semibold">Owner</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => {
                const target = targets[row.id]
                return (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="px-3.5 py-3.5 align-middle">
                      <p className="text-sm font-semibold text-navy">{row.label}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.category}</p>
                    </td>
                    <td className="px-3.5 py-3.5 align-middle text-sm text-slate-600">{row.definition}</td>
                    <td className="px-3.5 py-3.5 align-middle text-sm font-semibold text-navy whitespace-nowrap">
                      {row.current}
                    </td>
                    <td className="px-3.5 py-3.5 align-middle">
                      <ChangePill row={row} />
                    </td>
                    <td className="px-3.5 py-3.5 align-middle">
                      {target ? (
                        <span className="text-sm font-medium text-navy whitespace-nowrap">{target}</span>
                      ) : (
                        <ContentBadge tone="slate">Not set</ContentBadge>
                      )}
                    </td>
                    <td className="px-3.5 py-3.5 align-middle text-sm text-slate-600 whitespace-nowrap">{row.owner}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {pageRows.length} of {filtered.length} KPIs
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1
              const active = number === safePage
              return (
                <button
                  key={number}
                  type="button"
                  aria-label={`Page ${number}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setPage(number)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    active ? 'bg-brand text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {number}
                </button>
              )
            })}
            <button
              type="button"
              aria-label="Next page"
              disabled={safePage >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Calculation rules</h2>
          <dl className="mt-4 space-y-3">
            {superAdminKpiRules.map((rule) => (
              <div key={rule.label} className="flex items-baseline justify-between gap-4 text-sm">
                <dt className="text-slate-500">{rule.label}</dt>
                <dd className="font-medium text-navy text-right">{rule.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Not tracked yet</h2>
          <p className="mt-1 text-sm text-slate-500">These need data the platform doesn’t record yet.</p>
          <ul className="mt-4 space-y-3">
            {superAdminKpiUntracked.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangleIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy">{item.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{item.reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotice(`${item.label}: tracked as a data gap. Product will surface it once the source is available (sample).`)}
                  className="shrink-0 text-sm font-semibold text-brand hover:underline"
                >
                  Details
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
