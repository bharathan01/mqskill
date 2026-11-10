import { useLocation } from 'react-router'
import { paths } from './paths'

/** Same keys as `paths.content`, values are plain route strings. */
export type ContentWorkspacePaths = { [K in keyof typeof paths.content]: string }

const contentWorkspacePaths: ContentWorkspacePaths = paths.content

const adminWorkspacePaths: ContentWorkspacePaths = {
  root: paths.admin.root,
  dashboard: paths.admin.dashboard,
  courses: paths.admin.courses,
  versions: paths.admin.courseVersions,
  drafts: paths.admin.draftCourses,
  createCourse: paths.admin.createCourse,
  courseBuilder: paths.admin.courseBuilder,
  courseQuiz: paths.admin.courseQuiz,
  courseSettings: paths.admin.courseSettings,
  coursePreview: paths.admin.coursePreview,
  scorm: paths.admin.scorm,
  scormValidation: paths.admin.scormValidation,
  assessments: paths.admin.quizzes,
  quizzes: paths.admin.quizzes,
  assignments: paths.admin.assignments,
  questionBank: paths.admin.questionBank,
  cpd: paths.admin.cpd,
  certificates: paths.admin.certificateTemplates,
  media: paths.admin.media,
  qa: paths.admin.courseQa,
  analytics: paths.admin.courseAnalytics,
  history: paths.admin.publishingHistory,
  notifications: paths.admin.notifications,
  profile: paths.admin.profile,
  help: paths.admin.help,
}

export function isAdminWorkspacePath(pathname: string) {
  return pathname === paths.admin.root || pathname.startsWith(`${paths.admin.root}/`)
}

export function getContentWorkspace(pathname: string): ContentWorkspacePaths {
  return isAdminWorkspacePath(pathname) ? adminWorkspacePaths : contentWorkspacePaths
}

/** Translate a `paths.content.*` route (e.g. from shared constants) into the active workspace. */
export function toWorkspacePath(to: string, workspace: ContentWorkspacePaths): string {
  const [base, ...rest] = to.split(/(?=[?#])/)
  const key = (Object.keys(contentWorkspacePaths) as (keyof ContentWorkspacePaths)[]).find(
    (k) => contentWorkspacePaths[k] === base,
  )
  return key ? `${workspace[key]}${rest.join('')}` : to
}

export function useContentWorkspace(): ContentWorkspacePaths {
  const { pathname } = useLocation()
  return getContentWorkspace(pathname)
}
