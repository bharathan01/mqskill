import { useMemo, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'
import {
  buildOrderFromCart,
  formatKwd,
  organizationCheckoutPage,
  type CheckoutPaymentMethod,
} from '@/constants'
import { paths } from '@/routes/paths'
import type { OrganizationOutletContext } from '@/components/common'
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  ChatIcon,
  CheckIcon,
  LockIcon,
  MapPinIcon,
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

const paymentOptions: Array<{
  id: CheckoutPaymentMethod
  label: string
  description: string
  instant?: boolean
}> = [
  {
    id: 'knet',
    label: organizationCheckoutPage.methods.knet.label,
    description: organizationCheckoutPage.methods.knet.description,
    instant: true,
  },
  {
    id: 'card',
    label: organizationCheckoutPage.methods.card.label,
    description: organizationCheckoutPage.methods.card.description,
    instant: true,
  },
  {
    id: 'transfer',
    label: organizationCheckoutPage.methods.transfer.label,
    description: organizationCheckoutPage.methods.transfer.description,
  },
]

function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { id: 1, label: organizationCheckoutPage.steps.cart },
    { id: 2, label: organizationCheckoutPage.steps.details },
    { id: 3, label: organizationCheckoutPage.steps.done },
  ]

  return (
    <ol className="mt-5 flex flex-wrap items-center gap-3">
      {steps.map((step, index) => {
        const done = current > step.id
        const active = current === step.id
        return (
          <li key={step.id} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-brand text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <CheckIcon className="h-4 w-4" /> : step.id}
              </span>
              <span
                className={`text-sm font-semibold ${
                  active ? 'text-navy' : done ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </span>
            {index < steps.length - 1 ? (
              <span className="hidden h-px w-8 bg-slate-200 sm:block" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export function OrganizationCheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart, setLastOrder } = useOutletContext<OrganizationOutletContext>()
  const [email, setEmail] = useState<string>(organizationCheckoutPage.defaults.email)
  const [address, setAddress] = useState<string>(organizationCheckoutPage.defaults.address)
  const [poNumber, setPoNumber] = useState<string>(organizationCheckoutPage.defaults.poNumber)
  const [method, setMethod] = useState<CheckoutPaymentMethod>('knet')
  const [agreed, setAgreed] = useState(true)
  const [error, setError] = useState('')

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.seats, 0),
    [cartItems],
  )

  function handlePay() {
    if (!agreed) {
      setError(organizationCheckoutPage.agreeRequired)
      return
    }
    if (cartItems.length === 0) return

    const paymentLabel = organizationCheckoutPage.methods[method].label
    const order = buildOrderFromCart(cartItems, method, paymentLabel)
    setLastOrder(order)
    clearCart()
    navigate(paths.organization.paymentSuccess)
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
        <h1 className="text-2xl font-bold text-navy">{organizationCheckoutPage.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{organizationCheckoutPage.emptyCart}</p>
        <Link
          to={paths.organization.cart}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {organizationCheckoutPage.backToCart}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-navy">{organizationCheckoutPage.title}</h1>
        <Stepper current={2} />
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_22rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:p-6">
            <h2 className="text-base font-bold text-navy">
              {organizationCheckoutPage.billingTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {organizationCheckoutPage.company}
                </span>
                <span className="relative block">
                  <input
                    type="text"
                    value={organizationCheckoutPage.defaults.company}
                    readOnly
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pr-10 pl-3 text-sm text-slate-600 outline-none"
                  />
                  <LockIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {organizationCheckoutPage.billingEmail}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {organizationCheckoutPage.address}
                </span>
                <span className="relative block">
                  <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-800 outline-none focus:border-brand"
                  />
                </span>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {organizationCheckoutPage.poNumber}
                </span>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(event) => setPoNumber(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:p-6">
            <h2 className="text-base font-bold text-navy">
              {organizationCheckoutPage.paymentTitle}
            </h2>
            <div className="mt-4 space-y-3">
              {paymentOptions.map((option) => {
                const selected = method === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMethod(option.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                      selected
                        ? 'border-brand bg-[#EAF2FF]/50 ring-1 ring-brand/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected ? 'border-brand' : 'border-slate-300'
                      }`}
                    >
                      {selected ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-navy">{option.label}</span>
                        {option.instant ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            {organizationCheckoutPage.instant}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">{option.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] xl:sticky xl:top-6">
          <h2 className="text-base font-bold text-navy">{organizationCheckoutPage.summaryTitle}</h2>
          <ul className="mt-4 space-y-3">
            {cartItems.map((item) => {
              const Icon = iconMap[item.icon]
              return (
                <li key={item.id} className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy">{item.title}</span>
                    <span className="text-xs text-slate-500">× {item.seats}</span>
                  </span>
                  <span className="text-sm font-semibold text-navy">
                    {(item.unitPrice * item.seats).toFixed(3)}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{organizationCheckoutPage.subtotal}</span>
              <span className="font-semibold text-navy">{formatKwd(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy">{organizationCheckoutPage.totalToPay}</span>
              <span className="text-lg font-bold text-navy">{formatKwd(totalAmount)}</span>
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked)
                if (event.target.checked) setError('')
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand"
            />
            <span>{organizationCheckoutPage.agree}</span>
          </label>
          {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}

          <button
            type="button"
            onClick={handlePay}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
          >
            <LockIcon className="h-4 w-4" />
            {organizationCheckoutPage.pay(formatKwd(totalAmount))}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            {organizationCheckoutPage.secureNote}
          </p>
        </aside>
      </div>
    </div>
  )
}
