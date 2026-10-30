export function StudentPlaceholderPage({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-2xl font-bold text-navy">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This section will follow in a later design.</p>
    </section>
  )
}
