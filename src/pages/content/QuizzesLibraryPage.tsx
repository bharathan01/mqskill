import { useMemo, useState } from 'react'
import {
  contentLibraryQuizzes,
  contentQuizzesPage,
  todayLabel,
  type ContentLibraryQuiz,
  type AssessmentQuestion,
} from '@/constants'
import {
  ContentAssessmentQuestions,
  assessmentQuestionToBankItem,
  ContentBadge,
  ContentCard,
  ContentEmptyState,
  ContentField,
  ContentNotice,
  ContentRowAction,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
} from '@/components/common'
import {
  BookIcon,
  ClipboardIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@/components/ui'

const copy = contentQuizzesPage

type Mode = 'list' | 'create' | 'edit'

function emptyDraft(): Omit<ContentLibraryQuiz, 'id' | 'updated' | 'usedInCourses' | 'questionCount' | 'status'> {
  return {
    title: '',
    description: '',
    passMark: 70,
    maxAttempts: 3,
    timeLimitMin: 0,
    shuffle: true,
    questions: [],
  }
}

export function ContentQuizzesLibraryPage() {
  const [items, setItems] = useState<ContentLibraryQuiz[]>(contentLibraryQuizzes)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<Mode>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [notice, setNotice] = useState<string | null>(null)
  const [bankExtra, setBankExtra] = useState(0)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.usedInCourses.some((course) => course.title.toLowerCase().includes(needle)),
    )
  }, [items, query])

  const metrics = [
    { id: 'total', label: copy.metrics.total, value: items.length, tone: 'text-brand' },
    {
      id: 'ready',
      label: copy.metrics.ready,
      value: items.filter((item) => item.status === 'ready').length,
      tone: 'text-emerald-600',
    },
    {
      id: 'attached',
      label: copy.metrics.attached,
      value: items.filter((item) => item.usedInCourses.length > 0).length,
      tone: 'text-navy',
    },
    {
      id: 'unused',
      label: copy.metrics.unused,
      value: items.filter((item) => item.usedInCourses.length === 0).length,
      tone: 'text-slate-500',
    },
  ]

  function openCreate() {
    setEditingId(null)
    setDraft(emptyDraft())
    setMode('create')
  }

  function openEdit(item: ContentLibraryQuiz) {
    setEditingId(item.id)
    setDraft({
      title: item.title,
      description: item.description,
      passMark: item.passMark,
      maxAttempts: item.maxAttempts,
      timeLimitMin: item.timeLimitMin,
      shuffle: item.shuffle,
      questions: item.questions,
    })
    setMode('edit')
  }

  function save() {
    const title = draft.title.trim()
    if (!title) return
    const payload: ContentLibraryQuiz = {
      id: editingId ?? `lib-quiz-${Math.random().toString(36).slice(2, 8)}`,
      title,
      description: draft.description.trim(),
      passMark: draft.passMark,
      maxAttempts: draft.maxAttempts,
      timeLimitMin: draft.timeLimitMin,
      shuffle: draft.shuffle,
      questions: draft.questions,
      questionCount: draft.questions.length,
      status: draft.questions.length ? 'ready' : 'draft',
      updated: todayLabel(),
      usedInCourses:
        items.find((item) => item.id === editingId)?.usedInCourses ?? [],
    }
    setItems((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? payload : item))
        : [payload, ...current],
    )
    setNotice(editingId ? copy.updateNotice : copy.createNotice)
    setMode('list')
  }

  function saveToBank(question: AssessmentQuestion) {
    assessmentQuestionToBankItem(question)
    setBankExtra((count) => count + 1)
    setNotice(`${copy.bankSaved}${bankExtra >= 0 ? '' : ''}`)
  }

  if (mode !== 'list') {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => setMode('list')}
              className="text-sm font-semibold text-brand hover:text-blue-700"
            >
              ← {copy.backToList}
            </button>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy">
              {mode === 'edit' ? copy.editTitle : copy.create}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('list')}
              className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {copy.save}
            </button>
          </div>
        </header>

        {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            <ContentCard title="Quiz details">
              <div className="grid gap-4 md:grid-cols-2">
                <ContentField label={copy.fields.title} htmlFor="quiz-title" required className="md:col-span-2">
                  <ContentTextInput
                    id="quiz-title"
                    value={draft.title}
                    placeholder="e.g. Module 01 knowledge check"
                    onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  />
                </ContentField>
                <ContentField label={copy.fields.description} htmlFor="quiz-desc" className="md:col-span-2">
                  <ContentTextArea
                    id="quiz-desc"
                    rows={2}
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                </ContentField>
                <ContentField label={copy.fields.passMark} htmlFor="quiz-pass">
                  <ContentTextInput
                    id="quiz-pass"
                    type="number"
                    min={1}
                    max={100}
                    value={draft.passMark}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        passMark: Math.min(100, Math.max(1, Number(event.target.value) || 70)),
                      }))
                    }
                  />
                </ContentField>
                <ContentField label={copy.fields.attempts} htmlFor="quiz-attempts">
                  <ContentTextInput
                    id="quiz-attempts"
                    type="number"
                    min={1}
                    value={draft.maxAttempts}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        maxAttempts: Math.max(1, Number(event.target.value) || 3),
                      }))
                    }
                  />
                </ContentField>
                <ContentField label={copy.fields.timeLimit} htmlFor="quiz-time">
                  <ContentTextInput
                    id="quiz-time"
                    type="number"
                    min={0}
                    value={draft.timeLimitMin}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        timeLimitMin: Math.max(0, Number(event.target.value) || 0),
                      }))
                    }
                  />
                </ContentField>
                <div className="self-end">
                  <ContentToggle
                    checked={draft.shuffle}
                    label={copy.fields.shuffle}
                    onChange={(shuffle) => setDraft((current) => ({ ...current, shuffle }))}
                  />
                </div>
              </div>
            </ContentCard>

            <ContentCard
              title={copy.questionsTitle}
              description={`${draft.questions.length} questions · ${draft.questions.reduce((sum, q) => sum + q.points, 0)} points`}
            >
              <ContentAssessmentQuestions
                questions={draft.questions}
                onChange={(questions) => setDraft((current) => ({ ...current, questions }))}
                onSaveToBank={saveToBank}
              />
            </ContentCard>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <ContentCard title="Summary">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Questions</dt>
                  <dd className="font-semibold text-navy">{draft.questions.length}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Points</dt>
                  <dd className="font-semibold text-navy">
                    {draft.questions.reduce((sum, q) => sum + q.points, 0)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Pass mark</dt>
                  <dd className="font-semibold text-navy">{draft.passMark}%</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Attempts</dt>
                  <dd className="font-semibold text-navy">{draft.maxAttempts}</dd>
                </div>
              </dl>
            </ContentCard>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          {copy.create}
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className={`mt-1 text-2xl font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </section>

      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none focus:border-brand"
        />
      </div>

      {filtered.length === 0 ? (
        <ContentEmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">{copy.columns.title}</th>
                <th className="px-4 py-3 text-center font-semibold">{copy.columns.questions}</th>
                <th className="px-4 py-3 text-center font-semibold">{copy.columns.pass}</th>
                <th className="px-4 py-3 font-semibold">{copy.columns.courses}</th>
                <th className="px-4 py-3 text-center font-semibold">{copy.columns.status}</th>
                <th className="px-4 py-3 font-semibold">{copy.columns.updated}</th>
                <th className="px-4 py-3 text-right font-semibold">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{item.questionCount}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{item.passMark}%</td>
                  <td className="px-4 py-3">
                    {item.usedInCourses.length ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {item.usedInCourses.map((course) => (
                          <li
                            key={course.id}
                            className="inline-flex items-center gap-1 rounded-full bg-[#EFF4FF] px-2.5 py-0.5 text-xs font-medium text-brand"
                          >
                            <BookIcon className="h-3 w-3" />
                            {course.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-400">{copy.unused}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ContentBadge tone={item.status === 'ready' ? 'green' : 'amber'}>
                      {copy.status[item.status]}
                    </ContentBadge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{item.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ContentRowAction label={copy.edit} onClick={() => openEdit(item)}>
                        <PencilIcon className="h-4 w-4" />
                      </ContentRowAction>
                      <ContentRowAction
                        label={copy.remove}
                        tone="danger"
                        onClick={() => {
                          setItems((current) => current.filter((entry) => entry.id !== item.id))
                          setNotice(copy.removeNotice)
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </ContentRowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
