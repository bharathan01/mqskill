import { paths } from '@/routes/paths'

export const publicNavLinks = [
  { label: 'Home', to: paths.home },
  { label: 'Login', to: paths.login },
] as const

export const studentNavLinks = [
  { id: 'dashboard', label: 'Dashboard', to: paths.student.dashboard, icon: 'dashboard', end: true },
  { id: 'courses', label: 'Courses', to: paths.student.courses, icon: 'courses', badge: 4 },
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
] as const

export const employeeNavLinks = [
  { label: 'Dashboard', to: paths.employee.dashboard },
] as const

export const tutorNavLinks = [
  { label: 'Dashboard', to: paths.tutor.dashboard },
] as const

export const adminNavLinks = [
  { label: 'Dashboard', to: paths.admin.dashboard },
] as const

export const roleNav = {
  student: studentNavLinks,
  organization: organizationNavLinks,
  employee: employeeNavLinks,
  tutor: tutorNavLinks,
  admin: adminNavLinks,
} as const

export const roleLabels = {
  student: 'Student',
  organization: 'Organization',
  employee: 'Employee',
  tutor: 'Tutor',
  admin: 'Admin',
} as const
