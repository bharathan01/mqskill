import { useState } from 'react'
import type { CourseDetail, CourseLecture } from '@/constants/courseDetails'
import {
  ChevronDownIcon,
  ClipboardIcon,
  FileIcon,
  PlayCircleIcon,
} from '@/components/ui'

function LectureIcon({ type }: { type: CourseLecture['type'] }) {
  if (type === 'resource') return <FileIcon className="h-4 w-4 text-slate-400" />
  if (type === 'quiz') return <ClipboardIcon className="h-4 w-4 text-slate-400" />
  return <PlayCircleIcon className="h-4 w-4 text-slate-400" />
}

export function CourseSyllabusSection({ course }: { course: CourseDetail }) {
  const { syllabus } = course
  const [open, setOpen] = useState<string[]>([syllabus.sections[0]?.id ?? ''])
  const allOpen = syllabus.sections.every((section) => open.includes(section.id))

  function toggle(id: string) {
    setOpen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function toggleAll() {
    setOpen(allOpen ? [] : syllabus.sections.map((section) => section.id))
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black sm:text-3xl">{syllabus.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{syllabus.summary}</p>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm font-semibold text-brand"
        >
          {allOpen ? syllabus.collapseAll : syllabus.expandAll}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-[#F7F9FC]">
        {syllabus.sections.map((section) => {
          const expanded = open.includes(section.id)
          return (
            <div key={section.id} className="border-b border-slate-200/80 last:border-b-0">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <ChevronDownIcon
                    className={`mt-0.5 h-4 w-4 shrink-0 text-slate-500 ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                  <span className="text-sm font-semibold text-black sm:text-base">
                    {section.title}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-slate-400">
                  {section.lecturesLabel} • {section.durationLabel}
                </span>
              </button>
              {expanded ? (
                <ul className="border-t border-slate-200/70">
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture.id}
                      className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <LectureIcon type={lecture.type} />
                        <p className="truncate text-sm text-slate-700">
                          <span className="font-medium">{lecture.index}. </span>
                          {lecture.title}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 text-sm">
                        {lecture.preview ? (
                          <button type="button" className="font-medium text-brand">
                            {syllabus.preview}
                          </button>
                        ) : null}
                        <span className="w-16 text-right text-slate-400">
                          {lecture.duration ?? lecture.meta}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
