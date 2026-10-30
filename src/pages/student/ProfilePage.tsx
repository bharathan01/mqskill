import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import {
  studentProfileDefaults,
  studentProfileFields as labels,
  studentProfilePage as copy,
} from '@/constants/studentProfile'
import {
  AwardIcon,
  BuildingIcon,
  CameraIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  GraduationCapIcon,
  HomeIcon,
  ImageIcon,
  LinkedInIcon,
  LockIcon,
  MonitorIcon,
  SaveIcon,
  ShieldCheckIcon,
  SmileIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
} from '@/components/ui'

type ProfileForm = typeof studentProfileDefaults

const inputClass =
  'h-11 w-full rounded-xl bg-[#EEF3FB] px-4 pr-10 text-sm text-navy outline-none placeholder:text-slate-400'

function HealthRing({ value }: { value: number }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)

  return (
    <svg viewBox="0 0 56 56" className="h-16 w-16 -rotate-90" aria-hidden="true">
      <circle cx="28" cy="28" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="5" />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="#22c55e"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

function Field({
  label,
  extra,
  icon,
  children,
}: {
  label: string
  extra?: ReactNode
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold text-navy">
        {label}
        {extra}
      </span>
      <span className="relative block">
        {children}
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}
      </span>
    </label>
  )
}

function formatSavedAt(date: Date) {
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  })
  return `Just now (${time})`
}

