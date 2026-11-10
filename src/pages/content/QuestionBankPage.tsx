import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  contentAssessmentTypes,
  contentDifficulties,
  contentQuestionBank,
  contentQuestionBankPage,
  queueReusedQuestion,
  type QuestionBankItem,
  type QuestionDifficulty,
  type AssessmentQuestionType,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ContentBadge,
  ContentEmptyState,
  ContentNotice,
  ContentRowAction,
} from '@/components/common'
import {
  ChartIcon,
  ClipboardIcon,
  CloseIcon,
  CopyIcon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  RepeatIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
} from '@/components/ui'

const copy = contentQuestionBankPage

const difficultyTone = { easy: 'green', medium: 'amber', hard: 'red' } as const
const typeLabel = Object.fromEntries(contentAssessmentTypes.map((item) => [item.id, item.label])) as Record<
  AssessmentQuestionType,
  string
>
const difficultyLabel = Object.fromEntries(
  contentDifficulties.map((item) => [item.id, item.label]),
) as Record<QuestionDifficulty, string>

const metricTone = {
  blue: 'bg-[#EFF4FF] text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  red: 'bg-rose-50 text-rose-600',
} as const

const letters = 'ABCDEFGHIJ'

function truncate(value: string, max = 90) {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

export function ContentQuestionBankPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState<QuestionBankItem[]>(contentQuestionBank)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [type, setType] = useState<'all' | AssessmentQuestionType>('all')
  const [difficulty, setDifficulty] = useState<'all' | QuestionDifficulty>('all')
  const [course, setCourse] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [preview, setPreview] = useState<QuestionBankItem | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const courses = useMemo(
    () => Array.from(new Set(contentQuestionBank.map((item) => item.course))),
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      if (type !== 'all' && item.type !== type) return false
      if (difficulty !== 'all' && item.difficulty !== difficulty) return false
      if (course !== 'all' && item.course !== course) return false
      if (!needle) return true
      return (
        item.prompt.toLowerCase().includes(needle) ||
        item.tags.some((tag) => tag.toLowerCase().includes(needle))
      )
    })
  }, [course, difficulty, items, query, type])

  const hasFilters = Boolean(query.trim()) || type !== 'all' || difficulty !== 'all' || course !== 'all'
  const allSelected = filtered.length > 0 && filtered.every((item) => selected.includes(item.id))

  const metrics = [
    { id: 'total', label: copy.metrics.total, value: items.length, tone: 'blue' as const },
    {
      id: 'reused',
      label: copy.metrics.reused,
      value: items.filter((item) => item.usedIn > 0).length,
      tone: 'green' as const,
    },
    {
      id: 'tags',
      label: copy.metrics.tags,
      value: new Set(items.flatMap((item) => item.tags)).size,
      tone: 'purple' as const,
    },
    {
      id: 'hard',
      label: copy.metrics.hard,
      value: items.filter((item) => item.difficulty === 'hard').length,
      tone: 'red' as const,
    },
  ]

  function clearFilters() {
    setQuery('')
    setType('all')
    setDifficulty('all')
    setCourse('all')
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    )
  }

  function toggleAll() {
    setSelected((current) =>
      allSelected
        ? current.filter((id) => !filtered.some((item) => item.id === id))
        : Array.from(new Set([...current, ...filtered.map((item) => item.id)])),
    )
  }

  function reuse(ids: string[]) {
    ids.forEach(queueReusedQuestion)
    setSelected([])
    const label =
      ids.length === 1
        ? `“${truncate(items.find((item) => item.id === ids[0])?.prompt ?? '', 40)}”`
        : `${ids.length} questions`
    setNotice(`${label} ${copy.reuseNotice}`)
  }

  function duplicate(item: QuestionBankItem) {
    const copyItem: QuestionBankItem = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      prompt: `${item.prompt} (copy)`,
      usedIn: 0,
      updated: 'Just now',
    }
    setItems((current) => {
      const index = current.findIndex((entry) => entry.id === item.id)
      const next = [...current]
      next.splice(index + 1, 0, copyItem)
      return next
    })
    setNotice(`“${truncate(item.prompt, 40)}” ${copy.duplicateNotice}`)
  }

  function remove(item: QuestionBankItem) {
    setItems((current) => current.filter((entry) => entry.id !== item.id))
    setSelected((current) => current.filter((id) => id !== item.id))
    setNotice(`“${truncate(item.prompt, 40)}” ${copy.removeNotice}`)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(paths.content.assessments)}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 lg:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          {copy.addQuestion}
        </button>
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
              {metric.id === 'total' ? <ClipboardIcon className="h-5 w-5" /> : null}
              {metric.id === 'reused' ? <RepeatIcon className="h-5 w-5" /> : null}
              {metric.id === 'tags' ? <TagIcon className="h-5 w-5" /> : null}
              {metric.id === 'hard' ? <ChartIcon className="h-5 w-5" /> : null}
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
            <FilterIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}
              aria-label="Question type"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allTypes}</option>
              {contentAssessmentTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <ChartIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}
              aria-label="Difficulty"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allDifficulties}</option>
              {contentDifficulties.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <TagIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              aria-label="Course"
              className="h-10 w-full max-w-[14rem] appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allCourses}</option>
              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selected.length ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#EFF4FF] px-5 py-2.5 text-sm">
            <span className="font-semibold text-brand">
              {selected.length} {copy.selected}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected([])}
                className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white"
              >
                {copy.clearSelection}
              </button>
              <button
                type="button"
                onClick={() => reuse(selected)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <RepeatIcon className="h-3.5 w-3.5" />
                {copy.bulkReuse}
              </button>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="w-10 py-3 pl-5 font-semibold">
                  <input
                    type="checkbox"
                    aria-label={copy.selectAll}
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 accent-[#004ea8]"
                  />
                </th>
                <th className="px-3 py-3 font-semibold">{copy.columns.question}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.type}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.tags}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.difficulty}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.columns.usedIn}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.updated}</th>
                <th className="px-5 py-3 font-semibold">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="py-3 pl-5">
                    <input
                      type="checkbox"
                      aria-label={`Select question: ${truncate(item.prompt, 40)}`}
                      checked={selected.includes(item.id)}
                      onChange={() => toggle(item.id)}
                      className="h-4 w-4 accent-[#004ea8]"
                    />
                  </td>
                  <td className="max-w-md px-3 py-3">
                    <span className="block font-semibold text-navy">{truncate(item.prompt, 110)}</span>
                    <span className="block text-xs text-slate-400">{item.course}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{typeLabel[item.type]}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ContentBadge tone={difficultyTone[item.difficulty]}>
                      {difficultyLabel[item.difficulty]}
                    </ContentBadge>
                  </td>
                  <td className="px-3 py-3 text-center text-slate-500">
                    {item.usedIn > 0 ? `${item.usedIn} ${copy.usedInSuffix}` : '—'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{item.updated}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <ContentRowAction label={copy.actions.reuse} onClick={() => reuse([item.id])}>
                        <RepeatIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction label={copy.actions.preview} onClick={() => setPreview(item)}>
                        <EyeIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction label={copy.actions.duplicate} onClick={() => duplicate(item)}>
                        <CopyIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction
                        label={copy.actions.remove}
                        tone="danger"
                        onClick={() => remove(item)}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
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
            icon={<ClipboardIcon className="h-6 w-6" />}
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

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          {copy.showing} {filtered.length} {copy.of} {items.length} {copy.questions}
        </div>
      </section>

      {preview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.previewTitle}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                  {copy.previewTitle}
                </p>
                <h2 className="mt-1 text-base font-bold text-navy">{preview.prompt}</h2>
              </div>
              <button
                type="button"
                aria-label={copy.closePreview}
                onClick={() => setPreview(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ContentBadge tone={difficultyTone[preview.difficulty]}>
                {difficultyLabel[preview.difficulty]}
              </ContentBadge>
              <span className="text-xs text-slate-500">
                {typeLabel[preview.type]} · {preview.points} pts
              </span>
            </div>
            {preview.options.length ? (
              <ul className="mt-4 space-y-2">
                {preview.options.map((option, index) => (
                  <li
                    key={`${preview.id}-${index}`}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                      option.correct
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-5 text-xs font-bold text-slate-400">{letters[index]}</span>
                    {option.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
                Free-text answer, graded manually.
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.closePreview}
              </button>
              <button
                type="button"
                onClick={() => {
                  reuse([preview.id])
                  setPreview(null)
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <RepeatIcon className="h-4 w-4" />
                {copy.actions.reuse}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
