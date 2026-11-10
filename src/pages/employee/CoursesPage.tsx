import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import {
  employeeCoursePath,
  employeeCourses,
  employeeCoursesPage,
  employeeTrainingRequestCourses,
  employeeUser,
  isEmployeeCourseDueSoon,
  isEmployeeCourseOverdue,
  type EmployeeCourse,
  type EmployeeCourseDueFilter,
  type EmployeeCourseSort,
  type EmployeeCourseStatus,
  type EmployeeTrainingPriority,
  type EmployeeTrainingTimeframe,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BookIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from '@/components/ui'

const copy = employeeCoursesPage
const requestCopy = copy.requestForm
const fieldClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15'
const areaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15'

type StatusFilter = 'all' | EmployeeCourseStatus
const OTHER_COURSE = '__other__'

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

function CourseCard({ course }: { course: EmployeeCourse }) {
  const dueSoon = isEmployeeCourseDueSoon(course)
  const overdue = isEmployeeCourseOverdue(course)

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)] transition hover:border-slate-300">
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${course.accent}`}>
        <BookIcon className="h-12 w-12 text-white/90" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {course.category}
          </span>
          {course.mandatory ? (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {copy.mandatory}
            </span>
          ) : null}
        </div>
        <div className="absolute top-3 right-3 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-bold text-white">
          {copy.completeLabel(course.progress)}
        </div>
      </div>

      <div className="flex h-[calc(100%-9rem)] flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles(course.status)}`}
          >
            {copy.status[course.status]}
          </span>
          {overdue ? (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
              {copy.overdueBadge}
            </span>
          ) : dueSoon ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
              {copy.dueSoonBadge}
            </span>
          ) : null}
          {course.status === 'completed' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <AwardIcon className="h-3 w-3" />
              {copy.certificateReady}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-bold text-navy">{course.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <ClockIcon className="h-3.5 w-3.5" />
          {copy.duration(course.durationHours)} · {copy.cpd(course.cpdHours)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {course.instructor} · {course.modules} modules
        </p>

        <div className="mt-3 space-y-1.5 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            {course.due}
          </p>
          <p>{copy.lastAccessed(course.lastAccessed)}</p>
          {course.status !== 'completed' && course.lessonsLeft > 0 ? (
            <p className="font-semibold text-slate-600">{copy.lessonsLeft(course.lessonsLeft)}</p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to={employeeCoursePath(course.id)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.details}
          </Link>
          <Link
            to={employeeCoursePath(course.id)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
          >
            {actionLabel(course.status)}
          </Link>
        </div>
      </div>
    </article>
  )
}

export function EmployeeCoursesPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [dueFilter, setDueFilter] = useState<EmployeeCourseDueFilter>('all')
  const [sort, setSort] = useState<EmployeeCourseSort>('due')
  const [draftStatus, setDraftStatus] = useState<StatusFilter>('all')
  const [draftDue, setDraftDue] = useState<EmployeeCourseDueFilter>('all')
  const [draftSort, setDraftSort] = useState<EmployeeCourseSort>('due')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [courseChoice, setCourseChoice] = useState('')
  const [customCourse, setCustomCourse] = useState('')
  const [reason, setReason] = useState('')
  const [priority, setPriority] = useState<EmployeeTrainingPriority>('normal')
  const [timeframe, setTimeframe] = useState<EmployeeTrainingTimeframe>('this_month')
  const [managerNote, setManagerNote] = useState('')
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState('')
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const summary = useMemo(() => {
    const inProgress = employeeCourses.filter((item) => item.status === 'in_progress').length
    const dueSoon = employeeCourses.filter((item) => isEmployeeCourseDueSoon(item)).length
    const cpdEarned = employeeCourses
      .filter((item) => item.status === 'completed')
      .reduce((sum, item) => sum + item.cpdHours, 0)
    return {
      assigned: employeeCourses.length,
      inProgress,
      dueSoon,
      cpdEarned,
    }
  }, [])

  const nextCourse = useMemo(() => {
    return (
      employeeCourses.find((item) => item.status === 'in_progress') ??
      employeeCourses.find((item) => item.status === 'not_started') ??
      null
    )
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let rows = employeeCourses.filter((course) => {
      if (status !== 'all' && course.status !== status) return false
      if (dueFilter === 'due_soon' && !isEmployeeCourseDueSoon(course)) return false
      if (dueFilter === 'overdue' && !isEmployeeCourseOverdue(course)) return false
      if (!needle) return true
      return (
        course.title.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle) ||
        course.instructor.toLowerCase().includes(needle)
      )
    })

    rows = [...rows].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'progress') return b.progress - a.progress || a.title.localeCompare(b.title)
      if (sort === 'recent') return b.sortRecent - a.sortRecent
      const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY
      const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (b.status === 'completed' && a.status !== 'completed') return -1
      return dueA - dueB
    })

    return rows
  }, [query, status, dueFilter, sort])

  const activeFilterCount =
    (status !== 'all' ? 1 : 0) + (dueFilter !== 'all' ? 1 : 0) + (sort !== 'due' ? 1 : 0)

  function openFilters() {
    setDraftStatus(status)
    setDraftDue(dueFilter)
    setDraftSort(sort)
    setFiltersOpen((open) => !open)
  }

  function applyFilters() {
    setStatus(draftStatus)
    setDueFilter(draftDue)
    setSort(draftSort)
    setFiltersOpen(false)
  }

  function clearFilters() {
    setDraftStatus('all')
    setDraftDue('all')
    setDraftSort('due')
    setStatus('all')
    setDueFilter('all')
    setSort('due')
    setFiltersOpen(false)
  }

  function resetRequestForm() {
    setCourseChoice('')
    setCustomCourse('')
    setReason('')
    setPriority('normal')
    setTimeframe('this_month')
    setManagerNote('')
    setFormError('')
  }

  function closeRequestPanel() {
    setRequestOpen(false)
    setFormError('')
  }

  function openRequestPanel() {
    resetRequestForm()
    setRequestOpen(true)
  }

  function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const selectedCourse =
      courseChoice === OTHER_COURSE ? customCourse.trim() : courseChoice.trim()
    const note = reason.trim()

    if (!selectedCourse || !note) {
      setFormError(requestCopy.required)
      return
    }

    closeRequestPanel()
    resetRequestForm()
    setToast(copy.requestToast)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.subtitle}</p>
        </header>
        <button
          type="button"
          onClick={openRequestPanel}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          {copy.requestTraining}
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: copy.summary.assigned, value: summary.assigned },
          { label: copy.summary.inProgress, value: summary.inProgress },
          { label: copy.summary.dueSoon, value: summary.dueSoon },
          { label: copy.summary.cpdEarned, value: `${summary.cpdEarned}h` },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]"
          >
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-navy">{metric.value}</p>
          </div>
        ))}
      </section>

      {nextCourse ? (
        <section className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${nextCourse.accent}`}
            >
              <BookIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                {copy.nextUpTitle}
              </p>
              <h2 className="mt-1 text-base font-bold text-navy">{nextCourse.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {copy.completeLabel(nextCourse.progress)} · {nextCourse.due}
              </p>
            </div>
          </div>
          <Link
            to={employeeCoursePath(nextCourse.id)}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy.nextUpCta}
          </Link>
        </section>
      ) : null}

      <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </label>

        <div className="relative" ref={filtersRef}>
          <button
            type="button"
            onClick={openFilters}
            className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold sm:w-auto ${
              filtersOpen || activeFilterCount > 0
                ? 'border-brand bg-[#EAF2FF] text-brand'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            aria-expanded={filtersOpen}
          >
            <FilterIcon className="h-4 w-4" />
            {copy.filtersButton}
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>

          {filtersOpen ? (
            <div className="absolute top-12 right-0 z-30 w-[min(100vw-2rem,20rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:w-80">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-navy">{copy.filtersTitle}</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-brand hover:text-blue-700"
                >
                  {copy.clearFilters}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {copy.statusLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(copy.filters) as StatusFilter[]).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDraftStatus(id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          draftStatus === id
                            ? 'bg-brand text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {copy.filters[id]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {copy.dueLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(copy.dueFilters) as EmployeeCourseDueFilter[]).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDraftDue(id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          draftDue === id
                            ? 'bg-brand text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {copy.dueFilters[id]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {copy.sortLabel}
                  </p>
                  <div className="space-y-1.5">
                    {(Object.keys(copy.sorts) as EmployeeCourseSort[]).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDraftSort(id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                          draftSort === id
                            ? 'bg-[#EAF2FF] text-brand'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {copy.sorts[id]}
                        {draftSort === id ? <CheckIcon className="h-4 w-4" /> : null}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={applyFilters}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
              >
                {copy.applyFilters}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          {copy.empty}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {copy.showing} {filtered.length} {copy.of} {employeeCourses.length} {copy.courses}
        </p>
        <Link
          to={paths.employee.help}
          className="text-sm font-semibold text-brand hover:text-blue-700"
        >
          {copy.visitHelp}
        </Link>
      </div>

      {requestOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-slate-900/30"
            onClick={closeRequestPanel}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-[-12px_0_40px_rgba(15,40,80,0.16)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-navy">{requestCopy.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{requestCopy.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={closeRequestPanel}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleRequestSubmit}>
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                  Requesting as <span className="font-semibold text-navy">{employeeUser.name}</span>
                </div>

                <label className="block text-sm font-semibold text-slate-900">
                  {requestCopy.course}
                  <select
                    required
                    value={courseChoice}
                    onChange={(event) => {
                      setCourseChoice(event.target.value)
                      setFormError('')
                    }}
                    className={`${fieldClass} mt-1.5`}
                  >
                    <option value="">{requestCopy.coursePlaceholder}</option>
                    {employeeTrainingRequestCourses.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                    <option value={OTHER_COURSE}>{requestCopy.courseOther}</option>
                  </select>
                </label>

                {courseChoice === OTHER_COURSE ? (
                  <label className="block text-sm font-semibold text-slate-900">
                    {requestCopy.customCourse}
                    <input
                      type="text"
                      required
                      value={customCourse}
                      onChange={(event) => {
                        setCustomCourse(event.target.value)
                        setFormError('')
                      }}
                      placeholder={requestCopy.customCoursePlaceholder}
                      className={`${fieldClass} mt-1.5`}
                    />
                  </label>
                ) : null}

                <label className="block text-sm font-semibold text-slate-900">
                  {requestCopy.reason}
                  <textarea
                    required
                    rows={4}
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value)
                      setFormError('')
                    }}
                    placeholder={requestCopy.reasonPlaceholder}
                    className={`${areaClass} mt-1.5 resize-y`}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    {requestCopy.priority}
                    <select
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value as EmployeeTrainingPriority)
                      }
                      className={`${fieldClass} mt-1.5`}
                    >
                      {(Object.keys(requestCopy.priorities) as EmployeeTrainingPriority[]).map(
                        (id) => (
                          <option key={id} value={id}>
                            {requestCopy.priorities[id]}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-slate-900">
                    {requestCopy.timeframe}
                    <select
                      value={timeframe}
                      onChange={(event) =>
                        setTimeframe(event.target.value as EmployeeTrainingTimeframe)
                      }
                      className={`${fieldClass} mt-1.5`}
                    >
                      {(
                        Object.keys(requestCopy.timeframes) as EmployeeTrainingTimeframe[]
                      ).map((id) => (
                        <option key={id} value={id}>
                          {requestCopy.timeframes[id]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-semibold text-slate-900">
                  {requestCopy.manager}
                  <input
                    type="text"
                    value={managerNote}
                    onChange={(event) => setManagerNote(event.target.value)}
                    placeholder={requestCopy.managerPlaceholder}
                    className={`${fieldClass} mt-1.5`}
                  />
                </label>

                {formError ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
                ) : (
                  <p className="text-xs text-slate-400">{requestCopy.hint}</p>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4">
                <button
                  type="button"
                  onClick={closeRequestPanel}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {requestCopy.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {requestCopy.submit}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
