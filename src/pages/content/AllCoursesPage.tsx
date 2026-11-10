import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  contentAllCoursesPage,
  contentCoursesList,
  type ContentCourseListItem,
  type ContentCourseStatus,
} from '@/constants'
import { useContentWorkspace } from '@/routes/contentWorkspace'
import {
  ContentBadge,
  ContentCourseThumb,
  ContentEmptyState,
  ContentNotice,
  ContentRowAction,
} from '@/components/common'
import {
  BookIcon,
  FileIcon,
  FilterIcon,
  NetworkIcon,
  PencilIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  EyeIcon,
  TagIcon,
} from '@/components/ui'

const copy = contentAllCoursesPage

const statusTone = { published: 'green', draft: 'amber', archived: 'slate' } as const

type SortId = (typeof copy.sortOptions)[number]['id']
type TabId = 'all' | ContentCourseStatus

function parseUpdated(value: string) {
  return new Date(value.replace(' · ', ' ')).getTime() || 0
}

export function ContentAllCoursesPage() {
  const navigate = useNavigate()
  const workspace = useContentWorkspace()
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState<ContentCourseListItem[]>(contentCoursesList)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [category, setCategory] = useState('all')
  const [tab, setTab] = useState<TabId>('all')
  const [sort, setSort] = useState<SortId>('updated')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(contentCoursesList.map((item) => item.category)))],
    [],
  )

  const counts = useMemo(
    () => ({
      all: courses.length,
      published: courses.filter((course) => course.status === 'published').length,
      draft: courses.filter((course) => course.status === 'draft').length,
      archived: courses.filter((course) => course.status === 'archived').length,
    }),
    [courses],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const rows = courses.filter((course) => {
      if (tab !== 'all' && course.status !== tab) return false
      if (category !== 'all' && course.category !== category) return false
      if (!needle) return true
      return (
        course.title.toLowerCase().includes(needle) ||
        course.code.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle)
      )
    })
    return [...rows].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'modules') return b.modules - a.modules
      return parseUpdated(b.updated) - parseUpdated(a.updated)
    })
  }, [category, courses, query, sort, tab])

  const hasFilters = Boolean(query.trim()) || category !== 'all' || tab !== 'all'

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setTab('all')
  }

  function toggleArchive(course: ContentCourseListItem) {
    const archiving = course.status !== 'archived'
    const nextStatus: ContentCourseStatus = archiving ? 'archived' : 'draft'
    setCourses((current) =>
      current.map((item) => (item.id === course.id ? { ...item, status: nextStatus } : item)),
    )
    setNotice(`“${course.title}” ${archiving ? copy.archiveNotice : copy.restoreNotice}`)
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: copy.tabs.all },
    { id: 'published', label: copy.tabs.published },
    { id: 'draft', label: copy.tabs.draft },
    { id: 'archived', label: copy.tabs.archived },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <Link
          to={workspace.createCourse}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 lg:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          {copy.createCourse}
        </Link>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-3 pt-3">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
                tab === item.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  tab === item.id ? 'bg-[#EFF4FF] text-brand' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {counts[item.id]}
              </span>
            </button>
          ))}
        </div>

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
            <TagIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Category"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
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
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              aria-label={copy.sortLabel}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              {copy.sortOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {copy.sortLabel}: {item.label}
                </option>
              ))}
            </select>
          </label>
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
                  <tr
                    key={course.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ContentCourseThumb accent={course.accent} />
                        <span className="min-w-0">
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
                      <ContentBadge tone={statusTone[course.status]}>
                        {copy.status[course.status]}
                      </ContentBadge>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-500">{course.updated}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <ContentRowAction
                          label={copy.actions.edit}
                          onClick={() => navigate(workspace.courseBuilder)}
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </ContentRowAction>
                        <ContentRowAction
                          label={copy.actions.view}
                          onClick={() => navigate(workspace.coursePreview)}
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                        </ContentRowAction>
                        <ContentRowAction
                          label={copy.actions.versions}
                          onClick={() =>
                            navigate(`${workspace.versions}?course=${encodeURIComponent(course.id)}`)
                          }
                        >
                          <NetworkIcon className="h-3.5 w-3.5" />
                        </ContentRowAction>
                        <ContentRowAction
                          label={archived ? copy.actions.restore : copy.actions.archive}
                          onClick={() => toggleArchive(course)}
                        >
                          {archived ? (
                            <RefreshIcon className="h-3.5 w-3.5" />
                          ) : (
                            <FileIcon className="h-3.5 w-3.5" />
                          )}
                        </ContentRowAction>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!filtered.length ? (
          <ContentEmptyState
            icon={<BookIcon className="h-6 w-6" />}
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
            <Link
              to={workspace.createCourse}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              {copy.createCourse}
            </Link>
          </ContentEmptyState>
        ) : null}

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          {copy.showing} {filtered.length} {copy.of} {courses.length} {copy.courses}
        </div>
      </section>
    </div>
  )
}
