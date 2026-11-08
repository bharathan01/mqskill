import { useMemo, useState, type ChangeEvent } from 'react'
import { Link, useParams } from 'react-router'
import {
  getOrganizationTicket,
  organizationHelpPage,
  organizationTicketDetailPage,
  type OrganizationTicketMessage,
  type TicketStatus,
} from '@/constants'
import { organizationInvoicePath, paths } from '@/routes/paths'
import {
  CheckIcon,
  ChevronLeftIcon,
  FileIcon,
  PaperclipIcon,
  SendIcon,
} from '@/components/ui'

const copy = organizationTicketDetailPage

function StatusBadge({ status }: { status: TicketStatus }) {
  const styles = {
    waiting: 'bg-amber-50 text-amber-700',
    answered: 'bg-[#EAF2FF] text-brand',
    solved: 'bg-emerald-50 text-emerald-700',
  } as const
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {organizationHelpPage.status[status]}
    </span>
  )
}

export function OrganizationTicketDetailPage() {
  const { ticketId = '' } = useParams()
  const seed = getOrganizationTicket(ticketId)
  const [status, setStatus] = useState<TicketStatus | null>(seed?.status ?? null)
  const [messages, setMessages] = useState<OrganizationTicketMessage[]>(seed?.messages ?? [])
  const [reply, setReply] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [toast, setToast] = useState('')

  const ticket = useMemo(() => {
    if (!seed || status === null) return null
    return { ...seed, status, messages }
  }, [messages, seed, status])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function handleAttach(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setAttachmentName(file.name)
  }

  function sendReply() {
    if (!reply.trim() && !attachmentName) return
    const next: OrganizationTicketMessage = {
      id: `m${Date.now()}`,
      author: 'Sara Al-Rashid',
      role: 'admin',
      initials: 'SR',
      body: reply.trim() || 'Attachment added.',
      time: 'Just now',
      attachment: attachmentName
        ? { name: attachmentName, size: '—' }
        : undefined,
    }
    setMessages((current) => [...current, next])
    setReply('')
    setAttachmentName('')
    if (status === 'waiting') setStatus('answered')
    showToast(copy.replyToast)
  }

  function markSolved() {
    setStatus('solved')
    showToast(copy.solvedToast)
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">{copy.notFound}</p>
        <Link
          to={paths.organization.help}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {copy.back}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.organization.help}
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-navy"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-400">{ticket.number}</span>
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">{ticket.subject}</h1>

            <ul className="mt-6 space-y-4">
              {ticket.messages.map((message) => (
                <li
                  key={message.id}
                  className={`rounded-2xl border p-4 ${
                    message.role === 'support'
                      ? 'border-[#D7E6FF] bg-[#F5F9FF]'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${
                        message.role === 'support' ? 'bg-brand' : 'bg-navy'
                      }`}
                    >
                      {message.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-navy">{message.author}</p>
                        {message.role === 'support' ? (
                          <span className="text-xs font-semibold text-brand">
                            {copy.supportLabel}
                          </span>
                        ) : null}
                        <span className="text-xs text-slate-400">{message.time}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{message.body}</p>
                      {message.attachment ? (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy">
                          <FileIcon className="h-3.5 w-3.5 text-brand" />
                          {message.attachment.name}
                          <span className="font-normal text-slate-400">
                            · {message.attachment.size}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {ticket.status !== 'solved' ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <textarea
                  rows={3}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder={copy.replyPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-navy outline-none focus:border-brand"
                />
                {attachmentName ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy">
                    <PaperclipIcon className="h-3.5 w-3.5" />
                    {attachmentName}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <PaperclipIcon className="h-4 w-4" />
                    {copy.attach}
                    <input type="file" className="hidden" onChange={handleAttach} />
                  </label>
                  <button
                    type="button"
                    onClick={sendReply}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <SendIcon className="h-4 w-4" />
                    {copy.sendReply}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-sm font-bold text-navy">{copy.details}</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.ticket}</dt>
                <dd className="font-semibold text-navy">{ticket.number}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.topic}</dt>
                <dd className="text-right font-semibold text-navy">{ticket.topic}</dd>
              </div>
              {ticket.relatedTo ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{copy.relatedTo}</dt>
                  <dd className="font-semibold">
                    {ticket.relatedInvoiceId ? (
                      <Link
                        to={organizationInvoicePath(ticket.relatedInvoiceId)}
                        className="text-brand hover:text-blue-700"
                      >
                        {ticket.relatedTo}
                      </Link>
                    ) : (
                      <span className="text-navy">{ticket.relatedTo}</span>
                    )}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.priority}</dt>
                <dd className="font-semibold capitalize text-navy">{ticket.priority}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.opened}</dt>
                <dd className="font-semibold text-navy">{ticket.opened}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.openedBy}</dt>
                <dd className="text-right font-semibold text-navy">{ticket.openedBy}</dd>
              </div>
            </dl>
            {ticket.status !== 'solved' ? (
              <button
                type="button"
                onClick={markSolved}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <CheckIcon className="h-4 w-4 text-emerald-500" />
                {copy.markSolved}
              </button>
            ) : null}
          </div>
          <p className="rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
            {copy.replyTimeNote}
          </p>
        </aside>
      </div>
    </div>
  )
}
