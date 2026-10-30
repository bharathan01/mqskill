import { Link } from 'react-router'
import type { CatalogCourse } from '@/constants/categoryCourses'
import { coursePath } from '@/routes/paths'
import {
  AtomIcon,
  BookIcon,
  ChartIcon,
  ClockIcon,
  CodeIcon,
  LockIcon,
  StarIcon,
} from '@/components/ui'

function formatCount(value: number) {
  return value.toLocaleString('en-US')
}

function formatPrice(prefix: string, value: number) {
  return `${prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const topicIcons = {
  python: CodeIcon,
  react: AtomIcon,
  aws: CodeIcon,
  data: ChartIcon,
  cyber: LockIcon,
}

const levelLabels = {
  all: 'All Levels',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert',
}

export function CategoryCatalogRow({ course }: { course: CatalogCourse }) {
  const TopicIcon = topicIcons[course.topic.icon]

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-stretch">
      <Link
        to={coursePath(course.id.replace(/-r\d+-\d+$/, ''))}
        className={`relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-[188px] ${course.gradient}`}
      >
        {course.badge === 'bestseller' ? (
          <span className="absolute top-2 left-2 rounded-md bg-lime-400 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-900 uppercase">
            Bestseller
          </span>
        ) : null}
        {course.badge === 'new' ? (
          <span className="absolute top-2 left-2 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
            New
          </span>
        ) : null}
        <img
          src={course.instructor.avatar}
          alt=""
          className="absolute top-1/2 right-3 h-[72px] w-[72px] -translate-y-1/2 rounded-full object-cover ring-4 ring-white/25"
        />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-white">
          {course.topic.icon === 'aws' ? (
            <span className="text-sm font-semibold tracking-wide text-orange-200">
              {course.topic.label}
            </span>
          ) : (
            <>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  course.topic.icon === 'python'
                    ? 'bg-yellow-400 text-slate-900'
                    : 'bg-white/15 text-white'
                }`}
              >
                <TopicIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-medium">{course.topic.label}</span>
            </>
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-navy">
          <Link to={coursePath(course.id.replace(/-r\d+-\d+$/, ''))} className="hover:text-brand">
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">{course.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <img
            src={course.instructor.avatar}
            alt=""
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="text-sm text-navy">{course.instructor.name}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-amber-600">{course.rating.toFixed(1)}</span>
            <span className="flex text-amber-400">
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                  key={index}
                  className={`h-3 w-3 ${
                    index < Math.round(course.rating) ? 'text-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </span>
            <span className="text-slate-400">({formatCount(course.reviews)})</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {course.hours} total hours
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <BookIcon className="h-3.5 w-3.5" />
            {course.lectures} lectures
          </span>
          <span>•</span>
          <span>{levelLabels[course.level]}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-brand"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
 // test comment
      <div className="flex shrink-0 flex-col items-start sm:items-end">
        <p className="text-lg font-bold text-navy">
          {formatPrice(course.pricePrefix, course.price)}
        </p>
        <p className="text-sm text-slate-400 line-through">
          {formatPrice(course.originalPrefix, course.originalPrice)}
        </p>
        <button
          type="button"
          className="mt-auto rounded-lg border-2 border-brand px-4 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
