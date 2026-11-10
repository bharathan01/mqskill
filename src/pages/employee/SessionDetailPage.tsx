import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import {
  employeeSessionDetailPage,
  employeeUser,
  getEmployeeLiveSession,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  DownloadIcon,
  FileIcon,
  InfoIcon,
  SendIcon,
} from '@/components/ui'

const copy = employeeSessionDetailPage

type TabId = 'overview' | 'transcript' | 'resources' | 'questions'

function youtubeEmbedUrl(videoId: string, startSeconds = 0, autoplay = false) {
  const params = new URLSearchParams({
    si: 'DHCKVWBcZClAq87f',
    rel: '0',
    modestbranding: '1',
  })
  if (startSeconds > 0) params.set('start', String(Math.floor(startSeconds)))
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

export function EmployeeSessionDetailPage() {
  const { sessionId = '' } = useParams()
  const session = getEmployeeLiveSession(sessionId)

  const [tab, setTab] = useState<TabId>('overview')
  const [embedUrl, setEmbedUrl] = useState('')
  const [activeMarker, setActiveMarker] = useState(0)
  const [draft, setDraft] = useState('')
  const [questions, setQuestions] = useState<
    { id: string; body: string; time: string; likes: number }[]
  >([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!session) return
    setEmbedUrl(youtubeEmbedUrl(session.videoId))
    setActiveMarker(0)
    setTab('overview')
    setQuestions([
      {
        id: 'q1',
        body: 'How should we evidence technological controls for remote staff?',
        time: '2 days ago',
        likes: 4,
      },
      {
        id: 'q2',
        body: 'Is a shared SharePoint site enough for Annex A document control?',
        time: '3 days ago',
        likes: 2,
      },
    ])
  }, [session])

  if (!session) {
    return <Navigate to={paths.employee.sessions} replace />
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function seekTo(seconds: number) {
    setActiveMarker(seconds)
    setEmbedUrl(youtubeEmbedUrl(session.videoId, seconds, true))
  }

  function postQuestion() {
    const body = draft.trim()
    if (!body) return
    setQuestions((current) => [
      { id: `q-${Date.now()}`, body, time: 'Just now', likes: 0 },
      ...current,
    ])
    setDraft('')
    setTab('questions')
    showToast(copy.postedToast)
  }

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'overview', label: copy.tabs.overview },
    { id: 'transcript', label: copy.tabs.transcript },
    { id: 'resources', label: copy.tabs.resources, count: session.resources.length },
    {
      id: 'questions',
      label: copy.tabs.questions,
      count: Math.max(session.questionsCount, questions.length),
    },
  ]

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.employee.sessions}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-5">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-[0_1px_2px_rgba(15,40,80,0.08)]">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="pointer-events-none absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {copy.recording}
                </span>
                <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {copy.captionsAvailable}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">{session.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {session.instructorInitials}
                </span>
                <span className="font-semibold text-navy">{session.instructor}</span>
              </span>
              <span>· Recorded {session.dateLabel}</span>
              <span>· {session.durationLabel}</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((item) => {
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-[#EAF2FF] text-brand'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {item.label}
                  {typeof item.count === 'number' ? (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                        active ? 'bg-white text-brand' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          {tab === 'overview' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
              <h2 className="text-base font-bold text-navy">{copy.aboutTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{session.overview}</p>
              <h3 className="mt-6 text-sm font-bold text-navy">{copy.chaptersTitle}</h3>
              <ul className="mt-3 space-y-2">
                {session.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => seekTo(chapter.time)}
                      className={`flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50 ${
                        activeMarker === chapter.time ? 'bg-[#EAF2FF]' : ''
                      }`}
                    >
                      <span className="min-w-[3.25rem] text-sm font-semibold text-brand">
                        {chapter.label}
                      </span>
                      <span className="text-sm text-slate-700">{chapter.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === 'transcript' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-navy">{copy.tabs.transcript}</h2>
                <p className="text-xs text-slate-400">{copy.transcriptHint}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {session.transcript.map((line) => (
                  <li key={line.id}>
                    <button
                      type="button"
                      onClick={() => seekTo(line.time)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        activeMarker === line.time ? 'bg-[#EAF2FF]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="min-w-[3.25rem] text-sm font-semibold text-brand">
                        {line.label}
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700">{line.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === 'resources' ? (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <ul className="divide-y divide-slate-100">
                {session.resources.map((resource) => (
                  <li key={resource.id} className="flex items-center gap-3 px-5 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                      <FileIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy">{resource.title}</p>
                      <p className="text-xs text-slate-400">{resource.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`${resource.title} ready to download.`)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      {copy.download}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === 'questions' ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {employeeUser.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={3}
                      placeholder={copy.askPlaceholder}
                      className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
                    />
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="inline-flex items-start gap-2 rounded-xl bg-[#EAF2FF] px-3 py-2 text-xs leading-relaxed text-brand">
                        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {copy.askNote}
                      </p>
                      <button
                        type="button"
                        onClick={postQuestion}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <SendIcon className="h-4 w-4" />
                        {copy.post}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {questions.map((question) => (
                  <li
                    key={question.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
                  >
                    <p className="text-sm text-slate-700">{question.body}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {question.time} · {question.likes} likes
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-sm font-bold text-navy">{copy.detailsTitle}</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400">{copy.date}</dt>
                <dd className="mt-0.5 font-semibold text-navy">{session.dateLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">{copy.duration}</dt>
                <dd className="mt-0.5 font-semibold text-navy">{session.durationLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">{copy.instructor}</dt>
                <dd className="mt-0.5 font-semibold text-navy">{session.instructor}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">{copy.relatedCourse}</dt>
                <dd className="mt-0.5 font-semibold text-navy">{session.relatedCourse}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">{copy.attendance}</dt>
                <dd className="mt-1">
                  {session.attendedLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      {copy.attendedLive}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">Recording only</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-sm font-bold text-navy">{copy.resourcesTitle}</h2>
            <ul className="mt-3 space-y-3">
              {session.resources.map((resource) => (
                <li key={resource.id} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FF] text-brand">
                    <FileIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-navy">{resource.title}</p>
                    <p className="text-[11px] text-slate-400">{resource.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`${resource.title} ready to download.`)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brand"
                    aria-label={`Download ${resource.title}`}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
