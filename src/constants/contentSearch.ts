import { contentAdminNavGroups } from './contentAdmin'
import { contentCoursesList, contentDraftCourses } from './contentCourses'
import { contentMediaVideos, contentQaQuestions } from './contentOperations'
import { contentScormPackages } from './contentScorm'
import { contentQuestionBank } from './contentAssessments'
import { paths } from '@/routes/paths'

export type ContentSearchKind =
  | 'course'
  | 'draft'
  | 'media'
  | 'scorm'
  | 'qa'
  | 'question'
  | 'page'

export type ContentSearchResult = {
  id: string
  kind: ContentSearchKind
  title: string
  subtitle: string
  to: string
}

export const contentSearchCopy = {
  heading: 'Results',
  empty: 'No matches. Try a course code, video title, or page name.',
  viewCourses: 'Browse all courses',
  kinds: {
    course: 'Course',
    draft: 'Draft',
    media: 'Media',
    scorm: 'SCORM',
    qa: 'Q&A',
    question: 'Question bank',
    page: 'Page',
  },
} as const

function withQuery(path: string, query: string) {
  const trimmed = query.trim()
  if (!trimmed) return path
  return `${path}?q=${encodeURIComponent(trimmed)}`
}

function matches(needle: string, ...parts: Array<string | undefined>) {
  return parts.some((part) => part?.toLowerCase().includes(needle))
}

export function searchContentAdmin(query: string, limit = 8): ContentSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: ContentSearchResult[] = []

  for (const course of contentCoursesList) {
    if (!matches(needle, course.title, course.code, course.category, course.status)) continue
    results.push({
      id: `course-${course.id}`,
      kind: 'course',
      title: course.title,
      subtitle: `${course.code} · ${course.category} · ${course.status}`,
      to: withQuery(paths.content.courses, course.title),
    })
  }

  for (const draft of contentDraftCourses) {
    if (!matches(needle, draft.title, draft.code, draft.category, draft.editor)) continue
    results.push({
      id: `draft-${draft.id}`,
      kind: 'draft',
      title: draft.title,
      subtitle: `${draft.code} · Draft · ${draft.editor}`,
      to: withQuery(paths.content.drafts, draft.title),
    })
  }

  for (const video of contentMediaVideos) {
    if (!matches(needle, video.title, ...video.usedIn)) continue
    results.push({
      id: `media-${video.id}`,
      kind: 'media',
      title: video.title,
      subtitle: `${video.duration} · ${video.status}${video.usedIn[0] ? ` · ${video.usedIn[0]}` : ''}`,
      to: withQuery(paths.content.media, video.title),
    })
  }

  for (const pkg of contentScormPackages) {
    if (!matches(needle, pkg.name, pkg.file, pkg.course, pkg.version)) continue
    results.push({
      id: `scorm-${pkg.id}`,
      kind: 'scorm',
      title: pkg.name,
      subtitle: `${pkg.version} · ${pkg.course}`,
      to: withQuery(paths.content.scorm, pkg.name),
    })
  }

  for (const item of contentQaQuestions) {
    if (!matches(needle, item.question, item.student, item.course)) continue
    results.push({
      id: `qa-${item.id}`,
      kind: 'qa',
      title: item.question,
      subtitle: `${item.student} · ${item.course}`,
      to: withQuery(paths.content.qa, item.question),
    })
  }

  for (const item of contentQuestionBank) {
    if (!matches(needle, item.prompt, item.course, item.type, ...item.tags)) continue
    results.push({
      id: `question-${item.id}`,
      kind: 'question',
      title: item.prompt,
      subtitle: `${item.course} · ${item.type}`,
      to: withQuery(paths.content.questionBank, item.prompt),
    })
  }

  for (const group of contentAdminNavGroups) {
    if (matches(needle, group.label)) {
      const child = group.children[0]
      if (child) {
        results.push({
          id: `page-${group.id}`,
          kind: 'page',
          title: group.label,
          subtitle: 'Navigation',
          to: child.to,
        })
      }
    }
    for (const child of group.children) {
      if (!matches(needle, child.label)) continue
      results.push({
        id: `page-${group.id}-${child.id}`,
        kind: 'page',
        title: child.label,
        subtitle: group.label,
        to: child.to,
      })
    }
  }

  const extras: ContentSearchResult[] = [
    {
      id: 'page-profile',
      kind: 'page',
      title: 'Profile & Settings',
      subtitle: 'Account',
      to: paths.content.profile,
    },
    {
      id: 'page-help',
      kind: 'page',
      title: 'Help & Support',
      subtitle: 'Support',
      to: paths.content.help,
    },
    {
      id: 'page-notifications',
      kind: 'page',
      title: 'Notifications',
      subtitle: 'Alerts',
      to: paths.content.notifications,
    },
    {
      id: 'page-create',
      kind: 'page',
      title: 'Create New Course',
      subtitle: 'Course builder',
      to: paths.content.createCourse,
    },
  ]
  for (const item of extras) {
    if (matches(needle, item.title, item.subtitle)) results.push(item)
  }

  const seen = new Set<string>()
  return results.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  }).slice(0, limit)
}
