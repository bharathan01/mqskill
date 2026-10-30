import { useState } from 'react'
import {
  studentActiveCertificates,
  studentCertificatesPage as copy,
  studentExpiredCertificates,
} from '@/constants/studentCertificates'
import {
  AlertTriangleIcon,
  AwardIcon,
  BadgeCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FilterIcon,
  FlameIcon,
  HistoryIcon,
  InfoIcon,
  LockIcon,
  LockRefreshIcon,
  RefreshIcon,
  RepeatIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShieldIcon,
} from '@/components/ui'

const chipClass = {
  green: 'bg-emerald-50 text-emerald-700',
  slate: 'bg-slate-50 text-slate-500',
  red: 'bg-rose-50 text-rose-600',
  rose: 'bg-rose-50 text-rose-500',
}

const markIconClass = {
  shield: 'bg-brand text-white',
  repeat: 'bg-sky-100 text-brand',
  flame: 'bg-orange-100 text-orange-600',
  lock: 'bg-[#6B4F12] text-[#F4E6C3]',
}

function MarkIcon({ icon }: { icon: keyof typeof markIconClass }) {
  const className = `flex h-16 w-16 items-center justify-center rounded-2xl ${markIconClass[icon]}`
  if (icon === 'repeat') return <span className={className}><RepeatIcon className="h-8 w-8" /></span>
  if (icon === 'flame') return <span className={className}><FlameIcon className="h-8 w-8" /></span>
  if (icon === 'lock') return <span className={className}><LockRefreshIcon className="h-8 w-8" /></span>
  return <span className={className}><ShieldCheckIcon className="h-8 w-8" /></span>
}

function StatGlyph({ icon }: { icon: 'badge' | 'refresh' | 'award' }) {
  const wrap = 'flex h-10 w-10 items-center justify-center rounded-full'
  if (icon === 'refresh') {
    return (
      <span className={`${wrap} bg-amber-50 text-amber-500`}>
        <RefreshIcon className="h-5 w-5" />
      </span>
    )
  }
  if (icon === 'award') {
    return (
      <span className={`${wrap} bg-brand/10 text-brand`}>
        <AwardIcon className="h-5 w-5" />
      </span>
    )
  }
  return (
    <span className={`${wrap} bg-sky-50 text-brand`}>
      <BadgeCheckIcon className="h-5 w-5" />
    </span>
  )
}

