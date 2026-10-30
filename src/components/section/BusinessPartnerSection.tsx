import { Link } from 'react-router'
import { businessPartnerSection } from '@/constants/business'
import {
  Container,
  LayersIcon,
  PathIcon,
  PieIcon,
  TrendingUpIcon,
} from '@/components/ui'

const cardIcons = {
  layers: LayersIcon,
  path: PathIcon,
  trending: TrendingUpIcon,
  pie: PieIcon,
}

const tones = {
  blue: {
    card: 'from-[#14203A] to-[#0B1224]',
    icon: 'bg-blue-500/15 text-blue-400',
    cta: 'text-blue-400',
  },
  amber: {
    card: 'from-[#2A1E12] to-[#0B1224]',
    icon: 'bg-amber-500/15 text-amber-400',
    cta: 'text-amber-400',
  },
  green: {
    card: 'from-[#10241C] to-[#0B1224]',
    icon: 'bg-emerald-500/15 text-emerald-400',
    cta: 'text-emerald-400',
  },
  purple: {
    card: 'from-[#241430] to-[#0B1224]',
    icon: 'bg-violet-500/15 text-violet-400',
    cta: 'text-violet-400',
  },
}

export function BusinessPartnerSection() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-navy uppercase">
            {businessPartnerSection.badge}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {businessPartnerSection.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {businessPartnerSection.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {businessPartnerSection.cards.map((card) => {
            const Icon = cardIcons[card.icon]
            const tone = tones[card.tone]
            return (
              <article
                key={card.id}
                className={`flex flex-col rounded-[28px] bg-gradient-to-br ${tone.card} p-6 text-white shadow-[0_16px_40px_rgba(11,18,36,0.18)]`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">
                  {card.description}
                </p>
                <Link
                  to={card.to}
                  className={`mt-6 inline-flex items-center gap-1 text-sm font-medium ${tone.cta}`}
                >
                  {card.cta}
                  <span aria-hidden="true">›</span>
                </Link>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
