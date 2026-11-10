import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  contentScormPackages,
  contentScormValidationPage,
  getScormPackage,
  getScormValidationChecks,
  getScormValidationHistory,
  type ScormCheckResult,
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
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  ListIcon,
  LockIcon,
  MinusCircleIcon,
  PlayIcon,
  RefreshIcon,
  UploadIcon,
  XCircleIcon,
} from '@/components/ui'

const copy = contentScormValidationPage

type FilterId = 'all' | 'pass' | 'fail' | 'warn' | 'skip'

const resultTone = {
  pass: 'green',
  fail: 'red',
  warn: 'amber',
  skip: 'slate',
  pending: 'slate',
} as const

function CheckResultIcon({ result }: { result: ScormCheckResult }) {
  if (result === 'pass') return <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
  if (result === 'fail') return <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
  if (result === 'warn') return <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
  if (result === 'skip') return <MinusCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
  return <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
}

export function ContentScormValidationPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterId>('all')
  const [notice, setNotice] = useState<string | null>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  const requested = getScormPackage(searchParams.get('package'))
  const pkg =
    requested ??
    contentScormPackages.find((item) => item.id === 'pkg-pm-fundamentals') ??
    contentScormPackages.find((item) => item.status === 'failed') ??
    contentScormPackages[0]

  const checks = useMemo(() => getScormValidationChecks(pkg.id), [pkg.id])
  const history = useMemo(() => getScormValidationHistory(pkg.id), [pkg.id])

  const passedCount = checks.filter((check) => check.result === 'pass').length
  const warningCount = checks.filter((check) => check.result === 'warn').length
  const errorCount = checks.filter((check) => check.result === 'fail').length
  const hasErrors = errorCount > 0 || pkg.status === 'failed'
  const canLaunch = !hasErrors && pkg.status === 'validated'

  const visible = checks.filter((check) => filter === 'all' || check.result === filter)

  const groups = useMemo(() => {
    const order: string[] = []
    const map = new Map<string, typeof visible>()
    for (const check of visible) {
      if (!map.has(check.group)) {
        order.push(check.group)
        map.set(check.group, [])
      }
      map.get(check.group)!.push(check)
    }
    return order.map((group) => ({ group, items: map.get(group)! }))
  }, [visible])

  const summary = [
    {
      id: 'checks',
      label: copy.summary.checks,
      value: checks.length,
      icon: <ListIcon className="h-5 w-5" />,
      iconClass: 'bg-[#EFF4FF] text-brand',
      valueClass: 'text-navy',
    },
    {
      id: 'passed',
      label: copy.summary.passed,
      value: passedCount,
      icon: <CheckCircleIcon className="h-5 w-5" />,
      iconClass: 'bg-emerald-50 text-emerald-600',
      valueClass: 'text-emerald-600',
    },
    {
      id: 'warnings',
      label: copy.summary.warnings,
      value: warningCount,
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      iconClass: 'bg-amber-50 text-amber-600',
      valueClass: 'text-amber-600',
    },
    {
      id: 'errors',
      label: copy.summary.errors,
      value: errorCount,
      icon: <XCircleIcon className="h-5 w-5" />,
      iconClass: 'bg-rose-50 text-rose-600',
      valueClass: 'text-rose-600',
    },
  ]

  const detailRows = [
    { label: copy.details.course, value: pkg.course },
    { label: copy.details.version, value: pkg.courseVersion },
    { label: copy.details.standard, value: pkg.version },
    { label: copy.details.size, value: pkg.size },
    { label: copy.details.files, value: String(pkg.files) },
    { label: copy.details.source, value: pkg.source },
  ]

  const statusTone = { validated: 'green', failed: 'red', processing: 'amber' } as const

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
        <Link to={paths.content.scorm} className="font-medium text-slate-500 hover:text-brand">
          {copy.crumbScorm}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300" />
        <Link
          to={paths.content.scormValidation}
          className="font-medium text-slate-500 hover:text-brand"
        >
          {copy.crumbValidation}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-semibold text-navy">{pkg.file}</span>
      </nav>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
            <ContentBadge tone={statusTone[pkg.status]}>
              {pkg.status === 'validated'
                ? copy.status.validated
                : pkg.status === 'failed'
                  ? copy.status.failed
                  : copy.status.processing}
            </ContentBadge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {pkg.file} · {pkg.version} · {copy.uploadedPrefix} {pkg.uploaded} {copy.by}{' '}
            {pkg.uploadedBy}
          </p>
        </div>
        <div className="flex shrink-0 flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="w-52 shrink-0">
            <ContentSelect
              id="scorm-package"
              aria-label={copy.selectPackage}
              value={pkg.id}
              onChange={(event) => {
                setSearchParams({ package: event.target.value })
                setFilter('all')
              }}
            >
              {contentScormPackages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.file}
                </option>
              ))}
            </ContentSelect>
          </div>
          <button
            type="button"
            onClick={() => setNotice(copy.downloadNotice)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold whitespace-nowrap text-navy hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            {copy.download}
          </button>
          <button
            type="button"
            onClick={() => setNotice(copy.revalidateNotice)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold whitespace-nowrap text-navy hover:bg-slate-50"
          >
            <RefreshIcon className="h-4 w-4" />
            {copy.revalidate}
          </button>
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold whitespace-nowrap text-white hover:bg-blue-700"
          >
            <UploadIcon className="h-4 w-4" />
            {copy.uploadFixed}
          </button>
          <input
            ref={uploadRef}
            type="file"
            accept=".zip,application/zip"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              setNotice(`${file.name} queued. ${copy.revalidateNotice}`)
            }}
          />
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
            >
              {item.icon}
            </span>
            <div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`mt-0.5 text-2xl leading-tight font-bold ${item.valueClass}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ContentCard
          title={copy.checksTitle}
          description={copy.checksDescription}
          action={
            <ContentSelect
              id="scorm-check-filter"
              aria-label="Filter checks"
              value={filter}
              className="h-9 w-40 text-sm"
              onChange={(event) => setFilter(event.target.value as FilterId)}
            >
              <option value="all">{copy.filterAll}</option>
              <option value="fail">{copy.filterFail}</option>
              <option value="warn">{copy.filterWarn}</option>
              <option value="pass">{copy.filterPass}</option>
              <option value="skip">{copy.filterSkip}</option>
            </ContentSelect>
          }
        >
          {pkg.status === 'processing' ? (
            <ContentEmptyState
              icon={<ClockIcon className="h-6 w-6" />}
              title={copy.processingTitle}
              body={copy.processingBody}
            />
          ) : groups.length ? (
            <div className="space-y-6">
              {groups.map(({ group, items }) => (
                <section key={group}>
                  <h3 className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
                    {group}
                  </h3>
                  <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {items.map((check) => (
                      <li key={check.id} className="flex items-start gap-3 px-4 py-3.5">
                        <CheckResultIcon result={check.result} />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              check.result === 'fail' ? 'text-rose-700' : 'text-navy'
                            }`}
                          >
                            {check.label}
                          </p>
                          {check.detail ? (
                            <p className="mt-0.5 text-sm text-slate-500">{check.detail}</p>
                          ) : null}
                          {check.fix ? (
                            <p className="mt-2 rounded-lg bg-[#EFF4FF] px-3 py-2 text-xs text-brand">
                              <button
                                type="button"
                                onClick={() => setNotice(check.fix!)}
                                className="text-left font-semibold underline-offset-2 hover:underline"
                              >
                                {check.fix}
                              </button>
                            </p>
                          ) : null}
                        </div>
                        <ContentBadge tone={resultTone[check.result]}>
                          {copy.resultLabel[check.result]}
                        </ContentBadge>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ContentEmptyState
              icon={<CheckCircleIcon className="h-6 w-6" />}
              title="No checks in this view"
              body="Adjust the filter to see other validation results."
            />
          )}
        </ContentCard>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <ContentCard title={copy.detailsTitle}>
            <dl className="space-y-2.5 text-sm">
              {detailRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <dt className="text-slate-400">{row.label}</dt>
                  <dd className="text-right font-medium text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
          </ContentCard>

          <ContentCard title={copy.testLaunchTitle}>
            <div
              className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center ${
                canLaunch
                  ? 'border-brand/40 bg-[#F8FBFF]'
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {canLaunch ? (
                <PlayIcon className="h-7 w-7 text-brand" />
              ) : (
                <LockIcon className="h-7 w-7" />
              )}
              <p className="mt-3 text-sm font-medium">
                {canLaunch ? 'Ready to preview in the test player' : copy.launchBlocked}
              </p>
            </div>
            <button
              type="button"
              disabled={!canLaunch}
              onClick={() => setNotice(copy.launchNotice)}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <PlayIcon className="h-4 w-4" />
              {copy.launch}
            </button>
          </ContentCard>

          <ContentCard
            title={copy.historyTitle}
            action={
              <Link
                to={paths.content.history}
                className="inline-flex items-center text-xs font-semibold text-brand hover:text-blue-700"
              >
                {copy.historyLink}
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {history.length ? (
              <ul className="space-y-3">
                {history.map((run) => (
                  <li key={run.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          run.status === 'passed' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-navy">{run.at}</p>
                        <p className="text-xs text-slate-500">
                          {run.errors} errors · {run.warnings} warnings
                        </p>
                      </div>
                    </div>
                    <ContentBadge tone={run.status === 'passed' ? 'green' : 'red'}>
                      {run.status === 'passed' ? copy.status.passed : copy.status.failed}
                    </ContentBadge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No previous validation runs for this package.</p>
            )}
          </ContentCard>
        </aside>
      </div>
    </div>
  )
}
