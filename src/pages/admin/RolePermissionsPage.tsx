import { Fragment, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { CheckIcon, PlusIcon } from '@/components/ui'
import { paths } from '@/routes/paths'
import { btnPrimary, cardClass } from './catalogUtils'

type RoleId = 'super' | 'content' | 'org' | 'employee' | 'student'
type Cell = 'yes' | 'no' | string

const ROLES: { id: RoleId; name: string; description: string; count: number }[] = [
  { id: 'super', name: 'Super Admin', description: 'Owner-level access, finance and settings', count: 2 },
  { id: 'content', name: 'Content Update Admin', description: 'Creates, edits and publishes courses directly', count: 6 },
  { id: 'org', name: 'Organization Admin', description: "Manages one organization's seats and employees", count: 146 },
  { id: 'employee', name: 'Employee', description: 'Learns on seats assigned by their organization', count: 7385 },
  { id: 'student', name: 'Student', description: 'Buys and takes courses individually', count: 18904 },
]

const COLUMNS: { id: RoleId; label: string }[] = [
  { id: 'super', label: 'Super Admin' },
  { id: 'content', label: 'Content Admin' },
  { id: 'org', label: 'Org Admin' },
  { id: 'employee', label: 'Employee' },
  { id: 'student', label: 'Student' },
]

const MATRIX: { group: string; rows: { permission: string; cells: Record<RoleId, Cell> }[] }[] = [
  {
    group: 'Courses & content',
    rows: [
      { permission: 'Create, edit and publish courses', cells: { super: 'yes', content: 'yes', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'Archive or delete courses (retention rules)', cells: { super: 'yes', content: 'yes', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'Manage SCORM, quizzes and final assessments', cells: { super: 'yes', content: 'yes', org: 'no', employee: 'no', student: 'no' } },
    ],
  },
  {
    group: 'Business & learners',
    rows: [
      { permission: 'Set course CPD requirements', cells: { super: 'yes', content: 'yes', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'Set course prices and coupons', cells: { super: 'yes', content: 'yes', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'View executive dashboard and finance', cells: { super: 'yes', content: 'no', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'Issue refunds', cells: { super: 'yes', content: 'no', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'Manage organizations and plans', cells: { super: 'yes', content: 'no', org: 'Own org', employee: 'no', student: 'no' } },
      { permission: 'Buy seats and assign employees', cells: { super: 'yes', content: 'no', org: 'Own org', employee: 'no', student: 'no' } },
      {
        permission: 'View learner records (audited)',
        cells: { super: 'yes', content: 'Q&A only', org: 'Own employees', employee: 'Self', student: 'Self' },
      },
    ],
  },
  {
    group: 'Learning',
    rows: [{ permission: 'Take courses and earn certificates', cells: { super: 'no', content: 'no', org: 'no', employee: 'yes', student: 'yes' } }],
  },
  {
    group: 'System',
    rows: [
      { permission: 'Platform settings and integrations', cells: { super: 'yes', content: 'no', org: 'no', employee: 'no', student: 'no' } },
      { permission: 'Manage staff accounts and roles', cells: { super: 'yes', content: 'no', org: 'no', employee: 'no', student: 'no' } },
    ],
  },
]

const TABS = [
  { label: 'Administrator accounts', to: paths.admin.admins },
  { label: 'Content Admin accounts', to: paths.admin.contentAdmins },
  { label: 'Role permissions', to: paths.admin.roles },
  { label: 'Account status', to: paths.admin.accountStatus },
]

function CellView({ value }: { value: Cell }) {
  if (value === 'yes') {
    return (
      <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
        <CheckIcon className="h-3 w-3" />
      </span>
    )
  }
  if (value === 'no') return <span className="text-sm text-slate-300">—</span>
  return <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{value}</span>
}

export function AdminRolePermissionsPage() {
  const [selected, setSelected] = useState<RoleId>('content')

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Users & Permissions
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Role Permissions</span>
          </p>
          <h1 className="mt-2 text-[28px] leading-8 font-bold tracking-tight text-navy">Users & Permissions</h1>
          <p className="mt-1.5 text-sm text-slate-500">Staff accounts and what each of the five MaqSkillz roles can do.</p>
        </div>
        <Link to={paths.admin.contentAdmins} className={btnPrimary}>
          <PlusIcon className="h-4 w-4" />
          Invite Content Admin
        </Link>
      </header>

      <nav className="flex gap-6 border-b border-slate-200">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `-mb-px border-b-2 pb-2.5 text-sm font-semibold ${
                isActive ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-navy'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <section>
          <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">Roles</p>
          <ul className="space-y-2">
            {ROLES.map((role) => {
              const active = role.id === selected
              return (
                <li key={role.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(role.id)}
                    className={`${cardClass} flex w-full items-start justify-between gap-3 px-3.5 py-3 text-left ${
                      active ? 'border-brand ring-1 ring-brand' : ''
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-navy">{role.name}</span>
                      <span className="mt-0.5 block text-xs leading-4 text-slate-500">{role.description}</span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                        active ? 'bg-blue-50 text-brand' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {role.count.toLocaleString('en-US')}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-grid h-4 w-4 place-items-center rounded-full border border-slate-300 text-[10px]">i</span>
            There is no Instructor role.
          </p>
        </section>

        <section className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                  <th className="px-4 py-3 font-semibold">Permission</th>
                  {COLUMNS.map((column) => (
                    <th
                      key={column.id}
                      className={`px-3 py-3 text-center font-semibold ${column.id === selected ? 'text-brand' : ''}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((group) => (
                  <Fragment key={group.group}>
                    <tr className="bg-slate-50/80">
                      <td colSpan={6} className="px-4 py-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.permission} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-sm text-navy">{row.permission}</td>
                        {COLUMNS.map((column) => (
                          <td
                            key={column.id}
                            className={`px-3 py-3 text-center ${column.id === selected ? 'bg-blue-50/50' : ''}`}
                          >
                            <span className="inline-flex justify-center">
                              <CellView value={row.cells[column.id]} />
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
            Content Admins publish without Super Admin approval. Every publish, edit and archive is recorded in the admin activity log.
          </p>
        </section>
      </div>
    </div>
  )
}
