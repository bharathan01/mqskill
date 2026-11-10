import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import { ArrowDownIcon, ArrowUpIcon, BookIcon, DownloadIcon } from '@/components/ui'
import {
  filteredTopSelling,
  formatTopSellingRevenue,
  superAdminTopSellingBuyers,
  superAdminTopSellingCategories,
  superAdminTopSellingMonths,
  superAdminTopSellingRankOptions,
  unitsSold,
  type SuperAdminTopSellingBuyer,
  type SuperAdminTopSellingRank,
  type SuperAdminTopSellingRow,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

const podiumStyles = [
  { badge: 'bg-amber-50 text-amber-700 border-amber-200', ring: 'ring-amber-100' },
  { badge: 'bg-slate-100 text-slate-600 border-slate-200', ring: 'ring-slate-100' },
  { badge: 'bg-orange-50 text-orange-700 border-orange-200', ring: 'ring-orange-100' },
] as const

function ChangePill({ row }: { row: SuperAdminTopSellingRow }) {
  if (row.vsPrev == null) {
    return <ContentBadge tone="blue">new</ContentBadge>
  }
  const Icon = row.vsPrevUp ? ArrowUpIcon : ArrowDownIcon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        row.vsPrevUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <Icon className="h-3 w-3" />
      {row.vsPrev}%
    </span>
  )
}

export function AdminTopSellingCoursesPage({ embedded = false }: { embedded?: boolean }) {
  const [buyer, setBuyer] = useState<SuperAdminTopSellingBuyer>('all')
  const [monthId, setMonthId] = useState<(typeof superAdminTopSellingMonths)[number]['id']>('2026-10')
  const [category, setCategory] = useState('All categories')
  const [rank, setRank] = useState<SuperAdminTopSellingRank>('units')
  const [notice, setNotice] = useState<string | null>(null)

  const month = superAdminTopSellingMonths.find((item) => item.id === monthId) ?? superAdminTopSellingMonths[0]
  const rows = useMemo(
    () => filteredTopSelling(buyer, category, monthId, rank),
    [buyer, category, monthId, rank],
  )
  const podium = rows.slice(0, 3)

  function exportCsv() {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      ['#', 'Course', 'Category', 'Individual orders', 'Org seats', 'Units sold', 'Revenue', month.vsLabel]
        .map(escape)
        .join(','),
      ...rows.map((row, index) =>
        [
          String(index + 1),
          row.course,
          row.category,
          String(row.individual),
          String(row.seats),
          String(unitsSold(row, buyer)),
          formatTopSellingRevenue(row.revenue),
          row.vsPrev == null ? 'new' : `${row.vsPrevUp ? '+' : '−'}${row.vsPrev}%`,
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
      link.download = 'top-selling-courses.csv'
      link.click()
      URL.revokeObjectURL(url)
      setNotice(`Exported ${rows.length} top-selling courses (sample).`)
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
              <span className="text-slate-500">Top-Selling Courses</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Top-Selling Courses</h1>
              <ContentBadge tone="slate">Sample data</ContentBadge>
            </div>
            <p className="mt-1.5 max-w-3xl text-sm text-slate-500">
              Ranked by units sold: individual purchases plus organization seats.
            </p>
          </div>
          {actions}
        </header>
      )}

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className={`${cardClass} p-3.5`}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="inline-flex flex-wrap rounded-lg bg-slate-100 p-1" role="group" aria-label="Buyer type">
            {superAdminTopSellingBuyers.map((item) => {
              const active = buyer === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBuyer(item.id)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="min-w-[10rem] flex-1 xl:max-w-[12rem]">
            <ContentSelect
              aria-label="Month"
              value={monthId}
              onChange={(event) => setMonthId(event.target.value as typeof monthId)}
              className="!h-10"
            >
              {superAdminTopSellingMonths.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </ContentSelect>
          </div>
          <div className="min-w-[10rem] flex-1 xl:max-w-[13rem]">
            <ContentSelect
              aria-label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="!h-10"
            >
              {superAdminTopSellingCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>
          <div className="min-w-[12rem] flex-1 xl:ml-auto xl:max-w-[15rem]">
            <ContentSelect
              aria-label="Rank by"
              value={rank}
              onChange={(event) => setRank(event.target.value as SuperAdminTopSellingRank)}
              className="!h-10"
            >
              {superAdminTopSellingRankOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </ContentSelect>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {podium.map((row, index) => {
          const style = podiumStyles[index] ?? podiumStyles[2]
          const units = unitsSold(row, buyer)
          return (
            <article key={row.id} className={`${cardClass} ring-1 ${style.ring} p-5`}>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex h-8 items-center rounded-lg border px-2.5 text-sm font-bold ${style.badge}`}
                >
                  #{index + 1}
                </span>
                <ChangePill row={row} />
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand">
                  <BookIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-navy">{row.course}</h2>
                  <p className="mt-0.5 text-xs text-slate-400">{row.category}</p>
                </div>
              </div>
              <p className="mt-4 text-[28px] leading-none font-bold tracking-tight text-navy tabular-nums">
                {units.toLocaleString('en-US')}
              </p>
              <p className="mt-1 text-sm text-slate-500">units sold</p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400">Individual orders</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy tabular-nums">{row.individual}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Organization seats</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy tabular-nums">{row.seats}</p>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-4 py-2.5 font-semibold">#</th>
                <th className="px-3 py-2.5 font-semibold">Course</th>
                <th className="px-3 py-2.5 font-semibold text-right">Individual orders</th>
                <th className="px-3 py-2.5 font-semibold text-right">Org seats</th>
                <th className="px-3 py-2.5 font-semibold text-right">Units sold</th>
                <th className="px-3 py-2.5 font-semibold text-right">Revenue</th>
                <th className="px-3 py-2.5 font-semibold">{month.vsLabel}</th>
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
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.individual}</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.seats}</td>
                  <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                    {unitsSold(row, buyer)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm font-medium tabular-nums text-navy">
                    {formatTopSellingRevenue(row.revenue)}
                  </td>
                  <td className="px-3 py-3.5">
                    <ChangePill row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">No courses match these filters.</div>
        ) : (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">
              Showing {rows.length} courses · {month.label}
            </p>
            <button
              type="button"
              onClick={() => setNotice('Full sales detail opens from Reports → Revenue Analytics (sample).')}
              className={`${btnPrimary} h-8 px-3 text-sm`}
            >
              View revenue report
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
