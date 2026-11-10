import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  superAdminLiveAttendanceByWeek,
  superAdminLiveReportJobs,
  superAdminLiveReportsKpis,
  superAdminLiveReportsPageSize,
  superAdminLiveReportsSubtitle,
  superAdminLiveSessionsByWeek,
  type SuperAdminLiveReportJob,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  linkAction,
  LiveBarChart,
  LiveEmptyRow,
  LiveKpiGrid,
  LivePageHeader,
  LivePager,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './liveShared'

export function AdminLiveClassReportsPage() {
  const [jobs, setJobs] = useState<SuperAdminLiveReportJob[]>(superAdminLiveReportJobs)
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

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminLiveReportsPageSize)

  const generate = () => {
    setJobs((current) => [
      {
        id: `lr-${Date.now()}`,
        name: 'Live class delivery and attendance summary',
        scope: 'Last 30 days · all instructors',
        format: 'PDF',
        requestedBy: 'Super Admin',
        generated: '10 Nov 2026',
        status: 'Generating',
      },
      ...current,
    ])
    setPage(1)
    setNotice('Live class report queued — it will appear as Ready shortly (sample).')
  }

  const finish = (row: SuperAdminLiveReportJob) => {
    setJobs((current) => current.map((item) => (item.id === row.id ? { ...item, status: 'Ready' } : item)))
    setNotice(`${row.name} is ready to download (sample).`)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="Live Class Reports"
        subtitle={superAdminLiveReportsSubtitle}
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

      <LiveKpiGrid kpis={superAdminLiveReportsKpis} className="sm:grid-cols-2 xl:grid-cols-4" />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Sessions by week</h2>
          <p className="mt-0.5 text-sm text-slate-500">Last 12 weeks · all courses</p>
          <div className="mt-4">
            <LiveBarChart items={superAdminLiveSessionsByWeek} color="#102A4C" />
          </div>
        </section>
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Average attendance by week</h2>
          <p className="mt-0.5 text-sm text-slate-500">Share of registered learners who joined</p>
          <div className="mt-4">
            <LiveBarChart items={superAdminLiveAttendanceByWeek} color="#2563EB" suffix="%" />
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
                    {row.status === 'Generating' ? (
                      <button type="button" onClick={() => finish(row)} className={linkAction}>
                        Mark ready
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={row.status !== 'Ready'}
                        onClick={() => setNotice(`${row.name} downloaded as ${row.format} (sample).`)}
                        className={linkAction}
                      >
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? <LiveEmptyRow colSpan={6}>No reports match these filters.</LiveEmptyRow> : null}
            </tbody>
          </table>
        </div>
        <LivePager
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
