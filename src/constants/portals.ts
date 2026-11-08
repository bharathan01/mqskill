import { paths } from '@/routes/paths'

export const portals = [
  {
    title: 'Student',
    description: 'Courses, lessons, and progress for learners.',
    to: paths.student.dashboard,
  },
  {
    title: 'Admin',
    description: 'Users, courses, and platform settings.',
    to: paths.admin.dashboard,
  },
] as const
