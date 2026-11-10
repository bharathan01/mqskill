import { employeePlaceholderPage } from '@/constants'

export function EmployeePlaceholderPage({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
      <h1 className="text-2xl font-bold text-navy">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{employeePlaceholderPage.comingSoon}</p>
    </section>
  )
}
