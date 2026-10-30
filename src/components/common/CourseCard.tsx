import { useState } from 'react'
import { Link } from 'react-router'
import type { Course } from '@/constants/catalog'
import { coursePath } from '@/routes/paths'
import { HeartIcon, StarIcon } from '@/components/ui'

function formatCount(value: number) {
  return value.toLocaleString('en-US')
}

function formatPrice(prefix: string, value: number) {
  return `${prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function CourseCard({ course }: { course: Course }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="relative">
        <Link to={coursePath(course.id)}>
          <img src={course.image} alt={course.title} className="h-44 w-full object-cover" />
        </Link>
        {course.bestseller ? (
          <span className="absolute top-3 left-3 rounded-md bg-lime-300 px-2 py-1 text-xs font-semibold text-slate-900">
            Bestseller
          </span>
        ) : null}
        <button
          type="button"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => setSaved((value) => !value)}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 ${
            saved ? 'text-red-500' : 'text-slate-500'
          }`}
        >
          <HeartIcon className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-navy">
          <Link to={coursePath(course.id)} className="hover:text-brand">
            {course.title}
          </Link>
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <img
            src={course.instructor.avatar}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-amber-700">{course.instructor.name}</span>
        </div>
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
          className="mt-4 w-full rounded-lg border-2 border-brand py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
