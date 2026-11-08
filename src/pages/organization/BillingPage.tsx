import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  organizationBillingMetrics,
  organizationBillingPage,
  organizationInvoices,
  type InvoiceStatus,
} from '@/constants'
import { organizationInvoicePath, paths } from '@/routes/paths'
import {
  BuildingIcon,
  CartIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  TicketIcon,
} from '@/components/ui'

function metricVisual(id: string) {
  if (id === 'paid') return { wrap: 'bg-emerald-50 text-emerald-600', Icon: CheckCircleIcon }
  if (id === 'awaiting') return { wrap: 'bg-amber-50 text-amber-600', Icon: ClockIcon }
  if (id === 'seats') return { wrap: 'bg-[#EAF2FF] text-brand', Icon: TicketIcon }
  return { wrap: 'bg-slate-100 text-slate-500', Icon: TagIcon }
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  if (status === 'awaiting') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {organizationBillingPage.status.awaiting}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {organizationBillingPage.status.paid}
    </span>
  )
}

export function OrganizationBillingPage() {
  const navigate = useNavigate()
  const [year, setYear] = useState(organizationBillingPage.year)
  const [toast, setToast] = useState('')

  const invoices = useMemo(
    () => organizationInvoices.filter((item) => String(item.year) === year),
    [year],
  )

  const pending = organizationInvoices.find((item) => item.status === 'awaiting')

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <h1 className="text-3xl font-bold text-navy">{organizationBillingPage.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            {organizationBillingPage.subtitle}
          </p>
        </header>
        <Link
          to={paths.organization.catalog}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <CartIcon className="h-4 w-4" />
          {organizationBillingPage.buyCourses}
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {organizationBillingMetrics.map((metric) => {
          const visual = metricVisual(metric.id)
          const Icon = visual.Icon
          return (
            <div
              key={metric.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {metric.label}
                </p>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${visual.wrap}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
            </div>
          )
        })}
      </section>

      {pending ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              {organizationBillingPage.alertTitle}
            </p>
            <p className="mt-1 text-sm text-amber-800">{organizationBillingPage.alertBody}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={organizationInvoicePath(pending.id)}
              className="inline-flex h-9 items-center rounded-lg border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 hover:bg-amber-100"
            >
              {organizationBillingPage.viewBankDetails}
            </Link>
            <Link
              to={organizationInvoicePath(pending.id)}
              className="inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {organizationBillingPage.payByKnet}
            </Link>
          </div>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-navy">{organizationBillingPage.invoicesTitle}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-3 text-sm font-semibold text-navy outline-none"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
            <button
              type="button"
              onClick={() => showToast(organizationBillingPage.exportToast)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <DownloadIcon className="h-4 w-4" />
              {organizationBillingPage.export}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                {organizationBillingPage.headers.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="px-5 py-3 font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`border-b border-slate-50 last:border-0 hover:bg-[#F5F9FF] ${
                    invoice.status === 'awaiting' ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <Link
                      to={organizationInvoicePath(invoice.id)}
                      className="font-semibold text-navy hover:text-brand"
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{invoice.date}</td>
                  <td className="px-5 py-3.5 text-slate-700">{invoice.course}</td>
                  <td className="px-5 py-3.5 text-slate-700">{invoice.seats}</td>
                  <td className="px-5 py-3.5 font-semibold text-navy">
                    {invoice.amount.toFixed(3)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{invoice.paidWith}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label="View invoice"
                        onClick={() => navigate(organizationInvoicePath(invoice.id))}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Download invoice"
                        onClick={() => showToast(organizationBillingPage.downloadToast)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand"
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-navy">
              {organizationBillingPage.billingDetailsTitle}
            </h2>
            <button
              type="button"
              onClick={() => showToast(organizationBillingPage.editToast)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              {organizationBillingPage.edit}
            </button>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{organizationBillingPage.fields.company}</dt>
              <dd className="font-semibold text-navy">{organizationBillingPage.company}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{organizationBillingPage.fields.invoicesSentTo}</dt>
              <dd className="font-semibold text-navy">{organizationBillingPage.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{organizationBillingPage.fields.address}</dt>
              <dd className="text-right font-semibold text-navy">
                {organizationBillingPage.address}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{organizationBillingPage.fields.currency}</dt>
              <dd className="font-semibold text-navy">{organizationBillingPage.currency}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">
            {organizationBillingPage.waysToPayTitle}
          </h2>
          <ul className="mt-4 space-y-3">
            {organizationBillingPage.waysToPay.map((method) => (
              <li key={method.id} className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                  {method.id === 'transfer' ? (
                    <BuildingIcon className="h-4 w-4" />
                  ) : (
                    <CreditCardIcon className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{method.label}</p>
                  <p className="text-sm text-slate-500">{method.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
