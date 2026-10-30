import { Link } from 'react-router'
import type { CourseCategory } from '@/constants/courseCategories'
import { paths } from '@/routes/paths'
import { Container, GraduationCapIcon } from '@/components/ui'

type CategoryHeroSectionProps = {
  category: CourseCategory
}

export function CategoryHeroSection({ category }: CategoryHeroSectionProps) {
  return (
    <>
      <nav className="border-b border-slate-100 bg-white">
        <Container>
          <ul className="flex gap-6 overflow-x-auto">
            {category.tabs.map((tab) => {
              const active = tab.id === category.id
              return (
                <li key={tab.id} className="shrink-0">
                  <Link
                    to={tab.to}
                    className={`inline-flex h-12 items-center border-b-2 text-sm whitespace-nowrap ${
                      active
                        ? 'border-brand font-semibold text-brand'
                        : 'border-transparent text-slate-500 hover:text-navy'
                    }`}
                  >
                    {tab.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </Container>
      </nav>

      <section className="bg-[#F4F7FF] py-10 sm:py-12 lg:py-14">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <Link to={paths.home} className="hover:text-navy">
                  Home
                </Link>
                <span>›</span>
                {category.id === 'all' ? (
                  <span className="font-medium text-navy">Courses</span>
                ) : (
                  <>
                    <Link to={paths.courses} className="hover:text-navy">
                      Courses
                    </Link>
                    <span>›</span>
                    <span className="font-medium text-navy">{category.name}</span>
                  </>
                )}
              </nav>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">
                {category.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  to={category.primaryTo}
                  className="inline-flex rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white"
                >
                  {category.primaryCta}
                </Link>
                <a
                  href={category.secondaryHref}
                  className="text-sm font-semibold text-navy"
                >
                  {category.secondaryCta} →
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src={category.image}
                alt=""
                className="h-64 w-full rounded-[28px] object-cover sm:h-80"
              />
              <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-5">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,40,80,0.14)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
                    <GraduationCapIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">
                      {category.highlight.eyebrow}
                    </p>
                    <p className="text-sm font-semibold text-brand">
                      {category.highlight.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
