import { Route, Routes } from 'react-router'
import {
  ContentAdminLayout,
  CourseBuilderShell,
  EmployeeLayout,
  OrganizationLayout,
  PublicLayout,
  RoleLayout,
  StudentLayout,
} from '@/components/common'
import {
  AboutPage,
  AdminDashboardPage,
  AdminLoginPage,
  BusinessPage,
  ContentAdminDashboardPage,
  ContentAllCoursesPage,
  ContentCourseBuilderContentPage,
  ContentCourseBuilderDetailsPage,
  ContentCourseBuilderPreviewPage,
  ContentCourseBuilderQuizPage,
  ContentCourseBuilderSettingsPage,
  ContentCourseVersionsPage,
  ContentCourseAnalyticsPage,
  ContentCourseQaPage,
  ContentDraftCoursesPage,
  ContentHelpSupportPage,
  ContentMediaLibraryPage,
  ContentNotificationsPage,
  ContentScormPackagesPage,
  ContentScormValidationPage,
  ContentQuizzesLibraryPage,
  ContentAssignmentsLibraryPage,
  ContentQuestionBankPage,
  ContentCpdConfigurationPage,
  ContentCertificateTemplatesPage,
  ContentProfileSettingsPage,
  ContentPublishingHistoryPage,
  CategoryPage,
  CoursePage,
  CoursesPage,
  EmployeeAssessmentResultPage,
  EmployeeAssessmentsPage,
  EmployeeAssignmentSubmitPage,
  EmployeeCourseLessonPage,
  EmployeeCoursesPage,
  EmployeeDashboardPage,
  EmployeeInvitePage,
  EmployeeQuizTakePage,
  EmployeeCertificateDetailPage,
  EmployeeCertificatesPage,
  EmployeeHelpPage,
  EmployeeNewTicketPage,
  EmployeeNotificationsPage,
  EmployeeProfilePage,
  EmployeeTicketDetailPage,
  EmployeeSessionDetailPage,
  EmployeeSessionsPage,
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
      <Route path={paths.admin.login} element={<AdminLoginPage />} />
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

      <Route path={paths.employee.root} element={<EmployeeLayout />}>
        <Route index element={<EmployeeDashboardPage />} />
        <Route path="courses" element={<EmployeeCoursesPage />} />
        <Route path="courses/:courseId" element={<EmployeeCourseLessonPage />} />
        <Route path="assessments" element={<EmployeeAssessmentsPage />} />
        <Route path="assessments/:assessmentId/quiz" element={<EmployeeQuizTakePage />} />
        <Route
          path="assessments/:assessmentId/submit"
          element={<EmployeeAssignmentSubmitPage />}
        />
        <Route
          path="assessments/:assessmentId/result"
          element={<EmployeeAssessmentResultPage />}
        />
        <Route path="sessions" element={<EmployeeSessionsPage />} />
        <Route path="sessions/:sessionId" element={<EmployeeSessionDetailPage />} />
        <Route path="certificates" element={<EmployeeCertificatesPage />} />
        <Route
          path="certificates/:certificateId"
          element={<EmployeeCertificateDetailPage />}
        />
        <Route path="notifications" element={<EmployeeNotificationsPage />} />
        <Route path="help" element={<EmployeeHelpPage />} />
        <Route path="help/new" element={<EmployeeNewTicketPage />} />
        <Route path="help/:ticketId" element={<EmployeeTicketDetailPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
      </Route>

      <Route path={paths.tutor.root} element={<RoleLayout role="tutor" />}>
        <Route index element={<TutorDashboardPage />} />
      </Route>

      <Route path={paths.admin.root} element={<RoleLayout role="admin" />}>
        <Route index element={<AdminDashboardPage />} />
      </Route>

      <Route path={paths.content.root} element={<ContentAdminLayout />}>
        <Route index element={<ContentAdminDashboardPage />} />
        <Route path="courses/new" element={<CourseBuilderShell />}>
          <Route index element={<ContentCourseBuilderDetailsPage />} />
          <Route path="builder" element={<ContentCourseBuilderContentPage />} />
          <Route path="quiz" element={<ContentCourseBuilderQuizPage />} />
          <Route path="settings" element={<ContentCourseBuilderSettingsPage />} />
          <Route path="preview" element={<ContentCourseBuilderPreviewPage />} />
        </Route>
        <Route path="courses" element={<ContentAllCoursesPage />} />
        <Route path="versions" element={<ContentCourseVersionsPage />} />
        <Route path="drafts" element={<ContentDraftCoursesPage />} />
        <Route path="scorm/validation" element={<ContentScormValidationPage />} />
        <Route path="scorm" element={<ContentScormPackagesPage />} />
        <Route path="assessments" element={<ContentQuizzesLibraryPage />} />
        <Route path="quizzes" element={<ContentQuizzesLibraryPage />} />
        <Route path="assignments" element={<ContentAssignmentsLibraryPage />} />
        <Route path="question-bank" element={<ContentQuestionBankPage />} />
        <Route path="cpd" element={<ContentCpdConfigurationPage />} />
        <Route path="certificates" element={<ContentCertificateTemplatesPage />} />
        <Route path="media" element={<ContentMediaLibraryPage />} />
        <Route path="qa" element={<ContentCourseQaPage />} />
        <Route path="analytics" element={<ContentCourseAnalyticsPage />} />
        <Route path="history" element={<ContentPublishingHistoryPage />} />
        <Route path="notifications" element={<ContentNotificationsPage />} />
        <Route path="profile" element={<ContentProfileSettingsPage />} />
        <Route path="help" element={<ContentHelpSupportPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
