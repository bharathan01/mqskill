import { Link } from 'react-router'
import { paths } from '@/routes/paths'
import { Container } from '@/components/ui'

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="mb-2 text-sm text-slate-500">404</p>
      <h1 className="mb-3 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mb-6 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to={paths.home}
        className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Back to home
      </Link>
    </Container>
  )
}
