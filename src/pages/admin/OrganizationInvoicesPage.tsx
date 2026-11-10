import { useMemo, useState, type FormEvent } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { LightbulbIcon, MailIcon } from '@/components/ui'
import {
  formatOrgDate,
  formatOrgKwd,
  superAdminOrgInvoices,
  superAdminOrgInvoicesSubtitle,
  superAdminOrgInvoiceTabs,
  superAdminOrgNames,
  superAdminOrgPageSize,
  superAdminOrgToday,
  type SuperAdminOrgInvoice,
  type SuperAdminOrgInvoiceStatus,
} from '@/constants'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  linkAction,
  OrgEmptyRow,
  OrgKpiGrid,
  OrgPageHeader,
  OrgPager,
  OrgSelect,
  OrgSideCard,
  OrgStatusBadge,
  OrgTabs,
  OrgToolbar,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './orgShared'

const ALL_ORGS = 'All organizations'

const sumBy = (list: SuperAdminOrgInvoice[], statuses: SuperAdminOrgInvoiceStatus[]) =>
  list.filter((row) => statuses.includes(row.status)).reduce((total, row) => total + row.amount, 0)

const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function AdminOrganizationInvoicesPage() {
  const [rows, setRows] = useState<SuperAdminOrgInvoice[]>(superAdminOrgInvoices)
  const [tab, setTab] = useState<'all' | SuperAdminOrgInvoiceStatus>('all')
  const [query, setQuery] = useState('')
  const [org, setOrg] = useState(ALL_ORGS)
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)
  const [reminded, setReminded] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)
  const [formOrg, setFormOrg] = useState(superAdminOrgNames[0])
  const [formAmount, setFormAmount] = useState('1500')

  const kpis = useMemo(
    () => [
      { id: 'outstanding', label: 'Outstanding', value: formatOrgKwd(sumBy(rows, ['Pending', 'Overdue']), 3), detail: 'pending + overdue invoices' },
      { id: 'overdue', label: 'Overdue', value: formatOrgKwd(sumBy(rows, ['Overdue']), 3), detail: `${rows.filter((r) => r.status === 'Overdue').length} invoices past due` },
      { id: 'paid', label: 'Paid', value: String(rows.filter((r) => r.status === 'Paid').length), detail: 'invoices settled' },
    ],
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (tab !== 'all' && row.status !== tab) return false
      if (org !== ALL_ORGS && row.org !== org) return false
      if (!needle) return true
      return `${row.number} ${row.org}`.toLowerCase().includes(needle)
    })
  }, [org, query, rows, tab])

  const overdue = rows.filter((row) => row.status === 'Overdue')
  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminOrgPageSize)

  const setStatus = (row: SuperAdminOrgInvoice, status: SuperAdminOrgInvoiceStatus, message: string) => {
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status } : item)))
    setNotice(message)
  }

  const remind = (row: SuperAdminOrgInvoice) => {
    setReminded((current) => new Set(current).add(row.id))
    setNotice(`Payment reminder emailed to ${row.org} for ${row.number} (sample).`)
  }

  const create = (event: FormEvent) => {
    event.preventDefault()
    const amount = Math.max(1, Number(formAmount) || 0)
    const number = `ORG-INV-${3240 + (rows.length - superAdminOrgInvoices.length) * 4}`
    setRows((current) => [
      { id: number, number, org: formOrg, amount, issued: superAdminOrgToday, due: addDays(superAdminOrgToday, 14), status: 'Draft' },
      ...current,
    ])
    setCreating(false)
    setTab('all')
    setPage(1)
    setNotice(`Draft invoice ${number} created for ${formOrg} (sample).`)
  }

  return (
    <div className="space-y-5">
      <OrgPageHeader
        page="Organization Invoices"
        subtitle={superAdminOrgInvoicesSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Invoices exported as CSV (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={() => setCreating((open) => !open)} className={btnPrimary}>
              Create invoice
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      {creating ? (
        <form onSubmit={create} className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-end`}>
          <label className="min-w-0 flex-1 text-sm font-semibold text-navy">
            Organization
            <ContentSelect value={formOrg} onChange={(event) => setFormOrg(event.target.value)} className="mt-1.5 !h-10">
              {superAdminOrgNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </ContentSelect>
          </label>
          <label className="w-full text-sm font-semibold text-navy lg:w-48">
            Amount (KWD)
            <ContentTextInput type="number" min={1} value={formAmount} onChange={(event) => setFormAmount(event.target.value)} className="mt-1.5 !h-10" />
          </label>
          <div className="flex gap-2.5">
            <button type="submit" className={btnPrimary}>
              Save draft
            </button>
            <button type="button" onClick={() => setCreating(false)} className={btnOutline}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <OrgKpiGrid kpis={kpis} className="sm:grid-cols-2 xl:grid-cols-3" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${cardClass} overflow-hidden`}>
          <OrgTabs
            tabs={superAdminOrgInvoiceTabs}
            value={tab}
            onChange={(id) => {
              setTab(id)
              setPage(1)
            }}
          />
          <OrgToolbar
            query={query}
            onQuery={(value) => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Search invoice number or organization"
          >
            <OrgSelect
              label="Organization"
              value={org}
              options={[ALL_ORGS, ...superAdminOrgNames]}
              onChange={(value) => {
                setOrg(value)
                setPage(1)
              }}
            />
          </OrgToolbar>

          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full border-collapse text-left">
              <thead>
                <tr className={theadRowClass}>
                  <th className="px-4 py-2.5 font-semibold">Invoice #</th>
                  <th className={thClass}>Organization</th>
                  <th className={`${thClass} text-right`}>Amount</th>
                  <th className={thClass}>Issued</th>
                  <th className={thClass}>Due</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className={trClass}>
                    <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.number}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{row.org}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold tabular-nums text-navy">{formatOrgKwd(row.amount, 3)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatOrgDate(row.issued)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">{formatOrgDate(row.due)}</td>
                    <td className="px-3 py-3.5">
                      <OrgStatusBadge value={row.status} />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      {row.status === 'Paid' ? (
                        <span className="text-sm text-slate-300">—</span>
                      ) : row.status === 'Draft' ? (
                        <button type="button" onClick={() => setStatus(row, 'Pending', `${row.number} sent to ${row.org} (sample).`)} className={linkAction}>
                          Send invoice
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          <button type="button" onClick={() => setStatus(row, 'Paid', `${row.number} marked as paid (sample).`)} className={linkAction}>
                            Mark paid
                          </button>
                          <button type="button" disabled={reminded.has(row.id)} onClick={() => remind(row)} className={linkAction}>
                            {reminded.has(row.id) ? 'Reminder sent' : 'Send reminder'}
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 ? <OrgEmptyRow colSpan={7}>No invoices match these filters.</OrgEmptyRow> : null}
              </tbody>
            </table>
          </div>
          <OrgPager page={safePage} pageCount={pageCount} from={from} to={to} total={filtered.length} noun="invoices" onPage={setPage} />
        </section>

        <div className="space-y-4">
          <OrgSideCard icon={<MailIcon className="mt-0.5 h-4 w-4 text-brand" />} title="Overdue invoices" subtitle="Follow up with these accounts">
            {overdue.length ? (
              <ul className="space-y-2.5">
                {overdue.slice(0, 4).map((row) => (
                  <li key={row.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm font-semibold text-navy">{row.org}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.number} · {formatOrgKwd(row.amount, 3)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-rose-600">Due {formatOrgDate(row.due)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No invoices are overdue.</p>
            )}
          </OrgSideCard>
          <OrgSideCard icon={<LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />} title="Tip">
            <p className="text-sm text-slate-500">Draft invoices are not visible to organizations until you send them.</p>
          </OrgSideCard>
        </div>
      </div>
    </div>
  )
}
