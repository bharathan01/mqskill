import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import { ArrowDownIcon, InfoIcon } from '@/components/ui'
import {
  superAdminHardestQuestions,
  superAdminPassingDistribution,
  superAdminPassingKpis,
  superAdminPassingRows,
  superAdminPassingTrend,
  superAdminPerformanceKpis,
  superAdminPerformanceRows,
  superAdminPerformanceWeekly,
} from '@/constants'
import { paths } from '@/routes/paths'
import { btnOutline, cardClass } from './catalogUtils'

export const assessmentAnalyticsTabs = [
  {
    id: 'passing',
    label: 'Passing Statistics',
    description: 'Pass rates and score spread for final assessments, by course and learner type.',
  },
  {
    id: 'performance',
    label: 'Assessment Performance',
    description: 'Pass rates, attempts and hard questions across module quizzes and final assessments.',
  },
] as const

export type AssessmentAnalyticsTabId = (typeof assessmentAnalyticsTabs)[number]['id']

function BarChart({
  items,
  max,
}: {
  items: { label: string; value: number; color?: string }[]
  max: number
}) {
  return (
    <div className="flex h-40 items-end gap-1.5">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${Math.max(4, (item.value / max) * 100)}%`,
              background: item.color ?? '#2563EB',
            }}
          />
          <span className="truncate text-[10px] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function LineChart({
  points,
  series,
}: {
  points: { label: string; a: number; b: number }[]
  series: { key: 'a' | 'b'; label: string; color: string }[]
}) {
  const max = Math.max(...points.flatMap((point) => [point.a, point.b]), 1)
  const min = Math.min(...points.flatMap((point) => [point.a, point.b]), 0)
  const span = Math.max(1, max - min)
  const toPath = (key: 'a' | 'b') =>
    points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * 100
        const y = 100 - ((point[key] - min) / span) * 80 - 10
        return `${index === 0 ? 'M' : 'L'}${x},${y}`
      })
      .join(' ')

  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
        {series.map((item) => (
          <path key={item.key} d={toPath(item.key)} fill="none" stroke={item.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
        {series.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  )
}

function PassingPanel() {
  const distMax = Math.max(...superAdminPassingDistribution.map((item) => item.value))
  const trend = superAdminPassingTrend.map((item) => ({
    label: item.month,
    a: item.individuals,
    b: item.orgs,
  }))

  return (
    <div className="space-y-5">
      <section className={`${cardClass} flex flex-col gap-3 p-3.5 lg:flex-row lg:items-center`}>
        <ContentSelect aria-label="Course" defaultValue="All courses" className="!h-10 lg:max-w-[12rem]">
          <option>All courses</option>
        </ContentSelect>
        <ContentSelect aria-label="Month" defaultValue="October 2026" className="!h-10 lg:max-w-[11rem]">
          <option>October 2026</option>
          <option>September 2026</option>
        </ContentSelect>
        <div className="inline-flex flex-wrap rounded-lg bg-slate-100 p-1 lg:ml-auto">
          {['All learners', 'Individuals', 'Organizations'].map((item, index) => (
            <button
              key={item}
              type="button"
              className={`rounded-md px-3 py-1.5 text-sm ${
                index === 0 ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {superAdminPassingKpis.map((kpi) => (
          <article key={kpi.id} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
            {kpi.change ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                <ArrowDownIcon className="h-3 w-3" />
                {kpi.change}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Score distribution</h2>
          <p className="mt-0.5 text-sm text-slate-500">Final assessments · 1,420 attempts</p>
          <div className="mt-4">
            <BarChart
              max={distMax}
              items={superAdminPassingDistribution.map((item) => ({ label: item.label, value: item.value }))}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">Most pass marks are 70–80%.</p>
        </section>
        <section className={`${cardClass} p-5`}>
          <h2 className="text-base font-bold text-navy">Pass rate trend</h2>
          <p className="mt-0.5 text-sm text-slate-500">Last 6 months</p>
          <div className="mt-4">
            <LineChart
              points={trend}
              series={[
                { key: 'a', label: 'Individuals', color: '#102A4C' },
                { key: 'b', label: 'Organization employees', color: '#60A5FA' },
              ]}
            />
          </div>
        </section>
      </div>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-4 py-2.5 font-semibold">Course</th>
                <th className="px-3 py-2.5 font-semibold text-right">Attempts</th>
                <th className="px-3 py-2.5 font-semibold text-right">Pass rate</th>
                <th className="px-3 py-2.5 font-semibold text-right">Individuals</th>
                <th className="px-3 py-2.5 font-semibold text-right">Org employees</th>
                <th className="px-3 py-2.5 font-semibold text-right">Avg score</th>
                <th className="px-3 py-2.5 font-semibold text-right">Attempts to pass</th>
              </tr>
            </thead>
            <tbody>
              {superAdminPassingRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-navy">{row.course}</p>
                    <p className="mt-0.5 text-xs text-slate-400">Pass mark {row.passMark}%</p>
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.attempts}</td>
                  <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.passRate}%</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.individuals}%</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.orgs}%</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.avgScore}%</td>
                  <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.attemptsToPass.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function PerformancePanel() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'Module quiz' | 'Final assessment'>('all')
  const rows = useMemo(
    () => (typeFilter === 'all' ? superAdminPerformanceRows : superAdminPerformanceRows.filter((row) => row.type === typeFilter)),
    [typeFilter],
  )
  const weekly = superAdminPerformanceWeekly.map((item) => ({
    label: item.week,
    a: item.quizzes,
    b: item.finals,
  }))

  return (
    <div className="space-y-5">
      <section className={`${cardClass} flex flex-col gap-3 p-3.5 lg:flex-row lg:items-center`}>
        <ContentSelect aria-label="Period" defaultValue="Last 30 days" className="!h-10 lg:max-w-[11rem]">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </ContentSelect>
        <ContentSelect aria-label="Course" defaultValue="All courses" className="!h-10 lg:max-w-[12rem]">
          <option>All courses</option>
        </ContentSelect>
        <div className="inline-flex flex-wrap rounded-lg bg-slate-100 p-1">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'Module quiz', label: 'Module quizzes' },
              { id: 'Final assessment', label: 'Final assessments' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTypeFilter(item.id)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                typeFilter === item.id ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="inline-flex flex-wrap rounded-lg bg-slate-100 p-1 lg:ml-auto">
          {['All learners', 'Students', 'Employees'].map((item, index) => (
            <button
              key={item}
              type="button"
              className={`rounded-md px-3 py-1.5 text-sm ${
                index === 0 ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {superAdminPerformanceKpis.map((kpi) => (
          <article key={kpi.id} className={`${cardClass} p-4`}>
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-[26px] leading-none font-bold tracking-tight text-navy">{kpi.value}</p>
            <p className="mt-2 text-xs text-slate-400">{kpi.detail}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-2.5 font-semibold">Assessment</th>
                  <th className="px-3 py-2.5 font-semibold">Type</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Attempts</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Pass rate</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Avg score</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Tries to pass</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Flagged Qs</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.assessment}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.type}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.attempts}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{row.passRate}%</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.avgScore}%</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.tries.toFixed(1)}</td>
                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-600">{row.flagged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Pass rate by week</h2>
            <p className="mt-0.5 text-sm text-slate-500">Attempt-level pass rate</p>
            <div className="mt-4">
              <LineChart
                points={weekly}
                series={[
                  { key: 'a', label: 'Module quizzes', color: '#2563EB' },
                  { key: 'b', label: 'Final assessments', color: '#102A4C' },
                ]}
              />
            </div>
          </section>
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Hardest questions</h2>
            <p className="mt-0.5 text-sm text-slate-500">Lowest correct-answer rate, min. 100 answers</p>
            <ul className="mt-4 space-y-3">
              {superAdminHardestQuestions.map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-100 p-3">
                  <p className="text-sm font-semibold text-navy">{item.question}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{item.source}</p>
                  <p className="mt-1 text-xs font-semibold text-rose-600">{item.correct}% correct</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Questions are edited by Content Admins. Share this list so they can review the wording.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export function AdminAssessmentAnalyticsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [notice, setNotice] = useState<string | null>(null)

  const tab = useMemo(() => {
    const raw = params.get('tab')
    return assessmentAnalyticsTabs.some((item) => item.id === raw)
      ? (raw as AssessmentAnalyticsTabId)
      : 'passing'
  }, [params])

  const active = assessmentAnalyticsTabs.find((item) => item.id === tab) ?? assessmentAnalyticsTabs[0]

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Assessments & Quizzes
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Assessment Analytics</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Assessment Analytics</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{active.description}</p>
        </div>
        <button type="button" onClick={() => setNotice(`${active.label} exported (sample).`)} className={btnOutline}>
          Export
        </button>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="Assessment analytics">
        {assessmentAnalyticsTabs.map((item) => {
          const selected = item.id === tab
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => navigate(`${paths.admin.assessmentAnalytics}?tab=${item.id}`, { replace: true })}
              className={`-mb-px border-b-2 px-3.5 py-2.5 text-sm transition ${
                selected
                  ? 'border-brand font-semibold text-brand'
                  : 'border-transparent font-medium text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'passing' ? <PassingPanel /> : <PerformancePanel />}
    </div>
  )
}
