import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentBadge, ContentNotice, ContentTextInput } from '@/components/common'
import { CheckIcon, ClockIcon, PlusIcon } from '@/components/ui'
import { paths } from '@/routes/paths'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { isValidEmail, UsersField, UsersPerson } from './usersShared'

type ContentAdmin = {
  id: string
  name: string
  email: string
  owned: number
  published: number
  drafts: number
  qa: string
  qaSlow?: boolean
  lastActive: string
  status: 'Active' | 'Invited'
}

const INITIAL: ContentAdmin[] = [
  { id: 'ca-1', name: 'Sara Mahmoud', email: 'sara@maqskillz.com', owned: 42, published: 3, drafts: 3, qa: '4 h', lastActive: 'Today', status: 'Active' },
  { id: 'ca-2', name: 'Omar Haddad', email: 'omar@maqskillz.com', owned: 38, published: 2, drafts: 2, qa: '7 h', lastActive: 'Today', status: 'Active' },
  { id: 'ca-3', name: 'Lina Farouk', email: 'lina@maqskillz.com', owned: 30, published: 1, drafts: 3, qa: '19 h', qaSlow: true, lastActive: 'Yesterday', status: 'Active' },
  { id: 'ca-4', name: 'Yousef Ali', email: 'yousef@maqskillz.com', owned: 18, published: 0, drafts: 3, qa: '11 h', lastActive: '3 days ago', status: 'Active' },
  { id: 'ca-5', name: 'Reem K.', email: 'reem@maqskillz.com', owned: 0, published: 0, drafts: 0, qa: '—', lastActive: 'Never', status: 'Invited' },
]

const CAN: { ok: boolean; title: string; detail?: string }[] = [
  { ok: true, title: 'Create, edit and publish courses', detail: 'No Super Admin approval needed' },
  { ok: true, title: 'Manage SCORM, quizzes and final assessments' },
  { ok: false, title: 'No access to finance or platform settings' },
]

export function AdminContentAdminAccountsPage() {
  const [rows, setRows] = useState<ContentAdmin[]>(INITIAL)
  const [inviting, setInviting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const active = rows.filter((row) => row.status === 'Active')
    return {
      admins: active.length,
      owned: rows.reduce((sum, row) => sum + row.owned, 0),
      published: rows.reduce((sum, row) => sum + row.published, 0),
      pending: rows.filter((row) => row.status === 'Invited').length,
    }
  }, [rows])

  const send = () => {
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (cleanName.length < 2) return setError('Enter the content admin’s name.')
    if (!isValidEmail(cleanEmail)) return setError('Enter a work email like name@maqskillz.com.')
    if (rows.some((row) => row.email === cleanEmail)) return setError(`${cleanEmail} already has an account.`)
    setRows((current) => [
      ...current,
      { id: `ca-${current.length + 1}`, name: cleanName, email: cleanEmail, owned: 0, published: 0, drafts: 0, qa: '—', lastActive: 'Never', status: 'Invited' },
    ])
    setName('')
    setEmail('')
    setError(null)
    setInviting(false)
    setNotice(`Invite sent to ${cleanEmail}.`)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Users & Permissions
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Content Admin Accounts</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Content Admin Accounts</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">Content Update Admins create, edit and publish courses.</p>
        </div>
        <button type="button" className={btnPrimary} onClick={() => setInviting((open) => !open)}>
          <PlusIcon className="h-4 w-4" />
          Invite Content Admin
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {inviting ? (
        <section className={`${cardClass} p-4`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <UsersField label="Name">
              <ContentTextInput value={name} invalid={!!error} onChange={(event) => setName(event.target.value)} placeholder="e.g. Huda Al-Sabah" />
            </UsersField>
            <UsersField label="Work email">
              <ContentTextInput value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@maqskillz.com" />
            </UsersField>
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
          <div className="mt-4 flex gap-2.5">
            <button type="button" className={btnPrimary} onClick={send}>
              Send invite
            </button>
            <button
              type="button"
              className={btnOutline}
              onClick={() => {
                setInviting(false)
                setError(null)
              }}
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Content Admins', value: String(kpis.admins), tone: 'text-navy' },
          { label: 'Courses owned', value: String(kpis.owned), tone: 'text-navy' },
          { label: 'Published in last 30 days', value: String(kpis.published), tone: 'text-navy' },
          { label: 'Invites pending', value: String(kpis.pending), tone: 'text-amber-600' },
        ].map((kpi) => (
          <article key={kpi.label} className={`${cardClass} px-4 py-3.5`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className={`mt-1 text-[26px] leading-none font-bold tracking-tight ${kpi.tone}`}>{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                <th className="px-5 py-3 font-semibold">Content Admin</th>
                <th className="px-3 py-3 text-right font-semibold">Courses owned</th>
                <th className="px-3 py-3 text-right font-semibold">Published (30 d)</th>
                <th className="px-3 py-3 text-right font-semibold">Drafts</th>
                <th className="px-3 py-3 text-right font-semibold">Q&A answer time</th>
                <th className="px-3 py-3 font-semibold">Last active</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-5 py-3">
                    <UsersPerson name={row.name} email={row.email} />
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-navy tabular-nums">{row.owned}</td>
                  <td className="px-3 py-3 text-right text-sm text-slate-600 tabular-nums">{row.published}</td>
                  <td className="px-3 py-3 text-right text-sm text-slate-600 tabular-nums">{row.drafts}</td>
                  <td className={`px-3 py-3 text-right text-sm tabular-nums ${row.qaSlow ? 'font-semibold text-rose-600' : 'text-slate-600'}`}>{row.qa}</td>
                  <td className="px-3 py-3 text-sm text-slate-600">{row.lastActive}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {row.status === 'Active' ? 'Active' : 'Invite sent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">What Content Admins can do</h2>
          <ul className="mt-4 space-y-3">
            {CAN.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${item.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}
                >
                  {item.ok ? <CheckIcon className="h-3 w-3" /> : <span className="text-xs leading-none font-bold">×</span>}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy">{item.title}</span>
                  {item.detail ? <span className="block text-xs text-slate-400">{item.detail}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Oversight</h2>
          <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-slate-600">
            Every publish, edit and archive is recorded in the admin activity log.
          </p>
          <Link to={paths.admin.adminLogs} className={`${btnOutline} mt-4 w-full`}>
            <ClockIcon className="h-4 w-4" />
            Open Admin Activity Logs
          </Link>
        </section>
      </div>
    </div>
  )
}
