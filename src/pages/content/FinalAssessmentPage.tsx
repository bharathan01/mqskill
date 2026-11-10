import { useMemo, useState } from 'react'
import {
  contentAssessmentCourses,
  contentAssessmentDefaults,
  contentAssessmentsPage,
  contentAssessmentTypes,
  contentDifficulties,
  contentQuestionBank,
  createAssessmentQuestion,
  questionFromBank,
  type AssessmentQuestion,
  type AssessmentQuestionType,
  type QuestionDifficulty,
} from '@/constants'
import {
  ContentCard,
  ContentEmptyState,
  ContentField,
  ContentNotice,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
} from '@/components/common'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClipboardIcon,
  PlusIcon,
  TrashIcon,
} from '@/components/ui'

const copy = contentAssessmentsPage
const letters = 'ABCDEFGHIJ'

function isAnswered(question: AssessmentQuestion) {
  if (question.type === 'short') return true
  return question.options.some((option) => option.correct)
}

export function ContentFinalAssessmentPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [course, setCourse] = useState<string>(contentAssessmentDefaults.course)
  const [title, setTitle] = useState(contentAssessmentDefaults.title)
  const [passScore, setPassScore] = useState(contentAssessmentDefaults.passScore)
  const [timeLimit, setTimeLimit] = useState(contentAssessmentDefaults.timeLimit)
  const [attempts, setAttempts] = useState(contentAssessmentDefaults.attempts)
  const [shuffle, setShuffle] = useState(contentAssessmentDefaults.shuffle)
  const [showResults, setShowResults] = useState(contentAssessmentDefaults.showResults)
  const [bankPick, setBankPick] = useState('')
  const [notice, setNotice] = useState<{ tone: 'green' | 'amber'; text: string } | null>(null)

  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0)

  const checks = useMemo(
    () => [
      { id: 'title', label: copy.checks.title, ok: Boolean(title.trim()) },
      { id: 'questions', label: copy.checks.questions, ok: questions.length >= 5 },
      { id: 'answers', label: copy.checks.answers, ok: questions.every(isAnswered) },
      { id: 'prompts', label: copy.checks.prompts, ok: questions.every((q) => q.prompt.trim()) },
    ],
    [questions, title],
  )
  const ready = checks.every((check) => check.ok)

  const bankOptions = contentQuestionBank.filter(
    (item) => !questions.some((question) => question.prompt === item.prompt),
  )

  function patchQuestion(id: string, patch: Partial<AssessmentQuestion>) {
    setQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, ...patch } : question)),
    )
  }

  function changeType(question: AssessmentQuestion, type: AssessmentQuestionType) {
    if (type === question.type) return
    if (type === 'truefalse' || type === 'short' || question.type === 'truefalse' || question.type === 'short') {
      const fresh = createAssessmentQuestion(type)
      patchQuestion(question.id, { type, options: fresh.options })
      return
    }
    const options =
      type === 'single'
        ? question.options.map((option, index, all) => ({
            ...option,
            correct: option.correct && all.findIndex((entry) => entry.correct) === index,
          }))
        : question.options
    patchQuestion(question.id, { type, options })
  }

  function setCorrect(question: AssessmentQuestion, optionId: string, value: boolean) {
    patchQuestion(question.id, {
      options: question.options.map((option) => {
        if (question.type === 'multiple') {
          return option.id === optionId ? { ...option, correct: value } : option
        }
        return { ...option, correct: option.id === optionId }
      }),
    })
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= questions.length) return
    setQuestions((current) => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function addFromBank() {
    const item = contentQuestionBank.find((entry) => entry.id === bankPick)
    if (!item) return
    setQuestions((current) => [...current, questionFromBank(item)])
    setBankPick('')
  }

  function save() {
    setNotice({ tone: 'green', text: copy.saveNotice })
  }

  function publish() {
    if (!ready) {
      setNotice({
        tone: 'amber',
        text: checks
          .filter((check) => !check.ok)
          .map((check) => check.label)
          .join(' · '),
      })
      return
    }
    setNotice({ tone: 'green', text: copy.publishNotice })
  }

  const summaryRows = [
    { label: copy.summaryRows.questions, value: String(questions.length) },
    { label: copy.summaryRows.points, value: String(totalPoints) },
    { label: copy.summaryRows.pass, value: `${passScore}%` },
    {
      label: copy.summaryRows.time,
      value: timeLimit ? `${timeLimit} ${copy.minutes}` : copy.noLimit,
    },
    { label: copy.summaryRows.attempts, value: String(attempts) },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={save}
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
          >
            {copy.save}
          </button>
          <button
            type="button"
            onClick={publish}
            className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy.publish}
          </button>
        </div>
      </header>

      {notice ? (
        <ContentNotice tone={notice.tone} onDismiss={() => setNotice(null)}>
          {notice.text}
        </ContentNotice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <ContentCard title={copy.settings} description={copy.settingsDescription}>
            <div className="grid gap-4 md:grid-cols-2">
              <ContentField label={copy.course} htmlFor="fa-course">
                <ContentSelect
                  id="fa-course"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                >
                  <option value="">Select course</option>
                  {contentAssessmentCourses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </ContentSelect>
              </ContentField>
              <ContentField label={copy.assessmentTitle} htmlFor="fa-title">
                <ContentTextInput
                  id="fa-title"
                  value={title}
                  invalid={Boolean(title) && !title.trim()}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </ContentField>
              <ContentField label={copy.passScore} htmlFor="fa-pass" hint={copy.passScoreHint}>
                <ContentTextInput
                  id="fa-pass"
                  type="number"
                  min={0}
                  max={100}
                  value={passScore}
                  onChange={(event) =>
                    setPassScore(
                      event.target.value === ''
                        ? ''
                        : Math.min(100, Math.max(0, Number(event.target.value) || 0)),
                    )
                  }
                />
              </ContentField>
              <ContentField label={copy.timeLimit} htmlFor="fa-time" hint={copy.timeLimitHint}>
                <ContentTextInput
                  id="fa-time"
                  type="number"
                  min={0}
                  value={timeLimit}
                  onChange={(event) =>
                    setTimeLimit(
                      event.target.value === ''
                        ? ''
                        : Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
              </ContentField>
              <ContentField label={copy.attempts} htmlFor="fa-attempts">
                <ContentTextInput
                  id="fa-attempts"
                  type="number"
                  min={1}
                  value={attempts}
                  onChange={(event) =>
                    setAttempts(
                      event.target.value === ''
                        ? ''
                        : Math.max(1, Number(event.target.value) || 1),
                    )
                  }
                />
              </ContentField>
              <div className="hidden md:block" />
              <ContentToggle
                checked={shuffle}
                onChange={setShuffle}
                label={copy.shuffleQuestions}
                description={copy.shuffleQuestionsHint}
              />
              <ContentToggle
                checked={showResults}
                onChange={setShowResults}
                label={copy.showResults}
                description={copy.showResultsHint}
              />
            </div>
          </ContentCard>

          <ContentCard
            title={copy.questions}
            description={`${questions.length} ${copy.questionCount} · ${copy.totalPoints}: ${totalPoints}`}
            action={
              <button
                type="button"
                onClick={() =>
                  setQuestions((current) => [...current, createAssessmentQuestion('single')])
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                {copy.addQuestion}
              </button>
            }
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <ContentSelect
                aria-label={copy.addFromBank}
                value={bankPick}
                onChange={(event) => setBankPick(event.target.value)}
              >
                <option value="">{copy.addFromBankPlaceholder}</option>
                {bankOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.prompt.length > 80 ? `${item.prompt.slice(0, 80)}…` : item.prompt}
                  </option>
                ))}
              </ContentSelect>
              <button
                type="button"
                disabled={!bankPick}
                onClick={addFromBank}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.addFromBank}
              </button>
            </div>

            {questions.length ? (
              <ol className="space-y-4">
                {questions.map((question, index) => (
                  <li key={question.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF] text-xs font-bold text-brand">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          aria-label={copy.moveUp}
                          title={copy.moveUp}
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                          className="rounded p-0.5 text-slate-400 hover:text-navy disabled:opacity-30"
                        >
                          <ChevronLeftIcon className="h-4 w-4 rotate-90" />
                        </button>
                        <button
                          type="button"
                          aria-label={copy.moveDown}
                          title={copy.moveDown}
                          disabled={index === questions.length - 1}
                          onClick={() => move(index, 1)}
                          className="rounded p-0.5 text-slate-400 hover:text-navy disabled:opacity-30"
                        >
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_8rem_5rem]">
                        <ContentField
                          label={copy.questionPrompt}
                          htmlFor={`fa-q-${question.id}`}
                          className="sm:col-span-4"
                        >
                          <ContentTextArea
                            id={`fa-q-${question.id}`}
                            rows={2}
                            value={question.prompt}
                            placeholder={copy.promptPlaceholder}
                            invalid={!question.prompt.trim()}
                            onChange={(event) =>
                              patchQuestion(question.id, { prompt: event.target.value })
                            }
                          />
                        </ContentField>
                        <div className="hidden sm:block" />
                        <ContentField label={copy.type} htmlFor={`fa-t-${question.id}`}>
                          <ContentSelect
                            id={`fa-t-${question.id}`}
                            value={question.type}
                            onChange={(event) =>
                              changeType(question, event.target.value as AssessmentQuestionType)
                            }
                          >
                            {contentAssessmentTypes.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.label}
                              </option>
                            ))}
                          </ContentSelect>
                        </ContentField>
                        <ContentField label={copy.difficulty} htmlFor={`fa-d-${question.id}`}>
                          <ContentSelect
                            id={`fa-d-${question.id}`}
                            value={question.difficulty}
                            onChange={(event) =>
                              patchQuestion(question.id, {
                                difficulty: event.target.value as QuestionDifficulty,
                              })
                            }
                          >
                            {contentDifficulties.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.label}
                              </option>
                            ))}
                          </ContentSelect>
                        </ContentField>
                        <ContentField label={copy.points} htmlFor={`fa-p-${question.id}`}>
                          <ContentTextInput
                            id={`fa-p-${question.id}`}
                            type="number"
                            min={1}
                            value={question.points}
                            onChange={(event) =>
                              patchQuestion(question.id, {
                                points: Math.max(1, Number(event.target.value) || 1),
                              })
                            }
                          />
                        </ContentField>
                      </div>

                      <button
                        type="button"
                        aria-label={copy.removeQuestion}
                        title={copy.removeQuestion}
                        onClick={() =>
                          setQuestions((current) => current.filter((item) => item.id !== question.id))
                        }
                        className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 pl-10">
                      {question.type === 'short' ? (
                        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                          {copy.shortAnswerNote}
                        </p>
                      ) : (
                        <>
                          <p className="mb-2 text-sm font-semibold text-navy">{copy.options}</p>
                          <ul className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <li key={option.id} className="flex items-center gap-3">
                                <input
                                  type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                                  name={`fa-correct-${question.id}`}
                                  checked={option.correct}
                                  aria-label={`${copy.correct}: option ${letters[optionIndex]}`}
                                  onChange={(event) =>
                                    setCorrect(question, option.id, event.target.checked)
                                  }
                                  className="h-4 w-4 shrink-0 accent-[#004ea8]"
                                />
                                <span className="w-5 shrink-0 text-xs font-bold text-slate-400">
                                  {letters[optionIndex]}
                                </span>
                                <ContentTextInput
                                  value={option.text}
                                  readOnly={question.type === 'truefalse'}
                                  placeholder={`Option ${letters[optionIndex]}`}
                                  onChange={(event) =>
                                    patchQuestion(question.id, {
                                      options: question.options.map((entry) =>
                                        entry.id === option.id
                                          ? { ...entry, text: event.target.value }
                                          : entry,
                                      ),
                                    })
                                  }
                                />
                                {question.type !== 'truefalse' && question.options.length > 2 ? (
                                  <button
                                    type="button"
                                    aria-label={copy.removeOption}
                                    onClick={() =>
                                      patchQuestion(question.id, {
                                        options: question.options.filter(
                                          (entry) => entry.id !== option.id,
                                        ),
                                      })
                                    }
                                    className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                          {question.type !== 'truefalse' && question.options.length < 6 ? (
                            <button
                              type="button"
                              onClick={() =>
                                patchQuestion(question.id, {
                                  options: [
                                    ...question.options,
                                    {
                                      id: `${question.id}-o${question.options.length}-${Date.now()}`,
                                      text: '',
                                      correct: false,
                                    },
                                  ],
                                })
                              }
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-blue-700"
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                              {copy.addOption}
                            </button>
                          ) : null}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <ContentEmptyState
                icon={<ClipboardIcon className="h-6 w-6" />}
                title={copy.emptyTitle}
                body={copy.emptyBody}
              >
                <button
                  type="button"
                  onClick={() =>
                    setQuestions((current) => [...current, createAssessmentQuestion('single')])
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  {copy.addQuestion}
                </button>
              </ContentEmptyState>
            )}
          </ContentCard>
        </div>

        <aside className="space-y-6 self-start">
          <ContentCard title={copy.summary}>
            <dl className="space-y-3">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="font-semibold text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
          </ContentCard>
          <ContentCard title={copy.readiness}>
            <ul className="space-y-2.5">
              {checks.map((check) => (
                <li key={check.id} className="flex items-start gap-2.5 text-sm">
                  <CheckCircleIcon
                    className={`mt-0.5 h-4 w-4 shrink-0 ${check.ok ? 'text-emerald-500' : 'text-slate-300'}`}
                  />
                  <span className={check.ok ? 'text-navy' : 'text-slate-400'}>{check.label}</span>
                </li>
              ))}
            </ul>
          </ContentCard>
        </aside>
      </div>
    </div>
  )
}