export function StudentProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState<ProfileForm>(studentProfileDefaults)
  const [form, setForm] = useState<ProfileForm>(studentProfileDefaults)
  const [lastSave, setLastSave] = useState(copy.lastSave)

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  const bioCount = form.bio.length

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 4 * 1024 * 1024) return
    const url = URL.createObjectURL(file)
    setForm((current) => {
      if (current.avatar.startsWith('blob:')) URL.revokeObjectURL(current.avatar)
      return { ...current, avatar: url }
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(form)
    setLastSave(formatSavedAt(new Date()))
  }

  function handleRevert() {
    setForm(saved)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl bg-[#E8F1FF] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold text-brand">{copy.crumb[0]}</span>
            <span>/</span>
            <span>{copy.crumb[1]}</span>
            <span>/</span>
            <span>{copy.crumb[2]}</span>
          </p>
          <h1 className="mt-2 font-hero text-3xl font-bold text-navy sm:text-4xl">{copy.title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{copy.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="relative">
            <HealthRing value={copy.health} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-navy">
              {copy.health}%
            </span>
          </div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
            {copy.healthLabel}
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 xl:grid-cols-[19.5rem_minmax(0,1fr)]"
      >
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy">{copy.avatarTitle}</h2>
            <ImageIcon className="h-4 w-4 text-slate-300" />
          </div>
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt=""
                  className="h-36 w-36 rounded-full object-cover ring-4 ring-[#EEF3FB]"
                />
              ) : (
                <span className="flex h-36 w-36 items-center justify-center rounded-full bg-[#EEF3FB] text-slate-300">
                  <UserIcon className="h-14 w-14" />
                </span>
              )}
              <button
                type="button"
                aria-label={copy.upload}
                onClick={() => fileRef.current?.click()}
                className="absolute right-1 bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow"
              >
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold text-navy">{form.legalName}</h3>
            <p className="mt-1 text-sm text-slate-400">{copy.role}</p>
            <div className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl bg-[#EEF3FB] px-3 py-2.5">
              <span className="inline-flex items-center gap-2 text-left">
                <ShieldCheckIcon className="h-4 w-4 text-brand" />
                <span>
                  <span className="block text-sm font-bold text-navy">{copy.studentId}</span>
                  <span className="text-[11px] text-slate-400">{copy.studentIdHint}</span>
                </span>
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                {copy.status}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhoto}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white"
            >
              <UploadIcon className="h-4 w-4" />
              {copy.upload}
            </button>
            <button
              type="button"
              onClick={() => update('avatar', '')}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F4F6FB] text-sm font-semibold text-rose-500"
            >
              <TrashIcon className="h-4 w-4" />
              {copy.remove}
            </button>
            <p className="mt-4 text-xs leading-5 text-slate-400">{copy.photoHint}</p>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
                  <UserIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-navy">{copy.personalTitle}</h2>
                  <p className="text-sm text-slate-400">{copy.personalSubtitle}</p>
                </div>
              </div>
              <span className="rounded-md bg-[#EEF3FB] px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-400">
                {copy.personalSec}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label={labels.legalName} icon={<UserIcon className="h-4 w-4" />}>
                <input
                  value={form.legalName}
                  onChange={(event) => update('legalName', event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={labels.preferredName} icon={<SmileIcon className="h-4 w-4" />}>
                <input
                  value={form.preferredName}
                  onChange={(event) => update('preferredName', event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field
                label={labels.email}
                extra={
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    {copy.verified}
                  </span>
                }
                icon={<LockIcon className="h-4 w-4" />}
              >
                <input value={form.email} readOnly className={`${inputClass} text-slate-500`} />
              </Field>
              <Field label={labels.phone}>
                <span className="flex gap-2">
                  <span className="relative">
                    <select
                      value={form.dial}
                      onChange={(event) => update('dial', event.target.value)}
                      className="h-11 appearance-none rounded-xl bg-[#EEF3FB] pr-8 pl-10 text-sm font-semibold text-navy outline-none"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </select>
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                      {form.dial === '+44' ? '🇬🇧' : form.dial === '+91' ? '🇮🇳' : '🇺🇸'}
                    </span>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  </span>
                  <input
                    value={form.phone}
                    onChange={(event) => update('phone', event.target.value)}
                    className={`${inputClass} flex-1 pr-4`}
                  />
                </span>
              </Field>
              <div className="sm:col-span-2">
                <Field label={labels.street} icon={<HomeIcon className="h-4 w-4" />}>
                  <input
                    value={form.street}
                    onChange={(event) => update('street', event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <Field label={labels.city}>
                    <input
                      value={form.city}
                      onChange={(event) => update('city', event.target.value)}
                      className={`${inputClass} pr-4`}
                    />
                  </Field>
                </div>
                <Field label={labels.state}>
                  <input
                    value={form.state}
                    onChange={(event) => update('state', event.target.value)}
                    className={`${inputClass} pr-4`}
                  />
                </Field>
                <Field label={labels.zip}>
                  <input
                    value={form.zip}
                    onChange={(event) => update('zip', event.target.value)}
                    className={`${inputClass} pr-4`}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 font-semibold text-navy">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {copy.synced}
                </span>
                <span className="mt-1 block text-xs text-slate-400 sm:mt-0 sm:ml-4 sm:inline">
                  {copy.lastSavePrefix} {lastSave}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleRevert}
                  disabled={!dirty}
                  className="rounded-xl bg-[#EEF3FB] px-4 py-2.5 text-sm font-semibold text-navy disabled:opacity-50"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <SaveIcon className="h-4 w-4" />
                  {copy.save}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
                  <GraduationCapIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-navy">{copy.academicTitle}</h2>
                  <p className="text-sm text-slate-400">{copy.academicSubtitle}</p>
                </div>
              </div>
              <span className="rounded-md bg-[#EEF3FB] px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-400">
                {copy.academicSec}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <Field label={labels.qualification} icon={<AwardIcon className="h-4 w-4" />}>
                <input
                  value={form.qualification}
                  onChange={(event) => update('qualification', event.target.value)}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={labels.institution} icon={<BuildingIcon className="h-4 w-4" />}>
                  <input
                    value={form.institution}
                    onChange={(event) => update('institution', event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={labels.major} icon={<MonitorIcon className="h-4 w-4" />}>
                  <input
                    value={form.major}
                    onChange={(event) => update('major', event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <label className="block">
                <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold text-navy">
                  {copy.bioLabel}
                  <span className="text-xs font-medium text-slate-400">
                    {bioCount} / {copy.bioLimit} characters
                  </span>
                </span>
                <textarea
                  value={form.bio}
                  maxLength={copy.bioLimit}
                  rows={5}
                  onChange={(event) => update('bio', event.target.value)}
                  className="w-full resize-none rounded-xl bg-[#EEF3FB] px-4 py-3 text-sm leading-6 text-navy outline-none"
                />
                <span className="mt-2 block text-xs text-slate-400">{copy.bioHint}</span>
              </label>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F1FF] text-[#0A66C2]">
                <LinkedInIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{copy.linkedInTitle}</p>
                <p className="text-sm text-slate-400">{form.linkedIn}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {form.linked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  {copy.linked}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => update('linked', !form.linked)}
                className="rounded-xl bg-[#EEF3FB] px-4 py-2 text-sm font-semibold text-navy"
              >
                {form.linked ? copy.disconnect : copy.connect}
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}
