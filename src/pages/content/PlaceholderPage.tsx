type ContentPlaceholderPageProps = {
  title: string
}

export function ContentPlaceholderPage({ title }: ContentPlaceholderPageProps) {
  return (
    <section className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
      <p className="text-sm font-semibold tracking-wide text-brand uppercase">Coming next</p>
      <h1 className="mt-2 text-2xl font-bold text-navy">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        This Content Admin screen is in the Figma file and will be built when you share that frame.
      </p>
    </section>
  )
}
