import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  employeeLogoutModal,
  employeeNavFooter,
  employeeNavGroups,
  employeeNotifications,
  employeeShell,
  employeeUser,
  getEmployeePhotoUrl,
  subscribeEmployeePhoto,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BellIcon,
  BookIcon,
  BuildingIcon,
  ChevronDownIcon,
  ClipboardIcon,
  GearIcon,
  GraduationCapIcon,
  GridIcon,
  HelpCircleIcon,
  LogOutIcon,
  VideoIcon,
} from '@/components/ui'

const navIcons = {
  dashboard: GridIcon,
  courses: BookIcon,
  assessments: ClipboardIcon,
  sessions: VideoIcon,
  certificates: AwardIcon,
  help: HelpCircleIcon,
  profile: GearIcon,
}

function pageTitle(pathname: string) {
  if (pathname === paths.employee.dashboard) return 'Dashboard'
  if (pathname.startsWith(paths.employee.courses)) return 'My Courses'
  if (pathname.startsWith(paths.employee.assessments)) return 'My Assessments'
  if (pathname.startsWith(paths.employee.sessions)) return 'Live Sessions'
  if (pathname.startsWith(paths.employee.certificates)) return 'Certificates & CPD'
  if (pathname === paths.employee.notifications) return 'Notifications'
  if (pathname.startsWith(paths.employee.help)) return 'Help & Support'
  if (pathname === paths.employee.profile) return 'Profile & Settings'
  return 'Dashboard'
}

export function EmployeeLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitle(location.pathname)
  const photoUrl = useSyncExternalStore(subscribeEmployeePhoto, getEmployeePhotoUrl, () => null)
  const [openPanel, setOpenPanel] = useState<'notifications' | null>(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
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

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-slate-900">
      <aside className="sticky top-0 flex h-screen w-[16.5rem] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">
        <Link to={paths.employee.dashboard} className="mb-5 inline-flex items-center gap-3 px-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
            <GraduationCapIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-bold text-navy">MaqSkillz</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              {employeeShell.brandTag}
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="mb-5 flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left"
        >
          <BuildingIcon className="h-4 w-4 text-slate-400" />
          <span className="flex-1 text-sm font-semibold text-navy">{employeeShell.orgName}</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>

        <nav className="flex-1 space-y-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {employeeNavGroups.map((group) => (
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
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOutIcon className="h-4 w-4" />
            {employeeNavFooter.signOut.label}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-6 py-3.5 lg:px-8">
          <div className="text-sm text-slate-400">
            {employeeShell.breadcrumbRoot}
            <span className="mx-1.5">›</span>
            <span className="font-semibold text-navy">{title}</span>
          </div>

          <div className="relative flex items-center gap-3" ref={panelsRef}>
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-navy sm:inline-flex"
            >
              <BuildingIcon className="h-3.5 w-3.5 text-slate-400" />
              {employeeShell.orgName}
              <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
            </button>

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
                  {employeeShell.notificationCount}
                </span>
              </button>
              {openPanel === 'notifications' ? (
                <div className="absolute top-11 right-0 z-30 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-navy">
                      {employeeShell.notificationsTitle}
                    </p>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {employeeNotifications.length ? (
                      employeeNotifications.map((item) => (
                        <li
                          key={item.id}
                          className={`border-b border-slate-50 px-4 py-3 last:border-0 ${
                            item.unread ? 'bg-[#F5F9FF]' : ''
                          }`}
                        >
                          <p className="text-sm font-semibold text-navy">{item.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-6 text-sm text-slate-500">
                        {employeeShell.notificationsEmpty}
                      </li>
                    )}
                  </ul>
                  <div className="border-t border-slate-100 p-3">
                    <Link
                      to={paths.employee.notifications}
                      onClick={() => setOpenPanel(null)}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {employeeShell.notificationsView}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => navigate(paths.employee.profile)}
              className="flex items-center gap-2.5 rounded-full py-1 pr-1 pl-1 hover:bg-slate-50 sm:pl-2"
            >
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold text-navy">{employeeUser.name}</span>
                <span className="block text-xs text-slate-400">{employeeUser.role}</span>
              </span>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                  {employeeUser.initials}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {logoutOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setLogoutOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-logout-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,40,80,0.18)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <LogOutIcon className="h-5 w-5" />
            </div>
            <h2 id="employee-logout-title" className="mt-4 text-xl font-bold text-navy">
              {employeeLogoutModal.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {employeeLogoutModal.body}
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {employeeLogoutModal.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutOpen(false)
                  navigate(employeeNavFooter.signOut.to)
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-500 hover:bg-red-100"
              >
                <LogOutIcon className="h-4 w-4" />
                {employeeLogoutModal.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
