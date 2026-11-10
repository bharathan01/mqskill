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
  getPasswordChecks,
  getPasswordStrength,
  getSignupYearOptions,
  maskEmail,
  signupPage,
  verifyDemoOtp,
  type SignupProfileType,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BookIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UserIcon,
} from '@/components/ui'

const featureIcons = {
  book: BookIcon,
  award: AwardIcon,
  shield: ShieldCheckIcon,
}

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const iconFieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const passwordFieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const textareaClass =
  'min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

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

function TagPicker({
  label,
  options,
  selected,
  customPlaceholder,
  onToggle,
  onAddCustom,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  customPlaceholder: string
  onToggle: (tag: string) => void
  onAddCustom: (tag: string) => void
}) {
  const [custom, setCustom] = useState('')

  function handleAdd() {
    const value = custom.trim()
    if (!value) return
    onAddCustom(value)
    setCustom('')
  }

  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((tag) => {
          const active = selected.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {tag}
            </button>
          )
        })}
        {selected
          .filter((tag) => !options.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className="rounded-full border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-white"
            >
              {tag}
            </button>
          ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAdd()
            }
          }}
          placeholder={customPlaceholder}
          className={fieldClass}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export function SignupPage() {
  const emptyCode = ['', '', '', '', '', '']
  const yearOptions = getSignupYearOptions()
  const navigate = useNavigate()
  const [step, setStep] = useState<'personal' | 'profile' | 'password' | 'otp'>('personal')
  const [error, setError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const [profileType, setProfileType] = useState<SignupProfileType | ''>('')
  const [collegeName, setCollegeName] = useState('')
  const [registerNumber, setRegisterNumber] = useState('')
  const [course, setCourse] = useState('')
  const [studyYear, setStudyYear] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [designation, setDesignation] = useState('')
  const [experience, setExperience] = useState('')
  const [otherDetails, setOtherDetails] = useState('')
  const [otherTags, setOtherTags] = useState<string[]>([])
  const [whyTags, setWhyTags] = useState<string[]>([])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [code, setCode] = useState<string[]>(emptyCode)
  const [secondsLeft, setSecondsLeft] = useState<number>(signupPage.otp.seconds)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const checks = getPasswordChecks(password)
  const strength = getPasswordStrength(password)
  const stepOrder = ['personal', 'profile', 'password', 'otp'] as const
  const stepIndex = stepOrder.indexOf(step)

  useEffect(() => {
    const panel = document.getElementById('signup-scroll-panel')
    panel?.scrollTo({ top: 0 })
  }, [step])

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

  function toggleTag(list: string[], tag: string, setter: (next: string[]) => void) {
    setter(list.includes(tag) ? list.filter((item) => item !== tag) : [...list, tag])
  }

  function handlePersonal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError(signupPage.messages.required)
      return
    }
    if (findDemoUser(email)) {
      setError(signupPage.messages.emailTaken)
      return
    }
    setError('')
    setStep('profile')
  }

  function handleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profileType) {
      setError(signupPage.messages.profileRequired)
      return
    }
    if (profileType === 'student') {
      if (
        !collegeName.trim() ||
        !registerNumber.trim() ||
        !course.trim() ||
        !studyYear ||
        !startYear ||
        !endYear
      ) {
        setError(signupPage.messages.required)
        return
      }
    }
    if (profileType === 'professional') {
      if (!companyName.trim() || !designation.trim() || !experience) {
        setError(signupPage.messages.required)
        return
      }
    }
    if (profileType === 'other') {
      if (!otherDetails.trim() && otherTags.length === 0) {
        setError(signupPage.messages.required)
        return
      }
    }
    if (whyTags.length === 0) {
      setError(signupPage.messages.whyRequired)
      return
    }
    setError('')
    setStep('password')
  }

  function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checks.length || !checks.upper || !checks.number) {
      setError(signupPage.messages.weakPassword)
      return
    }
    if (password !== confirmPassword) {
      setError(signupPage.messages.mismatch)
      return
    }
    setError('')
    setCode(emptyCode)
    setSecondsLeft(signupPage.otp.seconds)
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
      setError(signupPage.messages.invalidOtp)
      return
    }
    navigate(paths.student.dashboard)
  }

  function handleResend() {
    setSecondsLeft(signupPage.otp.seconds)
    setCode(emptyCode)
    setError('')
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
              <span className="block text-lg font-bold tracking-tight">{signupPage.brand}</span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-white/65 uppercase">
                {signupPage.brandTag}
              </span>
            </span>
          </Link>

          <h1 className="mt-14 text-4xl font-bold tracking-tight xl:text-[2.75rem] xl:leading-[1.15]">
            {signupPage.title}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">{signupPage.description}</p>

          <ul className="mt-10 space-y-5">
            {signupPage.features.map((feature) => {
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
            {signupPage.footer}
            <span className="mx-2">·</span>
            <Link to={paths.privacy} className="hover:text-white">
              {signupPage.privacy}
            </Link>
            <span className="mx-2">·</span>
            <Link to={paths.terms} className="hover:text-white">
              {signupPage.terms}
            </Link>
          </p>
        </div>
      </section>

      <section
        id="signup-scroll-panel"
        className="h-full overflow-y-auto bg-white px-4 py-8 sm:px-10"
      >
        <div className="mx-auto flex min-h-full w-full max-w-xl items-center">
          <div className="w-full py-2">
          <div className="mb-6 flex items-center gap-2">
            {stepOrder.map((item, index) => (
              <span
                key={item}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= stepIndex ? 'bg-brand' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="mb-6 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Step {stepIndex + 1} of {stepOrder.length} · {signupPage.steps[step]}
          </p>

          {step === 'personal' ? (
            <>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {signupPage.personal.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{signupPage.personal.subtitle}</p>

              <form className="mt-8 space-y-4" onSubmit={handlePersonal}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    {signupPage.personal.firstName}
                    <span className="relative mt-1.5 block">
                      <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(event) => {
                          setFirstName(event.target.value)
                          setError('')
                        }}
                        placeholder={signupPage.personal.firstNamePlaceholder}
                        className={iconFieldClass}
                      />
                    </span>
                  </label>
                  <label className="block text-sm font-semibold text-slate-900">
                    {signupPage.personal.lastName}
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value)
                        setError('')
                      }}
                      placeholder={signupPage.personal.lastNamePlaceholder}
                      className={`${fieldClass} mt-1.5`}
                    />
                  </label>
                </div>

                <label className="block text-sm font-semibold text-slate-900">
                  {signupPage.personal.email}
                  <span className="relative mt-1.5 block">
                    <MailIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setError('')
                      }}
                      placeholder={signupPage.personal.emailPlaceholder}
                      className={iconFieldClass}
                    />
                  </span>
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  {signupPage.personal.phone}
                  <span className="relative mt-1.5 block">
                    <SmartphoneIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        setError('')
                      }}
                      placeholder={signupPage.personal.phonePlaceholder}
                      className={iconFieldClass}
                    />
                  </span>
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  {signupPage.personal.address}
                  <span className="relative mt-1.5 block">
                    <MapPinIcon className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400" />
                    <textarea
                      required
                      value={address}
                      onChange={(event) => {
                        setAddress(event.target.value)
                        setError('')
                      }}
                      placeholder={signupPage.personal.addressPlaceholder}
                      className={`${textareaClass} pl-10`}
                    />
                  </span>
                </label>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {signupPage.personal.next}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                {signupPage.personal.haveAccount}{' '}
                <Link to={paths.login} className="font-semibold text-brand">
                  {signupPage.personal.login}
                </Link>
              </p>
            </>
          ) : null}

          {step === 'profile' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('personal')
                  setError('')
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {signupPage.profile.back}
              </button>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {signupPage.profile.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{signupPage.profile.subtitle}</p>

              <form className="mt-8 space-y-4" onSubmit={handleProfile}>
                <label className="block text-sm font-semibold text-slate-900">
                  {signupPage.profile.typeLabel}
                  <select
                    required
                    value={profileType}
                    onChange={(event) => {
                      setProfileType(event.target.value as SignupProfileType | '')
                      setError('')
                    }}
                    className={`${fieldClass} mt-1.5`}
                  >
                    <option value="">{signupPage.profile.typePlaceholder}</option>
                    {signupPage.profile.types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>

                {profileType === 'student' ? (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                      <GraduationCapIcon className="h-4 w-4 text-brand" />
                      Student details
                    </p>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.student.college}
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(event) => setCollegeName(event.target.value)}
                        placeholder={signupPage.profile.student.collegePlaceholder}
                        className={`${fieldClass} mt-1.5`}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.student.register}
                      <input
                        type="text"
                        required
                        value={registerNumber}
                        onChange={(event) => setRegisterNumber(event.target.value)}
                        placeholder={signupPage.profile.student.registerPlaceholder}
                        className={`${fieldClass} mt-1.5`}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.student.course}
                      <input
                        type="text"
                        required
                        value={course}
                        onChange={(event) => setCourse(event.target.value)}
                        placeholder={signupPage.profile.student.coursePlaceholder}
                        className={`${fieldClass} mt-1.5`}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.student.year}
                      <select
                        required
                        value={studyYear}
                        onChange={(event) => setStudyYear(event.target.value)}
                        className={`${fieldClass} mt-1.5`}
                      >
                        <option value="">Current year</option>
                        {signupPage.profile.student.yearOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        {signupPage.profile.student.startYear}
                        <select
                          required
                          value={startYear}
                          onChange={(event) => setStartYear(event.target.value)}
                          className={`${fieldClass} mt-1.5`}
                        >
                          <option value="">Start year</option>
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-semibold text-slate-900">
                        {signupPage.profile.student.endYear}
                        <select
                          required
                          value={endYear}
                          onChange={(event) => setEndYear(event.target.value)}
                          className={`${fieldClass} mt-1.5`}
                        >
                          <option value="">End year</option>
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ) : null}

                {profileType === 'professional' ? (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                      <BriefcaseIcon className="h-4 w-4 text-brand" />
                      Company details
                    </p>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.professional.company}
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        placeholder={signupPage.profile.professional.companyPlaceholder}
                        className={`${fieldClass} mt-1.5`}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.professional.designation}
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(event) => setDesignation(event.target.value)}
                        placeholder={signupPage.profile.professional.designationPlaceholder}
                        className={`${fieldClass} mt-1.5`}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.professional.experience}
                      <select
                        required
                        value={experience}
                        onChange={(event) => setExperience(event.target.value)}
                        className={`${fieldClass} mt-1.5`}
                      >
                        <option value="">Select experience</option>
                        {signupPage.profile.professional.experienceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}

                {profileType === 'other' ? (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <label className="block text-sm font-semibold text-slate-900">
                      {signupPage.profile.other.details}
                      <textarea
                        value={otherDetails}
                        onChange={(event) => setOtherDetails(event.target.value)}
                        placeholder={signupPage.profile.other.detailsPlaceholder}
                        className={`${textareaClass} mt-1.5`}
                      />
                    </label>
                    <TagPicker
                      label={signupPage.profile.other.tagsLabel}
                      options={signupPage.profile.other.tags}
                      selected={otherTags}
                      customPlaceholder={signupPage.profile.other.customPlaceholder}
                      onToggle={(tag) => toggleTag(otherTags, tag, setOtherTags)}
                      onAddCustom={(tag) => {
                        if (!otherTags.includes(tag)) setOtherTags([...otherTags, tag])
                      }}
                    />
                  </div>
                ) : null}

                {profileType ? (
                  <TagPicker
                    label={signupPage.profile.whyLabel}
                    options={signupPage.profile.whyTags}
                    selected={whyTags}
                    customPlaceholder={signupPage.profile.whyCustomPlaceholder}
                    onToggle={(tag) => toggleTag(whyTags, tag, setWhyTags)}
                    onAddCustom={(tag) => {
                      if (!whyTags.includes(tag)) setWhyTags([...whyTags, tag])
                    }}
                  />
                ) : null}

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {signupPage.profile.next}
                </button>
              </form>
            </>
          ) : null}

          {step === 'password' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('profile')
                  setError('')
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {signupPage.password.back}
              </button>

              <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                <LockIcon className="h-5 w-5" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {signupPage.password.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{signupPage.password.subtitle}</p>

              <form className="mt-8 space-y-5" onSubmit={handlePassword}>
                <label className="block text-sm font-semibold text-slate-900">
                  {signupPage.password.password}
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
                      {signupPage.password.strength}{' '}
                      <span className="font-semibold">{strength.label}</span>
                    </p>
                  ) : null}
                </div>

                <ul className="space-y-2 rounded-xl bg-slate-50 px-4 py-3.5">
                  {signupPage.password.requirements.map((requirement) => {
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
                  {signupPage.password.confirm}
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
                  {signupPage.password.next}
                </button>
              </form>
            </>
          ) : null}

          {step === 'otp' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep('password')
                  setError('')
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {signupPage.otp.back}
              </button>

              <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                <SmartphoneIcon className="h-5 w-5" />
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {signupPage.otp.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {signupPage.otp.subtitle}{' '}
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
                    {signupPage.otp.expires}{' '}
                    <span className="font-semibold text-slate-700">{formatTimer(secondsLeft)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={secondsLeft > 0}
                    className="font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {signupPage.otp.resend}
                  </button>
                </div>

                {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={code.join('').length < 6}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {signupPage.otp.submit}
                </button>
              </form>
            </>
          ) : null}
        </div>
        </div>
      </section>
    </div>
  )
}
