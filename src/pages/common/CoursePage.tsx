import { Navigate, useParams } from 'react-router'
import { CoursePurchaseCard } from '@/components/common/CoursePurchaseCard'
import {
  CourseAboutSection,
  CourseHeroSection,
  CourseInstructorSection,
  CourseLearnSection,
  CourseReviewsSection,
  CourseSyllabusSection,
} from '@/components/section'
import { getCourseDetail } from '@/constants/courseDetails'
import { paths } from '@/routes/paths'
import { Container } from '@/components/ui'

export function CoursePage() {
  const { courseId } = useParams()
  const course = getCourseDetail(courseId)

  if (!course) {
    return <Navigate to={paths.courses} replace />
  }

  return (
    <>
      <CourseHeroSection key={course.id} course={course} />
      <div className="bg-white py-10 sm:py-12">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-10">
              <CourseLearnSection course={course} />
              <CourseSyllabusSection course={course} />
              <CourseAboutSection course={course} />
              <CourseInstructorSection course={course} />
              <CourseReviewsSection course={course} />
            </div>
            <div className="lg:sticky lg:top-24">
              <CoursePurchaseCard course={course} />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
