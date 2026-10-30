import { Link } from 'react-router'
import { studentDashboard } from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  FileIcon,
  FilterIcon,
  FlameIcon,
  GraduationCapIcon,
} from '@/components/ui'

const statIcons = {
  courses: GraduationCapIcon,
  live: ClockIcon,
  certificates: AwardIcon,
}

const announcementTone = {
  amber: 'border-amber-300',
  slate: 'border-slate-200',
  green: 'border-emerald-300',
}

const announcementLabel = {
  amber: 'text-amber-600',
  slate: 'text-slate-500',
  green: 'text-emerald-600',
}

function GoalRing({ value }: { value: number }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)

  return (
    <svg viewBox="0 0 48 48" className="h-14 w-14 -rotate-90" aria-hidden="true">
      <circle cx="24" cy="24" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="5" />
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#004ea8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

export function StudentDashboardPage() {
  const data = studentDashboard

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                {data.badge}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600">
                <FlameIcon className="h-3.5 w-3.5" />
                {data.streak}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-medium text-slate-400">{data.goalLabel}</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {data.goalStatus} ({data.goalPercent}%)
                </p>
              </div>
              <GoalRing value={data.goalPercent} />
            </div>
          </div>
          <h1 className="mt-4 font-hero text-3xl font-bold text-navy">{data.greeting}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{data.intro}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {data.stats.map((stat) => {
              const Icon = statIcons[stat.icon]
              const brand = stat.tone === 'brand'
              return (
                <article
                  key={stat.id}
                  className={`rounded-2xl p-4 ${
                    brand ? 'bg-brand text-white' : 'bg-[#F3F7FF] text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-xs font-medium ${brand ? 'text-white/80' : 'text-slate-500'}`}>
                      {stat.kicker}
                    </p>
                    <Icon className={`h-4 w-4 ${brand ? 'text-white/80' : 'text-brand'}`} />
                  </div>
                  <p className="mt-2 text-lg font-bold">{stat.title}</p>
                  <p className={`mt-1 flex items-center gap-1.5 text-xs ${brand ? 'text-white/80' : 'text-slate-500'}`}>
                    {stat.id === 'live' ? <CalendarIcon className="h-3.5 w-3.5" /> : null}
                    {stat.detail}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-navy">{data.continue.title}</h2>
              <p className="mt-0.5 text-sm text-slate-400">{data.continue.subtitle}</p>
            </div>
            <Link
              to={data.continue.viewAllTo}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
            >
              {data.continue.viewAll}
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {data.courses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:flex-row"
              >
                <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-56">
                  <img src={course.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-navy">
                    {course.track}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-400">
                    {course.module} • {course.format}
                    <span className="ml-2 font-medium text-slate-400">• {course.remaining}</span>
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-navy">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{course.lesson}</p>
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                      <span>{course.progressLabel}</span>
                      <span className="font-semibold text-navy">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      {course.complete}
                    </p>
                    <Link
                      to={paths.student.courses}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
                    >
                      {data.continue.resume}
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy">{data.announcements.title}</h2>
            <p className="text-sm text-slate-400">{data.announcements.subtitle}</p>
          </div>
          <button type="button" className="inline-flex items-center gap-1 text-sm text-slate-400">
            {data.announcements.filter}
            <FilterIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {data.announcements.items.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm ${announcementTone[item.tone]}`}
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className={`font-semibold ${announcementLabel[item.tone]}`}>{item.category}</span>
                <span className="text-slate-400">{item.time}</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-navy">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.body}</p>
              {'ref' in item && item.ref ? (
                <p className="mt-3 text-xs text-slate-400">{item.ref}</p>
              ) : null}
              {'link' in item && item.link ? (
                <button type="button" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  <FileIcon className="h-3.5 w-3.5" />
                  {item.link}
                </button>
              ) : null}
              {'cta' in item && item.cta ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-amber-600">{item.note}</p>
                  <button
                    type="button"
                    className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {item.cta}
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </aside>
    </div>
  )
}
