import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookIcon,
  CalendarIcon,
  DownloadIcon,
  GlobeIcon,
  InfoIcon,
  LayersIcon,
  TagIcon,
} from '@/components/ui'
import {
  sortIntelligenceRows,
  superAdminIntelligenceBusiness,
  superAdminIntelligenceCategories,
  superAdminIntelligenceCompare,
  superAdminIntelligenceCountries,
  superAdminIntelligenceFunnel,
  superAdminIntelligenceRanges,
  superAdminIntelligenceRows,
  superAdminIntelligenceSortTabs,
  superAdminIntelligenceVersions,
  type SuperAdminIntelligenceRow,
  type SuperAdminIntelligenceSort,
} from '@/constants'
import type { SuperAdminExecutiveBusiness, SuperAdminExecutiveRangeId } from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = Math.max(1, max - min)
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100
    const y = 100 - ((point - min) / span) * 80 - 10
    return `${x},${y}`
  })
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-5 w-14" aria-hidden>
      <polyline points={coords.join(' ')} fill="none" stroke="#2563EB" strokeWidth="4" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function GrowthPill({ value }: { value: number }) {
  const up = value >= 0
  const Icon = up ? ArrowUpIcon : ArrowDownIcon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

function formatRevenue(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

export function AdminTrendingCoursesPage({ embedded = false }: { embedded?: boolean }) {
  const [draftRange, setDraftRange] = useState<SuperAdminExecutiveRangeId>('30d')
  const [draftCountry, setDraftCountry] = useState(superAdminIntelligenceCountries[0])
  const [draftCategory, setDraftCategory] = useState('All categories')
  const [draftBusiness, setDraftBusiness] = useState<SuperAdminExecutiveBusiness>('all')
  const [draftVersion, setDraftVersion] = useState<(typeof superAdminIntelligenceVersions)[number]['id']>('latest')
  const [applied, setApplied] = useState({
    range: '30d' as SuperAdminExecutiveRangeId,
    country: superAdminIntelligenceCountries[0],
    category: 'All categories',
    business: 'all' as SuperAdminExecutiveBusiness,
    version: 'latest' as (typeof superAdminIntelligenceVersions)[number]['id'],
  })
  const [sort, setSort] = useState<SuperAdminIntelligenceSort>('growth')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const dirty =
    draftRange !== applied.range ||
    draftCountry !== applied.country ||
    draftCategory !== applied.category ||
    draftBusiness !== applied.business ||
    draftVersion !== applied.version

  const rows = useMemo(() => {
    const list = superAdminIntelligenceRows(
      applied.range,
      applied.country,
      applied.business,
      applied.category,
      applied.version,
    )
    return sortIntelligenceRows(list, sort)
  }, [applied, sort])

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0]
  const compare = useMemo(
    () => (selected ? superAdminIntelligenceCompare(selected, applied.range) : null),
    [applied.range, selected],
  )
  const funnel = useMemo(() => (selected ? superAdminIntelligenceFunnel(selected) : []), [selected])
  const rangeLabel = superAdminIntelligenceRanges.find((item) => item.id === applied.range)?.label ?? 'Last 30 days'

  function applyFilters() {
    const nextRange = superAdminIntelligenceRanges.find((item) => item.id === draftRange)?.label ?? 'Last 30 days'
    setApplied({
      range: draftRange,
      country: draftCountry,
      category: draftCategory,
      business: draftBusiness,
      version: draftVersion,
    })
    setNotice(`Filters applied · ${nextRange} · ${draftCountry} · ${draftCategory}.`)
  }

  function exportCsv() {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      ['#', 'Course', 'Category', 'Views', 'Conv.', 'Purchases', 'Enrolled', 'Complete', 'Rating', 'Revenue', 'Growth']
        .map(escape)
        .join(','),
      ...rows.map((row, index) =>
        [
          String(index + 1),
          row.course,
          row.category,
          String(row.views),
          `${row.conversion}%`,
          String(row.purchases),
          String(row.enrolled),
          `${row.complete}%`,
          '—',
          formatRevenue(row.revenue),
          `${row.growth}%`,
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
      link.download = 'trending-courses.csv'
      link.click()
      URL.revokeObjectURL(url)
      setNotice(`Exported ${rows.length} courses (sample).`)
    } catch {
      setNotice('Export failed in this browser (sample).')
    }
  }

  function selectRow(row: SuperAdminIntelligenceRow) {
    setSelectedId(row.id)
  }

  const actions = (
    <div className="flex flex-wrap items-center gap-2.5">
      <button type="button" onClick={exportCsv} className={btnOutline}>
        <DownloadIcon className="h-4 w-4" />
        Export report
      </button>
      <button
        type="button"
        onClick={() => setNotice('View saved to Course Intelligence favourites (sample).')}
        className={btnPrimary}
      >
        Save view
      </button>
    </div>
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
              <span className="text-slate-500">Trending Courses</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Course Intelligence</h1>
              <ContentBadge tone="slate">Sample data</ContentBadge>
            </div>
            <p className="mt-1.5 max-w-3xl text-sm text-slate-500">
              Demand, conversion and completion for every course, compared with the previous period.
            </p>
          </div>
          {actions}
        </header>
      )}

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className={`${cardClass} p-3.5`}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative min-w-[10rem] flex-1 xl:max-w-[11rem]">
            <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <ContentSelect
              aria-label="Period"
              value={draftRange}
              onChange={(event) => setDraftRange(event.target.value as SuperAdminExecutiveRangeId)}
              className="!h-10 !pl-9"
            >
              {superAdminIntelligenceRanges.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </ContentSelect>
          </label>
          <label className="relative min-w-[10rem] flex-1 xl:max-w-[11rem]">
            <GlobeIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <ContentSelect
              aria-label="Country"
              value={draftCountry}
              onChange={(event) => setDraftCountry(event.target.value)}
              className="!h-10 !pl-9"
            >
              {superAdminIntelligenceCountries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </label>
          <label className="relative min-w-[10rem] flex-1 xl:max-w-[12rem]">
            <TagIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <ContentSelect
              aria-label="Category"
              value={draftCategory}
              onChange={(event) => setDraftCategory(event.target.value)}
              className="!h-10 !pl-9"
            >
              {superAdminIntelligenceCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </label>
          <div className="inline-flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Business type">
            {superAdminIntelligenceBusiness.map((item) => {
              const active = draftBusiness === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDraftBusiness(item.id)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <label className="relative min-w-[10rem] flex-1 xl:max-w-[11rem]">
            <LayersIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <ContentSelect
              aria-label="Version"
              value={draftVersion}
              onChange={(event) => setDraftVersion(event.target.value as typeof draftVersion)}
              className="!h-10 !pl-9"
            >
              {superAdminIntelligenceVersions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </ContentSelect>
          </label>
          <button type="button" onClick={applyFilters} className={`${btnPrimary} h-8 px-3 text-sm xl:ml-auto`} disabled={!dirty}>
            Apply
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="Rank by">
        {superAdminIntelligenceSortTabs.map((tab) => {
          const active = tab.id === sort
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSort(tab.id)}
              className={`-mb-px border-b-2 px-3.5 py-2.5 text-sm transition ${
                active
                  ? 'border-brand font-semibold text-brand'
                  : 'border-transparent font-medium text-slate-500 hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-3 py-2.5 font-semibold">#</th>
                <th className="px-3 py-2.5 font-semibold">Course</th>
                <th className="px-3 py-2.5 font-semibold text-right">Views</th>
                <th className="px-3 py-2.5 font-semibold text-right">Conv.</th>
                <th className="px-3 py-2.5 font-semibold text-right">Purchases</th>
                <th className="px-3 py-2.5 font-semibold text-right">Enrolled</th>
                <th className="px-3 py-2.5 font-semibold text-right">Complete</th>
                <th className="px-3 py-2.5 font-semibold text-right">Rating</th>
                <th className="px-3 py-2.5 font-semibold text-right">Revenue</th>
                <th className="px-3 py-2.5 font-semibold">Growth</th>
                <th className="px-3 py-2.5 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const active = row.id === selected?.id
                return (
                  <tr
                    key={row.id}
                    className={`cursor-pointer border-b border-slate-100 last:border-b-0 ${
                      active ? 'bg-[#EFF4FF]' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => selectRow(row)}
                  >
                    <td className="px-3 py-3.5 text-sm font-medium text-slate-500">{index + 1}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand">
                          <BookIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-navy">{row.course}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{row.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-medium text-navy tabular-nums">
                      {row.views.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-600 tabular-nums">{row.conversion.toFixed(1)}%</td>
                    <td className="px-3 py-3.5 text-right text-sm font-medium text-navy tabular-nums">
                      {row.purchases.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-600 tabular-nums">
                      {row.enrolled.toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-600 tabular-nums">{row.complete}%</td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-400">—</td>
                    <td className="px-3 py-3.5 text-right text-sm font-medium text-navy tabular-nums">
                      {formatRevenue(row.revenue)}
                    </td>
                    <td className="px-3 py-3.5">
                      <GrowthPill value={row.growth} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Sparkline points={row.spark} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-100 px-4 py-3 text-xs leading-5 text-slate-500">
          Rating shows “—” because course ratings are not collected yet. Conversion = purchases ÷ course-page views.
          Completion = completed enrolments ÷ enrolments that started in the period.
        </p>
      </section>

      {selected && compare ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <section className={`${cardClass} p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-navy">{compare.title}</h2>
                <p className="mt-0.5 text-sm text-slate-500">{compare.period}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotice(`Opened full comparison for ${selected.course} (sample).`)}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Open details
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    <th className="py-2 pr-3 font-semibold">Metric</th>
                    <th className="px-3 py-2 font-semibold text-right">Previous</th>
                    <th className="px-3 py-2 font-semibold text-right">Current</th>
                    <th className="py-2 pl-3 font-semibold text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.rows.map((item) => (
                    <tr key={item.metric} className="border-b border-slate-50 last:border-b-0">
                      <td className="py-2.5 pr-3 text-slate-600">{item.metric}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">{item.previous}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-navy">{item.current}</td>
                      <td className="py-2.5 pl-3 text-right">
                        {item.change === '—' ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              item.up ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {item.up ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                            {item.change}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Conversion funnel</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {selected.course.split(':')[0]} · selected period
            </p>
            <ul className="mt-5 space-y-3">
              {funnel.map((step) => (
                <li key={step.label}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-600">{step.label}</span>
                    <span className="font-semibold tabular-nums text-navy">{step.value.toLocaleString('en-US')}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, step.width)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{step.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Ranked by {superAdminIntelligenceSortTabs.find((tab) => tab.id === sort)?.label.toLowerCase()} · {rangeLabel}
            </p>
          </section>
        </div>
      ) : null}
    </div>
  )
}
