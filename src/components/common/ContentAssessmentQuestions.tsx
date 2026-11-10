import { useState } from 'react'
import {
  contentAssessmentTypes,
  contentDifficulties,
  contentQuestionBank,
  createAssessmentQuestion,
  questionFromBank,
  type AssessmentQuestion,
  type AssessmentQuestionType,
  type QuestionBankItem,
  type QuestionDifficulty,
} from '@/constants'
import {
  ContentEmptyState,
  ContentField,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
} from '@/components/common'
import {
  ChevronDownIcon,
  ClipboardIcon,
  PlusIcon,
  TrashIcon,
} from '@/components/ui'

const letters = 'ABCDEFGHIJ'

type Props = {
  questions: AssessmentQuestion[]
  onChange: (questions: AssessmentQuestion[]) => void
  onSaveToBank?: (question: AssessmentQuestion) => void
  emptyTitle?: string
  emptyBody?: string
}

function isAnswered(question: AssessmentQuestion) {
  if (question.type === 'short') return true
  return question.options.some((option) => option.correct)
}

export function ContentAssessmentQuestions({
  questions,
  onChange,
  onSaveToBank,
  emptyTitle = 'No questions yet',
  emptyBody = 'Add from the question bank or create a new question here.',
}: Props) {
  const [bankPick, setBankPick] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(questions[0]?.id ?? null)

  const bankOptions = contentQuestionBank.filter(
    (item) => !questions.some((question) => question.prompt === item.prompt),
  )

  function patch(id: string, patch: Partial<AssessmentQuestion>) {
    onChange(questions.map((question) => (question.id === id ? { ...question, ...patch } : question)))
  }

  function changeType(question: AssessmentQuestion, type: AssessmentQuestionType) {
    if (type === question.type) return
    if (
      type === 'truefalse' ||
      type === 'short' ||
      question.type === 'truefalse' ||
      question.type === 'short'
    ) {
      const fresh = createAssessmentQuestion(type)
      patch(question.id, { type, options: fresh.options })
      return
    }
    const options =
      type === 'single'
        ? question.options.map((option, index, all) => ({
            ...option,
            correct: option.correct && all.findIndex((entry) => entry.correct) === index,
          }))
        : question.options
    patch(question.id, { type, options })
  }

  function setCorrect(question: AssessmentQuestion, optionId: string, value: boolean) {
    patch(question.id, {
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
    const next = [...questions]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function addBlank() {
    const question = createAssessmentQuestion('single')
    onChange([...questions, question])
    setExpandedId(question.id)
  }

  function addFromBank() {
    const item = contentQuestionBank.find((entry) => entry.id === bankPick)
    if (!item) return
    const question = questionFromBank(item)
    onChange([...questions, question])
    setBankPick('')
    setExpandedId(question.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <ContentField label="Add from question bank" htmlFor="aq-bank">
            <ContentSelect
              id="aq-bank"
              value={bankPick}
              onChange={(event) => setBankPick(event.target.value)}
            >
              <option value="">Choose a question from the bank…</option>
              {bankOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.prompt.length > 80 ? `${item.prompt.slice(0, 80)}…` : item.prompt}
                </option>
              ))}
            </ContentSelect>
          </ContentField>
        </div>
        <button
          type="button"
          disabled={!bankPick}
          onClick={addFromBank}
          className="inline-flex h-10 shrink-0 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add from bank
        </button>
        <button
          type="button"
          onClick={addBlank}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add question
        </button>
      </div>

      {questions.length === 0 ? (
        <ContentEmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title={emptyTitle}
          body={emptyBody}
        />
      ) : (
        <ol className="space-y-3">
          {questions.map((question, index) => {
            const open = expandedId === question.id
            return (
              <li key={question.id} className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-start gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : question.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF] text-xs font-bold text-brand">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy">
                        {question.prompt.trim() || 'Untitled question'}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {contentAssessmentTypes.find((item) => item.id === question.type)?.label} ·{' '}
                        {question.points} pts
                        {!isAnswered(question) ? ' · needs correct answer' : ''}
                      </span>
                    </span>
                    <ChevronDownIcon
                      className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5 rotate-180" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={index === questions.length - 1}
                      onClick={() => move(index, 1)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete question"
                      onClick={() => {
                        onChange(questions.filter((entry) => entry.id !== question.id))
                        if (expandedId === question.id) setExpandedId(null)
                      }}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {open ? (
                  <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                    <ContentField label="Question" htmlFor={`${question.id}-prompt`}>
                      <ContentTextArea
                        id={`${question.id}-prompt`}
                        rows={2}
                        value={question.prompt}
                        placeholder="Enter the question text…"
                        onChange={(event) => patch(question.id, { prompt: event.target.value })}
                      />
                    </ContentField>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <ContentField label="Type" htmlFor={`${question.id}-type`}>
                        <ContentSelect
                          id={`${question.id}-type`}
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
                      <ContentField label="Points" htmlFor={`${question.id}-points`}>
                        <ContentTextInput
                          id={`${question.id}-points`}
                          type="number"
                          min={1}
                          value={question.points}
                          onChange={(event) =>
                            patch(question.id, {
                              points: Math.max(1, Number(event.target.value) || 1),
                            })
                          }
                        />
                      </ContentField>
                      <ContentField label="Difficulty" htmlFor={`${question.id}-diff`}>
                        <ContentSelect
                          id={`${question.id}-diff`}
                          value={question.difficulty}
                          onChange={(event) =>
                            patch(question.id, {
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
                    </div>

                    {question.type === 'short' ? (
                      <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        Short answer questions are graded manually by a reviewer.
                      </p>
                    ) : (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-navy">Answer options</p>
                        <ul className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <li key={option.id} className="flex items-center gap-2">
                              <span className="w-5 text-xs font-bold text-slate-400">
                                {letters[optionIndex]}
                              </span>
                              <ContentTextInput
                                value={option.text}
                                placeholder={`Option ${letters[optionIndex]}`}
                                className="flex-1"
                                onChange={(event) =>
                                  patch(question.id, {
                                    options: question.options.map((entry) =>
                                      entry.id === option.id
                                        ? { ...entry, text: event.target.value }
                                        : entry,
                                    ),
                                  })
                                }
                              />
                              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <input
                                  type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                                  name={`${question.id}-correct`}
                                  checked={option.correct}
                                  onChange={(event) =>
                                    setCorrect(question, option.id, event.target.checked)
                                  }
                                  className="accent-[#004ea8]"
                                />
                                Correct
                              </label>
                              {question.options.length > 2 ? (
                                <button
                                  type="button"
                                  aria-label="Remove option"
                                  onClick={() =>
                                    patch(question.id, {
                                      options: question.options.filter(
                                        (entry) => entry.id !== option.id,
                                      ),
                                    })
                                  }
                                  className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                                >
                                  <TrashIcon className="h-3.5 w-3.5" />
                                </button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                        {question.type !== 'truefalse' ? (
                          <button
                            type="button"
                            onClick={() =>
                              patch(question.id, {
                                options: [
                                  ...question.options,
                                  {
                                    id: `${question.id}-o${question.options.length + 1}`,
                                    text: '',
                                    correct: false,
                                  },
                                ],
                              })
                            }
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-blue-700"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                            Add option
                          </button>
                        ) : null}
                      </div>
                    )}

                    {onSaveToBank ? (
                      <div className="flex justify-end border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          disabled={!question.prompt.trim()}
                          onClick={() => onSaveToBank(question)}
                          className="text-sm font-semibold text-brand hover:text-blue-700 disabled:opacity-40"
                        >
                          Save to Question Bank
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export function assessmentQuestionToBankItem(
  question: AssessmentQuestion,
  course = 'General',
): QuestionBankItem {
  return {
    id: `qb-${question.id}`,
    prompt: question.prompt,
    type: question.type,
    tags: ['From builder'],
    difficulty: question.difficulty,
    points: question.points,
    course,
    usedIn: 0,
    updated: 'Just now',
    options: question.options.map((option) => ({ text: option.text, correct: option.correct })),
  }
}
