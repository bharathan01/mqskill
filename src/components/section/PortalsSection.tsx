import { Link } from 'react-router'
import { portals } from '@/constants'
import { Container } from '@/components/ui'

export function PortalsSection() {
  return (
    <section className="pb-12">
      <Container>
        <h2 className="mb-6 text-center text-xl font-medium text-slate-900">LMS portals</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {portals.map((portal) => (
            <Link
              key={portal.to}
              to={portal.to}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand/50"
            >
              <h3 className="mb-2 text-lg font-medium text-slate-900">{portal.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{portal.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
