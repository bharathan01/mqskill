import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  employeeLiveSessions,
  employeeSessionPath,
  employeeSessionsFeaturedId,
  employeeSessionsPage,
  type LiveSession,
  type LiveSessionTab,
} from '@/constants'
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PlayIcon,
  VideoIcon,
} from '@/components/ui'

const copy = employeeSessionsPage

export function EmployeeSessionsPage() {
  const [tab, setTab] = useState<LiveSessionTab>('upcoming')
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(employeeLiveSessions.map((item) => [item.id, item.registered])),
  )
  const [toast, setToast] = useState('')

  const featured = employeeLiveSessions.find((item) => item.id === employeeSessionsFeaturedId)

  const upcoming = useMemo(
    () =>
      employeeLiveSessions.filter(
        (item) => item.status === 'upcoming' || item.status === 'registered',
      ),
    [],
  )
  const registered = useMemo(
    () => upcoming.filter((item) => registeredIds[item.id]),
    [upcoming, registeredIds],
  )
  const recordings = useMemo(
    () => employeeLiveSessions.filter((item) => item.status === 'recording'),
    [],
  )

  const tabCounts = {
    upcoming: upcoming.length,
    registered: registered.length,
    recordings: recordings.length,
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function register(session: LiveSession) {
    setRegisteredIds((current) => ({ ...current, [session.id]: true }))
    showToast(copy.registeredToast)
  }

  const list =
    tab === 'upcoming' ? upcoming : tab === 'registered' ? registered : recordings

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
            <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand uppercase">
              {copy.badge}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.subtitle}</p>
        </header>
        <button
          type="button"
          onClick={() => showToast(copy.syncedToast)}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <CalendarIcon className="h-4 w-4" />
          {copy.syncCalendar}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(Object.keys(copy.tabs) as LiveSessionTab[]).map((id) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'bg-[#EAF2FF] text-brand'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {copy.tabs[id]}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  active ? 'bg-white text-brand' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tabCounts[id]}
              </span>
            </button>
          )
        })}
      </div>

      {tab === 'upcoming' && featured ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div className="relative flex min-h-48 items-center justify-center bg-gradient-to-br from-[#004EA8] to-[#3B82F6] p-6">
              <VideoIcon className="h-14 w-14 text-white/90" />
              {featured.startsIn ? (
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-navy">
                  {copy.startsIn(featured.startsIn)}
                </span>
              ) : null}
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                {registeredIds[featured.id] ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {copy.registered}
                  </span>
                ) : null}
                <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
                  {featured.track}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-navy sm:text-2xl">{featured.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{featured.summary}</p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {featured.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {copy.duration(featured.durationLabel, featured.cpdHours)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <VideoIcon className="h-3.5 w-3.5" />
                  {featured.platform}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {featured.instructorInitials}
                </span>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-navy">{featured.instructor}</span>
                  {', '}
                  {featured.instructorRole}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => showToast(copy.joinToast)}
                  className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {copy.join}
                </button>
                <button
                  type="button"
                  onClick={() => showToast(copy.calendarToast)}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copy.addCalendar}
                </button>
                <button
                  type="button"
                  onClick={() => showToast(copy.questionToast)}
                  className="inline-flex h-10 items-center rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  {copy.askQuestion}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {tab === 'upcoming' ? (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy">{copy.upcomingTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upcoming
              .filter((item) => item.id !== featured?.id)
              .map((session) => {
                const isRegistered = registeredIds[session.id]
                return (
                  <article
                    key={session.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
                  >
                    <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[#004EA8] to-[#60A5FA]">
                      <VideoIcon className="h-8 w-8 text-white/90" />
                      {session.dayBadge ? (
                        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy">
                          {session.dayBadge}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-xs font-semibold text-brand">{session.track}</p>
                      <h3 className="mt-1 text-sm font-bold text-navy">{session.title}</h3>
                      <p className="mt-2 text-xs text-slate-500">
                        {session.dateLabel} · {session.durationLabel}
                      </p>
                      <div className="mt-auto pt-4">
                        {isRegistered ? (
                          <span className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                            <CheckIcon className="h-4 w-4 text-emerald-600" />
                            {copy.registered}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => register(session)}
                            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            {copy.register}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
          </div>
        </section>
      ) : null}

      {tab === 'registered' ? (
        <section className="space-y-3">
          {registered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
              {copy.empty}
            </div>
          ) : (
            <ul className="space-y-3">
              {registered.map((session) => (
                <li
                  key={session.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {copy.registered}
                      </span>
                      <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
                        {session.track}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-navy">{session.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {session.dateLabel} · {session.timeLabel} · {session.durationLabel}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => showToast(copy.calendarToast)}
                      className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {copy.addCalendar}
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(copy.joinToast)}
                      className="inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      {copy.join}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {(tab === 'upcoming' || tab === 'recordings') && recordings.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-navy">{copy.recordingsTitle}</h2>
            {tab === 'upcoming' ? (
              <button
                type="button"
                onClick={() => setTab('recordings')}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                {copy.viewAll(recordings.length)}
              </button>
            ) : null}
          </div>
          <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            {(tab === 'upcoming' ? recordings.slice(0, 3) : recordings).map((session) => (
              <li
                key={session.id}
                className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3.5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                    <PlayIcon className="h-4 w-4 translate-x-0.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy">{session.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {session.dateLabel} · {session.durationLabel}
                    </p>
                  </div>
                </div>
                <Link
                  to={employeeSessionPath(session.id)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700"
                >
                  {copy.watch} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab !== 'upcoming' && list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          {copy.empty}
        </div>
      ) : null}
    </div>
  )
}
