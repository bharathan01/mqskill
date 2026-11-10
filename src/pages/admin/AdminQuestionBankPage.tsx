import { useMemo, useState } from 'react'
import { ContentBadge, ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { InfoIcon, SearchIcon } from '@/components/ui'
import {
  superAdminQuestionPageSize,
  superAdminQuestionRows,
  superAdminQuestionTotal,
  superAdminQuestionTypeStats,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, cardClass } from './catalogUtils'

export function AdminQuestionBankPage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(superAdminQuestionRows[4]?.id ?? superAdminQuestionRows[0].id)
  const [notice, setNotice] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return superAdminQuestionRows
    return superAdminQuestionRows.filter((row) => row.question.toLowerCase().includes(needle))
  }, [query])

  const selected = filtered.find((row) => row.id === selectedId) ?? filtered[0] ?? superAdminQuestionRows[0]

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Assessments & Quizzes
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Question Bank</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Question Bank</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-500">
            Every question used in quizzes and final assessments, with how often learners get it right.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Content Admins write and maintain questions. You can review everything and flag issues to the owner.
          </p>
        </div>
        <button type="button" onClick={() => setNotice('Question bank exported (sample).')} className={btnOutline}>
          Export
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {superAdminQuestionTypeStats.map((item) => (
          <article key={item.id} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-navy">{item.value}</p>
            {item.share ? <p className="mt-2 text-xs font-semibold text-slate-400">{item.share}</p> : null}
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ContentTextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search question text…"
                className="!h-10 !pl-9"
              />
            </label>
            <ContentSelect aria-label="Course" defaultValue="All courses" className="!h-10 lg:max-w-[11rem]">
              <option>All courses</option>
            </ContentSelect>
            <ContentSelect aria-label="Type" defaultValue="All types" className="!h-10 lg:max-w-[10rem]">
              <option>All types</option>
              <option>Multiple choice</option>
              <option>True / false</option>
              <option>Scenario</option>
            </ContentSelect>
            <ContentSelect aria-label="Difficulty" defaultValue="All difficulty" className="!h-10 lg:max-w-[10rem]">
              <option>All difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </ContentSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-2.5 font-semibold">Question</th>
                  <th className="px-3 py-2.5 font-semibold">Type</th>
                  <th className="px-3 py-2.5 font-semibold">Difficulty</th>
                  <th className="px-3 py-2.5 font-semibold">Used in</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Correct</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, superAdminQuestionPageSize).map((row) => {
                  const active = row.id === selected?.id
                  return (
                    <tr
                      key={row.id}
                      className={`cursor-pointer border-b border-slate-100 last:border-b-0 ${
                        active ? 'bg-[#EFF4FF]' : 'hover:bg-slate-50/70'
                      }`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-navy">{row.question}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {row.course} · {row.module}
                        </p>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{row.type}</td>
                      <td className="px-3 py-3.5">
                        <StatusBadge value={row.difficulty} />
                      </td>
                      <td className="px-3 py-3.5 text-sm text-slate-600">{row.usedIn}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.correct}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            Showing {Math.min(filtered.length, superAdminQuestionPageSize)} of {superAdminQuestionTotal.toLocaleString('en-US')}{' '}
            questions
          </p>
        </section>

        <aside className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Question preview</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {selected.course} · {selected.module} · {selected.id.toUpperCase()}
          </p>
          <p className="mt-4 text-sm font-semibold text-navy">{selected.question}</p>
          {selected.answers ? (
            <ul className="mt-4 space-y-2">
              {selected.answers.map((answer) => (
                <li
                  key={answer.label}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                    answer.correct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{answer.label}</span>
                  <span className="font-semibold tabular-nums">{answer.pct}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Select a multiple-choice question to see answer split.</p>
          )}
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Times answered</dt>
              <dd className="font-semibold text-navy">{selected.timesAnswered?.toLocaleString('en-US') ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Answered correctly</dt>
              <dd className="font-semibold text-navy">{selected.correct}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Owner</dt>
              <dd className="font-semibold text-navy">{selected.owner ?? 'Content Admin'}</dd>
            </div>
          </dl>
          {selected.hint ? (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-5 text-sky-900">
              <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
              {selected.hint}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setNotice(`Flagged ${selected.id} for the question owner (sample).`)}
            className={`mt-4 w-full ${btnOutline}`}
          >
            Flag for owner
          </button>
        </aside>
      </div>
    </div>
  )
}
