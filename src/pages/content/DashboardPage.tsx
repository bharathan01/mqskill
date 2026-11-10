import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  contentAdminActivity,
  contentAdminAttention,
  contentAdminCourses,
  contentAdminDashboardPage,
  contentAdminDashboardRanges,
  contentAdminQuickActions,
  isWithinDashboardRange,
  type ContentCourseStatus,
  type ContentDashboardRangeId,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  AwardIcon,
  BookIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardIcon,
  EyeIcon,
  FileIcon,
  FilterIcon,
  NetworkIcon,
  PencilIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  TagIcon,
  TrendingUpIcon,
  VideoIcon,
} from '@/components/ui'

const copy = contentAdminDashboardPage

const metricTone = {
  blue: 'bg-[#EFF4FF] text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-violet-50 text-violet-600',
} as const

const statusStyles: Record<ContentCourseStatus, string> = {
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-amber-50 text-amber-700',
  archived: 'bg-slate-100 text-slate-500',
}

const activityTone = {
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-[#EFF4FF] text-brand',
  purple: 'bg-violet-50 text-violet-600',
  red: 'bg-rose-50 text-rose-500',
} as const

const attentionTone = {
  red: 'bg-rose-50 text-rose-500',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-[#EFF4FF] text-brand',
} as const

type CourseRow = (typeof contentAdminCourses)[number]

export function ContentAdminDashboardPage() {
  const navigate = useNavigate()
  const rangeRef = useRef<HTMLDivElement>(null)
  const [rangeId, setRangeId] = useState<ContentDashboardRangeId>('30d')
  const [rangeOpen, setRangeOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<'all' | ContentCourseStatus>('all')
  const [courses, setCourses] = useState<CourseRow[]>(() =>
    contentAdminCourses.map((item) => ({ ...item })),
  )
  const [notice, setNotice] = useState<string | null>(null)

  const rangeLabel =
    contentAdminDashboardRanges.find((item) => item.id === rangeId)?.label ?? copy.rangeLabel

  useEffect(() => {
    function handlePointer(event: PointerEvent) {
      if (!rangeRef.current?.contains(event.target as Node)) setRangeOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    return () => document.removeEventListener('pointerdown', handlePointer)
  }, [])

  const rangedCourses = useMemo(
    () => courses.filter((course) => isWithinDashboardRange(course.updated, rangeId)),
    [courses, rangeId],
  )

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(courses.map((item) => item.category)))],
    [courses],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rangedCourses.filter((course) => {
      if (category !== 'all' && course.category !== category) return false
      if (status !== 'all' && course.status !== status) return false
      if (!needle) return true
      return (
        course.title.toLowerCase().includes(needle) ||
        course.code.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle)
      )
    })
  }, [category, query, rangedCourses, status])

  const rangeDays =
    contentAdminDashboardRanges.find((item) => item.id === rangeId)?.days ?? null

  const activity = useMemo(
    () =>
      contentAdminActivity.filter((item) =>
        rangeDays == null ? true : item.daysAgo <= rangeDays,
      ),
    [rangeDays],
  )

  const metrics = useMemo(() => {
    const published = rangedCourses.filter((item) => item.status === 'published').length
    const draft = rangedCourses.filter((item) => item.status === 'draft').length
    const updates = rangedCourses.length
    return [
      {
        id: 'total',
        label: copy.metrics.total,
        value: String(rangedCourses.length),
        detail: copy.metrics.totalDetail(rangedCourses.length),
        tone: 'blue' as const,
      },
      {
        id: 'published',
        label: copy.metrics.published,
        value: String(published),
        detail: copy.metrics.publishedDetail,
        trend: published ? `+${Math.min(published, 4)}` : undefined,
        tone: 'green' as const,
      },
      {
        id: 'draft',
        label: copy.metrics.draft,
        value: String(draft),
        detail: copy.metrics.draftDetail,
        tone: 'amber' as const,
      },
      {
        id: 'updates',
        label: copy.metrics.updates,
        value: String(updates),
        detail: copy.metrics.updatesDetail,
        trend: updates ? `+${Math.min(updates, 7)}` : undefined,
        tone: 'purple' as const,
      },
    ]
  }, [rangedCourses])

  function toggleArchive(course: CourseRow) {
    const archiving = course.status !== 'archived'
    const nextStatus: ContentCourseStatus = archiving ? 'archived' : 'draft'
    setCourses((current) =>
      current.map((item) => (item.id === course.id ? { ...item, status: nextStatus } : item)),
    )
    setNotice(`“${course.title}” ${archiving ? copy.archiveNotice : copy.restoreNotice}`)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
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
                className="absolute top-[calc(100%+0.35rem)] right-0 z-20 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_28px_rgba(15,40,80,0.12)]"
              >
                {contentAdminDashboardRanges.map((item) => {
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
          <Link
            to={paths.content.courses}
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            {copy.viewAll}
          </Link>
          <Link
            to={paths.content.createCourse}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            {copy.createCourse}
          </Link>
        </div>
      </header>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${metricTone[metric.tone]}`}
              >
                {metric.id === 'total' ? <BookIcon className="h-5 w-5" /> : null}
                {metric.id === 'published' ? <CheckCircleIcon className="h-5 w-5" /> : null}
                {metric.id === 'draft' ? <FileIcon className="h-5 w-5" /> : null}
                {metric.id === 'updates' ? <RefreshIcon className="h-5 w-5" /> : null}
              </span>
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            </div>
            <p className="mt-3 text-[28px] leading-none font-bold tracking-tight text-navy">
              {metric.value}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {metric.trend ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <TrendingUpIcon className="h-3 w-3" />
                  {metric.trend}
                </span>
              ) : null}
              <p className="text-xs text-slate-400">{metric.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-navy">{copy.recentCourses}</h2>
          <div className="flex flex-wrap gap-2">
            <label className="relative min-w-[12rem] flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchCourses}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
              />
            </label>
            <label className="relative">
              <TagIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === 'all' ? copy.allCategories : item}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative">
              <FilterIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
              >
                <option value="all">{copy.allStatuses}</option>
                <option value="published">{copy.status.published}</option>
                <option value="draft">{copy.status.draft}</option>
                <option value="archived">{copy.status.archived}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-5 py-3 font-semibold">{copy.columns.course}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.category}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.columns.version}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.columns.modules}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.columns.submodules}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.status}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.updated}</th>
                <th className="px-5 py-3 font-semibold">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const archived = course.status === 'archived'
                return (
                  <tr key={course.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white ${course.accent}`}
                        >
                          <BookIcon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block font-semibold text-navy">{course.title}</span>
                          <span className="block text-xs text-slate-400">{course.code}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{course.category}</td>
                    <td className="px-3 py-3 text-center text-slate-500">{course.version}</td>
                    <td className="px-3 py-3 text-center text-slate-500">{course.modules}</td>
                    <td className="px-3 py-3 text-center text-slate-500">{course.submodules}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[course.status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {copy.status[course.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-500">{course.updated}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={copy.actions.edit}
                          title={copy.actions.edit}
                          onClick={() => navigate(paths.content.courseBuilder)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={copy.actions.view}
                          title={copy.actions.view}
                          onClick={() => navigate(paths.content.coursePreview)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={copy.actions.versions}
                          title={copy.actions.versions}
                          onClick={() =>
                            navigate(
                              `${paths.content.versions}?course=${encodeURIComponent(course.id)}`,
                            )
                          }
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                          <NetworkIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={archived ? copy.actions.restore : copy.actions.archive}
                          title={archived ? copy.actions.restore : copy.actions.archive}
                          onClick={() => toggleArchive(course)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                          {archived ? (
                            <RefreshIcon className="h-3.5 w-3.5" />
                          ) : (
                            <FileIcon className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">
                    {copy.emptyCourses}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-navy">{copy.activityTitle}</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {copy.activitySubtitle} · {rangeLabel}
              </p>
            </div>
            <Link
              to={paths.content.history}
              className="text-sm font-semibold text-brand hover:text-blue-700"
            >
              {copy.viewLog}
            </Link>
          </div>
          <ul className="mt-2">
            {activity.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0"
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activityTone[item.tone]}`}
                >
                  {item.tone === 'green' ? <CheckCircleIcon className="h-4 w-4" /> : null}
                  {item.tone === 'blue' ? <PencilIcon className="h-4 w-4" /> : null}
                  {item.tone === 'purple' ? <VideoIcon className="h-4 w-4" /> : null}
                  {item.tone === 'red' ? <AlertTriangleIcon className="h-4 w-4" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
              </li>
            ))}
            {!activity.length ? (
              <li className="py-6 text-center text-sm text-slate-500">No activity in this period.</li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-navy">{copy.attentionTitle}</h2>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              {contentAdminAttention.length} {copy.issues}
            </span>
          </div>
          <ul className="mt-3 space-y-3">
            {contentAdminAttention.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${attentionTone[item.tone]}`}
                >
                  <AlertTriangleIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                  <Link
                    to={item.to}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-blue-700"
                  >
                    {item.action}
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-lg font-bold text-navy">{copy.quickTitle}</h2>
          <p className="mt-0.5 text-xs text-slate-400">{copy.quickSubtitle}</p>
          <ul className="mt-4 space-y-2">
            {contentAdminQuickActions.map((action) => (
              <li key={action.id}>
                <Link
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 hover:bg-slate-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF4FF] text-brand">
                    {action.id === 'create' ? <PlusIcon className="h-4 w-4" /> : null}
                    {action.id === 'scorm' ? <FileIcon className="h-4 w-4" /> : null}
                    {action.id === 'quiz' ? <ClipboardIcon className="h-4 w-4" /> : null}
                    {action.id === 'cpd' ? <AwardIcon className="h-4 w-4" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy">{action.title}</span>
                    <span className="block text-xs text-slate-500">{action.detail}</span>
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
