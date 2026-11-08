import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  organizationCartSeed,
  organizationNavFooter,
  organizationNavGroups,
  organizationNotifications,
  organizationShell,
  organizationUser,
  type OrganizationCartItem,
  type OrganizationOrder,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  BellIcon,
  BookIcon,
  CartIcon,
  ChartIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CreditCardIcon,
  GearIcon,
  GraduationCapIcon,
  GridIcon,
  HelpCircleIcon,
  LayersIcon,
  LogOutIcon,
  MegaphoneIcon,
  SearchIcon,
  UsersIcon,
} from '@/components/ui'

export type { OrganizationCartItem }

export type OrganizationOutletContext = {
  cartItems: OrganizationCartItem[]
  lastOrder: OrganizationOrder | null
  addToCart: (item: OrganizationCartItem) => void
  updateCartSeats: (id: string, seats: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  setLastOrder: (order: OrganizationOrder | null) => void
  openCart: () => void
}

const navIcons = {
  dashboard: GridIcon,
  employees: UsersIcon,
  requests: ClipboardIcon,
  catalog: BookIcon,
  purchased: LayersIcon,
  reports: ChartIcon,
  announcements: MegaphoneIcon,
  billing: CreditCardIcon,
  settings: GearIcon,
  help: HelpCircleIcon,
}

function pageTitle(pathname: string) {
  if (pathname === paths.organization.dashboard) return 'Dashboard'
  if (pathname.startsWith(`${paths.organization.employees}/`)) return 'Employees'
  if (pathname === paths.organization.requests) return 'Training requests'
  if (pathname === paths.organization.catalog) return 'Course catalog'
  if (pathname === paths.organization.cart) return 'Cart'
  if (pathname === paths.organization.checkout) return 'Checkout'
  if (pathname === paths.organization.paymentSuccess) return 'Checkout'
  if (
    pathname === paths.organization.purchased ||
    pathname.startsWith(`${paths.organization.purchased}/`)
  ) {
    return 'Purchased courses'
  }
  if (pathname === paths.organization.reports) return 'Reports & analytics'
  if (pathname === paths.organization.newAnnouncement) return 'Announcements'
  if (pathname === paths.organization.announcements) return 'Announcements'
  if (
    pathname === paths.organization.billing ||
    pathname.startsWith(`${paths.organization.billing}/`)
  ) {
    return 'Billing & invoices'
  }
  if (pathname === paths.organization.settings) return 'Organization settings'
  if (
    pathname === paths.organization.help ||
    pathname.startsWith(`${paths.organization.help}/`)
  ) {
    return 'Help & support'
  }
  const match = Object.values(paths.organization).find(
    (path) =>
      path !== paths.organization.root &&
      !path.includes(':') &&
      path === pathname,
  )
  if (!match) return 'Dashboard'
  const label = match.split('/').pop()?.replace(/-/g, ' ') ?? 'Dashboard'
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function OrganizationLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitle(location.pathname)
  const [openPanel, setOpenPanel] = useState<'notifications' | null>(null)
  const [cartItems, setCartItems] = useState<OrganizationCartItem[]>(() => [
    ...organizationCartSeed,
  ])
  const [lastOrder, setLastOrder] = useState<OrganizationOrder | null>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!panelsRef.current?.contains(event.target as Node)) {
        setOpenPanel(null)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function addToCart(item: OrganizationCartItem) {
    setCartItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, seats: entry.seats + (item.seats || 1) }
            : entry,
        )
      }
      return [{ ...item, seats: item.seats || 1 }, ...current]
    })
  }

  function updateCartSeats(id: string, seats: number) {
    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, seats: Math.max(1, seats) } : item)),
    )
  }

  function removeFromCart(id: string) {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  function clearCart() {
    setCartItems([])
  }

  function openCart() {
    navigate(paths.organization.cart)
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-slate-900">
      <aside className="sticky top-0 flex h-screen w-[16.5rem] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">
        <Link to={paths.organization.dashboard} className="mb-5 inline-flex items-center gap-3 px-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
            <GraduationCapIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-bold text-navy">MaqSkillz</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              {organizationShell.brandTag}
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="mb-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left"
        >
          <span>
            <span className="block text-[11px] font-medium text-slate-400">Organization</span>
            <span className="block text-sm font-semibold text-navy">
              {organizationShell.orgName}
            </span>
          </span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>

        <nav className="flex-1 space-y-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {organizationNavGroups.map((group) => (
            <div key={group.id}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = navIcons[link.icon]
                  return (
                    <NavLink
                      key={link.id}
                      to={link.to}
                      end={'end' in link ? link.end : false}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? 'bg-brand text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`}
                          />
                          <span>{link.label}</span>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <Link
            to={organizationNavFooter.signOut.to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOutIcon className="h-4 w-4" />
            {organizationNavFooter.signOut.label}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-slate-200/80 bg-white px-6 py-3.5 lg:px-8">
          <div className="hidden min-w-[10rem] text-sm text-slate-400 lg:block">
            {organizationShell.orgName}
            <span className="mx-1.5">›</span>
            <span className="font-semibold text-navy">{title}</span>
          </div>

          <form className="relative mx-auto min-w-0 max-w-xl flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={organizationShell.searchPlaceholder}
              className="h-10 w-full rounded-full border border-slate-200 bg-[#F8FAFC] pr-4 pl-11 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white"
            />
          </form>

          <div className="relative flex items-center gap-3" ref={panelsRef}>
            <Link
              to={paths.organization.cart}
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-50"
              aria-label="Cart"
            >
              <CartIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {cartItems.length}
              </span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenPanel((current) => (current === 'notifications' ? null : 'notifications'))
                }
                className="relative rounded-full p-2 text-slate-500 hover:bg-slate-50"
                aria-expanded={openPanel === 'notifications'}
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {organizationNotifications.filter((item) => item.unread).length}
                </span>
              </button>
              {openPanel === 'notifications' ? (
                <div className="absolute top-full right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,40,80,0.14)]">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-navy">
                      {organizationShell.notificationsTitle}
                    </p>
                  </div>
                  {organizationNotifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-slate-500">
                      {organizationShell.notificationsEmpty}
                    </p>
                  ) : (
                    <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                      {organizationNotifications.map((item) => (
                        <li key={item.id} className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            {item.unread ? (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                            ) : (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent" />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-navy">{item.title}</p>
                              <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.detail}</p>
                              <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="border-t border-slate-100 p-3">
                    <Link
                      to={paths.organization.announcements}
                      onClick={() => setOpenPanel(null)}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {organizationShell.notificationsView}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pr-3 pl-1 sm:inline-flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {organizationUser.initials}
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold leading-4 text-slate-900">
                  {organizationUser.name}
                </span>
                <span className="text-[11px] text-slate-400">{organizationUser.role}</span>
              </span>
              <ChevronDownIcon className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <Outlet
            context={
              {
                cartItems,
                lastOrder,
                addToCart,
                updateCartSeats,
                removeFromCart,
                clearCart,
                setLastOrder,
                openCart,
              } satisfies OrganizationOutletContext
            }
          />
        </main>
      </div>
    </div>
  )
}
