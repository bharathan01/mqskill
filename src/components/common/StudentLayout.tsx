import { Link, NavLink, Outlet } from 'react-router'
import logo from '@/assets/logo.png'
import {
  APP_NAME,
  studentNavFooter,
  studentNavLinks,
  studentShell,
  studentUser,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BellIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LayersIcon,
  GearIcon,
  GlobeIcon,
  GridIcon,
  HelpCircleIcon,
  LogOutIcon,
  SearchIcon,
  UserIcon,
} from '@/components/ui'

const navIcons = {
  dashboard: GridIcon,
  courses: LayersIcon,
  certificates: AwardIcon,
  payments: CreditCardIcon,
  profile: UserIcon,
  settings: GearIcon,
  language: GlobeIcon,
}

export function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-slate-900">
      <aside className="sticky top-0 flex h-screen w-[15.5rem] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">
        <Link
          to={paths.home}
          className="relative isolate mb-6 flex h-11 w-[150px] items-center overflow-hidden"
        >
          <img
            src={logo}
            alt={APP_NAME}
            className="pointer-events-none h-full w-full scale-[1.85] object-contain"
          />
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {studentNavLinks.map((link) => {
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
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="flex-1">{link.label}</span>
                    {'badge' in link ? (
                      <span
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'
                        }`}
                      >
                        {link.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
          <NavLink
            to={studentNavFooter.help.to}
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
                <HelpCircleIcon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {studentNavFooter.help.label}
              </>
            )}
          </NavLink>
          <Link
            to={studentNavFooter.signOut.to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOutIcon className="h-4 w-4" />
            {studentNavFooter.signOut.label}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 px-6 py-4 lg:px-8">
          <form action={paths.student.courses} method="get" className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder={studentShell.searchPlaceholder}
              className="h-11 w-full rounded-full border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </form>
          <Link
            to={studentShell.browseTo}
            className="hidden shrink-0 text-sm font-semibold text-brand md:inline-flex"
          >
            {studentShell.browse}
          </Link>
          <button type="button" className="relative shrink-0 text-slate-500">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 shadow-sm sm:inline-flex"
          >
            <img
              src={studentUser.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-left">
              <span className="block text-sm font-semibold leading-4 text-slate-900">
                {studentUser.name}
              </span>
              <span className="text-[11px] text-slate-400">{studentShell.accountType}</span>
            </span>
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>
        </header>
        <main className="flex-1 px-6 pb-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
