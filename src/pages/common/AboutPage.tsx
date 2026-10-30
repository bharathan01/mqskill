import { leadershipSection } from '@/constants/whyLearn'
import { Container } from '@/components/ui'

export function AboutPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold text-navy">{leadershipSection.title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{leadershipSection.description}</p>
    </Container>
  )
}
