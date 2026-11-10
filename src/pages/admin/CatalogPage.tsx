import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  ContentBadge,
  ContentEmptyState,
  ContentField,
  ContentNotice,
  ContentSelect,
  ContentTextInput,
} from '@/components/common'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  CheckIcon,
  FolderIcon,
} from '@/components/ui'
import {
  getSuperAdminCatalogPage,
  type SuperAdminCatalogColumn,
  type SuperAdminCatalogKpi,
  type SuperAdminCatalogPage,
  type SuperAdminCatalogRow,
  type SuperAdminStatusAction,
} from '@/constants'
import { paths } from '@/routes/paths'
import { CatalogFormView } from './CatalogFormView'
import { KpiCard, Modal, StatusBadge } from './catalogShared'
import { btnDanger, btnOutline, btnPrimary, cardClass, compareValues, downloadCsv, formatCell, inPeriod, parseNumber, periodOptions, slugify, type PeriodId } from './catalogUtils'

const PAGE_SIZE = 10

/** Session-level store so edits survive navigating between admin screens. */
const rowStore = new Map<string, SuperAdminCatalogRow[]>()
const spareStore = new Map<string, number>()
let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

type Notice = { tone: 'green' | 'amber' | 'blue'; text: string }

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; row: SuperAdminCatalogRow }
  | { type: 'confirm'; ids: string[]; mode: 'archive' | 'delete' }
  | null

type MenuState = { id: string; top: number; left: number } | null

function computeKpi(kpi: SuperAdminCatalogKpi, rows: SuperAdminCatalogRow[]) {
  const metric = kpi.metric
  if (!metric) return kpi.value ?? '—'
  if (metric.type === 'count') {
    const count = metric.key
      ? rows.filter((row) => row.values[metric.key as string] === metric.equals).length
      : rows.length
    return count.toLocaleString('en-US')
  }
  const values = rows.map((row) => parseNumber(row.values[metric.key] ?? '')).filter((n): n is number => n !== null)
  if (values.length === 0) return '—'
  const total = values.reduce((sum, n) => sum + n, 0)
  const result = metric.type === 'sum' ? total : total / values.length
  const text = result.toLocaleString('en-US', {
    minimumFractionDigits: metric.decimals ?? 0,
    maximumFractionDigits: metric.decimals ?? 0,
  })
  return `${metric.prefix ?? ''}${text}${metric.suffix ?? ''}`
}

function rowTitle(page: SuperAdminCatalogPage, row: SuperAdminCatalogRow) {
  const first = page.columns[0]
  return first ? row.values[first.key] || page.entity : page.entity
}

/* ------------------------------ list view -------------------------------- */

