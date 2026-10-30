import { features } from '@/constants'
import { Container } from '@/components/ui'

export function FeaturesSection() {
  return (
    <section className="pb-20">
      <Container>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="mb-2 text-lg font-medium text-slate-900">{feature.title}</h2>
              <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
