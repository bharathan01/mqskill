import { Link } from 'react-router'
import { APP_NAME } from '@/constants'
import { paths } from '@/routes/paths'
import { Button, Container } from '@/components/ui'

export function SignupPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Create a {APP_NAME} account</h1>
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <label className="block text-sm text-slate-700">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand"
            />
          </label>
          <label className="block text-sm text-slate-700">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand"
            />
          </label>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to={paths.login} className="text-brand hover:text-blue-700">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  )
}
