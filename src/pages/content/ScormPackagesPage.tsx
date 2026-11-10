import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  contentScormPackages,
  contentScormPage,
  type ScormPackage,
  type ScormPackageStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ContentBadge,
  ContentEmptyState,
  ContentNotice,
  ContentRowAction,
} from '@/components/common'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CloseIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FilterIcon,
  LayersIcon,
  RefreshIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from '@/components/ui'

const copy = contentScormPage

const statusTone = { validated: 'green', failed: 'red', processing: 'amber' } as const

const metricTone = {
  blue: 'bg-[#EFF4FF] text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-600',
} as const

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ContentScormPackagesPage() {
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const [packages, setPackages] = useState<ScormPackage[]>(contentScormPackages)
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [status, setStatus] = useState<'all' | ScormPackageStatus>('all')
  const [version, setVersion] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const versions = useMemo(
    () => Array.from(new Set(contentScormPackages.map((item) => item.version))),
    [],
  )

  const counts = useMemo(
    () => ({
      total: packages.length,
      validated: packages.filter((item) => item.status === 'validated').length,
      failed: packages.filter((item) => item.status === 'failed').length,
      processing: packages.filter((item) => item.status === 'processing').length,
    }),
    [packages],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return packages.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (version !== 'all' && item.version !== version) return false
      if (!needle) return true
      return (
        item.name.toLowerCase().includes(needle) ||
        item.file.toLowerCase().includes(needle) ||
        item.course.toLowerCase().includes(needle)
      )
    })
  }, [packages, query, status, version])

  const hasFilters = Boolean(query.trim()) || status !== 'all' || version !== 'all'

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setVersion('all')
  }

  function handleFile(file: File | undefined) {
    if (!file) return
    const base = file.name.replace(/\.zip$/i, '')
    const entry: ScormPackage = {
      id: `pkg-upload-${Date.now()}`,
      name: base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      file: file.name,
      course: 'Unassigned',
      version: 'SCORM 2004 4th Ed.',
      size: formatSize(file.size),
      status: 'processing',
      uploadedBy: 'Content Admin',
      uploaded: 'Just now',
      errors: 0,
      warnings: 0,
    }
    setPackages((current) => [entry, ...current])
    setShowUpload(false)
    setNotice(`“${entry.name}” ${copy.uploadNotice}`)
  }

  function revalidate(item: ScormPackage) {
    setPackages((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, status: 'processing', errors: 0, warnings: 0 } : entry,
      ),
    )
    setNotice(`“${item.name}” ${copy.revalidateNotice}`)
  }

  function remove(item: ScormPackage) {
    setPackages((current) => current.filter((entry) => entry.id !== item.id))
    setNotice(`“${item.name}” ${copy.removeNotice}`)
  }

  const metrics = [
    { id: 'total', label: copy.metrics.total, value: counts.total, tone: 'blue' as const },
    { id: 'validated', label: copy.metrics.validated, value: counts.validated, tone: 'green' as const },
    { id: 'failed', label: copy.metrics.failed, value: counts.failed, tone: 'red' as const },
    { id: 'processing', label: copy.metrics.processing, value: counts.processing, tone: 'amber' as const },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowUpload((open) => !open)}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 lg:self-auto"
        >
          <UploadIcon className="h-4 w-4" />
          {copy.upload}
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${metricTone[metric.tone]}`}
            >
              {metric.id === 'total' ? <LayersIcon className="h-5 w-5" /> : null}
              {metric.id === 'validated' ? <CheckCircleIcon className="h-5 w-5" /> : null}
              {metric.id === 'failed' ? <AlertTriangleIcon className="h-5 w-5" /> : null}
              {metric.id === 'processing' ? <ClockIcon className="h-5 w-5" /> : null}
            </span>
            <div>
              <p className="text-2xl leading-none font-bold text-navy">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
            </div>
          </div>
        ))}
      </section>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {showUpload ? (
        <section
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            handleFile(event.dataTransfer.files[0])
          }}
          className={`relative flex flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging ? 'border-brand bg-[#EFF4FF]' : 'border-slate-300 bg-white'
          }`}
        >
          <button
            type="button"
            aria-label="Close upload"
            onClick={() => setShowUpload(false)}
            className="absolute top-3 right-3 rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF4FF] text-brand">
            <UploadIcon className="h-6 w-6" />
          </span>
          <h3 className="mt-3 text-base font-bold text-navy">{copy.dropzoneTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{copy.dropzoneBody}</p>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-4 inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            {copy.dropzoneBrowse}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(event) => {
              handleFile(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center">
          <label className="relative min-w-[12rem] flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </label>
          <label className="relative">
            <FilterIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              aria-label="Status"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allStatuses}</option>
              <option value="validated">{copy.status.validated}</option>
              <option value="failed">{copy.status.failed}</option>
              <option value="processing">{copy.status.processing}</option>
            </select>
          </label>
          <label className="relative">
            <FileIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={version}
              onChange={(event) => setVersion(event.target.value)}
              aria-label="SCORM standard"
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
            >
              <option value="all">{copy.allVersions}</option>
              {versions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-5 py-3 font-semibold">{copy.columns.package}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.course}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.version}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.size}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.status}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.issues}</th>
                <th className="px-3 py-3 font-semibold">{copy.columns.uploaded}</th>
                <th className="px-5 py-3 font-semibold">{copy.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#004ea8] to-[#0b7bd6] text-white">
                        <LayersIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-navy">{item.name}</span>
                        <span className="block text-xs text-slate-400">{item.file}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-500">{item.course}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{item.version}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{item.size}</td>
                  <td className="px-3 py-3">
                    <ContentBadge tone={statusTone[item.status]}>
                      {copy.status[item.status]}
                    </ContentBadge>
                  </td>
                  <td className="px-3 py-3 text-xs whitespace-nowrap">
                    {item.status === 'processing' || (!item.errors && !item.warnings) ? (
                      <span className="text-slate-400">{copy.noIssues}</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {item.errors ? (
                          <span className="font-semibold text-rose-600">{item.errors} err</span>
                        ) : null}
                        {item.warnings ? (
                          <span className="font-semibold text-amber-600">{item.warnings} warn</span>
                        ) : null}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                    <span className="block">{item.uploaded}</span>
                    <span className="block text-xs text-slate-400">{item.uploadedBy}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <ContentRowAction
                        label={copy.actions.report}
                        onClick={() =>
                          navigate(`${paths.content.scormValidation}?package=${encodeURIComponent(item.id)}`)
                        }
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction
                        label={copy.actions.revalidate}
                        onClick={() => revalidate(item)}
                      >
                        <RefreshIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction
                        label={copy.actions.download}
                        onClick={() => setNotice(`“${item.name}” ${copy.downloadNotice}`)}
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                      <ContentRowAction
                        label={copy.actions.remove}
                        tone="danger"
                        onClick={() => remove(item)}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </ContentRowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length ? (
          <ContentEmptyState
            icon={<LayersIcon className="h-6 w-6" />}
            title={copy.emptyTitle}
            body={copy.emptyBody}
          >
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.clearFilters}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <UploadIcon className="h-4 w-4" />
              {copy.upload}
            </button>
          </ContentEmptyState>
        ) : null}

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          {copy.showing} {filtered.length} {copy.of} {packages.length} {copy.packages}
        </div>
      </section>
    </div>
  )
}
