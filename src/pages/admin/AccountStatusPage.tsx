import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, LockIcon, SearchIcon, UserIcon } from '@/components/ui'
import { btnOutline, cardClass } from './catalogUtils'

type AccountType = 'Student' | 'Employee' | 'Org Admin' | 'Content Admin'
type AccountStatus = 'Suspended' | 'Deactivated' | 'Locked' | 'Invite pending' | 'Active'
type TabId = 'review' | 'Suspended' | 'Deactivated' | 'Locked'

type AccountRow = {
  id: string
  name: string
  detail: string
  email: string
  type: AccountType
  status: AccountStatus
  reason: string
  by: string
  date: string
  review: boolean
  order: number
}

const PAGE_SIZE = 6
const BASE_ACTIVE = 25_604
const BASE_SUSPENDED = 41
const BASE_DEACTIVATED = 792
const BASE_LOCKED = 6

const FACE: Record<string, string> = {
  'Khalid Ibrahim': '#EF4444',
  'Sami Haddad': '#3B82F6',
  'Hessa Al-Rashidi': '#7C3AED',
  'Mona Fawzi': '#F59E0B',
  'Tamer Nabil': '#14B8A6',
  'Reem K.': '#22C55E',
  'Noura A.': '#2563EB',
  'Faisal M.': '#102A4C',
}

const TYPE_PILL: Record<AccountType, string> = {
  Student: 'bg-blue-50 text-blue-600',
  Employee: 'bg-cyan-50 text-cyan-700',
  'Org Admin': 'bg-violet-50 text-violet-600',
  'Content Admin': 'bg-amber-50 text-amber-700',
}

const STATUS_DOT: Record<AccountStatus, string> = {
  Suspended: 'bg-rose-500',
  Deactivated: 'bg-slate-400',
  Locked: 'bg-violet-500',
  'Invite pending': 'bg-amber-500',
  Active: 'bg-emerald-500',
}

const STATUS_TEXT: Record<AccountStatus, string> = {
  Suspended: 'text-rose-600',
  Deactivated: 'text-slate-500',
  Locked: 'text-violet-600',
  'Invite pending': 'text-amber-600',
  Active: 'text-emerald-600',
}

const FIRST: AccountRow[] = [
  row('as-1', 'Khalid Ibrahim', 'ST-18622', 'Student', 'Suspended', 'Shared login detected', 'Noura A.', '7 Nov 2026', 0),
  row('as-2', 'Sami Haddad', 'Gulf Bridge Contracting', 'Employee', 'Deactivated', 'Left company · seat freed', 'Org admin', '5 Nov 2026', 1),
  row('as-3', 'Hessa Al-Rashidi', 'Gulfine Petro Services', 'Org Admin', 'Locked', '5 failed sign-ins', 'System', 'Today 7:58', 2),
  row('as-4', 'Mona Fawzi', 'ST-17410', 'Student', 'Suspended', 'Chargeback on order', 'Faisal M.', '3 Nov 2026', 3),
  row('as-5', 'Tamer Nabil', 'Desert Line Engineering', 'Employee', 'Deactivated', 'Organization request', 'Org admin', '1 Nov 2026', 4),
  row('as-6', 'Reem K.', 'Content Admin', 'Content Admin', 'Invite pending', "Hasn't accepted invite", 'Faisal M.', '30 Oct 2026', 5),
]

