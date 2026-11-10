import { useEffect, useMemo, useRef, useState } from 'react'
import {
  contentAnalyticsPage,
  contentAnalyticsRanges,
  getAnalyticsCourses,
  getAnalyticsKpis,
  getAnalyticsTrend,
  type ContentAnalyticsRangeId,
  type ContentCompletionTrendPoint,
} from '@/constants'
import {
  ContentBadge,
  ContentCourseThumb,
  ContentEmptyState,
  ContentNotice,
} from '@/components/common'
import {
  BookIcon,
  CalendarIcon,
  ChartIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  DownloadIcon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from '@/components/ui'

const copy = contentAnalyticsPage

const kpiTone = {
  blue: 'bg-[#EFF4FF] text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
} as const

const W = 640
const H = 240
const PAD = { top: 16, right: 16, bottom: 32, left: 40 }

function CompletionChart({ trend }: { trend: ContentCompletionTrendPoint[] }) {
  const [active, setActive] = useState<number | null>(trend.length - 1)

  useEffect(() => {
    setActive(trend.length - 1)
  }, [trend])

  const min = 50
  const max = 100
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const denom = Math.max(trend.length - 1, 1)
  const points = trend.map((item, index) => ({
    ...item,
    x: PAD.left + (innerW * index) / denom,
    y: PAD.top + innerH - ((item.rate - min) / (max - min)) * innerH,
  }))
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${PAD.top + innerH} L${points[0].x},${PAD.top + innerH} Z`
  const ticks = [50, 65, 80, 95]
  const current = active === null ? null : points[active]

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Completion rate by period"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="completion-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#004EA8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#004EA8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => {
          const y = PAD.top + innerH - ((tick - min) / (max - min)) * innerH
          return (
            <g key={tick}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#94A3B8">
                {tick}%
              </text>
            </g>
          )
        })}
        <path d={area} fill="url(#completion-fill)" />
        <path d={line} fill="none" stroke="#004EA8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, index) => (
          <g key={`${p.month}-${index}`}>
            <text x={p.x} y={H - 10} textAnchor="middle" fontSize="11" fill="#64748B">
              {p.month}
            </text>
            <circle
              cx={p.x}
              cy={p.y}
              r={active === index ? 6 : 4}
              fill="#fff"
              stroke="#004EA8"
              strokeWidth="2.5"
            />
            <rect
              x={p.x - 24}
              y={PAD.top}
              width={48}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              tabIndex={0}
              aria-label={`${p.month}: ${p.rate}% completion`}
            />
          </g>
        ))}
      </svg>
      {current ? (
        <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#EFF4FF] px-3 py-1.5 text-sm font-semibold text-brand">
          {current.month}: {current.rate}% completion
        </div>
      ) : null}
    </div>
  )
}

function rateTone(rate: number) {
  if (rate >= 80) return 'green' as const
  if (rate >= 60) return 'amber' as const
  return 'red' as const
}

export function ContentCourseAnalyticsPage() {
  const rangeRef = useRef<HTMLDivElement>(null)
  const [rangeId, setRangeId] = useState<ContentAnalyticsRangeId>('6m')
  const [rangeOpen, setRangeOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const rangeLabel =
    contentAnalyticsRanges.find((item) => item.id === rangeId)?.label ?? copy.range

  const kpis = useMemo(() => getAnalyticsKpis(rangeId), [rangeId])
  const trend = useMemo(() => getAnalyticsTrend(rangeId), [rangeId])
  const courses = useMemo(() => getAnalyticsCourses(rangeId), [rangeId])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rangeRef.current?.contains(event.target as Node)) setRangeOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return courses
      .map((course) => ({ ...course, rate: Math.round((course.completed / course.enrolled) * 100) }))
      .filter(
        (course) =>
          !needle ||
          course.title.toLowerCase().includes(needle) ||
          course.code.toLowerCase().includes(needle),
      )
      .sort((a, b) => b.rate - a.rate)
  }, [courses, query])

  const kpiIcons = {
    enrolled: UsersIcon,
    completion: CheckCircleIcon,
    time: ClockIcon,
    dropoff: AlertTriangleIcon,
  } as const

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
              {copy.badge}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div ref={rangeRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={rangeOpen}
              aria-label={copy.rangeLabel}
              onClick={() => setRangeOpen((open) => !open)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-navy hover:bg-slate-50"
            >
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              {rangeLabel}
              <ChevronDownIcon
                className={`h-4 w-4 text-slate-400 transition ${rangeOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {rangeOpen ? (
              <ul
                role="listbox"
                className="absolute top-[calc(100%+0.35rem)] right-0 z-20 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_28px_rgba(15,40,80,0.12)]"
              >
                {contentAnalyticsRanges.map((item) => {
                  const active = item.id === rangeId
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setRangeId(item.id)
                          setRangeOpen(false)
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm ${
                          active
                            ? 'bg-[#EFF4FF] font-semibold text-brand'
                            : 'text-navy hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                        {active ? <CheckIcon className="h-4 w-4" /> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setNotice(copy.exportNotice)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            {copy.export}
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpiIcons[kpi.id as keyof typeof kpiIcons]
          return (
            <div
              key={kpi.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${kpiTone[kpi.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
              </div>
              <p className="mt-3 text-[28px] leading-none font-bold tracking-tight text-navy">
                {kpi.value}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {kpi.trend ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <TrendingUpIcon className="h-3 w-3" />
                    {kpi.trend}
                  </span>
                ) : null}
                <p className="text-xs text-slate-400">{kpi.detail}</p>
              </div>
            </div>
          )
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-navy">{copy.chartTitle}</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {copy.chartSubtitle} · {rangeLabel}
          </p>
        </div>
        <CompletionChart trend={trend} />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy">{copy.tableTitle}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {copy.tableSubtitle} · {rangeLabel}
            </p>
          </div>
          <label className="relative min-w-[14rem]">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-5 py-3 font-semibold">{copy.columns.course}</th>
                <th className="px-3 py-3 text-right font-semibold">{copy.columns.enrolled}</th>
                <th className="px-3 py-3 text-right font-semibold">{copy.columns.completed}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.rate}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.avgTime}</th>
                <th className="px-5 py-3 font-semibold">{copy.columns.dropOff}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((course) => (
                <tr key={course.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ContentCourseThumb accent={course.accent} />
                      <span className="min-w-0">
                        <span className="block font-semibold text-navy">{course.title}</span>
                        <span className="block text-xs text-slate-400">{course.code}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-500">
                    {course.enrolled.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-500">
                    {course.completed.toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            course.rate >= 80
                              ? 'bg-emerald-500'
                              : course.rate >= 60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                          }`}
                          style={{ width: `${course.rate}%` }}
                        />
                      </div>
                      <ContentBadge tone={rateTone(course.rate)}>{course.rate}%</ContentBadge>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{course.avgTime}</td>
                  <td className="px-5 py-3 text-slate-500">{course.dropOff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rows.length ? (
          <ContentEmptyState
            icon={<ChartIcon className="h-6 w-6" />}
            title={copy.emptyTitle}
            body={copy.emptyBody}
          >
            <button
              type="button"
              onClick={() => setQuery('')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
            >
              <BookIcon className="h-4 w-4" />
              Clear search
            </button>
          </ContentEmptyState>
        ) : null}
      </section>
    </div>
  )
}
