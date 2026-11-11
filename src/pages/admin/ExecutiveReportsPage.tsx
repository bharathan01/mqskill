import { useState } from 'react'
import { ContentSelect } from '@/components/common'
import {
  formatReportsDate,
  superAdminExecutiveAudiences,
  superAdminExecutivePackTypes,
  superAdminExecutivePacks,
  superAdminExecutivePeriods,
  superAdminExecutiveStatuses,
  superAdminReportsToday,
  type SuperAdminExecutiveAudience,
  type SuperAdminExecutivePack,
  type SuperAdminReportsKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  ReportsBarChart,
  ReportsChartCard,
  ReportsFilterSelect,
  ReportsHBars,
  ReportsLayout,
  ReportsNote,
  ReportsPageShell,
  ReportsPager,
  ReportsSearch,
  ReportsTable,
  cellClass,
  firstCellClass,
  linkAction,
  toolbarClass,
  trClass,
  updateById,
  useReportList,
} from './reportsShared'

export function AdminExecutiveReportsPage() {
  const [rows, setRows] = useState<SuperAdminExecutivePack[]>(superAdminExecutivePacks)
  const [creating, setCreating] = useState(false)
  const [type, setType] = useState<string>(superAdminExecutivePackTypes[0])
  const [period, setPeriod] = useState<string>(superAdminExecutivePeriods[0])
  const [audience, setAudience] = useState<SuperAdminExecutiveAudience>('Board')

  const list = useReportList(rows, (row) => `${row.report} ${row.period} ${row.preparedBy}`, [
    { key: 'status', test: (row, value) => row.status === value },
    { key: 'audience', test: (row, value) => row.audience === value },
  ])
  const { setNotice } = list

  const added = rows.length - superAdminExecutivePacks.length
  const scheduledDelta =
    rows.filter((row) => row.status === 'Scheduled').length -
    superAdminExecutivePacks.filter((row) => row.status === 'Scheduled').length
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'packs', label: 'Packs generated (YTD)', value: String(41 + added), detail: 'Since January 2026' },
    { id: 'scheduled', label: 'Scheduled', value: String(6 + scheduledDelta), detail: 'Next run 12 Nov 2026' },
    { id: 'ready', label: 'Ready', value: String(rows.filter((row) => row.status === 'Ready').length), detail: 'Available to download' },
  ]

  const byAudience = superAdminExecutiveAudiences.map((item) => ({
    label: item,
    value: rows.filter((row) => row.audience === item).length,
  }))

  const generate = () => {
    setRows((current) => [
      {
        id: `ex${current.length + 1}`,
        report: type,
        period,
        audience,
        preparedBy: 'Super Admin',
        generated: superAdminReportsToday,
        status: 'Draft',
      },
      ...current,
    ])
    setCreating(false)
    list.setPage(1)
    setNotice(`${type} (${period}) generated for ${audience} and added as a draft (sample).`)
  }

  return (
    <ReportsPageShell
      page="Executive Reports"
      subtitle="Board and management report packs generated from live platform data."
      exportNotice="Executive report packs exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
      actions={
        <button type="button" onClick={() => setCreating((open) => !open)} className={btnPrimary}>
          Generate pack
        </button>
      }
      topSlot={
        creating ? (
          <section className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
            <label className="block flex-1 text-sm font-semibold text-navy">
              Report pack
              <ContentSelect value={type} onChange={(event) => setType(event.target.value)} className="mt-1.5">
                {superAdminExecutivePackTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <label className="block text-sm font-semibold text-navy lg:w-44">
              Period
              <ContentSelect value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-1.5">
                {superAdminExecutivePeriods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <label className="block text-sm font-semibold text-navy lg:w-44">
              Audience
              <ContentSelect
                value={audience}
                onChange={(event) => setAudience(event.target.value as SuperAdminExecutiveAudience)}
                className="mt-1.5"
              >
                {superAdminExecutiveAudiences.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <div className="flex gap-2.5">
              <button type="button" onClick={generate} className={btnPrimary}>
                Generate
              </button>
              <button type="button" onClick={() => setCreating(false)} className={btnOutline}>
                Cancel
              </button>
            </div>
          </section>
        ) : null
      }
    >
      <ReportsLayout
        charts={
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportsChartCard title="Packs by audience" subtitle="Current list">
              <ReportsBarChart items={byAudience} heightClass="h-56" />
            </ReportsChartCard>
            <ReportsChartCard title="Packs by status" subtitle="Ready, scheduled and draft">
              <ReportsHBars
                items={superAdminExecutiveStatuses.map((item) => ({
                  label: item,
                  value: rows.filter((row) => row.status === item).length,
                }))}
                format={(value) => `${value} packs`}
              />
            </ReportsChartCard>
          </div>
        }
        rail={
          <ReportsNote tone="blue">
            Draft and scheduled packs can be marked ready once the underlying data is final (sample).
          </ReportsNote>
        }
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search report pack or period" />
          <ReportsFilterSelect label="Status" value={list.filter('status')} options={superAdminExecutiveStatuses} onChange={(v) => list.setFilter('status', v)} />
          <ReportsFilterSelect label="Audience" value={list.filter('audience')} options={superAdminExecutiveAudiences} onChange={(v) => list.setFilter('audience', v)} />
        </div>
        <ReportsTable
          columns={[
            { label: 'Report pack' },
            { label: 'Period' },
            { label: 'Audience' },
            { label: 'Prepared by' },
            { label: 'Generated' },
            { label: 'Status' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No report packs match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.report}</td>
              <td className={cellClass}>{row.period}</td>
              <td className={cellClass}>{row.audience}</td>
              <td className={cellClass}>{row.preparedBy}</td>
              <td className={cellClass}>{formatReportsDate(row.generated)}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.status} />
              </td>
              <td className="px-3 py-3.5 text-right">
                {row.status === 'Ready' ? (
                  <button type="button" onClick={() => setNotice(`${row.report} (${row.period}) downloaded as PDF (sample).`)} className={linkAction}>
                    Download
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRows((current) => updateById(current, row.id, { status: 'Ready' }))
                      setNotice(`${row.report} (${row.period}) marked ready (sample).`)
                    }}
                    className={linkAction}
                  >
                    Mark ready
                  </button>
                )}
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="report packs" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
