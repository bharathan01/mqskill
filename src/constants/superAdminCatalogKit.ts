import {
  superAdminReferenceDate,
  type SuperAdminCatalogAction,
  type SuperAdminCatalogChart,
  type SuperAdminCatalogColumn,
  type SuperAdminCatalogFilter,
  type SuperAdminCatalogForm,
  type SuperAdminCatalogKpi,
  type SuperAdminCatalogMode,
  type SuperAdminCatalogPage,
  type SuperAdminCatalogRow,
  type SuperAdminColumnKind,
  type SuperAdminFaq,
  type SuperAdminRowActionId,
  type SuperAdminStatusAction,
} from './superAdminCatalogTypes'

/* ------------------------------------------------------------------ */
/* Deterministic sample-data helpers (Kuwait / GCC e-learning flavour) */
/* ------------------------------------------------------------------ */

export function pick<T>(pool: readonly T[], i: number, step = 1, offset = 0): T {
  return pool[(i * step + offset) % pool.length]
}

/** Deterministic pseudo-random integer in [min, max]. */
export function rnd(i: number, seed: number, min: number, max: number) {
  const n = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453)
  return min + Math.floor((n - Math.floor(n)) * (max - min + 1))
}

export function kwd(n: number, decimals = 0) {
  return `KWD ${n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export const num = (n: number) => n.toLocaleString('en-US')
export const pct = (n: number) => `${n}%`

function shiftDate(days: number) {
  const base = new Date(`${superAdminReferenceDate}T00:00:00Z`)
  base.setUTCDate(base.getUTCDate() + days)
  return base.toISOString().slice(0, 10)
}

/** Past date, newest first: i=0 is `offset` days ago. */
export const past = (i: number, step = 4, offset = 0) => shiftDate(-(i * step + offset))
/** Future date, soonest first. */
export const future = (i: number, step = 3, offset = 1) => shiftDate(i * step + offset)

export const courseCatalog = [
  { name: 'Fire Warden Training', category: 'Health & Safety', price: 85, hours: 8 },
  { name: 'ISO 9001:2015 Lead Auditor', category: 'Quality & ISO', price: 240, hours: 40 },
  { name: 'ISO 45001 OH&S Implementer', category: 'Quality & ISO', price: 210, hours: 24 },
  { name: 'ISO 14001 Environmental Management', category: 'Quality & ISO', price: 195, hours: 24 },
  { name: 'First Aid & CPR Certification', category: 'Health & Safety', price: 55, hours: 6 },
  { name: 'PMP Exam Preparation', category: 'Project Management', price: 320, hours: 35 },
  { name: 'Cybersecurity Awareness for Employees', category: 'IT & Security', price: 45, hours: 3 },
  { name: 'HSE Level 3 Supervisor', category: 'Health & Safety', price: 160, hours: 20 },
  { name: 'Anti-Money Laundering Essentials', category: 'Finance & Compliance', price: 120, hours: 10 },
  { name: 'Leadership & Team Management', category: 'Business Skills', price: 140, hours: 14 },
  { name: 'Excel for Business Analytics', category: 'Business Skills', price: 75, hours: 12 },
  { name: 'Customer Service Excellence', category: 'Business Skills', price: 60, hours: 6 },
  { name: 'Data Protection & Privacy Compliance', category: 'Finance & Compliance', price: 130, hours: 8 },
  { name: 'Lean Six Sigma Green Belt', category: 'Quality & ISO', price: 280, hours: 32 },
  { name: 'Working at Heights Safety', category: 'Health & Safety', price: 70, hours: 5 },
  { name: 'Food Safety HACCP Level 2', category: 'Health & Safety', price: 90, hours: 8 },
] as const

export const courseNames = courseCatalog.map((course) => course.name)
export const categories = [...new Set(courseCatalog.map((course) => course.category))]

export const orgs = [
  'ABC Corp',
  'Gulf Horizon Logistics',
  'Al-Sayer Contracting',
  'Kuwait Industrial Partners',
  'Salmiya Healthcare Group',
  'Burgan Engineering',
  'Arabian Gulf Hospitality',
  'Shuwaikh Marine Services',
  'Hawalli Education Trust',
  'Mina Abdullah Petrochem',
] as const

export const people = [
  'Fatima Al-Mutairi',
  'Abdullah Al-Rashid',
  'Noura Al-Enezi',
  'Yousef Al-Ajmi',
  'Mariam Al-Hajri',
  'Khalid Al-Dosari',
  'Sara Al-Kandari',
  'Omar Hassan',
  'Priya Nair',
  'Rahul Menon',
  'Maria Santos',
  'Ahmed Farouk',
  'Layla Mahmoud',
  'Hamad Al-Azmi',
  'Dana Al-Otaibi',
  'Salem Al-Shamsi',
  'Nasser Al-Harbi',
  'Reem Al-Qahtani',
  'Tariq Aziz',
  'Jose Ramirez',
] as const

export const countries = [
  'Kuwait',
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Bahrain',
  'Oman',
  'Egypt',
  'India',
  'Jordan',
  'Philippines',
] as const

export const instructors = [
  'Dr. Hessa Al-Sabah',
  'Eng. Bader Al-Failakawi',
  'Capt. Mubarak Al-Rushaid',
  'Dr. Aisha Karim',
  'Eng. Vikram Iyer',
  'Sarah Whitfield',
] as const

export const email = (name: string, domain = 'maqskillz.com') =>
  `${name.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, '.')}@${domain}`

export const orgDomain = (org: string) =>
  `${org.toLowerCase().replace(/[^a-z ]/g, '').split(' ').slice(0, 2).join('')}.com`

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

export type ColSpec = {
  key: string
  label: string
  gen: (i: number) => string | number
  kind: SuperAdminColumnKind
  editable: boolean
}

export function c(
  key: string,
  label: string,
  gen: (i: number) => string | number,
  kind: SuperAdminColumnKind = 'text',
  editable = true,
): ColSpec {
  return { key, label, gen, kind, editable }
}

type FilterSpec = string | { key: string; label?: string; options?: string[] }

export type ListSpec = {
  path: string
  title: string
  subtitle: string
  section: string
  /** Singular noun used in buttons and notices, e.g. "course". */
  entity: string
  cols: ColSpec[]
  count?: number
  mode?: SuperAdminCatalogMode
  badge?: string
  kpis?: SuperAdminCatalogKpi[]
  filters?: FilterSpec[]
  period?: string
  primary?: string | SuperAdminCatalogAction | false
  secondary?: string | SuperAdminCatalogAction | false
  rowActions?: SuperAdminRowActionId[]
  statusActions?: SuperAdminStatusAction[]
  chart?: SuperAdminCatalogChart
  note?: string
  selectable?: boolean
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toAction(
  value: string | SuperAdminCatalogAction | false | undefined,
  fallback: SuperAdminCatalogAction | undefined,
): SuperAdminCatalogAction | undefined {
  if (value === false) return undefined
  if (typeof value === 'string') return { ...(fallback ?? { kind: 'create' }), label: value }
  return value ?? fallback
}

export function buildList(spec: ListSpec): SuperAdminCatalogPage {
  const count = spec.count ?? 10
  const makeRows = (from: number, to: number): SuperAdminCatalogRow[] =>
    Array.from({ length: to - from }, (_, index) => {
      const i = from + index
      const values: Record<string, string> = {}
      for (const col of spec.cols) values[col.key] = String(col.gen(i))
      return { id: `${slug(spec.title).slice(0, 18)}-${i + 1}`, values }
    })

  const rows = makeRows(0, count)
  const spare = makeRows(count, count + 4)
  const everything = [...rows, ...spare]

  const unique = (key: string) => [...new Set(everything.map((row) => row.values[key]))].sort()

  const columns: SuperAdminCatalogColumn[] = spec.cols.map((col) => ({
    key: col.key,
    label: col.label,
    kind: col.kind,
    editable: col.editable,
    options: col.kind === 'status' ? unique(col.key) : [],
  }))

  const filters: SuperAdminCatalogFilter[] = (spec.filters ?? []).map((filter) => {
    const key = typeof filter === 'string' ? filter : filter.key
    const col = columns.find((column) => column.key === key)
    return {
      key,
      label: (typeof filter === 'string' ? undefined : filter.label) ?? col?.label ?? key,
      options: (typeof filter === 'string' ? undefined : filter.options) ?? unique(key),
    }
  })

  const statusKey = columns.find((column) => column.kind === 'status')?.key

  return {
    path: spec.path,
    title: spec.title,
    subtitle: spec.subtitle,
    section: spec.section,
    mode: spec.mode ?? 'list',
    entity: spec.entity,
    badge: spec.badge ?? 'Sample data',
    kpis: spec.kpis ?? [],
    columns,
    rows,
    spare,
    filters,
    periodKey: spec.period,
    statusKey,
    primary: toAction(
      spec.primary === undefined ? `Add ${spec.entity}` : spec.primary,
      { label: `Add ${spec.entity}`, kind: 'create' },
    ),
    secondary: toAction(
      spec.secondary === undefined ? 'Export' : spec.secondary,
      { label: 'Export', kind: 'sample' },
    ),
    rowActions: spec.rowActions ?? ['view', 'edit', 'archive'],
    statusActions: spec.statusActions ?? [],
    chart: spec.chart,
    note: spec.note,
    selectable: spec.selectable ?? true,
  }
}

export type FormSpec = {
  path: string
  title: string
  subtitle: string
  section: string
  entity: string
  form: Omit<SuperAdminCatalogForm, 'cancelLabel'> & { cancelLabel?: string }
  faq?: SuperAdminFaq[]
  badge?: string
}

export function buildForm(spec: FormSpec): SuperAdminCatalogPage {
  return {
    path: spec.path,
    title: spec.title,
    subtitle: spec.subtitle,
    section: spec.section,
    mode: 'form',
    entity: spec.entity,
    badge: spec.badge,
    kpis: [],
    columns: [],
    rows: [],
    spare: [],
    filters: [],
    rowActions: [],
    statusActions: [],
    selectable: false,
    form: { cancelLabel: 'Cancel', ...spec.form },
    faq: spec.faq,
  }
}

export const kpiCount = (label: string, delta?: string, key?: string, equals?: string): SuperAdminCatalogKpi => ({
  label,
  delta,
  tone: delta ? (delta.startsWith('−') || delta.startsWith('-') ? 'down' : 'up') : undefined,
  metric: { type: 'count', key, equals },
})

export const kpi = (
  label: string,
  value: string,
  delta?: string,
  tone?: 'up' | 'down' | 'flat',
): SuperAdminCatalogKpi => ({
  label,
  value,
  delta,
  tone: tone ?? (delta ? (delta.startsWith('−') || delta.startsWith('-') ? 'down' : 'up') : undefined),
})
