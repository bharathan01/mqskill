import { useState } from 'react'
import { ContentSelect } from '@/components/common'
import {
  formatReportsDate,
  formatReportsSize,
  superAdminReportExportFormats,
  superAdminExportReports,
  superAdminExportStatuses,
  superAdminReportExports,
  superAdminReportsToday,
  type SuperAdminExportFormat,
  type SuperAdminReportExport,
  type SuperAdminReportsKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  ReportsBarChart,
  ReportsChartCard,
  ReportsFilterSelect,
  ReportsLayout,
  ReportsNote,
  ReportsPageShell,
  ReportsPager,
  ReportsSearch,
  ReportsTable,
  cellClass,
  firstCellClass,
  linkAction,
  numCellClass,
  toolbarClass,
  trClass,
  updateById,
  useReportList,
} from './reportsShared'

export function AdminReportExportsPage() {
  const [rows, setRows] = useState<SuperAdminReportExport[]>(superAdminReportExports)
  const [creating, setCreating] = useState(false)
  const [report, setReport] = useState<string>(superAdminExportReports[0])
  const [format, setFormat] = useState<SuperAdminExportFormat>('PDF')

  const list = useReportList(rows, (row) => `${row.report} ${row.requestedBy}`, [
    { key: 'status', test: (row, value) => row.status === value },
    { key: 'format', test: (row, value) => row.format === value },
  ])
  const { setNotice } = list

  const largest = rows.reduce((max, row) => Math.max(max, row.sizeKb), 0)
  const kpis: SuperAdminReportsKpi[] = [
    { id: 'exports', label: 'Exports (30d)', value: String(58 + rows.length - superAdminReportExports.length), detail: 'PDF, XLSX and CSV' },
    { id: 'largest', label: 'Largest export', value: formatReportsSize(largest), detail: 'Student Growth workbook' },
    { id: 'ready', label: 'Ready', value: String(rows.filter((row) => row.status === 'Ready').length), detail: 'Available to download' },
  ]

  const create = () => {
    setRows((current) => [
      {
        id: `e${current.length + 1}`,
        report,
        format,
        requestedBy: 'Super Admin',
        sizeKb: format === 'CSV' ? 240 : format === 'XLSX' ? 3600 : 1900,
        created: superAdminReportsToday,
        status: 'Processing',
      },
      ...current,
    ])
    setCreating(false)
    list.setPage(1)
    setNotice(`${report} (${format}) export queued — it will be Ready shortly (sample).`)
  }

  return (
    <ReportsPageShell
      page="Report Exports"
      subtitle="Download history for generated reports."
      exportNotice="Export history exported as CSV (sample)."
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
      actions={
        <button type="button" onClick={() => setCreating((open) => !open)} className={btnPrimary}>
          New export
        </button>
      }
      topSlot={
        creating ? (
          <section className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
            <label className="block flex-1 text-sm font-semibold text-navy">
              Report
              <ContentSelect value={report} onChange={(event) => setReport(event.target.value)} className="mt-1.5">
                {superAdminExportReports.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <label className="block text-sm font-semibold text-navy lg:w-44">
              Format
              <ContentSelect value={format} onChange={(event) => setFormat(event.target.value as SuperAdminExportFormat)} className="mt-1.5">
                {superAdminReportExportFormats.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <div className="flex gap-2.5">
              <button type="button" onClick={create} className={btnPrimary}>
                Start export
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
          <ReportsChartCard title="Exports by format" subtitle="PDF, Excel and CSV in the current list">
            <ReportsBarChart
              items={superAdminReportExportFormats.map((item) => ({
                label: item,
                value: rows.filter((row) => row.format === item).length,
              }))}
              heightClass="h-56"
            />
          </ReportsChartCard>
        }
        rail={
          <ReportsNote tone="amber">
            Exports with personal data should be password-protected. This is a sample copy only — no files are produced.
          </ReportsNote>
        }
      >
        <div className={toolbarClass}>
          <ReportsSearch value={list.query} onChange={list.setQuery} placeholder="Search report or requester" />
          <ReportsFilterSelect label="Status" value={list.filter('status')} options={superAdminExportStatuses} onChange={(v) => list.setFilter('status', v)} />
          <ReportsFilterSelect label="Format" value={list.filter('format')} options={superAdminReportExportFormats} onChange={(v) => list.setFilter('format', v)} />
        </div>
        <ReportsTable
          minWidth="min-w-[860px]"
          columns={[
            { label: 'Report' },
            { label: 'Format' },
            { label: 'Requested by' },
            { label: 'Size', align: 'right' },
            { label: 'Created' },
            { label: 'Status' },
            { label: 'Action', align: 'right' },
          ]}
          isEmpty={list.pageRows.length === 0}
          emptyText="No exports match these filters."
        >
          {list.pageRows.map((row) => (
            <tr key={row.id} className={trClass}>
              <td className={firstCellClass}>{row.report}</td>
              <td className={cellClass}>{row.format}</td>
              <td className={cellClass}>{row.requestedBy}</td>
              <td className={`${numCellClass} text-right`}>{formatReportsSize(row.sizeKb)}</td>
              <td className={cellClass}>{formatReportsDate(row.created)}</td>
              <td className="px-3 py-3.5">
                <StatusBadge value={row.status} />
              </td>
              <td className="px-3 py-3.5 text-right">
                {row.status === 'Ready' ? (
                  <button type="button" onClick={() => setNotice(`${row.report} (${row.format}) downloaded (sample).`)} className={linkAction}>
                    Download
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRows((current) => updateById(current, row.id, { status: 'Ready', created: superAdminReportsToday }))
                      setNotice(`${row.report} (${row.format}) re-run and ready to download (sample).`)
                    }}
                    className={linkAction}
                  >
                    Re-run export
                  </button>
                )}
              </td>
            </tr>
          ))}
        </ReportsTable>
        <ReportsPager page={list.page} pageCount={list.pageCount} from={list.from} to={list.to} total={list.filtered.length} noun="exports" onPage={list.setPage} />
      </ReportsLayout>
    </ReportsPageShell>
  )
}
