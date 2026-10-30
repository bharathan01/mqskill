import { businessCtaSection } from '@/constants/business'
import { Container, NetworkIcon } from '@/components/ui'

export function BusinessCtaSection() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <Container>
        <div className="overflow-hidden rounded-[32px] bg-brand px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/80 uppercase">
                {businessCtaSection.badge}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
                {businessCtaSection.title}
                <span className="mt-1 block">{businessCtaSection.titleLine}</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                {businessCtaSection.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={businessCtaSection.primaryHref}
                  className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand"
                >
                  {businessCtaSection.primaryCta} →
                </a>
                <a
                  href={businessCtaSection.secondaryHref}
                  className="inline-flex items-center rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {businessCtaSection.secondaryCta}
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src={businessCtaSection.image}
                alt=""
                className="h-64 w-full rounded-[24px] object-cover object-[center_20%] sm:h-80"
              />
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-5">
                <div className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-navy shadow-[0_12px_30px_rgba(15,40,80,0.18)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand">
                    <NetworkIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {businessCtaSection.highlight.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {businessCtaSection.highlight.subtitle}
                    </p>
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
