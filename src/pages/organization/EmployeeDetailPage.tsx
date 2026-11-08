import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import {
  buildCredentialId,
  getOrganizationEmployeeDetail,
  organizationAssignableCourses,
  organizationEmployeeDetailPage,
  type CertificateView,
  type EmployeeDetailTab,
  type OrganizationEmployeeDetail,
} from '@/constants'
import { paths } from '@/routes/paths'
import { CertificateModal, DeactivateEmployeeModal } from '@/components/common'
import {
  ChevronLeftIcon,
  CloseIcon,
  DownloadIcon,
  PlusIcon,
  TrophyIcon,
  UserMinusIcon,
} from '@/components/ui'

const statusClass = {
  active: 'bg-emerald-50 text-emerald-700',
  invited: 'bg-amber-50 text-amber-700',
  deactivated: 'bg-slate-100 text-slate-500',
} as const

const statusDotClass = {
  active: 'bg-emerald-500',
  invited: 'bg-amber-500',
  deactivated: 'bg-slate-400',
} as const

const courseStatusClass = {
  in_progress: 'bg-[#EAF2FF] text-brand',
  completed: 'bg-emerald-50 text-emerald-700',
} as const

const courseStatusDot = {
  in_progress: 'bg-brand',
  completed: 'bg-emerald-500',
} as const

