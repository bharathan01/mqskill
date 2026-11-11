import { paths } from '@/routes/paths'

export const publicNavLinks = [
  { label: 'Home', to: paths.home },
  { label: 'Login', to: paths.login },
] as const

export const studentNavLinks = [
  { id: 'dashboard', label: 'Dashboard', to: paths.student.dashboard, icon: 'dashboard', end: true },
  { id: 'courses', label: 'Courses', to: paths.student.courses, icon: 'courses', badge: 4 },
  { id: 'assessments', label: 'My Assessments', to: paths.student.assessments, icon: 'assessments' },
  { id: 'certificates', label: 'Certificates', to: paths.student.certificates, icon: 'certificates' },
  { id: 'payments', label: 'Payments', to: paths.student.payments, icon: 'payments' },
  { id: 'profile', label: 'Profile Settings', to: paths.student.profile, icon: 'profile' },
  { id: 'settings', label: 'Account Settings', to: paths.student.settings, icon: 'settings' },
  { id: 'language', label: 'Language', to: paths.student.language, icon: 'language' },
] as const

export const studentNavFooter = {
  help: { label: 'Help & Support', to: paths.student.help },
  signOut: { label: 'Sign Out', to: paths.login },
} as const

export const organizationNavLinks = [
  { label: 'Dashboard', to: paths.organization.dashboard },
  { label: 'Employees', to: paths.organization.employees },
  { label: 'Training requests', to: paths.organization.requests },
  { label: 'Course catalog', to: paths.organization.catalog },
  { label: 'Purchased courses', to: paths.organization.purchased },
  { label: 'Reports & analytics', to: paths.organization.reports },
  { label: 'Announcements', to: paths.organization.announcements },
  { label: 'Billing & invoices', to: paths.organization.billing },
  { label: 'Organization settings', to: paths.organization.settings },
  { label: 'Help & support', to: paths.organization.help },
] as const

export const employeeNavLinks = [
  { label: 'Dashboard', to: paths.employee.dashboard },
  { label: 'My Courses', to: paths.employee.courses },
  { label: 'My Assessments', to: paths.employee.assessments },
  { label: 'Live Sessions', to: paths.employee.sessions },
  { label: 'Certificates & CPD', to: paths.employee.certificates },
  { label: 'Help & Support', to: paths.employee.help },
  { label: 'Profile & Settings', to: paths.employee.profile },
] as const

export const tutorNavLinks = [
  { label: 'Dashboard', to: paths.tutor.dashboard },
] as const

export const adminNavLinks = [
  { label: 'Executive Overview', to: paths.admin.dashboard },
  { label: 'Business Performance', to: paths.admin.businessPerformance },
] as const

export const contentAdminNavLinks = [
  { label: 'Dashboard', to: paths.content.dashboard },
] as const

export const roleNav = {
  student: studentNavLinks,
  organization: organizationNavLinks,
  employee: employeeNavLinks,
  tutor: tutorNavLinks,
  admin: adminNavLinks,
  contentAdmin: contentAdminNavLinks,
} as const

export const roleLabels = {
  student: 'Student',
  organization: 'Organization',
  employee: 'Employee',
  tutor: 'Tutor',
  admin: 'Super Admin',
  contentAdmin: 'Content Admin',
} as const
