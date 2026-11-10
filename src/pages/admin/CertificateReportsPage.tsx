import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  superAdminCertificateReportJobs,
  superAdminCertificateReportsKpis,
  superAdminCertificateReportsPageSize,
  superAdminCertificateReportsSubtitle,
  superAdminCertificatesExpiringNextMonths,
  superAdminCertificatesIssuedPerMonth,
  type SuperAdminReportJob,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  CertBarChart,
  CertKpiGrid,
  CertPageHeader,
  CertPager,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './certificateShared'

export function AdminCertificateReportsPage() {
  const [jobs, setJobs] = useState<SuperAdminReportJob[]>(superAdminCertificateReportJobs)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Any status')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return jobs.filter((row) => {
      if (status !== 'Any status' && row.status !== status) return false
      if (!needle) return true
      return `${row.name} ${row.scope} ${row.requestedBy}`.toLowerCase().includes(needle)
    })
  }, [jobs, query, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminCertificateReportsPageSize)

  const generate = () => {
    setJobs((current) => [
      {
        id: `j-${Date.now()}`,
        name: 'Certificates issued, expired and verified',
        scope: 'Last 30 days · all courses',
        format: 'XLSX',
        requestedBy: 'Super Admin',
        generated: '10 Nov 2026',
        status: 'Generating',
      },
      ...current,
    ])
    setPage(1)
    setNotice('Report is being generated and will appear as Ready shortly (sample).')
  }

  return (
    <div className="space-y-5">
      <CertPageHeader
        page="Certificate Reports"
        subtitle={superAdminCertificateReportsSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Report list exported (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={generate} className={btnPrimary}>
              Generate report
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <CertKpiGrid kpis={superAdminCertificateReportsKpis} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Certificates issued per month</h2>
          <p className="mt-0.5 text-sm text-slate-500">Last 12 months · all courses</p>
          <div className="mt-4">
            <CertBarChart items={superAdminCertificatesIssuedPerMonth} color="#102A4C" />
          </div>
        </section>
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Certificates expiring in each of the next 6 months</h2>
          <p className="mt-0.5 text-sm text-slate-500">Valid certificates reaching their expiry date</p>
          <div className="mt-4">
            <CertBarChart items={superAdminCertificatesExpiringNextMonths} color="#F59E0B" />
          </div>
        </section>
      </div>

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
              placeholder="Search report, scope or requester"
              className="!h-10 !pl-9"
            />
          </label>
          <ContentSelect
            aria-label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            className="!h-10 lg:max-w-[10rem]"
          >
            <option>Any status</option>
            <option>Ready</option>
            <option>Scheduled</option>
            <option>Generating</option>
          </ContentSelect>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className={theadRowClass}>
                <th className="px-4 py-2.5 font-semibold">Report</th>
                <th className={thClass}>Format</th>
                <th className={thClass}>Requested by</th>
                <th className={thClass}>Generated</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className={trClass}>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-navy">{row.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{row.scope}</p>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.format}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.requestedBy}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.generated}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <button
                      type="button"
                      disabled={row.status !== 'Ready'}
                      onClick={() => setNotice(`${row.name} downloaded as ${row.format} (sample).`)}
                      className="text-sm font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No reports match these filters.
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
          noun="reports"
          onPage={setPage}
        />
      </section>
    </div>
  )
}