const assessmentResultClass = {
  passed: 'bg-emerald-50 text-emerald-700',
  not_yet: 'bg-slate-100 text-slate-500',
  failed: 'bg-red-50 text-red-600',
} as const

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] ${
        highlight ? 'border-brand/40 ring-1 ring-brand/15' : 'border-slate-200'
      }`}
    >
      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className={`mt-1.5 text-xl font-bold ${highlight ? 'text-brand' : 'text-navy'}`}>{value}</p>
    </div>
  )
}

function ProgressCell({ progress }: { progress: number }) {
  return (
    <div className="flex min-w-[8.5rem] items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-brand'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs font-semibold text-slate-600">{progress}%</span>
    </div>
  )
}

function CoursesTable({
  courses,
}: {
  courses: OrganizationEmployeeDetail['courses']
}) {
  if (courses.length === 0) {
    return <p className="px-5 py-8 text-sm text-slate-500">{organizationEmployeeDetailPage.emptyCourses}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
            {organizationEmployeeDetailPage.coursesHeaders.map((header) => (
              <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-slate-50 last:border-0">
              <td className="px-5 py-3.5 font-medium text-navy">{course.title}</td>
              <td className="px-5 py-3.5">
                <ProgressCell progress={course.progress} />
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${courseStatusClass[course.status]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${courseStatusDot[course.status]}`} />
                  {organizationEmployeeDetailPage.courseStatus[course.status]}
                </span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{course.dueLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AssessmentsTable({
  assessments,
}: {
  assessments: OrganizationEmployeeDetail['assessments']
}) {
  if (assessments.length === 0) {
    return (
      <p className="px-5 py-8 text-sm text-slate-500">
        {organizationEmployeeDetailPage.emptyAssessments}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
            {organizationEmployeeDetailPage.assessmentsHeaders.map((header) => (
              <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assessments.map((item) => (
            <tr key={item.id} className="border-b border-slate-50 last:border-0">
              <td className="px-5 py-3.5 font-medium text-navy">{item.title}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-700">
                {item.bestScore == null ? '—' : `${item.bestScore}%`}
              </td>
              <td className="px-5 py-3.5 text-slate-500">
                {item.attemptsUsed} of {item.attemptsMax}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${assessmentResultClass[item.result]}`}
                >
                  {organizationEmployeeDetailPage.assessmentResult[item.result]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function OrganizationEmployeeDetailPage() {
  const { employeeId = '' } = useParams()
  const seed = useMemo(() => getOrganizationEmployeeDetail(employeeId), [employeeId])
  const [employee, setEmployee] = useState<OrganizationEmployeeDetail | null>(seed)
  const [tab, setTab] = useState<EmployeeDetailTab>('overview')
  const [assignOpen, setAssignOpen] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [assignCourseIds, setAssignCourseIds] = useState<string[]>([])
  const [assignError, setAssignError] = useState('')
  const [toast, setToast] = useState('')
  const [certificate, setCertificate] = useState<CertificateView | null>(null)

  useEffect(() => {
    setEmployee(seed)
    setTab('overview')
    setAssignOpen(false)
    setConfirmDeactivate(false)
    setCertificate(null)
  }, [seed])

  function openCertificate(cert: {
    id: string
    title: string
    issuedOn: string
    expiresOn: string
  }) {
    if (!employee) return
    setCertificate({
      recipientName: employee.name,
      courseTitle: cert.title,
      issuedOn: cert.issuedOn,
      validUntil: cert.expiresOn,
      credentialId: buildCredentialId(cert.id),
      cpdHours: 10,
    })
  }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (!employee) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <h1 className="text-xl font-bold text-navy">{organizationEmployeeDetailPage.notFoundTitle}</h1>
        <p className="mt-2 text-sm text-slate-500">{organizationEmployeeDetailPage.notFoundBody}</p>
        <Link
          to={paths.organization.employees}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {organizationEmployeeDetailPage.back}
        </Link>
      </div>
    )
  }

  const tabs: Array<{ id: EmployeeDetailTab; label: string }> = [
    { id: 'overview', label: organizationEmployeeDetailPage.tabs.overview },
    {
      id: 'courses',
      label: `${organizationEmployeeDetailPage.tabs.courses} (${employee.metrics.courses})`,
    },
    {
      id: 'assessments',
      label: `${organizationEmployeeDetailPage.tabs.assessments} (${employee.assessments.length})`,
    },
    {
      id: 'certificates',
      label: `${organizationEmployeeDetailPage.tabs.certificates} (${employee.metrics.certificates})`,
    },
    { id: 'activity', label: organizationEmployeeDetailPage.tabs.activity },
  ]

  const maxActivity = Math.max(...employee.activity.bars, 1)

  function closeAssign() {
    setAssignOpen(false)
    setAssignCourseIds([])
    setAssignError('')
  }

  function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (assignCourseIds.length === 0) {
      setAssignError(organizationEmployeeDetailPage.assignRequired)
      return
    }
    setEmployee((current) => {
      if (!current) return current
      const added = organizationAssignableCourses.filter((item) =>
        assignCourseIds.includes(item.id),
      )
      return {
        ...current,
        metrics: {
          ...current.metrics,
          courses: current.metrics.courses + added.length,
        },
        courses: [
          ...added.map((item, index) => ({
            id: `assigned-${Date.now()}-${index}`,
            title: item.title,
            progress: 0,
            status: 'in_progress' as const,
            dueLabel: 'Due 30 Dec 2026',
          })),
          ...current.courses,
        ],
      }
    })
    closeAssign()
    setToast(organizationEmployeeDetailPage.assignSuccess)
  }

  function handleDeactivate(_emailNotify: boolean) {
    setEmployee((current) =>
      current ? { ...current, status: 'deactivated' as const } : current,
    )
    setConfirmDeactivate(false)
    setToast(organizationEmployeeDetailPage.deactivateSuccess)
  }

  function handleReactivate() {
    setEmployee((current) =>
      current ? { ...current, status: 'active' as const, lastActive: 'today' } : current,
    )
    setToast(organizationEmployeeDetailPage.reactivateSuccess)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.organization.employees}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {organizationEmployeeDetailPage.back}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-lg font-bold text-brand">
              {employee.initials}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-navy">{employee.name}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[employee.status]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass[employee.status]}`} />
                  {employee.status === 'active'
                    ? 'Active'
                    : employee.status === 'invited'
                      ? 'Invited'
                      : 'Deactivated'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {employee.jobTitle} · {employee.department} · {employee.employeeCode}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {employee.email} · {organizationEmployeeDetailPage.addedPrefix} {employee.addedOn} ·{' '}
                {organizationEmployeeDetailPage.lastActivePrefix} {employee.lastActive}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              {organizationEmployeeDetailPage.assignCourse.replace('+ ', '')}
            </button>
            <button
              type="button"
              onClick={() => setToast(organizationEmployeeDetailPage.reportReady)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <DownloadIcon className="h-4 w-4" />
              {organizationEmployeeDetailPage.report}
            </button>
            {employee.status === 'deactivated' ? (
              <button
                type="button"
                onClick={handleReactivate}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-brand/30 bg-white px-4 text-sm font-semibold text-brand hover:bg-[#EAF2FF]"
              >
                {organizationEmployeeDetailPage.reactivate}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDeactivate(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <UserMinusIcon className="h-4 w-4" />
                {organizationEmployeeDetailPage.deactivate}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.courses}
          value={String(employee.metrics.courses)}
        />
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.completed}
          value={String(employee.metrics.completed)}
        />
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.avgProgress}
          value={`${employee.metrics.avgProgress}%`}
        />
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.assessmentAvg}
          value={
            employee.metrics.assessmentAvg == null
              ? '—'
              : `${employee.metrics.assessmentAvg}%`
          }
        />
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.certificates}
          value={String(employee.metrics.certificates)}
        />
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.cpdHours}
          value={String(employee.metrics.cpdHours)}
        />
        <MetricCard
          label={organizationEmployeeDetailPage.metrics.rank}
          value={`#${employee.metrics.rank} of ${employee.metrics.rankOf}`}
          highlight
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-3">
          {tabs.map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'border-b-2 border-brand text-brand'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="p-4 lg:p-5">
          {tab === 'overview' ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <h2 className="text-sm font-bold text-navy">
                      {organizationEmployeeDetailPage.tabs.courses}
                    </h2>
                  </div>
                  <CoursesTable courses={employee.courses} />
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <h2 className="text-sm font-bold text-navy">
                      {organizationEmployeeDetailPage.tabs.assessments}
                    </h2>
                  </div>
                  <AssessmentsTable assessments={employee.assessments} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h2 className="text-sm font-bold text-navy">
                    {organizationEmployeeDetailPage.activityTitle}
                  </h2>
                  <div className="mt-4 flex h-28 items-end gap-2">
                    {employee.activity.bars.map((value, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center justify-end">
                        <div
                          className={`w-full rounded-t-md ${
                            index === employee.activity.bars.length - 1
                              ? 'bg-brand'
                              : 'bg-[#C9DBFF]'
                          }`}
                          style={{ height: `${Math.max(8, (value / maxActivity) * 100)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {organizationEmployeeDetailPage.activitySubtitle(
                      employee.activity.hoursThisWeek,
                      employee.activity.streakDays,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <h2 className="text-sm font-bold text-navy">
                    {organizationEmployeeDetailPage.interestTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {organizationEmployeeDetailPage.interestSubtitle}
                  </p>
                  <div className="mt-4 space-y-3">
                    {employee.interests.length === 0 ? (
                      <p className="text-sm text-slate-500">—</p>
                    ) : (
                      employee.interests.map((item) => (
                        <div key={item.id}>
                          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-slate-600">{item.label}</span>
                            <span className="font-semibold text-navy">{item.percent}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-brand"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <h2 className="text-sm font-bold text-navy">
                    {organizationEmployeeDetailPage.certificatesTitle}
                  </h2>
                  {employee.certificates.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      {organizationEmployeeDetailPage.emptyCertificates}
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {employee.certificates.map((cert) => (
                        <li key={cert.id}>
                          <button
                            type="button"
                            onClick={() => openCertificate(cert)}
                            className="flex w-full items-start gap-3 rounded-lg text-left hover:bg-slate-50"
                          >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <TrophyIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-navy">
                                {cert.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-slate-400">
                                {organizationEmployeeDetailPage.issuedPrefix} {cert.issuedOn} ·{' '}
                                {organizationEmployeeDetailPage.expiresPrefix} {cert.expiresOn}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'courses' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <CoursesTable courses={employee.courses} />
            </div>
          ) : null}

          {tab === 'assessments' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <AssessmentsTable assessments={employee.assessments} />
            </div>
          ) : null}

          {tab === 'certificates' ? (
            <div className="rounded-2xl border border-slate-200 p-5">
              {employee.certificates.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {organizationEmployeeDetailPage.emptyCertificates}
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {employee.certificates.map((cert) => (
                    <li key={cert.id}>
                      <button
                        type="button"
                        onClick={() => openCertificate(cert)}
                        className="flex w-full items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <TrophyIcon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-navy">
                            {cert.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-400">
                            {organizationEmployeeDetailPage.issuedPrefix} {cert.issuedOn} ·{' '}
                            {organizationEmployeeDetailPage.expiresPrefix} {cert.expiresOn}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {tab === 'activity' ? (
            <div className="rounded-2xl border border-slate-200 p-5">
              {employee.activityLog.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {organizationEmployeeDetailPage.emptyActivity}
                </p>
              ) : (
                <ul className="space-y-4">
                  {employee.activityLog.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-navy">{item.title}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span>
                      </span>
                      <span className="text-xs font-medium whitespace-nowrap text-slate-400">
                        {item.time}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {assignOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close assign panel"
            className="absolute inset-0 bg-slate-900/30"
            onClick={closeAssign}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-[-12px_0_40px_rgba(15,40,80,0.16)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h2 className="text-xl font-bold text-navy">
                  {organizationEmployeeDetailPage.assignTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {organizationEmployeeDetailPage.assignSubtitle} ({employee.name})
                </p>
              </div>
              <button
                type="button"
                onClick={closeAssign}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleAssign}>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                {organizationAssignableCourses.map((item) => {
                  const checked = assignCourseIds.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setAssignError('')
                          setAssignCourseIds((current) =>
                            checked
                              ? current.filter((id) => id !== item.id)
                              : [...current, item.id],
                          )
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-navy">{item.title}</span>
                      </span>
                    </label>
                  )
                })}
                {assignError ? (
                  <p className="text-sm font-medium text-red-600">{assignError}</p>
                ) : null}
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
                <button
                  type="button"
                  onClick={closeAssign}
                  className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {organizationEmployeeDetailPage.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {organizationEmployeeDetailPage.assignSubmit}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}

      {confirmDeactivate ? (
        <DeactivateEmployeeModal
          name={employee.name}
          courses={employee.metrics.courses}
          certificates={employee.metrics.certificates}
          onCancel={() => setConfirmDeactivate(false)}
          onConfirm={handleDeactivate}
        />
      ) : null}

      {certificate ? (
        <CertificateModal certificate={certificate} onClose={() => setCertificate(null)} />
      ) : null}
    </div>
  )
}
