import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  normalizeAdminPath,
  superAdminNavSections,
  superAdminPageTitle,
  superAdminShell,
  type SuperAdminNavIcon,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BellIcon,
  BookIcon,
  BuildingIcon,
  ChartIcon,
  ChatIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CreditCardIcon,
  GearIcon,
  GraduationCapIcon,
  GridIcon,
  HelpCircleIcon,
  LogOutIcon,
  MegaphoneIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
} from '@/components/ui'

const navIcons: Record<SuperAdminNavIcon, ComponentType<{ className?: string }>> = {
  dashboard: GridIcon,
  courses: BookIcon,
  assessments: ClipboardIcon,
  certificates: AwardIcon,
  live: VideoIcon,
  students: GraduationCapIcon,
  organizations: BuildingIcon,
  sales: CreditCardIcon,
  announcements: MegaphoneIcon,
  support: ChatIcon,
  reports: ChartIcon,
  users: UsersIcon,
  settings: GearIcon,
}

function groupMatchesPath(pathname: string, childPaths: string[]) {
  const current = normalizeAdminPath(pathname)
  return childPaths.some((to) => current === to)
}

export function SuperAdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = superAdminPageTitle(location.pathname)

  const allGroups = useMemo(
    () => superAdminNavSections.flatMap((section) => section.groups),
    [],
  )

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ dashboard: true })

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current }
      for (const group of allGroups) {
        const childPaths = group.children.map((child) => child.to)
        if (groupMatchesPath(location.pathname, childPaths)) next[group.id] = true
      }
      return next
    })
  }, [allGroups, location.pathname])

  const activeGroupId = useMemo(() => {
    for (const group of allGroups) {
      if (groupMatchesPath(location.pathname, group.children.map((child) => child.to))) {
        return group.id
      }
    }
    return null
  }, [allGroups, location.pathname])

  function toggleGroup(id: string) {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-slate-900">
      <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col justify-between bg-[#0F2340] px-3.5 pt-5 pb-3.5 text-white">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link to={paths.admin.dashboard} className="mb-2 flex items-center gap-2.5 px-2 pb-4">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#61A6FA] to-[#2563EB] text-base font-semibold text-white">
              M
            </span>
            <span>
              <span className="block text-base font-semibold tracking-tight text-white">
                {superAdminShell.brand}
              </span>
              <span className="block text-xs font-medium text-[#B6C3D7]">
                {superAdminShell.brandTag}
              </span>
            </span>
          </Link>

          <nav className="space-y-0.5">
            {superAdminNavSections.map((section) => (
              <div key={section.id}>
                <p className="px-2.5 pt-3 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-[#B6C3D7] uppercase">
                  {section.label}
                </p>
                {section.groups.map((group) => {
                  const Icon = navIcons[group.icon]
                  const open = Boolean(openGroups[group.id])
                  const parentActive = activeGroupId === group.id

                  return (
                    <div key={group.id}>
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                          parentActive
                            ? 'bg-[#1A365D] font-semibold text-white'
                            : 'font-medium text-[#B6C3D7] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="min-w-0 flex-1">{group.label}</span>
                        <ChevronDownIcon
                          className={`h-3.5 w-3.5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {open ? (
                        <div className="mt-0.5 mb-1.5 space-y-px pl-7">
                          {group.children.map((child) => (
                            <NavLink
                              key={child.id}
                              to={child.to}
                              end
                              className={({ isActive }) =>
                                `block rounded-lg px-3 py-[7px] text-sm transition ${
                                  isActive
                                    ? 'bg-[#2563EB] font-semibold text-white'
                                    : 'font-normal text-[#B6C3D7] hover:bg-white/5 hover:text-white'
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-3 space-y-0.5 border-t border-[#24406A] pt-2.5">
          <NavLink
            to={paths.admin.profile}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive ? 'bg-[#2563EB] text-white' : 'text-[#B6C3D7] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <UserIcon className="h-[18px] w-[18px]" />
            {superAdminShell.profile}
          </NavLink>
          <NavLink
            to={paths.admin.help}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive ? 'bg-[#2563EB] text-white' : 'text-[#B6C3D7] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <HelpCircleIcon className="h-[18px] w-[18px]" />
            {superAdminShell.help}
          </NavLink>
          <button
            type="button"
            onClick={() => navigate(paths.admin.login)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#FDEEEE] hover:bg-white/5"
          >
            <LogOutIcon className="h-[18px] w-[18px]" />
            {superAdminShell.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6 lg:px-8">
          <div className="shrink-0 text-sm text-slate-400">
            {superAdminShell.breadcrumbRoot}
            <span className="mx-1.5">/</span>
            <span className="font-semibold text-navy">{title}</span>
          </div>

          <label className="relative mx-auto hidden min-w-0 max-w-xl flex-1 md:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={superAdminShell.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-14 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
            />
            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
              {superAdminShell.searchShortcut}
            </span>
          </label>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Help"
              onClick={() => navigate(paths.admin.help)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            >
              <HelpCircleIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate(paths.admin.notifications)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {superAdminShell.notifications}
              </span>
            </button>
            <span className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />
            <button
              type="button"
              onClick={() => navigate(paths.admin.profile)}
              className="flex items-center gap-2.5 rounded-full py-1 pr-1 pl-1 hover:bg-slate-50 sm:pl-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                {superAdminShell.initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-navy">
                  {superAdminShell.userName}
                </span>
                <span className="block text-xs text-slate-400">{superAdminShell.userOrg}</span>
              </span>
              <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
