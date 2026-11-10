import { useMemo, useState, type FormEvent } from 'react'
import {
  ContentBadge,
  ContentField,
  ContentNotice,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
} from '@/components/common'
import { ChevronDownIcon, SearchIcon, TrashIcon } from '@/components/ui'
import type {
  SuperAdminCatalogPage,
  SuperAdminFormField,
  SuperAdminFormRecord,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

type Notice = { tone: 'green' | 'amber' | 'blue'; text: string }

/** Session-level stores so saved settings / records survive navigation. */
const baselineStore = new Map<string, Record<string, string>>()
const recordStore = new Map<string, SuperAdminFormRecord[]>()
let recordCounter = 0
function nextRecordId() {
  recordCounter += 1
  return recordCounter
}

function defaultsFor(page: SuperAdminCatalogPage) {
  const values: Record<string, string> = {}
  for (const section of page.form?.sections ?? []) {
    for (const field of section.fields) {
      values[field.key] = field.default ?? (field.type === 'toggle' ? 'false' : field.type === 'select' ? field.options?.[0] ?? '' : '')
    }
  }
  return values
}

function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] || '—')
}

function validateField(field: SuperAdminFormField, value: string) {
  const trimmed = value.trim()
  if (field.required && field.type !== 'toggle' && !trimmed) return `${field.label} is required.`
  if (!trimmed) return ''
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address.'
  if (field.type === 'url' && !/^https?:\/\/\S+$/.test(trimmed)) return 'Enter a link starting with https://'
  if (field.type === 'number' && Number.isNaN(Number(trimmed))) return 'Enter a number.'
  return ''
}

function FieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: SuperAdminFormField
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const id = `form-${field.key}`
  if (field.type === 'toggle') {
    return (
      <div className={field.wide ? 'sm:col-span-2' : ''}>
        <ContentToggle checked={value === 'true'} onChange={(next) => onChange(next ? 'true' : 'false')} label={field.label} description={field.hint} />
      </div>
    )
  }
  return (
    <ContentField label={field.label} htmlFor={id} required={field.required} hint={field.hint} error={error} className={field.wide ? 'sm:col-span-2' : ''}>
      {field.type === 'textarea' ? (
        <ContentTextArea id={id} rows={4} value={value} invalid={Boolean(error)} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : field.type === 'select' ? (
        <ContentSelect id={id} value={value} invalid={Boolean(error)} onChange={(event) => onChange(event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </ContentSelect>
      ) : (
        <ContentTextInput id={id} type={field.type} value={value} invalid={Boolean(error)} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </ContentField>
  )
}

function FaqList({ page }: { page: SuperAdminCatalogPage }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<number | null>(0)
  const items = useMemo(
    () =>
      (page.faq ?? []).filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(query.trim().toLowerCase())),
    [page.faq, query],
  )
  return (
    <section className={`${cardClass} p-6`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-navy">Frequently asked questions</h2>
          <p className="mt-0.5 text-xs text-slate-400">Quick answers for common Super Admin tasks.</p>
        </div>
        <label className="relative sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search help articles…"
            aria-label="Search help articles"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </label>
      </div>
      <ul className="mt-4 divide-y divide-slate-100">
        {items.length === 0 ? (
          <li className="py-6 text-center text-sm text-slate-500">No articles match “{query}”.</li>
        ) : (
          items.map((item, index) => (
            <li key={item.q}>
              <button
                type="button"
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-semibold text-navy"
              >
                {item.q}
                <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-400 transition ${open === index ? 'rotate-180' : ''}`} />
              </button>
              {open === index ? <p className="pb-4 text-sm text-slate-500">{item.a}</p> : null}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export function CatalogFormView({ page }: { page: SuperAdminCatalogPage }) {
  const form = page.form
  const defaults = useMemo(() => defaultsFor(page), [page])
  const [baseline, setBaselineState] = useState<Record<string, string>>(() => baselineStore.get(page.path) ?? defaults)
  const [values, setValues] = useState<Record<string, string>>(baseline)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<Notice | null>(null)
  const [records, setRecordsState] = useState<SuperAdminFormRecord[]>(() => recordStore.get(page.path) ?? form?.records ?? [])

  if (!form) return null

  const dirty = Object.keys(values).some((key) => values[key] !== baseline[key])

  function setRecords(next: SuperAdminFormRecord[]) {
    recordStore.set(page.path, next)
    setRecordsState(next)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!form) return
    const next: Record<string, string> = {}
    for (const section of form.sections) {
      for (const field of section.fields) {
        const message = validateField(field, values[field.key] ?? '')
        if (message) next[field.key] = message
      }
    }
    const custom = form.validate?.(values) ?? {}
    for (const [key, message] of Object.entries(custom)) {
      if (message && !next[key]) next[key] = message
    }
    setErrors(next)
    const count = Object.keys(next).length
    if (count > 0) {
      setNotice({ tone: 'amber', text: `Please fix ${count} ${count === 1 ? 'field' : 'fields'} before saving.` })
      return
    }

    const derived = { ...values }
    if ('delivery' in derived) derived.delivery = derived.delivery === 'Schedule' ? 'Scheduled' : 'Sent'

    if (form.kind === 'create') {
      const record: SuperAdminFormRecord = {
        id: `${page.path}-rec-${nextRecordId()}`,
        values: Object.fromEntries((form.recordColumns ?? []).map((column) => [column.key, derived[column.key] ?? ''])),
      }
      setRecords([record, ...records])
      setValues(defaults)
      setBaselineState(defaults)
    } else {
      baselineStore.set(page.path, values)
      setBaselineState(values)
    }
    setNotice({ tone: 'green', text: fillTemplate(form.successNotice, derived) })
  }

  function cancel() {
    setValues(form?.kind === 'create' ? defaults : baseline)
    setErrors({})
    setNotice({ tone: 'blue', text: form?.kind === 'create' ? 'Form cleared.' : 'Changes discarded — showing the last saved values.' })
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-slate-400">
          {page.section}
          <span className="mx-1.5">/</span>
          <span className="text-slate-500">{page.title}</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">{page.title}</h1>
          {form.kind === 'settings' && dirty ? <ContentBadge tone="amber">Unsaved changes</ContentBadge> : null}
        </div>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{page.subtitle}</p>
      </header>

      {notice ? (
        <ContentNotice tone={notice.tone} onDismiss={() => setNotice(null)}>
          {notice.text}
        </ContentNotice>
      ) : null}

      {page.faq ? <FaqList page={page} /> : null}

      <form onSubmit={submit} noValidate className="space-y-5">
        {form.sections.map((section) => (
          <section key={section.title} className={`${cardClass} p-6`}>
            <h2 className="text-base font-bold text-navy">{section.title}</h2>
            {section.description ? <p className="mt-0.5 text-xs text-slate-400">{section.description}</p> : null}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <FieldControl
                  key={field.key}
                  field={field}
                  value={values[field.key] ?? ''}
                  error={errors[field.key]}
                  onChange={(value) => {
                    setValues((current) => ({ ...current, [field.key]: value }))
                    if (errors[field.key]) setErrors((current) => ({ ...current, [field.key]: '' }))
                  }}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <button type="button" onClick={cancel} className={btnOutline}>
            {form.cancelLabel}
          </button>
          <button type="submit" className={btnPrimary}>
            {form.submitLabel}
          </button>
        </div>
      </form>

      {form.kind === 'create' && form.recordColumns ? (
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-bold text-navy">{form.recordsTitle ?? 'Recently saved'}</h2>
            <span className="text-xs text-slate-400">{records.length} saved</span>
          </div>
          {records.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-500">Nothing saved yet. Submit the form above to see it here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {form.recordColumns.map((column) => (
                      <th key={column.key} className="px-6 py-3 font-semibold">
                        {column.label}
                      </th>
                    ))}
                    <th className="w-16 px-4 py-3 text-right font-semibold">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 last:border-0">
                      {form.recordColumns?.map((column, index) => (
                        <td key={column.key} className={`px-6 py-3 ${index === 0 ? 'font-semibold text-navy' : 'text-slate-600'}`}>
                          {record.values[column.key] || '—'}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          aria-label={`Remove ${record.values[form.recordColumns?.[0]?.key ?? ''] ?? 'record'}`}
                          onClick={() => {
                            setRecords(records.filter((item) => item.id !== record.id))
                            setNotice({ tone: 'amber', text: `${record.values[form.recordColumns?.[0]?.key ?? ''] || 'Record'} removed from the list.` })
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
