import { useState } from 'react'
import { Link } from 'react-router'
import type { StarterCourse } from '@/constants/categoryCourses'
import { coursePath } from '@/routes/paths'
import { ChartIcon, CodeIcon, GearIcon, HeartIcon, StarIcon } from '@/components/ui'

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
  react: GearIcon,
  aws: CodeIcon,
  data: ChartIcon,
}

export function CategoryCourseCard({ course }: { course: StarterCourse }) {
  const [saved, setSaved] = useState(false)
  const TopicIcon = topicIcons[course.topic.icon]

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,40,80,0.06)]">
      <Link to={coursePath(course.id)} className={`relative block h-40 overflow-hidden ${course.gradient}`}>
        {course.badge === 'bestseller' ? (
          <span className="absolute top-3 left-3 rounded-md bg-lime-400 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-900 uppercase">
            Bestseller
          </span>
        ) : null}
        {course.badge === 'new' ? (
          <span className="absolute top-3 left-3 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
            New
          </span>
        ) : null}
        <button
          type="button"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setSaved((value) => !value)
          }}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full ${
            saved ? 'text-red-400' : 'text-white'
          }`}
        >
          <HeartIcon className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
        </button>
        <img
          src={course.instructor.avatar}
          alt=""
          className="absolute top-1/2 right-4 h-20 w-20 -translate-y-1/2 rounded-full object-cover ring-4 ring-white/25"
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          {course.topic.icon === 'aws' ? (
            <span className="text-lg font-semibold tracking-wide text-orange-200">
              {course.topic.label}
            </span>
          ) : (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  course.topic.icon === 'python'
                    ? 'bg-yellow-400 text-slate-900'
                    : 'bg-white/15 text-white'
                }`}
              >
                <TopicIcon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{course.topic.label}</span>
            </>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-navy">
          <Link to={coursePath(course.id)} className="hover:text-brand">
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-slate-500">{course.instructor.name}</p>
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-amber-600">{course.rating.toFixed(1)}</span>
          <span className="flex text-amber-400">
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon
                key={index}
                className={`h-3.5 w-3.5 ${
                  index < Math.round(course.rating) ? 'text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
          </span>
          <span className="text-slate-400">({formatCount(course.reviews)})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-navy">
            {formatPrice(course.pricePrefix, course.price)}
          </span>
          <span className="text-sm text-slate-400 line-through">
            {formatPrice(course.originalPrefix, course.originalPrice)}
          </span>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-xl border-2 border-brand py-2.5 text-sm font-semibold text-brand"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
