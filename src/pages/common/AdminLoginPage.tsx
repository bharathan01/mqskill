import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react'
import { Link, useNavigate } from 'react-router'
import {
  adminLoginPage,
  authenticateAdminDemoUser,
  authMessages,
  dashboardPathForAdminRole,
  findDemoUser,
  maskEmail,
  verifyDemoOtp,
  type AdminDemoUser,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BookIcon,
  ChevronLeftIcon,
  ClockIcon,
  GraduationCapIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from '@/components/ui'

const copy = adminLoginPage

const featureIcons = {
  book: BookIcon,
  award: AwardIcon,
  shield: ShieldCheckIcon,
}

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function AdminLoginPage() {
  const emptyCode = ['', '', '', '', '', '']
  const navigate = useNavigate()
  const [step, setStep] = useState<'signin' | 'verify'>('signin')
  const [email, setEmail] = useState('')
  const [pendingUser, setPendingUser] = useState<AdminDemoUser | null>(null)
  const [error, setError] = useState('')
  const [code, setCode] = useState<string[]>(emptyCode)
  const [secondsLeft, setSecondsLeft] = useState(copy.verify.seconds)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (step !== 'verify') return
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 0 ? 0 : current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step])

  useEffect(() => {
    if (step !== 'verify') return
    const frame = window.requestAnimationFrame(() => {
      inputsRef.current[0]?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step])

  function startVerify(user: AdminDemoUser) {
    setPendingUser(user)
    setEmail(user.email)
    setError('')
    setCode(emptyCode)
    setSecondsLeft(copy.verify.seconds)
    setStep('verify')
  }

  function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextEmail = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')

    if (findDemoUser(nextEmail)) {
      setError(authMessages.adminOnly)
      return
    }

    const user = authenticateAdminDemoUser(nextEmail, password)
    if (!user) {
      setError(authMessages.invalidCredentials)
      return
    }
    startVerify(user)
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const otp = code.join('')
    if (otp.length < 6 || !pendingUser) return
    if (!verifyDemoOtp(otp)) {
      setError(authMessages.invalidOtp)
      return
    }
    navigate(dashboardPathForAdminRole(pendingUser.role))
  }

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setCode((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleCodeKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handleCodePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = Array.from({ length: 6 }, (_, index) => pasted[index] ?? '')
    setCode(next)
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  function handleResend() {
    setSecondsLeft(copy.verify.seconds)
    setCode(emptyCode)
    inputsRef.current[0]?.focus()
  }

  return (
    <div className="grid h-screen overflow-hidden bg-white lg:grid-cols-[0.92fr_1.08fr]">
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
              <span className="block text-lg font-bold tracking-tight">{copy.brand}</span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-white/65 uppercase">
                {copy.brandTag}
              </span>
            </span>
          </Link>

          <h1 className="mt-14 text-4xl font-bold tracking-tight xl:text-[2.75rem] xl:leading-[1.15]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">{copy.description}</p>

          <ul className="mt-10 space-y-5">
            {copy.features.map((feature) => {
              const Icon = featureIcons[feature.icon]
              return (
                <li key={feature.id} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{feature.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-white/65">{feature.body}</span>
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="mt-auto pt-10 text-xs text-white/55">
            {copy.footer}
            <span className="mx-2">·</span>
            <Link to={paths.privacy} className="hover:text-white">
              {copy.privacy}
            </Link>
            <span className="mx-2">·</span>
            <Link to={paths.terms} className="hover:text-white">
              {copy.terms}
            </Link>
          </p>
        </div>
      </section>

      <section className="flex h-full items-center justify-center overflow-y-auto bg-white px-4 py-8 sm:px-8">
        <div className="w-full max-w-[26rem]">
          {step === 'signin' ? (
            <>
              <Link to={paths.home} className="mb-8 inline-flex items-center gap-3 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
                  <GraduationCapIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold text-navy">{copy.brand}</span>
                  <span className="block text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                    {copy.brandTag}
                  </span>
                </span>
              </Link>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{copy.welcome}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy.subtitle}</p>

              <form className="mt-8 space-y-4" onSubmit={handleSignIn}>
                <label className="block text-sm font-semibold text-slate-900">
                  {copy.email}
                  <span className="relative mt-1.5 block">
                    <MailIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setError('')
                      }}
                      placeholder={copy.emailPlaceholder}
                      className={fieldClass}
                    />
                  </span>
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  {copy.password}
                  <span className="relative mt-1.5 block">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder={copy.passwordPlaceholder}
                      onChange={() => setError('')}
                      className={fieldClass}
                    />
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 pt-1 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 accent-brand"
                  />
                  {copy.remember}
                </label>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {copy.submit} →
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                <Link to={paths.login} className="font-semibold text-brand">
                  {copy.learnerLogin}
                </Link>
              </p>

              <div className="mt-4 flex gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm leading-5 text-slate-500">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>{copy.notice}</p>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('signin')
                  setPendingUser(null)
                  setError('')
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {copy.verify.back}
              </button>

              <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                <SmartphoneIcon className="h-5 w-5" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {copy.verify.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {copy.verify.subtitle}{' '}
                <span className="font-medium text-slate-700">{maskEmail(email)}</span>.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleVerify}>
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        inputsRef.current[index] = node
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      aria-label={`Digit ${index + 1}`}
                      onChange={(event) => {
                        setError('')
                        updateDigit(index, event.target.value)
                      }}
                      onKeyDown={(event) => handleCodeKeyDown(index, event)}
                      onPaste={(event) => {
                        setError('')
                        handleCodePaste(event)
                      }}
                      className="h-12 w-11 rounded-lg border-2 border-slate-200 text-center text-lg font-semibold text-slate-900 outline-none focus:border-brand sm:h-14 sm:w-12"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="inline-flex items-center gap-1.5 text-slate-500">
                    <ClockIcon className="h-4 w-4" />
                    {copy.verify.expires}{' '}
                    <span className="font-semibold text-slate-700">{formatTimer(secondsLeft)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={secondsLeft > 0}
                    className="font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copy.verify.resend}
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="trust"
                    className="h-4 w-4 rounded border-slate-300 accent-brand"
                  />
                  {copy.verify.trust}
                </label>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={code.join('').length < 6}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.verify.submit}
                </button>
              </form>

              <button
                type="button"
                className="mt-5 w-full text-center text-sm font-semibold text-brand"
              >
                {copy.verify.alternate}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