const GIVEN = ['Ahmad', 'Lulwa', 'Bader', 'Noor', 'Dana', 'Yousef', 'Mariam', 'Salem', 'Fatima', 'Hamad', 'Layla', 'Omar', 'Huda', 'Nasser', 'Rania', 'Waleed', 'Aisha', 'Hassan', 'Amira', 'Saud']
const FAMILY = ['Al-Mutairi', 'Al-Kandari', 'Al-Sabah', 'Al-Enezi', 'Al-Shatti', 'Al-Failakawi', 'Al-Otaibi', 'Al-Azmi', 'Al-Hajeri', 'Al-Dosari', 'Al-Rashid', 'Sharma', 'Iyer', 'Haddad', 'Farouk', 'Nabil']
const COMPANIES = ['ABC Corp', 'Kuwait National Petroleum', 'Al-Sabah Trading', 'Burgan Logistics', 'Boubyan Facilities', 'Agility Kuwait', 'Zain Enterprise', 'NBK Learning', 'Alghanim Industries', 'KIPCO', 'Mabanee', 'Alshaya Group']
const DATES = ['6 Nov 2026', '4 Nov 2026', '2 Nov 2026', '31 Oct 2026', '28 Oct 2026', '24 Oct 2026', '18 Oct 2026', '12 Oct 2026', 'Yesterday', 'Today 6:14']
const ACTORS = ['Noura A.', 'Faisal M.', 'Org admin', 'System'] as const

function row(
  id: string,
  name: string,
  detail: string,
  type: AccountType,
  status: AccountStatus,
  reason: string,
  by: string,
  date: string,
  order: number,
  review = true,
): AccountRow {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')
  return { id, name, detail, email: `${slug}@maqskillz.com`, type, status, reason, by, date, review, order }
}

function buildAccounts(): AccountRow[] {
  const rows = [...FIRST]
  let order = FIRST.length
  let student = 19020
  const make = (status: AccountStatus, review: boolean, index: number) => {
    const name = `${GIVEN[index % GIVEN.length]} ${FAMILY[(index * 3) % FAMILY.length]}`
    const type: AccountType = status === 'Locked' && index % 4 === 0 ? 'Org Admin' : index % 3 === 0 ? 'Student' : index % 3 === 1 ? 'Employee' : 'Org Admin'
    const detail = type === 'Student' ? `ST-${student++}` : COMPANIES[index % COMPANIES.length]
    const reason =
      status === 'Suspended'
        ? ['Shared login detected', 'Chargeback on order', 'Policy violation', 'Payment dispute', 'Duplicate account'][index % 5]
        : status === 'Deactivated'
          ? ['Left company · seat freed', 'Organization request', 'Unused seat', 'Employment ended'][index % 4]
          : ['5 failed sign-ins', '10 failed sign-ins'][index % 2]
    const by = status === 'Locked' ? 'System' : status === 'Deactivated' ? 'Org admin' : ACTORS[index % 2]
    rows.push(row(`as-g-${order}`, name, detail, type, status, reason, by, DATES[index % DATES.length], order, review))
    order += 1
  }

  for (let i = 0; i < 39; i += 1) make('Suspended', true, i)
  make('Deactivated', true, 40)
  make('Locked', true, 41)
  for (let i = 0; i < 789; i += 1) make('Deactivated', false, 100 + i)
  for (let i = 0; i < 4; i += 1) make('Locked', false, 900 + i)
  return rows
}

const INITIAL = buildAccounts()

const REASONS = [
  'Shared login detected',
  'Left company · seat freed',
  '5 failed sign-ins',
  '10 failed sign-ins',
  'Chargeback on order',
  'Organization request',
  'Policy violation',
  'Payment dispute',
  'Duplicate account',
  'Unused seat',
  'Employment ended',
  "Hasn't accepted invite",
]

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function faceColor(name: string) {
  return FACE[name] ?? ['#2563EB', '#0F766E', '#7C3AED', '#B45309', '#BE123C'][name.length % 5]
}

