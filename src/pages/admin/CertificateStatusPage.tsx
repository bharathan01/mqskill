import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  superAdminCertificateStatusKpis,
  superAdminCertificateStatusPageSize,
  superAdminCertificateStatusRows,
  superAdminCertificateStatusSubtitle,
  superAdminCertificatesExpiringNextMonths,
  superAdminCertificatesIssuedPerMonth,
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

export function AdminCertificateStatusPage() {
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All courses')
  const [status, setStatus] = useState('Any status')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const courses = useMemo(
    () => ['All courses', ...Array.from(new Set(superAdminCertificateStatusRows.map((row) => row.course)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminCertificateStatusRows.filter((row) => {
      if (course !== 'All courses' && row.course !== course) return false
      if (status !== 'Any status' && row.status !== status) return false
      if (!needle) return true
      return `${row.id} ${row.holder} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, query, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminCertificateStatusPageSize)
  const expiringCount = filtered.filter((row) => row.status === 'Expiring soon').length

  return (
    <div className="space-y-5">
      <CertPageHeader
        page="Valid / Expired Certificates"
        subtitle={superAdminCertificateStatusSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Certificate status list exported (sample).')} className={btnOutline}>
              Export
            </button>
            <button
              type="button"
              onClick={() =>
                setNotice(
                  expiringCount > 0
                    ? `Renewal reminder sent to ${expiringCount} certificate holders (sample).`
                    : 'No expiring certificates in the current view (sample).',
                )
              }
              className={btnPrimary}
            >
              Send renewal reminder
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <CertKpiGrid kpis={superAdminCertificateStatusKpis} />

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
                placeholder="Search certificate ID, holder or course"
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
              aria-label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>Any status</option>
              <option>Valid</option>
              <option>Expiring soon</option>
              <option>Expired</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Certificate ID</th>
                  <th className={thClass}>Holder</th>
                  <th className={thClass}>Course</th>
                  <th className={thClass}>Expiry</th>
                  <th className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.id}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.holder}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.expiry}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
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
            <h2 className="text-base font-bold text-navy">Certificates issued per month</h2>
            <p className="mt-0.5 text-sm text-slate-500">Last 12 months</p>
            <div className="mt-4">
              <CertBarChart items={superAdminCertificatesIssuedPerMonth} color="#102A4C" />
            </div>
          </section>
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Certificates expiring in each of the next 6 months</h2>
            <p className="mt-0.5 text-sm text-slate-500">Renewal reminders go out 60 days before expiry</p>
            <div className="mt-4">
              <CertBarChart items={superAdminCertificatesExpiringNextMonths} color="#F59E0B" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
