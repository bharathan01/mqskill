import { Link } from 'react-router'
import { categories, categoriesSection } from '@/constants/catalog'
import { categoryPath, paths } from '@/routes/paths'
import {
  BriefcaseIcon,
  CodeIcon,
  Container,
  DatabaseIcon,
  HeartIcon,
  LayersIcon,
  MegaphoneIcon,
  MonitorIcon,
  UserIcon,
} from '@/components/ui'

const categoryIcons = {
  code: CodeIcon,
  briefcase: BriefcaseIcon,
  layers: LayersIcon,
  monitor: MonitorIcon,
  megaphone: MegaphoneIcon,
  database: DatabaseIcon,
  user: UserIcon,
  heart: HeartIcon,
}

export function CategoriesSection() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {categoriesSection.title}
          </h2>
          <Link
            to={paths.courses}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {categoriesSection.viewAll} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon]
            return (
              <Link
                key={category.id}
                to={categoryPath(category.id)}
                className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 px-3 py-6 text-center transition hover:border-brand/30 hover:bg-brand-soft/40"
              >
                <span className="mb-3 flex h-12 w-12 items-center justify-center text-brand">
                  <Icon className="h-8 w-8" />
                </span>
                <span className="text-sm font-semibold text-navy">{category.name}</span>
                <span className="mt-1 text-xs text-slate-500">
                  {category.courseCount} courses
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
