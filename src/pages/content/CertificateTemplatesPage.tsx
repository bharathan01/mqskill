import { useMemo, useState } from 'react'
import {
  contentCertificatesPage,
  contentCertificateTemplates,
  type CertificateTemplate,
  type CertificateTemplateLayout,
  type CertificateTemplateStatus,
} from '@/constants'
import {
  ContentBadge,
  ContentEmptyState,
  ContentNotice,
  ContentSelect,
} from '@/components/common'
import {
  AwardIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  EyeIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  QrCodeIcon,
  SearchIcon,
} from '@/components/ui'

const copy = contentCertificatesPage

const statusTone = { active: 'green', draft: 'amber' } as const

function CertificatePreview({
  template,
  large = false,
}: {
  template: CertificateTemplate
  large?: boolean
}) {
  const portrait = template.orientation === 'Portrait'
  const size = large ? '' : 'text-[0.55rem]'
  return (
    <div
      className={`relative mx-auto flex flex-col items-center justify-center overflow-hidden bg-white text-center shadow-sm ${size} ${
        portrait ? 'aspect-[3/4] w-3/5' : 'aspect-[4/3] w-full'
      }`}
      style={{ border: `${template.layout === 'minimal' ? 1 : 4}px solid ${template.color}` }}
    >
      {template.layout === 'modern' ? (
        <span className={`absolute inset-y-0 left-0 w-[14%] bg-gradient-to-b ${template.accent}`} />
      ) : null}
      {template.layout === 'classic' ? (
        <span
          className="absolute inset-1.5 border"
          style={{ borderColor: template.color, opacity: 0.4 }}
        />
      ) : null}
      {template.layout === 'badge' ? (
        <span className={`absolute inset-x-0 top-0 h-[22%] bg-gradient-to-r ${template.accent}`} />
      ) : null}

      <div className={`relative px-4 ${template.layout === 'modern' ? 'pl-[18%]' : ''}`}>
        <p
          className={`font-bold tracking-widest uppercase ${large ? 'text-xs' : ''} ${
            template.layout === 'badge' ? 'mt-[18%] text-slate-500' : ''
          }`}
          style={{ color: template.layout === 'badge' ? undefined : template.color }}
        >
          {copy.certificateOf}
        </p>
        <p className={`mt-1.5 text-slate-400 ${large ? 'text-xs' : ''}`}>{copy.previewCertify}</p>
        <p
          className={`mt-1 font-serif font-bold text-navy ${large ? 'text-3xl' : 'text-sm'}`}
        >
          {copy.previewName}
        </p>
        <p className={`mt-1 text-slate-400 ${large ? 'text-xs' : ''}`}>{copy.previewCompleted}</p>
        <p
          className={`mt-1 font-semibold ${large ? 'text-lg' : 'text-[0.65rem]'}`}
          style={{ color: template.color }}
        >
          {copy.previewCourse}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-slate-400">
          {template.layout === 'badge' ? (
            <QrCodeIcon className={large ? 'h-8 w-8' : 'h-4 w-4'} />
          ) : (
            <span
              className={`flex items-center justify-center rounded-full text-white ${large ? 'h-10 w-10' : 'h-5 w-5'}`}
              style={{ backgroundColor: template.color }}
            >
              <AwardIcon className={large ? 'h-5 w-5' : 'h-2.5 w-2.5'} />
            </span>
          )}
          <span className={large ? 'text-xs' : ''}>{copy.previewDate}</span>
        </div>
        {large ? <p className="mt-2 text-xs text-slate-400">{copy.previewId}</p> : null}
      </div>
    </div>
  )
}

