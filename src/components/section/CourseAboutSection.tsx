import type { CourseDetail } from '@/constants/courseDetails'
import { CheckIcon } from '@/components/ui'

export function CourseAboutSection({ course }: { course: CourseDetail }) {
  const { about } = course

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-black sm:text-3xl">{about.requirementsTitle}</h2>
        <ul className="mt-5 space-y-4">
          {about.requirements.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-black sm:text-base">
              <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-teal-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-black sm:text-3xl">{about.descriptionTitle}</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[#EEF4FF] p-5 sm:p-6">
          <h3 className="text-base font-bold text-brand sm:text-lg">{about.highlightTitle}</h3>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700 sm:text-base">
            {about.highlights.map((item) => (
              <li key={item.title}>
                <span className="font-bold text-black">{item.title}</span> {item.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">{about.closing}</p>
      </div>
    </section>
  )
}
