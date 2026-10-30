import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  getStarterCourses,
  starterCoursesSection,
  type StarterList,
} from '@/constants/categoryCourses'
import { CategoryCourseCard } from '@/components/common/CategoryCourseCard'
import { Container } from '@/components/ui'

type CategoryCoursesSectionProps = {
  categoryId: string
}

export function CategoryCoursesSection({ categoryId }: CategoryCoursesSectionProps) {
  const [list, setList] = useState<StarterList>('popular')
  const courses = useMemo(
    () => getStarterCourses(categoryId, list),
    [categoryId, list],
  )

  return (
    <section id="courses" className="scroll-mt-24 bg-white py-10 sm:py-12">
      <Container>
        <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
          {starterCoursesSection.tabs.map((tab) => {
            const active = tab.id === list
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setList(tab.id)}
                className={`h-11 shrink-0 border-b-2 text-sm ${
                  active
                    ? 'border-brand font-semibold text-brand'
                    : 'border-transparent text-slate-500 hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              {starterCoursesSection.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{starterCoursesSection.subtitle}</p>
          </div>
          <Link
            to={starterCoursesSection.viewAllTo}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {starterCoursesSection.viewAll} →
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <CategoryCourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  )
}
