import type { CourseDetail } from '@/constants/courseDetails'
import { CheckCircleIcon } from '@/components/ui'

export function CourseLearnSection({ course }: { course: CourseDetail }) {
  return (
    <section className="rounded-2xl border border-slate-200 p-6 sm:p-8">
      <h2 className="flex items-center gap-3 border-b border-slate-100 pb-4 text-2xl font-bold text-black sm:text-3xl">
        <CheckCircleIcon className="h-7 w-7 shrink-0 text-brand" />
        {course.learn.title}
      </h2>
      <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {course.learn.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-base leading-7 font-medium text-black sm:text-lg"
          >
            <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
