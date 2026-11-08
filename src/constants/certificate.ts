export type CertificateView = {
  recipientName: string
  courseTitle: string
  issuedOn: string
  validUntil: string
  credentialId: string
  cpdHours: number
}

export const certificateModalCopy = {
  title: 'Certificate of completion',
  heading: 'Certificate of completion',
  certifies: 'This certifies that',
  completed: 'has successfully completed',
  accredited: (hours: number) =>
    `${hours} CPD hours · Accredited by The CPD Certification Service`,
  issued: 'Issued',
  validUntil: 'Valid until',
  credentialId: 'Credential ID',
  brand: 'MaqSkillz',
  cpd: 'CPD',
  hours: (hours: number) => `${hours} hrs`,
  close: 'Close',
  download: 'Download',
  downloadedToast: 'Certificate downloaded.',
} as const

export function buildCredentialId(seed: string) {
  const digits = seed.replace(/\D/g, '').padStart(5, '0').slice(-5)
  return `MS-CPD-2026-${digits}`
}
