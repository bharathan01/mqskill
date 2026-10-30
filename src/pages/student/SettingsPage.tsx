import { useState, type ReactNode } from 'react'
import {
  studentLoginSessions,
  studentNotificationRules,
  studentPasswordDefaults,
  studentPrivacyRules,
  studentSettingsDefaults,
  studentSettingsPage as copy,
} from '@/constants/studentSettings'
import {
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  ClipboardIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LockIcon,
  LogOutIcon,
  MapPinIcon,
  MonitorIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from '@/components/ui'

type Prefs = typeof studentSettingsDefaults

const fieldClass =
  'h-11 w-full rounded-xl bg-[#EEF3FB] px-4 pr-11 text-sm text-navy outline-none placeholder:text-slate-400'

function entropyScore(value: string) {
  if (!value) return 0
  let score = Math.min(40, value.length * 3)
  if (/[a-z]/.test(value)) score += 12
  if (/[A-Z]/.test(value)) score += 12
  if (/\d/.test(value)) score += 12
  if (/[^A-Za-z0-9]/.test(value)) score += 16
  if (value.length >= 14) score += 4
  return Math.min(100, score)
}

function entropyLabel(score: number) {
  if (score >= 85) return 'Strong'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Weak'
}

function Toggle({
  on,
  locked = false,
  onChange,
}: {
  on: boolean
  locked?: boolean
  onChange?: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={locked}
      onClick={() => onChange?.(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? 'bg-brand' : 'bg-slate-200'
      } ${locked ? 'cursor-not-allowed opacity-80' : ''}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  icon,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  onToggle: () => void
  icon: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClass} pl-10`}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={onToggle}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
        >
          {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </span>
    </label>
  )
}

export function StudentSettingsPage() {
  const [password, setPassword] = useState(studentPasswordDefaults)
  const [show, setShow] = useState({ current: true, next: true, confirm: true })
  const [lastReset, setLastReset] = useState(copy.lastReset)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [prefs, setPrefs] = useState<Prefs>(studentSettingsDefaults)
  const [savedPrefs, setSavedPrefs] = useState<Prefs>(studentSettingsDefaults)
  const [sessions, setSessions] = useState(studentLoginSessions)
  const [transfer, setTransfer] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)

  const score = entropyScore(password.next)
  const label = entropyLabel(score)
  const dirty = JSON.stringify(prefs) !== JSON.stringify(savedPrefs)
  const segments = Math.min(4, Math.floor(score / 25))

  function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((current) => ({ ...current, [key]: value }))
    setPrefsSaved(false)
  }

  function handleDiscard() {
    setPassword({ ...studentPasswordDefaults, next: '', confirm: '' })
    setPasswordMessage('')
  }

  function handleSavePassword() {
    if (password.next !== password.confirm) {
      setPasswordMessage(copy.mismatch)
      return
    }
    if (score < 85) {
      setPasswordMessage(copy.tooWeak)
      return
    }
    setPassword({ current: password.next, next: '', confirm: '' })
    setLastReset(copy.lastResetNow)
    setPasswordMessage('')
  }

  function handleSavePrefs() {
    setSavedPrefs(prefs)
    setPrefsSaved(true)
  }

  function handleRevert() {
    setPrefs(studentSettingsDefaults)
    setSavedPrefs(studentSettingsDefaults)
    setPrefsSaved(false)
  }

  return (
    <div className="space-y-6 pb-8">
      <section className="flex flex-col gap-4 rounded-3xl bg-[#E8F1FF] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
            {copy.crumb[0]}
            <span className="mx-2 text-slate-300">›</span>
            <span className="text-brand">{copy.crumb[1]}</span>
          </p>
          <h1 className="mt-2 font-hero text-3xl font-bold text-navy sm:text-4xl">{copy.title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{copy.subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-2 text-xs font-semibold text-emerald-600 shadow-sm">
          <ShieldCheckIcon className="h-4 w-4" />
          {copy.badge}
        </span>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
                  <KeyIcon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-navy">{copy.passwordTitle}</h2>
                  <p className="text-sm text-slate-400">{copy.passwordSubtitle}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">{lastReset}</span>
            </div>

            <div className="mt-5 space-y-4">
              <PasswordField
                label={copy.currentLabel}
                value={password.current}
                visible={show.current}
                icon={<EyeIcon className="h-4 w-4" />}
                onToggle={() => setShow((current) => ({ ...current, current: !current.current }))}
                onChange={(value) => setPassword((current) => ({ ...current, current: value }))}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <PasswordField
                  label={copy.newLabel}
                  value={password.next}
                  visible={show.next}
                  icon={<LockIcon className="h-4 w-4" />}
                  onToggle={() => setShow((current) => ({ ...current, next: !current.next }))}
                  onChange={(value) => setPassword((current) => ({ ...current, next: value }))}
                />
                <PasswordField
                  label={copy.confirmLabel}
                  value={password.confirm}
                  visible={show.confirm}
                  icon={<LockIcon className="h-4 w-4" />}
                  onToggle={() => setShow((current) => ({ ...current, confirm: !current.confirm }))}
                  onChange={(value) => setPassword((current) => ({ ...current, confirm: value }))}
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#F4F7FC] p-4">
              <div className="flex items-center justify-between gap-3 text-xs font-bold tracking-wide text-slate-400 uppercase">
                <span>{copy.entropy}</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-semibold normal-case tracking-normal ${
                    score >= 85 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-500'
                  }`}
                >
                  {score >= 85 ? <CheckCircleIcon className="h-3.5 w-3.5" /> : null}
                  {label} ({score}/100)
                </span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full ${index < segments ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{copy.entropyHint}</p>
            </div>
            {passwordMessage ? <p className="mt-3 text-sm font-medium text-rose-500">{passwordMessage}</p> : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="rounded-xl bg-[#EEF3FB] px-4 py-2.5 text-sm font-semibold text-navy"
              >
                {copy.discard}
              </button>
              <button
                type="button"
                onClick={handleSavePassword}
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
              >
                {copy.savePassword}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheckIcon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="inline-flex flex-wrap items-center gap-2 text-base font-bold text-navy">
                    {copy.twoFaTitle}
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase">
                      {copy.twoFaBadge}
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">{copy.twoFaSubtitle}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#F4F7FC] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <SmartphoneIcon className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-bold text-navy">{copy.twoFaMethod}</p>
                  <p className="text-xs text-slate-400">{copy.twoFaConfigured}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {copy.twoFaPrimary}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy"
              >
                {copy.reconfigure}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#EEF3FB] px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm text-slate-600">
                <ClipboardIcon className="h-4 w-4 text-slate-400" />
                {copy.backupCodes}
              </p>
              <button type="button" className="text-sm font-semibold text-brand">
                {copy.downloadCodes}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="inline-flex items-center gap-2 text-base font-bold text-navy">
                  <MonitorIcon className="h-4 w-4 text-slate-400" />
                  {copy.sessionsTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{copy.sessionsSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSessions((current) => current.filter((item) => item.current))}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500"
              >
                <LogOutIcon className="h-4 w-4" />
                {copy.logoutOthers}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {sessions.map((session) => (
                <article key={session.id} className="rounded-xl bg-[#F4F7FC] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-slate-400">
                        {session.icon === 'mobile' ? (
                          <SmartphoneIcon className="h-5 w-5" />
                        ) : (
                          <MonitorIcon className="h-5 w-5" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-navy">
                          {session.device}
                          {'app' in session && session.app ? (
                            <span className="ml-2 font-medium text-slate-400">{session.app}</span>
                          ) : null}
                          {session.current ? (
                            <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand">
                              {copy.currentSession}
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          {session.place}
                        </p>
                      </div>
                    </div>
                    {session.current ? (
                      <span className="text-xs font-semibold text-emerald-600">{copy.activeNow}</span>
                    ) : (
                      <button
                        type="button"
                        aria-label="End session"
                        onClick={() => setSessions((current) => current.filter((item) => item.id !== session.id))}
                        className="text-slate-400 hover:text-navy"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 pl-8 text-xs text-slate-400">{session.meta}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
                <BellIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-navy">{copy.notificationsTitle}</h2>
                <p className="text-sm text-slate-400">{copy.notificationsSubtitle}</p>
              </div>
            </div>
            <div className="space-y-5">
              {studentNotificationRules.map((rule) => (
                <div key={rule.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-sm font-bold text-navy">
                      {rule.title}
                      {rule.locked ? <LockIcon className="h-3.5 w-3.5 text-slate-400" /> : null}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{rule.body}</p>
                  </div>
                  <Toggle
                    on={prefs[rule.id]}
                    locked={rule.locked}
                    onChange={rule.locked ? undefined : (value) => setPref(rule.id, value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
                <ShieldCheckIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-navy">{copy.privacyTitle}</h2>
                <p className="text-sm text-slate-400">{copy.privacySubtitle}</p>
              </div>
            </div>
            <div className="space-y-5">
              {studentPrivacyRules.map((rule) => (
                <div key={rule.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy">{rule.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{rule.body}</p>
                  </div>
                  <Toggle on={prefs[rule.id]} onChange={(value) => setPref(rule.id, value)} />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#EEF3FB] px-4 py-3 text-sm font-semibold text-navy"
            >
              <span className="inline-flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                {copy.downloadArchive}
              </span>
              <ChevronRightIcon className="h-4 w-4 text-slate-400" />
            </button>
            <div className="mt-3 flex items-center justify-between px-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <LockIcon className="h-4 w-4 text-slate-400" />
                {copy.privacyPolicy}
              </span>
              <span className="text-xs text-slate-400">{copy.policyVersion}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <AlertTriangleIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-rose-500">{copy.dangerTitle}</h2>
                <p className="text-sm text-slate-400">{copy.dangerSubtitle}</p>
              </div>
            </div>
            <div className="space-y-3">
              <article className="flex items-center justify-between gap-3 rounded-xl bg-[#EEF3FB] p-4">
                <div>
                  <p className="text-sm font-bold text-navy">{copy.transferTitle}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{copy.transferBody}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTransfer(true)}
                  className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm"
                >
                  {transfer ? copy.transferDone : copy.transferCta}
                </button>
              </article>
              <article className="flex items-center justify-between gap-3 rounded-xl bg-rose-50 p-4">
                <div>
                  <p className="text-sm font-bold text-rose-600">{copy.deactivateTitle}</p>
                  <p className="mt-1 text-xs leading-5 text-rose-400">{copy.deactivateBody}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  {copy.deactivateCta}
                </button>
              </article>
            </div>
          </section>
        </aside>
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
          {prefsSaved ? copy.saved : copy.unsaved}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRevert}
            disabled={!dirty && !prefsSaved}
            className="rounded-xl bg-[#EEF3FB] px-4 py-2.5 text-sm font-semibold text-navy disabled:opacity-50"
          >
            {copy.revert}
          </button>
          <button
            type="button"
            onClick={handleSavePrefs}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            <CheckIcon className="h-4 w-4" />
            {copy.save}
          </button>
        </div>
      </div>
    </div>
  )
}
