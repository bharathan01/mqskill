import { Link } from 'react-router'
import { businessSolutionsSection } from '@/constants/business'
import { Container } from '@/components/ui'

export function BusinessSolutionsSection() {
  return (
    <section className="bg-brand py-14 text-white sm:py-16">
      <Container>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
          {businessSolutionsSection.badge}
        </span>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {businessSolutionsSection.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/85 sm:text-base">
              {businessSolutionsSection.description}
            </p>
          </div>
          <Link
            to={businessSolutionsSection.viewAllTo}
            className="shrink-0 text-sm font-semibold text-white"
          >
            {businessSolutionsSection.viewAll} →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {businessSolutionsSection.cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white text-navy shadow-[0_16px_40px_rgba(0,40,100,0.18)]"
            >
              <div className="relative">
                <img src={card.image} alt="" className="h-44 w-full object-cover" />
                <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-navy">
                  {card.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
                  {card.category}
                </p>
                <h3 className="mt-2 text-lg font-bold">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{card.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Link
                    to={card.to}
                    className="text-sm font-semibold text-navy hover:text-brand"
                  >
                    Explore courses →
                  </Link>
                  <span className="text-xs text-slate-400">{card.tracks}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
