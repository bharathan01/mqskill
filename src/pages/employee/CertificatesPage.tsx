import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  employeeCertificatePath,
  employeeCertificates,
  employeeCertificatesPage,
  employeeCertificateStats,
  type EmployeeCertificateStatus,
} from '@/constants'
import { AwardIcon, CalendarIcon, DownloadIcon, SearchIcon } from '@/components/ui'

const copy = employeeCertificatesPage

type FilterId = 'all' | EmployeeCertificateStatus

function statusStyles(status: EmployeeCertificateStatus) {
  if (status === 'valid') return 'bg-emerald-50 text-emerald-700'
  if (status === 'expiring') return 'bg-amber-50 text-amber-700'
  return 'bg-slate-100 text-slate-500'
}

export function EmployeeCertificatesPage() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return employeeCertificates.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false
      if (!needle) return true
      return (
        item.courseTitle.toLowerCase().includes(needle) ||
        item.credentialId.toLowerCase().includes(needle)
      )
    })
  }, [filter, query])

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.subtitle}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: copy.stats.earned, value: employeeCertificateStats.earned },
          { label: copy.stats.cpd, value: employeeCertificateStats.cpdHours },
          { label: copy.stats.valid, value: employeeCertificateStats.valid },
          { label: copy.stats.expiring, value: employeeCertificateStats.expiring },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search certificates…"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(copy.filters) as FilterId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                filter === id
                  ? 'bg-brand text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {copy.filters[id]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          {copy.empty}
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((certificate) => (
            <li key={certificate.id}>
              <Link
                to={employeeCertificatePath(certificate.id)}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)] transition hover:border-brand/30"
              >
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#0F284F] to-[#004EA8] p-5">
                  <AwardIcon className="h-12 w-12 text-white/90" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles(certificate.status)}`}
                    >
                      {copy.status[certificate.status]}
                    </span>
                    {certificate.accredited ? (
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand">
                        {copy.accredited}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-base font-bold text-navy">{certificate.courseTitle}</h2>
                  <p className="mt-2 text-xs text-slate-500">
                    {copy.hours(certificate.cpdHours)} · Score {certificate.finalScore}%
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {copy.issued} {certificate.issuedOn}
                    </p>
                    <p>
                      {copy.expires} {certificate.validUntil}
                    </p>
                    <p className="font-mono text-[11px]">{certificate.credentialId}</p>
                  </div>
                  <span className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700">
                    <DownloadIcon className="h-4 w-4" />
                    {copy.view}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-slate-500">
        {copy.showing} {filtered.length} {copy.of} {employeeCertificates.length} {copy.certificates}
      </p>
    </div>
  )
}
