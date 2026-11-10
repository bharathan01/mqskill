import { useMemo, useState } from 'react'
import {
  contentCpdAccreditors,
  contentCpdDefaults,
  contentCpdPage,
  contentCpdRequirements,
  type CpdAccreditor,
  type CpdCourseRequirement,
} from '@/constants'
import {
  ContentBadge,
  ContentCard,
  ContentEmptyState,
  ContentField,
  ContentNotice,
  ContentSelect,
  ContentTextInput,
  ContentToggle,
} from '@/components/common'
import {
  AwardIcon,
  BookIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@/components/ui'

const copy = contentCpdPage

const metricTone = {
  blue: 'bg-[#EFF4FF] text-brand',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-violet-50 text-violet-600',
} as const

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ContentCpdConfigurationPage() {
  const [rules, setRules] = useState(contentCpdDefaults)
  const [accreditors, setAccreditors] = useState<CpdAccreditor[]>(contentCpdAccreditors)
  const [requirements, setRequirements] = useState<CpdCourseRequirement[]>(contentCpdRequirements)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  function patchRules(patch: Partial<typeof contentCpdDefaults>) {
    setRules((current) => ({ ...current, ...patch }))
  }

  function patchAccreditor(id: string, patch: Partial<CpdAccreditor>) {
    setAccreditors((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  function patchRequirement(id: string, patch: Partial<CpdCourseRequirement>) {
    setRequirements((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  function addAccreditor() {
    setAccreditors((current) => [
      ...current,
      {
        id: `cpd-new-${Date.now()}`,
        name: copy.accreditation.newAccreditor,
        region: copy.accreditation.newAccreditorRegion,
        code: '',
        enabled: false,
        hoursPerYear: 20,
      },
    ])
  }

  function removeAccreditor(id: string) {
    setAccreditors((current) => current.filter((item) => item.id !== id))
    setRequirements((current) =>
      current.map((item) => (item.accreditorId === id ? { ...item, active: false } : item)),
    )
  }

  function reset() {
    setRules(contentCpdDefaults)
    setAccreditors(contentCpdAccreditors)
    setRequirements(contentCpdRequirements)
    setNotice(copy.resetNotice)
  }

  const enabledAccreditors = accreditors.filter((item) => item.enabled)

  const filteredRequirements = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return requirements
    return requirements.filter(
      (item) =>
        item.course.toLowerCase().includes(needle) || item.code.toLowerCase().includes(needle),
    )
  }, [query, requirements])

  const activeRequirements = requirements.filter((item) => item.active)
  const metrics = [
    {
      id: 'hours',
      label: copy.metrics.hours,
      value: activeRequirements.reduce((sum, item) => sum + item.hours, 0),
      tone: 'blue' as const,
    },
    { id: 'courses', label: copy.metrics.courses, value: activeRequirements.length, tone: 'green' as const },
    {
      id: 'accreditors',
      label: copy.metrics.accreditors,
      value: enabledAccreditors.length,
      tone: 'purple' as const,
    },
    {
      id: 'pending',
      label: copy.metrics.pending,
      value: requirements.filter((item) => !item.active).length,
      tone: 'amber' as const,
    },
  ]

  const methodLabel = copy.rules.methods.find((item) => item.id === rules.method)?.label ?? ''
  const roundingLabel = copy.rules.roundings.find((item) => item.id === rules.rounding)?.label ?? ''

  const summaryRows = [
    { label: copy.summary.labels.method, value: methodLabel },
    { label: copy.summary.labels.rounding, value: roundingLabel },
    { label: copy.summary.labels.cap, value: `${rules.maxPerCourse} ${copy.summary.hours}` },
    { label: copy.summary.labels.annual, value: `${rules.maxPerYear} ${copy.summary.hours}` },
    { label: copy.summary.labels.validity, value: `${rules.expiry} ${copy.summary.months}` },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            {copy.reset}
          </button>
          <button
            type="button"
            onClick={() => setNotice(copy.saveNotice)}
            className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy.save}
          </button>
        </div>
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
              {metric.id === 'hours' ? <ClockIcon className="h-5 w-5" /> : null}
              {metric.id === 'courses' ? <BookIcon className="h-5 w-5" /> : null}
              {metric.id === 'accreditors' ? <ShieldCheckIcon className="h-5 w-5" /> : null}
              {metric.id === 'pending' ? <AwardIcon className="h-5 w-5" /> : null}
            </span>
            <div>
              <p className="text-2xl leading-none font-bold text-navy">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
            </div>
          </div>
        ))}
      </section>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <ContentCard title={copy.rules.title} description={copy.rules.description}>
            <div className="grid gap-4 md:grid-cols-2">
              <ContentField label={copy.rules.method} htmlFor="cpd-method">
                <ContentSelect
                  id="cpd-method"
                  value={rules.method}
                  onChange={(event) => patchRules({ method: event.target.value })}
                >
                  <option value="">Select method</option>
                  {copy.rules.methods.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </ContentSelect>
              </ContentField>
              <ContentField label={copy.rules.rounding} htmlFor="cpd-rounding">
                <ContentSelect
                  id="cpd-rounding"
                  value={rules.rounding}
                  onChange={(event) => patchRules({ rounding: event.target.value })}
                >
                  <option value="">Select rounding</option>
                  {copy.rules.roundings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </ContentSelect>
              </ContentField>
              <ContentField label={copy.rules.maxPerCourse} htmlFor="cpd-max-course">
                <ContentTextInput
                  id="cpd-max-course"
                  type="number"
                  min={1}
                  value={rules.maxPerCourse}
                  onChange={(event) =>
                    patchRules({
                      maxPerCourse:
                        event.target.value === ''
                          ? ''
                          : clamp(Number(event.target.value) || 1, 1, 200),
                    })
                  }
                />
              </ContentField>
              <ContentField label={copy.rules.maxPerYear} htmlFor="cpd-max-year">
                <ContentTextInput
                  id="cpd-max-year"
                  type="number"
                  min={1}
                  value={rules.maxPerYear}
                  onChange={(event) =>
                    patchRules({
                      maxPerYear:
                        event.target.value === ''
                          ? ''
                          : clamp(Number(event.target.value) || 1, 1, 500),
                    })
                  }
                />
              </ContentField>
              <ContentField label={copy.rules.expiry} htmlFor="cpd-expiry" hint={copy.rules.expiryHint}>
                <ContentTextInput
                  id="cpd-expiry"
                  type="number"
                  min={1}
                  value={rules.expiry}
                  onChange={(event) =>
                    patchRules({
                      expiry:
                        event.target.value === ''
                          ? ''
                          : clamp(Number(event.target.value) || 1, 1, 120),
                    })
                  }
                />
              </ContentField>
              <ContentField label={copy.rules.minScore} htmlFor="cpd-min-score">
                <ContentTextInput
                  id="cpd-min-score"
                  type="number"
                  min={0}
                  max={100}
                  value={rules.minScore}
                  onChange={(event) =>
                    patchRules({
                      minScore:
                        event.target.value === ''
                          ? ''
                          : clamp(Number(event.target.value) || 0, 0, 100),
                    })
                  }
                />
              </ContentField>
            </div>
            <div className="mt-4 grid gap-3">
              <ContentToggle
                checked={rules.requireAssessment}
                onChange={(value) => patchRules({ requireAssessment: value })}
                label={copy.rules.requireAssessment}
                description={copy.rules.requireAssessmentHint}
              />
              <ContentToggle
                checked={rules.autoAward}
                onChange={(value) => patchRules({ autoAward: value })}
                label={copy.rules.autoAward}
                description={copy.rules.autoAwardHint}
              />
              <ContentToggle
                checked={rules.showOnCertificate}
                onChange={(value) => patchRules({ showOnCertificate: value })}
                label={copy.rules.showOnCertificate}
                description={copy.rules.showOnCertificateHint}
              />
            </div>
          </ContentCard>

          <ContentCard
            title={copy.accreditation.title}
            description={copy.accreditation.description}
            action={
              <button
                type="button"
                onClick={addAccreditor}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                {copy.accreditation.addAccreditor}
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {accreditors.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-xl border p-4 transition ${
                    item.enabled ? 'border-brand/30 bg-[#F7FAFF]' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          item.enabled ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <ShieldCheckIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-navy">{item.name}</h3>
                        <p className="text-xs text-slate-400">
                          {copy.accreditation.region}: {item.region}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.enabled}
                      aria-label={`${copy.accreditation.toggle}: ${item.name}`}
                      onClick={() => patchAccreditor(item.id, { enabled: !item.enabled })}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        item.enabled ? 'bg-brand' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          item.enabled ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3">
                    <ContentField label={copy.accreditation.code} htmlFor={`cpd-code-${item.id}`}>
                      <ContentTextInput
                        id={`cpd-code-${item.id}`}
                        value={item.code}
                        onChange={(event) => patchAccreditor(item.id, { code: event.target.value })}
                      />
                    </ContentField>
                    <ContentField label={copy.accreditation.hours} htmlFor={`cpd-hrs-${item.id}`}>
                      <ContentTextInput
                        id={`cpd-hrs-${item.id}`}
                        type="number"
                        min={0}
                        value={item.hoursPerYear}
                        onChange={(event) =>
                          patchAccreditor(item.id, {
                            hoursPerYear: Math.max(0, Number(event.target.value) || 0),
                          })
                        }
                      />
                    </ContentField>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <ContentBadge tone={item.enabled ? 'green' : 'slate'}>
                      {item.enabled ? copy.accreditation.enabled : copy.accreditation.disabled}
                    </ContentBadge>
                    <button
                      type="button"
                      aria-label={`${copy.accreditation.remove}: ${item.name}`}
                      title={copy.accreditation.remove}
                      onClick={() => removeAccreditor(item.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </ContentCard>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-bold text-navy">{copy.requirements.title}</h2>
                <p className="mt-0.5 text-xs text-slate-400">{copy.requirements.description}</p>
              </div>
              <label className="relative w-full lg:w-64">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.requirements.searchPlaceholder}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    <th className="px-6 py-3 font-semibold">{copy.requirements.columns.course}</th>
                    <th className="px-3 py-3 font-semibold">{copy.requirements.columns.accreditor}</th>
                    <th className="px-3 py-3 font-semibold">{copy.requirements.columns.hours}</th>
                    <th className="px-3 py-3 font-semibold">{copy.requirements.columns.score}</th>
                    <th className="px-3 py-3 font-semibold">{copy.requirements.columns.attendance}</th>
                    <th className="px-6 py-3 font-semibold">{copy.requirements.columns.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequirements.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-3">
                        <span className="block font-semibold text-navy">{item.course}</span>
                        <span className="block text-xs text-slate-400">{item.code}</span>
                      </td>
                      <td className="px-3 py-3">
                        <ContentSelect
                          aria-label={`Accreditor for ${item.course}`}
                          value={item.accreditorId}
                          onChange={(event) =>
                            patchRequirement(item.id, { accreditorId: event.target.value })
                          }
                          className="min-w-[10rem]"
                        >
                          {accreditors.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </ContentSelect>
                      </td>
                      <td className="px-3 py-3">
                        <ContentTextInput
                          aria-label={`CPD hours for ${item.course}`}
                          type="number"
                          min={0}
                          step={0.25}
                          value={item.hours}
                          className="w-20"
                          onChange={(event) =>
                            patchRequirement(item.id, {
                              hours: clamp(
                                Number(event.target.value) || 0,
                                0,
                                Number(rules.maxPerCourse) || 200,
                              ),
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        <ContentTextInput
                          aria-label={`Minimum score for ${item.course}`}
                          type="number"
                          min={0}
                          max={100}
                          value={item.minScore}
                          className="w-20"
                          onChange={(event) =>
                            patchRequirement(item.id, {
                              minScore: clamp(Number(event.target.value) || 0, 0, 100),
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        <ContentTextInput
                          aria-label={`Minimum attendance for ${item.course}`}
                          type="number"
                          min={0}
                          max={100}
                          value={item.minAttendance}
                          className="w-20"
                          onChange={(event) =>
                            patchRequirement(item.id, {
                              minAttendance: clamp(Number(event.target.value) || 0, 0, 100),
                            })
                          }
                        />
                      </td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => patchRequirement(item.id, { active: !item.active })}
                          aria-pressed={item.active}
                          aria-label={`Toggle CPD for ${item.course}`}
                        >
                          <ContentBadge tone={item.active ? 'green' : 'slate'}>
                            {item.active ? copy.requirements.active : copy.requirements.inactive}
                          </ContentBadge>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!filteredRequirements.length ? (
              <ContentEmptyState
                icon={<BookIcon className="h-6 w-6" />}
                title={copy.requirements.emptyTitle}
                body={copy.requirements.emptyBody}
              />
            ) : null}
          </section>
        </div>

        <aside className="self-start xl:sticky xl:top-6">
          <ContentCard title={copy.summary.title}>
            <dl className="space-y-3">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3 text-sm">
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="text-right font-semibold text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
              {enabledAccreditors.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm text-navy">
                  <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="truncate">{item.name}</span>
                </li>
              ))}
            </ul>
          </ContentCard>
        </aside>
      </div>
    </div>
  )
}
