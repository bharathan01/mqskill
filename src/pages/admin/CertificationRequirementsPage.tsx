import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  superAdminRequirementRows,
  superAdminRequirementsKpis,
  superAdminRequirementsPageSize,
  superAdminRequirementsSubtitle,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { CertKpiGrid, CertPageHeader, CertPager, paginate, theadRowClass, thClass, trClass } from './certificateShared'

export function AdminCertificationRequirementsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Any status')
  const [validity, setValidity] = useState('Any validity')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const validities = useMemo(
    () => ['Any validity', ...Array.from(new Set(superAdminRequirementRows.map((row) => row.validity)))],
    [],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return superAdminRequirementRows.filter((row) => {
      if (status !== 'Any status' && row.status !== status) return false
      if (validity !== 'Any validity' && row.validity !== validity) return false
      if (!needle) return true
      return row.course.toLowerCase().includes(needle)
    })
  }, [query, status, validity])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminRequirementsPageSize)

  return (
    <div className="space-y-5">
      <CertPageHeader
        page="Certification Requirements"
        subtitle={superAdminRequirementsSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Requirements exported (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('New requirement saved as a draft (sample).')} className={btnPrimary}>
              Add requirement
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <CertKpiGrid kpis={superAdminRequirementsKpis} />

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
              placeholder="Search course"
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
            <option>Default</option>
            <option>Custom</option>
            <option>Draft</option>
          </ContentSelect>
          <ContentSelect
            aria-label="Validity"
            value={validity}
            onChange={(event) => {
              setValidity(event.target.value)
              setPage(1)
            }}
            className="!h-10 lg:max-w-[11rem]"
          >
            {validities.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </ContentSelect>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-left">
            <thead>
              <tr className={theadRowClass}>
                <th className="px-4 py-2.5 font-semibold">Course</th>
                <th className={`${thClass} text-right`}>Min. score</th>
                <th className={`${thClass} text-right`}>Min. progress</th>
                <th className={thClass}>Final assessment</th>
                <th className={thClass}>Validity</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className={trClass}>
                  <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.course}</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.minScore}%</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.minProgress}%</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.finalAssessment}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.validity}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge value={row.status} />
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No requirements match these filters.
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
          noun="rule sets"
          onPage={setPage}
        />
      </section>
    </div>
  )
}
