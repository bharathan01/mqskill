import { useMemo, useState } from 'react'
import {
  contentHistoryPage,
  contentPublishEvents,
  type ContentPublishAction,
} from '@/constants'
import { ContentBadge, ContentEmptyState, ContentNotice } from '@/components/common'
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  DownloadIcon,
  FilterIcon,
  HistoryIcon,
  RefreshIcon,
  SearchIcon,
  UserIcon,
  EyeOffIcon,
} from '@/components/ui'

const copy = contentHistoryPage

const actionTone = {
  published: 'green',
  unpublished: 'slate',
  'rolled-back': 'amber',
  scheduled: 'blue',
  failed: 'red',
} as const

const dotTone = {
  published: 'bg-emerald-50 text-emerald-600',
  unpublished: 'bg-slate-100 text-slate-500',
  'rolled-back': 'bg-amber-50 text-amber-600',
  scheduled: 'bg-[#EFF4FF] text-brand',
  failed: 'bg-rose-50 text-rose-500',
} as const

function ActionIcon({ action }: { action: ContentPublishAction }) {
  const cls = 'h-4 w-4'
  if (action === 'published') return <CheckCircleIcon className={cls} />
  if (action === 'unpublished') return <EyeOffIcon className={cls} />
  if (action === 'rolled-back') return <RefreshIcon className={cls} />
  if (action === 'scheduled') return <CalendarIcon className={cls} />
  return <AlertTriangleIcon className={cls} />
}

export function ContentPublishingHistoryPage() {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState<'all' | ContentPublishAction>('all')
  const [user, setUser] = useState('all')
  const [view, setView] = useState<'timeline' | 'table'>('timeline')
  const [notice, setNotice] = useState<string | null>(null)

  const users = useMemo(
    () => ['all', ...Array.from(new Set(contentPublishEvents.map((item) => item.by)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return contentPublishEvents.filter((event) => {
      if (action !== 'all' && event.action !== action) return false
      if (user !== 'all' && event.by !== user) return false
      if (!needle) return true
      return (
        event.course.toLowerCase().includes(needle) ||
        event.code.toLowerCase().includes(needle) ||
        event.version.toLowerCase().includes(needle) ||
        event.by.toLowerCase().includes(needle)
      )
    })
  }, [action, query, user])

  const stats = [
    { label: copy.stats.total, value: contentPublishEvents.length },
    { label: copy.stats.published, value: contentPublishEvents.filter((e) => e.action === 'published').length },
    { label: copy.stats.rollbacks, value: contentPublishEvents.filter((e) => e.action === 'rolled-back').length },
    { label: copy.stats.failed, value: contentPublishEvents.filter((e) => e.action === 'failed').length },
  ]

  const hasFilters = Boolean(query.trim()) || action !== 'all' || user !== 'all'

  function clearFilters() {
    setQuery('')
    setAction('all')
    setUser('all')
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
          onClick={() => setNotice(copy.exportNotice)}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50 lg:self-auto"
        >
          <DownloadIcon className="h-4 w-4" />
          {copy.export}
        </button>
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
              value={action}
              onChange={(event) => setAction(event.target.value as typeof action)}
              aria-label="Action"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allActions}</option>
              {(Object.keys(copy.action) as ContentPublishAction[]).map((key) => (
                <option key={key} value={key}>
                  {copy.action[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={user}
              onChange={(event) => setUser(event.target.value)}
              aria-label="Publisher"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              {users.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? copy.allUsers : item}
                </option>
              ))}
            </select>
          </label>
          <div className="flex rounded-lg border border-slate-200 p-0.5">
            {(['timeline', 'table'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={view === id}
                className={`h-9 rounded-md px-3 text-sm font-semibold ${
                  view === id ? 'bg-[#EFF4FF] text-brand' : 'text-slate-500 hover:text-navy'
                }`}
              >
                {copy.view[id]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length && view === 'timeline' ? (
          <ol className="px-5 py-5">
            {filtered.map((event, index) => (
              <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < filtered.length - 1 ? (
                  <span className="absolute top-10 bottom-0 left-[19px] w-px bg-slate-200" />
                ) : null}
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${dotTone[event.action]}`}
                >
                  <ActionIcon action={event.action} />
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-navy">{event.course}</p>
                    <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      {event.version}
                    </span>
                    <ContentBadge tone={actionTone[event.action]}>
                      {copy.action[event.action]}
                    </ContentBadge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{event.note}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" />
                      {event.by}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {event.at}
                    </span>
                    <span>{event.code}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {filtered.length && view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  <th className="px-5 py-3 font-semibold">{copy.columns.course}</th>
                  <th className="px-3 py-3 text-center font-semibold">{copy.columns.version}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.action}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.by}</th>
                  <th className="px-3 py-3 font-semibold">{copy.columns.at}</th>
                  <th className="px-5 py-3 font-semibold">{copy.columns.note}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <span className="block font-semibold text-navy">{event.course}</span>
                      <span className="block text-xs text-slate-400">{event.code}</span>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-500">{event.version}</td>
                    <td className="px-3 py-3">
                      <ContentBadge tone={actionTone[event.action]}>
                        {copy.action[event.action]}
                      </ContentBadge>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-500">{event.by}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-500">{event.at}</td>
                    <td className="max-w-[22rem] px-5 py-3 text-slate-500">{event.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!filtered.length ? (
          <ContentEmptyState
            icon={<HistoryIcon className="h-6 w-6" />}
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
      </section>
    </div>
  )
}
