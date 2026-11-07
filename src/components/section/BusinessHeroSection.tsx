import { useState, type FormEvent } from 'react'
import { businessHero, demoForm } from '@/constants/business'
import {
  ChartIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  Container,
  LayersIcon,
  UsersIcon,
} from '@/components/ui'

const highlightIcons = {
  programs: LayersIcon,
  support: UsersIcon,
  outcomes: ChartIcon,
}

const inputClass =
  'mt-1.5 w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand'

const labelClass = 'text-[11px] font-semibold tracking-[0.12em] text-navy uppercase'

export function BusinessHeroSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitterName, setSubmitterName] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('fullName') ?? '').trim()
    setSubmitterName(name)
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <section className="bg-[#F4F7FF] py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="pt-2">
            <span className="inline-flex rounded-md bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
              {businessHero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              {businessHero.title}
              <span className="mt-1 block">
                {businessHero.titleLine}{' '}
                <span className="text-brand">{businessHero.highlight}</span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-500">
              {businessHero.description}
            </p>
            <a
              href="#request-demo"
              className="mt-8 inline-flex items-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              {businessHero.primaryCta} →
            </a>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
              {businessHero.highlights.map((item) => {
                const Icon = highlightIcons[item.icon]
                return (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="max-w-[8.5rem] text-sm font-semibold leading-5 text-navy">
                      {item.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div
            id="request-demo"
            className="scroll-mt-24 rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(15,40,80,0.08)] sm:p-8"
          >
            <h2 className="text-2xl font-bold text-navy">{demoForm.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{demoForm.subtitle}</p>

            {submitted ? (
              <div className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <CheckCircleIcon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{demoForm.successTitle}</h3>
                {submitterName ? (
                  <p className="mt-2 text-sm font-medium text-navy">
                    Thanks, {submitterName}.
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-6 text-slate-600">{demoForm.successBody}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setSubmitterName('')
                  }}
                  className="mt-6 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {demoForm.successReset}
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className={`block ${labelClass}`}>
                  {demoForm.fields.fullName.label} *
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={demoForm.fields.fullName.placeholder}
                    className={inputClass}
                  />
                </label>
                <label className={`block ${labelClass}`}>
                  {demoForm.fields.workEmail.label} *
                  <input
                    type="email"
                    name="workEmail"
                    required
                    placeholder={demoForm.fields.workEmail.placeholder}
                    className={inputClass}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`block ${labelClass}`}>
                    {demoForm.fields.companyName.label} *
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder={demoForm.fields.companyName.placeholder}
                      className={inputClass}
                    />
                  </label>
                  <label className={`block ${labelClass}`}>
                    {demoForm.fields.teamSize.label}
                    <span className="relative mt-1.5 block">
                      <select
                        name="teamSize"
                        defaultValue=""
                        className={`${inputClass} mt-0 appearance-none pr-9`}
                      >
                        <option value="" disabled>
                          {demoForm.fields.teamSize.placeholder}
                        </option>
                        {demoForm.teamSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </span>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`block ${labelClass}`}>
                    {demoForm.fields.phone.label}
                    <span className="mt-1.5 flex overflow-hidden rounded-lg border-2 border-slate-300 focus-within:border-brand">
                      <span className="border-r-2 border-slate-300 px-3 py-2.5 text-sm text-slate-500">
                        {demoForm.fields.phone.prefix}
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={demoForm.fields.phone.placeholder}
                        className="min-w-0 flex-1 px-3 py-2.5 text-sm text-navy outline-none placeholder:text-slate-400"
                      />
                    </span>
                  </label>
                  <label className={`block ${labelClass}`}>
                    {demoForm.fields.role.label}
                    <span className="relative mt-1.5 block">
                      <select
                        name="role"
                        defaultValue=""
                        className={`${inputClass} mt-0 appearance-none pr-9`}
                      >
                        <option value="" disabled>
                          {demoForm.fields.role.placeholder}
                        </option>
                        {demoForm.roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white"
                >
                  {demoForm.submit} →
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
