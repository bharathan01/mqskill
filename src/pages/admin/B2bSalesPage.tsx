import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatSalesDate,
  formatSalesKwd,
  superAdminB2bDeals,
  superAdminB2bKpis,
  superAdminB2bSubtitle,
  superAdminB2bTabs,
  superAdminB2bTip,
  superAdminSalesPageSize,
  type SuperAdminB2bDeal,
  type SuperAdminB2bStatus,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  linkAction,
  paginate,
  SalesEmptyRow,
  SalesHBars,
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
} from './salesShared'

export function AdminB2bSalesPage() {
  const [deals, setDeals] = useState<SuperAdminB2bDeal[]>(superAdminB2bDeals)
  const [tab, setTab] = useState<'all' | SuperAdminB2bStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const topOrgs = useMemo(() => {
    const totals = new Map<string, number>()
    deals
      .filter((row) => row.status !== 'Quote sent')
      .forEach((row) => totals.set(row.org, (totals.get(row.org) ?? 0) + row.amount))
    return Array.from(totals, ([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [deals])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return deals.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (!needle) return true
      return `${row.id} ${row.org} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [deals, query, tab])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminB2bDeal, status: SuperAdminB2bStatus, message: string) => {
    setDeals((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  const createQuote = () => {
    const next: SuperAdminB2bDeal = {
      id: `B2B-${9100 + deals.length * 6}`,
      org: 'Kuwait Oil Company',
      course: 'ISO 45001 Lead Implementer',
      seats: 75,
      amount: Math.round(58 * 75 * 0.85),
      date: '2026-11-10',
      status: 'Quote sent',
    }
    setDeals((current) => [next, ...current])
    setTab('all')
    setPage(1)
    setNotice(`Quote ${next.id} for ${next.org} created and sent (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="B2B Sales"
        subtitle={superAdminB2bSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('B2B deals exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={createQuote} className={btnPrimary}>
              Create quote
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={superAdminB2bKpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs
            tabs={superAdminB2bTabs}
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
              placeholder="Search organization, course or deal ID"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Course</th>
                  <th className={`${thClass} text-right`}>Seats</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.org}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.seats}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">
                      {formatSalesKwd(row.amount)}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="inline-flex items-center justify-end gap-3">
                        {row.status === 'Quote sent' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Invoiced', `${row.id} converted to an invoice for ${row.org} (sample).`)}
                            className={linkAction}
                          >
                            Convert to invoice
                          </button>
                        ) : null}
                        {row.status !== 'Paid' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Paid', `${row.id} marked as paid. Seats are being provisioned (sample).`)}
                            className={linkAction}
                          >
                            Mark as paid
                          </button>
                        ) : (
                          <span className="text-sm text-slate-300">—</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No B2B deals match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="deals"
            onPage={setPage}
          />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Top organizations" subtitle="Invoiced and paid deals">
            <SalesHBars items={topOrgs} format={(value) => formatSalesKwd(value)} />
          </SalesSideCard>

          <SalesSideCard icon={<LightbulbIcon className="h-4 w-4 text-amber-500" />} title="Tip">
            <p className="-mt-3 text-sm text-slate-500">{superAdminB2bTip}</p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
