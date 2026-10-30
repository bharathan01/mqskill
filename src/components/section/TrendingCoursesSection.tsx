import { Link } from 'react-router'
import { trendingCourses, trendingSection } from '@/constants/catalog'
import { paths } from '@/routes/paths'
import { CourseCard } from '@/components/common/CourseCard'
import { Container } from '@/components/ui'

export function TrendingCoursesSection() {
  return (
    <section className="bg-white pb-14 sm:pb-16">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              {trendingSection.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{trendingSection.subtitle}</p>
          </div>
          <Link
            to={paths.courses}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {trendingSection.viewAll} →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {trendingCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  )
}
