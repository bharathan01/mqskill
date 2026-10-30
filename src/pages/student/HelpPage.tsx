import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  studentHelpChannels,
  studentHelpFaqs,
  studentHelpPage as copy,
} from '@/constants/studentHelp'
import { studentUser } from '@/constants'
import {
  ActivityIcon,
  BookIcon,
  CalendarIcon,
  ChatIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  FilterIcon,
  HelpCircleIcon,
  LogOutIcon,
  SearchIcon,
  MailIcon,
  MapPinIcon,
  PlusIcon,
  PowerIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TicketIcon,
} from '@/components/ui'

const channelIcon = {
  chat: ChatIcon,
  ticket: TicketIcon,
  book: BookIcon,
}

const kickerClass = {
  green: 'text-emerald-600',
  slate: 'text-slate-400',
  brand: 'text-brand',
}

export function StudentHelpPage() {
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [diagnostic, setDiagnostic] = useState(false)
  const sessionRef = useRef<HTMLElement>(null)

  const faqs = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return studentHelpFaqs
    return studentHelpFaqs.filter(
      (item) =>
        item.question.toLowerCase().includes(needle) || item.answer.toLowerCase().includes(needle),
    )
  }, [query])

  function copyEmail() {
    void navigator.clipboard.writeText(copy.mentorEmail)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function runDiagnostic() {
    setDiagnostic(true)
    sessionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-[linear-gradient(115deg,#004EA8_0%,#1B6FD6_52%,#3B8AE8_100%)] px-6 py-8 text-white sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold tracking-wide uppercase">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {copy.status}
          </span>
          <span className="text-white/70">{copy.uptime}</span>
        </div>
        <h1 className="mt-5 font-hero text-3xl font-bold sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{copy.subtitle}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-12 w-full rounded-full bg-white pr-4 pl-11 text-sm text-navy outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={runDiagnostic}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white/15 px-5 text-sm font-semibold text-white"
          >
            <SparkleIcon className="h-4 w-4" />
            {copy.diagnostic}
          </button>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-6">
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-navy">{copy.channelsTitle}</h2>
                <p className="mt-0.5 text-sm text-slate-400">{copy.channelsSubtitle}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">{copy.queues}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {studentHelpChannels.map((channel) => {
                const Icon = channelIcon[channel.icon]
                return (
                  <article
                    key={channel.id}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FB] text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className={`mt-4 text-xs font-semibold ${kickerClass[channel.kickerTone]}`}>
                      {channel.kickerTone === 'green' ? (
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      ) : null}
                      {channel.kicker}
                    </p>
                    <h3 className="mt-2 text-base font-bold text-navy">{channel.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{channel.body}</p>
                    <button
                      type="button"
                      className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${
                        channel.ctaTone === 'brand'
                          ? 'bg-brand text-white'
                          : 'bg-[#EEF3FB] text-navy'
                      }`}
                    >
                      {channel.cta}
                      {channel.id === 'chat' ? <ChevronRightIcon className="h-4 w-4" /> : null}
                      {channel.id === 'ticket' ? <PlusIcon className="h-4 w-4" /> : null}
                      {channel.id === 'guides' ? <BookIcon className="h-4 w-4" /> : null}
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="inline-flex items-center gap-2 text-lg font-bold text-navy">
                  <HelpCircleIcon className="h-5 w-5 text-brand" />
                  {copy.faqsTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{copy.faqsSubtitle}</p>
              </div>
              <span className="rounded-md bg-[#EEF3FB] px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                {copy.faqsUpdated}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {faqs.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">{copy.emptyFaqs}</p>
              ) : (
                faqs.map((item) => {
                  const open = openFaq === item.id
                  return (
                    <article key={item.id} className="overflow-hidden rounded-xl bg-[#F4F7FC]">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : item.id)}
                        className="flex w-full items-center gap-3 px-4 py-4 text-left"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-brand">
                          {item.number}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-semibold text-navy">
                          {item.question}
                        </span>
                        <ChevronDownIcon
                          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {open ? (
                        <p className="px-4 pb-4 pl-[3.75rem] text-sm leading-6 text-slate-500">
                          {item.answer}
                        </p>
                      ) : null}
                    </article>
                  )
                })
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                    <LogOutIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="inline-flex flex-wrap items-center gap-2 text-lg font-bold text-navy">
                      {copy.signOutTitle}
                      <span className="rounded-md bg-[#EEF3FB] px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                        {copy.encrypted}
                      </span>
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {copy.signOutLead}{' '}
                      <span className="font-semibold text-navy">{studentUser.firstName}</span>{' '}
                      <span className="rounded-md bg-brand/10 px-1.5 py-0.5 font-semibold text-brand">
                        {copy.device}
                      </span>
                      . {copy.signOutTail}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF3FB] px-3 py-1 text-xs font-medium text-slate-500">
                    <RefreshIcon className="h-3.5 w-3.5 text-emerald-500" />
                    {copy.synced}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF3FB] px-3 py-1 text-xs font-medium text-slate-500">
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-brand" />
                    {copy.twoFa}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2">
                <Link
                  to={copy.logoutTo}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#EEF3FB] px-4 text-sm font-semibold text-navy"
                >
                  <PowerIcon className="h-4 w-4" />
                  {copy.logoutDevice}
                </Link>
                <Link to={copy.logoutTo} className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-rose-500">
                  <LogOutIcon className="h-4 w-4" />
                  {copy.logoutAll}
                </Link>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 text-[11px] font-bold tracking-wide uppercase">
              <span className="text-slate-400">{copy.mentorKicker}</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 normal-case tracking-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {copy.mentorHours}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <img src={copy.mentorPhoto} alt="" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-bold text-navy">{copy.mentorName}</p>
                <p className="text-xs text-slate-400">{copy.mentorRole}</p>
                <p className="text-xs font-semibold text-brand">{copy.mentorFaculty}</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-[#F4F7FC] p-4 text-sm leading-6 text-slate-500">
              {copy.mentorQuote}
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-slate-400" />
                  {copy.mentorEmail}
                </span>
                <button
                  type="button"
                  aria-label={copied ? copy.copied : copy.mentorEmail}
                  onClick={copyEmail}
                  className="text-slate-400 hover:text-navy"
                >
                  {copied ? (
                    <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </button>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                  {copy.mentorSchedule}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {copy.mentorTz}
                  <span className="ml-2">{copy.mentorTzAlt}</span>
                </span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  {copy.mentorPlace}
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                  {copy.mentorMode}
                </span>
              </p>
            </div>
            <button
              type="button"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white"
            >
              <CalendarIcon className="h-4 w-4" />
              {copy.schedule}
            </button>
          </article>

          <article
            ref={sessionRef}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              diagnostic ? 'border-emerald-300' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-sm font-bold text-navy">
                <ActivityIcon className="h-4 w-4 text-brand" />
                {copy.sessionTitle}
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 uppercase">
                {copy.sessionStatus}
              </span>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>{copy.latencyLabel}</span>
                  <span className="font-semibold text-navy">{copy.latencyValue}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${copy.latency}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>{copy.idleLabel}</span>
                  <span className="font-semibold text-navy">{copy.idleValue}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${copy.idle}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <FilterIcon className="h-3.5 w-3.5" />
                {copy.specs}
              </span>
              <span>{copy.version}</span>
            </div>
          </article>

          <article className="rounded-2xl bg-[#E8F1FF] p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-navy">
              <ShieldCheckIcon className="h-4 w-4 text-brand" />
              {copy.policyTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{copy.policyBody}</p>
          </article>
        </aside>
      </div>
    </div>
  )
}
