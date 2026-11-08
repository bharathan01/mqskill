import { useState } from 'react'
import { certificateModalCopy, type CertificateView } from '@/constants'
import { CloseIcon, DownloadIcon, GraduationCapIcon, QrCodeIcon } from '@/components/ui'

type CertificateModalProps = {
  certificate: CertificateView
  onClose: () => void
}

function downloadCertificate(certificate: CertificateView) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${certificate.credentialId}</title>
  <style>
    body { font-family: Georgia, serif; color: #0f284f; padding: 40px; }
    .card { border: 3px solid #2563eb; padding: 32px; max-width: 720px; margin: 0 auto; }
    .eyebrow { color: #2563eb; letter-spacing: 0.16em; text-transform: uppercase; font-size: 12px; font-weight: 700; }
    .muted { color: #64748b; }
    h1 { font-size: 36px; margin: 8px 0 16px; }
    h2 { font-size: 28px; margin: 8px 0 16px; }
    .meta { display: flex; gap: 32px; margin-top: 40px; font-size: 12px; }
    .meta strong { display: block; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <p class="eyebrow">${certificateModalCopy.heading}</p>
    <p class="muted">${certificateModalCopy.certifies}</p>
    <h1>${certificate.recipientName}</h1>
    <p class="muted">${certificateModalCopy.completed}</p>
    <h2>${certificate.courseTitle}</h2>
    <p class="muted">${certificateModalCopy.accredited(certificate.cpdHours)}</p>
    <div class="meta">
      <div><strong>${certificateModalCopy.issued}</strong>${certificate.issuedOn}</div>
      <div><strong>${certificateModalCopy.validUntil}</strong>${certificate.validUntil}</div>
      <div><strong>${certificateModalCopy.credentialId}</strong>${certificate.credentialId}</div>
    </div>
  </div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${certificate.credentialId}.html`
  link.click()
  URL.revokeObjectURL(url)
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [toast, setToast] = useState('')

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {toast ? (
        <div className="fixed top-20 right-6 z-[90] rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
      <button
        type="button"
        aria-label="Close certificate"
        className="absolute inset-0 bg-slate-900/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-base font-bold text-navy">{certificateModalCopy.title}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                downloadCertificate(certificate)
                setToast(certificateModalCopy.downloadedToast)
                window.setTimeout(() => setToast(''), 2000)
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <DownloadIcon className="h-4 w-4" />
              {certificateModalCopy.download}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-[#F4F6FB] p-4 sm:p-6">
          <div className="rounded-sm border-[3px] border-brand bg-white p-1">
            <div className="border border-brand/40 px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
                    <GraduationCapIcon className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-bold text-navy">
                    {certificateModalCopy.brand}
                  </span>
                </div>
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-navy text-center text-white">
                  <span className="text-[10px] font-semibold tracking-wide">
                    {certificateModalCopy.cpd}
                  </span>
                  <span className="text-xs font-bold">
                    {certificateModalCopy.hours(certificate.cpdHours)}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-center sm:mt-10">
                <p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase">
                  {certificateModalCopy.heading}
                </p>
                <p className="mt-5 text-sm text-slate-500">{certificateModalCopy.certifies}</p>
                <h3 className="mt-2 font-serif text-3xl font-bold text-navy sm:text-4xl">
                  {certificate.recipientName}
                </h3>
                <p className="mt-4 text-sm text-slate-500">{certificateModalCopy.completed}</p>
                <p className="mt-2 text-xl font-bold text-navy sm:text-2xl">
                  {certificate.courseTitle}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {certificateModalCopy.accredited(certificate.cpdHours)}
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-8">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                      {certificateModalCopy.issued}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy">{certificate.issuedOn}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                      {certificateModalCopy.validUntil}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy">{certificate.validUntil}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                      {certificateModalCopy.credentialId}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy">
                      {certificate.credentialId}
                    </p>
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center self-end rounded-lg bg-slate-100 text-navy sm:self-auto">
                  <QrCodeIcon className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            {certificateModalCopy.close}
          </button>
        </div>
      </div>
    </div>
  )
}
