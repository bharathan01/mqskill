import { NavLink } from 'react-router'
import { courseBuilderContentCopy } from '@/constants'
import { useContentWorkspace } from '@/routes/contentWorkspace'

export function CourseBuilderTabs() {
  const workspace = useContentWorkspace()
  const tabs = [
    { id: 'content', label: courseBuilderContentCopy.tabs.content, to: workspace.courseBuilder },
    { id: 'quiz', label: courseBuilderContentCopy.tabs.quiz, to: workspace.courseQuiz },
  ]

  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.to}
          end
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isActive ? 'bg-brand text-white' : 'text-slate-500 hover:text-navy'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}