function CatalogListView({ page }: { page: SuperAdminCatalogPage }) {
  const navigate = useNavigate()
  const [rows, setRowsState] = useState<SuperAdminCatalogRow[]>(() => rowStore.get(page.path) ?? page.rows)
  const [query, setQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [period, setPeriod] = useState<PeriodId>('all')
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [notice, setNotice] = useState<Notice | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [menu, setMenu] = useState<MenuState>(null)
  const [viewing, setViewing] = useState<SuperAdminCatalogRow | null>(null)

  function setRows(next: SuperAdminCatalogRow[]) {
    rowStore.set(page.path, next)
    setRowsState(next)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = rows.filter((row) => {
      if (q && !Object.values(row.values).join(' ').toLowerCase().includes(q)) return false
      for (const filter of page.filters) {
        const chosen = filterValues[filter.key]
        if (chosen && chosen !== 'All' && row.values[filter.key] !== chosen) return false
      }
      if (page.periodKey && !inPeriod(row.values[page.periodKey] ?? '', period)) return false
      return true
    })
    if (sort) {
      const { key, dir } = sort
      result = [...result].sort((a, b) => compareValues(a.values[key] ?? '', b.values[key] ?? '', dir))
    }
    return result
  }, [rows, query, filterValues, period, sort, page.filters, page.periodKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(pageIndex, totalPages - 1)
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)
  const hasActiveFilters =
    query.trim() !== '' ||
    period !== 'all' ||
    Object.values(filterValues).some((value) => value && value !== 'All')

  const statusColumn = page.columns.find((column) => column.key === page.statusKey)
  const canSelect = page.selectable
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.id))

  function clearFilters() {
    setQuery('')
    setFilterValues({})
    setPeriod('all')
    setPageIndex(0)
  }

  function toggleSort(key: string) {
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: 'asc' }
      return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
    })
    setPageIndex(0)
  }

  function openMenu(event: React.MouseEvent<HTMLButtonElement>, id: string) {
    const rect = event.currentTarget.getBoundingClientRect()
    const menuWidth = 208
    setMenu({
      id,
      top: Math.min(rect.bottom + 4, window.innerHeight - 320),
      left: Math.max(8, rect.right - menuWidth),
    })
  }

  function exportRows(list: SuperAdminCatalogRow[], label: string) {
    downloadCsv(`${slugify(page.title)}-${slugify(label)}.csv`, page.columns, list)
    setNotice({
      tone: 'green',
      text: `Exported ${list.length} ${list.length === 1 ? page.entity : `${page.entity} records`} from ${page.title} to CSV (sample).`,
    })
  }

  function applyStatus(row: SuperAdminCatalogRow, action: SuperAdminStatusAction) {
    const key = page.statusKey
    if (!key) return
    const name = rowTitle(page, row)
    if (action.remove) {
      setRows(rows.filter((item) => item.id !== row.id))
      setSelected((current) => {
        const next = new Set(current)
        next.delete(row.id)
        return next
      })
    } else {
      setRows(rows.map((item) => (item.id === row.id ? { ...item, values: { ...item.values, [key]: action.to } } : item)))
    }
    if (viewing?.id === row.id) {
      setViewing(action.remove ? null : { ...row, values: { ...row.values, [key]: action.to } })
    }
    setNotice({
      tone: 'green',
      text: action.notice ? action.notice.replace('{name}', name) : `${name}: ${action.label.toLowerCase()} applied — status is now ${action.to}.`,
    })
  }

  function handlePrimary() {
    const action = page.primary
    if (!action) return
    if (action.kind === 'navigate') {
      if (action.href) navigate(action.href)
      return
    }
    if (action.kind === 'create') {
      setModal({ type: 'create' })
      return
    }
    if (action.kind === 'statusAll') {
      const key = page.statusKey
      if (!key || !action.to) return
      const to = action.to
      setRows(rows.map((row) => ({ ...row, values: { ...row.values, [key]: to } })))
      setNotice({ tone: 'green', text: action.notice ?? `All ${page.entity} records set to ${to}.` })
      return
    }
    const spareIndex = spareStore.get(page.path) ?? 0
    const source = page.spare[spareIndex] ?? rows[0]
    if (!source) return
    spareStore.set(page.path, spareIndex + 1)
    const created: SuperAdminCatalogRow = { id: `${page.path}-gen-${nextId()}`, values: { ...source.values } }
    setRows([created, ...rows])
    setSort(null)
    setPageIndex(0)
    setNotice({ tone: 'green', text: action.notice ?? `Sample ${page.entity} added to ${page.title}.` })
  }

  function saveRow(values: Record<string, string>, existing?: SuperAdminCatalogRow) {
    if (existing) {
      setRows(rows.map((row) => (row.id === existing.id ? { ...row, values: { ...row.values, ...values } } : row)))
      if (viewing?.id === existing.id) setViewing({ ...existing, values: { ...existing.values, ...values } })
      setNotice({ tone: 'green', text: `${values[page.columns[0]?.key] || page.entity} updated.` })
    } else {
      const base: Record<string, string> = {}
      for (const column of page.columns) base[column.key] = values[column.key] ?? ''
      setRows([{ id: `${page.path}-new-${nextId()}`, values: base }, ...rows])
      setSort(null)
      setPageIndex(0)
      setNotice({ tone: 'green', text: `${values[page.columns[0]?.key] || page.entity} created successfully.` })
    }
    setModal(null)
  }

  function confirmRemove(ids: string[], mode: 'archive' | 'delete') {
    const removed = rows.filter((row) => ids.includes(row.id))
    setRows(rows.filter((row) => !ids.includes(row.id)))
    setSelected((current) => {
      const next = new Set(current)
      ids.forEach((id) => next.delete(id))
      return next
    })
    if (viewing && ids.includes(viewing.id)) setViewing(null)
    const label = removed.length === 1 ? `“${rowTitle(page, removed[0])}”` : `${removed.length} ${page.entity} records`
    setNotice({
      tone: 'amber',
      text:
        mode === 'archive'
          ? `${label} archived and removed from this list (sample).`
          : `${label} deleted permanently (sample).`,
    })
    setModal(null)
  }

  function duplicateRow(row: SuperAdminCatalogRow) {
    const first = page.columns[0]
    const values = { ...row.values }
    if (first) values[first.key] = `${values[first.key]} (copy)`
    setRows([{ id: `${page.path}-copy-${nextId()}`, values }, ...rows])
    setSort(null)
    setPageIndex(0)
    setNotice({ tone: 'green', text: `${rowTitle(page, row)} duplicated.` })
  }

  const menuRow = menu ? rows.find((row) => row.id === menu.id) : undefined
  const availableStatusActions = menuRow && page.statusKey
    ? page.statusActions.filter((action) => !action.from || action.from.includes(menuRow.values[page.statusKey as string]))
    : []

  const chartRows = useMemo(() => {
    if (!page.chart) return []
    const { labelKey, valueKey } = page.chart
    return filtered
      .map((row) => ({ id: row.id, label: row.values[labelKey] ?? '', raw: row.values[valueKey] ?? '', value: parseNumber(row.values[valueKey] ?? '') ?? 0 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [filtered, page.chart])
  const chartMax = Math.max(1, ...chartRows.map((item) => item.value))
  const chartColumn = page.chart ? page.columns.find((column) => column.key === page.chart?.valueKey) : undefined

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {page.section}
            <span className="mx-1.5">/</span>
            <span className="text-slate-500">{page.title}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">{page.title}</h1>
            {page.badge ? <ContentBadge tone="slate">{page.badge}</ContentBadge> : null}
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{page.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {page.secondary ? (
            <button type="button" onClick={() => exportRows(filtered, 'export')} className={btnOutline}>
              <DownloadIcon className="h-4 w-4" />
              {page.secondary.label}
            </button>
          ) : null}
          {page.primary ? (
            <button type="button" onClick={handlePrimary} className={btnPrimary}>
              {page.primary.kind === 'statusAll' ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
              {page.primary.label}
            </button>
          ) : null}
        </div>
      </header>

      {notice ? (
        <ContentNotice tone={notice.tone} onDismiss={() => setNotice(null)}>
          {notice.text}
        </ContentNotice>
      ) : null}

      {page.note ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">{page.note}</div>
      ) : null}

      {page.kpis.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {page.kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} value={computeKpi(kpi, rows)} />
          ))}
        </section>
      ) : null}

      <section className={`${cardClass} p-3.5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <label className="relative min-w-0 flex-1 lg:max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPageIndex(0)
              }}
              placeholder={`Search ${page.title.toLowerCase()}…`}
              aria-label={`Search ${page.title}`}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </label>
          {page.filters.map((filter) => (
            <label key={filter.key} className="flex items-center gap-2">
              <span className="sr-only">{filter.label}</span>
              <span className="w-44">
                <ContentSelect
                  aria-label={filter.label}
                  value={filterValues[filter.key] ?? 'All'}
                  onChange={(event) => {
                    setFilterValues((current) => ({ ...current, [filter.key]: event.target.value }))
                    setPageIndex(0)
                  }}
                >
                  <option value="All">{filter.label}: All</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </ContentSelect>
              </span>
            </label>
          ))}
          {page.periodKey ? (
            <span className="w-44">
              <ContentSelect
                aria-label="Period"
                value={period}
                onChange={(event) => {
                  setPeriod(event.target.value as PeriodId)
                  setPageIndex(0)
                }}
              >
                {periodOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </ContentSelect>
            </span>
          ) : null}
          {hasActiveFilters ? (
            <button type="button" onClick={clearFilters} className="text-sm font-semibold text-brand hover:underline">
              Clear filters
            </button>
          ) : null}
          <span className="text-sm text-slate-400 lg:ml-auto">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </section>

      {page.chart && chartRows.length > 0 ? (
        <section className={`${cardClass} p-5`}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold text-navy">{page.chart.title}</h2>
            <p className="text-xs text-slate-400">Reflects current filters · top {chartRows.length}</p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {chartRows.map((item) => (
              <li key={item.id} className="grid grid-cols-[minmax(120px,220px)_1fr_90px] items-center gap-3 text-sm">
                <span className="truncate text-slate-600" title={item.label}>
                  {item.label}
                </span>
                <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                    style={{ width: `${Math.max(3, (item.value / chartMax) * 100)}%` }}
                  />
                </span>
                <span className="text-right font-semibold text-navy">
                  {chartColumn ? formatCell(chartColumn, item.raw) : item.raw}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canSelect && selected.size > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-200 bg-[#EFF4FF] px-4 py-3 text-sm">
          <span className="font-semibold text-brand">{selected.size} selected</span>
          <button
            type="button"
            onClick={() => setModal({ type: 'confirm', ids: [...selected], mode: 'archive' })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-navy hover:bg-slate-50"
          >
            <FolderIcon className="h-4 w-4" />
            Archive selected
          </button>
          <button
            type="button"
            onClick={() => exportRows(rows.filter((row) => selected.has(row.id)), 'selected')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-navy hover:bg-slate-50"
          >
            <DownloadIcon className="h-4 w-4" />
            Export selected
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="ml-auto font-semibold text-slate-500 hover:text-navy">
            Clear selection
          </button>
        </div>
      ) : null}

      <section className={`${cardClass} overflow-hidden`}>
        {filtered.length === 0 ? (
          <ContentEmptyState
            icon={<SearchIcon className="h-6 w-6" />}
            title={rows.length === 0 ? `No ${page.entity} records yet` : `No ${page.entity} records match`}
            body={
              rows.length === 0
                ? 'Everything in this list has been removed. Add a new record to get started.'
                : 'Try a different search term or clear the filters to see everything again.'
            }
          >
            {rows.length > 0 ? (
              <button type="button" onClick={clearFilters} className={btnOutline}>
                Clear filters
              </button>
            ) : null}
            {page.primary?.kind === 'create' || page.primary?.kind === 'navigate' ? (
              <button type="button" onClick={handlePrimary} className={btnPrimary}>
                <PlusIcon className="h-4 w-4" />
                {page.primary.label}
              </button>
            ) : null}
          </ContentEmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {canSelect ? (
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label="Select all rows on this page"
                          checked={allOnPageSelected}
                          onChange={() =>
                            setSelected((current) => {
                              const next = new Set(current)
                              if (allOnPageSelected) pageRows.forEach((row) => next.delete(row.id))
                              else pageRows.forEach((row) => next.add(row.id))
                              return next
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 accent-[#2563EB]"
                        />
                      </th>
                    ) : null}
                    {page.columns.map((column) => {
                      const active = sort?.key === column.key
                      return (
                        <th key={column.key} className="px-3 py-3 font-semibold whitespace-nowrap first:pl-5">
                          <button
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            className={`inline-flex items-center gap-1 uppercase hover:text-navy ${active ? 'text-navy' : ''}`}
                            aria-label={`Sort by ${column.label}`}
                          >
                            {column.label}
                            {active ? (
                              sort?.dir === 'asc' ? (
                                <ArrowUpIcon className="h-3 w-3" />
                              ) : (
                                <ArrowDownIcon className="h-3 w-3" />
                              )
                            ) : (
                              <span className="h-3 w-3 opacity-0">·</span>
                            )}
                          </button>
                        </th>
                      )
                    })}
                    <th className="w-14 px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      {canSelect ? (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label={`Select ${rowTitle(page, row)}`}
                            checked={selected.has(row.id)}
                            onChange={() =>
                              setSelected((current) => {
                                const next = new Set(current)
                                if (next.has(row.id)) next.delete(row.id)
                                else next.add(row.id)
                                return next
                              })
                            }
                            className="h-4 w-4 rounded border-slate-300 accent-[#2563EB]"
                          />
                        </td>
                      ) : null}
                      {page.columns.map((column, index) => {
                        const value = row.values[column.key] ?? ''
                        return (
                          <td key={column.key} className={`px-3 py-3 align-middle first:pl-5 ${index === 0 ? '' : 'text-slate-600'}`}>
                            {column.kind === 'status' ? (
                              <StatusBadge value={value} />
                            ) : index === 0 ? (
                              <button
                                type="button"
                                onClick={() => setViewing(row)}
                                className="max-w-[320px] text-left font-semibold text-navy hover:text-brand hover:underline"
                              >
                                {formatCell(column, value)}
                              </button>
                            ) : (
                              <span className={column.kind === 'text' ? 'block max-w-[300px] truncate' : 'whitespace-nowrap'} title={value}>
                                {formatCell(column, value)}
                              </span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          aria-label={`Actions for ${rowTitle(page, row)}`}
                          onClick={(event) => openMenu(event, row.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                          <MoreVerticalIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {safePage * PAGE_SIZE + 1}–{Math.min(filtered.length, safePage * PAGE_SIZE + PAGE_SIZE)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPageIndex(Math.max(0, safePage - 1))}
                  disabled={safePage === 0}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 font-semibold text-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>
                <span className="px-1 font-medium text-navy">
                  Page {safePage + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPageIndex(Math.min(totalPages - 1, safePage + 1))}
                  disabled={safePage >= totalPages - 1}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 font-semibold text-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {menu && menuRow ? (
        <>
          <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setMenu(null)} />
          <div
            role="menu"
            className="fixed z-50 w-52 rounded-xl border border-slate-200 bg-white py-1.5 text-sm shadow-[0_12px_32px_rgba(15,40,80,0.16)]"
            style={{ top: menu.top, left: menu.left }}
          >
            {page.rowActions.includes('view') ? (
              <MenuItem icon={<EyeIcon className="h-4 w-4" />} onClick={() => { setViewing(menuRow); setMenu(null) }}>
                View details
              </MenuItem>
            ) : null}
            {page.rowActions.includes('edit') ? (
              <MenuItem icon={<PencilIcon className="h-4 w-4" />} onClick={() => { setModal({ type: 'edit', row: menuRow }); setMenu(null) }}>
                Edit
              </MenuItem>
            ) : null}
            {page.rowActions.includes('duplicate') ? (
              <MenuItem icon={<CopyIcon className="h-4 w-4" />} onClick={() => { duplicateRow(menuRow); setMenu(null) }}>
                Duplicate
              </MenuItem>
            ) : null}
            {page.rowActions.includes('export') ? (
              <MenuItem icon={<DownloadIcon className="h-4 w-4" />} onClick={() => { exportRows([menuRow], rowTitle(page, menuRow)); setMenu(null) }}>
                Export row
              </MenuItem>
            ) : null}
            {availableStatusActions.length > 0 ? <div className="my-1 border-t border-slate-100" /> : null}
            {availableStatusActions.map((action) => (
              <MenuItem key={action.label} icon={<CheckIcon className="h-4 w-4" />} onClick={() => { applyStatus(menuRow, action); setMenu(null) }}>
                {action.label}
              </MenuItem>
            ))}
            {page.rowActions.includes('archive') || page.rowActions.includes('delete') ? <div className="my-1 border-t border-slate-100" /> : null}
            {page.rowActions.includes('archive') ? (
              <MenuItem icon={<FolderIcon className="h-4 w-4" />} onClick={() => { setModal({ type: 'confirm', ids: [menuRow.id], mode: 'archive' }); setMenu(null) }}>
                Archive
              </MenuItem>
            ) : null}
            {page.rowActions.includes('delete') ? (
              <MenuItem danger icon={<TrashIcon className="h-4 w-4" />} onClick={() => { setModal({ type: 'confirm', ids: [menuRow.id], mode: 'delete' }); setMenu(null) }}>
                Delete
              </MenuItem>
            ) : null}
          </div>
        </>
      ) : null}

      {viewing ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button type="button" aria-label="Close details" onClick={() => setViewing(null)} className="absolute inset-0 bg-[#0F2340]/40" />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-[-12px_0_40px_rgba(15,40,80,0.2)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{page.entity} details</p>
                <h2 className="mt-1 text-lg font-bold text-navy">{rowTitle(page, viewing)}</h2>
                {statusColumn ? (
                  <div className="mt-2">
                    <StatusBadge value={viewing.values[statusColumn.key] ?? ''} />
                  </div>
                ) : null}
              </div>
              <button type="button" onClick={() => setViewing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-navy" aria-label="Close">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <dl className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {page.columns.map((column) => (
                <div key={column.key} className="grid grid-cols-[130px_1fr] gap-3 text-sm">
                  <dt className="text-slate-400">{column.label}</dt>
                  <dd className="font-medium text-navy">
                    {column.kind === 'status' ? <StatusBadge value={viewing.values[column.key] ?? ''} /> : formatCell(column, viewing.values[column.key] ?? '')}
                  </dd>
                </div>
              ))}
              <div className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
                Record ID <span className="font-mono">{viewing.id}</span> · Sample data held in this browser session.
              </div>
            </dl>
            <div className="flex flex-wrap gap-2.5 border-t border-slate-100 px-6 py-4">
              {page.rowActions.includes('edit') ? (
                <button type="button" className={btnPrimary} onClick={() => { setModal({ type: 'edit', row: viewing }); setViewing(null) }}>
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
              ) : null}
              {page.rowActions.includes('export') || page.secondary ? (
                <button type="button" className={btnOutline} onClick={() => exportRows([viewing], rowTitle(page, viewing))}>
                  <DownloadIcon className="h-4 w-4" />
                  Export
                </button>
              ) : null}
              {page.rowActions.includes('archive') ? (
                <button type="button" className={btnOutline} onClick={() => setModal({ type: 'confirm', ids: [viewing.id], mode: 'archive' })}>
                  Archive
                </button>
              ) : null}
              {page.rowActions.includes('delete') ? (
                <button type="button" className={btnDanger} onClick={() => setModal({ type: 'confirm', ids: [viewing.id], mode: 'delete' })}>
                  Delete
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}

      {modal?.type === 'create' || modal?.type === 'edit' ? (
        <RowFormModal
          page={page}
          existing={modal.type === 'edit' ? modal.row : undefined}
          onClose={() => setModal(null)}
          onSave={(values) => saveRow(values, modal.type === 'edit' ? modal.row : undefined)}
        />
      ) : null}

      {modal?.type === 'confirm' ? (
        <Modal
          title={
            modal.mode === 'archive'
              ? modal.ids.length > 1
                ? 'Archive selected records?'
                : 'Archive this record?'
              : modal.ids.length > 1
                ? 'Delete selected records?'
                : 'Delete this record?'
          }
          description={
            modal.mode === 'archive'
              ? 'Archived records are removed from this list. You can restore them from the archive later.'
              : 'This permanently removes the record from the sample data. This cannot be undone.'
          }
          onClose={() => setModal(null)}
          width="max-w-md"
          footer={
            <>
              <button type="button" className={btnOutline} onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={modal.mode === 'delete' ? btnDanger : btnPrimary}
                onClick={() => confirmRemove(modal.ids, modal.mode)}
              >
                {modal.mode === 'archive' ? 'Archive' : 'Delete'}
                {modal.ids.length > 1 ? ` ${modal.ids.length} records` : ''}
              </button>
            </>
          }
        >
          <p className="text-sm text-slate-600">
            {modal.ids.length === 1
              ? `“${rowTitle(page, rows.find((row) => row.id === modal.ids[0]) ?? rows[0])}”`
              : `${modal.ids.length} ${page.entity} records`}{' '}
            will be {modal.mode === 'archive' ? 'archived' : 'deleted'}.
          </p>
        </Modal>
      ) : null}
    </div>
  )
}

function MenuItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left font-medium hover:bg-slate-50 ${
        danger ? 'text-rose-600' : 'text-navy'
      }`}
    >
      <span className={danger ? 'text-rose-500' : 'text-slate-400'}>{icon}</span>
      {children}
    </button>
  )
}

