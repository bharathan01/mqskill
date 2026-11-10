import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ContentBadge } from '@/components/common'
import { paths } from '@/routes/paths'
import { AdminHighestRevenueCoursesPage } from './HighestRevenueCoursesPage'
import { AdminMostViewedCoursesPage } from './MostViewedCoursesPage'
import { AdminTopSellingCoursesPage } from './TopSellingCoursesPage'
import { AdminTrendingCoursesPage } from './TrendingCoursesPage'

export const courseIntelligenceTabs = [
  {
    id: 'trending',
    label: 'Trending Courses',
    description: 'Demand, conversion and completion for every course, compared with the previous period.',
  },
  {
    id: 'top-selling',
    label: 'Top-Selling Courses',
    description: 'Ranked by units sold: individual purchases plus organization seats.',
  },
  {
    id: 'most-viewed',
    label: 'Most Viewed Courses',
    description: 'Course page traffic and how well views turn into purchases.',
  },
  {
    id: 'highest-revenue',
    label: 'Highest Revenue Courses',
    description: 'Courses ranked by revenue, split between individual and organization sales.',
  },
] as const

export type CourseIntelligenceTabId = (typeof courseIntelligenceTabs)[number]['id']

const legacyTabByPath: Record<string, CourseIntelligenceTabId> = {
  [paths.admin.trendingCourses]: 'trending',
  [paths.admin.topSellingCourses]: 'top-selling',
  [paths.admin.mostViewedCourses]: 'most-viewed',
  [paths.admin.highestRevenueCourses]: 'highest-revenue',
}

export function courseIntelligencePath(tab: CourseIntelligenceTabId = 'trending') {
  return `${paths.admin.courseIntelligence}?tab=${tab}`
}

export function AdminCourseIntelligencePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const tab = useMemo(() => {
    const raw = params.get('tab')
    return courseIntelligenceTabs.some((item) => item.id === raw)
      ? (raw as CourseIntelligenceTabId)
      : 'trending'
  }, [params])

  const active = courseIntelligenceTabs.find((item) => item.id === tab) ?? courseIntelligenceTabs[0]

  function selectTab(next: CourseIntelligenceTabId) {
    navigate(courseIntelligencePath(next), { replace: true })
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-slate-400">
          Course Management
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="text-slate-500">Course Intelligence</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Course Intelligence</h1>
          <ContentBadge tone="slate">Sample data</ContentBadge>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{active.description}</p>
      </header>

      <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="Course intelligence views">
        {courseIntelligenceTabs.map((item) => {
          const selected = item.id === tab
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(item.id)}
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

      <div role="tabpanel" aria-label={active.label}>
        {tab === 'trending' ? <AdminTrendingCoursesPage embedded /> : null}
        {tab === 'top-selling' ? <AdminTopSellingCoursesPage embedded /> : null}
        {tab === 'most-viewed' ? <AdminMostViewedCoursesPage embedded /> : null}
        {tab === 'highest-revenue' ? <AdminHighestRevenueCoursesPage embedded /> : null}
      </div>
    </div>
  )
}

export function redirectLegacyIntelligencePath(pathname: string) {
  return legacyTabByPath[pathname]
}
