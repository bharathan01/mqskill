import { NavLink, Outlet } from 'react-router'
import { APP_NAME, roleLabels, roleNav } from '@/constants'
import { paths } from '@/routes/paths'

type Role = keyof typeof roleNav

type RoleLayoutProps = {
  role: Role
}

export function RoleLayout({ role }: RoleLayoutProps) {
  const links = roleNav[role]

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <aside className="flex w-64 flex-col border-r border-slate-200 px-4 py-6">
        <NavLink to={paths.home} className="mb-8 px-3 text-lg font-semibold text-slate-900">
          {APP_NAME}
        </NavLink>
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
          {roleLabels[role]}
        </p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
