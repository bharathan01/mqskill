import { Navigate, Route, Routes } from 'react-router'
import {
  ContentAdminLayout,
  CourseBuilderShell,
  EmployeeLayout,
  OrganizationLayout,
  PublicLayout,
  RoleLayout,
  StudentLayout,
  SuperAdminLayout,
} from '@/components/common'
import {
  AboutPage,
  AdminBusinessPerformancePage,
  AdminCatalogPage,
  AdminCertificateReportsPage,
  AdminCertificateStatusPage,
  AdminCertificateVerificationPage,
  AdminCertificationRequirementsPage,
  AdminCpdHoursPage,
  AdminIssuedCertificatesPage,
  AdminAllLiveClassesPage,
  AdminAllOrganizationsPage,
  AdminOrganizationProfilesPage,
  AdminOrganizationPlansPage,
  AdminOrganizationEmployeesPage,
  AdminOrganizationPurchasesPage,
  AdminOrganizationSeatsPage,
  AdminOrganizationVersionAllocationsPage,
  AdminOrganizationTrainingPage,
  AdminOrganizationInvoicesPage,
  AdminOrganizationPerformancePage,
  AdminCompletedSessionsPage,
  AdminLiveAttendancePage,
  AdminLiveClassReportsPage,
  AdminScheduleLiveClassPage,
  AdminUpcomingSessionsPage,
  AdminZoomLinksPage,
  AdminAssessmentAnalyticsPage,
  AdminCourseIntelligencePage,
  AdminCoursePricingPage,
  AdminExecutiveOverviewPage,
  AdminKpisPage,
  AdminLoginPage,
  AdminModuleQuizzesPage,
  AdminQuestionBankPage,
  AdminRecentActivityPage,
  AdminAllStudentsPage,
  AdminStudentDetailsPage,
  AdminStudentsByCountryPage,
  AdminStudentRegistrationAnalyticsPage,
  AdminStudentPurchasesPage,
  AdminActiveEnrollmentsPage,
  AdminStudentLearningProgressPage,
  AdminStudentAssessmentResultsPage,
  AdminStudentCertificatesPage,
  AdminStudentPaymentHistoryPage,
  AdminFinancialOverviewPage,
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminB2cSalesPage,
  AdminB2bSalesPage,
  AdminRevenueReportsPage,
  AdminSalesInvoicesPage,
  AdminRefundsPage,
  AdminCouponsPage,
  AdminPaymentGatewaysPage,
  AdminTaxFeesPage,
  AdminCostsProfitabilityPage,
  AdminFinancialExportsPage,
  AdminExecutiveReportsPage,
  AdminRevenueAnalyticsPage,
  AdminTrendingCourseReportsPage,
  AdminGeographicAnalyticsPage,
  AdminStudentGrowthPage,
  AdminOrganizationAnalyticsPage,
  AdminLearningAnalyticsPage,
  AdminAssessmentReportsPage,
  AdminCertificationReportsPage,
  AdminAdministratorAccountsPage,
  AdminContentAdminAccountsPage,
  AdminRolePermissionsPage,
  AdminAccountAccessPage,
  AdminAccountStatusPage,
  AdminActivityLogsPage,
  AdminSecurityAuditLogsPage,
  AdminReportExportsPage,
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
  StudentCourseLessonPage,
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
        <Route path="courses/:courseId" element={<StudentCourseLessonPage />} />
        <Route path="assessments" element={<EmployeeAssessmentsPage />} />
        <Route path="assessments/:assessmentId/quiz" element={<EmployeeQuizTakePage />} />
        <Route path="assessments/:assessmentId/submit" element={<EmployeeAssignmentSubmitPage />} />
        <Route path="assessments/:assessmentId/result" element={<EmployeeAssessmentResultPage />} />
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

      <Route path={paths.admin.root} element={<SuperAdminLayout />}>
        <Route index element={<AdminExecutiveOverviewPage />} />
        <Route path="business-performance" element={<AdminBusinessPerformancePage />} />
        <Route path="kpis" element={<AdminKpisPage />} />
        <Route path="activity" element={<AdminRecentActivityPage />} />
        <Route path="courses/pricing" element={<AdminCoursePricingPage />} />
        <Route path="courses/intelligence" element={<AdminCourseIntelligencePage />} />
        <Route path="courses/trending" element={<Navigate to={`${paths.admin.courseIntelligence}?tab=trending`} replace />} />
        <Route path="courses/top-selling" element={<Navigate to={`${paths.admin.courseIntelligence}?tab=top-selling`} replace />} />
        <Route path="courses/most-viewed" element={<Navigate to={`${paths.admin.courseIntelligence}?tab=most-viewed`} replace />} />
        <Route path="courses/highest-revenue" element={<Navigate to={`${paths.admin.courseIntelligence}?tab=highest-revenue`} replace />} />
        <Route path="courses/recently-added" element={<Navigate to={paths.admin.courses} replace />} />
        <Route path="courses/recently-updated" element={<Navigate to={paths.admin.courses} replace />} />
        {/* Shared Content Admin modules rendered inside the Super Admin layout */}
        <Route path="courses/new" element={<CourseBuilderShell />}>
          <Route index element={<ContentCourseBuilderDetailsPage />} />
          <Route path="builder" element={<ContentCourseBuilderContentPage />} />
          <Route path="quiz" element={<ContentCourseBuilderQuizPage />} />
          <Route path="settings" element={<ContentCourseBuilderSettingsPage />} />
          <Route path="preview" element={<ContentCourseBuilderPreviewPage />} />
        </Route>
        <Route path="courses" element={<ContentAllCoursesPage />} />
        <Route path="courses/drafts" element={<ContentDraftCoursesPage />} />
        <Route path="courses/versions" element={<ContentCourseVersionsPage />} />
        <Route path="courses/publishing-history" element={<ContentPublishingHistoryPage />} />
        <Route path="courses/analytics" element={<ContentCourseAnalyticsPage />} />
        <Route path="scorm" element={<ContentScormPackagesPage />} />
        <Route path="scorm/validation" element={<ContentScormValidationPage />} />
        <Route path="quizzes" element={<AdminModuleQuizzesPage />} />
        <Route path="assignments" element={<ContentAssignmentsLibraryPage />} />
        <Route path="question-bank" element={<AdminQuestionBankPage />} />
        <Route path="assessments/analytics" element={<AdminAssessmentAnalyticsPage />} />
        <Route path="assessments/results" element={<Navigate to={paths.admin.assessmentAnalytics} replace />} />
        <Route path="assessments/passing-statistics" element={<Navigate to={`${paths.admin.assessmentAnalytics}?tab=passing`} replace />} />
        <Route path="assessments/performance" element={<Navigate to={`${paths.admin.assessmentAnalytics}?tab=performance`} replace />} />
        <Route path="assessments/final" element={<Navigate to={paths.admin.quizzes} replace />} />
        <Route path="cpd" element={<AdminCpdHoursPage />} />
        <Route path="certificates/templates" element={<ContentCertificateTemplatesPage />} />
        <Route path="certificates/verify" element={<AdminCertificateVerificationPage />} />
        <Route path="certificates/status" element={<AdminCertificateStatusPage />} />
        <Route path="certificates/requirements" element={<AdminCertificationRequirementsPage />} />
        <Route path="certificates/reports" element={<AdminCertificateReportsPage />} />
        <Route path="certificates" element={<AdminIssuedCertificatesPage />} />
        <Route path="live-classes/schedule" element={<AdminScheduleLiveClassPage />} />
        <Route path="live-classes/upcoming" element={<AdminUpcomingSessionsPage />} />
        <Route path="live-classes/completed" element={<AdminCompletedSessionsPage />} />
        <Route path="live-classes/zoom-links" element={<AdminZoomLinksPage />} />
        <Route path="live-classes/attendance" element={<AdminLiveAttendancePage />} />
        <Route path="live-classes/reports" element={<AdminLiveClassReportsPage />} />
        <Route path="live-classes" element={<AdminAllLiveClassesPage />} />
        <Route path="students/details" element={<AdminStudentDetailsPage />} />
        <Route path="students/countries" element={<AdminStudentsByCountryPage />} />
        <Route path="students/analytics" element={<AdminStudentRegistrationAnalyticsPage />} />
        <Route path="students/purchases" element={<AdminStudentPurchasesPage />} />
        <Route path="students/enrollments" element={<AdminActiveEnrollmentsPage />} />
        <Route path="students/progress" element={<AdminStudentLearningProgressPage />} />
        <Route path="students/assessments" element={<AdminStudentAssessmentResultsPage />} />
        <Route path="students/certificates" element={<AdminStudentCertificatesPage />} />
        <Route path="students/payments" element={<AdminStudentPaymentHistoryPage />} />
        <Route path="students" element={<AdminAllStudentsPage />} />
        <Route path="organizations/profiles" element={<AdminOrganizationProfilesPage />} />
        <Route path="organizations/plans" element={<AdminOrganizationPlansPage />} />
        <Route path="organizations/employees" element={<AdminOrganizationEmployeesPage />} />
        <Route path="organizations/purchases" element={<AdminOrganizationPurchasesPage />} />
        <Route path="organizations/seats" element={<AdminOrganizationSeatsPage />} />
        <Route path="organizations/version-allocations" element={<AdminOrganizationVersionAllocationsPage />} />
        <Route path="organizations/training-progress" element={<AdminOrganizationTrainingPage />} />
        <Route path="organizations/invoices" element={<AdminOrganizationInvoicesPage />} />
        <Route path="organizations/performance" element={<AdminOrganizationPerformancePage />} />
        <Route path="organizations" element={<AdminAllOrganizationsPage />} />
        <Route path="finance" element={<AdminFinancialOverviewPage />} />
        <Route path="orders/detail" element={<AdminOrderDetailPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="sales/b2c" element={<AdminB2cSalesPage />} />
        <Route path="sales/b2b" element={<AdminB2bSalesPage />} />
        <Route path="sales/revenue-reports" element={<AdminRevenueReportsPage />} />
        <Route path="sales/invoices" element={<AdminSalesInvoicesPage />} />
        <Route path="sales/coupons" element={<AdminCouponsPage />} />
        <Route path="sales/gateways" element={<AdminPaymentGatewaysPage />} />
        <Route path="sales/tax-fees" element={<AdminTaxFeesPage />} />
        <Route path="sales/costs" element={<AdminCostsProfitabilityPage />} />
        <Route path="sales/exports" element={<AdminFinancialExportsPage />} />
        <Route path="refunds" element={<AdminRefundsPage />} />
        <Route path="reports/revenue" element={<AdminRevenueAnalyticsPage />} />
        <Route path="reports/trending-courses" element={<AdminTrendingCourseReportsPage />} />
        <Route path="reports/geography" element={<AdminGeographicAnalyticsPage />} />
        <Route path="reports/student-growth" element={<AdminStudentGrowthPage />} />
        <Route path="reports/organizations" element={<AdminOrganizationAnalyticsPage />} />
        <Route path="reports/learning" element={<AdminLearningAnalyticsPage />} />
        <Route path="reports/assessments" element={<AdminAssessmentReportsPage />} />
        <Route path="reports/certifications" element={<AdminCertificationReportsPage />} />
        <Route path="reports/exports" element={<AdminReportExportsPage />} />
        <Route path="reports" element={<AdminExecutiveReportsPage />} />
        <Route path="users/admins" element={<AdminAdministratorAccountsPage />} />
        <Route path="users/content-admins" element={<AdminContentAdminAccountsPage />} />
        <Route path="users/roles" element={<AdminRolePermissionsPage />} />
        <Route path="users/access" element={<AdminAccountAccessPage />} />
        <Route path="users/status" element={<AdminAccountStatusPage />} />
        <Route path="users/logs" element={<AdminActivityLogsPage />} />
        <Route path="users/security-logs" element={<AdminSecurityAuditLogsPage />} />
        <Route path="media" element={<ContentMediaLibraryPage />} />
        <Route path="support/course-qa" element={<ContentCourseQaPage />} />
        {/* Legacy aliases */}
        <Route path="course-analytics" element={<ContentCourseAnalyticsPage />} />
        <Route path="publishing-history" element={<ContentPublishingHistoryPage />} />
        {/* Every other Super Admin screen resolves via superAdminCatalogByPath */}
        <Route path="*" element={<AdminCatalogPage />} />
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
