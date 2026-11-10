import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice } from '@/components/common'
import {
  formatSalesKwd,
  superAdminFinanceKpis,
  superAdminFinanceMonthly,
  superAdminFinanceNote,
  superAdminFinanceStreamTabs,
  superAdminFinanceSubtitle,
  superAdminRevenueStreams,
  superAdminSalesMonths,
  type SuperAdminFinanceChannel,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  SALES_NAVY,
  SALES_SKY,
  SalesBarChart,
  SalesHBars,
  SalesKpiGrid,
  SalesLegend,
  SalesLineChart,
  SalesNote,
  SalesPageHeader,
  SalesSideCard,
  SalesTabs,
  SalesTrendPill,
  salesChartCard,
  theadRowClass,
  thClass,
  trClass,
} from './salesShared'

const monthLabels = superAdminSalesMonths as readonly string[]
const netByMonth = superAdminFinanceMonthly.map((row) => row.b2c + row.b2b - row.refunds)
const grossByMonth = superAdminFinanceMonthly.map((row) => row.b2c + row.b2b)

export function AdminFinancialOverviewPage() {
  const [tab, setTab] = useState<'all' | SuperAdminFinanceChannel>('all')
  const [view, setView] = useState<'net' | 'gross'>('net')
  const [notice, setNotice] = useState<string | null>(null)

  const streams = useMemo(
    () => superAdminRevenueStreams.filter((row) => tab === 'all' || row.channel === tab),
    [tab],
  )

  const totals = useMemo(() => {
    const gross = streams.reduce((total, row) => total + row.gross, 0)
    const refunds = streams.reduce((total, row) => total + row.refunds, 0)
    return { gross, refunds, net: gross - refunds }
  }, [streams])

  const overallNet = superAdminRevenueStreams.reduce((total, row) => total + row.gross - row.refunds, 0)

  const mix = useMemo(
    () =>
      (['B2C', 'B2B'] as const).map((channel) => ({
        label: channel === 'B2C' ? 'B2C · individuals' : 'B2B · organizations',
        value: superAdminRevenueStreams
          .filter((row) => row.channel === channel)
          .reduce((total, row) => total + row.gross - row.refunds, 0),
      })),
    [],
  )

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Financial Overview"
        subtitle={superAdminFinanceSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Financial overview exported as PDF (sample).')} className={btnOutline}>
              Export
            </button>
            <Link to={paths.admin.revenueReports} className={btnPrimary}>
              Revenue reports
            </Link>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={superAdminFinanceKpis} />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className={salesChartCard}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-navy">{view === 'net' ? 'Net sales by month' : 'Gross sales by month'}</h2>
              <p className="mt-0.5 text-sm text-slate-500">Jan–Oct 2026 · KWD</p>
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              {(['net', 'gross'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={`rounded-md px-3 py-1 text-sm capitalize transition ${
                    view === id ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <SalesLineChart
              labels={monthLabels}
              series={[
                {
                  name: view === 'net' ? 'Net sales' : 'Gross sales',
                  color: SALES_NAVY,
                  values: view === 'net' ? netByMonth : grossByMonth,
                },
              ]}
            />
          </div>
        </section>

        <section className={salesChartCard}>
          <h2 className="text-base font-bold text-navy">B2C vs B2B revenue</h2>
          <p className="mt-0.5 text-sm text-slate-500">Gross by learner type · KWD</p>
          <div className="mt-5">
            <SalesBarChart
              labels={monthLabels}
              mode="stacked"
              series={[
                { name: 'B2C · individuals', color: SALES_NAVY, values: superAdminFinanceMonthly.map((row) => row.b2c) },
                { name: 'B2B · organizations', color: SALES_SKY, values: superAdminFinanceMonthly.map((row) => row.b2b) },
              ]}
            />
          </div>
          <SalesLegend
            items={[
              { label: 'B2C · individuals', color: SALES_NAVY },
              { label: 'B2B · organizations', color: SALES_SKY },
            ]}
          />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="px-5 pt-4">
            <h2 className="text-base font-bold text-navy">Revenue streams</h2>
            <p className="mt-0.5 text-sm text-slate-500">October 2026 · gross to net by stream</p>
          </div>
          <SalesTabs tabs={superAdminFinanceStreamTabs} active={tab} onChange={setTab} />

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Stream</th>
                  <th className={`${thClass} text-right`}>Gross</th>
                  <th className={`${thClass} text-right`}>Refunds</th>
                  <th className={`${thClass} text-right`}>Net</th>
                  <th className={`${thClass} text-right`}>Share</th>
                  <th className={`${thClass} text-right`}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((row) => {
                  const net = row.gross - row.refunds
                  return (
                    <tr key={row.id} className={trClass}>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-navy">{row.stream}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{row.channel === 'B2C' ? 'Individuals' : 'Organizations'}</p>
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{formatSalesKwd(row.gross)}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-rose-600">−{formatSalesKwd(row.refunds)}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{formatSalesKwd(net)}</td>
                      <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">
                        {((net / overallNet) * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <SalesTrendPill dir={row.trend.dir} pct={row.trend.pct} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/80 text-sm font-bold text-navy">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatSalesKwd(totals.gross)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">−{formatSalesKwd(totals.refunds)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatSalesKwd(totals.net)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{((totals.net / overallNet) * 100).toFixed(1)}%</td>
                  <td className="px-3 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Revenue mix" subtitle="Net revenue, October">
            <SalesHBars items={mix} format={formatSalesKwd} />
          </SalesSideCard>

          <SalesSideCard icon={null} title="Collections" subtitle="Orders this month">
            <ul className="space-y-3 text-sm">
              {[
                ['Paid', '1,284'],
                ['Pending', '41'],
                ['Failed', '18'],
                ['Refunded', '31'],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between">
                  <StatusBadge value={label as string} />
                  <span className="font-semibold text-navy tabular-nums">{value}</span>
                </li>
              ))}
            </ul>
          </SalesSideCard>
        </div>
      </div>

      <SalesNote
        action={
          <Link to={paths.admin.costs} className={btnOutline}>
            Open Costs and Profitability
          </Link>
        }
      >
        {superAdminFinanceNote}
      </SalesNote>
    </div>
  )
}
