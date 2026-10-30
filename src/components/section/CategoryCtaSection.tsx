import { Link } from 'react-router'
import { categoryCtaSection } from '@/constants/categoryCourses'
import { Container } from '@/components/ui'

type CategoryCtaSectionProps = {
  categoryName: string
}

export function CategoryCtaSection({ categoryName }: CategoryCtaSectionProps) {
  return (
    <section className="bg-white pb-14 sm:pb-16">
      <Container>
        <div className="rounded-[32px] bg-[#EAF2FF] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
                {categoryCtaSection.badge}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                {categoryCtaSection.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                {categoryCtaSection.descriptionPrefix} {categoryName}{' '}
                {categoryCtaSection.descriptionSuffix}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  to={categoryCtaSection.primaryTo}
                  className="inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {categoryCtaSection.primaryCta}
                </Link>
                <Link
                  to={categoryCtaSection.secondaryTo}
                  className="text-sm font-semibold text-navy"
                >
                  {categoryCtaSection.secondaryCta} →
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
              <img
                src={categoryCtaSection.image}
                alt=""
                className="h-56 w-full rounded-3xl object-cover sm:h-64"
              />
              <div className="absolute top-6 left-0 -translate-x-2 sm:-translate-x-4">
                <div className="rounded-xl bg-white px-3.5 py-3 shadow-[0_10px_24px_rgba(15,40,80,0.12)]">
                  {categoryCtaSection.words.map((word) => (
                    <p
                      key={word}
                      className={`text-sm leading-5 font-bold ${
                        word === categoryCtaSection.accentWord
                          ? 'text-emerald-500'
                          : 'text-brand'
                      }`}
                    >
                      {word}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
