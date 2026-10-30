import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import logo from '@/assets/logo.png'
import {
  APP_NAME,
  browseLinks,
  currentLanguage,
  notificationCount,
  searchPlaceholder,
} from '@/constants'
import { paths } from '@/routes/paths'
import { BrowseMenu } from '@/components/common/BrowseMenu'
import {
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  GlobeIcon,
  MenuIcon,
  SearchIcon,
} from '@/components/ui'

export function Header() {
  const [browseOpen, setBrowseOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setBrowseOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setBrowseOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white"
    >
      <div className="relative mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
      <div className="flex h-[72px] items-center gap-6">
        <Link
          to={paths.home}
          className="relative isolate flex h-12 w-[150px] shrink-0 items-center overflow-hidden sm:h-[52px] sm:w-[168px]"
        >
          <img
            src={logo}
            alt={APP_NAME}
            className="pointer-events-none h-full w-full scale-[1.85] object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-slate-800"
            aria-expanded={browseOpen}
            aria-haspopup="menu"
            onClick={() => setBrowseOpen((open) => !open)}
          >
            Browse
            <ChevronDownIcon className="h-4 w-4 text-slate-500" />
          </button>
          <NavLink
            to={paths.business}
            className="text-sm font-medium text-slate-800"
          >
            For Business
          </NavLink>
        </nav>

        <form
          action={paths.courses}
          method="get"
          className="relative mx-auto hidden min-w-0 flex-1 max-w-[520px] md:block"
        >
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="q"
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-full bg-slate-100 pr-4 pl-11 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-brand/20"
          />
        </form>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-700 md:flex"
          >
            <GlobeIcon className="h-4 w-4" />
            {currentLanguage}
          </button>

          <button type="button" className="relative hidden text-slate-700 sm:inline-flex">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          </button>

          <Link
            to={paths.login}
            className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            to={paths.signup}
            className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white sm:inline-flex hover:bg-blue-700"
          >
            Sign up
          </Link>

          <button
            type="button"
            className="inline-flex text-slate-800 md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

        {browseOpen ? (
          <div className="absolute inset-x-0 top-full z-30 hidden pt-2 pb-6 md:block">
            <BrowseMenu onNavigate={() => setBrowseOpen(false)} />
          </div>
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <form action={paths.courses} method="get" className="relative mb-4 md:hidden">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-full bg-slate-100 pr-4 pl-11 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {browseLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={paths.business}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              For Business
            </NavLink>
            <NavLink
              to={paths.login}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 sm:hidden"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </NavLink>
            <NavLink
              to={paths.signup}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-brand sm:hidden"
              onClick={() => setMobileOpen(false)}
            >
              Sign up
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
