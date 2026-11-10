import { Link } from 'react-router'
import { toWorkspacePath, useContentWorkspace } from '@/routes/contentWorkspace'
import { computeCourseBuilderChecks, courseBuilderPreviewCopy, courseBuilderSettingsCopy } from '@/constants'
import { ContentBadge, ContentCard, useCourseBuilder } from '@/components/common'
import {
  AlertTriangleIcon,
  AwardIcon,
  BookIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ClockIcon,
  FileIcon,
  FolderIcon,
  UserIcon,
  VideoIcon,
} from '@/components/ui'

const copy = courseBuilderPreviewCopy
const labels = copy.labels

export function CourseBuilderPreviewPage() {
  const workspace = useContentWorkspace()
  const { details, modules, settings } = useCourseBuilder()
  const checks = computeCourseBuilderChecks(details, modules, settings)
  const blockers = checks.filter((check) => check.required && !check.passed)
  const warnings = checks.filter((check) => !check.required && !check.passed)
  const ready = blockers.length === 0

  const submoduleCount = modules.reduce((sum, module) => sum + module.submodules.length, 0)
  const quizCount = modules.filter((module) => module.quiz.enabled).length
  const totalMinutes = modules.reduce(
    (sum, module) => sum + module.submodules.reduce((inner, item) => inner + item.durationMin, 0),
    0,
  )
  const visibility = courseBuilderSettingsCopy.visibilityOptions.find(
    (item) => item.id === settings.visibility,
  )?.label
  const enrolment = courseBuilderSettingsCopy.enrolmentOptions.find(
    (item) => item.id === settings.enrolment,
  )?.label

  const summary = [
    { label: labels.modules, value: modules.length },
    { label: labels.submodules, value: submoduleCount },
    { label: labels.quizzes, value: quizCount },
    { label: labels.duration, value: `${details.duration || 0} ${copy.hours}` },
  ]

  const settingRows = [
    { label: labels.visibility, value: visibility ?? copy.notSet },
    { label: labels.enrolment, value: enrolment ?? copy.notSet },
    {
      label: labels.certificate,
      value: settings.certificateEnabled ? settings.certificateTemplate : copy.disabled,
    },
    { label: labels.cpd, value: settings.cpdEnabled ? `${settings.cpdHours} ${copy.hours}` : copy.disabled },
    {
      label: labels.completion,
      value:
        settings.completionRule === 'all'
          ? 'All mandatory submodules'
          : `${settings.completionPercent}% progress`,
    },
    {
      label: labels.version,
      value:
        details.versionName.trim() ||
        (details.versionKind === 'revision' ? 'Next version' : 'v1.0'),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy">{copy.title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{copy.subtitle}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="bg-gradient-to-br from-[#102A4C] to-[#004EA8] px-6 py-7 text-white">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#B9C6DA] uppercase">
                {copy.learnerView}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                {details.title || 'Untitled course'}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-[#DCE6F5]">
                {details.shortDescription || 'No short description yet.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#DCE6F5]">
                <span className="inline-flex items-center gap-1.5">
                  <BookIcon className="h-4 w-4" />
                  {details.code || '—'} · {details.category || copy.notSet}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" />
                  {details.instructor}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  {Math.round(totalMinutes / 6) / 10} {copy.hours} of content
                </span>
                {settings.cpdEnabled ? (
                  <span className="inline-flex items-center gap-1.5">
                    <AwardIcon className="h-4 w-4" />
                    {settings.cpdHours} CPD {copy.hours}
                  </span>
                ) : null}
              </div>
            </div>
            <dl className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-b border-slate-100 sm:grid-cols-4 sm:divide-y-0">
              {summary.map((item) => (
                <div key={item.label} className="px-5 py-4">
                  <dt className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-xl font-bold text-navy">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="grid gap-6 px-6 py-5 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-bold text-navy">{copy.outcomes}</h4>
                {details.outcomes.length ? (
                  <ul className="mt-2 space-y-1.5">
                    {details.outcomes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">{copy.notSet}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy">{copy.audience}</h4>
                <p className="mt-2 text-sm text-slate-600">{details.audience || copy.notSet}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-slate-400">{labels.level}:</dt>
                    <dd className="text-slate-600">{details.level}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-slate-400">{labels.language}:</dt>
                    <dd className="text-slate-600">{details.language}</dd>
                  </div>
                </dl>
                {details.tags.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {details.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>

          <ContentCard title={copy.outline}>
            {modules.length ? (
              <ol className="space-y-4">
                {modules.map((module, moduleIndex) => (
                  <li key={module.id} className="rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                        {moduleIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-navy">{module.title}</p>
                        {module.summary ? (
                          <p className="truncate text-xs text-slate-500">{module.summary}</p>
                        ) : null}
                      </div>
                      <span className="text-xs text-slate-400">
                        {module.submodules.length} submodules
                      </span>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {module.submodules.map((submodule, index) => {
                        const missing =
                          submodule.type === 'video' &&
                          !submodule.video.fileName.trim() &&
                          !submodule.video.url.trim()
                        return (
                          <li key={submodule.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                            <span className="text-slate-400">
                              {submodule.type === 'video' ? (
                                <VideoIcon className="h-4 w-4" />
                              ) : submodule.type === 'scorm' ? (
                                <FolderIcon className="h-4 w-4" />
                              ) : (
                                <FileIcon className="h-4 w-4" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-slate-700">
                              <span className="mr-1.5 text-xs text-slate-400">
                                {moduleIndex + 1}.{index + 1}
                              </span>
                              {submodule.title}
                            </span>
                            {missing ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                                <AlertTriangleIcon className="h-3.5 w-3.5" />
                                No video
                              </span>
                            ) : null}
                            <span className="text-xs text-slate-400">
                              {submodule.durationMin} {copy.min}
                            </span>
                          </li>
                        )
                      })}
                      {module.quiz.enabled ? (
                        <li className="flex items-center gap-3 bg-emerald-50/50 px-4 py-2.5 text-sm">
                          <span className="text-emerald-600">
                            <ClipboardIcon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 font-medium text-emerald-800">
                            {module.quiz.title}
                          </span>
                          <span className="text-xs text-emerald-700">
                            {module.quiz.questions.length} questions · pass {module.quiz.passMark}%
                          </span>
                        </li>
                      ) : null}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">No modules have been added yet.</p>
            )}
          </ContentCard>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <ContentCard
            title={copy.readiness}
            action={
              <ContentBadge tone={ready ? 'green' : 'red'}>
                {ready ? 'Ready' : `${blockers.length} blocking`}
              </ContentBadge>
            }
          >
            <p className="mb-3 text-xs text-slate-500">
              {ready ? copy.readinessReady : copy.readinessBlocked}
            </p>
            <ul className="space-y-2.5">
              {checks.map((check) => (
                <li key={check.id} className="flex items-start gap-2.5">
                  {check.passed ? (
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <AlertTriangleIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        check.required ? 'text-rose-500' : 'text-amber-500'
                      }`}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy">{check.label}</p>
                    {!check.passed ? (
                      <p className="text-xs text-slate-400">
                        {check.required ? copy.required : copy.recommended}
                        {check.detail ? ` · ${check.detail}` : ''}
                      </p>
                    ) : null}
                  </div>
                  {!check.passed ? (
                    <Link
                      to={toWorkspacePath(check.to, workspace)}
                      className="inline-flex items-center text-xs font-semibold text-brand hover:text-blue-700"
                    >
                      {copy.fix}
                      <ChevronRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
            {warnings.length && ready ? (
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {warnings.length} recommended item{warnings.length === 1 ? '' : 's'} can be fixed
                after publishing, but learners may notice missing content.
              </p>
            ) : null}
          </ContentCard>

          <ContentCard title={copy.settingsSummary}>
            <dl className="space-y-2.5 text-sm">
              {settingRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <dt className="text-slate-400">{row.label}</dt>
                  <dd className="text-right font-medium text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
          </ContentCard>
        </aside>
      </div>
    </div>
  )
}
