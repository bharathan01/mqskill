import { useMemo, useState } from 'react'
import {
  studentInvoices,
  studentPaymentMethods,
  studentPaymentsPage as copy,
} from '@/constants/studentPayments'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CreditCardIcon,
  DownloadIcon,
  FileIcon,
  PlusIcon,
  SearchIcon,
} from '@/components/ui'

function BrandMark({
  brand,
  compact = false,
}: {
  brand: 'visa' | 'mastercard'
  compact?: boolean
}) {
  if (brand === 'mastercard') {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md bg-[#F3E6D2] font-extrabold tracking-tight text-[#9A6B24] ${
          compact ? 'h-6 min-w-7 px-1 text-[10px]' : 'h-8 min-w-10 px-1.5 text-xs'
        }`}
      >
        MC
      </span>
    )
  }
  if (compact) {
    return (
      <span className="inline-flex h-6 min-w-7 items-center justify-center rounded-md bg-[#E8EEFF] px-1 text-[10px] font-extrabold tracking-tight text-[#1A4FD6]">
        VI
      </span>
    )
  }
  return <span className="text-sm font-extrabold tracking-wide text-[#1A4FD6]">VISA</span>
}

export function StudentPaymentsPage() {
  const [defaultId, setDefaultId] = useState(
    studentPaymentMethods.find((method) => method.default)?.id ?? studentPaymentMethods[0].id,
  )
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('2024')
  const [status, setStatus] = useState('all')

  const invoices = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return studentInvoices.filter((invoice) => {
      const matchQuery =
        !needle ||
        invoice.id.toLowerCase().includes(needle) ||
        invoice.title.toLowerCase().includes(needle) ||
        invoice.detail.toLowerCase().includes(needle)
      const matchYear = year === 'all' || invoice.year === year
      const matchStatus = status === 'all' || invoice.status.toLowerCase() === status
      return matchQuery && matchYear && matchStatus
    })
  }, [query, year, status])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
            <CreditCardIcon className="h-3.5 w-3.5" />
            {copy.kicker}
          </p>
          <h1 className="mt-2 font-hero text-4xl font-bold text-navy">{copy.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy"
          >
            <DownloadIcon className="h-4 w-4" />
            {copy.statement}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            <PlusIcon className="h-4 w-4" />
            {copy.addMethod}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {copy.stats.map((stat) => (
          <article key={stat.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                {stat.kicker}
              </p>
              <span
                className={`text-xs font-semibold ${
                  'badgeTone' in stat && stat.badgeTone === 'green'
                    ? 'inline-flex items-center gap-1.5 text-emerald-600'
                    : 'rounded-full bg-slate-50 px-2 py-0.5 text-slate-400'
                }`}
              >
                {'badgeTone' in stat && stat.badgeTone === 'green' ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                ) : null}
                {stat.badge}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold text-navy">{stat.value}</p>
              {'brand' in stat && stat.brand ? (
                <span className="text-lg font-extrabold tracking-wide text-[#1A4FD6]">{stat.brand}</span>
              ) : null}
            </div>
            <p
              className={`mt-2 text-sm ${
                'detailTone' in stat && stat.detailTone === 'green'
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              {stat.detail}
            </p>
          </article>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-bold text-navy">{copy.savedTitle}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{copy.savedSubtitle}</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {studentPaymentMethods.map((method) => {
            const isDefault = method.id === defaultId
            return (
              <article
                key={method.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BrandMark brand={method.brand} />
                    <div>
                      <p className="text-sm font-bold text-navy">{method.title}</p>
                      <p className="text-xs text-slate-400">{method.expiry}</p>
                    </div>
                  </div>
                  {isDefault ? (
                    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                      {copy.defaultLabel}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDefaultId(method.id)}
                      className="text-[11px] font-semibold text-brand"
                    >
                      {copy.setDefault}
                    </button>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                  <span>{method.holder}</span>
                  <span>•••• {method.last4}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                      isDefault ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {isDefault ? <CheckCircleIcon className="h-4 w-4" /> : null}
                    {isDefault ? copy.primaryCard : copy.backupMethod}
                  </p>
                  <p className="text-sm">
                    <button type="button" className="font-medium text-brand">
                      {copy.edit}
                    </button>
                    <span className="mx-1.5 text-slate-300">/</span>
                    <button type="button" className="font-medium text-rose-500">
                      {copy.remove}
                    </button>
                  </p>
                </div>
              </article>
            )
          })}
          <button
            type="button"
            className="flex min-h-[168px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <PlusIcon className="h-5 w-5" />
            </span>
            <span className="mt-3 text-sm font-bold text-navy">{copy.addCardTitle}</span>
            <span className="mt-1 text-xs text-slate-400">{copy.addCardHint}</span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy">{copy.invoicesTitle}</h2>
            <p className="mt-0.5 text-sm text-slate-400">{copy.invoicesSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-9 w-52 rounded-full border border-slate-200 bg-white pr-3 pl-8 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <label className="relative">
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="h-9 appearance-none rounded-full border border-slate-200 bg-white pr-8 pl-3 text-sm text-slate-600 outline-none"
              >
                <option value="all">
                  {copy.yearLabel} {copy.allYears}
                </option>
                {copy.years.map((item) => (
                  <option key={item} value={item}>
                    {copy.yearLabel} {item}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </label>
            <label className="relative">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-9 appearance-none rounded-full border border-slate-200 bg-white pr-8 pl-3 text-sm text-slate-600 outline-none"
              >
                <option value="all">
                  {copy.statusLabel} {copy.allStatus}
                </option>
                {copy.statuses.map((item) => (
                  <option key={item} value={item.toLowerCase()}>
                    {copy.statusLabel} {item}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[860px] w-full text-left">
            <thead>
              <tr className="bg-[#F3F6FB] text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                {copy.columns.map((column) => (
                  <th key={column} className="px-5 py-3.5 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={copy.columns.length} className="px-5 py-10 text-center text-sm text-slate-400">
                    {copy.emptyInvoices}
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-100">
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                        <FileIcon className="h-4 w-4 text-slate-400" />
                        {invoice.id}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-500">{invoice.date}</td>
                    <td className="px-5 py-5">
                      <p className="text-sm font-bold text-navy">{invoice.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{invoice.detail}</p>
                    </td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <BrandMark brand={invoice.methodBrand} compact />
                        {invoice.methodLabel}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-sm font-bold text-navy">{invoice.amount}</td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-navy"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        {copy.downloadPdf}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
