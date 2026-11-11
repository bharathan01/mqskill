import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import {
  formatSalesDate,
  superAdminCoupons,
  superAdminSalesPageSize,
  type SuperAdminCoupon,
  type SuperAdminCouponStatus,
  type SuperAdminCouponType,
  type SuperAdminSalesKpi,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
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
  updateById,
} from './salesShared'

const ALL_TYPES = 'All types'
const TABS: { id: 'all' | SuperAdminCouponStatus; label: string }[] = [
  { id: 'all', label: 'All coupons' },
  { id: 'Active', label: 'Active' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'Expired', label: 'Expired' },
  { id: 'Disabled', label: 'Disabled' },
]

export function AdminCouponsPage() {
  const [rows, setRows] = useState<SuperAdminCoupon[]>(superAdminCoupons)
  const [tab, setTab] = useState<'all' | SuperAdminCouponStatus>('all')
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL_TYPES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [code, setCode] = useState('')
  const [newType, setNewType] = useState<SuperAdminCouponType>('Percent')
  const [value, setValue] = useState('10')
  const [limit, setLimit] = useState('100')
  const [error, setError] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminSalesKpi[]>(() => {
    const active = rows.filter((row) => row.status === 'Active').length
    const baseActive = superAdminCoupons.filter((row) => row.status === 'Active').length
    return [
      { id: 'active', label: 'Active coupons', value: String(7 + active - baseActive), detail: 'Currently redeemable' },
      { id: 'redemptions', label: 'Redemptions (30d)', value: '318', detail: '+12% vs previous 30 days' },
      { id: 'discount', label: 'Discount given', value: 'KWD 2,140', detail: 'Across all coupons, last 30 days' },
    ]
  }, [rows])

  const topUsed = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.used - a.used)
        .slice(0, 5)
        .map((row) => ({ label: row.code, value: row.used })),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (type !== ALL_TYPES && row.type !== type) return false
      return !needle || row.code.toLowerCase().includes(needle)
    })
  }, [query, rows, tab, type])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminSalesPageSize)

  const setStatus = (row: SuperAdminCoupon, status: SuperAdminCouponStatus, message: string) => {
    setRows((current) => updateById(current, row.id, { status }))
    setNotice(message)
  }

  const create = () => {
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')
    const amount = Number(value)
    const cap = Number(limit)
    if (clean.length < 4) return setError('Enter a code of at least 4 letters or numbers.')
    if (rows.some((row) => row.code === clean)) return setError(`${clean} already exists.`)
    if (!Number.isFinite(amount) || amount <= 0 || (newType === 'Percent' && amount > 100)) {
      return setError(newType === 'Percent' ? 'Percent value must be between 1 and 100.' : 'Enter a KWD amount above zero.')
    }
    if (!Number.isInteger(cap) || cap < 1) return setError('Usage limit must be a whole number of at least 1.')
    setRows((current) => [
      {
        id: clean,
        code: clean,
        type: newType,
        value: newType === 'Percent' ? `${amount}%` : `KWD ${amount}`,
        used: 0,
        limit: cap,
        validUntil: '2027-03-31',
        status: 'Active',
      },
      ...current,
    ])
    setCode('')
    setError(null)
    setCreating(false)
    setTab('all')
    setPage(1)
    setNotice(`Coupon ${clean} created and active until 31 Mar 2027 (sample).`)
  }

  return (
    <div className="space-y-5">
      <SalesPageHeader
        page="Coupons and Discounts"
        subtitle="Promotional codes for individuals and organizations."
        actions={
          <>
            <button type="button" onClick={() => setNotice('Coupons exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setCreating((open) => !open)} className={btnPrimary}>
              Create coupon
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {creating ? (
        <section className={`${cardClass} p-4`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-sm font-semibold text-navy">
              Code
              <ContentTextInput
                value={code}
                invalid={!!error}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. KUWAIT15"
                className="mt-1.5 uppercase"
              />
            </label>
            <label className="block text-sm font-semibold text-navy">
              Type
              <ContentSelect value={newType} onChange={(event) => setNewType(event.target.value as SuperAdminCouponType)} className="mt-1.5">
                <option>Percent</option>
                <option>Fixed (KWD)</option>
              </ContentSelect>
            </label>
            <label className="block text-sm font-semibold text-navy">
              {newType === 'Percent' ? 'Value (%)' : 'Value (KWD)'}
              <ContentTextInput inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} className="mt-1.5" />
            </label>
            <label className="block text-sm font-semibold text-navy">
              Usage limit
              <ContentTextInput inputMode="numeric" value={limit} onChange={(event) => setLimit(event.target.value)} className="mt-1.5" />
            </label>
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
          <div className="mt-4 flex gap-2.5">
            <button type="button" onClick={create} className={btnPrimary}>
              Save coupon
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false)
                setError(null)
              }}
              className={btnOutline}
            >
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
              onChange={(next) => {
                setQuery(next)
                setPage(1)
              }}
              placeholder="Search coupon code"
            />
            <ContentSelect
              aria-label="Type"
              value={type}
              onChange={(event) => {
                setType(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[11rem]"
            >
              <option>{ALL_TYPES}</option>
              <option>Percent</option>
              <option>Fixed (KWD)</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Code</th>
                  <th className={thClass}>Type</th>
                  <th className={`${thClass} text-right`}>Value</th>
                  <th className={`${thClass} text-right`}>Used / limit</th>
                  <th className={thClass}>Valid until</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-navy">{row.code}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.type}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-navy tabular-nums">{row.value}</td>
                    <td className="px-3 py-3.5 text-right text-sm text-slate-600 tabular-nums">
                      {row.used} / {row.limit}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatSalesDate(row.validUntil)}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Active' || row.status === 'Scheduled' ? (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Disabled', `${row.code} disabled. It can no longer be redeemed (sample).`)}
                          className={dangerAction}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStatus(row, 'Active', `${row.code} enabled (sample).`)}
                          className={linkAction}
                        >
                          Enable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <SalesEmptyRow colSpan={7}>No coupons match these filters.</SalesEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <SalesPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="coupons" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <SalesSideCard icon={null} title="Most redeemed" subtitle="Uses per code">
            <SalesHBars items={topUsed} />
          </SalesSideCard>
        </div>
      </div>
    </div>
  )
}
