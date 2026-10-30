import { Link } from 'react-router'
import leadershipBackground from '@/assets/Background.png'
import founderImage from '@/assets/person.png'
import { leadershipSection, whyLearnSection } from '@/constants/whyLearn'
import { paths } from '@/routes/paths'
import {
  AtomIcon,
  AwardIcon,
  BookIcon,
  ClockIcon,
  CodeIcon,
  Container,
  LightbulbIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from '@/components/ui'

const reasonIcons = {
  instructors: BookIcon,
  access: ClockIcon,
  certificate: AwardIcon,
  affordable: RefreshIcon,
}

const highlightIcons = {
  courses: AtomIcon,
  mentors: LightbulbIcon,
  projects: CodeIcon,
  credentials: ShieldCheckIcon,
}

export function WhyLearnSection() {
  return (
    <section className="bg-white pb-14 sm:pb-16">
      <Container>
        <div className="rounded-[28px] bg-[#EEF5FF] px-6 py-10 sm:px-10 sm:py-12">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {whyLearnSection.title}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyLearnSection.items.map((item) => {
              const Icon = reasonIcons[item.icon]
              return (
                <div key={item.title} className="text-center">
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="relative mt-6 overflow-hidden rounded-[32px] bg-navy bg-cover bg-center px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14"
          style={{ backgroundImage: `url(${leadershipBackground})` }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                {leadershipSection.badge}
              </span>
              <h2 className="mt-5 max-w-xl font-hero text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
                {leadershipSection.title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                {leadershipSection.description}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {leadershipSection.highlights.map((item) => {
                  const Icon = highlightIcons[item.icon]
                  return (
                    <div key={item.text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-slate-100">{item.text}</span>
                    </div>
                  )
                })}
              </div>
              <blockquote className="mt-8 max-w-xl border-l-4 border-brand pl-4">
                <p className="text-sm italic leading-7 text-slate-200">
                  “{leadershipSection.quote}”
                </p>
                <footer className="mt-3 text-sm">
                  <span className="font-semibold text-sky-300">
                    {leadershipSection.quoteAuthor}
                  </span>
                  <span className="text-slate-400">
                    {' '}
                    — {leadershipSection.quoteRole}
                  </span>
                </footer>
              </blockquote>
              <Link
                to={paths.about}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy"
              >
                {leadershipSection.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
                <img
                  src={founderImage}
                  alt={leadershipSection.founder.name}
                  className="h-[420px] w-full object-cover object-[center_15%]"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#0B1B33]/92 p-3 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                      <ShieldCheckIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {leadershipSection.founder.name}
                      </p>
                      <p className="truncate text-xs text-slate-300">
                        {leadershipSection.founder.role}
                      </p>
                    </div>
                    <span className="rounded-md bg-brand px-2 py-1 text-[10px] font-semibold tracking-wide">
                      {leadershipSection.founder.verified}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
