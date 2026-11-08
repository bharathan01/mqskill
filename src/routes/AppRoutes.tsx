import { Route, Routes } from 'react-router'
import { OrganizationLayout, PublicLayout, RoleLayout, StudentLayout } from '@/components/common'
import {
  AboutPage,
  AdminDashboardPage,
  BusinessPage,
  CategoryPage,
  CoursePage,
  CoursesPage,
  EmployeeDashboardPage,
  EmployeeInvitePage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  OrganizationAnnouncementsPage,
  OrganizationBillingPage,
  OrganizationHelpPage,
  OrganizationInvoiceDetailPage,
  OrganizationNewTicketPage,
  OrganizationSettingsPage,
  OrganizationTicketDetailPage,
  OrganizationNewAnnouncementPage,
  OrganizationCartPage,
  OrganizationCatalogPage,
  OrganizationCheckoutPage,
  OrganizationDashboardPage,
  OrganizationPaymentSuccessPage,
  OrganizationEmployeeDetailPage,
  OrganizationEmployeesPage,
  OrganizationPurchasedDetailPage,
  OrganizationPurchasedPage,
  OrganizationReportsPage,
  OrganizationTrainingRequestsPage,
  SignupPage,
  StudentCertificatesPage,
  StudentCoursesPage,
  StudentDashboardPage,
  StudentHelpPage,
  StudentLanguagePage,
  StudentPaymentsPage,
  StudentProfilePage,
  StudentSettingsPage,
  TutorDashboardPage,
} from '@/pages'
import { paths } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.forgotPassword} element={<ForgotPasswordPage />} />
      <Route path={paths.signup} element={<SignupPage />} />
      <Route path={paths.employee.invite} element={<EmployeeInvitePage />} />

      <Route element={<PublicLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.courses} element={<CoursesPage />} />
        <Route path={paths.course} element={<CoursePage />} />
        <Route path={paths.category} element={<CategoryPage />} />
        <Route path={paths.business} element={<BusinessPage />} />
        <Route path={paths.about} element={<AboutPage />} />
      </Route>

      <Route path={paths.student.root} element={<StudentLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="courses" element={<StudentCoursesPage />} />
        <Route path="certificates" element={<StudentCertificatesPage />} />
        <Route path="payments" element={<StudentPaymentsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
        <Route path="language" element={<StudentLanguagePage />} />
        <Route path="help" element={<StudentHelpPage />} />
      </Route>

      <Route path={paths.organization.root} element={<OrganizationLayout />}>
        <Route index element={<OrganizationDashboardPage />} />
        <Route path="employees" element={<OrganizationEmployeesPage />} />
        <Route path="employees/:employeeId" element={<OrganizationEmployeeDetailPage />} />
        <Route path="requests" element={<OrganizationTrainingRequestsPage />} />
        <Route path="catalog" element={<OrganizationCatalogPage />} />
        <Route path="cart" element={<OrganizationCartPage />} />
        <Route path="checkout" element={<OrganizationCheckoutPage />} />
        <Route path="checkout/success" element={<OrganizationPaymentSuccessPage />} />
        <Route path="purchased" element={<OrganizationPurchasedPage />} />
        <Route path="purchased/:courseId" element={<OrganizationPurchasedDetailPage />} />
        <Route path="reports" element={<OrganizationReportsPage />} />
        <Route path="announcements" element={<OrganizationAnnouncementsPage />} />
        <Route path="announcements/new" element={<OrganizationNewAnnouncementPage />} />
        <Route path="billing" element={<OrganizationBillingPage />} />
        <Route path="billing/:invoiceId" element={<OrganizationInvoiceDetailPage />} />
        <Route path="settings" element={<OrganizationSettingsPage />} />
        <Route path="help" element={<OrganizationHelpPage />} />
        <Route path="help/new" element={<OrganizationNewTicketPage />} />
        <Route path="help/:ticketId" element={<OrganizationTicketDetailPage />} />
      </Route>

      <Route path={paths.employee.root} element={<RoleLayout role="employee" />}>
        <Route index element={<EmployeeDashboardPage />} />
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
