import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import { MailIcon, PhoneIcon } from '@/components/ui'
import {
  formatStudentDate,
  formatStudentKwd,
  studentDaysSince,
  superAdminStudentDetailsKpis,
  superAdminStudentDetailsPageSize,
  superAdminStudentDetailsSubtitle,
  superAdminStudents,
  type SuperAdminStudent,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  paginate,
  StudentAvatar,
  StudentEmptyRow,
  StudentKpiGrid,
  StudentPageHeader,
  StudentPager,
  StudentSearch,
  theadRowClass,
  thClass,
  toolbarClass,
} from './studentShared'

const ALL_STATUS = 'All statuses'

function lastLoginLabel(iso: string) {
  const days = studentDaysSince(iso)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago · ${formatStudentDate(iso)}`
}

export function AdminStudentDetailsPage() {
  const [students, setStudents] = useState<SuperAdminStudent[]>(superAdminStudents)
  const [selectedId, setSelectedId] = useState(superAdminStudents[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(ALL_STATUS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return students.filter((row) => {
      if (status !== ALL_STATUS && row.status !== status) return false
      if (!needle) return true
      return `${row.id} ${row.name} ${row.city} ${row.country} ${row.employer}`.toLowerCase().includes(needle)
    })
  }, [query, status, students])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminStudentDetailsPageSize)
  const selected = students.find((row) => row.id === selectedId) ?? students[0]

  const toggleStatus = (row: SuperAdminStudent) => {
    const next = row.status === 'Active' ? 'Inactive' : 'Active'
    setStudents((current) => current.map((item) => (item.id === row.id ? { ...item, status: next } : item)))
    setNotice(`${row.name} ${next === 'Active' ? 'activated' : 'deactivated'} (sample).`)
  }

  return (
    <div className="space-y-5">
      <StudentPageHeader
        page="Student Details"
        subtitle={superAdminStudentDetailsSubtitle}
        actions={
          <button type="button" onClick={() => setNotice('Student profiles exported as CSV (sample).')} className={btnOutline}>
            Export
          </button>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <StudentKpiGrid kpis={superAdminStudentDetailsKpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className={toolbarClass}>
            <StudentSearch
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search ID, name, location or employer"
            />
            <ContentSelect
              aria-label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="!h-10 lg:max-w-[11rem]"
            >
              <option>{ALL_STATUS}</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">ID</th>
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Location</th>
                  <th className={thClass}>Employer</th>
                  <th className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const active = row.id === selected?.id
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className={`cursor-pointer border-b border-slate-100 last:border-b-0 ${
                        active ? 'bg-[#EFF4FF]/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-sm font-semibold text-brand">{row.id}</td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedId(row.id)}
                          className="text-left text-sm font-semibold text-navy hover:text-brand"
                          aria-pressed={active}
                        >
                          {row.name}
                        </button>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">
                        {row.city}, {row.country}
                      </td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{row.employer}</td>
                      <td className="px-3 py-3.5">
                        <StatusBadge value={row.status} />
                      </td>
                    </tr>
                  )
                })}
                {pageRows.length === 0 ? (
                  <StudentEmptyRow colSpan={5}>No student profiles match these filters.</StudentEmptyRow>
                ) : null}
              </tbody>
            </table>
          </div>
          <StudentPager
            page={safePage}
            pageCount={pageCount}
            from={from}
            to={to}
            total={filtered.length}
            noun="profiles"
            onPage={setPage}
          />
        </section>

        {selected ? (
          <aside className={`${cardClass} h-fit p-5`} aria-label="Selected student profile">
            <div className="flex items-start gap-3">
              <StudentAvatar name={selected.name} className="h-12 w-12 text-sm" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-navy">{selected.name}</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {selected.id} · Joined {formatStudentDate(selected.joined)}
                </p>
              </div>
              <StatusBadge value={selected.status} />
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <dd className="min-w-0 break-words text-slate-600">{selected.email}</dd>
              </div>
              <div className="flex items-start gap-2.5">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <dd className="text-slate-600 tabular-nums">{selected.phone}</dd>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <dt className="text-xs text-slate-400">Location</dt>
                  <dd className="mt-0.5 font-medium text-navy">
                    {selected.city}, {selected.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Employer</dt>
                  <dd className="mt-0.5 font-medium text-navy">{selected.employer}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Total spent</dt>
                  <dd className="mt-0.5 font-semibold text-navy tabular-nums">{formatStudentKwd(selected.spent)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Last login</dt>
                  <dd className="mt-0.5 font-medium text-navy">{lastLoginLabel(selected.lastLogin)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-400">Profile completeness</dt>
                  <dd className="mt-1.5 flex items-center gap-2.5">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-brand" style={{ width: `${selected.profileComplete}%` }} />
                    </span>
                    <span className="text-xs font-semibold text-navy tabular-nums">{selected.profileComplete}%</span>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy">Courses</h3>
                <span className="text-xs text-slate-400">{selected.courses} enrolled in total</span>
              </div>
              {selected.enrolled.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {selected.enrolled.map((line) => (
                    <li key={line.course}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate font-medium text-slate-600">{line.course}</span>
                        <span className="font-semibold text-navy tabular-nums">{line.progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${line.state === 'Completed' ? 'bg-emerald-500' : 'bg-brand'}`}
                          style={{ width: `${line.progress}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No courses yet.</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setNotice(`Message sent to ${selected.email} (sample).`)}
                className={`${btnPrimary} flex-1`}
              >
                Send message
              </button>
              <button type="button" onClick={() => toggleStatus(selected)} className={`${btnOutline} flex-1`}>
                {selected.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
            <Link
              to={paths.admin.studentPayments}
              className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
            >
              View payment history
            </Link>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
