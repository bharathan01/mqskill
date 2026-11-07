import { paths } from '@/routes/paths'

export type UserRole = 'student' | 'organization' | 'employee'

export type DemoUser = {
  email: string
  password: string
  role: UserRole
  name: string
}

export const demoOtp = '123456'

export const demoUsers: DemoUser[] = [
  {
    email: 'ahmed@gmail.com',
    password: 'student123',
    role: 'student',
    name: 'Ahmed Hassan',
  },
  {
    email: 'org@abccorporation.com',
    password: 'org123',
    role: 'organization',
    name: 'ABC Corporation',
  },
  {
    email: 'employee@abccorporation.com',
    password: 'employee123',
    role: 'employee',
    name: 'Sara Ali',
  },
]

export const authMessages = {
  invalidCredentials: 'Invalid email or password.',
  invalidOtp: 'Incorrect verification code.',
  emailRequired: 'Enter an email to continue.',
  unknownEmail: 'No account found for this email.',
} as const

export function findDemoUser(email: string) {
  const normalized = email.trim().toLowerCase()
  return demoUsers.find((user) => user.email.toLowerCase() === normalized) ?? null
}

export function authenticateDemoUser(email: string, password: string) {
  const user = findDemoUser(email)
  if (!user || user.password !== password) return null
  return user
}

export function verifyDemoOtp(code: string) {
  return code === demoOtp
}

export function dashboardPathForRole(role: UserRole) {
  switch (role) {
    case 'student':
      return paths.student.dashboard
    case 'organization':
      return paths.organization.dashboard
    case 'employee':
      return paths.employee.dashboard
  }
}
