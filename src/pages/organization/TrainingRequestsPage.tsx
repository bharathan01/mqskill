import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  organizationRequestsPage,
  organizationTrainingRequests,
  type OrganizationTrainingRequest,
  type TrainingRequestStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
} from '@/components/ui'

type StatusTab = 'new' | 'approved' | 'declined' | 'all'

const decisionClass = {
  approved: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-red-50 text-red-600',
  new: 'bg-amber-50 text-amber-700',
} as const

function RequestCard({
  request,
  onApprove,
  onDecline,
}: {
  request: OrganizationTrainingRequest
  onApprove: () => void
  onDecline: () => void
}) {
  const owned = request.availability.kind === 'owned'

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-bold text-brand">
          {request.employeeInitials}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-navy">{request.employeeName}</h3>
          <p className="text-sm text-slate-500">{request.department}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-navy">{request.course}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">“{request.note}”</p>

      <div
        className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${
          owned ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
        }`}
      >
        {owned ? (
          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span>
          {owned && request.availability.kind === 'owned'
            ? organizationRequestsPage.freeSeats(request.availability.freeSeats)
            : organizationRequestsPage.purchaseHint}
        </span>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <button
          type="button"
          onClick={onDecline}
          className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {organizationRequestsPage.decline}
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {owned
            ? organizationRequestsPage.approveAssign
            : organizationRequestsPage.approveCart}
        </button>
      </div>
    </article>
  )
}

export function OrganizationTrainingRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(() => [...organizationTrainingRequests])
  const [tab, setTab] = useState<StatusTab>('new')
  const [toast, setToast] = useState('')
  const [declineId, setDeclineId] = useState<string | null>(null)
  const [declineNote, setDeclineNote] = useState('')
  const [declineError, setDeclineError] = useState('')
  const [approveId, setApproveId] = useState<string | null>(null)
  const [showAllEarlier, setShowAllEarlier] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const counts = useMemo(() => {
    const next = {
      new: 0,
      approved: 0,
      declined: 0,
      all: requests.length,
    }
    for (const item of requests) {
      next[item.status] += 1
    }
    return next
  }, [requests])

  const newRequests = useMemo(
    () => requests.filter((item) => item.status === 'new'),
    [requests],
  )

  const earlierRequests = useMemo(() => {
    const decided = requests.filter((item) => item.status !== 'new')
    if (tab === 'new') return decided
    if (tab === 'all') return decided
    return decided.filter((item) => item.status === tab)
  }, [requests, tab])

  const visibleEarlier = showAllEarlier ? earlierRequests : earlierRequests.slice(0, 4)
  const declineTarget = requests.find((item) => item.id === declineId) ?? null
  const approveTarget = requests.find((item) => item.id === approveId) ?? null

  function handleApproveClick(request: OrganizationTrainingRequest) {
    if (request.availability.kind === 'owned') {
      setApproveId(request.id)
      return
    }

    navigate(paths.organization.catalog, {
      state: {
        fromTrainingRequest: {
          id: request.id,
          course: request.course,
          employeeName: request.employeeName,
        },
      },
    })
  }

  function confirmApproveAssign() {
    if (!approveId || !approveTarget) return
    const today = '29 Oct'
    setRequests((current) =>
      current.map((item) =>
        item.id === approveId
          ? {
              ...item,
              status: 'approved' as const,
              decisionNote: `Seat assigned ${today}`,
            }
          : item,
      ),
    )
    setApproveId(null)
    setToast(organizationRequestsPage.approvedToast)
  }

  function confirmDecline() {
    if (!declineId) return
    const note = declineNote.trim()
    if (!note) {
      setDeclineError(organizationRequestsPage.declineRequired)
      return
    }
    setRequests((current) =>
      current.map((item) =>
        item.id === declineId
          ? {
              ...item,
              status: 'declined' as const,
              decisionNote: note,
            }
          : item,
      ),
    )
    setDeclineId(null)
    setDeclineNote('')
    setDeclineError('')
    setTab('declined')
    setToast(organizationRequestsPage.declinedToast)
  }

  const tabs: Array<{ id: StatusTab; label: string; count: number }> = [
    { id: 'new', label: organizationRequestsPage.tabs.new, count: counts.new },
    {
      id: 'approved',
      label: organizationRequestsPage.tabs.approved,
      count: counts.approved,
    },
    {
      id: 'declined',
      label: organizationRequestsPage.tabs.declined,
      count: counts.declined,
    },
    { id: 'all', label: organizationRequestsPage.tabs.all, count: counts.all },
  ]

  const showNewCards = tab === 'new' || tab === 'all'

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <header>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
          {organizationRequestsPage.eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-navy">{organizationRequestsPage.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">{organizationRequestsPage.subtitle}</p>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id)
                setShowAllEarlier(false)
              }}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active ? 'bg-[#EAF2FF] text-brand' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {showNewCards ? (
        newRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
            {organizationRequestsPage.emptyNew}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {newRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onApprove={() => handleApproveClick(request)}
                onDecline={() => {
                  setDeclineId(request.id)
                  setDeclineNote('')
                  setDeclineError('')
                }}
              />
            ))}
          </div>
        )
      ) : null}

      {tab !== 'new' || earlierRequests.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-navy">
              {tab === 'new' || tab === 'all'
                ? organizationRequestsPage.earlierTitle
                : organizationRequestsPage.tabs[tab]}
            </h2>
            {earlierRequests.length > 4 ? (
              <button
                type="button"
                onClick={() => setShowAllEarlier((current) => !current)}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                {showAllEarlier ? 'Show less' : organizationRequestsPage.viewAll}
              </button>
            ) : null}
          </div>

          {visibleEarlier.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              {organizationRequestsPage.emptyFiltered}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {organizationRequestsPage.headers.map((header) => (
                      <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleEarlier.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-[12rem] items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand">
                            {item.employeeInitials}
                          </span>
                          <span>
                            <span className="block font-semibold text-navy">
                              {item.employeeName}
                            </span>
                            <span className="block text-xs text-slate-400">
                              {item.department}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{item.course}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                        {item.askedOn}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${decisionClass[item.status as TrainingRequestStatus]}`}
                        >
                          {
                            organizationRequestsPage.decision[
                              item.status as keyof typeof organizationRequestsPage.decision
                            ]
                          }
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{item.decisionNote || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-[#EAF2FF]/70 px-4 py-3 text-sm text-slate-600">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p>
          You can turn training requests off, or let employees request only courses you already
          own, in{' '}
          <Link
            to={paths.organization.settings}
            className="font-semibold text-brand hover:text-blue-700"
          >
            {organizationRequestsPage.settingsLink}
          </Link>{' '}
          → Learning.
        </p>
      </div>

      {approveTarget ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close approve dialog"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setApproveId(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-navy">
              {organizationRequestsPage.approveTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {organizationRequestsPage.approveBody(
                approveTarget.employeeName,
                approveTarget.course,
              )}
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setApproveId(null)}
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {organizationRequestsPage.cancel}
              </button>
              <button
                type="button"
                onClick={confirmApproveAssign}
                className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {organizationRequestsPage.approveConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {declineTarget ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close decline dialog"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => {
              setDeclineId(null)
              setDeclineError('')
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-navy">
              {organizationRequestsPage.declineTitle(declineTarget.employeeName)}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{declineTarget.course}</p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {organizationRequestsPage.declinePrompt}
              </span>
              <textarea
                value={declineNote}
                onChange={(event) => {
                  setDeclineNote(event.target.value)
                  if (declineError) setDeclineError('')
                }}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand"
                placeholder={organizationRequestsPage.declinePlaceholder}
              />
            </label>
            {declineError ? (
              <p className="mt-2 text-sm font-medium text-red-600">{declineError}</p>
            ) : null}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeclineId(null)
                  setDeclineError('')
                }}
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {organizationRequestsPage.cancel}
              </button>
              <button
                type="button"
                onClick={confirmDecline}
                className="inline-flex h-10 items-center rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-500 hover:bg-red-100"
              >
                {organizationRequestsPage.declineConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
