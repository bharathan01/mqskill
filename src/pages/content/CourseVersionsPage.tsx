import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  contentCourseVersions,
  contentVersionsPage,
  type ContentCourseVersion,
  type ContentVersionStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ContentBadge,
  ContentEmptyState,
  ContentNotice,
  ContentRowAction,
} from '@/components/common'
import {
  BookIcon,
  CheckCircleIcon,
  CopyIcon,
  EyeIcon,
  FileIcon,
  FilterIcon,
  HistoryIcon,
  NetworkIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from '@/components/ui'

const copy = contentVersionsPage

const statusTone = { live: 'green', draft: 'amber', superseded: 'slate' } as const

const metricTone = {
  blue: 'bg-[#EFF4FF] text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-violet-50 text-violet-600',
} as const

export function ContentCourseVersionsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [versions, setVersions] = useState<ContentCourseVersion[]>(contentCourseVersions)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | ContentVersionStatus>('all')
  const [notice, setNotice] = useState<string | null>(null)
  const courseFilter = searchParams.get('course') ?? 'all'

  const courseOptions = useMemo(() => {
    const seen = new Map<string, string>()
    contentCourseVersions.forEach((item) => seen.set(item.courseId, item.courseTitle))
    return Array.from(seen, ([id, title]) => ({ id, title }))
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return versions.filter((item) => {
      if (courseFilter !== 'all' && item.courseId !== courseFilter) return false
      if (status !== 'all' && item.status !== status) return false
      if (!needle) return true
      return (
        item.courseTitle.toLowerCase().includes(needle) ||
        item.code.toLowerCase().includes(needle) ||
        item.summary.toLowerCase().includes(needle) ||
        item.version.toLowerCase().includes(needle)
      )
    })
  }, [courseFilter, query, status, versions])

  const metrics = [
    { id: 'total', label: copy.metrics.total, value: versions.length, tone: 'blue' as const },
    {
      id: 'live',
      label: copy.metrics.live,
      value: versions.filter((item) => item.status === 'live').length,
      tone: 'green' as const,
    },
    {
      id: 'pending',
      label: copy.metrics.pending,
      value: versions.filter((item) => item.status === 'draft').length,
      tone: 'amber' as const,
    },
    { id: 'courses', label: copy.metrics.courses, value: courseOptions.length, tone: 'purple' as const },
  ]

  function setCourseFilter(value: string) {
    if (value === 'all') setSearchParams({})
    else setSearchParams({ course: value })
  }

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setSearchParams({})
  }

  function restore(version: ContentCourseVersion) {
    const siblings = versions.filter((item) => item.courseId === version.courseId)
    const next = `v${siblings.length + 1}.0`
    const entry: ContentCourseVersion = {
      ...version,
      id: `${version.id}-restore-${siblings.length}`,
      version: next,
      status: 'draft',
      summary: `Restored from ${version.version}.`,
      author: 'Content Admin',
      date: 'Just now',
    }
    setVersions((current) => [entry, ...current])
    setNotice(`${version.courseTitle} ${version.version} ${copy.restoreNotice}`)
  }

  const hasFilters = Boolean(query.trim()) || status !== 'all' || courseFilter !== 'all'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <Link
          to={paths.content.createCourse}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 lg:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          {copy.createCourse}
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${metricTone[metric.tone]}`}
            >
              {metric.id === 'total' ? <HistoryIcon className="h-5 w-5" /> : null}
              {metric.id === 'live' ? <CheckCircleIcon className="h-5 w-5" /> : null}
              {metric.id === 'pending' ? <FileIcon className="h-5 w-5" /> : null}
              {metric.id === 'courses' ? <BookIcon className="h-5 w-5" /> : null}
            </span>
            <div>
              <p className="text-2xl leading-none font-bold text-navy">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
            </div>
          </div>
        ))}
      </section>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center">
          <label className="relative min-w-[12rem] flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </label>
          <label className="relative">
            <BookIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
              aria-label="Course"
              className="h-10 w-full max-w-[16rem] appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allCourses}</option>
              {courseOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <FilterIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              aria-label="Status"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allStatuses}</option>
              <option value="live">{copy.status.live}</option>
              <option value="draft">{copy.status.draft}</option>
              <option value="superseded">{copy.status.superseded}</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-5 py-3 font-semibold">{copy.columns.course}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.columns.version}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.status}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.summary}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.author}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.date}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.columns.content}</th>
                <th className="px-5 py-3 font-semibold">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3">
                    <span className="block font-semibold text-navy">{item.courseTitle}</span>
                    <span className="block text-xs text-slate-400">{item.code}</span>
                  </td>
                  <td className="px-3 py-3 text-center font-semibold text-navy">{item.version}</td>
                  <td className="px-3 py-3">
                    <ContentBadge tone={statusTone[item.status]}>
                      {copy.status[item.status]}
                    </ContentBadge>
                  </td>
                  <td className="max-w-xs px-3 py-3 text-slate-500">{item.summary}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{item.author}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{item.date}</td>
                  <td className="px-3 py-3 text-center text-xs whitespace-nowrap text-slate-500">
                    {item.modules} mod · {item.submodules} sub
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <ContentRowAction
                        label={copy.actions.view}
                        onClick={() => navigate(paths.content.coursePreview)}
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction label={copy.actions.compare}>
                        <CopyIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction
                        label={copy.actions.restore}
                        onClick={() => restore(item)}
                      >
                        <RefreshIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length ? (
          <ContentEmptyState
            icon={<NetworkIcon className="h-6 w-6" />}
            title={copy.emptyTitle}
            body={copy.emptyBody}
          >
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.clearFilters}
              </button>
            ) : null}
          </ContentEmptyState>
        ) : null}
      </section>
    </div>
  )
}
