import { useMemo, useState } from 'react'
import {
  studentLanguageDefaults,
  studentLanguagePage as copy,
  studentLanguages,
} from '@/constants/studentLanguage'
import {
  CaptionsIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  DownloadIcon,
  GearIcon,
  GlobeIcon,
  SearchIcon,
  SparkleIcon,
} from '@/components/ui'

type Prefs = typeof studentLanguageDefaults

const selectClass =
  'h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-navy outline-none'

export function StudentLanguagePage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<(typeof copy.tabs)[number]['id']>('all')
  const [prefs, setPrefs] = useState<Prefs>(studentLanguageDefaults)
  const [applied, setApplied] = useState(false)

  const selected = studentLanguages.find((item) => item.id === prefs.language) ?? studentLanguages[0]

  const languages = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return studentLanguages.filter((item) => {
      const matchQuery =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.region.toLowerCase().includes(needle) ||
        item.code.toLowerCase().includes(needle) ||
        item.token.toLowerCase().includes(needle)
      const matchTab =
        tab === 'all' || (tab === 'verified' && item.verified) || (tab === 'captions' && item.captions)
      return matchQuery && matchTab
    })
  }, [query, tab])

  function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((current) => ({ ...current, [key]: value }))
    setApplied(false)
  }

  function handleSave() {
    setApplied(true)
  }

  function handleReset() {
    setPrefs(studentLanguageDefaults)
    setApplied(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-semibold tracking-wide text-slate-500">{copy.locId}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
            {copy.engine}
          </span>
          <span>•</span>
          <span>{copy.fallback}</span>
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          {copy.pack}
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
            <SparkleIcon className="h-3.5 w-3.5" />
            {copy.kicker}
          </p>
          <h1 className="mt-2 font-hero text-3xl font-bold text-navy sm:text-4xl">{copy.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-sm font-extrabold text-emerald-600">
            {selected.code}
          </span>
          <p className="text-[11px] leading-4 text-slate-400">
            <span className="block font-semibold tracking-wide uppercase">{copy.tokenLabel}</span>
            <span className="font-medium text-navy">{selected.token}</span>
          </p>
        </div>
      </div>

      <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
          <GlobeIcon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-navy">{copy.featuredTitle}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              {copy.featuredBadge}
            </span>
            <span className="text-[11px] font-medium text-slate-400">{copy.featuredTag}</span>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{copy.featuredBody}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          <p className="text-right text-xs font-semibold text-emerald-600">
            {copy.featuredCoverage}
            <span className="mt-0.5 block font-medium text-slate-400">{copy.featuredVerified}</span>
          </p>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircleIcon className="h-5 w-5" />
          </span>
        </div>
      </article>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <section>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {copy.tabs.map((item) => {
                const active = tab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      active ? 'bg-navy text-white' : 'bg-white text-slate-500 shadow-sm'
                    }`}
                  >
                    {item.label}
                    {item.id === 'all' ? ` (${studentLanguages.length})` : null}
                  </button>
                )
              })}
            </div>
          </div>

          {languages.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-400">
              {copy.empty}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {languages.map((item) => {
                const active = prefs.language === item.id
                const complete = item.coverage === 100
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPref('language', item.id)}
                    className={`rounded-2xl border bg-white p-4 text-left shadow-sm ${
                      active ? 'border-2 border-brand' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold ${
                            active ? 'bg-brand text-white' : 'bg-[#EEF3FB] text-slate-500'
                          }`}
                        >
                          {item.code}
                        </span>
                        <span>
                          <span className="flex items-center gap-2">
                            <span className="block text-sm font-bold text-navy">{item.name}</span>
                            {item.rtl ? (
                              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase">
                                {copy.rtlReady}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-xs text-slate-400">{item.region}</span>
                        </span>
                      </div>
                      {active ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                          <CheckIcon className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="h-6 w-6 rounded-full bg-[#EEF3FB]" />
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                      <span className={`font-semibold ${complete ? 'text-emerald-600' : 'text-brand'}`}>
                        <span
                          className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                            complete ? 'bg-emerald-500' : 'bg-brand'
                          }`}
                        />
                        {item.coverage}% {copy.coverageSuffix}
                      </span>
                      <span className={complete ? 'font-medium text-slate-400' : 'font-semibold text-slate-400'}>
                        {item.official ? copy.official : `${item.coverage}%`}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${complete ? 'bg-emerald-500' : 'bg-brand'}`}
                        style={{ width: `${item.coverage}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
              <GearIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-navy">{copy.regionalTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">{copy.regionalSubtitle}</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.dateLabel}</span>
              <span className="relative block">
                <select
                  value={prefs.dateFormat}
                  onChange={(event) => setPref('dateFormat', event.target.value)}
                  className={selectClass}
                >
                  {copy.dateFormats.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
              <span className="mt-1.5 block text-xs leading-5 text-slate-400">{copy.dateHint}</span>
            </label>

            <div>
              <p className="mb-2 text-sm font-semibold text-navy">{copy.timeLabel}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPref('timeFormat', '12')}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${
                    prefs.timeFormat === '12'
                      ? 'bg-brand/10 text-brand'
                      : 'border border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  <ClockIcon className="h-4 w-4" />
                  {copy.time12}
                </button>
                <button
                  type="button"
                  onClick={() => setPref('timeFormat', '24')}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${
                    prefs.timeFormat === '24'
                      ? 'bg-brand/10 text-brand'
                      : 'border border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  <ClockIcon className="h-4 w-4" />
                  {copy.time24}
                </button>
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.zoneLabel}</span>
              <span className="relative block">
                <select
                  value={prefs.timezone}
                  onChange={(event) => setPref('timezone', event.target.value)}
                  className={selectClass}
                >
                  {copy.timezones.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
              <span className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {copy.serverLabel}{' '}
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {copy.serverStatus}
                  </span>
                </span>
                <span className="rounded-md bg-[#EEF3FB] px-2 py-0.5 font-medium text-slate-500">
                  {copy.serverTime}
                </span>
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.captionsLabel}</span>
              <span className="relative block">
                <CaptionsIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={prefs.captions}
                  onChange={(event) => setPref('captions', event.target.value)}
                  className={`${selectClass} pl-10`}
                >
                  {copy.captionOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
              <span className="mt-1.5 block text-xs leading-5 text-slate-400">{copy.captionsHint}</span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.currencyLabel}</span>
              <span className="relative block">
                <select
                  value={prefs.currency}
                  onChange={(event) => setPref('currency', event.target.value)}
                  className={selectClass}
                >
                  {copy.currencies.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white"
          >
            <CheckIcon className="h-4 w-4" />
            {applied ? copy.saved : copy.save}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 inline-flex h-10 w-full items-center justify-center text-sm font-medium text-slate-400"
          >
            {copy.reset}
          </button>
        </aside>
      </div>
    </div>
  )
}
