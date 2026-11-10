import { Link, useSearchParams } from 'react-router'
import {
  builderId,
  contentLibraryAssignments,
  contentLibraryQuizzes,
  courseBuilderContentCopy,
  courseBuilderQuizCopy,
  createBuilderModule,
  createBuilderQuestion,
  createBuilderSubmodule,
  getLibraryAssignment,
  getLibraryQuiz,
  type BuilderModuleAssignment,
  type BuilderQuiz,
  type BuilderQuizQuestion,
  type QuizQuestionType,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ContentCard,
  ContentEmptyState,
  ContentField,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
  CourseBuilderTabs,
  useCourseBuilder,
} from '@/components/common'
import { ClipboardIcon, LayersIcon, PlusIcon, TrashIcon } from '@/components/ui'

const copy = courseBuilderQuizCopy
const letters = 'ABCDEFGHIJ'

export function CourseBuilderQuizPage() {
  const { modules, updateModules } = useCourseBuilder()
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('module')
  const activeIndex = Math.max(
    0,
    modules.findIndex((module) => module.id === requested),
  )
  const activeModule = modules[activeIndex]

  function patchQuiz(patch: Partial<BuilderQuiz>) {
    if (!activeModule) return
    updateModules((current) =>
      current.map((module) =>
        module.id === activeModule.id ? { ...module, quiz: { ...module.quiz, ...patch } } : module,
      ),
    )
  }

  function patchAssignment(patch: Partial<BuilderModuleAssignment>) {
    if (!activeModule) return
    updateModules((current) =>
      current.map((module) =>
        module.id === activeModule.id
          ? {
              ...module,
              assignment: {
                ...(module.assignment ?? {
                  enabled: false,
                  libraryId: '',
                  title: '',
                  brief: '',
                  points: 20,
                  dueDays: 7,
                  accept: 'PDF, DOC, DOCX',
                  mandatory: true,
                }),
                ...patch,
              },
            }
          : module,
      ),
    )
  }

  function attachLibraryQuiz(libraryId: string) {
    if (!libraryId) {
      patchQuiz({ libraryId: '' })
      return
    }
    const library = getLibraryQuiz(libraryId)
    if (!library) return
    patchQuiz({
      libraryId,
      enabled: true,
      title: library.title,
      passMark: library.passMark,
      maxAttempts: library.maxAttempts,
      timeLimitMin: library.timeLimitMin,
      questions: library.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        type:
          question.type === 'multiple'
            ? ('multiple' as const)
            : question.type === 'truefalse'
              ? ('truefalse' as const)
              : ('single' as const),
        points: question.points,
        explanation: '',
        options:
          question.options.length > 0
            ? question.options.map((option) => ({
                id: option.id,
                text: option.text,
                correct: option.correct,
              }))
            : [
                { id: `${question.id}-a`, text: '', correct: true },
                { id: `${question.id}-b`, text: '', correct: false },
              ],
      })),
    })
  }

  function attachLibraryAssignment(libraryId: string) {
    if (!libraryId) {
      patchAssignment({ enabled: false, libraryId: '', title: '', brief: '' })
      return
    }
    const library = getLibraryAssignment(libraryId)
    if (!library) return
    patchAssignment({
      enabled: true,
      libraryId,
      title: library.title,
      brief: library.brief,
      points: library.points,
      dueDays: library.dueDays,
      accept: library.accept,
    })
  }

  function patchQuestion(questionId: string, patch: Partial<BuilderQuizQuestion>) {
    if (!activeModule) return
    patchQuiz({
      questions: activeModule.quiz.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    })
  }

  function changeType(question: BuilderQuizQuestion, type: QuizQuestionType) {
    if (type === question.type) return
    if (type === 'truefalse' || question.type === 'truefalse') {
      const fresh = createBuilderQuestion(type)
      patchQuestion(question.id, { type, options: fresh.options })
      return
    }
    // single <-> multiple: keep options, but single allows only one correct answer
    const options =
      type === 'single'
        ? question.options.map((option, index, all) => ({
            ...option,
            correct: option.correct && all.findIndex((entry) => entry.correct) === index,
          }))
        : question.options
    patchQuestion(question.id, { type, options })
  }

  function setCorrect(question: BuilderQuizQuestion, optionId: string, value: boolean) {
    const options = question.options.map((option) => {
      if (question.type === 'multiple') {
        return option.id === optionId ? { ...option, correct: value } : option
      }
      return { ...option, correct: option.id === optionId }
    })
    patchQuestion(question.id, { options })
  }

  function addQuestion() {
    if (!activeModule) return
    patchQuiz({ questions: [...activeModule.quiz.questions, createBuilderQuestion('single')] })
  }

  function addFirstModule() {
    const module = createBuilderModule('New module 1')
    const submodule = createBuilderSubmodule('New submodule')
    module.submodules = [submodule]
    module.quiz = { ...module.quiz, enabled: true, mandatory: true }
    updateModules(() => [module])
    setSearchParams({ module: module.id }, { replace: true })
  }

  if (!modules.length) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy">{copy.title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{copy.subtitle}</p>
          </div>
          <CourseBuilderTabs />
        </div>
        <ContentCard className="p-0">
          <ContentEmptyState
            icon={<LayersIcon className="h-6 w-6" />}
            title={courseBuilderContentCopy.emptyOutlineTitle}
            body={copy.noModules}
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={addFirstModule}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.addFirstModule}
              </button>
              <Link
                to={paths.content.courseBuilder}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
              >
                {copy.goToContent}
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">{copy.addFirstModuleHint}</p>
          </ContentEmptyState>
        </ContentCard>
      </div>
    )
  }

  const quiz = activeModule.quiz
  const assignment = activeModule.assignment ?? {
    enabled: false,
    libraryId: '',
    title: '',
    brief: '',
    points: 20,
    dueDays: 7,
    accept: 'PDF, DOC, DOCX',
    mandatory: true,
  }
  const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">{copy.title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <CourseBuilderTabs />
      </div>

      <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <ContentCard title={copy.selectModule} className="self-start p-4">
          <ul className="space-y-1.5">
            {modules.map((module, index) => {
              const active = module.id === activeModule.id
              return (
                <li key={module.id}>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ module: module.id }, { replace: true })}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      active ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-navy text-white'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{module.title}</span>
                      <span className={`block text-xs ${active ? 'text-white/70' : 'text-slate-400'}`}>
                        {[
                          module.quiz.enabled
                            ? `${module.quiz.questions.length} ${copy.questionCount}`
                            : 'No quiz',
                          module.assignment?.enabled ? 'Assignment' : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </ContentCard>

        <div className="space-y-6">
          <ContentCard title={copy.settings} description={activeModule.title}>
            <ContentToggle
              checked={quiz.enabled}
              label={copy.enable}
              onChange={(value) => patchQuiz({ enabled: value })}
            />

            {quiz.enabled ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ContentField
                  label={copy.attachLibrary}
                  htmlFor="cb-quiz-library"
                  hint={copy.attachLibraryHint}
                  className="md:col-span-2"
                >
                  <ContentSelect
                    id="cb-quiz-library"
                    value={quiz.libraryId}
                    onChange={(event) => attachLibraryQuiz(event.target.value)}
                  >
                    <option value="">{copy.attachNone}</option>
                    {contentLibraryQuizzes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                        {item.usedInCourses.length
                          ? ` · used in ${item.usedInCourses.map((c) => c.title).join(', ')}`
                          : ' · unused'}
                      </option>
                    ))}
                  </ContentSelect>
                  <Link
                    to={paths.content.quizzes}
                    className="mt-2 inline-flex text-xs font-semibold text-brand hover:text-blue-700"
                  >
                    {copy.openLibrary}
                  </Link>
                </ContentField>
                <ContentField label={copy.quizTitle} htmlFor="cb-quiz-title" className="md:col-span-2">
                  <ContentTextInput
                    id="cb-quiz-title"
                    value={quiz.title}
                    onChange={(event) => patchQuiz({ title: event.target.value })}
                  />
                </ContentField>
                <ContentField label={copy.passMark} htmlFor="cb-quiz-pass">
                  <ContentTextInput
                    id="cb-quiz-pass"
                    type="number"
                    min={0}
                    max={100}
                    value={quiz.passMark}
                    onChange={(event) =>
                      patchQuiz({ passMark: Math.min(100, Math.max(0, Number(event.target.value) || 0)) })
                    }
                  />
                </ContentField>
                <ContentField label={copy.attempts} htmlFor="cb-quiz-attempts">
                  <ContentTextInput
                    id="cb-quiz-attempts"
                    type="number"
                    min={1}
                    value={quiz.maxAttempts}
                    onChange={(event) =>
                      patchQuiz({ maxAttempts: Math.max(1, Number(event.target.value) || 1) })
                    }
                  />
                </ContentField>
                <ContentField label={copy.timeLimit} htmlFor="cb-quiz-time">
                  <ContentTextInput
                    id="cb-quiz-time"
                    type="number"
                    min={0}
                    value={quiz.timeLimitMin}
                    onChange={(event) =>
                      patchQuiz({ timeLimitMin: Math.max(0, Number(event.target.value) || 0) })
                    }
                  />
                </ContentField>
                <div className="self-end">
                  <ContentToggle
                    checked={quiz.shuffle}
                    label={copy.shuffle}
                    onChange={(value) => patchQuiz({ shuffle: value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <ContentToggle
                    checked={quiz.mandatory}
                    label={copy.mandatory}
                    onChange={(value) => patchQuiz({ mandatory: value })}
                  />
                </div>
              </div>
            ) : null}
          </ContentCard>

          <ContentCard title={copy.assignmentSection} description={activeModule.title}>
            <ContentToggle
              checked={assignment.enabled}
              label={copy.enableAssignment}
              onChange={(value) => patchAssignment({ enabled: value })}
            />
            {assignment.enabled ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ContentField
                  label={copy.attachAssignment}
                  htmlFor="cb-asg-library"
                  className="md:col-span-2"
                >
                  <ContentSelect
                    id="cb-asg-library"
                    value={assignment.libraryId}
                    onChange={(event) => attachLibraryAssignment(event.target.value)}
                  >
                    <option value="">{copy.attachAssignmentNone}</option>
                    {contentLibraryAssignments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                        {item.usedInCourses.length
                          ? ` · used in ${item.usedInCourses.map((c) => c.title).join(', ')}`
                          : ' · unused'}
                      </option>
                    ))}
                  </ContentSelect>
                  <Link
                    to={paths.content.assignments}
                    className="mt-2 inline-flex text-xs font-semibold text-brand hover:text-blue-700"
                  >
                    {copy.openAssignments}
                  </Link>
                </ContentField>
                <ContentField label="Assignment title" htmlFor="cb-asg-title" className="md:col-span-2">
                  <ContentTextInput
                    id="cb-asg-title"
                    value={assignment.title}
                    onChange={(event) => patchAssignment({ title: event.target.value })}
                  />
                </ContentField>
                <div className="md:col-span-2">
                  <ContentToggle
                    checked={assignment.mandatory}
                    label={copy.assignmentMandatory}
                    onChange={(value) => patchAssignment({ mandatory: value })}
                  />
                </div>
              </div>
            ) : null}
          </ContentCard>

          {quiz.enabled ? (
            <ContentCard
              title={copy.questions}
              description={`${quiz.questions.length} ${copy.questionCount} · ${copy.totalPoints}: ${totalPoints}`}
              action={
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  {copy.addQuestion}
                </button>
              }
            >
              {quiz.questions.length ? (
                <ol className="space-y-4">
                  {quiz.questions.map((question, index) => (
                    <li key={question.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF4FF] text-xs font-bold text-brand">
                          {index + 1}
                        </span>
                        <div className="grid flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_6rem]">
                          <ContentField
                            label={copy.questionPrompt}
                            htmlFor={`q-${question.id}`}
                            className="sm:col-span-3"
                          >
                            <ContentTextArea
                              id={`q-${question.id}`}
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
                          <ContentField label={copy.type} htmlFor={`qt-${question.id}`}>
                            <ContentSelect
                              id={`qt-${question.id}`}
                              value={question.type}
                              onChange={(event) =>
                                changeType(question, event.target.value as QuizQuestionType)
                              }
                            >
                              {copy.questionTypes.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.label}
                                </option>
                              ))}
                            </ContentSelect>
                          </ContentField>
                          <ContentField label={copy.points} htmlFor={`qp-${question.id}`}>
                            <ContentTextInput
                              id={`qp-${question.id}`}
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
                            patchQuiz({
                              questions: quiz.questions.filter((item) => item.id !== question.id),
                            })
                          }
                          className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 pl-10">
                        <p className="mb-2 text-sm font-semibold text-navy">{copy.options}</p>
                        <ul className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <li key={option.id} className="flex items-center gap-3">
                              <input
                                type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                                name={`correct-${question.id}`}
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
                                  aria-label="Remove option"
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
                                  { id: builderId('o'), text: '', correct: false },
                                ],
                              })
                            }
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-blue-700"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                            {copy.addOption}
                          </button>
                        ) : null}

                        <ContentField
                          label={copy.explanation}
                          htmlFor={`qe-${question.id}`}
                          className="mt-4"
                        >
                          <ContentTextInput
                            id={`qe-${question.id}`}
                            value={question.explanation}
                            placeholder={copy.explanationPlaceholder}
                            onChange={(event) =>
                              patchQuestion(question.id, { explanation: event.target.value })
                            }
                          />
                        </ContentField>
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
                    onClick={addQuestion}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                    {copy.addQuestion}
                  </button>
                </ContentEmptyState>
              )}
            </ContentCard>
          ) : (
            <ContentCard className="p-0">
              <ContentEmptyState
                icon={<ClipboardIcon className="h-6 w-6" />}
                title={copy.disabledTitle}
                body={copy.disabledBody}
              />
            </ContentCard>
          )}
        </div>
      </div>
    </div>
  )
}