function fieldInputType(column: SuperAdminCatalogColumn) {
  return column.kind === 'date' ? 'date' : 'text'
}

function RowFormModal({
  page,
  existing,
  onClose,
  onSave,
}: {
  page: SuperAdminCatalogPage
  existing?: SuperAdminCatalogRow
  onClose: () => void
  onSave: (values: Record<string, string>) => void
}) {
  const editable = page.columns.filter((column) => column.editable)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const column of editable) {
      initial[column.key] = existing?.values[column.key] ?? (column.kind === 'status' ? column.options[0] ?? '' : '')
    }
    return initial
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstKey = page.columns[0]?.key

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (firstKey && editable.some((column) => column.key === firstKey) && !values[firstKey]?.trim()) {
      next[firstKey] = `${page.columns[0].label} is required.`
    }
    for (const column of editable) {
      const value = values[column.key]?.trim() ?? ''
      if (value && column.kind === 'percent' && parseNumber(value) === null) next[column.key] = 'Enter a number, for example 75 or 75%.'
      if (value && column.kind === 'money' && parseNumber(value) === null) next[column.key] = 'Enter an amount, for example 120 or KWD 120.'
      if (value && column.kind === 'number' && parseNumber(value) === null && /^[a-z]+$/i.test(value)) next[column.key] = 'Enter a numeric value.'
    }
    setErrors(next)
    if (Object.keys(next).length === 0) {
      const cleaned: Record<string, string> = {}
      for (const column of editable) cleaned[column.key] = values[column.key]?.trim() ?? ''
      onSave(cleaned)
    }
  }

  return (
    <Modal
      title={existing ? `Edit ${page.entity}` : `Add ${page.entity}`}
      description={existing ? 'Update the fields below and save.' : `Fill in the details to create a new ${page.entity}.`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnOutline} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="catalog-row-form" className={btnPrimary}>
            {existing ? 'Save changes' : `Create ${page.entity}`}
          </button>
        </>
      }
    >
      <form id="catalog-row-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {editable.map((column, index) => {
          const id = `catalog-field-${column.key}`
          const wide = index === 0
          const options = column.kind === 'status'
            ? [...new Set([...column.options, values[column.key]].filter(Boolean))]
            : []
          return (
            <ContentField
              key={column.key}
              label={column.label}
              htmlFor={id}
              required={column.key === firstKey}
              error={errors[column.key]}
              className={wide ? 'sm:col-span-2' : ''}
            >
              {column.kind === 'status' ? (
                <ContentSelect id={id} value={values[column.key]} onChange={(event) => setValues({ ...values, [column.key]: event.target.value })}>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </ContentSelect>
              ) : (
                <ContentTextInput
                  id={id}
                  type={fieldInputType(column)}
                  value={values[column.key]}
                  invalid={Boolean(errors[column.key])}
                  onChange={(event) => setValues({ ...values, [column.key]: event.target.value })}
                />
              )}
            </ContentField>
          )
        })}
      </form>
    </Modal>
  )
}

/* ---------------------------- route-level page --------------------------- */

export function AdminCatalogPage() {
  const location = useLocation()
  const page = getSuperAdminCatalogPage(location.pathname)

  if (!page) {
    return (
      <section className={`${cardClass} p-8`}>
        <ContentEmptyState
          icon={<SearchIcon className="h-6 w-6" />}
          title="Screen not found"
          body={`There is no Super Admin screen at ${location.pathname}. Use the sidebar to pick a section.`}
        >
          <Link to={paths.admin.dashboard} className={btnPrimary}>
            Back to Executive Overview
          </Link>
        </ContentEmptyState>
      </section>
    )
  }

  if (page.mode === 'form') return <CatalogFormView key={page.path} page={page} />
  return <CatalogListView key={page.path} page={page} />
}
