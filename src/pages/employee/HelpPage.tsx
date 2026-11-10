import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  employeeHelpFaqs,
  employeeHelpPage,
  employeeHelpTicketPath,
  employeeHelpTickets,
  type EmployeeTicketStatus,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  BookIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardIcon,
  CopyIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  TicketIcon,
} from '@/components/ui'

const copy = employeeHelpPage

function StatusBadge({ status }: { status: EmployeeTicketStatus }) {
  const styles = {
    open: 'bg-amber-50 text-amber-700',
    in_progress: 'bg-[#EAF2FF] text-brand',
    resolved: 'bg-emerald-50 text-emerald-700',
    closed: 'bg-slate-100 text-slate-500',
  } as const
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {copy.status[status]}
    </span>
  )
}

export function EmployeeHelpPage() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState(employeeHelpFaqs[0]?.id ?? '')
  const [showNumber, setShowNumber] = useState(false)
  const [toast, setToast] = useState('')

  const faqs = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return employeeHelpFaqs.filter((item) => {
      if (topic && item.topic !== topic) return false
      if (!needle) return true
      return (
        item.question.toLowerCase().includes(needle) || item.answer.toLowerCase().includes(needle)
      )
    })
  }, [query, topic])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(copy.channels.email.detail)
    } catch {
      /* ignore */
    }
    showToast(copy.channels.email.copied)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <section className="rounded-2xl bg-brand px-5 py-6 text-white sm:px-7 sm:py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{copy.heroTitle(copy.firstName)}</h1>
        <div className="relative mt-4 max-w-xl">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-200" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-11 w-full rounded-xl border-0 bg-white/15 pr-3 pl-10 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-blue-100 focus:bg-white/20"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {copy.topics.map((item) => {
            const active = topic === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTopic((current) => (current === item ? null : item))}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active ? 'bg-white text-brand' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
            <TicketIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-sm font-bold text-navy">{copy.channels.ticket.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{copy.channels.ticket.detail}</p>
          <Link
            to={`${paths.employee.help}/new`}
            className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy.channels.ticket.action}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
            <MailIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-sm font-bold text-navy">{copy.channels.email.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{copy.channels.email.detail}</p>
          <button
            type="button"
            onClick={copyEmail}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <CopyIcon className="h-4 w-4" />
            {copy.channels.email.action}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
            <PhoneIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-sm font-bold text-navy">{copy.channels.call.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {showNumber ? copy.channels.call.number : copy.channels.call.detail}
          </p>
          <button
            type="button"
            onClick={() => setShowNumber((value) => !value)}
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {showNumber ? copy.channels.call.hide : copy.channels.call.action}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
            <BookIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-sm font-bold text-navy">{copy.channels.guide.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{copy.channels.guide.detail}</p>
          <button
            type="button"
            onClick={() => showToast(copy.channels.guide.toast)}
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.channels.guide.action}
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_22rem]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <h2 className="text-base font-bold text-navy">{copy.faqsTitle}</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {faqs.map((faq) => {
              const open = openFaq === faq.id
              return (
                <li key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq((current) => (current === faq.id ? '' : faq.id))}
                    className="flex w-full items-start justify-between gap-3 py-3.5 text-left"
                  >
                    <span className="text-sm font-semibold text-navy">{faq.question}</span>
                    <ChevronDownIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {open ? (
                    <p className="pb-3.5 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
                  ) : null}
                </li>
              )
            })}
            {!faqs.length ? (
              <li className="py-6 text-sm text-slate-500">{copy.emptyFaqs}</li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-navy">{copy.ticketsTitle}</h2>
            <ClipboardIcon className="h-4 w-4 text-slate-400" />
          </div>
          <ul className="mt-3 space-y-2">
            {employeeHelpTickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  to={employeeHelpTicketPath(ticket.id)}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-3 py-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{ticket.number}</p>
                    <p className="mt-0.5 text-sm font-semibold text-navy">{ticket.subject}</p>
                    <div className="mt-2">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
