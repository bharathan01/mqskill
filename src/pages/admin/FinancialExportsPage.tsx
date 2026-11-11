import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  superAdminExportDatasets,
  superAdminExportFormats,
  superAdminExportRanges,
  superAdminExportsNote,
  superAdminFinancialExports,
  superAdminSalesPageSize,
  superAdminSalesToday,
  type SuperAdminExportStatus,
  type SuperAdminFinancialExport,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  linkAction,
  paginate,
  SalesEmptyRow,
  SalesHBars,
  SalesKpiGrid,
  SalesNote,
  SalesPageHeader,
  SalesPager,
  SalesSearch,
  SalesSideCard,
  SalesTabs,
  theadRowClass,
  thClass,
  toolbarClass,
  trClass,
  updateById,
} from './salesShared'

const ALL_FORMATS = 'All formats'
const TABS: { id: 'all' | SuperAdminExportStatus; label: string }[] = [
  { id: 'all', label: 'All exports' },
  { id: 'Ready', label: 'Ready' },
  { id: 'Processing', label: 'Processing' },
  { id: 'Expired', label: 'Expired' },
]

export function AdminFinancialExportsPage() {
  const [rows, setRows] = useState<SuperAdminFinancialExport[]>(superAdminFinancialExports)
  const [tab, setTab] = useState<'all' | SuperAdminExportStatus>('all')
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState(ALL_FORMATS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [dataset, setDataset] = useState<string>(superAdminExportDatasets[0])
  const [newFormat, setNewFormat] = useState<string>(superAdminExportFormats[0])
  const [range, setRange] = useState<string>(superAdminExportRanges[0])
  const [protect, setProtect] = useState(true)

  const kpis = useMemo<SuperAdminSalesKpi[]>(
    () => [
      { id: 'exports', label: 'Exports (30d)', value: String(31 + rows.length - superAdminFinancialExports.length), detail: 'Created by finance and admins' },
      { id: 'scheduled', label: 'Scheduled', value: '4', detail: 'Recurring monthly exports' },
      { id: 'ready', label: 'Ready', value: String(rows.filter((row) => row.status === 'Ready').length), detail: 'Available to download' },
    ],
    [rows],
  )

  const byFormat = useMemo(
    () =>
      superAdminExportFormats.map((label) => ({ label, value: rows.filter((row) => row.format === label).length })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (format !== ALL_FORMATS && row.format !== format) return false
      return !needle || `${row.name} ${row.range}`.toLowerCase().includes(needle)
    })
  }, [format, query, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const generate = () => {
    setRows((current) => [
      {
        id: `x${current.length + 1}`,
        name: dataset,
        format: newFormat,
        range,
        by: 'Super Admin',
        created: superAdminSalesToday,
        protectedFile: protect,
        status: 'Processing',
      },
      ...current,
    ])
    setCreating(false)
    setTab('all')
    setPage(1)
    setNotice(
      `${dataset} (${newFormat}, ${range}) is processing${protect ? ' and will be password-protected' : ''} (sample).`,
    )
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Financial Exports"
        subtitle="CSV, Excel and PDF exports for accounting."
        actions={
          <button type="button" onClick={() => setCreating((open) => !open)} className={btnPrimary}>
            Generate export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesNote tone="blue">{superAdminExportsNote}</SalesNote>

      {creating ? (
        <section className={`${cardClass} p-4`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm font-semibold text-navy">
              Dataset
              <ContentSelect value={dataset} onChange={(event) => setDataset(event.target.value)} className="mt-1.5">
                {superAdminExportDatasets.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <label className="block text-sm font-semibold text-navy">
              Format
              <ContentSelect value={newFormat} onChange={(event) => setNewFormat(event.target.value)} className="mt-1.5">
                {superAdminExportFormats.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
            <label className="block text-sm font-semibold text-navy">
              Range
              <ContentSelect value={range} onChange={(event) => setRange(event.target.value)} className="mt-1.5">
                {superAdminExportRanges.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </label>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={protect}
              onChange={(event) => setProtect(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-brand"
            />
            Password-protect this export (recommended when it contains personal data)
          </label>
          <div className="mt-4 flex gap-2.5">
            <button type="button" onClick={generate} className={btnPrimary}>
              Generate
            </button>
            <button type="button" onClick={() => setCreating(false)} className={btnOutline}>
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      <SalesKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs
            tabs={TABS}
            active={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />
          <div className={toolbarClass}>
            <SalesSearch
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search export or range"
            />
            <ContentSelect
              aria-label="Format"
              value={format}
              onChange={(event) => {
                setFormat(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[10rem]"
            >
              <option>{ALL_FORMATS}</option>
              {superAdminExportFormats.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Export</th>
                  <th className={thClass}>Format</th>
                  <th className={thClass}>Range</th>
                  <th className={thClass}>Requested by</th>
                  <th className={thClass}>Created</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.protectedFile ? 'Password-protected' : 'Not protected'}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.format}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.range}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.by}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.created)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Ready' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setNotice(
                              `${row.name} (${row.format}) downloaded${row.protectedFile ? '. Open it with the password sent to your email' : ''} (sample).`,
                            )
                          }
                          className={linkAction}
                        >
                          Download
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRows((current) => updateById(current, row.id, { status: 'Ready' }))
                            setNotice(`${row.name} re-run and ready to download (sample).`)
                          }}
                          className={linkAction}
                        >
                          Re-run export
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No exports match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="exports" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Exports by format" subtitle="In this list">
            <SalesHBars items={byFormat} />
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
