import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { Link, useNavigate } from 'react-router'
import {
  findDemoUser,
  forgotPasswordPage,
  getPasswordChecks,
  getPasswordStrength,
  loginPage,
  maskEmail,
  verifyDemoOtp,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BookIcon,
  BuildingIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  InfoIcon,
  KeyIcon,
  LockIcon,
  MailIcon,
  SendIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from '@/components/ui'

const featureIcons = {
  book: BookIcon,
  award: AwardIcon,
  shield: ShieldCheckIcon,
}

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const passwordFieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const strengthToneClass = {
  idle: 'text-slate-500',
  weak: 'text-red-500',
  fair: 'text-amber-500',
  strong: 'text-emerald-500',
} as const

const strengthBarClass = {
  idle: 'bg-slate-200',
  weak: 'bg-red-400',
  fair: 'bg-amber-400',
  strong: 'bg-emerald-500',
} as const

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ForgotPasswordPage() {
  const emptyCode = ['', '', '', '', '', '']
  const navigate = useNavigate()
  const [step, setStep] = useState<'request' | 'otp' | 'reset' | 'success'>('request')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [code, setCode] = useState<string[]>(emptyCode)
  const [secondsLeft, setSecondsLeft] = useState(forgotPasswordPage.otp.seconds)
  const [redirectSeconds, setRedirectSeconds] = useState(forgotPasswordPage.success.seconds)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const checks = getPasswordChecks(password)
  const strength = getPasswordStrength(password)

  useEffect(() => {
    if (step !== 'otp') return
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 0 ? 0 : current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step])

  useEffect(() => {
    if (step !== 'otp') return
    const frame = window.requestAnimationFrame(() => {
      inputsRef.current[0]?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step])

  useEffect(() => {
    if (step !== 'success') return
    const timer = window.setInterval(() => {
      setRedirectSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          navigate(paths.login)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step, navigate])

  function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextEmail = email.trim()
    if (!nextEmail) {
      setError(forgotPasswordPage.messages.unknownEmail)
      return
    }
    const user = findDemoUser(nextEmail)
    if (!user) {
      setError(forgotPasswordPage.messages.unknownEmail)
      return
    }
    setEmail(user.email)
    setError('')
    setCode(emptyCode)
    setSecondsLeft(forgotPasswordPage.otp.seconds)
    setStep('otp')
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

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const otp = code.join('')
    if (otp.length < 6) return
    if (!verifyDemoOtp(otp)) {
      setError(forgotPasswordPage.messages.invalidOtp)
      return
    }
    setError('')
    setPassword('')
    setConfirmPassword('')
    setStep('reset')
  }

  function handleResend() {
    setSecondsLeft(forgotPasswordPage.otp.seconds)
    setCode(emptyCode)
    setError('')
    inputsRef.current[0]?.focus()
  }

  function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checks.length || !checks.upper || !checks.number) {
      setError(forgotPasswordPage.messages.weakPassword)
      return
    }
    if (password !== confirmPassword) {
      setError(forgotPasswordPage.messages.mismatch)
      return
    }
    setError('')
    setRedirectSeconds(forgotPasswordPage.success.seconds)
    setStep('success')
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
              <span className="block text-lg font-bold tracking-tight">{loginPage.brand}</span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-white/65 uppercase">
                {loginPage.brandTag}
              </span>
            </span>
          </Link>

          <h1 className="mt-14 text-4xl font-bold tracking-tight xl:text-[2.75rem] xl:leading-[1.15]">
            {loginPage.title}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            {loginPage.description}
          </p>

          <ul className="mt-10 space-y-5">
            {loginPage.features.map((feature) => {
              const Icon = featureIcons[feature.icon]
              return (
                <li key={feature.id} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{feature.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-white/65">
                      {feature.body}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="mt-auto pt-10 text-xs text-white/55">
            {loginPage.footer}
            <span className="mx-2">·</span>
            <Link to={paths.privacy} className="hover:text-white">
              {loginPage.privacy}
            </Link>
            <span className="mx-2">·</span>
            <Link to={paths.terms} className="hover:text-white">
              {loginPage.terms}
            </Link>
          </p>
        </div>
      </section>

      <section className="flex h-full items-center justify-center overflow-y-auto bg-white px-4 py-8 sm:px-8">
        <div className="w-full max-w-[26rem]">
          {step === 'request' ? (
            <>
              <Link
                to={paths.login}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {forgotPasswordPage.back}
              </Link>

              <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                <KeyIcon className="h-5 w-5" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {forgotPasswordPage.request.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {forgotPasswordPage.request.subtitle}
              </p>

              <form className="mt-8 space-y-4" onSubmit={handleRequest}>
                <label className="block text-sm font-semibold text-slate-900">
                  {forgotPasswordPage.request.email}
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
                      placeholder={forgotPasswordPage.request.emailPlaceholder}
                      className={fieldClass}
                    />
                  </span>
                </label>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {forgotPasswordPage.request.submit}
                  <SendIcon className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 flex gap-3 rounded-xl bg-[#EAF2FF] px-4 py-3.5 text-sm leading-5 text-slate-600">
                <BuildingIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p>{forgotPasswordPage.request.ssoHint}</p>
              </div>
            </>
          ) : null}

          {step === 'otp' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('request')
                  setError('')
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {forgotPasswordPage.back}
              </button>

              <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                <SmartphoneIcon className="h-5 w-5" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {forgotPasswordPage.otp.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {forgotPasswordPage.otp.subtitle}{' '}
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
                    {forgotPasswordPage.otp.expires}{' '}
                    <span className="font-semibold text-slate-700">{formatTimer(secondsLeft)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={secondsLeft > 0}
                    className="font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {forgotPasswordPage.otp.resend}
                  </button>
                </div>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={code.join('').length < 6}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {forgotPasswordPage.otp.submit}
                </button>
              </form>

              <div className="mt-6 flex gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm leading-5 text-slate-500">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>{forgotPasswordPage.otp.notice}</p>
              </div>
            </>
          ) : null}

          {step === 'reset' ? (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                <LockIcon className="h-5 w-5" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {forgotPasswordPage.reset.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {forgotPasswordPage.reset.forLabel}{' '}
                <span className="font-medium text-slate-700">{email}</span>
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleReset}>
                <label className="block text-sm font-semibold text-slate-900">
                  {forgotPasswordPage.reset.password}
                  <span className="relative mt-1.5 block">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        setError('')
                      }}
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

                <div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }, (_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 flex-1 rounded-full ${
                          index < strength.score
                            ? strengthBarClass[strength.tone]
                            : strengthBarClass.idle
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label ? (
                    <p className={`mt-2 text-sm ${strengthToneClass[strength.tone]}`}>
                      {forgotPasswordPage.reset.strength}{' '}
                      <span className="font-semibold">{strength.label}</span>
                    </p>
                  ) : null}
                </div>

                <ul className="space-y-2 rounded-xl bg-slate-50 px-4 py-3.5">
                  {forgotPasswordPage.reset.requirements.map((requirement) => {
                    const met = checks[requirement.id]
                    return (
                      <li
                        key={requirement.id}
                        className={`flex items-center gap-2 text-sm ${
                          met ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      >
                        {met ? (
                          <CheckCircleIcon className="h-4 w-4 shrink-0" />
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300" />
                        )}
                        {requirement.label}
                      </li>
                    )
                  })}
                </ul>

                <label className="block text-sm font-semibold text-slate-900">
                  {forgotPasswordPage.reset.confirm}
                  <span className="relative mt-1.5 block">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value)
                        setError('')
                      }}
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

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {forgotPasswordPage.reset.submit}
                </button>
              </form>
            </>
          ) : null}

          {step === 'success' ? (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircleIcon className="h-6 w-6" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {forgotPasswordPage.success.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {forgotPasswordPage.success.subtitle}
              </p>

              <button
                type="button"
                onClick={() => navigate(paths.login)}
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {forgotPasswordPage.success.submit}
              </button>

              <p className="mt-4 text-center text-sm text-slate-500">
                {forgotPasswordPage.success.redirect}{' '}
                <span className="font-semibold text-slate-700">{redirectSeconds}s</span>
              </p>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}
