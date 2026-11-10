import { useState } from 'react'
import { Link } from 'react-router'
import {
  employeeCoursePath,
  employeeDashboardCourses,
  employeeDashboardPage,
  employeeDashboardSessions,
  employeeShell,
  employeeUser,
  type EmployeeCourseStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  BookIcon,
  CheckIcon,
  GraduationCapIcon,
  PlusIcon,
  VideoIcon,
} from '@/components/ui'

const copy = employeeDashboardPage

function statusStyles(status: EmployeeCourseStatus) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700'
  if (status === 'in_progress') return 'bg-[#EAF2FF] text-brand'
  return 'bg-slate-100 text-slate-600'
}

function actionLabel(status: EmployeeCourseStatus) {
  if (status === 'completed') return copy.review
  if (status === 'in_progress') return copy.continue
  return copy.start
}

export function EmployeeDashboardPage() {
  const [toast, setToast] = useState('')
  const doneCount = copy.checklist.filter((item) => item.done).length

  function requestTraining() {
    setToast(copy.requestToast)
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-2xl bg-navy px-6 py-7 text-white sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-white/15">
            {copy.heroBadge}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.heroTitle(employeeUser.firstName)}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
            {copy.heroSubtitle}
          </p>
        </div>
        <GraduationCapIcon className="pointer-events-none absolute -right-6 -bottom-8 h-44 w-44 text-white/10 sm:right-8 sm:bottom-[-1.5rem] sm:h-52 sm:w-52" />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {copy.metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
            <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_20rem]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-navy">{copy.coursesTitle}</h2>
              <Link
                to={paths.employee.courses}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                {copy.viewAllCourses}
              </Link>
            </div>
            <ul className="divide-y divide-slate-50">
              {employeeDashboardCourses.map((course) => (
                <li
                  key={course.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${course.accent}`}
                    >
                      <BookIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy">{course.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles(course.status)}`}
                        >
                          {copy.status[course.status]}
                        </span>
                        <span className="text-xs text-slate-500">{course.due}</span>
                        <span className="text-xs text-slate-400">· {course.cpdHours} CPD hrs</span>
                      </div>
                      {course.status !== 'not_started' ? (
                        <div className="mt-2 flex max-w-xs items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <div
                              className="h-1.5 rounded-full bg-brand"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {course.progress}%
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    to={employeeCoursePath(course.id)}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {actionLabel(course.status)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-3.5">
              <button
                type="button"
                onClick={requestTraining}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.requestTraining}
              </button>
              <Link
                to={paths.employee.help}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                {copy.visitHelp}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-navy">{copy.sessionsTitle}</h2>
              <Link
                to={paths.employee.sessions}
                className="text-sm font-semibold text-brand hover:text-blue-700"
              >
                View all
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {employeeDashboardSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FF] text-brand">
                    <VideoIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{session.title}</p>
                    <p className="text-xs text-slate-500">
                      {session.when} · {session.duration}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-navy">{copy.gettingStartedTitle}</h2>
            <span className="text-xs font-semibold text-slate-400">{copy.gettingStartedProgress}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${(doneCount / copy.checklist.length) * 100}%` }}
            />
          </div>
          <ul className="mt-4 space-y-3">
            {copy.checklist.map((item) => {
              const content = (
                <>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      item.done
                        ? 'bg-emerald-500 text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {item.done ? <CheckIcon className="h-3 w-3" /> : null}
                  </span>
                  <span
                    className={`text-sm ${
                      item.done
                        ? 'font-medium text-slate-500 line-through'
                        : 'font-semibold text-navy'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )

              if (!item.done && 'to' in item && item.to) {
                return (
                  <li key={item.id}>
                    <Link to={item.to} className="flex items-center gap-3 hover:opacity-80">
                      {content}
                    </Link>
                  </li>
                )
              }

              return (
                <li key={item.id} className="flex items-center gap-3">
                  {content}
                </li>
              )
            })}
          </ul>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <BookIcon className="h-4 w-4 text-brand" />
            <p className="text-xs text-slate-500">
              Learning for {employeeShell.orgName} · {employeeUser.role}
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
