import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  getOrganizationDashboard,
  organizationDashboard,
  organizationRanges,
  organizationShell,
  type OrganizationRangeId,
} from '@/constants'
import { paths } from '@/routes/paths'
import { CalendarIcon, ChevronDownIcon } from '@/components/ui'

const attentionTone = {
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-brand',
  violet: 'bg-violet-50 text-violet-600',
} as const

export function OrganizationDashboardPage() {
  const [rangeId, setRangeId] = useState<OrganizationRangeId>('30d')
  const [rangeOpen, setRangeOpen] = useState(false)
  const rangeRef = useRef<HTMLDivElement>(null)
  const data = getOrganizationDashboard(rangeId)
  const rangeLabel =
    organizationRanges.find((range) => range.id === rangeId)?.label ?? 'Last 30 days'
  const maxBar = Math.max(...data.activity.bars)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rangeRef.current?.contains(event.target as Node)) {
        setRangeOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {organizationDashboard.greeting}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{data.intro}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative" ref={rangeRef}>
            <button
              type="button"
              onClick={() => setRangeOpen((open) => !open)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
            >
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              {rangeLabel}
              <ChevronDownIcon className="h-4 w-4 text-slate-400" />
            </button>
            {rangeOpen ? (
              <div className="absolute top-full right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_30px_rgba(15,40,80,0.12)]">
                {organizationRanges.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => {
                      setRangeId(range.id)
                      setRangeOpen(false)
                    }}
                    className={`block w-full px-3.5 py-2.5 text-left text-sm ${
                      range.id === rangeId
                        ? 'bg-brand/5 font-semibold text-brand'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <Link
            to={paths.organization.employees}
            className="inline-flex h-10 items-center rounded-lg border border-brand px-4 text-sm font-semibold text-brand hover:bg-brand/5"
          >
            {organizationDashboard.addEmployees}
          </Link>
          <Link
            to={paths.organization.catalog}
            className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {organizationDashboard.buyCourses}
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {data.stats.map((stat) => (
          <article
            key={stat.id}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-navy">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-navy">
                {organizationDashboard.activityTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{data.activity.subtitle}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              {data.activity.change}
            </span>
          </div>

          <div className="mt-6 flex h-40 items-end gap-2 sm:gap-2.5">
            {data.activity.bars.map((value, index) => {
              const isLast = index === data.activity.bars.length - 1
              return (
                <div key={`${rangeId}-${index}`} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      isLast ? 'bg-brand' : 'bg-[#C9DBF8]'
                    }`}
                    style={{ height: `${Math.max((value / maxBar) * 100, 8)}%` }}
                  />
                </div>
              )
            })}
          </div>

          <p className="mt-4 text-sm text-slate-500">{data.activity.footer}</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-navy">
                {organizationDashboard.bestEmployees.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {organizationDashboard.bestEmployees.subtitle}
              </p>
            </div>
            <Link
              to={paths.organization.employees}
              className="text-sm font-semibold text-brand hover:text-blue-700"
            >
              {organizationDashboard.bestEmployees.viewAll}
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {data.bestEmployees.map((employee) => (
              <li key={employee.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {employee.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{employee.name}</p>
                  <p className="truncate text-xs text-slate-400">{employee.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy">{employee.courses} courses</p>
                  <p className="text-xs font-medium text-emerald-600">{employee.score}% avg</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-navy">
                {organizationDashboard.courseProgress.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {organizationDashboard.courseProgress.subtitle}
              </p>
            </div>
            <Link
              to={paths.organization.purchased}
              className="text-sm font-semibold text-brand hover:text-blue-700"
            >
              {organizationDashboard.courseProgress.viewAll}
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                  {organizationDashboard.courseProgress.headers.map((header) => (
                    <th key={header} className="px-2 py-2 font-semibold first:pl-0 last:pr-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.courseProgress.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 pr-2 font-medium text-navy">{row.title}</td>
                    <td className="px-2 py-3 text-slate-500">{row.assigned}</td>
                    <td className="px-2 py-3 text-slate-500">{row.completed}</td>
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 min-w-20 flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-brand transition-all"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs font-semibold text-slate-600">
                          {row.percent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{organizationDashboard.attention.title}</h2>
          <ul className="mt-4 space-y-3">
            {data.attention.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                </div>
                <button
                  type="button"
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${attentionTone[item.tone]}`}
                >
                  {item.action}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            Showing alerts for {organizationShell.orgName}
          </p>
        </article>
      </div>
    </div>
  )
}
