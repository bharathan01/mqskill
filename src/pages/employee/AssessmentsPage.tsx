import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  employeeAssessmentCourseScores,
  employeeAssessments,
  employeeAssessmentsPage,
  employeeAssessmentStats,
  employeeAssessmentTrend,
  type EmployeeAssessment,
  type EmployeeAssessmentKind,
  type EmployeeAssessmentStatus,
} from '@/constants'
import { useLearnerAssessmentLinks } from './learnerLinks'
import {
  CheckCircleIcon,
  ClipboardIcon,
  ClockIcon,
  CloseIcon,
  FileIcon,
  SearchIcon,
  TrendingUpIcon,
} from '@/components/ui'

const copy = employeeAssessmentsPage

type KindFilter = 'all' | EmployeeAssessmentKind
type StatusFilter = 'all' | EmployeeAssessmentStatus

function statusStyles(status: EmployeeAssessmentStatus) {
  if (status === 'passed') return 'bg-emerald-50 text-emerald-700'
  if (status === 'failed' || status === 'overdue') return 'bg-red-50 text-red-600'
  if (status === 'submitted') return 'bg-violet-50 text-violet-700'
  if (status === 'in_progress') return 'bg-[#EAF2FF] text-brand'
  return 'bg-slate-100 text-slate-600'
}

function kindStyles(kind: EmployeeAssessmentKind) {
  return kind === 'quiz'
    ? 'bg-violet-50 text-violet-700'
    : 'bg-amber-50 text-amber-700'
}

