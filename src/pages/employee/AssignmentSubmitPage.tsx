import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import {
  employeeAssignmentSubmitPage,
  employeeAssessmentsPage,
  getEmployeeAssessment,
} from '@/constants'
import { ChevronLeftIcon, FileIcon } from '@/components/ui'
import { useLearnerAssessmentLinks } from './learnerLinks'

const copy = employeeAssignmentSubmitPage
const fieldClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15'

export function EmployeeAssignmentSubmitPage() {
  const { assessmentId = '' } = useParams()
  const navigate = useNavigate()
  const links = useLearnerAssessmentLinks()
  const assessment = getEmployeeAssessment(assessmentId)

  const [fileName, setFileName] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  if (!assessment || assessment.kind !== 'assignment') {
    return <Navigate to={links.list} replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!fileName) {
      setError(copy.required)
      return
    }
    navigate(links.result(assessmentId), {
      state: { fileName, note },
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        to={links.list}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          {employeeAssessmentsPage.kind.assignment}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-navy">{copy.title}</h1>
        <p className="mt-1 text-lg font-semibold text-navy">{assessment.title}</p>
        <p className="mt-1 text-sm text-slate-500">
          {assessment.courseTitle} · {assessment.moduleLabel}
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <h2 className="text-sm font-bold text-navy">{copy.brief}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{assessment.brief}</p>
          <p className="mt-3 text-xs text-slate-400">
            {assessment.dueLabel} · {assessment.points} points · {assessment.instructor}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <h2 className="text-sm font-bold text-navy">{copy.upload}</h2>
          <p className="mt-1 text-xs text-slate-400">{copy.uploadHint}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <FileIcon className="h-4 w-4" />
              {copy.chooseFile}
              <input
                type="file"
                className="hidden"
                onChange={(event) => {
                  setFileName(event.target.files?.[0]?.name ?? '')
                  setError('')
                }}
              />
            </label>
            {fileName ? <span className="text-sm text-slate-600">{fileName}</span> : null}
          </div>

          <label className="mt-5 block text-sm font-semibold text-navy">
            {copy.note}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder={copy.notePlaceholder}
              className={fieldClass}
            />
          </label>

          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            {copy.relatedCourse}
          </p>
          <p className="mt-1 text-sm font-bold text-navy">{assessment.courseTitle}</p>
          <Link
            to={links.course(assessment.courseId)}
            className="mt-2 inline-flex text-sm font-semibold text-brand hover:text-blue-700"
          >
            Open course →
          </Link>
        </section>

        <div className="flex items-center gap-2">
          <Link
            to={links.list}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.cancel}
          </Link>
          <button
            type="submit"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy.submit}
          </button>
        </div>
      </form>
    </div>
  )
}
