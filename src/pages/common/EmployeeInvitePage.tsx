import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { employeeInvite } from '@/constants'
import { paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  LockIcon,
  MailIcon,
} from '@/components/ui'

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-3 pl-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const passwordFieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

function InviteBrandPanel({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const highlights = [
    {
      id: 'org',
      icon: BuildingIcon,
      title: employeeInvite.organization,
      body: employeeInvite.invitedBy,
    },
    {
      id: 'courses',
      icon: BookIcon,
      title: employeeInvite.coursesAssigned,
      body: employeeInvite.coursesList,
    },
    {
      id: 'valid',
      icon: CalendarIcon,
      title: employeeInvite.validUntil,
      body: employeeInvite.validHint,
    },
  ]

  return (
    <section className="relative hidden h-full overflow-hidden bg-[#0A2744] px-10 py-8 text-white lg:flex lg:flex-col xl:px-12 xl:py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#071C33] via-[#0A2744] to-[#123A6B]" />
      <div className="pointer-events-none absolute right-[-18%] bottom-[-12%] h-72 w-72 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-[-8%] bottom-[8%] h-52 w-52 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-[10%] bottom-[-20%] h-64 w-64 rounded-full bg-brand/20 blur-2xl" />

      <div className="relative z-10 flex h-full max-w-md flex-col">
        <Link to={paths.home} className="inline-flex items-center gap-3 self-start">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
            <GraduationCapIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">{employeeInvite.brand}</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-white/65 uppercase">
              {employeeInvite.brandTag}
            </span>
          </span>
        </Link>

        <h1 className="mt-14 text-4xl font-bold tracking-tight xl:text-[2.75rem] xl:leading-[1.15]">
          {title}
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">{description}</p>

        <ul className="mt-10 space-y-5">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id} className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-white/65">{item.body}</span>
                </span>
              </li>
            )
          })}
        </ul>

        <p className="mt-auto pt-10 text-xs text-white/55">
          {employeeInvite.footer}
          <span className="mx-2">·</span>
          <Link to={paths.privacy} className="hover:text-white">
            {employeeInvite.privacy}
          </Link>
          <span className="mx-2">·</span>
          <Link to={paths.terms} className="hover:text-white">
            {employeeInvite.terms}
          </Link>
        </p>
      </div>
    </section>
  )
}

