import { useMemo, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'
import {
  formatKwd,
  organizationCartPage,
  type OrganizationCartItem,
} from '@/constants'
import { paths } from '@/routes/paths'
import type { OrganizationOutletContext } from '@/components/common'
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  ChatIcon,
  CheckCircleIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  TrashIcon,
  UsersIcon,
} from '@/components/ui'

const iconMap = {
  megaphone: MegaphoneIcon,
  shield: ShieldCheckIcon,
  badge: BadgeCheckIcon,
  briefcase: BriefcaseIcon,
  alert: AlertTriangleIcon,
  chat: ChatIcon,
} as const

function CartRow({
  item,
  onSeats,
  onRemove,
}: {
  item: OrganizationCartItem
  onSeats: (seats: number) => void
  onRemove: () => void
}) {
  const Icon = iconMap[item.icon]
  const lineTotal = item.unitPrice * item.seats

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 py-5 last:border-0 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-navy">{item.title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {organizationCartPage.meta(item.modules, item.hours, item.cpdHours)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {item.priceLabel} {organizationCartPage.perSeat}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:ml-auto">
        <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            aria-label="Decrease seats"
            onClick={() => onSeats(Math.max(1, item.seats - 1))}
            className="flex h-10 w-9 items-center justify-center text-slate-500 hover:bg-slate-50"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold text-navy">{item.seats}</span>
          <button
            type="button"
            aria-label="Increase seats"
            onClick={() => onSeats(item.seats + 1)}
            className="flex h-10 w-9 items-center justify-center text-slate-500 hover:bg-slate-50"
          >
            +
          </button>
        </div>
        <p className="min-w-[7.5rem] text-right text-sm font-bold text-navy">
          {formatKwd(lineTotal)}
        </p>
        <button
          type="button"
          aria-label={`Remove ${item.title}`}
          onClick={onRemove}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-red-500"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function OrganizationCartPage() {
  const navigate = useNavigate()
  const { cartItems, updateCartSeats, removeFromCart } =
    useOutletContext<OrganizationOutletContext>()
  const [toast, setToast] = useState('')

  const totalSeats = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.seats, 0),
    [cartItems],
  )
  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.seats, 0),
    [cartItems],
  )

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
            {organizationCartPage.eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">{organizationCartPage.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {organizationCartPage.coursesCount(cartItems.length)} ·{' '}
            {organizationCartPage.seatsCount(totalSeats)}
          </p>
        </header>
        <Link
          to={paths.organization.catalog}
          className="text-sm font-semibold text-brand hover:text-blue-700"
        >
          {organizationCartPage.continueShopping}
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-bold text-navy">{organizationCartPage.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-500">{organizationCartPage.emptyBody}</p>
          <Link
            to={paths.organization.catalog}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {organizationCartPage.browseCatalog}
          </Link>
        </section>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_22rem]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:p-6">
            <h2 className="text-base font-bold text-navy">{organizationCartPage.coursesHeading}</h2>
            <div className="mt-1">
              {cartItems.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onSeats={(seats) => updateCartSeats(item.id, seats)}
                  onRemove={() => {
                    removeFromCart(item.id)
                    showToast(organizationCartPage.removedToast)
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-[#EAF2FF]/70 px-4 py-3 text-sm text-slate-600">
              <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <p>{organizationCartPage.assignNote}</p>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-base font-bold text-navy">{organizationCartPage.summaryTitle}</h2>
            <ul className="mt-4 space-y-3">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    {item.shortLabel} × {item.seats}
                  </span>
                  <span className="font-semibold text-navy">
                    {(item.unitPrice * item.seats).toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{organizationCartPage.subtotal}</span>
                <span className="font-semibold text-navy">{formatKwd(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy">{organizationCartPage.total}</span>
                <span className="text-lg font-bold text-navy">{formatKwd(totalAmount)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(paths.organization.checkout)}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
            >
              {organizationCartPage.checkout}
            </button>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{organizationCartPage.benefit}</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
