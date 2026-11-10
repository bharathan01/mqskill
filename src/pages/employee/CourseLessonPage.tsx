import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import {
  employeeCourseCurriculumPage,
  employeeCourseLessonPage,
  employeeUser,
  findCurriculumItem,
  flattenCurriculumItems,
  getDefaultCurriculumItemId,
  getEmployeeCourse,
  getEmployeeCourseCurriculum,
  type CurriculumItem,
  type CurriculumItemStatus,
  type CurriculumItemType,
  type EmployeeQaQuestion,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ChatIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClipboardIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  GripVerticalIcon,
  InfoIcon,
  LockIcon,
  MoreVerticalIcon,
  PlayIcon,
  SendIcon,
  ThumbsUpIcon,
} from '@/components/ui'

const copy = employeeCourseLessonPage
const curriculumCopy = employeeCourseCurriculumPage

type ContentTab =
  | 'overview'
  | 'transcript'
  | 'resources'
  | 'questions'
  | 'assignments'
  | 'quizzes'

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

function statusStyles(status: CurriculumItemStatus) {
  if (status === 'completed') return 'text-emerald-600'
  if (status === 'in_progress') return 'text-brand'
  if (status === 'available') return 'text-slate-500'
  return 'text-slate-300'
}

function typeIcon(type: CurriculumItemType) {
  if (type === 'quiz') return ClipboardIcon
  if (type === 'assignment') return FileIcon
  return PlayIcon
}

function ItemStatusIcon({ status }: { status: CurriculumItemStatus }) {
  if (status === 'completed') {
    return <CheckCircleIcon className={`h-4 w-4 ${statusStyles(status)}`} />
  }
  if (status === 'locked') {
    return <LockIcon className={`h-4 w-4 ${statusStyles(status)}`} />
  }
  return <span className={`h-2.5 w-2.5 rounded-full bg-current ${statusStyles(status)}`} />
}

