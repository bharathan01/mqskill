import { useMemo, useState } from 'react'
import { ContentNotice, ContentSelect, ContentTextInput } from '@/components/common'
import { SearchIcon } from '@/components/ui'
import {
  superAdminZoomHosts,
  superAdminZoomLinks,
  superAdminZoomPageSize,
  superAdminZoomPasscodeNote,
  superAdminZoomPendingClasses,
  superAdminZoomSubtitle,
  type SuperAdminLiveKpi,
  type SuperAdminZoomLink,
} from '@/constants'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import {
  dangerAction,
  linkAction,
  LiveEmptyRow,
  LiveKpiGrid,
  LivePageHeader,
  LivePager,
  paginate,
  theadRowClass,
  thClass,
  trClass,
} from './liveShared'

export function AdminZoomLinksPage() {
  const [links, setLinks] = useState<SuperAdminZoomLink[]>(superAdminZoomLinks)
  const [generated, setGenerated] = useState(0)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Any status')
  const [host, setHost] = useState('All hosts')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const kpis = useMemo<SuperAdminLiveKpi[]>(
    () => [
      { id: 'active', label: 'Active links', value: String(links.filter((row) => row.status === 'Active').length), detail: 'ready to join' },
      { id: 'hosts', label: 'Host accounts', value: String(superAdminZoomHosts.length), detail: 'licensed Zoom hosts' },
      { id: 'expired', label: 'Expired', value: String(links.filter((row) => row.status === 'Expired').length), detail: 'regenerate if reused' },
    ],
    [links],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return links.filter((row) => {
      if (status !== 'Any status' && row.status !== status) return false
      if (host !== 'All hosts' && row.host !== host) return false
      if (!needle) return true
      return `${row.title} ${row.meetingId} ${row.joinUrl}`.toLowerCase().includes(needle)
    })
  }, [host, links, query, status])

  const { pageCount, safePage, pageRows, from, to } = paginate(filtered, page, superAdminZoomPageSize)

  const generate = () => {
    const title = superAdminZoomPendingClasses[generated % superAdminZoomPendingClasses.length]
    const seed = 900 + generated
    setLinks((current) => [
      {
        id: `zl-new-${Date.now()}`,
        title,
        meetingId: `${seed} 4100 7${seed}`,
        joinUrl: `zoom.us/j/${seed}41007${seed}`,
        host: superAdminZoomHosts[generated % superAdminZoomHosts.length],
        status: 'Active',
        expires: '30 Nov 2026',
      },
      ...current,
    ])
    setGenerated((count) => count + 1)
    setPage(1)
    setNotice(`Zoom link generated for “${title}” (sample).`)
  }

  const copy = async (row: SuperAdminZoomLink) => {
    try {
      await navigator.clipboard?.writeText(`https://${row.joinUrl}`)
    } catch {
      // Clipboard is best-effort in the sample build.
    }
    setNotice(`Join link copied for “${row.title}” (sample).`)
  }

  const setRowStatus = (row: SuperAdminZoomLink, next: SuperAdminZoomLink['status'], message: string) => {
    setLinks((current) => current.map((item) => (item.id === row.id ? { ...item, status: next } : item)))
    setNotice(message)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="Zoom Meeting Links"
        subtitle={superAdminZoomSubtitle}
        actions={
          <>
            <button type="button" onClick={() => setNotice('Zoom link list exported (sample).')} className={btnOutline}>
              Export
            </button>
            <button type="button" onClick={generate} className={btnPrimary}>
              Generate link
            </button>
          </>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <LiveKpiGrid kpis={kpis} />

      <ContentNotice tone="blue">{superAdminZoomPasscodeNote}</ContentNotice>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-3.5 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <ContentTextInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search class, meeting ID or link"
              className="!h-10 !pl-9"
            />
          </label>
          <ContentSelect
            aria-label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            className="!h-10 lg:max-w-[10rem]"
          >
            <option>Any status</option>
            <option>Active</option>
            <option>Expired</option>
            <option>Revoked</option>
          </ContentSelect>
          <ContentSelect
            aria-label="Host account"
            value={host}
            onChange={(event) => {
              setHost(event.target.value)
              setPage(1)
            }}
            className="!h-10 lg:max-w-[15rem]"
          >
            <option>All hosts</option>
            {superAdminZoomHosts.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </ContentSelect>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse text-left">
            <thead>
              <tr className={theadRowClass}>
                <th className="px-4 py-2.5 font-semibold">Class</th>
                <th className={thClass}>Meeting ID</th>
                <th className={thClass}>Join URL</th>
                <th className={thClass}>Host account</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Expires</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className={trClass}>
                  <td className="px-4 py-3.5 text-sm font-semibold text-navy">{row.title}</td>
                  <td className="px-3 py-3.5 text-sm tabular-nums text-slate-600">{row.meetingId}</td>
                  <td className="px-3 py-3.5 text-sm text-brand">{row.joinUrl}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.host}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{row.expires}</td>
                  <td className="px-3 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        disabled={row.status !== 'Active'}
                        onClick={() => void copy(row)}
                        className={linkAction}
                      >
                        Copy link
                      </button>
                      {row.status === 'Active' ? (
                        <button
                          type="button"
                          onClick={() => setRowStatus(row, 'Revoked', `Link revoked for “${row.title}” (sample).`)}
                          className={dangerAction}
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRowStatus(row, 'Active', `Link regenerated for “${row.title}” (sample).`)}
                          className={linkAction}
                        >
                          Regenerate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? <LiveEmptyRow colSpan={7}>No Zoom links match these filters.</LiveEmptyRow> : null}
            </tbody>
          </table>
        </div>
        <LivePager
          page={safePage}
          pageCount={pageCount}
          from={from}
          to={to}
          total={filtered.length}
          noun="links"
          onPage={setPage}
        />
      </section>
    </div>
  )
}
