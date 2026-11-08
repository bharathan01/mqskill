import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  buildCredentialId,
  getOrganizationPurchasedCourseDetail,
  organizationAssignSeatCandidates,
  organizationEmployeeDepartments,
  organizationPurchasedDetailPage,
  type CertificateView,
  type SeatLearnerStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import { CertificateModal } from '@/components/common'
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarIcon,
  CartIcon,
  ChatIcon,
  ChevronDownIcon,
  CloseIcon,
  InfoIcon,
  LockIcon,
  MegaphoneIcon,
  PlusIcon,
  RepeatIcon,
  SearchIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserIcon,
} from '@/components/ui'

type LearnerTab = 'all' | 'in_progress' | 'completed' | 'not_started'

const iconMap = {
  megaphone: MegaphoneIcon,
  shield: ShieldCheckIcon,
  badge: BadgeCheckIcon,
  briefcase: BriefcaseIcon,
  alert: AlertTriangleIcon,
  chat: ChatIcon,
} as const

const statusClass: Record<SeatLearnerStatus, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-[#EAF2FF] text-brand',
  not_started: 'bg-slate-100 text-slate-500',
  invited: 'bg-amber-50 text-amber-700',
}

function ProgressCell({ progress }: { progress: number }) {
  return (
    <div className="flex min-w-[8rem] items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${
            progress === 100 ? 'bg-emerald-500' : progress === 0 ? 'bg-slate-300' : 'bg-brand'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs font-semibold text-slate-600">{progress}%</span>
    </div>
  )
}

export function OrganizationPurchasedDetailPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const course = useMemo(() => getOrganizationPurchasedCourseDetail(courseId), [courseId])
  const [tab, setTab] = useState<LearnerTab>('all')
  const [toast, setToast] = useState('')
  const [learners, setLearners] = useState(() => course?.learners ?? [])
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignQuery, setAssignQuery] = useState('')
  const [assignDepartment, setAssignDepartment] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deadline, setDeadline] = useState(
    organizationPurchasedDetailPage.assignModal.defaultDeadline,
  )
  const [emailNow, setEmailNow] = useState(true)
  const [assignError, setAssignError] = useState('')
  const [certificate, setCertificate] = useState<CertificateView | null>(null)

  useEffect(() => {
    setLearners(course?.learners ?? [])
    setTab('all')
    setAssignOpen(false)
    setCertificate(null)
  }, [course])

  const counts = useMemo(() => {
    const inProgress = learners.filter((item) => item.status === 'in_progress').length
    const completed = learners.filter((item) => item.status === 'completed').length
    const notStarted = learners.filter(
      (item) => item.status === 'not_started' || item.status === 'invited',
    ).length
    return {
      all: learners.length,
      in_progress: inProgress,
      completed,
      not_started: notStarted,
    }
  }, [learners])

  const filtered = useMemo(() => {
    if (tab === 'all') return learners
    if (tab === 'not_started') {
      return learners.filter(
        (item) => item.status === 'not_started' || item.status === 'invited',
      )
    }
    return learners.filter((item) => item.status === tab)
  }, [learners, tab])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function openAssignModal() {
    setAssignQuery('')
    setAssignDepartment('all')
    setSelectedIds([])
    setDeadline(organizationPurchasedDetailPage.assignModal.defaultDeadline)
    setEmailNow(true)
    setAssignError('')
    setAssignOpen(true)
  }

  function closeAssignModal() {
    setAssignOpen(false)
    setAssignError('')
  }

  const assignCandidates = useMemo(() => {
    const assignedNames = new Set(learners.map((item) => item.name.toLowerCase()))
    const needle = assignQuery.trim().toLowerCase()
    return organizationAssignSeatCandidates
      .map((candidate) => ({
        ...candidate,
        hasCourse:
          candidate.hasCourse || assignedNames.has(candidate.name.toLowerCase()),
      }))
      .filter((candidate) => {
        if (assignDepartment !== 'all' && candidate.department !== assignDepartment) {
          return false
        }
        if (!needle) return true
        return (
          candidate.name.toLowerCase().includes(needle) ||
          candidate.department.toLowerCase().includes(needle)
        )
      })
  }, [learners, assignQuery, assignDepartment])

  function toggleCandidate(id: string, freeSeats: number) {
    setAssignError('')
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= freeSeats) return current
      return [...current, id]
    })
  }

  function confirmAssign(freeSeats: number) {
    if (selectedIds.length === 0) {
      setAssignError(organizationPurchasedDetailPage.assignModal.required)
      return
    }
    const selected = organizationAssignSeatCandidates.filter((item) =>
      selectedIds.includes(item.id),
    )
    setLearners((current) => [
      ...selected.slice(0, freeSeats).map((item) => ({
        id: `assigned-${item.id}-${Date.now()}`,
        name: item.name,
        initials: item.initials,
        department: item.department,
        assignedOn: 'Today',
        progress: 0,
        status: (item.statusLabel === 'Invited' ? 'invited' : 'not_started') as SeatLearnerStatus,
      })),
      ...current,
    ])
    closeAssignModal()
    showToast(organizationPurchasedDetailPage.assignSuccess)
  }

  if (!course) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
        <h1 className="text-xl font-bold text-navy">
          {organizationPurchasedDetailPage.notFoundTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {organizationPurchasedDetailPage.notFoundBody}
        </p>
        <Link
          to={paths.organization.purchased}
          className="mt-5 inline-flex text-sm font-semibold text-brand hover:text-blue-700"
        >
          {organizationPurchasedDetailPage.back}
        </Link>
      </div>
    )
  }

  const Icon = iconMap[course.icon]
  const freeSeats = Math.max(0, course.bought - learners.length)
  const completedCount = learners.filter((item) => item.status === 'completed').length

  const tabs: Array<{ id: LearnerTab; label: string; count: number }> = [
    {
      id: 'all',
      label: organizationPurchasedDetailPage.tabs.all,
      count: counts.all,
    },
    {
      id: 'in_progress',
      label: organizationPurchasedDetailPage.tabs.in_progress,
      count: counts.in_progress,
    },
    {
      id: 'completed',
      label: organizationPurchasedDetailPage.tabs.completed,
      count: counts.completed,
    },
    {
      id: 'not_started',
      label: organizationPurchasedDetailPage.tabs.not_started,
      count: counts.not_started,
    },
  ]

  if (course.status === 'awaiting_payment') {
    return (
      <div className="space-y-4">
        <Link
          to={paths.organization.purchased}
          className="inline-flex text-sm font-semibold text-brand hover:text-blue-700"
        >
          {organizationPurchasedDetailPage.back}
        </Link>
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
          <h1 className="text-2xl font-bold text-navy">{course.title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {organizationPurchasedDetailPage.awaitingBody}
          </p>
          <Link
            to={paths.organization.billing}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View order {course.orderId}
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.organization.purchased}
        className="inline-flex text-sm font-semibold text-brand hover:text-blue-700"
      >
        {organizationPurchasedDetailPage.back}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={`flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${course.accent}`}
            >
              <Icon className="h-9 w-9 text-white" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-navy">{course.title}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {organizationPurchasedDetailPage.orderPrefix} {course.orderId} ·{' '}
                {organizationPurchasedDetailPage.boughtPrefix} {course.boughtOn} ·{' '}
                {course.pricePerSeat} {organizationPurchasedDetailPage.perSeat}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span>
                  <span className="font-bold text-navy">{course.bought}</span>{' '}
                  <span className="text-slate-500">{organizationPurchasedDetailPage.bought}</span>
                </span>
                <span>
                  <span className="font-bold text-navy">{learners.length}</span>{' '}
                  <span className="text-slate-500">{organizationPurchasedDetailPage.assigned}</span>
                </span>
                <span>
                  <span className="font-bold text-brand">{freeSeats}</span>{' '}
                  <span className="text-slate-500">{organizationPurchasedDetailPage.free}</span>
                </span>
                <span>
                  <span className="font-bold text-emerald-600">{completedCount}</span>{' '}
                  <span className="text-slate-500">
                    {organizationPurchasedDetailPage.completed}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              disabled={freeSeats <= 0}
              onClick={openAssignModal}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PlusIcon className="h-4 w-4" />
              {organizationPurchasedDetailPage.assignSeats.replace('+ ', '')}
            </button>
            <button
              type="button"
              onClick={() => navigate(paths.organization.catalog)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <CartIcon className="h-4 w-4" />
              {organizationPurchasedDetailPage.buyMoreSeats}
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-navy">
            {organizationPurchasedDetailPage.whoHasSeat}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tabs.map((item) => {
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-brand text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              )
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            {organizationPurchasedDetailPage.emptyLearners}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                  {organizationPurchasedDetailPage.headers.map((header, index) => (
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
                {filtered.map((learner) => (
                  <tr
                    key={learner.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex min-w-[12rem] items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand">
                          {learner.initials}
                        </span>
                        <span>
                          <span className="block font-semibold text-navy">{learner.name}</span>
                          <span className="block text-xs text-slate-400">
                            {learner.department}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                      {learner.assignedOn}
                    </td>
                    <td className="px-5 py-3.5">
                      <ProgressCell progress={learner.progress} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[learner.status]}`}
                      >
                        {organizationPurchasedDetailPage.status[learner.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {learner.status === 'completed' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setCertificate({
                              recipientName: learner.name,
                              courseTitle: course.title,
                              issuedOn: learner.assignedOn,
                              validUntil: '18 Oct 2028',
                              credentialId: buildCredentialId(learner.id),
                              cpdHours: 10,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
                        >
                          <TrophyIcon className="h-4 w-4" />
                          {organizationPurchasedDetailPage.certificate}
                        </button>
                      ) : null}
                      {learner.status === 'in_progress' ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
                          <LockIcon className="h-4 w-4" />
                          {organizationPurchasedDetailPage.seatInUse}
                        </span>
                      ) : null}
                      {learner.status === 'not_started' || learner.status === 'invited' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setLearners((current) =>
                              current.filter((item) => item.id !== learner.id),
                            )
                            showToast(organizationPurchasedDetailPage.moveSuccess)
                          }}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <RepeatIcon className="h-3.5 w-3.5" />
                          {organizationPurchasedDetailPage.moveSeat}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {freeSeats > 0 ? (
          <div className="flex flex-col gap-3 border-t border-blue-100 bg-[#EAF2FF]/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              {organizationPurchasedDetailPage.freeBanner(freeSeats)}
            </p>
            <button
              type="button"
              onClick={openAssignModal}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {organizationPurchasedDetailPage.assign}
            </button>
          </div>
        ) : null}

        <div className="flex items-start gap-2.5 border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>{organizationPurchasedDetailPage.moveHint}</p>
        </div>
      </section>

      {certificate ? (
        <CertificateModal certificate={certificate} onClose={() => setCertificate(null)} />
      ) : null}

      {assignOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close assign seats"
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeAssignModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-navy">
                    {organizationPurchasedDetailPage.assignModal.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{course.title}</p>
                </div>
                <button
                  type="button"
                  onClick={closeAssignModal}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-600">
                  {organizationPurchasedDetailPage.assignModal.selectedOf(
                    selectedIds.length,
                    freeSeats,
                  )}
                </span>
                <span className="font-semibold text-slate-500">
                  {organizationPurchasedDetailPage.assignModal.left(
                    Math.max(0, freeSeats - selectedIds.length),
                  )}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-brand transition-all"
                  style={{
                    width: `${freeSeats === 0 ? 0 : Math.min(100, (selectedIds.length / freeSeats) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative min-w-0 flex-1">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={assignQuery}
                    onChange={(event) => setAssignQuery(event.target.value)}
                    placeholder={organizationPurchasedDetailPage.assignModal.searchPlaceholder}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="relative">
                  <select
                    value={assignDepartment}
                    onChange={(event) => setAssignDepartment(event.target.value)}
                    className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-brand"
                  >
                    <option value="all">
                      {organizationPurchasedDetailPage.assignModal.allDepartments}
                    </option>
                    {organizationEmployeeDepartments.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>
              </div>

              <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-slate-100 p-1">
                {assignCandidates.map((candidate) => {
                  const checked = selectedIds.includes(candidate.id)
                  const disabled =
                    candidate.hasCourse ||
                    (!checked && selectedIds.length >= freeSeats)
                  return (
                    <li key={candidate.id}>
                      {candidate.hasCourse ? (
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                            {candidate.initials}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-500">
                              {candidate.name}
                            </span>
                            <span className="block text-xs text-slate-400">
                              {candidate.department}
                            </span>
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            {organizationPurchasedDetailPage.assignModal.hasCourse}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleCandidate(candidate.id, freeSeats)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            checked ? 'bg-[#EAF2FF]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              checked
                                ? 'border-brand bg-brand text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {checked ? (
                              <span className="text-[10px] font-bold leading-none">✓</span>
                            ) : null}
                          </span>
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand">
                            {candidate.initials}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-navy">
                              {candidate.name}
                            </span>
                            <span className="block text-xs text-slate-400">
                              {candidate.department}
                              {candidate.statusLabel ? ` · ${candidate.statusLabel}` : ''}
                            </span>
                          </span>
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    {organizationPurchasedDetailPage.assignModal.completeBy}
                  </span>
                  <span className="relative block">
                    <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={deadline}
                      onChange={(event) => setDeadline(event.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm outline-none focus:border-brand"
                    />
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {organizationPurchasedDetailPage.assignModal.completeByHint}
                  </span>
                </label>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {organizationPurchasedDetailPage.assignModal.emailNow}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {organizationPurchasedDetailPage.assignModal.emailHint}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={emailNow}
                    onClick={() => setEmailNow((current) => !current)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      emailNow ? 'bg-brand' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                        emailNow ? 'translate-x-5' : ''
                      }`}
                    />
                    <span className="sr-only">
                      {emailNow
                        ? organizationPurchasedDetailPage.assignModal.emailOn
                        : organizationPurchasedDetailPage.assignModal.emailOff}
                    </span>
                  </button>
                </div>
              </div>

              {assignError ? (
                <p className="mt-3 text-sm font-medium text-red-600">{assignError}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={closeAssignModal}
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {organizationPurchasedDetailPage.assignModal.cancel}
              </button>
              <button
                type="button"
                onClick={() => confirmAssign(freeSeats)}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <UserIcon className="h-4 w-4" />
                {organizationPurchasedDetailPage.assignModal.assignCount(selectedIds.length)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
