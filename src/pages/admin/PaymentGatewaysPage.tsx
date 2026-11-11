import { useMemo, useState } from 'react'
import { ContentNotice } from '@/components/common'
import {
  superAdminGateways,
  type SuperAdminGateway,
  type SuperAdminGatewayStatus,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  SalesEmptyRow,
  SalesHBars,
  SalesKpiGrid,
  SalesPageHeader,
  SalesSideCard,
  SalesTabs,
  theadRowClass,
  thClass,
  trClass,
  updateById,
} from './salesShared'

const TABS: { id: 'all' | SuperAdminGatewayStatus; label: string }[] = [
  { id: 'all', label: 'All gateways' },
  { id: 'Live', label: 'Live' },
  { id: 'Test', label: 'Test' },
  { id: 'Disabled', label: 'Disabled' },
]

export function AdminPaymentGatewaysPage() {
  const [rows, setRows] = useState<SuperAdminGateway[]>(superAdminGateways)
  const [tab, setTab] = useState<'all' | SuperAdminGatewayStatus>('all')
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminSalesKpi[]>(() => {
    const live = rows.filter((row) => row.status === 'Live')
    const tx = live.reduce((sum, row) => sum + row.transactions, 0)
    const weighted = tx ? live.reduce((sum, row) => sum + row.success * row.transactions, 0) / tx : 0
    return [
      { id: 'success', label: 'Success rate', value: `${weighted.toFixed(1)}%`, detail: 'Live gateways, weighted by volume' },
      { id: 'fees', label: 'Fees (30d)', value: 'KWD 1,046', detail: 'Gateway fees deducted at settlement' },
      { id: 'settlement', label: 'Avg. settlement', value: 'T+2', detail: 'Business days after capture' },
    ]
  }, [rows])

  const filtered = useMemo(() => rows.filter((row) => tab === 'all' || row.status === tab), [rows, tab])
  const volume = useMemo(
    () => rows.filter((row) => row.transactions > 0).map((row) => ({ label: row.gateway, value: row.transactions })),
    [rows],
  )

  const setStatus = (row: SuperAdminGateway, status: SuperAdminGatewayStatus, message: string) => {
    setRows((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Payment Gateways"
        subtitle="Gateway performance, fees and settlement times."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Gateway performance exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setNotice('Add gateway wizard opened (sample). API keys are never shown in plain text.')} className={btnPrimary}>
              Add gateway
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <SalesKpiGrid kpis={kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <SalesTabs tabs={TABS} active={tab} onChange={setTab} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Gateway</th>
                  <th className={thClass}>Fee</th>
                  <th className={`${thClass} text-right`}>Transactions (30d)</th>
                  <th className={`${thClass} text-right`}>Success rate</th>
                  <th className={thClass}>Settlement</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.gateway}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.fee}</td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-600 tabular-nums">{row.transactions.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-navy tabular-nums">
                      {row.transactions ? `${row.success}%` : '—'}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.settlement}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {row.status !== 'Live' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Live', `${row.gateway} is now live and accepting payments (sample).`)}
                            className={linkAction}
                          >
                            Go live
                          </button>
                        ) : null}
                        {row.status !== 'Disabled' ? (
                          <button
                            type="button"
                            onClick={() => setStatus(row, 'Disabled', `${row.gateway} disabled. It is hidden at checkout (sample).`)}
                            className={dangerAction}
                          >
                            Disable
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? <SalesEmptyRow colSpan={7}>No gateways in this status.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Transactions by gateway" subtitle="Last 30 days">
            <SalesHBars items={volume} />
          </SalesSideCard>
          <SalesSideCard icon={null} title="Settings note">
            <p className="-mt-3 text-sm text-slate-500">
              Gateway credentials and checkout options are managed under Settings → Payments.
            </p>
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