export function StudentCertificatesPage() {
  const [tab, setTab] = useState<(typeof copy.tabs)[number]['id']>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const showActive = tab === 'all' || tab === 'active'
  const showExpired = tab === 'all' || tab === 'expired'

  function copyId(id: string) {
    void navigator.clipboard.writeText(id)
    setCopiedId(id)
    window.setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current))
    }, 1600)
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white bg-[linear-gradient(115deg,#F4FBFF_0%,#E9F8F3_42%,#EEF3FF_100%)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              {copy.kicker}
              <span className="inline-flex items-center gap-1 font-medium tracking-normal text-emerald-600 normal-case">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                {copy.synced}
              </span>
            </p>
            <h1 className="mt-3 font-hero text-4xl font-bold text-navy">{copy.title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy"
            >
              <DownloadIcon className="h-4 w-4" />
              {copy.transcript}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
            >
              <ShieldIcon className="h-4 w-4" />
              {copy.profileHub}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.stats.map((stat) => (
            <article key={stat.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {stat.kicker}
                </p>
                <StatGlyph icon={stat.icon} />
              </div>
              <p className="mt-3 text-4xl font-bold text-navy">
                {stat.value}
                {'suffix' in stat && stat.suffix ? (
                  <span className="ml-1 text-base font-semibold text-slate-400">{stat.suffix}</span>
                ) : null}
              </p>
              {'chips' in stat && stat.chips ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {stat.chips.map((chip) => (
                    <span
                      key={chip.label}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${chipClass[chip.tone]}`}
                    >
                      {chip.dot ? (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            chip.tone === 'green' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      ) : null}
                      {chip.label}
                    </span>
                  ))}
                </div>
              ) : null}
              {'progress' in stat && stat.progress ? (
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-slate-500">{stat.progressLabel}</span>
                    <span className="font-semibold text-brand">{stat.progressHint}</span>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {copy.tabs.map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  active ? 'bg-navy text-white' : 'bg-white text-slate-500 shadow-sm'
                }`}
              >
                {item.label}
                <span
                  className={`text-xs ${active ? 'text-white/70' : 'text-slate-400'}`}
                >
                  {item.count}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-600"
        >
          <FilterIcon className="h-4 w-4" />
          {copy.sortLabel}
        </button>
      </div>

      {showActive ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-bold text-navy">{copy.activeTitle}</h2>
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                {copy.activeCount}
              </span>
            </div>
            <p className="text-xs text-slate-400">{copy.signed}</p>
          </div>

          {studentActiveCertificates.map((cert) => (
            <article
              key={cert.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
                <div className="flex flex-col bg-[linear-gradient(180deg,#EEF6FF_0%,#F7FBFF_100%)] p-5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      {cert.badge}
                    </span>
                    <span className="font-semibold text-slate-400">{cert.cpd}</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <MarkIcon icon={cert.icon} />
                    <p className="mt-4 text-sm font-bold text-navy">{cert.markTitle}</p>
                    <p className="mt-1 text-xs text-slate-400">{cert.markSubtitle}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                        {cert.credentialLabel}
                      </p>
                      <p className="text-sm font-semibold text-navy">{cert.credentialId}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Copy ${cert.credentialId}`}
                      title={copiedId === cert.credentialId ? copy.copied : cert.credentialId}
                      onClick={() => copyId(cert.credentialId)}
                      className="text-slate-400 hover:text-navy"
                    >
                      {copiedId === cert.credentialId ? (
                        <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-[11px] font-semibold tracking-wide text-brand uppercase">
                      {cert.track}
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="font-medium text-slate-400 normal-case tracking-normal">
                        {cert.level}
                      </span>
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        <span className="block text-[10px] font-medium">{cert.validLabel}</span>
                        <span className="text-sm font-bold">{cert.validDate}</span>
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-navy">{cert.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{cert.description}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cert.meta.map((item) => (
                      <div key={item.label}>
                        <p className="text-[11px] font-medium text-slate-400">{item.label}</p>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            item.tone === 'brand' ? 'text-brand' : 'text-navy'
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <EyeIcon className="h-4 w-4" />
                      {copy.viewCertificate}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      {copy.downloadPdf}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy"
                    >
                      <ShareIcon className="h-4 w-4" />
                      {copy.shareLink}
                    </button>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <CheckCircleIcon className="h-4 w-4" />
                    {copy.blockchain}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {showExpired ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-700" />
              <h2 className="text-lg font-bold text-navy">{copy.expiredTitle}</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                {copy.expiredCount}
              </span>
            </div>
            <p className="text-xs font-medium text-amber-700">{copy.graceNote}</p>
          </div>

          {studentExpiredCertificates.map((cert) => (
            <article
              key={cert.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
                <div className="flex flex-col bg-[linear-gradient(180deg,#FBF4EA_0%,#F8F4EE_100%)] p-5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                      <AlertTriangleIcon className="h-4 w-4" />
                      {cert.badge}
                    </span>
                    <span className="font-semibold text-slate-500">
                      {cert.cpd}{' '}
                      <span className="font-medium text-amber-700">{cert.cpdHold}</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <MarkIcon icon={cert.icon} />
                    <p className="mt-4 text-sm font-bold text-navy">{cert.markTitle}</p>
                    <p className="mt-1 text-xs text-slate-400">{cert.markSubtitle}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-100 bg-white px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                        {cert.credentialLabel}
                      </p>
                      <p className="text-sm font-semibold text-navy">{cert.credentialId}</p>
                    </div>
                    <HistoryIcon className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-[11px] font-semibold tracking-wide text-amber-800 uppercase">
                      {cert.track}
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="font-medium text-slate-400 normal-case tracking-normal">
                        {cert.level}
                      </span>
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-rose-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        <span className="block text-[10px] font-medium">{cert.statusLabel}</span>
                        <span className="text-sm font-bold">{cert.statusValue}</span>
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-navy">{cert.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{cert.description}</p>
                  <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-[#EEF4FF] p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                        <InfoIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-navy">{cert.calloutTitle}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{cert.calloutBody}</p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-amber-700 sm:pt-1">
                      {cert.feeLabel} {cert.feeValue}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <RefreshIcon className="h-4 w-4" />
                      {copy.renew}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy"
                    >
                      <FileIcon className="h-4 w-4" />
                      {copy.recertify}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500"
                  >
                    <HistoryIcon className="h-4 w-4" />
                    {copy.historical}
                  </button>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                    <LockIcon className="h-4 w-4" />
                    {copy.frozen}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  )
}
