import { useMemo, useState, type ChangeEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import {
  employeeHelpPage,
  employeeTicketDetailPage,
  employeeUser,
  getEmployeeTicket,
  type EmployeeTicketMessage,
  type EmployeeTicketStatus,
  type EmployeeTicketThreadItem,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  CheckIcon,
  ChevronLeftIcon,
  CloseIcon,
  FileIcon,
  PaperclipIcon,
  SendIcon,
} from '@/components/ui'

const copy = employeeTicketDetailPage

function StatusBadge({ status }: { status: EmployeeTicketStatus }) {
  const styles = {
    open: 'bg-amber-50 text-amber-700',
    in_progress: 'bg-[#EAF2FF] text-brand',
    resolved: 'bg-emerald-50 text-emerald-700',
    closed: 'bg-slate-100 text-slate-500',
  } as const
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === 'in_progress' ? <span className="h-1.5 w-1.5 rounded-full bg-brand" /> : null}
      {employeeHelpPage.status[status]}
    </span>
  )
}

export function EmployeeTicketDetailPage() {
  const { ticketId = '' } = useParams()
  const seed = getEmployeeTicket(ticketId)
  const [status, setStatus] = useState<EmployeeTicketStatus | null>(seed?.status ?? null)
  const [thread, setThread] = useState<EmployeeTicketThreadItem[]>(seed?.thread ?? [])
  const [reply, setReply] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [toast, setToast] = useState('')

  const ticket = useMemo(() => {
    if (!seed || status === null) return null
    return { ...seed, status, thread }
  }, [seed, status, thread])

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
    const next: EmployeeTicketMessage = {
      id: `m${Date.now()}`,
      kind: 'message',
      author: employeeUser.name,
      role: 'learner',
      initials: employeeUser.initials,
      body: reply.trim() || 'Attachment added.',
      time: 'Just now',
      attachment: attachmentName ? { name: attachmentName, size: '—' } : undefined,
    }
    setThread((current) => [...current, next])
    setReply('')
    setAttachmentName('')
    if (status === 'open') setStatus('in_progress')
    showToast(copy.replyToast)
  }

  function markResolved() {
    setStatus('resolved')
    showToast(copy.resolvedToast)
  }

  function closeTicket() {
    setStatus('closed')
    showToast(copy.closedToast)
  }

  if (!ticket) {
    return <Navigate to={paths.employee.help} replace />
  }

  const canReply = ticket.status === 'open' || ticket.status === 'in_progress'
  const statusColor =
    ticket.status === 'in_progress'
      ? 'text-brand'
      : ticket.status === 'resolved'
        ? 'text-emerald-600'
        : ticket.status === 'closed'
          ? 'text-slate-500'
          : 'text-amber-600'

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <Link
        to={paths.employee.help}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        {copy.back}
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-400">{ticket.number}</span>
            <StatusBadge status={ticket.status} />
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {ticket.category}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">{ticket.subject}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {copy.openedPrefix} {ticket.opened}
            {ticket.relatedCourseTitle ? (
              <>
                <span className="mx-1.5 text-slate-300">·</span>
                {ticket.relatedCourseTitle}
              </>
            ) : null}
            {ticket.relatedLesson ? (
              <>
                <span className="mx-1.5 text-slate-300">·</span>
                {ticket.relatedLesson}
              </>
            ) : null}
          </p>
        </div>
        {canReply ? (
          <button
            type="button"
            onClick={markResolved}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <CheckIcon className="h-4 w-4 text-emerald-500" />
            {copy.markResolved}
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <h2 className="text-base font-bold text-navy">{copy.conversation}</h2>

          <ul className="mt-4 space-y-4">
            {ticket.thread.map((item) => {
              if (item.kind === 'event') {
                return (
                  <li key={item.id} className="flex items-center gap-3 py-1">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium text-slate-400">{item.label}</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </li>
                )
              }

              const support = item.role === 'support'
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      support ? 'bg-brand' : 'bg-navy'
                    }`}
                  >
                    {item.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-navy">{item.author}</p>
                      {support ? (
                        <span className="rounded-full bg-[#EAF2FF] px-2 py-0.5 text-[11px] font-semibold text-brand">
                          {copy.supportBadge}
                        </span>
                      ) : null}
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
                    {item.attachment ? (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-navy">
                        <FileIcon className="h-3.5 w-3.5 text-brand" />
                        {item.attachment.name}
                        <span className="font-normal text-slate-400">· {item.attachment.size}</span>
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>

          {canReply ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <SendIcon className="h-4 w-4" />
                  {copy.sendReply}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-sm font-bold text-navy">{copy.details}</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.status}</dt>
                <dd className={`font-semibold ${statusColor}`}>
                  {employeeHelpPage.status[ticket.status]}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.priority}</dt>
                <dd className="font-semibold text-navy">{copy.priorityLabel[ticket.priority]}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.category}</dt>
                <dd className="text-right font-semibold text-navy">{ticket.category}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.assignedTo}</dt>
                <dd className="text-right font-semibold text-navy">{ticket.assignedTo}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.responseTarget}</dt>
                <dd className="text-right font-semibold text-navy">{ticket.responseTarget}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{copy.lastUpdate}</dt>
                <dd className="font-semibold text-navy">{ticket.lastUpdate}</dd>
              </div>
            </dl>
          </div>

          {ticket.relatedCourseTitle ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h2 className="text-sm font-bold text-navy">{copy.relatedCourse}</h2>
              {ticket.relatedCourseId ? (
                <Link
                  to={`${paths.employee.courses}/${ticket.relatedCourseId}`}
                  className="mt-2 block text-sm font-semibold text-brand hover:text-blue-700"
                >
                  {ticket.relatedCourseTitle}
                </Link>
              ) : (
                <p className="mt-2 text-sm font-semibold text-navy">{ticket.relatedCourseTitle}</p>
              )}
              {ticket.relatedLesson ? (
                <p className="mt-1 text-sm text-slate-500">{ticket.relatedLesson}</p>
              ) : null}
            </div>
          ) : null}

          {canReply ? (
            <button
              type="button"
              onClick={closeTicket}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500"
            >
              <CloseIcon className="h-4 w-4" />
              {copy.closeTicket}
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
