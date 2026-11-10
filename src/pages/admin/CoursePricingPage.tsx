import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice } from '@/components/common'
import { BookIcon, CalendarIcon, DownloadIcon, InfoIcon, PencilIcon } from '@/components/ui'
import {
  discountedSeat,
  formatKwdAmount,
  formatKwdLabel,
  formatPricingDate,
  superAdminCoursePricesSeed,
  superAdminPricingPageSize,
  superAdminPricingPlansSeed,
  type SuperAdminCoursePrice,
  type SuperAdminPricingPlan,
  type SuperAdminPricingPlanId,
} from '@/constants'
import { Modal } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

type Draft = {
  b2c: string
  seat: string
  effective: string
}

function planBadgeTone(plan: SuperAdminPricingPlan): 'green' | 'amber' | 'slate' {
  if (plan.discountPct != null) return 'green'
  if (plan.id === 'business') return 'amber'
  return 'slate'
}

function toDraft(row: SuperAdminCoursePrice): Draft {
  return {
    b2c: formatKwdAmount(row.b2c),
    seat: formatKwdAmount(row.seat),
    effective: row.effective,
  }
}

function parseAmount(value: string) {
  const n = Number(value.replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

export function AdminCoursePricingPage() {
  const [plans, setPlans] = useState(superAdminPricingPlansSeed)
  const [rows, setRows] = useState(superAdminCoursePricesSeed)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(superAdminCoursePricesSeed[1]?.id ?? superAdminCoursePricesSeed[0].id)
  const [draft, setDraft] = useState<Draft>(() => toDraft(superAdminCoursePricesSeed[1] ?? superAdminCoursePricesSeed[0]))
  const [dirty, setDirty] = useState(false)
  const [planModal, setPlanModal] = useState(false)
  const [planDraft, setPlanDraft] = useState({ basic: '10', standard: '20' })
  const [notice, setNotice] = useState<string | null>(null)

  const pageCount = Math.max(1, Math.ceil(rows.length / superAdminPricingPageSize))
  const safePage = Math.min(page, pageCount)
  const pageRows = rows.slice((safePage - 1) * superAdminPricingPageSize, safePage * superAdminPricingPageSize)
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0]
  const basicPct = plans.find((plan) => plan.id === 'basic')?.discountPct ?? 10
  const standardPct = plans.find((plan) => plan.id === 'standard')?.discountPct ?? 20

  const previewSeat = useMemo(() => parseAmount(draft.seat) ?? selected.seat, [draft.seat, selected.seat])

  function selectRow(row: SuperAdminCoursePrice) {
    if (dirty) {
      const keep = window.confirm('Discard unsaved pricing changes?')
      if (!keep) return
    }
    setSelectedId(row.id)
    setDraft(toDraft(row))
    setDirty(false)
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  function cancelEdit() {
    setDraft(toDraft(selected))
    setDirty(false)
    setNotice('Pricing changes discarded.')
  }

  function saveEdit() {
    const b2c = parseAmount(draft.b2c)
    const seat = parseAmount(draft.seat)
    if (b2c == null || seat == null || b2c < 0 || seat < 0) {
      setNotice('Enter valid B2C and seat prices in KWD.')
      return
    }
    if (!draft.effective) {
      setNotice('Choose an effective date.')
      return
    }
    setRows((current) =>
      current.map((row) =>
        row.id === selected.id ? { ...row, b2c, seat, effective: draft.effective } : row,
      ),
    )
    setDirty(false)
    setNotice(`Saved pricing for ${selected.name}. New prices apply to new orders only.`)
  }

  function exportCsv() {
    const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
    const lines = [
      ['Course', 'B2C price', 'Seat price', `Basic −${basicPct}%`, `Std −${standardPct}%`, 'Effective']
        .map(escape)
        .join(','),
      ...rows.map((row) =>
        [
          row.name,
          formatKwdAmount(row.b2c),
          formatKwdAmount(row.seat),
          formatKwdAmount(discountedSeat(row.seat, basicPct) ?? 0),
          formatKwdAmount(discountedSeat(row.seat, standardPct) ?? 0),
          formatPricingDate(row.effective),
        ]
          .map(escape)
          .join(','),
      ),
    ]
    try {
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'course-pricing.csv'
      link.click()
      URL.revokeObjectURL(url)
      setNotice(`Exported ${rows.length} course prices (sample).`)
    } catch {
      setNotice('Export failed in this browser (sample).')
    }
  }

  function openPlanModal() {
    setPlanDraft({
      basic: String(plans.find((plan) => plan.id === 'basic')?.discountPct ?? 10),
      standard: String(plans.find((plan) => plan.id === 'standard')?.discountPct ?? 20),
    })
    setPlanModal(true)
  }

  function savePlanRates() {
    const basic = Number(planDraft.basic)
    const standard = Number(planDraft.standard)
    if (![basic, standard].every((n) => Number.isFinite(n) && n >= 0 && n <= 90)) {
      setNotice('Plan discounts must be between 0 and 90%.')
      return
    }
    setPlans((current) =>
      current.map((plan) => {
        if (plan.id === 'basic') return { ...plan, discountPct: basic, badge: `−${basic}%` }
        if (plan.id === 'standard') return { ...plan, discountPct: standard, badge: `−${standard}%` }
        return plan
      }),
    )
    setPlanModal(false)
    setNotice(`Plan rates updated: Basic −${basic}%, Standard −${standard}%. Applied automatically to B2B orders.`)
  }

  function planPreviewLabel(planId: SuperAdminPricingPlanId) {
    const plan = plans.find((item) => item.id === planId)
    if (!plan) return '—'
    if (plan.id === 'enterprise') return 'Per contract'
    if (plan.discountPct == null) return 'Not finalized'
    const amount = discountedSeat(previewSeat, plan.discountPct)
    return amount == null ? '—' : formatKwdLabel(amount)
  }

  const pageButtons = useMemo(() => {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1)
    const set = new Set([1, 2, 3, pageCount, safePage, safePage - 1, safePage + 1].filter((n) => n >= 1 && n <= pageCount))
    return [...set].sort((a, b) => a - b)
  }, [pageCount, safePage])

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Course Management
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Course Pricing</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Course Pricing</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-500">
            B2C prices and B2B seat prices in KWD. Plan discounts are applied automatically to B2B orders.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={exportCsv} className={btnOutline}>
            <DownloadIcon className="h-4 w-4" />
            Export prices
          </button>
          <button type="button" onClick={openPlanModal} className={btnPrimary}>
            Edit plan rates
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article key={plan.id} className={`${cardClass} p-4`}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-bold text-navy">{plan.label}</h2>
              <ContentBadge tone={planBadgeTone(plan)}>{plan.badge}</ContentBadge>
            </div>
            <p className="mt-1 text-sm text-slate-500">{plan.seatLimit}</p>
            {plan.note ? <p className="mt-2 text-xs leading-5 text-slate-400">{plan.note}</p> : null}
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-2.5 font-semibold">Course</th>
                  <th className="px-3 py-2.5 font-semibold text-right">B2C price</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Seat price</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Basic −{basicPct}%</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Std −{standardPct}%</th>
                  <th className="px-3 py-2.5 font-semibold">Effective</th>
                  <th className="w-10 px-2 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const active = row.id === selected.id
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-slate-100 last:border-b-0 ${active ? 'bg-[#EFF4FF]' : 'hover:bg-slate-50/70'}`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => selectRow(row)}
                          className="flex w-full items-center gap-3 text-left"
                        >
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand">
                            <BookIcon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-semibold text-navy">{row.name}</span>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-medium text-navy tabular-nums">
                        {formatKwdAmount(row.b2c)}
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-medium text-navy tabular-nums">
                        {formatKwdAmount(row.seat)}
                      </td>
                      <td className="px-3 py-3 text-right text-sm text-slate-600 tabular-nums">
                        {formatKwdAmount(discountedSeat(row.seat, basicPct) ?? 0)}
                      </td>
                      <td className="px-3 py-3 text-right text-sm text-slate-600 tabular-nums">
                        {formatKwdAmount(discountedSeat(row.seat, standardPct) ?? 0)}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {formatPricingDate(row.effective)}
                      </td>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          aria-label={`Edit pricing for ${row.name}`}
                          onClick={() => selectRow(row)}
                          className={`rounded-lg p-1.5 transition ${active ? 'bg-white text-brand shadow-sm' : 'text-slate-400 hover:bg-slate-100 hover:text-navy'}`}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {pageRows.length} of {rows.length} courses · seat price before plan discount · amounts in KWD
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {pageButtons.map((number, index) => {
                const prev = pageButtons[index - 1]
                const showEllipsis = prev != null && number - prev > 1
                const active = number === safePage
                return (
                  <span key={number} className="contents">
                    {showEllipsis ? <span className="px-1 text-sm text-slate-400">…</span> : null}
                    <button
                      type="button"
                      aria-label={`Page ${number}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setPage(number)}
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                        active ? 'bg-brand text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {number}
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        </section>

        <aside className={`${cardClass} flex h-fit flex-col p-5`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-navy">Edit pricing</h2>
              <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{selected.name}</p>
            </div>
            {dirty ? <ContentBadge tone="amber">Unsaved</ContentBadge> : <ContentBadge tone="slate">Live</ContentBadge>}
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-slate-600">B2C price</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <span className="text-sm font-semibold text-slate-400">KWD</span>
              <input
                value={draft.b2c}
                onChange={(event) => updateDraft({ b2c: event.target.value })}
                inputMode="decimal"
                className="h-10 w-full bg-transparent text-sm font-semibold text-navy outline-none"
              />
            </div>
          </label>

          <label className="mt-3.5 block">
            <span className="text-sm font-medium text-slate-600">B2B seat price (before discount)</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <span className="text-sm font-semibold text-slate-400">KWD</span>
              <input
                value={draft.seat}
                onChange={(event) => updateDraft({ seat: event.target.value })}
                inputMode="decimal"
                className="h-10 w-full bg-transparent text-sm font-semibold text-navy outline-none"
              />
            </div>
          </label>

          <label className="mt-3.5 block">
            <span className="text-sm font-medium text-slate-600">Effective from</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={draft.effective}
                onChange={(event) => updateDraft({ effective: event.target.value })}
                className="h-10 w-full bg-transparent text-sm font-semibold text-navy outline-none"
              />
            </div>
          </label>

          <div className="mt-5">
            <p className="text-sm font-semibold text-navy">Seat price by plan</p>
            <ul className="mt-2.5 space-y-2">
              {plans.map((plan) => (
                <li
                  key={plan.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5"
                >
                  <span className="text-sm text-slate-600">
                    {plan.discountPct != null ? `${plan.label} · ${plan.discountPct}% off` : plan.label}
                  </span>
                  <span className="text-sm font-semibold text-navy whitespace-nowrap">{planPreviewLabel(plan.id)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-5 text-sky-900">
            <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
            <p>New prices apply to new orders only. Existing orders and purchased seats keep the price they were bought at.</p>
          </div>

          <div className="mt-5 flex gap-2.5">
            <button type="button" onClick={cancelEdit} className={`flex-1 ${btnOutline}`} disabled={!dirty}>
              Cancel
            </button>
            <button type="button" onClick={saveEdit} className={`flex-1 ${btnPrimary}`} disabled={!dirty}>
              Save
            </button>
          </div>
        </aside>
      </div>

      {planModal ? (
        <Modal
          title="Edit plan rates"
          description="Basic and Standard discounts apply automatically to B2B seat prices. Business and Enterprise stay pending or contract-based."
          onClose={() => setPlanModal(false)}
          footer={
            <>
              <button type="button" onClick={() => setPlanModal(false)} className={btnOutline}>
                Cancel
              </button>
              <button type="button" onClick={savePlanRates} className={btnPrimary}>
                Save rates
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Basic discount (%)</span>
              <input
                value={planDraft.basic}
                onChange={(event) => setPlanDraft((current) => ({ ...current, basic: event.target.value }))}
                inputMode="numeric"
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Standard discount (%)</span>
              <input
                value={planDraft.standard}
                onChange={(event) => setPlanDraft((current) => ({ ...current, standard: event.target.value }))}
                inputMode="numeric"
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
