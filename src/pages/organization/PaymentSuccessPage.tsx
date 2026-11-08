import { useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import {
  formatKwd,
  organizationCheckoutPage,
  organizationPaymentSuccessPage,
} from '@/constants'
import { paths } from '@/routes/paths'
import type { OrganizationOutletContext } from '@/components/common'
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  ChatIcon,
  CheckCircleIcon,
  CheckIcon,
  DownloadIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
} from '@/components/ui'

const iconMap = {
  megaphone: MegaphoneIcon,
  shield: ShieldCheckIcon,
  badge: BadgeCheckIcon,
  briefcase: BriefcaseIcon,
  alert: AlertTriangleIcon,
  chat: ChatIcon,
} as const

function StepperDone() {
  const steps = [
    { id: 1, label: organizationCheckoutPage.steps.cart, done: true },
    { id: 2, label: organizationCheckoutPage.steps.details, done: true },
    { id: 3, label: organizationCheckoutPage.steps.done, active: true },
  ]

  return (
    <ol className="flex flex-wrap items-center justify-center gap-3">
      {steps.map((step, index) => (
        <li key={step.id} className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step.active ? 'bg-brand text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {step.done && !step.active ? <CheckIcon className="h-4 w-4" /> : step.id}
            </span>
            <span
              className={`text-sm font-semibold ${step.active ? 'text-navy' : 'text-slate-600'}`}
            >
              {step.label}
            </span>
          </span>
          {index < steps.length - 1 ? (
            <span className="hidden h-px w-8 bg-slate-200 sm:block" />
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export function OrganizationPaymentSuccessPage() {
  const { lastOrder } = useOutletContext<OrganizationOutletContext>()
  const [toast, setToast] = useState('')

  if (!lastOrder) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
        <h1 className="text-2xl font-bold text-navy">{organizationPaymentSuccessPage.title}</h1>
        <p className="mt-2 text-sm text-slate-500">No recent payment found.</p>
        <Link
          to={paths.organization.catalog}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <StepperDone />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircleIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-navy">
            {organizationPaymentSuccessPage.title}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            {organizationPaymentSuccessPage.subtitle}
          </p>
        </div>

        <dl className="mt-6 space-y-3 rounded-xl bg-slate-50 px-4 py-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">{organizationPaymentSuccessPage.order}</dt>
            <dd className="font-semibold text-navy">{lastOrder.orderId}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">{organizationPaymentSuccessPage.date}</dt>
            <dd className="font-semibold text-navy">{lastOrder.date}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">{organizationPaymentSuccessPage.paidWith}</dt>
            <dd className="font-semibold text-navy">{lastOrder.paymentLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">{organizationPaymentSuccessPage.totalPaid}</dt>
            <dd className="font-semibold text-navy">{formatKwd(lastOrder.total)}</dd>
          </div>
        </dl>

        <ul className="mt-5 divide-y divide-slate-100">
          {lastOrder.items.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li key={item.id} className="flex items-center gap-3 py-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy">{item.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {organizationPaymentSuccessPage.seatsLine(
                      item.seats,
                      item.totalSeats,
                      item.freeSeats,
                    )}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {organizationPaymentSuccessPage.ready}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setToast(organizationPaymentSuccessPage.invoiceToast)
              window.setTimeout(() => setToast(''), 2200)
            }}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            {organizationPaymentSuccessPage.downloadInvoice}
          </button>
          <Link
            to={paths.organization.purchased}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
          >
            {organizationPaymentSuccessPage.assignSeats}
          </Link>
        </div>
      </section>
    </div>
  )
}
