import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { CheckCircleIcon, DownloadIcon, SearchIcon, ShieldCheckIcon } from '@/components/ui'
import {
  superAdminIssuedCertificates,
  superAdminIssuedKpis,
  superAdminIssuedPageSize,
  superAdminIssuedSubtitle,
  superAdminIssuedTabs,
  type SuperAdminIssuedTabId,
  type SuperAdminVerificationResult,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { CertKpiGrid, CertPageHeader, CertPager, paginate, theadRowClass, thClass, trClass } from './certificateShared'

export function AdminIssuedCertificatesPage() {
  const [tab, setTab] = useState<SuperAdminIssuedTabId>('all')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All courses')
  const [type, setType] = useState('All types')
  const [learner, setLearner] = useState('Learner: any')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [lookup, setLookup] = useState<{
    code: string
    result: SuperAdminVerificationResult
    learner: string
    course: string
    expiry: string
  } | null>(null)

  const courses = useMemo(
    () => ['All courses', ...Array.from(new Set(superAdminIssuedCertificates.map((row) => row.course)))],
    [],
  )

  const latest = superAdminIssuedCertificates[0]

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminIssuedCertificates.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (course !== 'All courses' && row.course !== course) return false
      if (type !== 'All types' && row.type !== type) return false
      if (learner !== 'Learner: any' && `Learner: ${row.learnerType}` !== learner) return false
      if (!needle) return true
      return `${row.id} ${row.learner} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, learner, query, tab, type])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminIssuedPageSize)

  const runVerify = () => {
    const value = verifyCode.trim().toUpperCase()
    if (!value) {
      setNotice('Enter a certificate ID to verify, for example MQ-CERT-48201.')
      return
    }
    const cert = superAdminIssuedCertificates.find((item) => item.id === value)
    if (!cert) {
      setLookup({ code: value, result: 'Not found', learner: '—', course: '—', expiry: '—' })
      return
    }
    setLookup({
      code: value,
      result: cert.status === 'Expired' ? 'Expired' : 'Verified',
      learner: cert.learner,
      course: `${cert.course} · ${cert.version}`,
      expiry: cert.expiry,
    })
  }

  return (
    <div className="space-y-5">
      <CertPageHeader
        page="All Issued Certificates"
        subtitle={superAdminIssuedSubtitle}
        actions={
          <>
            <Link to={paths.admin.certificateTemplates} className={btnOutline}>
              Certificate templates
            </Link>
            <button type="button" onClick={() => setNotice('Issued certificates exported as CSV (sample).')} className={btnOutline}>
              Export CSV
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <CertKpiGrid kpis={superAdminIssuedKpis} className="sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3.5 pt-2">
            {superAdminIssuedTabs.map((item) => {
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id)
                    setPage(1)
                  }}
                  className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'border-brand text-navy' : 'border-transparent text-slate-500 hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ContentTextInput
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search certificate ID, learner or course"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Course"
              value={course}
              onChange={(event) => {
                setCourse(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[13rem]"
            >
              {courses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
            <ContentSelect
              aria-label="Type"
              value={type}
              onChange={(event) => {
                setType(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>All types</option>
              <option>Completion</option>
              <option>CPD</option>
            </ContentSelect>
            <ContentSelect
              aria-label="Learner"
              value={learner}
              onChange={(event) => {
                setLearner(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[11rem]"
            >
              <option>Learner: any</option>
              <option>Learner: Individual</option>
              <option>Learner: Organization</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Certificate ID</th>
                  <th className={thClass}>Learner</th>
                  <th className={thClass}>Course · version</th>
                  <th className={`${thClass} text-right`}>CPD h</th>
                  <th className={thClass}>Issued · valid to</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}> </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-brand">{row.id}</td>
                    <td className="px-3 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.learner}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {row.learnerType === 'Organization' ? row.org : 'Individual'}
                      </p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">
                      {row.course}
                      <span className="text-slate-400"> · {row.version}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                      {row.cpdHours > 0 ? row.cpdHours : '—'}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">
                      {row.issued}
                      <span className="text-slate-400"> → {row.expiry}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <button
                        type="button"
                        aria-label={`Download ${row.id}`}
                        onClick={() => setNotice(`Certificate ${row.id} downloaded (sample).`)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-navy"
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                      No certificates match these filters.
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
            noun="certificates"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <div className="flex items-start gap-2">
              <ShieldCheckIcon className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <h2 className="text-base font-bold text-navy">Certificate verification</h2>
                <p className="mt-0.5 text-sm text-slate-500">Check any certificate ID or QR code</p>
              </div>
            </div>
            <ContentTextInput
              value={verifyCode}
              onChange={(event) => setVerifyCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') runVerify()
              }}
              placeholder="MQ-CERT-48201"
              aria-label="Certificate ID"
              className="mt-4 !h-10"
            />
            <button type="button" onClick={runVerify} className={`${btnPrimary} mt-3 w-full`}>
              Verify
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
                  <StatusBadge value={lookup.result === 'Verified' ? 'Valid' : lookup.result} />
                </div>
                <p className="mt-1 text-xs text-slate-600">{lookup.learner}</p>
                <p className="mt-0.5 text-xs text-slate-500">{lookup.course}</p>
                {lookup.result !== 'Not found' ? (
                  <p className="mt-0.5 text-xs text-slate-400">Valid to {lookup.expiry}</p>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-navy">Latest certificate</h2>
                <p className="mt-0.5 text-sm text-slate-500">Most recently issued</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-sm font-semibold text-navy">{latest.learner}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {latest.course} · {latest.version}
              </p>
              <p className="mt-2 text-xs font-semibold text-brand">{latest.id}</p>
              <p className="mt-1 text-xs text-slate-400">
                Issued {latest.issued} · valid to {latest.expiry}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