function Person({ name, detail, small = false }: { name: string; detail?: string; small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid shrink-0 place-items-center rounded-full font-bold text-white ${small ? 'h-6 w-6 text-[10px]' : 'h-9 w-9 text-xs'}`}
        style={{ background: faceColor(name) }}
      >
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className={`block truncate font-semibold text-navy ${small ? 'text-sm' : 'text-sm'}`}>{name}</span>
        {detail ? <span className="block truncate text-xs text-slate-400">{detail}</span> : null}
      </span>
    </div>
  )
}

function actionLabel(status: AccountStatus) {
  if (status === 'Locked') return 'Unlock'
  if (status === 'Invite pending') return 'Resend'
  if (status === 'Suspended' || status === 'Deactivated') return 'Reactivate'
  return null
}

function pageList(current: number, count: number): Array<number | '…'> {
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1)
  const pages = new Set<number>([1, count, current, current - 1, current + 1])
  if (current <= 3) {
    pages.add(2)
    pages.add(3)
  }
  const sorted = [...pages].filter((page) => page >= 1 && page <= count).sort((a, b) => a - b)
  const items: Array<number | '…'> = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push('…')
    items.push(page)
  })
  return items
}

export function AdminAccountStatusPage() {
  const [rows, setRows] = useState<AccountRow[]>(INITIAL)
  const [tab, setTab] = useState<TabId>('review')
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [reason, setReason] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const counts = useMemo(() => {
    const suspended = rows.filter((item) => item.status === 'Suspended').length
    const deactivated = rows.filter((item) => item.status === 'Deactivated').length
    const locked = rows.filter((item) => item.status === 'Locked').length
    const active = BASE_ACTIVE + (BASE_SUSPENDED - suspended) + (BASE_DEACTIVATED - deactivated) + (BASE_LOCKED - locked)
    return {
      total: active + suspended + deactivated + locked,
      active,
      suspended,
      deactivated,
      locked,
      review: rows.filter((item) => item.review && item.status !== 'Active').length,
    }
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows
      .filter((item) => item.status !== 'Active')
      .filter((item) => (tab === 'review' ? item.review : item.status === tab))
      .filter((item) => !type || item.type === type)
      .filter((item) => !reason || item.reason === reason)
      .filter((item) => !needle || `${item.name} ${item.detail} ${item.email}`.toLowerCase().includes(needle))
      .sort((a, b) => a.order - b.order)
  }, [rows, tab, query, type, reason])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectTab = (next: TabId) => {
    setTab(next)
    setPage(1)
  }

  const act = (item: AccountRow) => {
    const label = actionLabel(item.status)
    if (label === 'Resend') {
      setNotice(`Invite resent to ${item.name}.`)
      return
    }
    setRows((current) => current.map((row) => (row.id === item.id ? { ...row, status: 'Active', review: false } : row)))
    setNotice(label === 'Unlock' ? `${item.name} unlocked.` : `${item.name} reactivated.`)
  }

  const exportList = () => {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
    const lines = [
      ['Account', 'Detail', 'Email', 'Type', 'Status', 'Reason', 'Changed by', 'Date'].join(','),
      ...filtered.map((item) =>
        [item.name, item.detail, item.email, item.type, item.status, item.reason, item.by, item.date].map(escape).join(','),
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'account-status.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setNotice('Account status list exported as CSV (sample).')
  }

  const tabs: { id: TabId; label: string; count: number; icon: 'review' | 'suspended' | 'deactivated' | 'locked' }[] = [
    { id: 'review', label: 'Needs review', count: counts.review, icon: 'review' },
    { id: 'Suspended', label: 'Suspended', count: counts.suspended, icon: 'suspended' },
    { id: 'Deactivated', label: 'Deactivated', count: counts.deactivated, icon: 'deactivated' },
    { id: 'Locked', label: 'Locked', count: counts.locked, icon: 'locked' },
  ]

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Users & Permissions
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Account Status</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Account Status</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">Suspended, deactivated and locked accounts across every user type.</p>
        </div>
        <button type="button" className={btnOutline} onClick={exportList}>
          <DownloadIcon className="h-4 w-4" />
          Export
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total accounts', value: counts.total.toLocaleString('en-US'), tone: 'text-navy' },
          { label: 'Active', value: counts.active.toLocaleString('en-US'), tone: 'text-emerald-600' },
          { label: 'Suspended', value: counts.suspended.toLocaleString('en-US'), tone: 'text-navy' },
          { label: 'Deactivated', value: counts.deactivated.toLocaleString('en-US'), tone: 'text-navy' },
          { label: 'Locked', value: counts.locked.toLocaleString('en-US'), tone: 'text-navy' },
        ].map((kpi) => (
          <article key={kpi.label} className={`${cardClass} px-4 py-3.5`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className={`mt-1 text-[26px] leading-none font-bold tracking-tight tabular-nums ${kpi.tone}`}>{kpi.value}</p>
          </article>
        ))}
      </section>

      <div className="flex gap-6 overflow-x-auto border-b border-slate-200" role="tablist">
        {tabs.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectTab(item.id)}
              className={`-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-0.5 pb-2.5 text-sm font-semibold ${
                active ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              <TabIcon name={item.icon} />
              {item.label}
              <span className={active ? 'text-brand' : 'text-slate-400'}>({item.count.toLocaleString('en-US')})</span>
            </button>
          )
        })}
      </div>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search accounts</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search name, email or ID..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </label>
          <div className="sm:w-48">
            <ContentSelect
              aria-label="Account type"
              value={type}
              onChange={(event) => {
                setType(event.target.value)
                setPage(1)
              }}
            >
              <option value="">All account types</option>
              <option>Student</option>
              <option>Employee</option>
              <option>Org Admin</option>
              <option>Content Admin</option>
            </ContentSelect>
          </div>
          <div className="sm:w-48">
            <ContentSelect
              aria-label="Reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Any reason</option>
              {REASONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </ContentSelect>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 text-xs font-semibold text-slate-400">
                <th className="px-5 py-3 font-semibold">Account</th>
                <th className="px-3 py-3 font-semibold">Type</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Reason</th>
                <th className="px-3 py-3 font-semibold">Changed by</th>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    No accounts match these filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((item) => {
                  const label = actionLabel(item.status)
                  return (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-5 py-3.5">
                        <Person name={item.name} detail={item.detail} />
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_PILL[item.type]}`}>{item.type}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${STATUS_TEXT[item.status]}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[item.status]}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{item.reason}</td>
                      <td className="px-3 py-3.5">
                        {item.by === 'Org admin' || item.by === 'System' ? (
                          <span className="text-sm text-slate-500">{item.by}</span>
                        ) : (
                          <Person name={item.by} small />
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-600">{item.date}</td>
                      <td className="px-5 py-3.5 text-right">
                        {label ? (
                          <button type="button" onClick={() => act(item)} className="text-sm font-semibold text-brand hover:underline">
                            {label}
                          </button>
                        ) : (
                          <span className="text-sm text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Showing {pageRows.length} of {filtered.length.toLocaleString('en-US')} accounts
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {pageList(safePage, pageCount).map((item, index) =>
              item === '…' ? (
                <span key={`gap-${index}`} className="px-1 text-sm text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm font-semibold ${
                    item === safePage ? 'bg-brand text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={safePage >= pageCount}
              onClick={() => setPage(safePage + 1)}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">What each status means</h2>
          <dl className="mt-4">
            {[
              ['Suspended', "Can't sign in · data and certificates kept"],
              ['Deactivated', 'Closed · employee seats return to the pool'],
              ['Locked', 'Too many failed sign-ins · unlocks automatically'],
            ].map(([label, detail]) => (
              <div key={label} className="flex items-start justify-between gap-4 border-t border-slate-100 py-3 first:border-t-0">
                <dt className="text-sm font-semibold text-navy">{label}</dt>
                <dd className="text-right text-sm text-slate-500">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className={`${cardClass} p-5`}>
          <p className="flex items-start gap-2.5 rounded-lg bg-[#EFF6FF] px-3 py-2.5 text-sm text-slate-600">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-brand text-[10px] font-bold text-brand">
              i
            </span>
            Certificates stay verifiable for suspended and deactivated accounts.
          </p>
        </section>
      </div>
    </div>
  )
}

function TabIcon({ name }: { name: 'review' | 'suspended' | 'deactivated' | 'locked' }) {
  if (name === 'locked') return <LockIcon className="h-3.5 w-3.5" />
  if (name === 'deactivated') return <UserIcon className="h-3.5 w-3.5" />
  if (name === 'suspended') {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
        <circle cx="6" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.2 12.2c.6-2 2-3 3.8-3s3.2 1 3.8 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 5.5l3.2 3.2M14.2 5.5L11 8.7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
    </svg>
  )
}
