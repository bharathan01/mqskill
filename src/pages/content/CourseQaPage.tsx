import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  contentQaPage,
  contentQaQuestions,
  type ContentQaQuestion,
  type ContentQaStatus,
} from '@/constants'
import { useContentWorkspace } from '@/routes/contentWorkspace'
import {
  ContentBadge,
  ContentEmptyState,
  ContentNotice,
  ContentTextArea,
} from '@/components/common'
import { BookIcon, ChatIcon, CheckCircleIcon, SearchIcon, SendIcon } from '@/components/ui'

const copy = contentQaPage

type TabId = 'all' | ContentQaStatus

export function ContentCourseQaPage() {
  const workspace = useContentWorkspace()
  const [searchParams] = useSearchParams()
  const [questions, setQuestions] = useState<ContentQaQuestion[]>(contentQaQuestions)
  const [tab, setTab] = useState<TabId>('all')
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [course, setCourse] = useState('all')
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const courseOptions = useMemo(
    () => ['all', ...Array.from(new Set(contentQaQuestions.map((item) => item.course)))],
    [],
  )

  const counts = {
    all: questions.length,
    open: questions.filter((item) => item.status === 'open').length,
    answered: questions.filter((item) => item.status === 'answered').length,
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return questions.filter((item) => {
      if (tab !== 'all' && item.status !== tab) return false
      if (course !== 'all' && item.course !== course) return false
      if (!needle) return true
      return (
        item.question.toLowerCase().includes(needle) ||
        item.student.toLowerCase().includes(needle) ||
        item.course.toLowerCase().includes(needle)
      )
    })
  }, [course, query, questions, tab])

  const hasFilters = Boolean(query.trim()) || course !== 'all' || tab !== 'all'

  function openReply(item: ContentQaQuestion) {
    setReplyingId(item.id)
    setDraft(item.answer ?? '')
    setError('')
  }

  function cancelReply() {
    setReplyingId(null)
    setDraft('')
    setError('')
  }

  function sendReply(item: ContentQaQuestion) {
    if (!draft.trim()) {
      setError(copy.replyRequired)
      return
    }
    setQuestions((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: 'answered',
              answer: draft.trim(),
              answeredBy: 'Content Admin',
              replies: entry.status === 'answered' ? entry.replies : entry.replies + 1,
            }
          : entry,
      ),
    )
    setNotice(`${copy.replyNotice} ${item.student}.`)
    cancelReply()
  }

  function markAnswered(item: ContentQaQuestion) {
    setQuestions((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, status: 'answered', answeredBy: 'Content Admin' } : entry,
      ),
    )
    setNotice(`${item.student}’s question ${copy.markedNotice}`)
  }

  function clearFilters() {
    setQuery('')
    setCourse('all')
    setTab('all')
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: copy.tabs.all },
    { id: 'open', label: copy.tabs.open },
    { id: 'answered', label: copy.tabs.answered },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
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
            <BookIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              aria-label="Course"
              className="h-10 w-full max-w-[18rem] appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              {courseOptions.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? copy.allCourses : item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length ? (
          <ul className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const replying = replyingId === item.id
              return (
                <li key={item.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF4FF] text-sm font-bold text-brand">
                      {item.initials}
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-navy">{item.student}</span>
                        <span className="text-xs text-slate-400">· {item.asked}</span>
                        <ContentBadge tone={item.status === 'open' ? 'amber' : 'green'}>
                          {copy.status[item.status]}
                        </ContentBadge>
                      </div>
                      <p className="text-sm text-navy">{item.question}</p>
                      <p className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <BookIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium">{item.course}</span>
                        <span className="text-slate-300">/</span>
                        <span>{item.lesson}</span>
                      </p>

                      {item.answer && !replying ? (
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">
                          <p className="text-xs font-semibold text-emerald-700">
                            {item.answeredBy}
                          </p>
                          <p className="mt-0.5 text-sm text-navy">{item.answer}</p>
                        </div>
                      ) : null}

                      {replying ? (
                        <div className="space-y-2">
                          <ContentTextArea
                            rows={3}
                            value={draft}
                            invalid={Boolean(error)}
                            onChange={(event) => {
                              setDraft(event.target.value)
                              setError('')
                            }}
                            placeholder={copy.replyPlaceholder}
                            aria-label={copy.reply}
                          />
                          {error ? (
                            <p className="text-xs font-medium text-rose-600">{error}</p>
                          ) : null}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => sendReply(item)}
                              className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              <SendIcon className="h-4 w-4" />
                              {copy.send}
                            </button>
                            <button
                              type="button"
                              onClick={cancelReply}
                              className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-navy hover:bg-slate-50"
                            >
                              {copy.cancel}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => openReply(item)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            <ChatIcon className="h-3.5 w-3.5" />
                            {item.status === 'answered' ? copy.editReply : copy.reply}
                          </button>
                          {item.status === 'open' ? (
                            <button
                              type="button"
                              onClick={() => markAnswered(item)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-navy hover:bg-slate-50"
                            >
                              <CheckCircleIcon className="h-3.5 w-3.5 text-slate-400" />
                              {copy.markAnswered}
                            </button>
                          ) : null}
                          <Link
                            to={workspace.coursePreview}
                            className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-navy hover:bg-slate-50"
                          >
                            {copy.viewLesson}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <ContentEmptyState
            icon={<ChatIcon className="h-6 w-6" />}
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
        )}
      </section>
    </div>
  )
}
