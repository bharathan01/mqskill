import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import logo from '@/assets/logo.png'
import { APP_NAME, loginPage } from '@/constants'
import { paths } from '@/routes/paths'
import {
  AppleIcon,
  BookIcon,
  ChevronRightIcon,
  GlobeIcon,
  GoogleIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@/components/ui'

const statIcons = {
  courses: BookIcon,
  instructors: UsersIcon,
  learners: TrendingUpIcon,
  flexible: GlobeIcon,
}

export function LoginPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(paths.student.dashboard)
  }

  function goToDashboard() {
    navigate(paths.student.dashboard)
  }

  return (
    <div className="grid h-screen overflow-hidden bg-white lg:grid-cols-2">
      <section className="relative hidden h-full overflow-hidden bg-[#0B3A8A] px-10 py-8 text-white lg:flex lg:flex-col xl:px-14 xl:py-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#082A6B] via-[#0B4DB3] to-[#1D4ED8]" />
        <div className="pointer-events-none absolute -top-28 -left-20 h-[26rem] w-[26rem] rounded-full bg-[#3B82F6]/50" />
        <div className="pointer-events-none absolute top-[18%] -left-32 h-[34rem] w-[34rem] rounded-[46%] bg-[#1E40AF]/70" />
        <div className="pointer-events-none absolute right-[-8%] top-[-12%] h-80 w-80 rounded-full bg-[#60A5FA]/30" />
        <div className="pointer-events-none absolute bottom-[-18%] left-[8%] h-72 w-[28rem] rounded-[50%] bg-[#2563EB]/45" />

        <div className="relative z-10 flex h-full max-w-[22rem] flex-col xl:max-w-md">
          <Link to={paths.home} className="text-2xl font-semibold tracking-tight">
            {loginPage.brand}
          </Link>
          <h1 className="mt-6 text-4xl leading-[1.12] font-bold tracking-tight xl:text-5xl">
            {loginPage.title[0]}{' '}
            <span className="block">{loginPage.title[1]}</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            {loginPage.description}
          </p>
          <ul className="mt-6 space-y-3">
            {loginPage.stats.map((stat) => {
              const Icon = statIcons[stat.icon]
              return (
                <li key={stat.id} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{stat.value}</span>
                    <span className="text-xs text-white/70">{stat.label}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-auto max-w-sm pt-6 text-sm leading-6 text-white/75 italic">
            “{loginPage.quote}”
          </p>
        </div>

        <img
          src={loginPage.image}
          alt=""
          className="pointer-events-none absolute right-[-4%] bottom-[4%] z-[5] h-[56%] w-[42%] object-cover object-[center_18%] shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          style={{
            borderRadius: '62% 38% 48% 52% / 42% 28% 72% 58%',
          }}
        />
      </section>

      <section className="flex h-full items-center justify-center overflow-hidden bg-[#F7F8FC] px-4 py-6 sm:px-8">
        <div className="w-full max-w-[26rem] rounded-3xl border border-slate-100 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-7">
          <Link
            to={paths.home}
            className="mx-auto flex h-12 w-[160px] items-center overflow-hidden"
          >
            <img
              src={logo}
              alt={APP_NAME}
              className="h-full w-full scale-[1.7] object-contain"
            />
          </Link>
          <h2 className="mt-4 text-center text-2xl font-bold text-black sm:text-3xl">
            {loginPage.welcome}
          </h2>
          <p className="mt-1.5 text-center text-sm text-slate-500">{loginPage.subtitle}</p>

          <form className="mt-5 space-y-3.5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-black">
              {loginPage.email}
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={loginPage.emailPlaceholder}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand"
              />
            </label>
            <label className="block text-sm font-semibold text-black">
              {loginPage.password}
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder={loginPage.passwordPlaceholder}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand"
              />
            </label>
            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-brand">
                {loginPage.forgot}
              </button>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {loginPage.submit}
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            {loginPage.or}
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={goToDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm"
            >
              <GoogleIcon className="h-4 w-4" />
              {loginPage.google}
            </button>
            <button
              type="button"
              onClick={goToDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm"
            >
              <AppleIcon className="h-4 w-4" />
              {loginPage.apple}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            {loginPage.noAccount}{' '}
            <Link to={paths.signup} className="font-semibold text-brand">
              {loginPage.signup}
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
