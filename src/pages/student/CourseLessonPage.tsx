import { EmployeeCourseLessonPage } from '@/pages/employee/CourseLessonPage'
import { studentUser } from '@/constants'
import { paths } from '@/routes/paths'

const initials = studentUser.name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '')
  .join('')

export function StudentCourseLessonPage() {
  return <EmployeeCourseLessonPage backTo={paths.student.courses} learnerInitials={initials} />
}
