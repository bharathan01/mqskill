import type { CourseDetail } from '@/constants/courseDetails'
import { StarIcon, ThumbsUpIcon } from '@/components/ui'

function formatPercent(value: number) {
  return Number.isInteger(value) ? `${value}%` : `${value}%`
}

function Stars({ value, className = 'h-3.5 w-3.5' }: { value: number; className?: string }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={`${className} ${index < value ? 'text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </span>
  )
}

export function CourseReviewsSection({ course }: { course: CourseDetail }) {
  const { feedback } = course
  const caption = feedback.ratingCaption.replace(
    '{count}',
    course.reviews.toLocaleString('en-US'),
  )
  const scrollingReviews = [...feedback.reviews, ...feedback.reviews]

  return (
    <section id="reviews" className="scroll-mt-28 rounded-2xl border border-slate-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-black sm:text-3xl">{feedback.title}</h2>

      <div className="mt-6 grid items-center gap-5 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[#F0F4FF] px-5 py-6 text-center">
          <p className="text-5xl font-bold tracking-tight text-navy">{course.rating.toFixed(1)}</p>
          <div className="mt-2 flex justify-center">
            <Stars value={5} className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{caption}</p>
        </div>

        <ul className="space-y-2.5">
          {feedback.breakdown.map((row) => (
            <li key={row.stars} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.75rem] items-center gap-3">
              <span className="text-sm text-slate-500">
                {row.stars} {row.stars === 1 ? 'star' : 'stars'}
              </span>
              <span className="h-2.5 overflow-hidden rounded-full bg-[#E8EEF8]">
                <span
                  className="block h-full rounded-full bg-[#0B5A6C]"
                  style={{ width: `${Math.min(100, row.percent)}%` }}
                />
              </span>
              <span className="text-right text-sm text-slate-500">{formatPercent(row.percent)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-6 overflow-hidden border-t border-slate-100 pt-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-testimonials-scroll gap-4 py-1 hover:[animation-play-state:paused]">
          {scrollingReviews.map((review, index) => (
            <article
              key={`${review.id}-${index}`}
              className="w-[min(100vw-4rem,22rem)] shrink-0 rounded-2xl bg-[#F7F8FC] p-5 sm:w-[24rem]"
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: review.accent }}
                >
                  {review.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-black">{review.name}</p>
                      <p className="text-xs text-slate-500">{review.role}</p>
                    </div>
                    <p className="shrink-0 text-xs text-slate-400">{review.date}</p>
                  </div>
                  <div className="mt-2">
                    <Stars value={review.rating} />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 italic">
                &ldquo;{review.quote}&rdquo;
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"
              >
                <ThumbsUpIcon className="h-3.5 w-3.5" />
                {feedback.helpful} ({review.helpful})
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
