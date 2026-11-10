import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  contentNotifications,
  contentNotificationsPage,
  type ContentNotification,
  type ContentNotificationTone,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  BellIcon,
  BookIcon,
  CheckCircleIcon,
  CheckIcon,
  ChatIcon,
  FileIcon,
  FolderIcon,
  ImageIcon,
} from '@/components/ui'

const copy = contentNotificationsPage

const toneClass: Record<ContentNotificationTone, string> = {
  publish: 'bg-emerald-50 text-emerald-600',
  draft: 'bg-amber-50 text-amber-600',
  media: 'bg-sky-50 text-sky-600',
  scorm: 'bg-rose-50 text-rose-500',
  qa: 'bg-[#EFF4FF] text-brand',
  system: 'bg-violet-50 text-violet-600',
}

function ToneIcon({ tone }: { tone: ContentNotificationTone }) {
  const className = 'h-4 w-4'
  if (tone === 'publish') return <CheckCircleIcon className={className} />
  if (tone === 'draft') return <FileIcon className={className} />
  if (tone === 'media') return <ImageIcon className={className} />
  if (tone === 'scorm') return <FolderIcon className={className} />
  if (tone === 'qa') return <ChatIcon className={className} />
  return <AlertTriangleIcon className={className} />
}

type FilterId = 'all' | 'unread'

export function ContentNotificationsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<ContentNotification[]>(() =>
    contentNotifications.map((item) => ({ ...item })),
  )
  const [filter, setFilter] = useState<FilterId>('all')
  const [toast, setToast] = useState('')

  const unreadCount = items.filter((item) => item.unread).length

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((item) => item.unread)
    return items
  }, [filter, items])

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, unread: false })))
    setToast(copy.markedToast)
    window.setTimeout(() => setToast(''), 2200)
  }

  function openItem(item: ContentNotification) {
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, unread: false } : entry)),
    )
    navigate(item.to)
  }

  return (
    <div className="space-y-6">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
            {unreadCount ? (
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                {unreadCount} {copy.unreadBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={!unreadCount}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckIcon className="h-4 w-4" />
          {copy.markAll}
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'all' as const, label: copy.filters.all, count: items.length },
            { id: 'unread' as const, label: copy.filters.unread, count: unreadCount },
          ] as const
        ).map((item) => {
          const active = filter === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition ${
                active
                  ? 'bg-brand text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        {filtered.length ? (
          <ul className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openItem(item)}
                  className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50 ${
                    item.unread ? 'bg-[#F8FBFF]' : 'bg-white'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass[item.tone]}`}
                  >
                    <ToneIcon tone={item.tone} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-navy">{item.title}</span>
                      <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500">{item.detail}</span>
                    {item.unread ? (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {copy.unreadBadge}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <BellIcon className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-semibold text-navy">{copy.empty}</p>
            <Link
              to={paths.content.dashboard}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
            >
              <BookIcon className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
