import { useMemo, useRef, useState, useSyncExternalStore, type ChangeEvent } from 'react'
import {
  employeeDateFormats,
  employeePreferenceDefaults,
  employeeProfileDefaults,
  employeeProfilePage,
  employeeRecentSignIns,
  employeeSecurityDefaults,
  employeeSessions,
  employeeNotificationRules,
  employeeTimeZones,
  employeeUser,
  getEmployeePhotoUrl,
  setEmployeePhotoUrl,
  subscribeEmployeePhoto,
  type EmployeeNotificationChannel,
  type EmployeeNotificationRuleId,
  type EmployeeProfileTab,
} from '@/constants'
import {
  CalendarIcon,
  CheckIcon,
  GlobeIcon,
  MonitorIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from '@/components/ui'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp'

const copy = employeeProfilePage
const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy outline-none focus:border-brand'
const selectClass = `${inputClass} appearance-none pr-10`

function Toggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? 'bg-brand' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

export function EmployeeProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const photoUrl = useSyncExternalStore(subscribeEmployeePhoto, getEmployeePhotoUrl, () => null)
  const [tab, setTab] = useState<EmployeeProfileTab>('personal')
  const [personal, setPersonal] = useState({ ...employeeProfileDefaults })
  const [savedPersonal, setSavedPersonal] = useState({ ...employeeProfileDefaults })
  const [twoStep, setTwoStep] = useState(employeeSecurityDefaults.twoStepEnabled)
  const [sessions, setSessions] = useState(() => employeeSessions.map((item) => ({ ...item })))
  const [prefs, setPrefs] = useState(() => structuredClone(employeePreferenceDefaults))
  const [savedPrefs, setSavedPrefs] = useState(() => structuredClone(employeePreferenceDefaults))
  const [toast, setToast] = useState('')

  const personalDirty = useMemo(
    () => JSON.stringify(personal) !== JSON.stringify(savedPersonal),
    [personal, savedPersonal],
  )
  const prefsDirty = useMemo(
    () => JSON.stringify(prefs) !== JSON.stringify(savedPrefs),
    [prefs, savedPrefs],
  )

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > MAX_PHOTO_BYTES) {
      showToast(copy.personal.photoInvalid)
      return
    }
    setEmployeePhotoUrl(URL.createObjectURL(file))
    showToast(copy.personal.photoUpdated)
  }

  function removePhoto() {
    if (!photoUrl) return
    setEmployeePhotoUrl(null)
    showToast(copy.personal.photoRemoved)
  }

  function renderAvatar(size: 'lg' | 'md') {
    const className = size === 'lg' ? 'h-16 w-16 text-lg' : 'h-14 w-14 text-sm'
    if (photoUrl) {
      return (
        <img
          src={photoUrl}
          alt=""
          className={`${className} rounded-full object-cover ring-2 ring-slate-100`}
        />
      )
    }
    return (
      <span
        className={`flex ${className} items-center justify-center rounded-full bg-navy font-bold text-white`}
      >
        {employeeUser.initials}
      </span>
    )
  }

  function setNotification(
    ruleId: EmployeeNotificationRuleId,
    channel: EmployeeNotificationChannel,
    value: boolean,
  ) {
    setPrefs((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [ruleId]: { ...current.notifications[ruleId], [channel]: value },
      },
    }))
  }

  function savePersonal() {
    setSavedPersonal({ ...personal })
    showToast(copy.savedToast)
  }

  function savePreferences() {
    setSavedPrefs(structuredClone(prefs))
    showToast(copy.savedToast)
  }

  function signOutSession(id: string) {
    setSessions((current) => current.filter((item) => item.id !== id))
    showToast(copy.security.signedOutToast)
  }

  function signOutOthers() {
    setSessions((current) => current.filter((item) => item.current))
    showToast(copy.security.signedOutOthersToast)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <header>
        <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.subtitle}</p>
      </header>

      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        {renderAvatar('lg')}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-navy">{employeeUser.name}</h2>
            <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
              {copy.enterpriseBadge}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {copy.jobTitle}
            <span className="mx-1.5 text-slate-300">·</span>
            {copy.orgName}
            <span className="mx-1.5 text-slate-300">·</span>
            {copy.employeeId}
          </p>
        </div>
      </section>

      <div className="overflow-x-auto border-b border-slate-200">
        <div className="flex min-w-max gap-1">
          {(Object.keys(copy.tabs) as EmployeeProfileTab[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {copy.tabs[id]}
            </button>
          ))}
        </div>
      </div>

      {tab === 'personal' ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <div>
            <h3 className="text-base font-bold text-navy">{copy.personal.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{copy.personal.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            {renderAvatar('md')}
            <div>
              <p className="text-sm font-semibold text-navy">{copy.personal.photo}</p>
              <p className="mt-0.5 text-xs text-slate-400">{copy.personal.photoHint}</p>
              <div className="mt-2 flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept={PHOTO_ACCEPT}
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copy.personal.changePhoto}
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={!photoUrl}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copy.personal.removePhoto}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ['firstName', copy.personal.firstName],
                ['lastName', copy.personal.lastName],
                ['email', copy.personal.email],
                ['phone', copy.personal.phone],
                ['jobTitle', copy.personal.jobTitle],
                ['preferredName', copy.personal.preferredName],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block space-y-1.5 sm:col-span-1">
                <span className="text-sm font-semibold text-navy">{label}</span>
                <input
                  value={personal[key]}
                  onChange={(event) =>
                    setPersonal((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className={inputClass}
                />
                {key === 'preferredName' ? (
                  <span className="block text-xs text-slate-400">{copy.personal.preferredHint}</span>
                ) : null}
              </label>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={!personalDirty}
              onClick={() => setPersonal({ ...savedPersonal })}
              className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              disabled={!personalDirty}
              onClick={savePersonal}
              className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {copy.save}
            </button>
          </div>
        </section>
      ) : null}

      {tab === 'organization' ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <div>
            <h3 className="text-base font-bold text-navy">{copy.organization.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{copy.organization.subtitle}</p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {(
              [
                [copy.organization.organization, copy.orgName],
                [copy.organization.department, copy.organization.departmentValue],
                [copy.organization.employeeId, copy.employeeId],
                [copy.organization.manager, copy.organization.managerValue],
                [copy.organization.location, copy.organization.locationValue],
                [copy.organization.seatStatus, copy.organization.seatActive],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <dt className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-navy">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-slate-500">{copy.organization.note}</p>
        </section>
      ) : null}

      {tab === 'security' ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h3 className="text-base font-bold text-navy">{copy.security.signInTitle}</h3>
              <ul className="mt-4 divide-y divide-slate-100">
                <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-semibold text-navy">{copy.security.password}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {copy.security.passwordLastChanged}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(copy.security.passwordToast)}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copy.security.changePassword}
                  </button>
                </li>
                <li className="flex flex-wrap items-center justify-between gap-3 py-3 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-navy">{copy.security.sso}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{copy.security.ssoDetail}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {copy.security.connected}
                  </span>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-navy">{copy.security.twoStepTitle}</h3>
                <Toggle on={twoStep} onChange={setTwoStep} />
              </div>
              {twoStep ? (
                <ul className="mt-4 divide-y divide-slate-100">
                  <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                    <div>
                      <p className="text-sm font-semibold text-navy">{copy.security.textMessage}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{copy.security.phoneMasked}</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-brand hover:text-blue-700"
                    >
                      {copy.security.changeNumber}
                    </button>
                  </li>
                  <li className="flex flex-wrap items-center justify-between gap-3 py-3 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-navy">{copy.security.backupCodes}</p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {copy.security.backupRemaining}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(copy.security.codesToast)}
                      className="text-sm font-semibold text-brand hover:text-blue-700"
                    >
                      {copy.security.viewCodes}
                    </button>
                  </li>
                </ul>
              ) : null}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h3 className="text-base font-bold text-navy">{copy.security.sessionsTitle}</h3>
              <ul className="mt-4 divide-y divide-slate-100">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        {session.device.includes('iPhone') ? (
                          <SmartphoneIcon className="h-4 w-4" />
                        ) : (
                          <MonitorIcon className="h-4 w-4" />
                        )}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-navy">{session.device}</p>
                          {session.current ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              {copy.security.thisDevice}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{session.detail}</p>
                      </div>
                    </div>
                    {!session.current ? (
                      <button
                        type="button"
                        onClick={() => signOutSession(session.id)}
                        className="text-sm font-semibold text-brand hover:text-blue-700"
                      >
                        {copy.security.signOut}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
              {sessions.some((item) => !item.current) ? (
                <button
                  type="button"
                  onClick={signOutOthers}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  {copy.security.signOutOthers}
                </button>
              ) : null}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheckIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-navy">{copy.security.accountStatusTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {copy.security.accountStatusBody}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h3 className="text-sm font-bold text-navy">{copy.security.recentSignInsTitle}</h3>
              <ul className="mt-3 space-y-2.5">
                {employeeRecentSignIns.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-600">{item.when}</span>
                    <span className="font-semibold text-navy">{item.where}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => showToast(copy.security.passwordToast)}
                className="mt-4 text-left text-sm font-semibold text-brand hover:text-blue-700"
              >
                {copy.security.unrecognized}
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {tab === 'preferences' ? (
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h3 className="text-base font-bold text-navy">{copy.preferences.languageTitle}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-navy">
                  {copy.preferences.interfaceLanguage}
                </p>
                <div className="inline-flex rounded-xl border border-slate-200 p-1">
                  {(
                    [
                      ['en', copy.preferences.english],
                      ['ar', copy.preferences.arabic],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPrefs((current) => ({ ...current, language: id }))}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                        prefs.language === id
                          ? 'bg-brand text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-navy">{copy.preferences.timeZone}</span>
                <div className="relative">
                  <GlobeIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={prefs.timeZone}
                    onChange={(event) =>
                      setPrefs((current) => ({ ...current, timeZone: event.target.value }))
                    }
                    className={`${selectClass} pl-10`}
                  >
                    {employeeTimeZones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-navy">{copy.preferences.dateFormat}</span>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={prefs.dateFormat}
                    onChange={(event) =>
                      setPrefs((current) => ({ ...current, dateFormat: event.target.value }))
                    }
                    className={`${selectClass} pl-10`}
                  >
                    {employeeDateFormats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-bold text-navy">{copy.preferences.notificationsTitle}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    <th className="px-5 py-3 font-semibold"> </th>
                    <th className="px-3 py-3 text-center font-semibold">{copy.preferences.email}</th>
                    <th className="px-3 py-3 text-center font-semibold">{copy.preferences.sms}</th>
                    <th className="px-5 py-3 text-center font-semibold">{copy.preferences.inApp}</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeNotificationRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5 font-semibold text-navy">{rule.label}</td>
                      {(['email', 'sms', 'inApp'] as EmployeeNotificationChannel[]).map(
                        (channel) => (
                          <td key={channel} className="px-3 py-3.5 text-center last:px-5">
                            <div className="inline-flex justify-center">
                              <Toggle
                                on={prefs.notifications[rule.id][channel]}
                                onChange={(value) => setNotification(rule.id, channel, value)}
                              />
                            </div>
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h3 className="text-base font-bold text-navy">{copy.preferences.accessibilityTitle}</h3>
            <ul className="mt-4 divide-y divide-slate-100">
              <li className="flex items-start justify-between gap-4 py-3 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-navy">{copy.preferences.captions}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{copy.preferences.captionsHint}</p>
                </div>
                <Toggle
                  on={prefs.captions}
                  onChange={(value) => setPrefs((current) => ({ ...current, captions: value }))}
                />
              </li>
              <li className="flex items-start justify-between gap-4 py-3 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-navy">{copy.preferences.reduceMotion}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {copy.preferences.reduceMotionHint}
                  </p>
                </div>
                <Toggle
                  on={prefs.reduceMotion}
                  onChange={(value) =>
                    setPrefs((current) => ({ ...current, reduceMotion: value }))
                  }
                />
              </li>
            </ul>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <p className="text-sm text-slate-500">{copy.preferences.footerNote}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!prefsDirty}
                onClick={() => setPrefs(structuredClone(savedPrefs))}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                disabled={!prefsDirty}
                onClick={savePreferences}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
              >
                <CheckIcon className="h-4 w-4" />
                {copy.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
