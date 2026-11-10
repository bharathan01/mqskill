import { useState, type FormEvent } from 'react'
import {
  contentProfileDefaults,
  contentProfilePage,
  contentProfileSessions,
  contentProfileTimezones,
} from '@/constants'
import {
  ContentCard,
  ContentField,
  ContentNotice,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
} from '@/components/common'
import { BellIcon, LockIcon, MonitorIcon, UserIcon } from '@/components/ui'

const copy = contentProfilePage

type TabId = (typeof copy.tabs)[number]['id']

const tabIcons = { personal: UserIcon, notifications: BellIcon, security: LockIcon } as const

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const primaryButton =
  'inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700'
const secondaryButton =
  'inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50'

export function ContentProfileSettingsPage() {
  const [tab, setTab] = useState<TabId>('personal')
  const [notice, setNotice] = useState<string | null>(null)

  const [form, setForm] = useState(contentProfileDefaults)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    publish: false,
    qa: false,
    scorm: false,
    digest: false,
    product: false,
  })

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessions, setSessions] = useState(contentProfileSessions)

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setFormErrors((current) => ({ ...current, [key]: '' }))
  }

  function savePersonal(event: FormEvent) {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (!form.firstName.trim()) errors.firstName = copy.personal.required
    if (!form.lastName.trim()) errors.lastName = copy.personal.required
    if (!form.email.trim()) errors.email = copy.personal.required
    else if (!emailPattern.test(form.email)) errors.email = copy.personal.invalidEmail
    setFormErrors(errors)
    if (Object.keys(errors).length) return
    setNotice(copy.personal.saved)
  }

  function updatePassword(event: FormEvent) {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (!password.current) errors.current = copy.security.errors.current
    if (password.next.length < 8) errors.next = copy.security.errors.short
    else if (!/\d/.test(password.next)) errors.next = copy.security.errors.number
    if (password.confirm !== password.next) errors.confirm = copy.security.errors.mismatch
    setPasswordErrors(errors)
    if (Object.keys(errors).length) return
    setPassword({ current: '', next: '', confirm: '' })
    setNotice(copy.security.saved)
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim() || copy.profile.name

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#004EA8] to-[#3B82F6] text-2xl font-bold text-white">
              {copy.profile.initials}
            </span>
            <h2 className="mt-3 text-lg font-bold text-navy">{fullName}</h2>
            <p className="text-sm text-slate-500">{copy.profile.role}</p>
            <p className="mt-0.5 text-xs text-slate-400">{copy.profile.org}</p>
            <p className="mt-2 text-xs text-slate-400">{form.email}</p>
            <p className="mt-0.5 text-xs text-slate-400">{copy.profile.joined}</p>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            {copy.profile.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-lg font-bold text-navy">{stat.value}</dd>
                <dt className="text-[11px] leading-tight text-slate-400">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </aside>

        <div className="space-y-4">
          <div role="tablist" className="flex flex-wrap gap-1 border-b border-slate-200">
            {copy.tabs.map((item) => {
              const Icon = tabIcons[item.id]
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'border-brand text-brand'
                      : 'border-transparent text-slate-500 hover:text-navy'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>

          {tab === 'personal' ? (
            <ContentCard title={copy.personal.title} description={copy.personal.description}>
              <form onSubmit={savePersonal} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ContentField label={copy.personal.firstName} htmlFor="cp-first" required error={formErrors.firstName}>
                    <ContentTextInput
                      id="cp-first"
                      value={form.firstName}
                      invalid={Boolean(formErrors.firstName)}
                      onChange={(event) => setField('firstName', event.target.value)}
                    />
                  </ContentField>
                  <ContentField label={copy.personal.lastName} htmlFor="cp-last" required error={formErrors.lastName}>
                    <ContentTextInput
                      id="cp-last"
                      value={form.lastName}
                      invalid={Boolean(formErrors.lastName)}
                      onChange={(event) => setField('lastName', event.target.value)}
                    />
                  </ContentField>
                  <ContentField label={copy.personal.email} htmlFor="cp-email" required error={formErrors.email}>
                    <ContentTextInput
                      id="cp-email"
                      type="email"
                      value={form.email}
                      invalid={Boolean(formErrors.email)}
                      onChange={(event) => setField('email', event.target.value)}
                    />
                  </ContentField>
                  <ContentField label={copy.personal.phone} htmlFor="cp-phone">
                    <ContentTextInput
                      id="cp-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setField('phone', event.target.value)}
                    />
                  </ContentField>
                  <ContentField label={copy.personal.role} htmlFor="cp-role">
                    <ContentTextInput id="cp-role" value={copy.profile.role} disabled readOnly className="bg-slate-50" />
                  </ContentField>
                  <ContentField label={copy.personal.timezone} htmlFor="cp-tz">
                    <ContentSelect
                      id="cp-tz"
                      value={form.timezone}
                      onChange={(event) => setField('timezone', event.target.value)}
                    >
                      <option value="">Select timezone</option>
                      {contentProfileTimezones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </ContentSelect>
                  </ContentField>
                </div>
                <ContentField label={copy.personal.bio} htmlFor="cp-bio" hint={copy.personal.bioHint}>
                  <ContentTextArea
                    id="cp-bio"
                    rows={3}
                    value={form.bio}
                    onChange={(event) => setField('bio', event.target.value)}
                  />
                </ContentField>
                <div className="flex gap-2">
                  <button type="submit" className={primaryButton}>
                    {copy.personal.save}
                  </button>
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => {
                      setForm(contentProfileDefaults)
                      setFormErrors({})
                    }}
                  >
                    {copy.personal.reset}
                  </button>
                </div>
              </form>
            </ContentCard>
          ) : null}

          {tab === 'notifications' ? (
            <ContentCard title={copy.notifications.title} description={copy.notifications.description}>
              <div className="space-y-3">
                {copy.notifications.items.map((item) => (
                  <ContentToggle
                    key={item.id}
                    label={item.label}
                    description={item.description}
                    checked={prefs[item.id]}
                    onChange={(value) => setPrefs((current) => ({ ...current, [item.id]: value }))}
                  />
                ))}
              </div>
              <div className="mt-5">
                <button type="button" className={primaryButton} onClick={() => setNotice(copy.notifications.saved)}>
                  {copy.notifications.save}
                </button>
              </div>
            </ContentCard>
          ) : null}

          {tab === 'security' ? (
            <>
              <ContentCard title={copy.security.passwordTitle} description={copy.security.description}>
                <form onSubmit={updatePassword} noValidate className="max-w-md space-y-4">
                  <ContentField label={copy.security.current} htmlFor="cp-cur" required error={passwordErrors.current}>
                    <ContentTextInput
                      id="cp-cur"
                      type="password"
                      autoComplete="current-password"
                      value={password.current}
                      invalid={Boolean(passwordErrors.current)}
                      onChange={(event) => setPassword((c) => ({ ...c, current: event.target.value }))}
                    />
                  </ContentField>
                  <ContentField label={copy.security.next} htmlFor="cp-new" required hint={copy.security.hint} error={passwordErrors.next}>
                    <ContentTextInput
                      id="cp-new"
                      type="password"
                      autoComplete="new-password"
                      value={password.next}
                      invalid={Boolean(passwordErrors.next)}
                      onChange={(event) => setPassword((c) => ({ ...c, next: event.target.value }))}
                    />
                  </ContentField>
                  <ContentField label={copy.security.confirm} htmlFor="cp-confirm" required error={passwordErrors.confirm}>
                    <ContentTextInput
                      id="cp-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={password.confirm}
                      invalid={Boolean(passwordErrors.confirm)}
                      onChange={(event) => setPassword((c) => ({ ...c, confirm: event.target.value }))}
                    />
                  </ContentField>
                  <button type="submit" className={primaryButton}>
                    {copy.security.update}
                  </button>
                </form>
              </ContentCard>

              <ContentCard>
                <ContentToggle
                  label={copy.security.twoFactor}
                  description={copy.security.twoFactorDescription}
                  checked={twoFactor}
                  onChange={setTwoFactor}
                />
              </ContentCard>

              <ContentCard title={copy.security.sessionsTitle}>
                <ul className="divide-y divide-slate-100">
                  {sessions.map((session) => (
                    <li key={session.id} className="flex items-center gap-3 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <MonitorIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy">{session.device}</p>
                        <p className="text-xs text-slate-400">
                          {session.location} · {session.time}
                        </p>
                      </div>
                      {session.current ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Current
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                          onClick={() => {
                            setSessions((current) => current.filter((item) => item.id !== session.id))
                            setNotice(copy.security.signedOutNotice)
                          }}
                        >
                          {copy.security.signOut}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </ContentCard>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
