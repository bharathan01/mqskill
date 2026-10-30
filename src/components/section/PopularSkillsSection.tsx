import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  popularSkillTabs,
  popularSkillsSection,
  trendingCourses,
} from '@/constants/catalog'
import { paths } from '@/routes/paths'
import { CourseCard } from '@/components/common/CourseCard'
import { Container } from '@/components/ui'

export function PopularSkillsSection() {
  const [activeTab, setActiveTab] = useState<(typeof popularSkillTabs)[number]['id']>(
    popularSkillTabs[0].id,
  )
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  const tab = popularSkillTabs.find((item) => item.id === activeTab) ?? popularSkillTabs[0]

  const courses = useMemo(() => {
    const tabCourses = trendingCourses.filter((course) =>
      tab.courseIds.some((id) => id === course.id),
    )
    if (!activeSkill) {
      return tabCourses
    }
    const filtered = tabCourses.filter((course) => course.skills.includes(activeSkill))
    return filtered.length > 0 ? filtered : tabCourses
  }, [tab, activeSkill])

  return (
    <section className="bg-white pb-14 sm:pb-16">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              {popularSkillsSection.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{popularSkillsSection.subtitle}</p>
          </div>
          <Link
            to={paths.courses}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {popularSkillsSection.viewAll} →
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto border-b border-slate-200">
          {popularSkillTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id)
                setActiveSkill(null)
              }}
              className={`shrink-0 border-b-2 pb-3 text-sm font-medium transition ${
                item.id === activeTab
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tab.skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setActiveSkill((current) => (current === skill ? null : skill))}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeSkill === skill
                  ? 'border-brand bg-brand text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand/40'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  )
}
