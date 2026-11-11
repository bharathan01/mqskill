import { paths } from '@/routes/paths'
import { superAdminCoursePages } from './superAdminCatalogCourses'
import { superAdminLearningPages } from './superAdminCatalogLearning'
import { superAdminOperationsPages } from './superAdminCatalogOperations'
import { superAdminPeoplePages } from './superAdminCatalogPeople'
import { superAdminReportPages } from './superAdminCatalogReports'
import { superAdminSystemPages } from './superAdminCatalogSystem'
import type { SuperAdminCatalogPage } from './superAdminCatalogTypes'

export type {
  SuperAdminCatalogAction,
  SuperAdminCatalogChart,
  SuperAdminCatalogColumn,
  SuperAdminCatalogFilter,
  SuperAdminCatalogForm,
  SuperAdminCatalogKpi,
  SuperAdminCatalogMode,
  SuperAdminCatalogPage,
  SuperAdminCatalogRow,
  SuperAdminColumnKind,
  SuperAdminFaq,
  SuperAdminFormField,
  SuperAdminFormFieldType,
  SuperAdminFormRecord,
  SuperAdminFormSection,
  SuperAdminKpiMetric,
  SuperAdminRowActionId,
  SuperAdminStatusAction,
} from './superAdminCatalogTypes'
export { superAdminReferenceDate } from './superAdminCatalogTypes'

/**
 * Admin routes rendered by the shared Content Admin page components
 * (see AppRoutes). Their catalog stubs are intentionally excluded.
 */
const sharedContentAdminPaths: ReadonlySet<string> = new Set([
  paths.admin.courses,
  paths.admin.createCourse,
  paths.admin.courseBuilder,
  paths.admin.courseQuiz,
  paths.admin.courseSettings,
  paths.admin.coursePreview,
  paths.admin.draftCourses,
  paths.admin.coursePricing,
  paths.admin.courseIntelligence,
  paths.admin.trendingCourses,
  paths.admin.topSellingCourses,
  paths.admin.mostViewedCourses,
  paths.admin.highestRevenueCourses,
  paths.admin.recentlyAddedCourses,
  paths.admin.recentlyUpdatedCourses,
  paths.admin.courseVersions,
  paths.admin.scorm,
  paths.admin.scormValidation,
  paths.admin.quizzes,
  paths.admin.assignments,
  paths.admin.questionBank,
  paths.admin.assessmentAnalytics,
  paths.admin.assessmentResults,
  paths.admin.passingStatistics,
  paths.admin.assessmentPerformance,
  paths.admin.finalAssessments,
  paths.admin.cpd,
  paths.admin.certificates,
  paths.admin.certificateVerify,
  paths.admin.certificateStatus,
  paths.admin.certificateRequirements,
  paths.admin.certificateReports,
  paths.admin.certificateTemplates,
  paths.admin.liveClasses,
  paths.admin.scheduleLive,
  paths.admin.upcomingSessions,
  paths.admin.completedSessions,
  paths.admin.zoomLinks,
  paths.admin.attendance,
  paths.admin.liveReports,
  paths.admin.students,
  paths.admin.studentDetails,
  paths.admin.studentsByCountry,
  paths.admin.studentAnalytics,
  paths.admin.studentPurchases,
  paths.admin.enrollments,
  paths.admin.studentProgress,
  paths.admin.studentAssessments,
  paths.admin.studentCertificates,
  paths.admin.studentPayments,
  paths.admin.organizations,
  paths.admin.organizationProfiles,
  paths.admin.organizationPlans,
  paths.admin.organizationEmployees,
  paths.admin.organizationPurchases,
  paths.admin.organizationSeats,
  paths.admin.organizationVersionAllocations,
  paths.admin.organizationTraining,
  paths.admin.organizationInvoices,
  paths.admin.organizationPerformance,
  paths.admin.media,
  paths.admin.courseQa,
  paths.admin.courseAnalytics,
  paths.admin.publishingHistory,
  paths.admin.finance,
  paths.admin.orders,
  paths.admin.orderDetail,
  paths.admin.b2cSales,
  paths.admin.b2bSales,
  paths.admin.revenueReports,
  paths.admin.salesInvoices,
  paths.admin.refunds,
  paths.admin.coupons,
  paths.admin.salesGateways,
  paths.admin.taxFees,
  paths.admin.costs,
  paths.admin.financialExports,
  paths.admin.reports,
  paths.admin.revenueAnalytics,
  paths.admin.trendingCourseReport,
  paths.admin.geographicAnalytics,
  paths.admin.studentGrowth,
  paths.admin.organizationReports,
  paths.admin.learningAnalytics,
  paths.admin.assessmentReports,
  paths.admin.certificationReports,
  paths.admin.reportExports,
  paths.admin.admins,
  paths.admin.contentAdmins,
  paths.admin.roles,
  paths.admin.accountAccess,
  paths.admin.accountStatus,
  paths.admin.adminLogs,
  paths.admin.securityLogs,
])

export const superAdminCatalogPages: SuperAdminCatalogPage[] = [
  ...superAdminCoursePages,
  ...superAdminLearningPages,
  ...superAdminPeoplePages,
  ...superAdminOperationsPages,
  ...superAdminReportPages,
  ...superAdminSystemPages,
].filter((page) => !sharedContentAdminPaths.has(page.path))

export const superAdminCatalogByPath: Record<string, SuperAdminCatalogPage> = Object.fromEntries(
  superAdminCatalogPages.map((page) => [page.path, page]),
)

export function getSuperAdminCatalogPage(pathname: string): SuperAdminCatalogPage | undefined {
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return superAdminCatalogByPath[key]
}