export function EmployeeCourseLessonPage() {
  const { courseId = '' } = useParams()
  const course = getEmployeeCourse(courseId)
  const curriculum = useMemo(() => getEmployeeCourseCurriculum(courseId), [courseId])

  const [activeItemId, setActiveItemId] = useState(() => getDefaultCurriculumItemId(curriculum))
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(curriculum.modules.map((module) => [module.id, true])),
  )
  const [contentTab, setContentTab] = useState<ContentTab>('overview')
  const [embedUrl, setEmbedUrl] = useState('')
  const [activeMarker, setActiveMarker] = useState(0)
  const [draft, setDraft] = useState('')
  const [questions, setQuestions] = useState<EmployeeQaQuestion[]>([])
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [assignmentNote, setAssignmentNote] = useState('')
  const [assignmentFile, setAssignmentFile] = useState('')
  const [toast, setToast] = useState('')
  const [itemStatus, setItemStatus] = useState<Record<string, CurriculumItemStatus>>(() => {
    const next: Record<string, CurriculumItemStatus> = {}
    for (const module of curriculum.modules) {
      for (const item of module.items) next[item.id] = item.status
    }
    return next
  })

  const active = findCurriculumItem(curriculum, activeItemId)
  const activeItem = active?.item
  const flat = useMemo(() => flattenCurriculumItems(curriculum), [curriculum])
  const activeIndex = flat.findIndex((entry) => entry.item.id === activeItemId)

  useEffect(() => {
    const nextId = getDefaultCurriculumItemId(curriculum)
    setActiveItemId(nextId)
    setOpenModules(Object.fromEntries(curriculum.modules.map((module) => [module.id, true])))
    const nextStatus: Record<string, CurriculumItemStatus> = {}
    for (const module of curriculum.modules) {
      for (const item of module.items) nextStatus[item.id] = item.status
    }
    setItemStatus(nextStatus)
  }, [curriculum])

  useEffect(() => {
    if (!activeItem || activeItem.type !== 'video' || !activeItem.video) {
      setEmbedUrl('')
      setQuestions([])
      setContentTab('overview')
      return
    }
    setEmbedUrl(youtubeEmbedUrl(activeItem.video.videoId))
    setActiveMarker(0)
    setContentTab('overview')
    setQuestions(
      activeItem.video.questions.map((item) => ({
        ...item,
        replies: item.replies.map((reply) => ({ ...reply })),
      })),
    )
    setLiked({})
    setDraft('')
  }, [activeItemId, activeItem])

  useEffect(() => {
    setQuizAnswers({})
    setQuizScore(null)
    setAssignmentNote('')
    setAssignmentFile('')
  }, [activeItemId])

  if (!course) {
    return <Navigate to={paths.employee.courses} replace />
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function selectItem(item: CurriculumItem) {
    const status = itemStatus[item.id] ?? item.status
    if (status === 'locked') {
      showToast(curriculumCopy.lockedHint)
      return
    }
    setActiveItemId(item.id)
  }

  function seekTo(seconds: number) {
    if (!activeItem?.video) return
    setActiveMarker(seconds)
    setEmbedUrl(youtubeEmbedUrl(activeItem.video.videoId, seconds, true))
  }

  function markComplete() {
    if (!activeItem) return
    setItemStatus((current) => {
      const next = { ...current, [activeItem.id]: 'completed' as const }
      const index = flat.findIndex((entry) => entry.item.id === activeItem.id)
      const upcoming = flat[index + 1]
      if (upcoming && (next[upcoming.item.id] === 'locked' || upcoming.item.status === 'locked')) {
        next[upcoming.item.id] = 'available'
      }
      return next
    })
    showToast(curriculumCopy.markedCompleteToast)
  }

  function goRelative(delta: number) {
    const next = flat[activeIndex + delta]
    if (!next) return
    selectItem(next.item)
  }

  function postQuestion() {
    const body = draft.trim()
    if (!body) return
    const next: EmployeeQaQuestion = {
      id: `q-${Date.now()}`,
      author: copy.you,
      initials: employeeUser.initials,
      isYou: true,
      time: 'Just now',
      body,
      likes: 0,
      status: 'awaiting',
      replies: [],
    }
    setQuestions((current) => [next, ...current])
    setDraft('')
    setContentTab('questions')
    showToast(copy.postedToast)
  }

  function toggleLike(id: string) {
    setLiked((current) => {
      const nextLiked = !current[id]
      setQuestions((items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, likes: Math.max(0, item.likes + (nextLiked ? 1 : -1)) }
            : item,
        ),
      )
      if (nextLiked) showToast(copy.likedToast)
      return { ...current, [id]: nextLiked }
    })
  }

  function submitQuiz() {
    const quiz = activeItem?.quiz
    if (!quiz) return
    if (quiz.questions.some((question) => quizAnswers[question.id] == null)) {
      showToast(curriculumCopy.quizRequired)
      return
    }
    const correct = quiz.questions.filter(
      (question) => quizAnswers[question.id] === question.answerIndex,
    ).length
    const score = Math.round((correct / quiz.questions.length) * 100)
    setQuizScore(score)
    const passed = score >= quiz.passScore
    if (passed || activeItem?.mandatory === false) markComplete()
  }

  function submitAssignment() {
    if (!assignmentFile) {
      showToast('Choose a file before submitting.')
      return
    }
    markComplete()
    showToast(curriculumCopy.assignmentSubmittedToast)
  }

  const video = activeItem?.type === 'video' ? activeItem.video : undefined
  const quiz = activeItem?.type === 'quiz' ? activeItem.quiz : undefined
  const assignment = activeItem?.type === 'assignment' ? activeItem.assignment : undefined
  const currentStatus = activeItem
    ? (itemStatus[activeItem.id] ?? activeItem.status)
    : 'available'

  const courseAssignments = flat.filter((entry) => entry.item.type === 'assignment')
  const courseQuizzes = flat.filter((entry) => entry.item.type === 'quiz')

  const contentTabs: { id: ContentTab; label: string; count?: number }[] = video
    ? [
        { id: 'overview', label: copy.tabs.overview },
        { id: 'transcript', label: copy.tabs.transcript },
        { id: 'resources', label: copy.tabs.resources, count: video.resources.length },
        { id: 'questions', label: copy.tabs.questions, count: questions.length },
        {
          id: 'assignments',
          label: curriculumCopy.assignmentsTab,
          count: courseAssignments.length,
        },
        { id: 'quizzes', label: curriculumCopy.quizzesTab, count: courseQuizzes.length },
      ]
    : []

  const totalItems = flat.length
  const completedItems = flat.filter(
    (entry) => (itemStatus[entry.item.id] ?? entry.item.status) === 'completed',
  ).length
  const progressPercent = Math.round((completedItems / Math.max(totalItems, 1)) * 100)
  const allExpanded = curriculum.modules.every((module) => openModules[module.id])

  function toggleExpandAll() {
    const next = !allExpanded
    setOpenModules(Object.fromEntries(curriculum.modules.map((module) => [module.id, next])))
  }

  function itemRowClass(type: CurriculumItemType, selected: boolean, locked: boolean) {
    if (locked) return 'border-slate-100 bg-slate-50 text-slate-400'
    if (selected) {
      if (type === 'quiz') return 'border-violet-300 bg-violet-50 text-violet-800'
      if (type === 'assignment') return 'border-amber-300 bg-amber-50 text-amber-900'
      return 'border-brand/40 bg-[#EAF2FF] text-navy'
    }
    if (type === 'quiz') return 'border-violet-100 bg-violet-50/70 text-violet-800 hover:bg-violet-50'
    if (type === 'assignment')
      return 'border-amber-100 bg-amber-50/70 text-amber-900 hover:bg-amber-50'
    return 'border-slate-200 bg-white text-navy hover:bg-slate-50'
  }

  function itemIconWrap(type: CurriculumItemType) {
    if (type === 'quiz') return 'bg-violet-100 text-violet-600'
    if (type === 'assignment') return 'bg-amber-100 text-amber-600'
    return 'bg-[#EAF2FF] text-brand'
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.employee.courses}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">{course.title}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {course.instructor} · {curriculumCopy.modulesCount(curriculum.modules.length)} ·{' '}
              {curriculumCopy.itemsCount(totalItems)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{curriculum.description}</p>
          </div>
          <div className="w-full max-w-xs shrink-0">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">{copy.progress(progressPercent)}</span>
              <span className="text-slate-400">
                {completedItems}/{totalItems}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-5">
          {activeItem && !video ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
                    {curriculumCopy.type[activeItem.type]}
                  </span>
                  <span className="text-xs text-slate-400">{activeItem.durationLabel}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      currentStatus === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : currentStatus === 'in_progress'
                          ? 'bg-[#EAF2FF] text-brand'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {curriculumCopy.status[currentStatus]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-navy">{activeItem.title}</h2>
                {active?.module ? (
                  <p className="text-sm text-slate-500">{active.module.title}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={markComplete}
                disabled={currentStatus === 'completed' || currentStatus === 'locked'}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {curriculumCopy.markComplete}
              </button>
            </div>
          ) : null}

          {video ? (
            <>
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

              {activeItem ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
                      {curriculumCopy.type[activeItem.type]}
                    </span>
                    <span className="text-xs text-slate-400">{activeItem.durationLabel}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        currentStatus === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : currentStatus === 'in_progress'
                            ? 'bg-[#EAF2FF] text-brand'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {curriculumCopy.status[currentStatus]}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-navy">{activeItem.title}</h2>
                  {active?.module ? (
                    <p className="text-sm text-slate-500">{active.module.title}</p>
                  ) : null}
                </div>
              ) : null}

              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {contentTabs.map((item) => {
                  const selected = contentTab === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setContentTab(item.id)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        selected
                          ? 'bg-[#EAF2FF] text-brand'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {item.label}
                      {typeof item.count === 'number' ? (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                            selected ? 'bg-white text-brand' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {contentTab === 'overview' ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-navy">{copy.overviewTitle}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{video.overview}</p>
                    </div>
                    <button
                      type="button"
                      onClick={markComplete}
                      disabled={currentStatus === 'completed' || currentStatus === 'locked'}
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {curriculumCopy.markComplete}
                    </button>
                  </div>
                  <h4 className="mt-6 text-sm font-bold text-navy">{copy.chaptersTitle}</h4>
                  <ul className="mt-3 space-y-2">
                    {video.chapters.map((chapter) => (
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

              {contentTab === 'transcript' ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-navy">{copy.transcriptTitle}</h3>
                    <p className="text-xs text-slate-400">{copy.transcriptHint}</p>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {video.transcript.map((line) => (
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

              {contentTab === 'resources' ? (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
                  <ul className="divide-y divide-slate-100">
                    {video.resources.map((resource) => (
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

              {contentTab === 'questions' ? (
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
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                            {question.initials}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-navy">
                                {question.isYou ? copy.you : question.author}
                              </p>
                              <span className="text-xs text-slate-400">{question.time}</span>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  question.status === 'answered'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {question.status === 'answered' ? copy.answered : copy.awaiting}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-700">
                              {question.body}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleLike(question.id)}
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                  liked[question.id]
                                    ? 'text-brand'
                                    : 'text-slate-500 hover:text-brand'
                                }`}
                              >
                                <ThumbsUpIcon className="h-3.5 w-3.5" />
                                {copy.likes(question.likes)}
                              </button>
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <ChatIcon className="h-3.5 w-3.5" />
                                {copy.replies(question.replies.length)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {contentTab === 'assignments' ? (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
                  {courseAssignments.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-slate-500">
                      {curriculumCopy.assignmentsEmpty}
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {courseAssignments.map(({ module, item }) => {
                        const status = itemStatus[item.id] ?? item.status
                        return (
                          <li
                            key={item.id}
                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                  {curriculumCopy.type.assignment}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    item.mandatory === false
                                      ? 'bg-slate-100 text-slate-600'
                                      : 'bg-rose-50 text-rose-700'
                                  }`}
                                >
                                  {item.mandatory === false
                                    ? curriculumCopy.optionalBadge
                                    : curriculumCopy.mandatoryBadge}
                                </span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {item.placement === 'course'
                                    ? curriculumCopy.coursePlacement
                                    : curriculumCopy.modulePlacement}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : status === 'locked'
                                        ? 'bg-slate-100 text-slate-500'
                                        : 'bg-[#EAF2FF] text-brand'
                                  }`}
                                >
                                  {curriculumCopy.status[status]}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm font-bold text-navy">{item.title}</p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {module.title} · {item.assignment?.dueLabel} ·{' '}
                                {item.assignment
                                  ? curriculumCopy.assignmentPoints(item.assignment.points)
                                  : null}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => selectItem(item)}
                              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              {curriculumCopy.openItem}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              ) : null}

              {contentTab === 'quizzes' ? (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
                  {courseQuizzes.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-slate-500">
                      {curriculumCopy.quizzesEmpty}
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {courseQuizzes.map(({ module, item }) => {
                        const status = itemStatus[item.id] ?? item.status
                        return (
                          <li
                            key={item.id}
                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                                  {curriculumCopy.type.quiz}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    item.mandatory === false
                                      ? 'bg-slate-100 text-slate-600'
                                      : 'bg-rose-50 text-rose-700'
                                  }`}
                                >
                                  {item.mandatory === false
                                    ? curriculumCopy.optionalBadge
                                    : curriculumCopy.mandatoryBadge}
                                </span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {item.placement === 'course'
                                    ? curriculumCopy.coursePlacement
                                    : curriculumCopy.modulePlacement}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : status === 'locked'
                                        ? 'bg-slate-100 text-slate-500'
                                        : 'bg-[#EAF2FF] text-brand'
                                  }`}
                                >
                                  {curriculumCopy.status[status]}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm font-bold text-navy">{item.title}</p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {module.title} · {item.durationLabel}
                                {item.quiz
                                  ? ` · ${curriculumCopy.quizPass(item.quiz.passScore)}`
                                  : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => selectItem(item)}
                              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              {curriculumCopy.openItem}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              ) : null}
            </>
          ) : null}

          {quiz ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-navy">{curriculumCopy.quizTitle}</h3>
                <span className="text-xs font-semibold text-slate-500">
                  {curriculumCopy.quizPass(quiz.passScore)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {activeItem?.mandatory === false
                  ? curriculumCopy.optionalBadge
                  : curriculumCopy.quizMandatoryHint}
                {activeItem?.placement === 'course'
                  ? ` · ${curriculumCopy.coursePlacement}`
                  : ` · ${curriculumCopy.modulePlacement}`}
              </p>
              <ul className="mt-5 space-y-5">
                {quiz.questions.map((question, index) => (
                  <li key={question.id}>
                    <p className="text-sm font-semibold text-navy">
                      {index + 1}. {question.prompt}
                    </p>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const selected = quizAnswers[question.id] === optionIndex
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((current) => ({
                                ...current,
                                [question.id]: optionIndex,
                              }))
                            }
                            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm ${
                              selected
                                ? 'border-brand bg-[#EAF2FF] font-semibold text-brand'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                selected
                                  ? 'border-brand bg-brand text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {selected ? <CheckIcon className="h-3 w-3" /> : null}
                            </span>
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </li>
                ))}
              </ul>
              {quizScore != null ? (
                <p
                  className={`mt-5 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                    quizScore >= quiz.passScore
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {curriculumCopy.quizResult(quizScore, quizScore >= quiz.passScore)}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {quizScore != null && quizScore < quiz.passScore ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswers({})
                      setQuizScore(null)
                    }}
                    className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {curriculumCopy.quizRetry}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={submitQuiz}
                  className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {curriculumCopy.quizSubmit}
                </button>
              </div>
            </section>
          ) : null}

          {assignment ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-navy">{curriculumCopy.assignmentTitle}</h3>
                <span className="text-xs font-semibold text-slate-500">
                  {curriculumCopy.assignmentPoints(assignment.points)} · {assignment.dueLabel}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {activeItem?.mandatory === false
                  ? curriculumCopy.optionalBadge
                  : curriculumCopy.assignmentMandatoryHint}
                {activeItem?.placement === 'course'
                  ? ` · ${curriculumCopy.coursePlacement}`
                  : ` · ${curriculumCopy.modulePlacement}`}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{assignment.brief}</p>
              <p className="mt-3 text-xs text-slate-400">
                {curriculumCopy.assignmentAccept}: {assignment.accept}
              </p>
              <label className="mt-5 block text-sm font-semibold text-navy">
                {curriculumCopy.assignmentNote}
                <textarea
                  value={assignmentNote}
                  onChange={(event) => setAssignmentNote(event.target.value)}
                  rows={3}
                  placeholder={curriculumCopy.assignmentNotePlaceholder}
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  {curriculumCopy.assignmentUpload}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      setAssignmentFile(event.target.files?.[0]?.name ?? '')
                    }
                  />
                </label>
                {assignmentFile ? (
                  <span className="text-sm text-slate-500">{assignmentFile}</span>
                ) : null}
                <button
                  type="button"
                  onClick={submitAssignment}
                  className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {curriculumCopy.assignmentSubmit}
                </button>
              </div>
            </section>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goRelative(-1)}
              disabled={activeIndex <= 0}
              className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {curriculumCopy.previous}
            </button>
            <button
              type="button"
              onClick={() => goRelative(1)}
              disabled={activeIndex < 0 || activeIndex >= flat.length - 1}
              className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {curriculumCopy.next}
            </button>
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] shadow-[0_1px_2px_rgba(15,40,80,0.04)] xl:sticky xl:top-6">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-navy">{curriculumCopy.curriculum}</h2>
              <p className="mt-1 text-xs text-slate-400">{curriculumCopy.curriculumHint}</p>
            </div>
            <button
              type="button"
              onClick={toggleExpandAll}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              {allExpanded ? curriculumCopy.collapseAll : curriculumCopy.expandAll}
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition ${allExpanded ? '' : '-rotate-90'}`}
              />
            </button>
          </div>
          <div className="max-h-[70vh] space-y-3 overflow-y-auto p-3">
            {curriculum.modules.map((module) => {
              const open = openModules[module.id] ?? true
              return (
                <div
                  key={module.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenModules((current) => ({
                        ...current,
                        [module.id]: !open,
                      }))
                    }
                    className="flex w-full items-start gap-2 px-3 py-3 text-left hover:bg-slate-50"
                  >
                    <ChevronDownIcon
                      className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition ${
                        open ? '' : '-rotate-90'
                      }`}
                    />
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                      <FolderIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-navy">{module.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                        {module.summary}
                      </span>
                    </span>
                    <span className="mt-1 flex shrink-0 items-center gap-1 text-slate-300">
                      <MoreVerticalIcon className="h-4 w-4" />
                      <GripVerticalIcon className="h-4 w-4" />
                    </span>
                  </button>
                  {open ? (
                    <ul className="space-y-2 border-t border-slate-100 px-3 py-3">
                      {module.items.map((item) => {
                        const Icon = typeIcon(item.type)
                        const status = itemStatus[item.id] ?? item.status
                        const selected = item.id === activeItemId
                        const locked = status === 'locked'
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => selectItem(item)}
                              className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition ${itemRowClass(
                                item.type,
                                selected,
                                locked,
                              )}`}
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${itemIconWrap(item.type)}`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-1.5">
                                  <span className="line-clamp-2 text-sm font-semibold">
                                    {item.title}
                                  </span>
                                  {item.type !== 'video' ? (
                                    <span
                                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                        item.type === 'quiz'
                                          ? 'bg-violet-100 text-violet-700'
                                          : 'bg-amber-100 text-amber-700'
                                      }`}
                                    >
                                      {curriculumCopy.type[item.type]}
                                    </span>
                                  ) : null}
                                  {item.type !== 'video' ? (
                                    <span
                                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                        item.mandatory === false
                                          ? 'bg-slate-100 text-slate-600'
                                          : 'bg-rose-100 text-rose-700'
                                      }`}
                                    >
                                      {item.mandatory === false
                                        ? curriculumCopy.optionalBadge
                                        : curriculumCopy.mandatoryBadge}
                                    </span>
                                  ) : null}
                                </span>
                              </span>
                              {status === 'completed' ? (
                                <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
                              ) : locked ? (
                                <LockIcon className="h-4 w-4 shrink-0 text-slate-300" />
                              ) : (
                                <ItemStatusIcon status={status} />
                              )}
                              <span className="flex shrink-0 items-center gap-0.5 text-slate-300">
                                <MoreVerticalIcon className="h-4 w-4" />
                                <GripVerticalIcon className="h-4 w-4" />
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
