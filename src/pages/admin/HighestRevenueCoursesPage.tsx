import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import { BookIcon, DownloadIcon, InfoIcon } from '@/components/ui'
import {
  formatInsightKwd,
  superAdminHighestRevenueCategories,
  superAdminHighestRevenueMonths,
  superAdminHighestRevenueRows,
  superAdminHighestRevenueTotals,
} from '@/constants'
import { btnOutline, cardClass } from './catalogUtils'

export function AdminHighestRevenueCoursesPage({ embedded = false }: { embedded?: boolean }) {
  const [monthId, setMonthId] = useState<(typeof superAdminHighestRevenueMonths)[number]['id']>('2026-10')
  const [category, setCategory] = useState('All categories')
  const [basis, setBasis] = useState<'net' | 'gross'>('net')
  const [notice, setNotice] = useState<string | null>(null)

  const rows = useMemo(() => {
    const monthIndex = superAdminHighestRevenueMonths.findIndex((item) => item.id === monthId)
    const factor = monthIndex <= 0 ? 1 : 1 - monthIndex * 0.07
    return superAdminHighestRevenueRows
      .filter((row) => category === 'All categories' || row.category === category)
      .map((row) => ({
        ...row,
        b2c: Math.round(row.b2c * factor),
        b2b: Math.round(row.b2b * factor),
        refunds: Math.round(row.refunds * factor),
        net: Math.round(row.net * factor),
      }))
      .sort((a, b) => (basis === 'net' ? b.net - a.net : b.b2c + b.b2b - (a.b2c + a.b2b)))
  }, [basis, category, monthId])

  const totals = useMemo(() => {
    const b2c = rows.reduce((sum, row) => sum + row.b2c, 0)
    const b2b = rows.reduce((sum, row) => sum + row.b2b, 0)
    const refunds = rows.reduce((sum, row) => sum + row.refunds, 0)
    const net = rows.reduce((sum, row) => sum + row.net, 0)
    return { b2c, b2b, refunds, net }
  }, [rows])

  const b2cShare = totals.b2c + totals.b2b ? Math.round((totals.b2c / (totals.b2c + totals.b2b)) * 100) : 0
  const b2bShare = 100 - b2cShare

  function exportCsv() {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      ['#', 'Course', 'Individuals (B2C)', 'Organizations (B2B)', 'Refunds', 'Net revenue', 'Share of total']
        .map(escape)
        .join(','),
      ...rows.map((row, index) =>
        [
          String(index + 1),
          row.course,
          formatInsightKwd(row.b2c),
          formatInsightKwd(row.b2b),
          formatInsightKwd(row.refunds),
          formatInsightKwd(row.net),
          `${row.share}%`,
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
      link.download = 'highest-revenue-courses.csv'
      link.click()
      URL.revokeObjectURL(url)
      setNotice(`Exported ${rows.length} courses (sample).`)
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
              <span className="text-slate-500">Highest Revenue Courses</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Highest Revenue Courses</h1>
              <ContentBadge tone="slate">Sample data</ContentBadge>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Courses ranked by revenue, split between individual and organization sales.
            </p>
          </div>
          {actions}
        </header>
      )}

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className={`${cardClass} flex flex-col gap-3 p-3.5 lg:flex-row lg:items-center`}>
        <div className="min-w-[10rem] lg:max-w-[12rem]">
          <ContentSelect
            aria-label="Month"
            value={monthId}
            onChange={(event) => setMonthId(event.target.value as typeof monthId)}
            className="!h-10"
          >
            {superAdminHighestRevenueMonths.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </ContentSelect>
        </div>
        <div className="min-w-[10rem] lg:max-w-[13rem]">
          <ContentSelect
            aria-label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="!h-10"
          >
            {superAdminHighestRevenueCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </ContentSelect>
        </div>
        <div className="inline-flex rounded-lg bg-slate-100 p-1 lg:ml-auto" role="group" aria-label="Revenue basis">
          {(
            [
              { id: 'net', label: 'Net of refunds' },
              { id: 'gross', label: 'Gross' },
            ] as const
          ).map((item) => {
            const active = basis === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setBasis(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-4 py-2.5 font-semibold">#</th>
                <th className="px-3 py-2.5 font-semibold">Course</th>
                <th className="px-3 py-2.5 font-semibold text-right">Individuals (B2C)</th>
                <th className="px-3 py-2.5 font-semibold text-right">Organizations (B2B)</th>
                <th className="px-3 py-2.5 font-semibold text-right">Refunds</th>
                <th className="px-3 py-2.5 font-semibold text-right">Net revenue</th>
                <th className="px-3 py-2.5 font-semibold text-right">Share of total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-500">{index + 1}</td>
                  <td className="px-3 py-3.5">
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
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{formatInsightKwd(row.b2c)}</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{formatInsightKwd(row.b2b)}</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                    {formatInsightKwd(row.refunds)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                    {formatInsightKwd(basis === 'net' ? row.net : row.b2c + row.b2b)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm font-medium tabular-nums text-navy">{row.share.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/80">
                <td className="px-4 py-3.5 text-sm font-semibold text-navy" colSpan={2}>
                  Top {rows.length} total
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                  {formatInsightKwd(totals.b2c)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                  {formatInsightKwd(totals.b2b)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                  {formatInsightKwd(totals.refunds)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                  {formatInsightKwd(basis === 'net' ? totals.net : totals.b2c + totals.b2b)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm font-semibold text-navy">
                  {superAdminHighestRevenueTotals.share}% of all revenue
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Individuals vs organizations</h2>
          <p className="mt-0.5 text-sm text-slate-500">Top {rows.length} courses, gross</p>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="text-slate-600">Individuals (B2C)</span>
                <span className="font-semibold text-navy">
                  {formatInsightKwd(totals.b2c)} · {b2cShare}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#102A4C]" style={{ width: `${b2cShare}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="text-slate-600">Organizations (B2B)</span>
                <span className="font-semibold text-navy">
                  {formatInsightKwd(totals.b2b)} · {b2bShare}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#60A5FA]" style={{ width: `${b2bShare}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            This page shows revenue only. Profit isn’t calculated because course costs haven’t been recorded, and missing
            costs are never treated as zero.
          </p>
        </section>
      </div>
    </div>
  )
}
