import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import {
  employeeCertificateDetailPage,
  employeeCertificateVerifyUrl,
  employeeCertificateView,
  employeeUser,
  getEmployeeCertificate,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  ChevronLeftIcon,
  DownloadIcon,
  GraduationCapIcon,
  LinkIcon,
  QrCodeIcon,
  SearchIcon,
  ShareIcon,
} from '@/components/ui'

const copy = employeeCertificateDetailPage

function downloadCertificatePdf(certificateId: string, courseTitle: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${certificateId}</title></head><body><h1>${courseTitle}</h1><p>${certificateId}</p></body></html>`
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${certificateId}.html`
  link.click()
  URL.revokeObjectURL(url)
}

export function EmployeeCertificateDetailPage() {
  const { certificateId = '' } = useParams()
  const found = getEmployeeCertificate(certificateId)
  const [toast, setToast] = useState('')

  if (!found) {
    return <Navigate to={paths.employee.certificates} replace />
  }

  const certificate = found
  const view = employeeCertificateView(certificate)
  const statusLabel =
    certificate.status === 'valid'
      ? copy.valid
      : certificate.status === 'expiring'
        ? copy.expiring
        : copy.expired
  const statusClass =
    certificate.status === 'valid'
      ? 'bg-emerald-50 text-emerald-700'
      : certificate.status === 'expiring'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-100 text-slate-500'

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  async function copyVerificationLink() {
    const url = employeeCertificateVerifyUrl(certificate.credentialId)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore clipboard failures in restricted contexts
    }
    showToast(copy.copiedToast)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.employee.certificates}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-[#F4F6FB] p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
            <div className="rounded-sm border-[3px] border-brand bg-white p-1">
              <div className="border border-brand/40 px-5 py-6 sm:px-8 sm:py-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
                      <GraduationCapIcon className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-bold text-navy">{copy.brand}</span>
                  </div>
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-navy text-center text-white">
                    <span className="text-[10px] font-semibold tracking-wide">CPD</span>
                    <span className="text-xs font-bold">{certificate.cpdHours} hrs</span>
                  </div>
                </div>

                <div className="mt-8 text-center sm:mt-10">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase">
                    {copy.heading}
                  </p>
                  <p className="mt-5 text-sm text-slate-500">{copy.certifies}</p>
                  <h1 className="mt-2 font-serif text-3xl font-bold text-navy sm:text-4xl">
                    {employeeUser.name}
                  </h1>
                  <p className="mt-4 text-sm text-slate-500">{copy.completed}</p>
                  <p className="mt-2 text-xl font-bold text-navy sm:text-2xl">
                    {certificate.courseTitle}
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    {copy.accreditedLine(certificate.cpdHours)}
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
                  <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-8">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                        Issued
                      </p>
                      <p className="mt-1 text-sm font-semibold text-navy">{view.issuedOn}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                        Valid until
                      </p>
                      <p className="mt-1 text-sm font-semibold text-navy">{view.validUntil}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                        Credential ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-navy">{view.credentialId}</p>
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center self-end rounded-lg bg-slate-100 text-navy sm:self-auto">
                    <QrCodeIcon className="h-10 w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-1 text-sm text-slate-500">
            <span>{copy.previewLabel}</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
              <SearchIcon className="h-3.5 w-3.5" />
              {copy.zoom}
            </span>
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    certificate.status === 'valid'
                      ? 'bg-emerald-500'
                      : certificate.status === 'expiring'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                  }`}
                />
                {statusLabel}
              </span>
              {certificate.accredited ? (
                <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
                  {copy.accredited}
                </span>
              ) : null}
            </div>
            <h2 className="mt-3 text-lg font-bold text-navy">{certificate.courseTitle}</h2>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={certificate.status === 'expired'}
                onClick={() => {
                  downloadCertificatePdf(certificate.credentialId, certificate.courseTitle)
                  showToast(copy.downloadedToast)
                }}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <DownloadIcon className="h-4 w-4" />
                {copy.downloadPdf}
              </button>
              <button
                type="button"
                onClick={() => showToast(copy.sharedToast)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ShareIcon className="h-4 w-4" />
                {copy.shareLinkedIn}
              </button>
              <button
                type="button"
                onClick={() => void copyVerificationLink()}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LinkIcon className="h-4 w-4" />
                {copy.copyLink}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h3 className="text-sm font-bold text-navy">{copy.details}</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">{copy.organization}</dt>
                <dd className="text-right font-semibold text-navy">{certificate.organization}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">{copy.cpdHours}</dt>
                <dd className="text-right font-semibold text-navy">
                  {certificate.cpdHours.toFixed(1)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">{copy.finalScore}</dt>
                <dd className="text-right font-semibold text-navy">{certificate.finalScore}%</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">{copy.issued}</dt>
                <dd className="text-right font-semibold text-navy">{certificate.issuedOn}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">{copy.expires}</dt>
                <dd className="text-right font-semibold text-navy">{certificate.validUntil}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-slate-400">{copy.credentialId}</dt>
                <dd className="text-right font-mono text-xs font-semibold text-navy">
                  {certificate.credentialId}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {copy.expiryWarning}
          </div>
        </aside>
      </div>
    </div>
  )
}
