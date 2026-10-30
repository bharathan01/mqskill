import { useRef } from 'react'
import { Link } from 'react-router'
import {
  popularInstructors,
  popularInstructorsSection,
  popularTopics,
  popularTopicsSection,
} from '@/constants/categoryCourses'
import { paths } from '@/routes/paths'
import {
  AtomIcon,
  BrainIcon,
  ChartIcon,
  ChevronRightIcon,
  CloudIcon,
  CodeIcon,
  Container,
  DatabaseIcon,
  RefreshIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@/components/ui'

const topicIcons = {
  python: CodeIcon,
  javascript: CodeIcon,
  java: CodeIcon,
  react: AtomIcon,
  nodejs: DatabaseIcon,
  aws: CloudIcon,
  cyber: ShieldCheckIcon,
  data: ChartIcon,
  ml: BrainIcon,
  devops: RefreshIcon,
}

const topicTones = {
  python: 'text-emerald-600',
  javascript: 'text-amber-500',
  java: 'text-red-500',
  react: 'text-sky-500',
  nodejs: 'text-lime-600',
  aws: 'text-orange-500',
  cyber: 'text-slate-500',
  data: 'text-slate-500',
  ml: 'text-slate-500',
  devops: 'text-slate-500',
}

function scrollRow(node: HTMLDivElement | null, amount: number) {
  node?.scrollBy({ left: amount, behavior: 'smooth' })
}

export function CategoryExploreSection() {
  const topicsRef = useRef<HTMLDivElement>(null)
  const instructorsRef = useRef<HTMLDivElement>(null)

  return (
    <section className="bg-white pb-12 sm:pb-14">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-navy">
            {popularTopicsSection.title}
          </h2>
          <Link
            to={popularTopicsSection.viewAllTo}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {popularTopicsSection.viewAll} →
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            ref={topicsRef}
            className="flex min-w-0 flex-1 gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {popularTopics.map((topic) => {
              const Icon = topicIcons[topic.icon]
              return (
                <Link
                  key={topic.id}
                  to={`${paths.courses}?skill=${topic.id}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy hover:border-brand/40"
                >
                  {topic.icon === 'javascript' ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-amber-400 text-[9px] font-bold text-slate-900">
                      JS
                    </span>
                  ) : (
                    <Icon className={`h-4 w-4 ${topicTones[topic.icon]}`} />
                  )}
                  {topic.name}
                </Link>
              )
            })}
          </div>
          <button
            type="button"
            aria-label="Scroll topics"
            onClick={() => scrollRow(topicsRef.current, 240)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-navy">
            {popularInstructorsSection.title}
          </h2>
          <Link
            to={popularInstructorsSection.viewAllTo}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {popularInstructorsSection.viewAll} →
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            ref={instructorsRef}
            className="flex min-w-0 flex-1 gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {popularInstructors.map((instructor) => (
              <article
                key={instructor.id}
                className="flex min-w-[260px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <img
                  src={instructor.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{instructor.name}</p>
                  <p className="truncate text-xs text-slate-500">{instructor.role}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs">
                    <span className="font-semibold text-amber-600">{instructor.rating.toFixed(1)}</span>
                    <StarIcon className="h-3 w-3 text-amber-400" />
                    <span className="text-slate-400">{instructor.students} students</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll instructors"
            onClick={() => scrollRow(instructorsRef.current, 300)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </Container>
    </section>
  )
}
