import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect } from '@/components/common'
import {
  formatSalesDate,
  superAdminSalesPageSize,
  superAdminTaxRules,
  type SuperAdminSalesKpi,
  type SuperAdminTaxRule,
  type SuperAdminTaxStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  paginate,
  SalesBarChart,
  SalesEmptyRow,
  SalesKpiGrid,
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

const ALL_REGIONS = 'All regions'
const TABS: { id: 'all' | SuperAdminTaxStatus; label: string }[] = [
  { id: 'all', label: 'All rules' },
  { id: 'Active', label: 'Active' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'Disabled', label: 'Disabled' },
]
const VAT_REGIONS = ['Saudi Arabia', 'UAE', 'Bahrain', 'Oman', 'Kuwait']
const REGION_LABEL: Record<string, string> = { 'Saudi Arabia': 'SA', UAE: 'UAE', Bahrain: 'BH', Oman: 'OM', Kuwait: 'KW' }

export function AdminTaxFeesPage() {
  const [rows, setRows] = useState<SuperAdminTaxRule[]>(superAdminTaxRules)
  const [tab, setTab] = useState<'all' | SuperAdminTaxStatus>('all')
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState(ALL_REGIONS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const regions = useMemo(() => Array.from(new Set(superAdminTaxRules.map((row) => row.region))), [])

  const kpis = useMemo<SuperAdminSalesKpi[]>(() => {
    const active = rows.filter((row) => row.status === 'Active').length
    return [
      { id: 'tax', label: 'Tax collected (30d)', value: 'KWD 3,820', detail: 'VAT remitted per region' },
      { id: 'rules', label: 'Active rules', value: String(active), detail: `${rows.length} tax and fee rules configured` },
      { id: 'waived', label: 'Fees waived', value: '12', detail: 'Manual waivers in the last 30 days' },
    ]
  }, [rows])

  const vatChart = useMemo(
    () =>
      VAT_REGIONS.map((name) => {
        const rule = rows.find((row) => row.region === name && (row.item.startsWith('VAT') || name === 'Kuwait'))
        return { label: REGION_LABEL[name], value: rule && rule.status === 'Active' ? (rule.percent ?? 0) : 0 }
      }),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (region !== ALL_REGIONS && row.region !== region) return false
      return !needle || row.item.toLowerCase().includes(needle)
    })
  }, [query, region, rows, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminTaxRule, status: SuperAdminTaxStatus, message: string) => {
    setRows((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Tax and Fees"
        subtitle="Tax rates and platform fees applied at checkout by region."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Tax summary exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('Add tax rule form opened (sample). New rules apply to future orders only.')} className={btnPrimary}>
              Add tax rule
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

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
              placeholder="Search tax rule or fee"
            />
            <ContentSelect
              aria-label="Region"
              value={region}
              onChange={(event) => {
                setRegion(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[12rem]"
            >
              <option>{ALL_REGIONS}</option>
              {regions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Item</th>
                  <th className={thClass}>Region</th>
                  <th className={`${thClass} text-right`}>Rate</th>
                  <th className={thClass}>Applies to</th>
                  <th className={thClass}>Effective</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.item}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.region}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-navy tabular-nums">{row.rate}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.applies}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.effective)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Active' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Disabled', `${row.item} disabled. It is no longer applied at checkout (sample).`)}
                          className={dangerAction}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Active', `${row.item} enabled and applied at checkout (sample).`)}
                          className={linkAction}
                        >
                          Enable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No tax rules match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="rules" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="VAT by GCC region" subtitle="Active VAT rate (%)">
            <SalesBarChart items={vatChart} showValues format={(value) => `${value}%`} heightClass="h-40" color="#2563EB" />
          </SalesSideCard>
          <SalesSideCard icon={null} title="Note">
            <p className="-mt-3 text-sm text-slate-500">
              Kuwait currently has no VAT. Platform fee and gateway pass-through are added on top of the course price at checkout.
            </p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
