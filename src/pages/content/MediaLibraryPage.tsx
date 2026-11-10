import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router'
import {
  contentMediaPage,
  contentMediaVideos,
  type ContentMediaStatus,
  type ContentMediaVideo,
} from '@/constants'
import {
  ContentBadge,
  ContentEmptyState,
  ContentNotice,
  ContentRowAction,
} from '@/components/common'
import {
  BookIcon,
  CaptionsIcon,
  CloseIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
  VideoIcon,
} from '@/components/ui'

const copy = contentMediaPage

const statusTone = { ready: 'green', processing: 'amber', failed: 'red' } as const
const accents = [
  'from-[#004EA8] to-[#3B82F6]',
  'from-[#0F766E] to-[#34D399]',
  'from-[#B45309] to-[#FBBF24]',
  'from-[#7C3AED] to-[#A78BFA]',
  'from-[#102A4C] to-[#3B6BA5]',
  'from-[#0369A1] to-[#38BDF8]',
]

type SortId = (typeof copy.sortOptions)[number]['id']

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatClock(totalSeconds: number) {
  const total = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function titleFromFile(name: string) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function revokePreview(url?: string) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
}

function Thumb({
  video,
  large = false,
  onOpen,
}: {
  video: ContentMediaVideo
  large?: boolean
  onOpen?: () => void
}) {
  const shell = `relative overflow-hidden bg-gradient-to-br text-white ${video.accent} ${
    large ? 'aspect-video w-full' : 'h-12 w-20 shrink-0 rounded-lg'
  }`

  if (video.previewUrl) {
    return (
      <button type="button" onClick={onOpen} className={`${shell} block`}>
        <video
          src={video.previewUrl}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35">
            <PlayIcon className="h-4 w-4" />
          </span>
        </span>
        <span className="absolute right-1.5 bottom-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold">
          {video.duration}
        </span>
      </button>
    )
  }

  return (
    <button type="button" onClick={onOpen} className={`${shell} flex items-center justify-center`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25">
        <PlayIcon className="h-4 w-4" />
      </span>
      <span className="absolute right-1.5 bottom-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold">
        {video.duration}
      </span>
    </button>
  )
}

function UsedIn({ courses }: { courses: string[] }) {
  if (!courses.length) return <span className="text-xs text-slate-400">{copy.unused}</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {courses.map((course) => (
        <span
          key={course}
          className="inline-flex items-center gap-1 rounded-md bg-[#EFF4FF] px-2 py-0.5 text-xs font-medium text-brand"
        >
          <BookIcon className="h-3 w-3" />
          {course}
        </span>
      ))}
    </div>
  )
}

