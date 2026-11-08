import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { CertificateModal } from '@/components/common'
import {
  certificateModalCopy,
  organizationReportAssessments,
  organizationReportCertificateMetrics,
  organizationReportCertificates,
  organizationReportCourses,
  organizationReportDepartments,
  organizationReportHours,
  organizationReportLeaderboard,
  organizationReportLeaderboardPreview,
  organizationReportMatrix,
  organizationReportMatrixCourses,
  organizationReportMetrics,
  organizationReportsPage,
  type CertificateView,
  type ReportCertificateStatus,
  type ReportMatrixCell,
} from '@/constants'
import {
  AwardIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  InfoIcon,
  SearchIcon,
  SparkleIcon,
  TrophyIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@/components/ui'
import { organizationEmployeePath } from '@/routes/paths'

type ReportTab = 'overview' | 'leaderboard' | 'certificates' | 'assessments'
type CertificateFilter = 'all' | ReportCertificateStatus

const metricIcon = {
  blue: { wrap: 'bg-[#EAF2FF] text-brand', Icon: UsersIcon },
  green: { wrap: 'bg-emerald-50 text-emerald-600', Icon: TrendingUpIcon },
  orange: { wrap: 'bg-amber-50 text-amber-600', Icon: AwardIcon },
} as const

function metricVisual(id: string, tone: 'blue' | 'green' | 'orange') {
  if (id === 'assessments') return { wrap: 'bg-[#EAF2FF] text-brand', Icon: ClipboardIcon }
  if (id === 'pass') return { wrap: 'bg-emerald-50 text-emerald-600', Icon: CheckCircleIcon }
  if (id === 'certs') return metricIcon.orange
  if (tone === 'green') return metricIcon.green
  return metricIcon.blue
}

function SegmentBar({
  notStarted,
  inProgress,
  done,
}: {
  notStarted: number
  inProgress: number
  done: number
}) {
  const total = Math.max(1, notStarted + inProgress + done)
  return (
    <div className="flex min-w-[12rem] items-center gap-3">
      <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <span
          className="h-full bg-slate-300"
          style={{ width: `${(notStarted / total) * 100}%` }}
        />
        <span
          className="h-full bg-brand"
          style={{ width: `${(inProgress / total) * 100}%` }}
        />
        <span
          className="h-full bg-emerald-500"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-semibold text-slate-500">
        {notStarted} · {inProgress} · {done}
      </span>
    </div>
  )
}

function MatrixCell({ cell }: { cell: ReportMatrixCell }) {
  if (cell.kind === 'done') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckIcon className="h-3 w-3" />
        {organizationReportsPage.matrixDone}
      </span>
    )
  }
  if (cell.kind === 'progress') {
    return (
      <span className="inline-flex rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-semibold text-brand">
        {cell.value}%
      </span>
    )
  }
  if (cell.kind === 'not_started') {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        {organizationReportsPage.matrixNotStarted}
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-400">
      —
    </span>
  )
}

function certificateMetricVisual(id: string) {
  if (id === 'issued') return { wrap: 'bg-emerald-50 text-emerald-600', Icon: AwardIcon }
  if (id === 'people') return { wrap: 'bg-[#EAF2FF] text-brand', Icon: UsersIcon }
  if (id === 'week') return { wrap: 'bg-[#EAF2FF] text-brand', Icon: SparkleIcon }
  return { wrap: 'bg-slate-100 text-slate-500', Icon: ClockIcon }
}

