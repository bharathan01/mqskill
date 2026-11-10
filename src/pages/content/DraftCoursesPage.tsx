import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  contentDraftCourses,
  contentDraftsPage,
  type ContentDraftCourse,
} from '@/constants'
import { paths } from '@/routes/paths'
import { ContentCard, ContentEmptyState, ContentNotice } from '@/components/common'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  FileIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
} from '@/components/ui'

const copy = contentDraftsPage

export function ContentDraftCoursesPage() {
  const [searchParams] = useSearchParams()
  const [drafts, setDrafts] = useState<ContentDraftCourse[]>(contentDraftCourses)
  const [discarded, setDiscarded] = useState<ContentDraftCourse | null>(null)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(contentDraftCourses.map((item) => item.category)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return drafts.filter((draft) => {
      if (category !== 'all' && draft.category !== category) return false
      if (!needle) return true
      return (
        draft.title.toLowerCase().includes(needle) ||
        draft.code.toLowerCase().includes(needle) ||
        draft.editor.toLowerCase().includes(needle) ||
        draft.category.toLowerCase().includes(needle)
      )
    })
  }, [category, drafts, query])

  function discard(draft: ContentDraftCourse) {
    setDrafts((current) => current.filter((item) => item.id !== draft.id))
    setDiscarded(draft)
  }

  function undoDiscard() {
    if (!discarded) return
    const restored = discarded
    setDrafts((current) =>
      [...current, restored].sort(
        (a, b) =>
          contentDraftCourses.findIndex((item) => item.id === a.id) -
          contentDraftCourses.findIndex((item) => item.id === b.id),
      ),
    )
    setDiscarded(null)
  }

  const searching = Boolean(query.trim()) || category !== 'all'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {drafts.length}
            </span>
          </div>
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

      {discarded ? (
        <ContentNotice tone="amber">
          <span className="flex flex-wrap items-center gap-3">
            “{discarded.title}” {copy.discardNotice}
            <button
              type="button"
              onClick={undoDiscard}
              className="font-semibold underline underline-offset-2"
            >
              {copy.undo}
            </button>
          </span>
        </ContentNotice>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
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
      </div>

      {filtered.length ? (
        <ul className="grid gap-4 xl:grid-cols-2">
          {filtered.map((draft) => (
            <li
              key={draft.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${draft.accent}`}
                >
                  <FileIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-navy">{draft.title}</h2>
                  <p className="text-xs text-slate-400">
                    {draft.code} · {draft.category}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[#EFF4FF] px-2.5 py-1 text-xs font-semibold text-brand">
                  {copy.stepLabel} {draft.step}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-navy">
                    {draft.progress}% {copy.progress}
                  </span>
                  <span className="text-slate-400">
                    {draft.modules} modules · {draft.submodules} submodules
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuenow={draft.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${draft.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex-1">
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {copy.missingLabel}
                </p>
                {draft.missing.length ? (
                  <ul className="mt-2 space-y-1.5">
                    {draft.missing.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <CheckCircleIcon className="h-4 w-4" />
                    {copy.nothingMissing}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {copy.lastEdited} {draft.updated} {copy.by} {draft.editor}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => discard(draft)}
                    aria-label={`${copy.discard} ${draft.title}`}
                    title={copy.discard}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <Link
                    to={paths.content.coursePreview}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-navy hover:bg-slate-50"
                  >
                    <EyeIcon className="h-4 w-4" />
                    {copy.preview}
                  </Link>
                  <Link
                    to={paths.content.courseBuilder}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {copy.continueEditing}
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ContentCard className="p-0">
          {searching ? (
            <ContentEmptyState
              icon={<SearchIcon className="h-6 w-6" />}
              title={`${copy.emptySearchTitle}${query.trim() ? ` “${query.trim()}”` : ''}`}
              body={copy.emptySearchBody}
            >
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.clearSearch}
              </button>
              <Link
                to={paths.content.createCourse}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.createCourse}
              </Link>
              <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-slate-400">{copy.suggestionsLabel}</span>
                {copy.suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item)
                      setCategory('all')
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-brand hover:text-brand"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </ContentEmptyState>
          ) : (
            <ContentEmptyState
              icon={<FileIcon className="h-6 w-6" />}
              title={copy.emptyAllTitle}
              body={copy.emptyAllBody}
            >
              <Link
                to={paths.content.createCourse}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.createCourse}
              </Link>
            </ContentEmptyState>
          )}
        </ContentCard>
      )}
    </div>
  )
}
