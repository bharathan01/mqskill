import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import {
  employeeAssessmentsPage,
  employeeQuizTakePage,
  getEmployeeAssessment,
  getQuizBank,
} from '@/constants'
import { CheckIcon, ChevronLeftIcon } from '@/components/ui'
import { useLearnerAssessmentLinks } from './learnerLinks'

const copy = employeeQuizTakePage

export function EmployeeQuizTakePage() {
  const { assessmentId = '' } = useParams()
  const navigate = useNavigate()
  const links = useLearnerAssessmentLinks()
  const assessment = getEmployeeAssessment(assessmentId)
  const questions = useMemo(() => getQuizBank(assessmentId), [assessmentId])

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [error, setError] = useState('')

  if (!assessment || assessment.kind !== 'quiz') {
    return <Navigate to={links.list} replace />
  }

  const current = questions[index]
  const selected = answers[current.id]
  const isLast = index === questions.length - 1

  function choose(optionIndex: number) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: optionIndex }))
    setError('')
  }

  function goNext() {
    if (selected == null) {
      setError(copy.required)
      return
    }
    if (isLast) {
      navigate(links.result(assessmentId), {
        state: { answers },
      })
      return
    }
    setIndex((value) => value + 1)
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
            {employeeAssessmentsPage.kind.quiz}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {copy.progress(index + 1, questions.length)}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-navy">{assessment.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {copy.course}: {assessment.courseTitle} · {assessment.moduleLabel}
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
        <h2 className="text-base font-bold text-navy">{current.prompt}</h2>
        <div className="mt-4 space-y-2">
          {current.options.map((option, optionIndex) => {
            const active = selected === optionIndex
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(optionIndex)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm ${
                  active
                    ? 'border-brand bg-[#EAF2FF] font-semibold text-brand'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    active ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {active ? <CheckIcon className="h-3 w-3" /> : null}
                </span>
                {option}
              </button>
            )
          })}
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={index === 0}
          className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copy.previous}
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {isLast ? copy.submit : copy.next}
        </button>
      </div>
    </div>
  )
}
