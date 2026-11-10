import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  employeeInboxNotifications,
  employeeNotificationFilterCounts,
  employeeNotificationsPage,
  type EmployeeInboxNotification,
  type EmployeeNotificationFilter,
  type EmployeeNotificationGroup,
  type EmployeeNotificationTone,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  AwardIcon,
  BookIcon,
  ChatIcon,
  CheckIcon,
  ChevronRightIcon,
  ClipboardIcon,
  FilterIcon,
  MegaphoneIcon,
  VideoIcon,
} from '@/components/ui'

const copy = employeeNotificationsPage
const groupOrder: EmployeeNotificationGroup[] = ['today', 'yesterday', 'earlier']

const toneStyles: Record<EmployeeNotificationTone, string> = {
  warning: 'bg-amber-50 text-amber-600',
  session: 'bg-sky-50 text-sky-600',
  assessment: 'bg-[#EEF3FF] text-brand',
  certificate: 'bg-teal-50 text-teal-600',
  announcement: 'bg-rose-50 text-rose-500',
  support: 'bg-slate-100 text-slate-500',
  course: 'bg-blue-50 text-brand',
}

function NotificationIcon({ tone }: { tone: EmployeeNotificationTone }) {
  const className = 'h-5 w-5'
  if (tone === 'warning') return <AlertTriangleIcon className={className} />
  if (tone === 'session') return <VideoIcon className={className} />
  if (tone === 'assessment') return <ClipboardIcon className={className} />
  if (tone === 'certificate') return <AwardIcon className={className} />
  if (tone === 'announcement') return <MegaphoneIcon className={className} />
  if (tone === 'support') return <ChatIcon className={className} />
  return <BookIcon className={className} />
}

function matchesFilter(item: EmployeeInboxNotification, filter: EmployeeNotificationFilter) {
  if (filter === 'all') return true
  if (filter === 'unread') return item.unread
  if (filter === 'sessions') return item.category === 'sessions'
  return item.category === filter
}

export function EmployeeNotificationsPage() {
  const [items, setItems] = useState(() =>
    employeeInboxNotifications.map((item) => ({ ...item })),
  )
  const [filter, setFilter] = useState<EmployeeNotificationFilter>('all')
  const [toast, setToast] = useState('')

  const counts = useMemo(() => employeeNotificationFilterCounts(items), [items])

  const filtered = useMemo(
    () => items.filter((item) => matchesFilter(item, filter)),
    [filter, items],
  )

  const grouped = useMemo(() => {
    return groupOrder
      .map((group) => ({
        group,
        items: filtered.filter((item) => item.group === group),
      }))
      .filter((section) => section.items.length > 0)
  }, [filtered])

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, unread: false })))
    setToast(copy.markedToast)
    window.setTimeout(() => setToast(''), 2200)
  }

  function markRead(id: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    )
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-navy uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <CheckIcon className="h-4 w-4 text-slate-400" />
            {copy.markAllRead}
          </button>
          <Link
            to={paths.employee.profile}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FilterIcon className="h-4 w-4 text-slate-400" />
            {copy.settings}
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(copy.filters) as EmployeeNotificationFilter[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              filter === id
                ? 'bg-brand text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {copy.filters[id]} ({counts[id]})
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          {copy.empty}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          {grouped.map((section) => (
            <section key={section.group}>
              <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-2.5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                  {copy.groups[section.group]}
                </p>
              </div>
              <ul>
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className={`border-b border-slate-100 last:border-0 ${
                      item.unread ? 'bg-[#F5F9FF]' : 'bg-white'
                    }`}
                  >
                    <div className="flex gap-3 px-5 py-4">
                      <span
                        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneStyles[item.tone]}`}
                      >
                        <NotificationIcon tone={item.tone} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-sm font-bold text-navy">{item.title}</h2>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-xs text-slate-400">{item.time}</span>
                            {item.unread ? (
                              <span className="h-2 w-2 rounded-full bg-brand" aria-label="Unread" />
                            ) : null}
                          </div>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{item.body}</p>
                        <Link
                          to={item.actionTo}
                          onClick={() => markRead(item.id)}
                          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700"
                        >
                          {item.actionLabel}
                          <ChevronRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="border-t border-slate-100 px-5 py-4 text-center text-sm text-slate-400">
            {copy.caughtUp}
          </p>
        </div>
      )}
    </div>
  )
}
