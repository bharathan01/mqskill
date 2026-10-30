import { Route, Routes } from 'react-router'
import { PublicLayout, RoleLayout, StudentLayout } from '@/components/common'
import {
  AboutPage,
  AdminDashboardPage,
  BusinessPage,
  CategoryPage,
  CoursePage,
  CoursesPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  SignupPage,
  StudentCoursesPage,
  StudentDashboardPage,
  StudentPlaceholderPage,
  TutorDashboardPage,
} from '@/pages'
import { paths } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />

      <Route element={<PublicLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.signup} element={<SignupPage />} />
        <Route path={paths.courses} element={<CoursesPage />} />
        <Route path={paths.course} element={<CoursePage />} />
        <Route path={paths.category} element={<CategoryPage />} />
        <Route path={paths.business} element={<BusinessPage />} />
        <Route path={paths.about} element={<AboutPage />} />
      </Route>

      <Route path={paths.student.root} element={<StudentLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="courses" element={<StudentCoursesPage />} />
        <Route path="certificates" element={<StudentPlaceholderPage title="Certificates" />} />
        <Route path="payments" element={<StudentPlaceholderPage title="Payments" />} />
        <Route path="profile" element={<StudentPlaceholderPage title="Profile Settings" />} />
        <Route path="settings" element={<StudentPlaceholderPage title="Account Settings" />} />
        <Route path="language" element={<StudentPlaceholderPage title="Language" />} />
        <Route path="help" element={<StudentPlaceholderPage title="Help & Support" />} />
      </Route>

      <Route path={paths.tutor.root} element={<RoleLayout role="tutor" />}>
        <Route index element={<TutorDashboardPage />} />
      </Route>

      <Route path={paths.admin.root} element={<RoleLayout role="admin" />}>
        <Route index element={<AdminDashboardPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