export function ContentCertificateTemplatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>(contentCertificateTemplates)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | CertificateTemplateStatus>('all')
  const [layout, setLayout] = useState<'all' | CertificateTemplateLayout>('all')
  const [notice, setNotice] = useState<string | null>(null)
  const [preview, setPreview] = useState<CertificateTemplate | null>(null)
  const [applying, setApplying] = useState<CertificateTemplate | null>(null)
  const [applyCourse, setApplyCourse] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return templates.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (layout !== 'all' && item.layout !== layout) return false
      if (!needle) return true
      return (
        item.name.toLowerCase().includes(needle) || item.description.toLowerCase().includes(needle)
      )
    })
  }, [layout, query, status, templates])

  const hasFilters = Boolean(query.trim()) || status !== 'all' || layout !== 'all'

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setLayout('all')
  }

  function create() {
    const entry: CertificateTemplate = {
      id: `tpl-new-${Date.now()}`,
      name: `Untitled Template ${templates.length + 1}`,
      description: 'New certificate template. Start by choosing a layout and colours.',
      layout: 'classic',
      status: 'draft',
      accent: 'from-[#004ea8] to-[#0b7bd6]',
      color: '#004ea8',
      orientation: 'Landscape',
      courses: 0,
      updated: 'Just now',
      isDefault: false,
    }
    setTemplates((current) => [entry, ...current])
    setNotice(copy.createNotice)
  }

  function duplicate(item: CertificateTemplate) {
    const entry: CertificateTemplate = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      name: `${item.name} (copy)`,
      status: 'draft',
      courses: 0,
      isDefault: false,
      updated: 'Just now',
    }
    setTemplates((current) => {
      const index = current.findIndex((entryItem) => entryItem.id === item.id)
      const next = [...current]
      next.splice(index + 1, 0, entry)
      return next
    })
    setNotice(`“${item.name}” ${copy.duplicateNotice}`)
  }

  function setDefault(item: CertificateTemplate) {
    setTemplates((current) =>
      current.map((entry) => ({
        ...entry,
        isDefault: entry.id === item.id,
        status: entry.id === item.id ? 'active' : entry.status,
      })),
    )
    setNotice(`“${item.name}” ${copy.defaultNotice}`)
  }

  function confirmApply() {
    if (!applying || !applyCourse) return
    setTemplates((current) =>
      current.map((entry) =>
        entry.id === applying.id
          ? { ...entry, courses: entry.courses + 1, status: 'active' }
          : entry,
      ),
    )
    setNotice(`“${applying.name}” ${copy.useNotice} (${applyCourse})`)
    setApplying(null)
    setApplyCourse('')
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={create}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 lg:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          {copy.create}
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:flex-row lg:items-center">
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
            <option value="active">{copy.status.active}</option>
            <option value="draft">{copy.status.draft}</option>
          </select>
        </label>
        <label className="relative">
          <AwardIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={layout}
            onChange={(event) => setLayout(event.target.value as typeof layout)}
            aria-label="Layout"
            className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm text-navy outline-none focus:border-brand"
          >
            <option value="all">{copy.allLayouts}</option>
            {(Object.keys(copy.layouts) as CertificateTemplateLayout[]).map((id) => (
              <option key={id} value={id}>
                {copy.layouts[id]}
              </option>
            ))}
          </select>
        </label>
      </section>

      {filtered.length ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
            >
              <div className="relative bg-slate-50 p-5">
                <div className="flex h-44 items-center justify-center">
                  <div className={item.orientation === 'Portrait' ? 'h-full' : 'w-full max-w-[14rem]'}>
                    <CertificatePreview template={item} />
                  </div>
                </div>
                {item.isDefault ? (
                  <span className="absolute top-3 left-3">
                    <ContentBadge tone="blue">{copy.defaultBadge}</ContentBadge>
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPreview(item)}
                  aria-label={`${copy.actions.preview}: ${item.name}`}
                  title={copy.actions.preview}
                  className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                >
                  <EyeIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-navy">{item.name}</h3>
                  <ContentBadge tone={statusTone[item.status]}>{copy.status[item.status]}</ContentBadge>
                </div>
                <p className="mt-1 flex-1 text-sm text-slate-500">{item.description}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {copy.layouts[item.layout]} · {item.orientation} · {item.courses} {copy.usedBy} ·{' '}
                  {copy.updated} {item.updated}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotice(`“${item.name}” ${copy.editNotice}`)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-navy hover:bg-slate-50"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    {copy.actions.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApplying(item)
                      setApplyCourse('')
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    {copy.actions.use}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicate(item)}
                    aria-label={`${copy.actions.duplicate}: ${item.name}`}
                    title={copy.actions.duplicate}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                  </button>
                  {!item.isDefault ? (
                    <button
                      type="button"
                      onClick={() => setDefault(item)}
                      className="ml-auto text-xs font-semibold text-brand hover:text-blue-700"
                    >
                      {copy.actions.setDefault}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <ContentEmptyState
            icon={<AwardIcon className="h-6 w-6" />}
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
          </ContentEmptyState>
        </section>
      )}

      {preview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.previewTitle}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                  {copy.previewTitle}
                </p>
                <h2 className="mt-1 text-lg font-bold text-navy">{preview.name}</h2>
              </div>
              <button
                type="button"
                aria-label={copy.closePreview}
                onClick={() => setPreview(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <div className={preview.orientation === 'Portrait' ? 'mx-auto max-w-sm' : ''}>
                <CertificatePreview template={preview} large />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {applying ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.actions.use}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          onClick={() => setApplying(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-navy">{applying.name}</h2>
            <label htmlFor="cert-apply-course" className="mt-4 mb-1.5 block text-sm font-semibold text-navy">
              {copy.applyTo}
            </label>
            <ContentSelect
              id="cert-apply-course"
              value={applyCourse}
              onChange={(event) => setApplyCourse(event.target.value)}
            >
              <option value="">{copy.chooseCourse}</option>
              {copy.courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </ContentSelect>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setApplying(null)}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                disabled={!applyCourse}
                onClick={confirmApply}
                className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
