import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { InfoIcon, SearchIcon } from '@/components/ui'
import {
  superAdminIssuedCertificates,
  superAdminVerificationChecks,
  superAdminVerificationKpis,
  superAdminVerificationPageSize,
  superAdminVerificationSubtitle,
  type SuperAdminVerificationCheck,
  type SuperAdminVerificationResult,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { CertKpiGrid, CertPageHeader, CertPager, paginate, theadRowClass, thClass, trClass } from './certificateShared'

type Lookup = {
  code: string
  result: SuperAdminVerificationResult
  detail: string
}

export function AdminCertificateVerificationPage() {
  const [checks, setChecks] = useState<SuperAdminVerificationCheck[]>(superAdminVerificationChecks)
  const [code, setCode] = useState('')
  const [lookup, setLookup] = useState<Lookup | null>(null)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('Any result')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return checks.filter((row) => {
      if (result !== 'Any result' && row.result !== result) return false
      if (!needle) return true
      return `${row.code} ${row.certificate} ${row.holder} ${row.requestedBy}`.toLowerCase().includes(needle)
    })
  }, [checks, query, result])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminVerificationPageSize)

  const verify = () => {
    const value = code.trim().toUpperCase()
    if (!value) {
      setNotice('Enter a verification code first, for example MQ-CERT-48201.')
      return
    }
    const cert = superAdminIssuedCertificates.find((item) => item.id === value)
    const outcome: SuperAdminVerificationResult = !cert ? 'Not found' : cert.status === 'Expired' ? 'Expired' : 'Verified'
    const detail = !cert
      ? 'No certificate on record with this code.'
      : `${cert.learner} · ${cert.course} · ${outcome === 'Expired' ? 'expired' : 'valid until'} ${cert.expiry}`
    setLookup({ code: value, result: outcome, detail })
    setChecks((current) => [
      {
        id: `v-${Date.now()}`,
        code: value,
        certificate: cert?.course ?? '—',
        holder: cert?.learner ?? '—',
        requestedBy: 'Super Admin',
        result: outcome,
        date: '10 Nov 2026 · now',
      },
      ...current,
    ])
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <CertPageHeader
        page="Certificate Verification"
        subtitle={superAdminVerificationSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Verification log exported (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={verify} className={btnPrimary}>
              Verify certificate
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <CertKpiGrid kpis={superAdminVerificationKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ContentTextInput
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search code, holder or certificate"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Result"
              value={result}
              onChange={(event) => {
                setResult(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>Any result</option>
              <option>Verified</option>
              <option>Expired</option>
              <option>Not found</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Verification code</th>
                  <th className={thClass}>Certificate</th>
                  <th className={thClass}>Holder</th>
                  <th className={thClass}>Requested by</th>
                  <th className={thClass}>Result</th>
                  <th className={thClass}>Date</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.code}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.certificate}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.holder}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.requestedBy}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.result} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.date}</td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      No checks match these filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <CertPager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="checks"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Verify a certificate</h2>
            <p className="mt-0.5 text-sm text-slate-500">Enter the code printed on the certificate.</p>
            <ContentTextInput
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') verify()
              }}
              placeholder="MQ-CERT-48201"
              aria-label="Verification code"
              className="mt-4 !h-10"
            />
            <button type="button" onClick={verify} className={`${btnPrimary} mt-3 w-full`}>
              Verify certificate
            </button>
            {lookup ? (
              <div
                className={`mt-4 rounded-lg border p-3 ${
                  lookup.result === 'Verified'
                    ? 'border-emerald-100 bg-emerald-50/50'
                    : lookup.result === 'Expired'
                      ? 'border-amber-100 bg-amber-50/50'
                      : 'border-rose-100 bg-rose-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy">{lookup.code}</p>
                  <StatusBadge value={lookup.result} />
                </div>
                <p className="mt-1 text-xs text-slate-600">{lookup.detail}</p>
              </div>
            ) : null}
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Employers and regulators can also verify codes on the public verification page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
