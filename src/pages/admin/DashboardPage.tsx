export function AdminDashboardPage() {
  return (
    <section>
      <p className="mb-2 text-sm font-medium tracking-wider text-brand uppercase">
        Super Admin
      </p>
      <h1 className="mb-3 text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="max-w-2xl text-slate-600">
        Super admin pages live here. Add users, organizations, and platform settings in{' '}
        <code className="text-slate-700">src/pages/admin</code> once the design is ready.
      </p>
    </section>
  )
}
