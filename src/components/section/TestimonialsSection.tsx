import { Link } from 'react-router'
import {
  startLearningSection,
  testimonials,
  testimonialsSection,
} from '@/constants/testimonials'
import { paths } from '@/routes/paths'
import { Container } from '@/components/ui'

export function TestimonialsSection() {
  return (
    <section className="bg-white pb-14 sm:pb-16">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              {testimonialsSection.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              {testimonialsSection.subtitle}
            </p>
          </div>
          <Link
            to={paths.about}
            className="shrink-0 text-sm font-medium text-brand hover:text-blue-800"
          >
            {testimonialsSection.viewAll} →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="font-hero text-4xl leading-none text-brand">“</span>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.quote}</p>
              <div className="mt-auto flex items-center gap-3 pt-8">
                <img
                  src={item.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-navy">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1D4ED8] via-[#12305F] to-[#0B1224] px-6 py-14 text-center text-white sm:px-10 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(59,130,246,0.28),transparent_55%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-brand px-4 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
              {startLearningSection.badge}
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {startLearningSection.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
              {startLearningSection.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={paths.signup}
                className="inline-flex items-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"
              >
                {startLearningSection.primaryCta} →
              </Link>
              <Link
                to={paths.courses}
                className="inline-flex rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15"
              >
                {startLearningSection.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
