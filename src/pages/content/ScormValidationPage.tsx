import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  contentScormPackages,
  contentScormValidationPage,
  getScormIssues,
  getScormPackage,
  getScormValidationChecks,
  type ScormIssueSeverity,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ContentBadge,
  ContentCard,
  ContentEmptyState,
  ContentNotice,
  ContentSelect,
} from '@/components/common'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
  DownloadIcon,
  InfoIcon,
  RefreshIcon,
} from '@/components/ui'

const copy = contentScormValidationPage

const severityTone = { error: 'red', warning: 'amber', info: 'blue' } as const
const severityStyle = {
  error: 'border-l-rose-500',
  warning: 'border-l-amber-400',
  info: 'border-l-brand',
} as const
const resultTone = { pass: 'green', fail: 'red', warn: 'amber', pending: 'slate' } as const

type FilterId = 'all' | ScormIssueSeverity

export function ContentScormValidationPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterId>('all')
  const [notice, setNotice] = useState<string | null>(null)

  const requested = getScormPackage(searchParams.get('package'))
  const pkg =
    requested ??
    contentScormPackages.find((item) => item.status === 'failed') ??
    contentScormPackages[0]

  const issues = useMemo(() => getScormIssues(pkg.id), [pkg.id])
  const checks = useMemo(() => getScormValidationChecks(pkg.id), [pkg.id])

  const errorCount = issues.filter((issue) => issue.severity === 'error').length
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length
  const infoCount = issues.filter((issue) => issue.severity === 'info').length
  const passedCount = checks.filter((check) => check.result === 'pass').length

  const visible = issues.filter((issue) => filter === 'all' || issue.severity === filter)

  const filters: { id: FilterId; label: string; count: number }[] = [
    { id: 'all', label: copy.filters.all, count: issues.length },
    { id: 'error', label: copy.filters.error, count: errorCount },
    { id: 'warning', label: copy.filters.warning, count: warningCount },
    { id: 'info', label: copy.filters.info, count: infoCount },
  ]

  const summary = [
    { id: 'errors', label: copy.summary.errors, value: errorCount, tone: 'text-rose-600' },
    { id: 'warnings', label: copy.summary.warnings, value: warningCount, tone: 'text-amber-600' },
    {
      id: 'passed',
      label: copy.summary.passed,
      value: `${passedCount}/${checks.length}`,
      tone: 'text-emerald-600',
    },
    { id: 'standard', label: copy.summary.standard, value: pkg.version, tone: 'text-navy' },
  ]

  const statusTone = { validated: 'green', failed: 'red', processing: 'amber' } as const

  return (
    <div className="space-y-6">
      <Link
        to={paths.content.scorm}
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
            <ContentBadge tone={statusTone[pkg.status]}>
              {pkg.status === 'validated'
                ? 'Validated'
                : pkg.status === 'failed'
                  ? 'Failed'
                  : 'Processing'}
            </ContentBadge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {pkg.name} · {pkg.file} · {pkg.size}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setNotice(copy.downloadNotice)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            {copy.download}
          </button>
          <button
            type="button"
            onClick={() => setNotice(copy.revalidateNotice)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshIcon className="h-4 w-4" />
            {copy.revalidate}
          </button>
        </div>
      </header>

      <div className="max-w-sm">
        <label htmlFor="scorm-package" className="mb-1.5 block text-sm font-semibold text-navy">
          {copy.selectPackage}
        </label>
        <ContentSelect
          id="scorm-package"
          value={pkg.id}
          onChange={(event) => {
            setSearchParams({ package: event.target.value })
            setFilter('all')
          }}
        >
          {contentScormPackages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </ContentSelect>
      </div>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {pkg.status === 'failed' ? (
        <ContentNotice tone="amber">{copy.failedBanner}</ContentNotice>
      ) : pkg.status === 'validated' ? (
        <ContentNotice>{copy.passedBanner}</ContentNotice>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className={`mt-1 text-2xl leading-tight font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <ContentCard
          title={copy.checksTitle}
          description={copy.checksDescription}
          className="self-start"
        >
          <ul className="space-y-1">
            {checks.map((check) => (
              <li
                key={check.id}
                className="flex items-start justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0"
              >
                <span className="flex items-start gap-2.5 text-sm text-navy">
                  {check.result === 'pass' ? (
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  ) : check.result === 'pending' ? (
                    <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  ) : (
                    <AlertTriangleIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        check.result === 'fail' ? 'text-rose-500' : 'text-amber-500'
                      }`}
                    />
                  )}
                  {check.label}
                </span>
                <ContentBadge tone={resultTone[check.result]}>
                  {copy.resultLabel[check.result]}
                </ContentBadge>
              </li>
            ))}
          </ul>
        </ContentCard>

        <ContentCard title={copy.issuesTitle} description={copy.issuesDescription}>
          {pkg.status === 'processing' ? (
            <ContentEmptyState
              icon={<ClockIcon className="h-6 w-6" />}
              title={copy.processingTitle}
              body={copy.processingBody}
            />
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition ${
                      filter === item.id
                        ? 'border-brand bg-[#EFF4FF] text-brand'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[11px]">{item.count}</span>
                  </button>
                ))}
              </div>

              {visible.length ? (
                <ul className="space-y-3">
                  {visible.map((issue) => (
                    <li
                      key={issue.id}
                      className={`rounded-xl border border-l-4 border-slate-200 p-4 ${severityStyle[issue.severity]}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <ContentBadge tone={severityTone[issue.severity]}>
                          {copy.severity[issue.severity]}
                        </ContentBadge>
                        <span className="text-xs font-semibold tracking-wide text-slate-400">
                          {issue.code}
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-navy">{issue.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{issue.detail}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {copy.fileLabel}:{' '}
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                          {issue.file}
                        </code>
                        {issue.line ? ` · ${copy.lineLabel} ${issue.line}` : ''}
                      </p>
                      <p className="mt-3 flex items-start gap-2 rounded-lg bg-[#EFF4FF] px-3 py-2 text-xs text-brand">
                        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          <span className="font-semibold">{copy.fixLabel}:</span> {issue.fix}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ContentEmptyState
                  icon={<CheckCircleIcon className="h-6 w-6" />}
                  title={copy.allClearTitle}
                  body={copy.allClearBody}
                />
              )}
            </>
          )}
        </ContentCard>
      </div>
    </div>
  )
}
