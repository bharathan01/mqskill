import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { InfoIcon, SearchIcon } from '@/components/ui'
import {
  superAdminCpdByBody,
  superAdminCpdKpis,
  superAdminCpdPageSize,
  superAdminCpdRows,
  superAdminCpdSubtitle,
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

export function AdminCpdHoursPage() {
  const [query, setQuery] = useState('')
  const [body, setBody] = useState('All accrediting bodies')
  const [status, setStatus] = useState('Any status')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const bodies = useMemo(
    () => ['All accrediting bodies', ...Array.from(new Set(superAdminCpdRows.map((row) => row.body)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminCpdRows.filter((row) => {
      if (body !== 'All accrediting bodies' && row.body !== body) return false
      if (status !== 'Any status' && row.status !== status) return false
      if (!needle) return true
      return `${row.course} ${row.body}`.toLowerCase().includes(needle)
    })
  }, [body, query, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminCpdPageSize)

  return (
    <div className="space-y-5">
      <CertPageHeader
        page="CPD Hours and Credits"
        subtitle={superAdminCpdSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('CPD hours exported (sample).')} className={btnOutline}>
              Export
            </button>
            <button
              type="button"
              onClick={() => setNotice('CPD mapping created as a draft for Content Admin review (sample).')}
              className={btnPrimary}
            >
              Add CPD mapping
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <CertKpiGrid kpis={superAdminCpdKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
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
                placeholder="Search course or accrediting body"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect
              aria-label="Accrediting body"
              value={body}
              onChange={(event) => {
                setBody(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[14rem]"
            >
              {bodies.map((item) => (
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
              <option>Approved</option>
              <option>Pending</option>
              <option>Expired</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Course</th>
                  <th className={`${thClass} text-right`}>CPD hours</th>
                  <th className={thClass}>Accrediting body</th>
                  <th className={thClass}>Credits</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Renewal date</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.hours}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.body}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.credits}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.renewal}</td>
                  </tr>
                ))}
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      No CPD mappings match these filters.
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
            noun="courses"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Hours awarded by accrediting body</h2>
            <p className="mt-0.5 text-sm text-slate-500">This period</p>
            <div className="mt-4">
              <CertBarChart items={superAdminCpdByBody} color="#2563EB" />
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Content Admins configure CPD hours per course. You monitor what is awarded.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