function LineChart({
  points,
}: {
  points: { label: string; value: number }[]
}) {
  const width = 640
  const height = 280
  const padX = 36
  const padY = 36
  const max = Math.max(...points.map((point) => point.value), 1)
  const stepX = (width - padX * 2) / Math.max(points.length - 1, 1)
  const coords = points.map((point, index) => {
    const x = padX + index * stepX
    const y = height - padY - (point.value / max) * (height - padY * 2)
    return { ...point, x, y }
  })
  const polyline = coords.map((point) => `${point.x},${point.y}`).join(' ')
  const area = `${padX},${height - padY} ${polyline} ${coords.at(-1)?.x ?? padX},${height - padY}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full sm:h-72">
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const y = height - padY - tick * (height - padY * 2)
        return (
          <g key={tick}>
            <line
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text
              x={padX - 8}
              y={y + 3}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
            >
              {Math.round(max * tick)}
            </text>
          </g>
        )
      })}
      <polygon points={area} fill="rgba(0,78,168,0.12)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="#004EA8"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {coords.map((point) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="4" fill="#004EA8" />
          <text
            x={point.x}
            y={height - 10}
            textAnchor="middle"
            className="fill-slate-400 text-[10px]"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function BarChart({
  bars,
}: {
  bars: { label: string; value: number }[]
}) {
  const width = 640
  const height = 280
  const padX = 36
  const padY = 36
  const max = Math.max(...bars.map((bar) => bar.value), 1)
  const slot = (width - padX * 2) / bars.length
  const barWidth = Math.min(28, slot * 0.45)
  const gap = slot - barWidth

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full sm:h-72">
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const y = height - padY - tick * (height - padY * 2)
        return (
          <g key={tick}>
            <line
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text
              x={padX - 8}
              y={y + 3}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
            >
              {Math.round(max * tick)}
            </text>
          </g>
        )
      })}
      {bars.map((bar, index) => {
        const barHeight = (bar.value / max) * (height - padY * 2)
        const x = padX + index * (barWidth + gap) + gap / 2
        const y = height - padY - barHeight
        return (
          <g key={bar.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="6"
              fill={index % 2 === 0 ? '#004EA8' : '#3B82F6'}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              className="fill-navy text-[10px] font-semibold"
            >
              {bar.value}%
            </text>
            <text
              x={x + barWidth / 2}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-400 text-[9px]"
            >
              {bar.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function EmployeeAssessmentsPage() {
  const links = useLearnerAssessmentLinks()
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return employeeAssessments.filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false
      if (status !== 'all' && item.status !== status) return false
      if (!needle) return true
      return (
        item.title.toLowerCase().includes(needle) ||
        item.courseTitle.toLowerCase().includes(needle) ||
        item.moduleLabel.toLowerCase().includes(needle)
      )
    })
  }, [query, kind, status])

  const selected = employeeAssessments.find((item) => item.id === selectedId) ?? null

  function actionLabel(item: EmployeeAssessment) {
    if (item.status === 'not_started') return copy.start
    if (item.status === 'in_progress' || item.status === 'failed' || item.status === 'overdue') {
      return copy.continue
    }
    return copy.open
  }

  function primaryPath(item: EmployeeAssessment) {
    if (item.kind === 'quiz') {
      if (
        item.status === 'passed' ||
        item.status === 'failed' ||
        item.status === 'submitted'
      ) {
        return links.result(item.id)
      }
      return links.quiz(item.id)
    }
    if (item.status === 'passed' || item.status === 'submitted') {
      return links.result(item.id)
    }
    return links.submit(item.id)
  }

  function primaryLabel(item: EmployeeAssessment) {
    if (item.kind === 'quiz') {
      if (item.status === 'passed' || item.status === 'failed' || item.status === 'submitted') {
        return 'View result'
      }
      return item.status === 'not_started' ? 'Start quiz' : 'Continue quiz'
    }
    if (item.status === 'passed' || item.status === 'submitted') return 'View submission'
    return item.status === 'not_started' ? 'Start assignment' : 'Submit assignment'
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.subtitle}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: copy.stats.total,
            value: employeeAssessmentStats.total,
            icon: ClipboardIcon,
            wrap: 'bg-[#EAF2FF] text-brand',
          },
          {
            label: copy.stats.dueSoon,
            value: employeeAssessmentStats.dueSoon,
            icon: ClockIcon,
            wrap: 'bg-amber-50 text-amber-600',
          },
          {
            label: copy.stats.completed,
            value: employeeAssessmentStats.completed,
            icon: CheckCircleIcon,
            wrap: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: copy.stats.avgScore,
            value: `${employeeAssessmentStats.avgScore}%`,
            icon: TrendingUpIcon,
            wrap: 'bg-violet-50 text-violet-600',
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
              </div>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.wrap}`}
              >
                <metric.icon className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.lineTitle}</h2>
          <p className="mt-1 text-xs text-slate-400">{copy.lineSubtitle}</p>
          <div className="mt-4">
            <LineChart points={employeeAssessmentTrend} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.barTitle}</h2>
          <p className="mt-1 text-xs text-slate-400">{copy.barSubtitle}</p>
          <div className="mt-4">
            <BarChart bars={employeeAssessmentCourseScores} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(copy.filters) as KindFilter[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setKind(id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  kind === id
                    ? 'bg-brand text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {copy.filters[id]}
              </button>
            ))}
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand"
          >
            {(Object.keys(copy.statusFilters) as StatusFilter[]).map((id) => (
              <option key={id} value={id}>
                {copy.statusFilters[id]}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-navy">{copy.listTitle}</h2>
            <p className="text-sm text-slate-400">
              {copy.showing} {filtered.length} {copy.of} {employeeAssessments.length} {copy.items}
            </p>
          </div>

          {filtered.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-500">{copy.empty}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          item.kind === 'quiz'
                            ? 'bg-violet-50 text-violet-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {item.kind === 'quiz' ? (
                          <ClipboardIcon className="h-4 w-4" />
                        ) : (
                          <FileIcon className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${kindStyles(item.kind)}`}
                          >
                            {copy.kind[item.kind]}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles(item.status)}`}
                          >
                            {copy.status[item.status]}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm font-bold text-navy">{item.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.courseTitle} · {item.moduleLabel}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.dueLabel} · {copy.score(item.score, item.maxScore)} ·{' '}
                          {copy.attempts(item.attempts, item.maxAttempts)}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={primaryPath(item)}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-white"
                    >
                      {actionLabel(item)}
                    </Link>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-slate-900/30"
            onClick={() => setSelectedId(null)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-[-12px_0_40px_rgba(15,40,80,0.16)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-navy">{copy.detailTitle}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${kindStyles(selected.kind)}`}
                  >
                    {copy.kind[selected.kind]}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles(selected.status)}`}
                  >
                    {copy.status[selected.status]}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div>
                <h3 className="text-lg font-bold text-navy">{selected.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected.brief}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {copy.relatedCourse}
                </p>
                <p className="mt-1.5 text-sm font-bold text-navy">{selected.courseTitle}</p>
                <p className="mt-1 text-xs text-slate-500">{selected.moduleLabel}</p>
                <Link
                  to={links.course(selected.courseId)}
                  className="mt-3 inline-flex text-sm font-semibold text-brand hover:text-blue-700"
                >
                  {copy.openCourse} →
                </Link>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">{copy.due}</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">{selected.dueLabel}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">{copy.module}</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">{selected.moduleLabel}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">{copy.instructor}</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">{selected.instructor}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">Score</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">
                    {copy.score(selected.score, selected.maxScore)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">Attempts</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">
                    {copy.attempts(selected.attempts, selected.maxAttempts)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                  <dt className="text-xs text-slate-400">{copy.submitted}</dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">
                    {selected.submittedOn ?? '—'}
                  </dd>
                </div>
              </dl>

              <div>
                <h4 className="text-sm font-bold text-navy">{copy.feedback}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {selected.feedback ?? copy.noFeedback}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4">
              <Link
                to={links.course(selected.courseId)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.openCourse}
              </Link>
              <Link
                to={primaryPath(selected)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
              >
                {primaryLabel(selected)}
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
