import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import {
  computeCourseBuilderChecks,
  courseBuilderDefaultSettings,
  courseBuilderShell,
  courseBuilderSteps,
  createDefaultCourseBuilderDetails,
  createDefaultCourseBuilderModules,
  type BuilderModule,
  type CourseBuilderDetails,
  type CourseBuilderSettings,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  SaveIcon,
} from '@/components/ui'
import {
  CourseBuilderContext,
  type CourseBuilderContextValue,
  type CourseBuilderDetailsErrors,
  type CourseBuilderPublishState,
} from './courseBuilderContext'

const copy = courseBuilderShell

function stepIndexForPath(pathname: string) {
  const clean = pathname.replace(/\/+$/, '')
  if (clean === paths.content.coursePreview) return 3
  if (clean === paths.content.courseSettings) return 2
  if (clean === paths.content.courseBuilder || clean === paths.content.courseQuiz) return 1
  return 0
}

function computeDetailsErrors(details: CourseBuilderDetails): CourseBuilderDetailsErrors {
  const errors: CourseBuilderDetailsErrors = {}
  if (!details.title.trim()) errors.title = 'Course title is required'
  if (!details.code.trim()) errors.code = 'Course code is required'
  if (!details.category) errors.category = 'Select a category'
  if (!details.shortDescription.trim()) errors.shortDescription = 'Add a short description'
  return errors
}