export function OrganizationReportsPage() {
  const [tab, setTab] = useState<ReportTab>('overview')
  const [toast, setToast] = useState('')
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false)
  const [certificateQuery, setCertificateQuery] = useState('')
  const [certificateFilter, setCertificateFilter] = useState<CertificateFilter>('all')
  const [certificate, setCertificate] = useState<CertificateView | null>(null)
  const maxHours = useMemo(
    () => Math.max(...organizationReportHours.map((item) => item.hours)),
    [],
  )
  const leaderboardRows = useMemo(
    () =>
      showAllLeaderboard
        ? organizationReportLeaderboard
        : organizationReportLeaderboard.slice(0, organizationReportLeaderboardPreview),
    [showAllLeaderboard],
  )
  const topThree = organizationReportLeaderboard.slice(0, 3)

  const certificateCounts = useMemo(() => {
    const valid = organizationReportCertificates.filter((item) => item.status === 'valid').length
    const expiring = organizationReportCertificates.filter(
      (item) => item.status === 'expiring',
    ).length
    const expired = organizationReportCertificates.filter(
      (item) => item.status === 'expired',
    ).length
    return {
      all: organizationReportCertificates.length,
      valid,
      expiring,
      expired,
    }
  }, [])

  const filteredCertificates = useMemo(() => {
    const query = certificateQuery.trim().toLowerCase()
    return organizationReportCertificates.filter((item) => {
      if (certificateFilter !== 'all' && item.status !== certificateFilter) return false
      if (!query) return true
      return (
        item.employee.toLowerCase().includes(query) ||
        item.course.toLowerCase().includes(query) ||
        item.credential.toLowerCase().includes(query)
      )
    })
  }, [certificateFilter, certificateQuery])

  const tabs: Array<{ id: ReportTab; label: string }> = [
    { id: 'overview', label: organizationReportsPage.tabs.overview },
    { id: 'leaderboard', label: organizationReportsPage.tabs.leaderboard },
    {
      id: 'certificates',
      label: `${organizationReportsPage.tabs.certificates} (${organizationReportCertificates.length})`,
    },
    { id: 'assessments', label: organizationReportsPage.tabs.assessments },
  ]

  function exportReport() {
    setToast(
      tab === 'certificates'
        ? organizationReportsPage.certificatesDownloadToast
        : organizationReportsPage.exportToast,
    )
    window.setTimeout(() => setToast(''), 2200)
  }

  function openCertificate(row: (typeof organizationReportCertificates)[number]) {
    setCertificate({
      recipientName: row.employee,
      courseTitle: row.course,
      issuedOn: row.issued,
      validUntil: row.expires,
      credentialId: row.credential,
      cpdHours: row.cpdHours,
    })
  }

  function downloadSingleCertificate() {
    setToast(certificateModalCopy.downloadedToast)
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <h1 className="text-3xl font-bold text-navy">{organizationReportsPage.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            {organizationReportsPage.subtitle}
          </p>
        </header>
        <button
          type="button"
          onClick={exportReport}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <DownloadIcon className="h-4 w-4" />
          {tab === 'certificates'
            ? organizationReportsPage.certificatesDownloadAll
            : organizationReportsPage.export}
          {tab === 'certificates' ? null : (
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'overview' ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {organizationReportMetrics.map((metric) => {
              const visual = metricVisual(metric.id, metric.tone)
              const Icon = visual.Icon
              return (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      {metric.label}
                    </p>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${visual.wrap}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
                </div>
              )
            })}
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h2 className="text-base font-bold text-navy">
                {organizationReportsPage.departmentTitle}
              </h2>
              <ul className="mt-4 space-y-4">
                {organizationReportDepartments.map((item) => (
                  <li key={item.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500">
                        <span className="font-semibold text-navy">{item.percent}%</span>
                        {' · '}
                        {organizationReportsPage.people(item.people)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-navy">
                  {organizationReportsPage.hoursTitle}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {organizationReportsPage.hoursBadge}
                </span>
              </div>
              <div className="mt-5 flex h-40 items-end gap-2">
                {organizationReportHours.map((item, index) => {
                  const active = index === organizationReportHours.length - 1
                  return (
                    <div key={item.id} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-32 w-full items-end">
                        <div
                          className={`w-full rounded-t-md ${active ? 'bg-brand' : 'bg-[#C9DBFF]'}`}
                          style={{
                            height: `${Math.max(12, (item.hours / maxHours) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">{item.label}</span>
                    </div>
                  )
                })}
              </div>
              <p className="mt-4 text-sm text-slate-500">{organizationReportsPage.hoursFooter}</p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-bold text-navy">
                {organizationReportsPage.courseProgressTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  {organizationReportsPage.legend.notStarted}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  {organizationReportsPage.legend.inProgress}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {organizationReportsPage.legend.completed}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {organizationReportsPage.courseHeaders.map((header) => (
                      <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {organizationReportCourses.map((course) => (
                    <tr key={course.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5 font-semibold text-navy">{course.title}</td>
                      <td className="px-5 py-3.5 text-slate-600">{course.seats}</td>
                      <td className="px-5 py-3.5">
                        <SegmentBar
                          notStarted={course.notStarted}
                          inProgress={course.inProgress}
                          done={course.done}
                        />
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">
                        {course.avgScore}%
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">
                        {course.passRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-navy">
                  {organizationReportsPage.matrixTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {organizationReportsPage.matrixSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTab('leaderboard')}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                {organizationReportsPage.openFullMatrix}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    {organizationReportMatrixCourses.map((course) => (
                      <th key={course.id} className="px-5 py-3 font-semibold whitespace-nowrap">
                        {course.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {organizationReportMatrix.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5">
                        <Link
                          to={organizationEmployeePath(row.employeeId)}
                          className="flex items-center gap-3 hover:opacity-80"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand">
                            {row.initials}
                          </span>
                          <span className="font-semibold text-navy">{row.name}</span>
                        </Link>
                      </td>
                      {row.cells.map((cell, index) => (
                        <td key={`${row.id}-${index}`} className="px-5 py-3.5">
                          <MatrixCell cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {tab === 'leaderboard' ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <TrophyIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>{organizationReportsPage.leaderboardHint}</p>
          </div>

          <section className="grid gap-3 md:grid-cols-3">
            {topThree.map((row) => {
              const isFirst = row.rank === 1
              return (
                <Link
                  key={row.employeeId}
                  to={organizationEmployeePath(row.employeeId)}
                  className={`rounded-2xl border bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] transition hover:shadow-md ${
                    isFirst ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        isFirst
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {row.rank}
                    </span>
                    {isFirst ? <TrophyIcon className="h-5 w-5 text-amber-500" /> : null}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {row.initials}
                    </span>
                    <div>
                      <p className="font-bold text-navy">{row.name}</p>
                      <p className="text-sm text-slate-500">{row.department}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    <span className="font-semibold text-navy">{row.done}</span> completed
                    {' · '}
                    <span className="font-semibold text-navy">{row.avgScore}%</span> avg score
                  </p>
                </Link>
              )
            })}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {organizationReportsPage.leaderboardHeaders.map((header) => (
                      <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboardRows.map((row) => (
                    <tr
                      key={row.rank}
                      className="border-b border-slate-50 last:border-0 hover:bg-[#F5F9FF]"
                    >
                      <td
                        className={`px-5 py-3.5 font-bold ${
                          row.rank === 1 ? 'text-amber-500' : 'text-slate-400'
                        }`}
                      >
                        #{row.rank}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          to={organizationEmployeePath(row.employeeId)}
                          className="flex items-center gap-3 hover:opacity-80"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                            {row.initials}
                          </span>
                          <span className="font-semibold text-navy">{row.name}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{row.department}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{row.done}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{row.avgScore}%</td>
                      <td className="px-5 py-3.5 text-slate-700">{row.certificates}</td>
                      <td className="px-5 py-3.5 text-slate-600">{row.hours} h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5">
              <p className="text-sm text-slate-500">
                {organizationReportsPage.leaderboardShowing(
                  leaderboardRows.length,
                  organizationReportsPage.leaderboardTotalLearners,
                )}
              </p>
              <button
                type="button"
                onClick={() => setShowAllLeaderboard((value) => !value)}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                {showAllLeaderboard
                  ? organizationReportsPage.leaderboardShowLess
                  : organizationReportsPage.leaderboardShowAll}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {tab === 'certificates' ? (
        <div className="space-y-4">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {organizationReportCertificateMetrics.map((metric) => {
              const visual = certificateMetricVisual(metric.id)
              const Icon = visual.Icon
              return (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                      {metric.label}
                    </p>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${visual.wrap}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
                </div>
              )
            })}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={certificateQuery}
                  onChange={(event) => setCertificateQuery(event.target.value)}
                  placeholder={organizationReportsPage.certificatesSearchPlaceholder}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['all', organizationReportsPage.certificatesFilters.all, certificateCounts.all],
                    [
                      'valid',
                      organizationReportsPage.certificatesFilters.valid,
                      certificateCounts.valid,
                    ],
                    [
                      'expiring',
                      organizationReportsPage.certificatesFilters.expiring,
                      certificateCounts.expiring,
                    ],
                    [
                      'expired',
                      organizationReportsPage.certificatesFilters.expired,
                      certificateCounts.expired,
                    ],
                  ] as const
                ).map(([id, label, count]) => {
                  const active = certificateFilter === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCertificateFilter(id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? 'bg-brand text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {organizationReportsPage.certificatesHeaders.map((header, index) => (
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
                  {filteredCertificates.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-[#F5F9FF]"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          to={organizationEmployeePath(row.employeeId)}
                          className="flex items-center gap-3 hover:opacity-80"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                            {row.initials}
                          </span>
                          <span className="font-semibold text-navy">{row.employee}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{row.course}</td>
                      <td className="px-5 py-3.5 text-slate-500">{row.issued}</td>
                      <td className="px-5 py-3.5 text-slate-500">{row.expires}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-600">{row.credential}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            aria-label="View certificate"
                            onClick={() => openCertificate(row)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Download certificate"
                            onClick={downloadSingleCertificate}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand"
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3.5 text-sm text-slate-500">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p>{organizationReportsPage.certificatesFooter}</p>
            </div>
          </section>
        </div>
      ) : null}

      {certificate ? (
        <CertificateModal certificate={certificate} onClose={() => setCertificate(null)} />
      ) : null}

      {tab === 'assessments' ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-navy">
              {organizationReportsPage.assessmentsTitle}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                  {organizationReportsPage.assessmentsHeaders.map((header) => (
                    <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {organizationReportAssessments.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5">
                      <Link
                        to={organizationEmployeePath(row.employeeId)}
                        className="font-semibold text-navy hover:text-brand"
                      >
                        {row.employee}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{row.title}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{row.score}%</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.attempts}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}
