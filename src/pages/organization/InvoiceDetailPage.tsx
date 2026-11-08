import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  formatKwd,
  getOrganizationInvoice,
  organizationBillingPage,
  organizationInvoiceDetailPage,
  organizationShell,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  BuildingIcon,
  ChevronLeftIcon,
  DownloadIcon,
  PrinterIcon,
  SendIcon,
} from '@/components/ui'

const copy = organizationInvoiceDetailPage

export function OrganizationInvoiceDetailPage() {
  const { invoiceId = '' } = useParams()
  const invoice = getOrganizationInvoice(invoiceId)
  const [toast, setToast] = useState('')

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  if (!invoice) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">{copy.notFound}</p>
        <Link
          to={paths.organization.billing}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {copy.back}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg print:hidden">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={paths.organization.billing}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-navy"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {copy.back}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <PrinterIcon className="h-4 w-4" />
            {copy.print}
          </button>
          <button
            type="button"
            onClick={() => showToast(organizationBillingPage.downloadToast)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            {copy.downloadPdf}
          </button>
          {invoice.status === 'awaiting' ? (
            <button
              type="button"
              onClick={() => showToast(copy.paidToast)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <SendIcon className="h-4 w-4" />
              {copy.payByKnet}
            </button>
          ) : null}
        </div>
      </div>

      <section
        id="invoice-print"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
              MS
            </span>
            <div>
              <p className="text-lg font-bold text-navy">MaqSkillz</p>
              <p className="text-sm text-slate-500">{copy.brandTagline}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-bold tracking-wide text-navy uppercase">
              {copy.invoiceLabel} {invoice.number}
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                invoice.status === 'awaiting'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  invoice.status === 'awaiting' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              {organizationBillingPage.status[invoice.status]}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {copy.billedTo}
            </p>
            <p className="mt-2 text-sm font-semibold text-navy">{organizationShell.orgName}</p>
            <p className="mt-1 text-sm text-slate-500">{organizationBillingPage.address}</p>
            <p className="mt-1 text-sm text-slate-500">{organizationBillingPage.email}</p>
            <p className="mt-1 text-sm text-slate-500">
              {copy.poNumber}: {invoice.poNumber}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {copy.from}
            </p>
            <p className="mt-2 text-sm font-semibold text-navy">{copy.fromName}</p>
            <p className="mt-1 text-sm text-slate-500">{copy.fromAddress}</p>
            <p className="mt-1 text-sm text-slate-500">{copy.fromEmail}</p>
          </div>
          <div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.order}</dt>
                <dd className="font-semibold text-navy">{invoice.orderId}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.issued}</dt>
                <dd className="font-semibold text-navy">{invoice.date}</dd>
              </div>
              {invoice.dueDate ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{copy.due}</dt>
                  <dd className="font-semibold text-navy">{invoice.dueDate}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.currency}</dt>
                <dd className="font-semibold text-navy">{organizationBillingPage.currency}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                {copy.headers.map((header) => (
                  <th key={header} className="px-0 py-3 pr-4 font-semibold whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-navy">{invoice.courseDetail}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{copy.lineDetail}</p>
                </td>
                <td className="py-4 pr-4 text-slate-700">{invoice.seats}</td>
                <td className="py-4 pr-4 text-slate-700">{invoice.pricePerSeat.toFixed(3)}</td>
                <td className="py-4 font-semibold text-navy">{invoice.amount.toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col items-end gap-1.5 text-sm">
          <div className="flex w-full max-w-xs justify-between gap-6">
            <span className="text-slate-500">{copy.subtotal}</span>
            <span className="font-semibold text-navy">{invoice.amount.toFixed(3)}</span>
          </div>
          <div className="flex w-full max-w-xs justify-between gap-6 border-t border-slate-100 pt-2">
            <span className="font-semibold text-navy">{copy.totalDue}</span>
            <span className="text-base font-bold text-navy">{formatKwd(invoice.amount)}</span>
          </div>
        </div>

        {invoice.status === 'awaiting' ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F5F9FF] p-5">
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-bold text-navy">{copy.bankTitle}</h3>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">{copy.accountName}</dt>
                <dd className="mt-0.5 font-semibold text-navy">
                  {copy.bankDetails.accountName}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{copy.bank}</dt>
                <dd className="mt-0.5 font-semibold text-navy">{copy.bankDetails.bank}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">{copy.iban}</dt>
                <dd className="mt-0.5 font-semibold tracking-wide text-navy">
                  {copy.bankDetails.iban}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">{copy.reference}</dt>
                <dd className="mt-0.5 font-semibold text-navy">
                  {invoice.number}{' '}
                  <span className="font-normal text-slate-500">({copy.referenceHint})</span>
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-slate-500">{copy.bankNote}</p>
          </div>
        ) : null}

        <p className="mt-8 text-center text-sm text-slate-400">{copy.thanks}</p>
      </section>
    </div>
  )
}
