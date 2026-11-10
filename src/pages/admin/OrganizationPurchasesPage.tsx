import { useMemo, useState, type FormEvent } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { LightbulbIcon, TrendingUpIcon } from '@/components/ui'
import {
  formatOrgDate,
  formatOrgKwd,
  superAdminOrgNames,
  superAdminOrgPageSize,
  superAdminOrgPurchaseCourses,
  superAdminOrgPurchases,
  superAdminOrgPurchasesSubtitle,
  superAdminOrgPurchaseTabs,
  superAdminOrgToday,
  type SuperAdminOrgPurchase,
  type SuperAdminOrgPurchaseStatus,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  linkAction,
  OrgEmptyRow,
  OrgKpiGrid,
  OrgPageHeader,
  OrgPager,
  OrgSelect,
  OrgSideCard,
  OrgStatusBadge,
  OrgTabs,
  OrgToolbar,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './orgShared'

const ALL_COURSES = 'All courses'
const PRICE_PER_SEAT = 32.8
const courseOptions = superAdminOrgPurchaseCourses.filter((item) => item !== ALL_COURSES)

const sum = (list: SuperAdminOrgPurchase[], pick: (row: SuperAdminOrgPurchase) => number) =>
  list.reduce((total, row) => total + pick(row), 0)

export function AdminOrganizationPurchasesPage() {
  const [rows, setRows] = useState<SuperAdminOrgPurchase[]>(superAdminOrgPurchases)
  const [tab, setTab] = useState<'all' | SuperAdminOrgPurchaseStatus>('all')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState(ALL_COURSES)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [formOrg, setFormOrg] = useState(superAdminOrgNames[0])
  const [formCourse, setFormCourse] = useState(courseOptions[0])
  const [formSeats, setFormSeats] = useState('25')

  const kpis = useMemo(() => {
    const added = rows.slice(0, rows.length - superAdminOrgPurchases.length)
    return [
      { id: 'purchases', label: 'Purchases (30d)', value: String(96 + added.length), detail: '+12% vs previous 30 days' },
      { id: 'seats', label: 'Seats purchased', value: (2540 + sum(added, (r) => r.seats)).toLocaleString('en-US'), detail: '+21% vs previous 30 days' },
      { id: 'revenue', label: 'Revenue (30d)', value: formatOrgKwd(21310 + sum(added.filter((r) => r.status === 'Paid'), (r) => r.amount)), detail: '+23.4% vs previous 30 days' },
    ]
  }, [rows])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (course !== ALL_COURSES && row.course !== course) return false
      if (!needle) return true
      return `${row.id} ${row.org} ${row.course}`.toLowerCase().includes(needle)
    })
  }, [course, query, rows, tab])

  const pending = rows.filter((row) => row.status === 'Pending')
  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const markPaid = (row: SuperAdminOrgPurchase) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status: 'Paid' } : item)))
    setNotice(`${row.id} marked as paid (sample).`)
  }

  const record = (event: FormEvent) => {
    event.preventDefault()
    const seats = Math.max(1, Math.round(Number(formSeats) || 0))
    setRows((current) => [
      { id: `PUR-${9200 + current.length}`, org: formOrg, course: formCourse, seats, amount: Math.round(seats * PRICE_PER_SEAT), date: superAdminOrgToday, status: 'Pending' },
      ...current,
    ])
    setRecording(false)
    setTab('all')
    setPage(1)
    setNotice(`Purchase of ${seats} seats recorded for ${formOrg} (sample). Seats are tied to the current course version.`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Course Purchases"
        subtitle={superAdminOrgPurchasesSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Purchases exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setRecording((open) => !open)} className={btnPrimary}>
              Record purchase
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {recording ? (
        <form onSubmit={record} className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Organization
            <ContentSelect value={formOrg} onChange={(event) => setFormOrg(event.target.value)} className="mt-1.5 !h-10">
              {superAdminOrgNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </ContentSelect>
          </label>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Course
            <ContentSelect value={formCourse} onChange={(event) => setFormCourse(event.target.value)} className="mt-1.5 !h-10">
              {courseOptions.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </ContentSelect>
          </label>
          <label className="w-full text-sm font-semibold text-navy lg:w-32">
            Seats
            <ContentTextInput type="number" min={1} value={formSeats} onChange={(event) => setFormSeats(event.target.value)} className="mt-1.5 !h-10" />
          </label>
          <div className="flex gap-2.5">
            <button type="submit" className={btnPrimary}>
              Save purchase
            </button>
            <button type="button" onClick={() => setRecording(false)} className={btnOutline}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgPurchaseTabs}
            value={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />
          <OrgToolbar
            query={query}
            onQuery={(value) => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Search purchase, organization or course"
          >
            <OrgSelect
              label="Course"
              value={course}
              options={superAdminOrgPurchaseCourses}
              onChange={(value) => {
                setCourse(value)
                setPage(1)
              }}
            />
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Organization</th>
                  <th className={thClass}>Course</th>
                  <th className={`${thClass} text-right`}>Seats</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-navy">{row.org}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{row.id}</p>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.course}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.seats.toLocaleString('en-US')}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{formatOrgKwd(row.amount)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatOrgDate(row.date)}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Pending' ? (
                        <button type="button" onClick={() => markPaid(row)} className={linkAction}>
                          Mark as paid
                        </button>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No purchases match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="purchases" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<TrendingUpIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Awaiting payment" subtitle="Purchases still pending">
            {pending.length ? (
              <ul className="space-y-2.5">
                {pending.slice(0, 4).map((row) => (
                  <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-semibold text-navy">{row.org}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.seats} seats · {formatOrgKwd(row.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">All purchases are paid.</p>
            )}
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Seats are tied to the course version at purchase. Confirm the version before recording a bulk order.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
