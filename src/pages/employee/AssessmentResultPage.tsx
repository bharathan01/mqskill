import { Link, Navigate, useLocation, useParams } from 'react-router'
import {
  buildQuizResultFromAnswers,
  employeeAssessmentResultPage,
  getAssignmentResult,
  getEmployeeAssessment,
  getQuizResult,
  type AssignmentResultDetail,
  type QuizResultDetail,
} from '@/constants'
import {
  BookIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  CloseIcon,
  FileIcon,
  LockIcon,
  RefreshIcon,
} from '@/components/ui'
import { useLearnerAssessmentLinks } from './learnerLinks'

const copy = employeeAssessmentResultPage

type LocationState = {
  answers?: Record<string, number>
  fileName?: string
  note?: string
}

function ScoreRing({ percent, passed }: { percent: number; passed: boolean }) {
  const size = 120
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = passed ? '#059669' : '#DC2626'

  return (
    <div className="relative flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-navy">{percent}%</span>
        <span
          className={`mt-0.5 text-[10px] font-bold tracking-wide uppercase ${
            passed ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {passed ? copy.passed : copy.notPassed}
        </span>
      </div>
    </div>
  )
}

function QuizResultView({
  assessmentId,
  assessmentTitle,
  courseTitle,
  courseId,
  result,
}: {
  assessmentId: string
  assessmentTitle: string
  courseTitle: string
  courseId: string
  result: QuizResultDetail
}) {
  const links = useLearnerAssessmentLinks()
  return (
    <div className="space-y-5">
      <Link
        to={links.list}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <ScoreRing percent={result.percent} passed={result.passed} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  result.passed
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    result.passed ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                {result.passed ? copy.passed : copy.notPassed}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {copy.attempt(result.attempt, result.maxAttempts)}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">{assessmentTitle}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {courseTitle} · Submitted {result.submittedAt}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {copy.score}
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {result.score} / {result.totalQuestions}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {copy.passingScore}
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {copy.passingScoreValue(
                    result.passingPercent,
                    result.passingNeeded,
                    result.totalQuestions,
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {copy.timeTaken}
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {copy.timeTakenValue(result.timeTaken, result.timeLimit)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {copy.attemptsLeft}
                </p>
                <p
                  className={`mt-1 text-sm font-bold ${
                    result.attemptsLeft > 0 ? 'text-amber-600' : 'text-navy'
                  }`}
                >
                  {copy.attemptsLeftValue(result.attemptsLeft)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!result.passed && result.attemptsLeft > 0 ? (
        <section className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-600">
              <RefreshIcon className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-amber-900">{result.retakeHint}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={links.course(courseId)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <BookIcon className="h-4 w-4" />
              {copy.reviewLessons}
            </Link>
            <Link
              to={links.quiz(assessmentId)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <RefreshIcon className="h-4 w-4" />
              {copy.retakeQuiz}
            </Link>
          </div>
        </section>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.topicsTitle}</h2>
          {result.topics.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No weak topics flagged for this attempt.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {result.topics.map((topic) => (
                <li
                  key={topic.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 px-3 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <BookIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy">{topic.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{topic.lessonLabel}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          topic.correct === 0
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {copy.ofCorrect(topic.correct, topic.total)}
                      </span>
                      <Link
                        to={links.course(topic.courseId)}
                        className="text-xs font-semibold text-brand hover:text-blue-700"
                      >
                        {copy.reviewLesson}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.questionsTitle}</h2>
          <ul className="mt-4 space-y-2">
            {result.questions.map((question) => (
              <li
                key={question.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    question.correct
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {question.correct ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <CloseIcon className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold ${
                      question.correct ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {question.correct ? copy.correct : copy.incorrect}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-navy">{question.prompt}</p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold ${
                    question.correct ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {question.correct ? copy.markGained : copy.markZero}
                </span>
              </li>
            ))}
          </ul>
          {!result.revealAnswers ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">
              <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {copy.lockNote}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

function AssignmentResultView({
  assessmentId,
  assessmentTitle,
  courseTitle,
  courseId,
  result,
}: {
  assessmentId: string
  assessmentTitle: string
  courseTitle: string
  courseId: string
  result: AssignmentResultDetail
}) {
  const links = useLearnerAssessmentLinks()
  const graded = result.grade != null

  return (
    <div className="space-y-5">
      <Link
        to={links.list}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              graded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {graded ? (
              <CheckCircleIcon className="h-3.5 w-3.5" />
            ) : null}
            {result.statusLabel || copy.assignmentSubmitted}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">{copy.assignmentTitle}</h1>
        <p className="mt-1 text-lg font-semibold text-navy">{assessmentTitle}</p>
        <p className="mt-1 text-sm text-slate-500">
          {courseTitle}
          {result.submittedAt ? ` · Submitted ${result.submittedAt}` : ''}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {copy.grade}
            </p>
            <p className="mt-1 text-sm font-bold text-navy">
              {graded ? `${result.grade}/${result.maxGrade}` : copy.noGrade}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3 sm:col-span-2">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {copy.file}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold text-navy">
              <FileIcon className="h-4 w-4 text-slate-400" />
              {result.fileName || '—'}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.note}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {result.note || 'No note provided.'}
          </p>
          <h2 className="mt-5 text-base font-bold text-navy">{copy.feedback}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {result.feedback || 'Awaiting reviewer feedback.'}
          </p>
          <Link
            to={links.course(courseId)}
            className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-blue-700"
          >
            {copy.openCourse} →
          </Link>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.rubric}</h2>
          {result.rubric.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Rubric scores appear after grading.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {result.rubric.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold text-navy">{row.label}</span>
                  <span className="font-bold text-slate-600">{row.score}</span>
                </li>
              ))}
            </ul>
          )}
          {!result.fileName ? (
            <Link
              to={links.submit(assessmentId)}
              className="mt-4 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Submit assignment
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export function EmployeeAssessmentResultPage() {
  const links = useLearnerAssessmentLinks()
  const { assessmentId = '' } = useParams()
  const location = useLocation()
  const state = (location.state as LocationState | null) ?? null
  const assessment = getEmployeeAssessment(assessmentId)

  if (!assessment) {
    return <Navigate to={links.list} replace />
  }

  if (assessment.kind === 'quiz') {
    const stored = getQuizResult(assessmentId)
    const result =
      state?.answers != null
        ? buildQuizResultFromAnswers(assessmentId, state.answers)
        : stored

    if (!result) {
      return <Navigate to={links.quiz(assessmentId)} replace />
    }

    return (
      <QuizResultView
        assessmentId={assessmentId}
        assessmentTitle={assessment.title}
        courseTitle={assessment.courseTitle}
        courseId={assessment.courseId}
        result={result}
      />
    )
  }

  const storedAssignment = getAssignmentResult(assessmentId)
  const result: AssignmentResultDetail = storedAssignment
    ? {
        ...storedAssignment,
        fileName: state?.fileName || storedAssignment.fileName,
        note: state?.note || storedAssignment.note,
        submittedAt:
          state?.fileName && !storedAssignment.submittedAt
            ? 'Just now'
            : storedAssignment.submittedAt || (state?.fileName ? 'Just now' : ''),
        statusLabel:
          state?.fileName && !storedAssignment.grade
            ? copy.assignmentPending
            : storedAssignment.statusLabel,
      }
    : {
        assessmentId,
        submittedAt: state?.fileName ? 'Just now' : '',
        fileName: state?.fileName ?? '',
        note: state?.note ?? '',
        statusLabel: state?.fileName ? copy.assignmentPending : 'Not submitted',
        grade: null,
        maxGrade: 100,
        feedback: null,
        rubric: [],
      }

  return (
    <AssignmentResultView
      assessmentId={assessmentId}
      assessmentTitle={assessment.title}
      courseTitle={assessment.courseTitle}
      courseId={assessment.courseId}
      result={result}
    />
  )
}
