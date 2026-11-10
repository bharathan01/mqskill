export type SuperAdminCatalogMode = 'list' | 'analytics' | 'form'

export type SuperAdminColumnKind = 'text' | 'status' | 'money' | 'number' | 'percent' | 'date'

export type SuperAdminCatalogColumn = {
  key: string
  label: string
  kind: SuperAdminColumnKind
  /** Column can be changed in create/edit modals. Defaults to true. */
  editable: boolean
  /** Choices for status/select style columns (derived from sample rows). */
  options: string[]
}

export type SuperAdminCatalogRow = {
  id: string
  values: Record<string, string>
}

export type SuperAdminCatalogFilter = {
  key: string
  label: string
  options: string[]
}

export type SuperAdminKpiMetric =
  | { type: 'count'; key?: string; equals?: string }
  | { type: 'sum'; key: string; prefix?: string; suffix?: string; decimals?: number }
  | { type: 'avg'; key: string; prefix?: string; suffix?: string; decimals?: number }

export type SuperAdminCatalogKpi = {
  label: string
  value?: string
  delta?: string
  tone?: 'up' | 'down' | 'flat'
  /** When present the KPI is computed from the live rows (updates after create/delete). */
  metric?: SuperAdminKpiMetric
}

export type SuperAdminRowActionId = 'view' | 'edit' | 'duplicate' | 'export' | 'archive' | 'delete'

export type SuperAdminStatusAction = {
  label: string
  /** Status written to the row when the action is clicked. */
  to: string
  /** Only offer the action while the row status is one of these. */
  from?: string[]
  /** Remove the row from this list after applying (e.g. restore from archive). */
  remove?: boolean
  /** Custom feedback, `{name}` is replaced by the row title. */
  notice?: string
}

export type SuperAdminCatalogAction = {
  label: string
  /** `statusAll` sets every row's status to `to` (e.g. "Mark all as read"). */
  kind: 'create' | 'sample' | 'statusAll' | 'navigate'
  /** Route to open when `kind` is `navigate`. */
  href?: string
  to?: string
  notice?: string
}

export type SuperAdminCatalogChart = {
  title: string
  labelKey: string
  valueKey: string
  note?: string
}

export type SuperAdminFormFieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'password'
  | 'number'
  | 'date'
  | 'time'
  | 'textarea'
  | 'select'
  | 'toggle'

export type SuperAdminFormField = {
  key: string
  label: string
  type: SuperAdminFormFieldType
  options?: string[]
  required?: boolean
  placeholder?: string
  hint?: string
  default?: string
  wide?: boolean
}

export type SuperAdminFormSection = {
  title: string
  description?: string
  fields: SuperAdminFormField[]
}

export type SuperAdminFormRecord = {
  id: string
  values: Record<string, string>
}

export type SuperAdminCatalogForm = {
  sections: SuperAdminFormSection[]
  submitLabel: string
  cancelLabel: string
  successNotice: string
  /** 'create' forms append to a local "recent" list, 'settings' forms only save. */
  kind: 'create' | 'settings'
  recordsTitle?: string
  recordColumns?: { key: string; label: string }[]
  records?: SuperAdminFormRecord[]
  validate?: (values: Record<string, string>) => Record<string, string>
}

export type SuperAdminFaq = { q: string; a: string }

export type SuperAdminCatalogPage = {
  path: string
  title: string
  subtitle: string
  section: string
  mode: SuperAdminCatalogMode
  entity: string
  badge?: string
  kpis: SuperAdminCatalogKpi[]
  columns: SuperAdminCatalogColumn[]
  rows: SuperAdminCatalogRow[]
  /** Extra generated rows consumed by "sample" primary actions. */
  spare: SuperAdminCatalogRow[]
  filters: SuperAdminCatalogFilter[]
  /** Date column used by the period filter. */
  periodKey?: string
  statusKey?: string
  primary?: SuperAdminCatalogAction
  secondary?: SuperAdminCatalogAction
  rowActions: SuperAdminRowActionId[]
  statusActions: SuperAdminStatusAction[]
  chart?: SuperAdminCatalogChart
  form?: SuperAdminCatalogForm
  faq?: SuperAdminFaq[]
  note?: string
  /** Hide row selection + bulk actions (read-only analytics). */
  selectable: boolean
}

/** Reference "today" for the sample data set. */
export const superAdminReferenceDate = '2026-11-10'
