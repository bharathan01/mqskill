import {
  businessHowItWorksSection,
  businessStats,
} from '@/constants/business'
import {
  BuildingIcon,
  ChatIcon,
  ChevronRightIcon,
  ClockIcon,
  Container,
  FileIcon,
  HeartIcon,
  UsersIcon,
} from '@/components/ui'

const stepIcons = {
  chat: ChatIcon,
  file: FileIcon,
  users: UsersIcon,
}

const stepTones = {
  blue: {
    icon: 'bg-blue-50 text-brand',
    number: 'text-brand',
    line: 'bg-brand',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-500',
    number: 'text-orange-500',
    line: 'bg-orange-400',
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-500',
    number: 'text-emerald-500',
    line: 'bg-emerald-400',
  },
}

const statIcons = {
  building: BuildingIcon,
  users: UsersIcon,
  heart: HeartIcon,
  clock: ClockIcon,
}

export function BusinessHowItWorksSection() {
  return (
    <section className="bg-white">
      <Container className="py-14 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-navy uppercase">
            {businessHowItWorksSection.badge}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {businessHowItWorksSection.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            {businessHowItWorksSection.subtitle}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          {businessHowItWorksSection.steps.map((step, index) => {
            const Icon = stepIcons[step.icon]
            const tone = stepTones[step.tone]
            return (
              <div key={step.id} className="flex flex-1 items-center gap-4">
                <article className="flex flex-1 items-start gap-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,40,80,0.05)] sm:p-6">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone.icon}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${tone.number}`}>{step.number}</span>
                      <span className={`h-px w-8 ${tone.line}`} />
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-navy">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
                  </div>
                </article>
                {index < businessHowItWorksSection.steps.length - 1 ? (
                  <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 lg:flex">
                    <ChevronRightIcon className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </Container>

      <div className="bg-brand py-8 text-white">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {businessStats.map((stat) => {
              const Icon = statIcons[stat.icon]
              return (
                <li key={stat.id} className="flex items-center justify-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-2xl font-bold leading-none">{stat.value}</span>
                    <span className="mt-1 block text-sm text-white/80">{stat.label}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </Container>
      </div>
    </section>
  )
}