export function CourseBuilderShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const stepIndex = stepIndexForPath(location.pathname)

  const [details, setDetails] = useState<CourseBuilderDetails>(createDefaultCourseBuilderDetails)
  const [modules, setModules] = useState<BuilderModule[]>(createDefaultCourseBuilderModules)
  const [settings, setSettings] = useState<CourseBuilderSettings>(courseBuilderDefaultSettings)
  const [showErrors, setShowErrors] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [publishState, setPublishState] = useState<CourseBuilderPublishState>('idle')

  const detailsErrors = useMemo(
    () => (showErrors ? computeDetailsErrors(details) : {}),
    [details, showErrors],
  )
  const hasDetailErrors = Object.keys(detailsErrors).length > 0

  const checks = useMemo(
    () => computeCourseBuilderChecks(details, modules, settings),
    [details, modules, settings],
  )
  const canPublish = checks.every((check) => !check.required || check.passed)

  const updateDetails = useCallback(
    (patch: Partial<CourseBuilderDetails>) => setDetails((current) => ({ ...current, ...patch })),
    [],
  )
  const updateModules = useCallback(
    (updater: (current: BuilderModule[]) => BuilderModule[]) => setModules(updater),
    [],
  )
  const updateSettings = useCallback(
    (patch: Partial<CourseBuilderSettings>) => setSettings((current) => ({ ...current, ...patch })),
    [],
  )

  useEffect(() => {
    if (publishState !== 'publishing') return
    const timer = window.setTimeout(() => setPublishState('published'), 1000)
    return () => window.clearTimeout(timer)
  }, [publishState])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  function saveDraft() {
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  function goNext() {
    if (stepIndex === 0) {
      const errors = computeDetailsErrors(details)
      if (Object.keys(errors).length) {
        setShowErrors(true)
        return
      }
    }
    saveDraft()
    navigate(courseBuilderSteps[Math.min(stepIndex + 1, courseBuilderSteps.length - 1)].to)
  }

  function goBack() {
    navigate(courseBuilderSteps[Math.max(stepIndex - 1, 0)].to)
  }

  const value: CourseBuilderContextValue = {
    details,
    modules,
    settings,
    updateDetails,
    updateModules,
    updateSettings,
    detailsErrors,
    publishState,
  }

  const isPublished = publishState === 'published'
  const isLastStep = stepIndex === courseBuilderSteps.length - 1
  const publishing = publishState === 'publishing'

  return (
    <CourseBuilderContext.Provider value={value}>
      <div className="space-y-6 pb-24">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to={paths.content.courses}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              {copy.backToCourses}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {isPublished ? 'Published · v1.0' : copy.draftBadge}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
          </div>
          <p className="text-sm font-medium text-slate-400">
            {copy.stepOf} {stepIndex + 1} {copy.of} {courseBuilderSteps.length}
          </p>
        </header>

        <nav
          aria-label="Course builder steps"
          className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:px-6"
        >
          <ol className="flex items-center">
            {courseBuilderSteps.map((step, index) => {
              const complete = isPublished || index < stepIndex
              const current = !isPublished && index === stepIndex
              return (
                <li key={step.id} className="flex flex-1 items-center last:flex-none">
                  <Link
                    to={step.to}
                    aria-current={current ? 'step' : undefined}
                    className="flex items-center gap-3 rounded-lg py-1 pr-2"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                        complete
                          ? 'border-brand bg-brand text-white'
                          : current
                            ? 'border-brand bg-[#EFF4FF] text-brand'
                            : 'border-slate-200 bg-white text-slate-400'
                      }`}
                    >
                      {complete ? <CheckIcon className="h-4 w-4" /> : step.number}
                    </span>
                    <span className="hidden sm:block">
                      <span
                        className={`block text-sm font-semibold ${
                          current || complete ? 'text-navy' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="block text-xs text-slate-400">{step.hint}</span>
                    </span>
                  </Link>
                  {index < courseBuilderSteps.length - 1 ? (
                    <span
                      className={`mx-2 h-0.5 flex-1 rounded-full sm:mx-4 ${
                        index < stepIndex || isPublished ? 'bg-brand' : 'bg-slate-200'
                      }`}
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>
        </nav>

        {stepIndex === 0 && hasDetailErrors ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {copy.validationBanner}
          </div>
        ) : null}

        {isPublished ? (
          <section className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircleIcon className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-navy">{copy.published.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              <span className="font-semibold text-navy">{details.title}</span> {copy.published.body}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Link
                to={paths.content.courses}
                className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {copy.published.allCourses}
              </Link>
              <Link
                to={paths.content.versions}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.published.versions}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDetails(createDefaultCourseBuilderDetails())
                  setModules(createDefaultCourseBuilderModules())
                  setSettings(courseBuilderDefaultSettings)
                  setShowErrors(false)
                  setSavedAt(null)
                  setPublishState('idle')
                  navigate(paths.content.createCourse)
                }}
                className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-brand hover:bg-[#EFF4FF]"
              >
                {copy.published.another}
              </button>
            </div>
          </section>
        ) : (
          <Outlet />
        )}
      </div>

      {!isPublished ? (
        <div className="sticky bottom-0 z-10 -mx-6 border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {stepIndex === 0 ? (
                <Link
                  to={paths.content.courses}
                  className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  {copy.cancel}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  {copy.back}
                </button>
              )}
              {savedAt ? (
                <span className="hidden text-xs text-slate-400 sm:inline">
                  {copy.saved} at {savedAt}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                <SaveIcon className="h-4 w-4" />
                {copy.saveDraft}
              </button>
              {isLastStep ? (
                <button
                  type="button"
                  disabled={!canPublish}
                  onClick={() => setPublishState('confirm')}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  {copy.publish}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {copy.continue}
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {publishState === 'confirm' || publishing ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2744]/50 px-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF4FF] text-brand">
                <CheckCircleIcon className="h-5 w-5" />
              </span>
              {!publishing ? (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setPublishState('idle')}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              ) : null}
            </div>
            <h2 id="publish-modal-title" className="mt-4 text-lg font-bold text-navy">
              {copy.publishModal.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-navy">{details.title}</p>
            <p className="mt-2 text-sm text-slate-500">{copy.publishModal.body}</p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={publishing}
                onClick={() => setPublishState('idle')}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50 disabled:opacity-50"
              >
                {copy.publishModal.cancel}
              </button>
              <button
                type="button"
                disabled={publishing}
                onClick={() => setPublishState('publishing')}
                className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {publishing ? copy.publishModal.working : copy.publishModal.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </CourseBuilderContext.Provider>
  )
}
