import { employeeUser } from './employee'
import { buildCredentialId } from './certificate'
import { paths } from '@/routes/paths'

export type EmployeeCertificateStatus = 'valid' | 'expiring' | 'expired'

export type EmployeeCertificate = {
  id: string
  courseTitle: string
  status: EmployeeCertificateStatus
  cpdHours: number
  finalScore: number
  issuedOn: string
  validUntil: string
  credentialId: string
  organization: string
  accredited: boolean
  courseId?: string
}

export const employeeCertificatesPage = {
  title: 'Certificates & CPD',
  subtitle: 'Download accredited certificates and track your CPD hours.',
  stats: {
    earned: 'Certificates earned',
    cpd: 'CPD hours',
    valid: 'Valid',
    expiring: 'Expiring soon',
  },
  filters: {
    all: 'All',
    valid: 'Valid',
    expiring: 'Expiring',
    expired: 'Expired',
  },
  status: {
    valid: 'Valid',
    expiring: 'Expiring soon',
    expired: 'Expired',
  } satisfies Record<EmployeeCertificateStatus, string>,
  accredited: 'CPD accredited',
  view: 'View certificate',
  download: 'Download PDF',
  empty: 'No certificates in this view.',
  issued: 'Issued',
  expires: 'Expires',
  hours: (value: number) => `${value} CPD hrs`,
  showing: 'Showing',
  of: 'of',
  certificates: 'certificates',
} as const

export const employeeCertificateDetailPage = {
  back: 'Back to Certificates & CPD',
  previewLabel: 'Preview · A4 landscape PDF',
  zoom: '100%',
  valid: 'Valid',
  expired: 'Expired',
  expiring: 'Expiring soon',
  accredited: 'CPD accredited',
  downloadPdf: 'Download PDF',
  shareLinkedIn: 'Share to LinkedIn',
  copyLink: 'Copy verification link',
  details: 'Details',
  organization: 'Organization',
  cpdHours: 'CPD hours',
  finalScore: 'Final score',
  issued: 'Issued',
  expires: 'Expires',
  credentialId: 'Credential ID',
  expiryWarning:
    'After the expiry date this certificate can no longer be downloaded. Save a copy for your records.',
  downloadedToast: 'Certificate downloaded.',
  sharedToast: 'Opening LinkedIn share…',
  copiedToast: 'Verification link copied.',
  heading: 'Certificate of completion',
  certifies: 'This certifies that',
  completed: 'has successfully completed',
  accreditedLine: (hours: number) =>
    `${hours} CPD hours · Accredited by The CPD Certification Service`,
  brand: 'MaqSkillz',
  cpdBadge: (hours: number) => `CPD ${hours} hrs`,
} as const

export const employeeCertificates: EmployeeCertificate[] = [
  {
    id: 'cert-whs',
    courseTitle: 'Workplace Compliance Essentials',
    status: 'valid',
    cpdHours: 10,
    finalScore: 85,
    issuedOn: '18 Oct 2026',
    validUntil: '18 Oct 2028',
    credentialId: 'MS-CPD-2026-00127',
    organization: 'ABC Corporation',
    accredited: true,
    courseId: 'whs',
  },
  {
    id: 'cert-aml',
    courseTitle: 'Anti-Money Laundering Essentials',
    status: 'valid',
    cpdHours: 6,
    finalScore: 92,
    issuedOn: '20 Oct 2026',
    validUntil: '20 Oct 2028',
    credentialId: buildCredentialId('aml-2026'),
    organization: 'ABC Corporation',
    accredited: true,
    courseId: 'aml',
  },
  {
    id: 'cert-iso',
    courseTitle: 'ISO 9001:2015 Quality Management Awareness',
    status: 'expiring',
    cpdHours: 6,
    finalScore: 88,
    issuedOn: '12 Jan 2025',
    validUntil: '12 Dec 2026',
    credentialId: buildCredentialId('iso-2025'),
    organization: 'ABC Corporation',
    accredited: true,
    courseId: 'iso-9001',
  },
  {
    id: 'cert-fire',
    courseTitle: 'Fire Safety Awareness',
    status: 'expired',
    cpdHours: 4,
    finalScore: 80,
    issuedOn: '5 Mar 2024',
    validUntil: '5 Mar 2026',
    credentialId: buildCredentialId('fire-2024'),
    organization: 'ABC Corporation',
    accredited: true,
  },
  {
    id: 'cert-comm',
    courseTitle: 'Professional Communication Skills',
    status: 'valid',
    cpdHours: 5,
    finalScore: 91,
    issuedOn: '2 Sep 2026',
    validUntil: '2 Sep 2028',
    credentialId: buildCredentialId('comm-2026'),
    organization: 'ABC Corporation',
    accredited: true,
  },
]

export const employeeCertificateStats = {
  earned: employeeCertificates.length,
  cpdHours: employeeCertificates
    .filter((item) => item.status !== 'expired')
    .reduce((sum, item) => sum + item.cpdHours, 0),
  valid: employeeCertificates.filter((item) => item.status === 'valid').length,
  expiring: employeeCertificates.filter((item) => item.status === 'expiring').length,
}

export function getEmployeeCertificate(certificateId: string) {
  return employeeCertificates.find((item) => item.id === certificateId)
}

export function employeeCertificatePath(certificateId: string) {
  return `${paths.employee.certificates}/${certificateId}`
}

export function employeeCertificateView(certificate: EmployeeCertificate) {
  return {
    recipientName: employeeUser.name,
    courseTitle: certificate.courseTitle,
    issuedOn: certificate.issuedOn,
    validUntil: certificate.validUntil,
    credentialId: certificate.credentialId,
    cpdHours: certificate.cpdHours,
  }
}

export function employeeCertificateVerifyUrl(credentialId: string) {
  return `https://maqskillz.com/verify/${credentialId}`
}
