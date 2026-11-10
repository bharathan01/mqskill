import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentBadge, ContentEmptyState, ContentNotice } from '@/components/common'
import { CheckCircleIcon, CheckIcon, SearchIcon } from '@/components/ui'
import {
  superAdminActivityItems,
  superAdminActivityTypes,
  type SuperAdminActivityItem,
  type SuperAdminActivityType,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

type StatusFilter = 'all' | 'unread' | 'action' | 'resolved'

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'action', label: 'Needs action' },
  { id: 'resolved', label: 'Resolved' },
]

const typeTone: Record<SuperAdminActivityType, 'blue' | 'green' | 'amber' | 'red' | 'slate'> = {
  purchase: 'green',
  publish: 'blue',
  support: 'amber',
  certificate: 'blue',
  enrollment: 'slate',
  security: 'red',
  system: 'amber',
}

const days: SuperAdminActivityItem['day'][] = ['Today', 'Yesterday', 'Earlier this week']

export function AdminRecentActivityPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | SuperAdminActivityType>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [read, setRead] = useState<string[]>(() => superAdminActivityItems.filter((_, index) => index >= 8).map((item) => item.id))
  const [resolved, setResolved] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  const isRead = (id: string) => read.includes(id)
  const isResolved = (id: string) => resolved.includes(id)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return superAdminActivityItems.filter((item) => {
      if (type !== 'all' && item.type !== type) return false
      if (q && !`${item.title} ${item.detail} ${item.actor}`.toLowerCase().includes(q)) return false
      if (status === 'unread' && read.includes(item.id)) return false
      if (status === 'action' && !(item.needsAction && !resolved.includes(item.id))) return false
      if (status === 'resolved' && !resolved.includes(item.id)) return false
      return true
    })
  }, [query, type, status, read, resolved])

  const unreadCount = superAdminActivityItems.filter((item) => !read.includes(item.id)).length
  const actionCount = superAdminActivityItems.filter((item) => item.needsAction && !resolved.includes(item.id)).length

  function markRead(item: SuperAdminActivityItem) {
    setRead((current) => (current.includes(item.id) ? current : [...current, item.id]))
  }

  function resolve(item: SuperAdminActivityItem) {
    setResolved((current) => [...current, item.id])
    markRead(item)
    setNotice(`“${item.title}” marked as resolved.`)
  }

  function reopen(item: SuperAdminActivityItem) {
    setResolved((current) => current.filter((id) => id !== item.id))
    setNotice(`“${item.title}” reopened.`)
  }

  function markAllRead() {
    setRead(superAdminActivityItems.map((item) => item.id))
    setNotice(`${unreadCount} activity ${unreadCount === 1 ? 'item' : 'items'} marked as read.`)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Dashboard
            <span className="mx-1.5">/</span>
            <span className="text-slate-500">Recent Activity</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Recent Activity</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">Purchases, publishing, support escalations, certificates and security events.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={markAllRead} disabled={unreadCount === 0} className={btnPrimary}>
            <CheckIcon className="h-4 w-4" />
            Mark all as read
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Unread', value: unreadCount },
          { label: 'Needs action', value: actionCount },
          { label: 'Resolved this session', value: resolved.length },
        ].map((card) => (
          <div key={card.label} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-[22px] leading-7 font-bold text-navy">{card.value}</p>
          </div>
        ))}
      </section>

      <section className={`${cardClass} space-y-3 p-3.5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1 lg:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search activity…"
              aria-label="Search activity"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </label>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            {statusFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatus(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  status === item.id ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all' as const, label: 'All types' }, ...superAdminActivityTypes].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setType(item.id)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                type === item.id ? 'border-brand bg-[#EFF4FF] text-brand' : 'border-slate-200 text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {visible.length === 0 ? (
        <section className={cardClass}>
          <ContentEmptyState
            icon={<SearchIcon className="h-6 w-6" />}
            title="No activity matches"
            body="Try another search, type or status to see more of the feed."
          >
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setType('all')
                setStatus('all')
              }}
              className={btnOutline}
            >
              Clear filters
            </button>
          </ContentEmptyState>
        </section>
      ) : (
        days.map((day) => {
          const items = visible.filter((item) => item.day === day)
          if (items.length === 0) return null
          return (
            <section key={day} className="space-y-2.5">
              <h2 className="px-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">{day}</h2>
              <ul className={`${cardClass} divide-y divide-slate-100`}>
                {items.map((item) => {
                  const itemRead = isRead(item.id)
                  const itemResolved = isResolved(item.id)
                  return (
                    <li key={item.id} className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-start ${itemRead ? '' : 'bg-[#F8FAFF]'}`}>
                      <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${itemRead ? 'bg-transparent' : 'bg-brand'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-sm text-navy ${itemRead ? 'font-medium' : 'font-bold'}`}>{item.title}</p>
                          <ContentBadge tone={typeTone[item.type]}>
                            {superAdminActivityTypes.find((entry) => entry.id === item.type)?.label}
                          </ContentBadge>
                          {item.needsAction ? (
                            itemResolved ? (
                              <ContentBadge tone="green">Resolved</ContentBadge>
                            ) : (
                              <ContentBadge tone="amber">Needs action</ContentBadge>
                            )
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.actor} · {item.time}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <Link to={item.to} onClick={() => markRead(item)} className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-navy hover:bg-slate-50">
                          {item.toLabel}
                        </Link>
                        {!itemRead ? (
                          <button type="button" onClick={() => markRead(item)} className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-brand hover:bg-[#EFF4FF]">
                            Mark read
                          </button>
                        ) : null}
                        {item.needsAction && !itemResolved ? (
                          <button type="button" onClick={() => resolve(item)} className="inline-flex h-8 items-center gap-1 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-brand/90">
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            Resolve
                          </button>
                        ) : null}
                        {item.needsAction && itemResolved ? (
                          <button type="button" onClick={() => reopen(item)} className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-slate-500 hover:bg-slate-50">
                            Reopen
                          </button>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}
