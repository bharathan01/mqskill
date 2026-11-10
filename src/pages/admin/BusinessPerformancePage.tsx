import { useMemo, useState } from 'react'
import {
  superAdminBusinessHighlights,
  superAdminBusinessKpis,
  superAdminBusinessMetrics,
  superAdminBusinessPerformancePage,
  superAdminRevenueByType,
  type SuperAdminBusinessRangeId,
} from '@/constants'
import { ContentBadge, ContentNotice } from '@/components/common'
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  AwardIcon,
  CalendarIcon,
  ChevronDownIcon,
  DownloadIcon,
  GlobeIcon,
  TrendingUpIcon,
} from '@/components/ui'

const copy = superAdminBusinessPerformancePage

const highlightIcons = {
  trend: TrendingUpIcon,
  award: AwardIcon,
  globe: GlobeIcon,
  alert: AlertTriangleIcon,
} as const

function ChangePill({
  value,
  tone,
  align = 'end',
}: {
  value: string
  tone: 'up' | 'down'
  align?: 'start' | 'end'
}) {
  const Icon = tone === 'up' ? ArrowUpIcon : ArrowDownIcon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        tone === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      } ${align === 'end' ? 'justify-self-end' : ''}`}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  )
}

function RevenueChart() {
  const max = 56
  const ticks = [0, 14, 28, 42, 56]

  return (
    <div className="mt-4">
      <div className="relative h-52">
        {ticks.map((tick) => {
          const top = ((max - tick) / max) * 100
          return (
            <div
              key={tick}
              className="absolute right-0 left-10 flex items-center"
              style={{ top: `${top}%` }}
            >
              <span className="absolute -left-10 w-8 text-right text-[11px] text-slate-400">
                {tick}k
              </span>
              <div className="h-px w-full bg-slate-100" />
            </div>
          )
        })}
        <div className="absolute inset-x-10 bottom-0 flex h-full items-end justify-between gap-2 pt-2">
          {superAdminRevenueByType.map((item) => {
            const b2cH = (item.b2c / max) * 100
            const b2bH = (item.b2b / max) * 100
            return (
              <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end">
                <div className="flex w-7 flex-col-reverse overflow-hidden rounded-t-sm">
                  <div className="w-full bg-[#102A4C]" style={{ height: `${b2cH * 1.7}px` }} />
                  <div className="w-full bg-[#60A5FA]" style={{ height: `${b2bH * 1.7}px` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-2 flex justify-between pl-10 text-xs text-slate-500">
        {superAdminRevenueByType.map((item) => (
          <span key={item.month} className="flex-1 text-center">
            {item.month}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#102A4C]" />
          {copy.legend.b2c}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#60A5FA]" />
          {copy.legend.b2b}
        </span>
      </div>
    </div>
  )
}

export function AdminBusinessPerformancePage() {
  const [rangeId, setRangeId] = useState<SuperAdminBusinessRangeId>('month')
  const [notice, setNotice] = useState<string | null>(null)

  const periodLabel = useMemo(() => {
    if (rangeId === 'quarter') return 'Q4 2026'
    if (rangeId === 'year') return '2026'
    if (rangeId === 'custom') return 'Custom range'
    return copy.periodLabel
  }, [rangeId])

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Dashboard
            <span className="mx-1.5">/</span>
            <span className="text-slate-500">{copy.breadcrumb}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">
              {copy.title}
            </h1>
            <ContentBadge tone="slate">{copy.badge}</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setNotice(copy.exportNotice)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            {copy.exportPdf}
          </button>
          <button
            type="button"
            onClick={() => setNotice(copy.scheduleNotice)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand/90"
          >
            <CalendarIcon className="h-4 w-4" />
            {copy.schedule}
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            {copy.ranges.map((range) => {
              const active = range.id === rangeId
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setRangeId(range.id)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? 'bg-white font-semibold text-navy shadow-sm'
                      : 'font-medium text-slate-500 hover:text-navy'
                  }`}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-navy"
          >
            <CalendarIcon className="h-4 w-4 text-slate-400" />
            {periodLabel}
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-navy"
          >
            {copy.compareLabel}
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>
          <div className="hidden flex-1 xl:block" />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-navy"
          >
            {copy.learnerLabel}
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {superAdminBusinessKpis.map((kpi) => (
          <div
            key={kpi.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-1 text-[22px] leading-7 font-bold tracking-tight text-navy">
              {kpi.value}
            </p>
            <p
              className={`mt-2 text-xs font-semibold ${
                kpi.tone === 'up' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {kpi.change}
            </p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-5 py-3 font-semibold">{copy.table.metric}</th>
                <th className="px-3 py-3 text-right font-semibold">{copy.table.current}</th>
                <th className="px-3 py-3 text-right font-semibold">{copy.table.previous}</th>
                <th className="px-3 py-3 text-right font-semibold">{copy.table.change}</th>
                <th className="px-3 py-3 text-right font-semibold">{copy.table.yoyPeriod}</th>
                <th className="px-5 py-3 text-right font-semibold">{copy.table.yoy}</th>
              </tr>
            </thead>
            <tbody>
              {superAdminBusinessMetrics.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-navy">{row.metric}</td>
                  <td className="px-3 py-3.5 text-right text-slate-600">{row.current}</td>
                  <td className="px-3 py-3.5 text-right text-slate-500">{row.previous}</td>
                  <td className="px-3 py-3.5 text-right">
                    <ChangePill value={row.change} tone={row.changeTone} />
                  </td>
                  <td className="px-3 py-3.5 text-right text-slate-500">{row.yoy}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ChangePill value={row.yoyChange} tone={row.yoyTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-lg font-bold text-navy">{copy.chartTitle}</h2>
          <p className="mt-0.5 text-xs text-slate-400">{copy.chartSubtitle}</p>
          <RevenueChart />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-lg font-bold text-navy">{copy.highlightsTitle}</h2>
            <ul className="mt-4 space-y-4">
              {superAdminBusinessHighlights.map((item) => {
                const Icon = highlightIcons[item.icon]
                return (
                  <li key={item.id} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF] text-brand">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-navy">{item.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>{copy.note}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
