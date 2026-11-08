import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  organizationAnnouncements,
  organizationAnnouncementsPage,
  type AnnouncementAudience,
  type AnnouncementStatus,
  type OrganizationAnnouncement,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  BuildingIcon,
  MoreVerticalIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
} from '@/components/ui'

type AnnouncementFilter = 'all' | AnnouncementStatus

function audienceLabel(audience: AnnouncementAudience) {
  if (audience.kind === 'everyone') {
    return organizationAnnouncementsPage.audience.everyone(audience.count)
  }
  if (audience.kind === 'people') {
    return organizationAnnouncementsPage.audience.people(audience.count)
  }
  return organizationAnnouncementsPage.audience.department(audience.name, audience.count)
}

function AudienceIcon({ audience }: { audience: AnnouncementAudience }) {
  if (audience.kind === 'department') {
    return <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
  }
  if (audience.kind === 'people') {
    return <UserIcon className="h-3.5 w-3.5 text-slate-400" />
  }
  return <UsersIcon className="h-3.5 w-3.5 text-slate-400" />
}

function StatusBadge({ status }: { status: AnnouncementStatus }) {
  const styles = {
    sent: 'bg-emerald-50 text-emerald-700',
    scheduled: 'bg-[#EAF2FF] text-brand',
    draft: 'bg-slate-100 text-slate-600',
  } as const
  const dots = {
    sent: 'bg-emerald-500',
    scheduled: 'bg-brand',
    draft: 'bg-slate-400',
  } as const

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {organizationAnnouncementsPage.status[status]}
    </span>
  )
}

function ReadCell({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <span className="text-sm text-slate-300">—</span>
  }

  return (
    <div className="flex min-w-[7rem] items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-brand"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600">{percent}%</span>
    </div>
  )
}

export function OrganizationAnnouncementsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<AnnouncementFilter>('all')
  const [items, setItems] = useState(organizationAnnouncements)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const counts = useMemo(
    () => ({
      all: items.length,
      sent: items.filter((item) => item.status === 'sent').length,
      scheduled: items.filter((item) => item.status === 'scheduled').length,
      drafts: items.filter((item) => item.status === 'draft').length,
    }),
    [items],
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'draft') return items.filter((item) => item.status === 'draft')
    return items.filter((item) => item.status === filter)
  }, [filter, items])

  useEffect(() => {
    if (!menuId) return
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuId(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [menuId])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function createAnnouncement() {
    navigate(paths.organization.newAnnouncement)
  }

  function duplicateAnnouncement(item: OrganizationAnnouncement) {
    const copy: OrganizationAnnouncement = {
      ...item,
      id: `a${Date.now()}`,
      title: `${item.title} (copy)`,
      status: 'draft',
      date: '—',
      readPercent: null,
    }
    setItems((current) => [copy, ...current])
    setMenuId(null)
    showToast(organizationAnnouncementsPage.duplicatedToast)
  }

  function deleteAnnouncement(id: string) {
    setItems((current) => current.filter((item) => item.id !== id))
    setMenuId(null)
    showToast(organizationAnnouncementsPage.deletedToast)
  }

  const filterTabs: Array<{ id: AnnouncementFilter; label: string; count: number }> = [
    { id: 'all', label: organizationAnnouncementsPage.filters.all, count: counts.all },
    { id: 'sent', label: organizationAnnouncementsPage.filters.sent, count: counts.sent },
    {
      id: 'scheduled',
      label: organizationAnnouncementsPage.filters.scheduled,
      count: counts.scheduled,
    },
    { id: 'draft', label: organizationAnnouncementsPage.filters.drafts, count: counts.drafts },
  ]

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
            {organizationAnnouncementsPage.eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">
            {organizationAnnouncementsPage.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            {organizationAnnouncementsPage.subtitle}
          </p>
        </header>
        <button
          type="button"
          onClick={createAnnouncement}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          {organizationAnnouncementsPage.newAnnouncement}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          const active = filter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? 'bg-brand text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          )
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                {organizationAnnouncementsPage.headers.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="px-5 py-3 font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-[#F5F9FF]"
                >
                  <td className="max-w-sm px-5 py-4">
                    <p className="font-semibold text-navy">{item.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{item.subtitle}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <AudienceIcon audience={item.audience} />
                      {audienceLabel(item.audience)}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500">{item.date}</td>
                  <td className="px-5 py-4">
                    <ReadCell percent={item.readPercent} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative flex justify-end" ref={menuId === item.id ? menuRef : null}>
                      <button
                        type="button"
                        aria-label="Announcement actions"
                        onClick={() => setMenuId((current) => (current === item.id ? null : item.id))}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-navy"
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </button>
                      {menuId === item.id ? (
                        <div className="absolute top-9 right-0 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => setMenuId(null)}
                            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {organizationAnnouncementsPage.menu.view}
                          </button>
                          <button
                            type="button"
                            onClick={() => setMenuId(null)}
                            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {organizationAnnouncementsPage.menu.edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateAnnouncement(item)}
                            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {organizationAnnouncementsPage.menu.duplicate}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAnnouncement(item.id)}
                            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            {organizationAnnouncementsPage.menu.delete}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
