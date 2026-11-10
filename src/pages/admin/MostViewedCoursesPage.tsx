import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice } from '@/components/common'
import { AlertTriangleIcon, ArrowUpIcon, BookIcon, DownloadIcon } from '@/components/ui'
import {
  superAdminMostViewedAlerts,
  superAdminMostViewedFunnel,
  superAdminMostViewedKpis,
  superAdminMostViewedPageSize,
  superAdminMostViewedRows,
} from '@/constants'
import { btnOutline, cardClass } from './catalogUtils'

export function AdminMostViewedCoursesPage({ embedded = false }: { embedded?: boolean }) {
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const pageCount = Math.max(1, Math.ceil(superAdminMostViewedRows.length / superAdminMostViewedPageSize))
  const safePage = Math.min(page, pageCount)
  const pageRows = superAdminMostViewedRows.slice(
    (safePage - 1) * superAdminMostViewedPageSize,
    safePage * superAdminMostViewedPageSize,
  )

  const pageButtons = useMemo(() => {
    const set = new Set([1, 2, 3, pageCount, safePage, safePage - 1, safePage + 1].filter((n) => n >= 1 && n <= pageCount))
    return [...set].sort((a, b) => a - b)
  }, [pageCount, safePage])

  function exportCsv() {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      ['Course', 'Category', 'Views', 'Add to cart', 'Purchases', 'Conversion'].map(escape).join(','),
      ...superAdminMostViewedRows.map((row) =>
        [row.course, row.category, String(row.views), String(row.cart), String(row.purchases), `${row.conversion}%`]
          .map(escape)
          .join(','),
      ),
    ]
    try {
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'most-viewed-courses.csv'
      link.click()
      URL.revokeObjectURL(url)
      setNotice(`Exported ${superAdminMostViewedRows.length} courses (sample).`)
    } catch {
      setNotice('Export failed in this browser (sample).')
    }
  }

  const actions = (
    <button type="button" onClick={exportCsv} className={btnOutline}>
      <DownloadIcon className="h-4 w-4" />
      Export
    </button>
  )

  return (
    <div className="space-y-5">
      {embedded ? (
        <div className="flex justify-end">{actions}</div>
      ) : (
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Course Management
              <span className="mx-1.5 text-slate-300">/</span>
              <span className="text-slate-500">Most Viewed Courses</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Most Viewed Courses</h1>
              <ContentBadge tone="slate">Sample data</ContentBadge>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">Course page traffic and how well views turn into purchases.</p>
          </div>
          {actions}
        </header>
      )}

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {superAdminMostViewedKpis.map((kpi) => (
          <article key={kpi.id} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-[28px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ArrowUpIcon className="h-3 w-3" />
              {kpi.change}
            </p>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-2.5 font-semibold">Course</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Views</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Add to cart</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Purchases</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand">
                          <BookIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-navy">{row.course}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{row.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {row.views.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      {row.cart.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      {row.purchases.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {row.conversion.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {pageRows.length} of {superAdminMostViewedRows.length} courses
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={safePage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40"
              >
                ‹
              </button>
              {pageButtons.map((number, index) => {
                const prev = pageButtons[index - 1]
                const showEllipsis = prev != null && number - prev > 1
                const active = number === safePage
                return (
                  <span key={number} className="contents">
                    {showEllipsis ? <span className="px-1 text-sm text-slate-400">…</span> : null}
                    <button
                      type="button"
                      onClick={() => setPage(number)}
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold ${
                        active ? 'bg-brand text-white' : 'border border-slate-200 text-slate-600'
                      }`}
                    >
                      {number}
                    </button>
                  </span>
                )
              })}
              <button
                type="button"
                aria-label="Next page"
                disabled={safePage >= pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Conversion funnel</h2>
            <p className="mt-0.5 text-sm text-slate-500">All courses · October 2026</p>
            <ul className="mt-4 space-y-3">
              {superAdminMostViewedFunnel.map((step) => (
                <li key={step.label}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-slate-600">{step.label}</span>
                    <span className="font-semibold tabular-nums text-navy">{step.value.toLocaleString('en-US')}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${step.width}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Needs attention</h2>
            <p className="mt-0.5 text-sm text-slate-500">High views, low conversion</p>
            <ul className="mt-4 space-y-3">
              {superAdminMostViewedAlerts.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <AlertTriangleIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">{item.course}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">{item.detail}</p>
                    <button
                      type="button"
                      onClick={() => setNotice(`Opened review for ${item.course} (sample).`)}
                      className="mt-1.5 text-xs font-semibold text-brand hover:underline"
                    >
                      Review page
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
