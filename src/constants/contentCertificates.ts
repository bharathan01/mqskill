export type CertificateTemplateLayout = 'classic' | 'modern' | 'minimal' | 'badge'
export type CertificateTemplateStatus = 'active' | 'draft'

export type CertificateTemplate = {
  id: string
  name: string
  description: string
  layout: CertificateTemplateLayout
  status: CertificateTemplateStatus
  /** Tailwind gradient classes used for the preview accent. */
  accent: string
  /** Hex accent for borders / seal in the preview. */
  color: string
  orientation: 'Landscape' | 'Portrait'
  courses: number
  updated: string
  isDefault: boolean
}

export const contentCertificatesPage = {
  title: 'Certificate Templates',
  subtitle: 'Design and manage the certificates learners receive when they complete a course.',
  create: 'New Template',
  searchPlaceholder: 'Search templates…',
  allStatuses: 'All statuses',
  allLayouts: 'All layouts',
  status: { active: 'Active', draft: 'Draft' },
  layouts: {
    classic: 'Classic',
    modern: 'Modern',
    minimal: 'Minimal',
    badge: 'Badge',
  },
  defaultBadge: 'Default',
  usedBy: 'courses',
  updated: 'Updated',
  actions: {
    edit: 'Edit',
    use: 'Use template',
    preview: 'Preview',
    duplicate: 'Duplicate',
    setDefault: 'Set as default',
  },
  useNotice: 'is now applied to the selected course.',
  duplicateNotice: 'duplicated as a draft.',
  defaultNotice: 'is now the default certificate template.',
  editNotice: 'opened for editing.',
  createNotice: 'New draft template created.',
  previewTitle: 'Template preview',
  closePreview: 'Close preview',
  previewCertify: 'This is to certify that',
  previewName: 'Alex Johnson',
  previewCompleted: 'has successfully completed',
  previewCourse: 'Workplace Safety Fundamentals',
  previewDate: 'Issued on Nov 10, 2026',
  previewId: 'Credential ID: MSK-2026-0001',
  certificateOf: 'Certificate of Completion',
  emptyTitle: 'No templates found',
  emptyBody: 'Try a different search or clear the filters.',
  clearFilters: 'Clear filters',
  applyTo: 'Apply to course',
  chooseCourse: 'Choose a course…',
  courses: [
    'Workplace Safety Fundamentals',
    'Data Protection for Teams',
    'Leadership Essentials',
    'Cybersecurity for Everyone',
  ],
  cancel: 'Cancel',
  confirm: 'Apply template',
} as const

export const contentCertificateTemplates: CertificateTemplate[] = [
  {
    id: 'tpl-classic-blue',
    name: 'Classic Blue',
    description: 'Formal border with seal, suited to accredited and CPD courses.',
    layout: 'classic',
    status: 'active',
    accent: 'from-[#004ea8] to-[#0b7bd6]',
    color: '#004ea8',
    orientation: 'Landscape',
    courses: 14,
    updated: 'Nov 8, 2026',
    isDefault: true,
  },
  {
    id: 'tpl-modern-teal',
    name: 'Modern Teal',
    description: 'Clean contemporary layout with a bold colour band.',
    layout: 'modern',
    status: 'active',
    accent: 'from-teal-600 to-emerald-500',
    color: '#0d9488',
    orientation: 'Landscape',
    courses: 9,
    updated: 'Nov 3, 2026',
    isDefault: false,
  },
  {
    id: 'tpl-minimal-slate',
    name: 'Minimal Slate',
    description: 'Understated typography-first design for internal training.',
    layout: 'minimal',
    status: 'active',
    accent: 'from-slate-700 to-slate-500',
    color: '#334155',
    orientation: 'Portrait',
    courses: 5,
    updated: 'Oct 26, 2026',
    isDefault: false,
  },
  {
    id: 'tpl-badge-violet',
    name: 'Achievement Badge',
    description: 'Badge-style certificate with credential QR code.',
    layout: 'badge',
    status: 'draft',
    accent: 'from-violet-600 to-fuchsia-500',
    color: '#7c3aed',
    orientation: 'Landscape',
    courses: 0,
    updated: 'Oct 20, 2026',
    isDefault: false,
  },
  {
    id: 'tpl-classic-gold',
    name: 'Executive Gold',
    description: 'Premium gold-accent certificate for leadership programmes.',
    layout: 'classic',
    status: 'active',
    accent: 'from-amber-600 to-yellow-500',
    color: '#b45309',
    orientation: 'Landscape',
    courses: 3,
    updated: 'Oct 14, 2026',
    isDefault: false,
  },
  {
    id: 'tpl-modern-rose',
    name: 'Modern Rose',
    description: 'Warm, friendly layout for soft-skills courses.',
    layout: 'modern',
    status: 'draft',
    accent: 'from-rose-600 to-orange-500',
    color: '#e11d48',
    orientation: 'Portrait',
    courses: 0,
    updated: 'Oct 9, 2026',
    isDefault: false,
  },
]