export function ContentMediaLibraryPage() {
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videos, setVideos] = useState<ContentMediaVideo[]>(contentMediaVideos)
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [status, setStatus] = useState<'all' | ContentMediaStatus>('all')
  const [course, setCourse] = useState('all')
  const [sort, setSort] = useState<SortId>('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [notice, setNotice] = useState<string | null>(null)
  const [editing, setEditing] = useState<ContentMediaVideo | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCaptions, setEditCaptions] = useState(false)
  const [previewing, setPreviewing] = useState<ContentMediaVideo | null>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const courseOptions = useMemo(
    () => ['all', ...Array.from(new Set(videos.flatMap((item) => item.usedIn)))],
    [videos],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const rows = videos.filter((video) => {
      if (status !== 'all' && video.status !== status) return false
      if (course !== 'all' && !video.usedIn.includes(course)) return false
      if (!needle) return true
      return (
        video.title.toLowerCase().includes(needle) ||
        video.usedIn.some((item) => item.toLowerCase().includes(needle))
      )
    })
    return [...rows].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'duration') return b.durationSeconds - a.durationSeconds
      return 0
    })
  }, [course, query, sort, status, videos])

  const storageLabel = useMemo(() => {
    const totalMb = videos.reduce((sum, video) => {
      const match = video.size.match(/([\d.]+)\s*(KB|MB|GB)/i)
      if (!match) return sum
      const value = Number(match[1])
      const unit = match[2].toUpperCase()
      if (unit === 'GB') return sum + value * 1024
      if (unit === 'KB') return sum + value / 1024
      return sum + value
    }, 0)
    if (totalMb >= 1024) return `${(totalMb / 1024).toFixed(1)} GB`
    return `${totalMb.toFixed(0)} MB`
  }, [videos])

  const stats = [
    { label: copy.stats.total, value: String(videos.length) },
    { label: copy.stats.storage, value: storageLabel },
    { label: copy.stats.processing, value: String(videos.filter((v) => v.status === 'processing').length) },
    { label: copy.stats.noCaptions, value: String(videos.filter((v) => !v.captions).length) },
  ]

  const hasFilters = Boolean(query.trim()) || status !== 'all' || course !== 'all'

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setCourse('all')
  }

  function openEdit(video: ContentMediaVideo) {
    setEditing(video)
    setEditTitle(video.title)
    setEditCaptions(video.captions)
  }

  function saveEdit() {
    if (!editing) return
    const title = editTitle.trim() || editing.title
    setVideos((current) =>
      current.map((item) =>
        item.id === editing.id ? { ...item, title, captions: editCaptions } : item,
      ),
    )
    setNotice(`“${title}” ${copy.editNotice}`)
    setEditing(null)
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    const id = `v-${Date.now()}`
    const next: ContentMediaVideo = {
      id,
      title: titleFromFile(file.name),
      duration: '00:00',
      durationSeconds: 0,
      size: formatBytes(file.size),
      status: 'ready',
      captions: false,
      uploaded: 'Just now',
      uploadedBy: 'Content Admin',
      usedIn: [],
      accent: accents[videos.length % accents.length],
      previewUrl,
    }

    setVideos((current) => [next, ...current])
    setPreviewing(next)
    setNotice(`“${next.title}” ${copy.uploadNotice}`)

    const probe = document.createElement('video')
    probe.preload = 'metadata'
    probe.src = previewUrl
    probe.onloadedmetadata = () => {
      const durationSeconds = Math.round(probe.duration) || 0
      setVideos((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                durationSeconds,
                duration: formatClock(durationSeconds),
              }
            : item,
        ),
      )
      setPreviewing((current) =>
        current?.id === id
          ? { ...current, durationSeconds, duration: formatClock(durationSeconds) }
          : current,
      )
      probe.removeAttribute('src')
      probe.load()
    }
  }

  function remove(video: ContentMediaVideo) {
    revokePreview(video.previewUrl)
    setVideos((current) => current.filter((item) => item.id !== video.id))
    if (previewing?.id === video.id) setPreviewing(null)
    if (editing?.id === video.id) setEditing(null)
    setNotice(`“${video.title}” ${copy.deleteNotice}`)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
              {copy.badge}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/*"
            className="sr-only"
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 lg:self-auto"
          >
            <UploadIcon className="h-4 w-4" />
            {copy.upload}
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-[28px] leading-none font-bold tracking-tight text-navy">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 xl:flex-row xl:items-center">
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
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              aria-label="Status"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allStatuses}</option>
              <option value="ready">{copy.status.ready}</option>
              <option value="processing">{copy.status.processing}</option>
              <option value="failed">{copy.status.failed}</option>
            </select>
          </label>
          <label className="relative">
            <BookIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              aria-label="Course"
              className="h-10 w-full max-w-[16rem] appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              {courseOptions.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? copy.allCourses : item}
                </option>
              ))}
            </select>
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            aria-label={copy.sortLabel}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none focus:border-brand"
          >
            {copy.sortOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {copy.sortLabel}: {item.label}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-slate-200 p-0.5">
            {(
              [
                { id: 'grid', label: copy.view.grid, Icon: GridIcon },
                { id: 'list', label: copy.view.list, Icon: ListIcon },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={view === item.id}
                onClick={() => setView(item.id)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${
                  view === item.id ? 'bg-[#EFF4FF] text-brand' : 'text-slate-400 hover:text-navy'
                }`}
              >
                <item.Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {filtered.length && view === 'grid' ? (
          <ul className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((video) => (
              <li
                key={video.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <Thumb video={video} large onOpen={() => setPreviewing(video)} />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy" title={video.title}>
                        {video.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {video.size} · {video.uploaded}
                      </p>
                    </div>
                    <ContentBadge tone={statusTone[video.status]}>
                      {copy.status[video.status]}
                    </ContentBadge>
                  </div>
                  <UsedIn courses={video.usedIn} />
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        video.captions ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <CaptionsIcon className="h-3.5 w-3.5" />
                      {video.captions ? copy.captionsOn : copy.captionsOff}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <ContentRowAction label={copy.edit} onClick={() => openEdit(video)}>
                        <PencilIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction
                        label="Remove video"
                        tone="danger"
                        onClick={() => remove(video)}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {filtered.length && view === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  <th className="px-5 py-3 font-semibold">{copy.columns.video}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.duration}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.usedIn}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.status}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.uploaded}</th>
                  <th className="px-5 py-3 font-semibold">{copy.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((video) => (
                  <tr
                    key={video.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb video={video} onOpen={() => setPreviewing(video)} />
                        <span className="min-w-0">
                          <span className="block font-semibold text-navy">{video.title}</span>
                          <span className="block text-xs text-slate-400">
                            {video.size} · {video.captions ? copy.captionsOn : copy.captionsOff}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{video.duration}</td>
                    <td className="max-w-[20rem] px-3 py-3">
                      <UsedIn courses={video.usedIn} />
                    </td>
                    <td className="px-3 py-3">
                      <ContentBadge tone={statusTone[video.status]}>
                        {copy.status[video.status]}
                      </ContentBadge>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                      {video.uploaded}
                      <span className="block text-xs text-slate-400">{video.uploadedBy}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <ContentRowAction label={copy.edit} onClick={() => openEdit(video)}>
                          <PencilIcon className="h-3.5 w-3.5" />
                        </ContentRowAction>
                        <ContentRowAction
                          label="Remove video"
                          tone="danger"
                          onClick={() => remove(video)}
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
        ) : null}

        {!filtered.length ? (
          <ContentEmptyState
            icon={<VideoIcon className="h-6 w-6" />}
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              {copy.upload}
            </button>
          </ContentEmptyState>
        ) : null}

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          {copy.showing} {filtered.length} {copy.of} {videos.length} {copy.videos}
        </div>
      </section>

      {previewing ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.previewLabel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2744]/55 px-4"
          onClick={() => setPreviewing(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy">{previewing.title}</p>
                <p className="text-xs text-slate-400">
                  {previewing.duration} · {previewing.size}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreviewing(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black">
              {previewing.previewUrl ? (
                <video
                  key={previewing.previewUrl}
                  src={previewing.previewUrl}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full"
                />
              ) : (
                <div
                  className={`flex aspect-video items-center justify-center bg-gradient-to-br text-white ${previewing.accent}`}
                >
                  <p className="px-6 text-center text-sm text-white/80">
                    Sample library item — upload a video file to preview playback here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {editing ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-edit-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2744]/55 px-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h2 id="media-edit-title" className="text-lg font-bold text-navy">
                {copy.edit}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            {editing.previewUrl ? (
              <video
                src={editing.previewUrl}
                controls
                playsInline
                className="mt-4 aspect-video w-full rounded-lg bg-black object-contain"
              />
            ) : null}
            <label className="mt-4 block text-sm font-semibold text-navy" htmlFor="media-edit-title-input">
              {copy.editTitle}
            </label>
            <input
              id="media-edit-title-input"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-navy outline-none focus:border-brand"
            />
            <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={editCaptions}
                onChange={(event) => setEditCaptions(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {copy.editCaptions}
            </label>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.cancelEdit}
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {copy.saveEdit}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
