import { useMemo, useState } from 'react'
import {
  studentActiveCourses,
  studentCoursesPage as copy,
  studentExpiredCourses,
} from '@/constants/studentCourses'
import {
  AlertTriangleIcon,
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  FileIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  LockIcon,
  PlayCircleIcon,
  RefreshIcon,
  SearchIcon,
} from '@/components/ui'

const statusClass = {
  brand: 'text-brand',
  amber: 'text-amber-500',
  green: 'text-emerald-500',
}

const statIconClass = {
  brand: 'bg-brand/10 text-brand',
  amber: 'bg-amber-50 text-amber-500',
  green: 'bg-emerald-50 text-emerald-500',
}

function StatIcon({ icon, tone }: { icon: 'play' | 'alert' | 'check'; tone: keyof typeof statIconClass }) {
  const className = `flex h-10 w-10 items-center justify-center rounded-full ${statIconClass[tone]}`
  if (icon === 'alert') return <span className={className}><AlertTriangleIcon className="h-5 w-5" /></span>
  if (icon === 'check') return <span className={className}><CheckCircleIcon className="h-5 w-5" /></span>
  return <span className={className}><PlayCircleIcon className="h-5 w-5" /></span>
}

export function StudentCoursesPage() {
  const [query, setQuery] = useState('')
  const [discipline, setDiscipline] = useState('all')
  const [view, setView] = useState<'list' | 'grid'>('list')

  const disciplines = useMemo(() => {
    const values = new Set(studentActiveCourses.map((course) => course.discipline))
    studentExpiredCourses.forEach((course) => values.add(course.category))
    return ['all', ...values]
  }, [])

  const active = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return studentActiveCourses.filter((course) => {
      const matchQuery =
        !needle ||
        course.title.toLowerCase().includes(needle) ||
        course.track.toLowerCase().includes(needle) ||
        course.description.toLowerCase().includes(needle)
      const matchDiscipline = discipline === 'all' || course.discipline === discipline
      return matchQuery && matchDiscipline
    })
  }, [query, discipline])

  const expired = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return studentExpiredCourses.filter((course) => {
      const matchQuery =
        !needle ||
        course.title.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle) ||
        course.description.toLowerCase().includes(needle)
      const matchDiscipline = discipline === 'all' || course.category === discipline
      return matchQuery && matchDiscipline
    })
  }, [query, discipline])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-slate-400">
          {copy.breadcrumb[0]}
          <span className="mx-1.5">›</span>
          <span className="font-medium text-slate-600">{copy.breadcrumb[1]}</span>
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
            {copy.seat}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 text-brand" />
            {copy.renewal}
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{copy.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {copy.stats.map((stat) => (
          <article key={stat.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {stat.kicker}
                </p>
                <p className="mt-2 text-3xl font-bold text-navy">
                  {stat.value}{' '}
                  <span className={`text-base font-semibold ${statusClass[stat.statusTone]}`}>
                    {stat.status}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-400">{stat.detail}</p>
              </div>
              <StatIcon icon={stat.icon} tone={stat.statusTone} />
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-11 pl-11 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <FilterIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <select
              value={discipline}
              onChange={(event) => setDiscipline(event.target.value)}
              className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none"
            >
              {disciplines.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? copy.disciplineLabel : item}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700"
          >
            {copy.sortLabel}
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>
          <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView('list')}
              className={`px-3 py-2.5 ${view === 'list' ? 'bg-slate-100 text-navy' : 'text-slate-400'}`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView('grid')}
              className={`px-3 py-2.5 ${view === 'grid' ? 'bg-slate-100 text-navy' : 'text-slate-400'}`}
            >
              <GridIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-bold text-navy">{copy.activeTitle}</h2>
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
            {copy.activeCount}
          </span>
        </div>
        <div className={view === 'grid' ? 'grid gap-4 xl:grid-cols-2' : 'space-y-4'}>
          {active.map((course) => (
            <article
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44">
                  <img src={course.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-1 text-[11px] font-bold text-navy">
                    {course.progress}% Done
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-brand">{course.track}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {course.license}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-navy">{course.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{course.description}</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      {course.cta === 'assessment' ? copy.continueAssessment : copy.resume}
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="inline-flex min-w-0 items-center gap-2 text-sm text-slate-600">
                      {course.nextKind === 'assessment' ? (
                        <FileIcon className="h-4 w-4 text-slate-400" />
                      ) : (
                        <PlayCircleIcon className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="font-medium">Next:</span>
                      <span className="truncate">{course.next}</span>
                      <span className="hidden text-slate-400 sm:inline">{course.remaining}</span>
                    </p>
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
                    >
                      <FileIcon className="h-4 w-4" />
                      {copy.syllabus}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {course.modulesDone} of {course.modulesTotal} modules
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-bold text-navy">{copy.expiredTitle}</h2>
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
            {copy.expiredCount}
          </span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {expired.map((course) => (
            <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                  <AwardIcon className="h-3.5 w-3.5" />
                  {course.category}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {course.expired}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-navy">{course.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{course.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{course.progressLabel}</span>
                <span
                  className={
                    course.progressTone === 'due' ? 'font-semibold text-amber-600' : 'font-medium text-slate-400'
                  }
                >
                  {course.progressStatus}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    course.progressTone === 'due' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  {course.certificate ? (
                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <LockIcon className="h-3.5 w-3.5" />
                  )}
                  {course.meta}
                </span>
                <span>{course.seat}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
                >
                  {course.primary.startsWith('Download') ? (
                    <DownloadIcon className="h-3.5 w-3.5" />
                  ) : null}
                  {course.primary}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-2 text-sm font-semibold text-brand"
                >
                  <RefreshIcon className="h-3.5 w-3.5" />
                  {course.secondary}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