function ExpiredInviteView() {
  const navigate = useNavigate()
  const details = [
    {
      label: employeeInvite.expired.account,
      value: employeeInvite.employee.email,
    },
    {
      label: employeeInvite.expired.organization,
      value: employeeInvite.organization,
    },
    {
      label: employeeInvite.expired.accessRemoved,
      value: employeeInvite.expired.accessRemovedDate,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FB]">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to={paths.home} className="inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A2744] text-white">
            <GraduationCapIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold text-navy">{employeeInvite.brand}</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              {employeeInvite.employeePortalTag}
            </span>
          </span>
        </Link>
        <p className="text-sm text-slate-500">
          {employeeInvite.expired.help}{' '}
          <Link to={paths.help} className="font-semibold text-brand">
            {employeeInvite.expired.contactSupport}
          </Link>
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,40,80,0.08)] sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <AlertTriangleIcon className="h-6 w-6" />
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            {employeeInvite.expired.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{employeeInvite.expired.description}</p>

          <dl className="mt-6 space-y-3 rounded-xl bg-slate-50 px-4 py-4">
            {details.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
                <dt className="text-slate-500">{item.label}</dt>
                <dd className="text-right font-semibold text-slate-800">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex gap-3 rounded-xl bg-emerald-50 px-4 py-3.5 text-sm leading-5 text-emerald-700">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{employeeInvite.expired.certificatesNote}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:admin@abccorporation.com`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <MailIcon className="h-4 w-4" />
              {employeeInvite.expired.contactAdmin}
            </a>
            <button
              type="button"
              onClick={() => navigate(paths.login)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {employeeInvite.expired.anotherAccount}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            {employeeInvite.expired.mistake}{' '}
            <Link to={paths.help} className="font-semibold text-brand">
              {employeeInvite.expired.support}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export function EmployeeInvitePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isExpired = useMemo(() => {
    const status = searchParams.get('status')
    return status === 'expired' || status === 'ended'
  }, [searchParams])

  const [step, setStep] = useState<'welcome' | 'activate'>('welcome')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(true)
  const [error, setError] = useState('')

  if (isExpired) {
    return <ExpiredInviteView />
  }

  function handleActivate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      setError(employeeInvite.messages.required)
      return
    }
    if (password.length < 8) {
      setError(employeeInvite.messages.weakPassword)
      return
    }
    if (password !== confirmPassword) {
      setError(employeeInvite.messages.mismatch)
      return
    }
    if (!agreed) {
      setError(employeeInvite.messages.agreeRequired)
      return
    }
    navigate(paths.employee.dashboard)
  }

  const side =
    step === 'welcome'
      ? {
          title: employeeInvite.welcome.sideTitle,
          description: employeeInvite.welcome.sideDescription,
        }
      : {
          title: employeeInvite.activate.sideTitle,
          description: employeeInvite.activate.sideDescription,
        }

  return (
    <div className="grid h-screen overflow-hidden bg-white lg:grid-cols-[0.92fr_1.08fr]">
      <InviteBrandPanel title={side.title} description={side.description} />

      <section
        id="employee-invite-scroll"
        className="h-full overflow-y-auto bg-white px-4 py-8 sm:px-10"
      >
        <div className="mx-auto flex min-h-full w-full max-w-xl items-center">
          <div className="w-full py-2">
            {step === 'welcome' ? (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                  <BuildingIcon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                  {employeeInvite.welcome.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {employeeInvite.welcome.subtitle}
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{employeeInvite.welcome.body}</p>

                <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm">
                  <p>
                    <span className="text-slate-500">Organization</span>
                    <span className="mt-0.5 block font-semibold text-slate-800">
                      {employeeInvite.organization}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Assigned courses</span>
                    <span className="mt-0.5 block font-semibold text-slate-800">
                      {employeeInvite.coursesList}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Invited as</span>
                    <span className="mt-0.5 block font-semibold text-slate-800">
                      {employeeInvite.employee.fullName}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('activate')
                    document.getElementById('employee-invite-scroll')?.scrollTo({ top: 0 })
                  }}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {employeeInvite.welcome.cta}
                  <span aria-hidden="true">→</span>
                </button>

                <p className="mt-6 text-center text-sm text-slate-500">
                  {employeeInvite.welcome.already}{' '}
                  <Link to={paths.login} className="font-semibold text-brand">
                    {employeeInvite.welcome.login}
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setStep('welcome')
                    setError('')
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  {employeeInvite.activate.back}
                </button>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                  {employeeInvite.activate.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {employeeInvite.activate.subtitle}
                </p>

                <form className="mt-8 space-y-4" onSubmit={handleActivate}>
                  <label className="block text-sm font-semibold text-slate-900">
                    {employeeInvite.activate.fullName}
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value)
                        setError('')
                      }}
                      placeholder={employeeInvite.activate.fullNamePlaceholder}
                      className={`${fieldClass} mt-1.5`}
                    />
                    <span className="mt-1.5 block text-xs font-normal text-slate-400">
                      {employeeInvite.activate.providedBy}
                    </span>
                  </label>

                  <label className="block text-sm font-semibold text-slate-900">
                    {employeeInvite.activate.email}
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setError('')
                      }}
                      placeholder={employeeInvite.activate.emailPlaceholder}
                      className={`${fieldClass} mt-1.5`}
                    />
                  </label>

                  <label className="block text-sm font-semibold text-slate-900">
                    {employeeInvite.activate.password}
                    <span className="relative mt-1.5 block">
                      <LockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value)
                          setError('')
                        }}
                        placeholder={employeeInvite.activate.passwordPlaceholder}
                        className={passwordFieldClass}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </label>

                  <label className="block text-sm font-semibold text-slate-900">
                    {employeeInvite.activate.confirm}
                    <span className="relative mt-1.5 block">
                      <LockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value)
                          setError('')
                        }}
                        placeholder={employeeInvite.activate.confirmPlaceholder}
                        className={passwordFieldClass}
                      />
                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                        }
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 pt-1 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => {
                        setAgreed(event.target.checked)
                        setError('')
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand"
                    />
                    <span>
                      {employeeInvite.activate.agreePrefix}{' '}
                      <Link to={paths.terms} className="font-semibold text-brand">
                        {employeeInvite.activate.terms}
                      </Link>{' '}
                      {employeeInvite.activate.and}{' '}
                      <Link to={paths.privacy} className="font-semibold text-brand">
                        {employeeInvite.activate.privacy}
                      </Link>
                    </span>
                  </label>

                  {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {employeeInvite.activate.submit}
                    <span aria-hidden="true">→</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
