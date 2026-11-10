import { createContext, useContext } from 'react'
import type {
  BuilderModule,
  CourseBuilderDetails,
  CourseBuilderSettings,
} from '@/constants'

export type CourseBuilderPublishState = 'idle' | 'confirm' | 'publishing' | 'published'

export type CourseBuilderDetailsErrors = Partial<
  Record<
    | 'title'
    | 'code'
    | 'category'
    | 'shortDescription'
    | 'versionKind'
    | 'parentCourse'
    | 'versionName',
    string
  >
>

export type CourseBuilderContextValue = {
  details: CourseBuilderDetails
  modules: BuilderModule[]
  settings: CourseBuilderSettings
  updateDetails: (patch: Partial<CourseBuilderDetails>) => void
  updateModules: (updater: (modules: BuilderModule[]) => BuilderModule[]) => void
  updateSettings: (patch: Partial<CourseBuilderSettings>) => void
  detailsErrors: CourseBuilderDetailsErrors
  publishState: CourseBuilderPublishState
}

export const CourseBuilderContext = createContext<CourseBuilderContextValue | null>(null)

export function useCourseBuilder() {
  const value = useContext(CourseBuilderContext)
  if (!value) throw new Error('useCourseBuilder must be used inside CourseBuilderShell')
  return value
}
