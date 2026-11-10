import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  contentAssignmentsPage,
  contentLibraryAssignments,
  todayLabel,
  type AssessmentQuestion,
  type AssignmentDelivery,
  type ContentLibraryAssignment,
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
} from '@/components/common'
import {
  BookIcon,
  FileIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from '@/components/ui'

const copy = contentAssignmentsPage

type Mode = 'list' | 'create' | 'edit'

function emptyDraft(): Omit<
  ContentLibraryAssignment,
  'id' | 'updated' | 'usedInCourses' | 'status'
> {
  return {
    title: '',
    brief: '',
    points: 20,
    dueDays: 7,
    accept: 'PDF, DOC, DOCX',
    delivery: 'questions',
    questions: [],
    pdfFileName: '',
    pdfPreviewUrl: '',
  }
}

export function ContentAssignmentsLibraryPage() {
  const pdfRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<ContentLibraryAssignment[]>(contentLibraryAssignments)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<Mode>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.brief.toLowerCase().includes(needle) ||
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

  function openEdit(item: ContentLibraryAssignment) {
    setEditingId(item.id)
    setDraft({
      title: item.title,
      brief: item.brief,
      points: item.points,
      dueDays: item.dueDays,
      accept: item.accept,
      delivery: item.delivery,
      questions: item.questions,
      pdfFileName: item.pdfFileName,
      pdfPreviewUrl: item.pdfPreviewUrl,
    })
    setMode('edit')
  }

  function handlePdf(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (draft.pdfPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(draft.pdfPreviewUrl)
    const url = URL.createObjectURL(file)
    setDraft((current) => ({
      ...current,
      pdfFileName: file.name,
      pdfPreviewUrl: url,
      delivery: 'pdf',
    }))
    setNotice(copy.pdfUploaded)
  }

  function save() {
    const title = draft.title.trim()
    if (!title) return
    const ready =
      draft.delivery === 'pdf'
        ? Boolean(draft.pdfFileName.trim())
        : draft.questions.length > 0
    const payload: ContentLibraryAssignment = {
      id: editingId ?? `lib-asg-${Math.random().toString(36).slice(2, 8)}`,
      title,
      brief: draft.brief.trim(),
      points: draft.points,
      dueDays: draft.dueDays,
      accept: draft.accept.trim() || 'PDF, DOC, DOCX',
      delivery: draft.delivery,
      questions: draft.delivery === 'questions' ? draft.questions : [],
      pdfFileName: draft.delivery === 'pdf' ? draft.pdfFileName : '',
      pdfPreviewUrl: draft.delivery === 'pdf' ? draft.pdfPreviewUrl : '',
      status: ready ? 'ready' : 'draft',
      updated: todayLabel(),
      usedInCourses: items.find((item) => item.id === editingId)?.usedInCourses ?? [],
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
    setNotice(copy.bankSaved)
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
            <ContentCard title="Assignment details">
              <div className="grid gap-4 md:grid-cols-2">
                <ContentField label={copy.fields.title} htmlFor="asg-title" required className="md:col-span-2">
                  <ContentTextInput
                    id="asg-title"
                    value={draft.title}
                    placeholder="e.g. Workplace scenario write-up"
                    onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  />
                </ContentField>
                <ContentField label={copy.fields.brief} htmlFor="asg-brief" className="md:col-span-2">
                  <ContentTextArea
                    id="asg-brief"
                    rows={3}
                    value={draft.brief}
                    onChange={(event) => setDraft((current) => ({ ...current, brief: event.target.value }))}
                  />
                </ContentField>
                <ContentField label={copy.fields.points} htmlFor="asg-points">
                  <ContentTextInput
                    id="asg-points"
                    type="number"
                    min={1}
                    value={draft.points}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        points: Math.max(1, Number(event.target.value) || 20),
                      }))
                    }
                  />
                </ContentField>
                <ContentField label={copy.fields.dueDays} htmlFor="asg-due">
                  <ContentTextInput
                    id="asg-due"
                    type="number"
                    min={1}
                    value={draft.dueDays}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        dueDays: Math.max(1, Number(event.target.value) || 7),
                      }))
                    }
                  />
                </ContentField>
                <ContentField label={copy.fields.accept} htmlFor="asg-accept" className="md:col-span-2">
                  <ContentTextInput
                    id="asg-accept"
                    value={draft.accept}
                    onChange={(event) => setDraft((current) => ({ ...current, accept: event.target.value }))}
                  />
                </ContentField>
              </div>
            </ContentCard>

            <ContentCard title={copy.fields.delivery}>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['questions', 'pdf'] as AssignmentDelivery[]).map((option) => {
                  const active = draft.delivery === option
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${
                        active ? 'border-brand bg-[#EFF4FF]' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="asg-delivery"
                        checked={active}
                        onChange={() => setDraft((current) => ({ ...current, delivery: option }))}
                        className="mt-1 accent-[#004ea8]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-navy">
                          {copy.delivery[option]}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {copy.deliveryHint[option]}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>

              {draft.delivery === 'pdf' ? (
                <div className="mt-5">
                  <input
                    ref={pdfRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={handlePdf}
                  />
                  <button
                    type="button"
                    onClick={() => pdfRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center hover:border-brand hover:bg-[#F8FBFF]"
                  >
                    <UploadIcon className="h-7 w-7 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-navy">
                      {draft.pdfFileName ? copy.fields.pdfReplace : copy.fields.pdfUpload}
                    </p>
                    {draft.pdfFileName ? (
                      <p className="mt-1 text-xs font-medium text-brand">{draft.pdfFileName}</p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">PDF only · question paper for learners</p>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-bold text-navy">{copy.questionsTitle}</h3>
                  <ContentAssessmentQuestions
                    questions={draft.questions}
                    onChange={(questions) => setDraft((current) => ({ ...current, questions }))}
                    onSaveToBank={saveToBank}
                  />
                </div>
              )}
            </ContentCard>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <ContentCard title="Summary">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Format</dt>
                  <dd className="font-semibold text-navy">{copy.delivery[draft.delivery]}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Points</dt>
                  <dd className="font-semibold text-navy">{draft.points}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Due</dt>
                  <dd className="font-semibold text-navy">{draft.dueDays} days</dd>
                </div>
                {draft.delivery === 'questions' ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">Questions</dt>
                    <dd className="font-semibold text-navy">{draft.questions.length}</dd>
                  </div>
                ) : (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400">PDF</dt>
                    <dd className="max-w-[9rem] truncate text-right font-semibold text-navy">
                      {draft.pdfFileName || '—'}
                    </dd>
                  </div>
                )}
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
          icon={<FileIcon className="h-6 w-6" />}
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">{copy.columns.title}</th>
                <th className="px-4 py-3 font-semibold">{copy.columns.format}</th>
                <th className="px-4 py-3 text-center font-semibold">{copy.columns.points}</th>
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
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.brief}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{copy.delivery[item.delivery]}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{item.points}</td>
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
