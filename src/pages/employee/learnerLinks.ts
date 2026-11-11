import { useLocation } from 'react-router'
import { employeeCoursePath, paths, studentCoursePath } from '@/routes/paths'

/** Assessment links follow the area the learner is in, so the same pages work for students and employees. */
export function useLearnerAssessmentLinks() {
  const { pathname } = useLocation()
  const student = pathname.startsWith(`${paths.student.root}/`) || pathname === paths.student.root
  const assessments = student ? `${paths.student.root}/assessments` : paths.employee.assessments

  return {
    list: assessments,
    quiz: (assessmentId: string) => `${assessments}/${assessmentId}/quiz`,
    submit: (assessmentId: string) => `${assessments}/${assessmentId}/submit`,
    result: (assessmentId: string) => `${assessments}/${assessmentId}/result`,
    course: (courseId: string) => (student ? studentCoursePath(courseId) : employeeCoursePath(courseId)),
  }
}
