import { useMemo, useState, type FormEvent } from 'react'
import { contentHelpFaqs, contentHelpPage } from '@/constants'
import {
  ContentCard,
  ContentEmptyState,
  ContentField,
  ContentTextArea,
  ContentTextInput,
} from '@/components/common'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CloseIcon,
  FolderIcon,
  HelpCircleIcon,
  InfoIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from '@/components/ui'

const copy = contentHelpPage

type ToastKind = 'success' | 'error' | 'info'

const toastStyles = {
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-800', Icon: CheckCircleIcon },
  error: { box: 'border-rose-200 bg-rose-50 text-rose-800', Icon: AlertTriangleIcon },
  info: { box: 'border-blue-200 bg-[#EFF4FF] text-brand', Icon: InfoIcon },
} as const

const primaryButton =
  'inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700'
const secondaryButton =
  'inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50'

export function ContentHelpSupportPage() {
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(contentHelpFaqs[0].id)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({})
  const [toast, setToast] = useState<{ kind: ToastKind; text: string } | null>(null)
  const [demoToast, setDemoToast] = useState<ToastKind | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [validationValue, setValidationValue] = useState('')
  const [validated, setValidated] = useState(false)

  const faqs = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return contentHelpFaqs.filter(
      (item) => !needle || item.q.toLowerCase().includes(needle) || item.a.toLowerCase().includes(needle),
    )
  }, [query])

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: typeof errors = {}
    if (!subject.trim()) next.subject = copy.subjectRequired
    if (!message.trim()) next.message = copy.messageRequired
    setErrors(next)
    if (Object.keys(next).length) {
      setToast({ kind: 'error', text: 'Please fix the highlighted fields and try again.' })
      return
    }
    setSubject('')
    setMessage('')
    setToast({ kind: 'success', text: copy.sent })
  }

  const demoText = {
    success: copy.toasts.successText,
    error: copy.toasts.errorText,
    info: copy.toasts.infoText,
  } as const

  const validationError = validated && !validationValue.trim() ? copy.validation.error : undefined

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-navy">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
      </header>

      {toast ? (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${toastStyles[toast.kind].box}`}
        >
          <span className="flex items-center gap-2">
            {(() => {
              const Icon = toastStyles[toast.kind].Icon
              return <Icon className="h-4 w-4" />
            })()}
            {toast.text}
          </span>
          <button type="button" aria-label={copy.toasts.dismiss} onClick={() => setToast(null)}>
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-bold text-navy">{copy.faqTitle}</h2>
            <label className="relative min-w-[14rem]">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
              />
            </label>
          </div>
          {faqs.length ? (
            <ul className="divide-y divide-slate-100">
              {faqs.map((faq) => {
                const open = openFaq === faq.id
                return (
                  <li key={faq.id}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-navy">{faq.q}</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open ? <p className="px-5 pb-4 text-sm text-slate-500">{faq.a}</p> : null}
                  </li>
                )
              })}
            </ul>
          ) : (
            <ContentEmptyState
              icon={<HelpCircleIcon className="h-6 w-6" />}
              title="No articles found"
              body="Try different keywords or contact support."
            >
              <button type="button" className={secondaryButton} onClick={() => setQuery('')}>
                Clear search
              </button>
            </ContentEmptyState>
          )}
        </section>

        <ContentCard title={copy.contactTitle} description={copy.contactDescription}>
          <form onSubmit={submit} noValidate className="space-y-4">
            <ContentField label={copy.subject} htmlFor="help-subject" required error={errors.subject}>
              <ContentTextInput
                id="help-subject"
                value={subject}
                invalid={Boolean(errors.subject)}
                onChange={(event) => {
                  setSubject(event.target.value)
                  setErrors((c) => ({ ...c, subject: undefined }))
                }}
              />
            </ContentField>
            <ContentField label={copy.message} htmlFor="help-message" required error={errors.message}>
              <ContentTextArea
                id="help-message"
                rows={4}
                value={message}
                invalid={Boolean(errors.message)}
                onChange={(event) => {
                  setMessage(event.target.value)
                  setErrors((c) => ({ ...c, message: undefined }))
                }}
              />
            </ContentField>
            <button type="submit" className={primaryButton}>
              {copy.send}
            </button>
          </form>
        </ContentCard>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-navy">{copy.statesTitle}</h2>
          <p className="text-sm text-slate-500">{copy.statesSubtitle}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ContentCard title="Toasts">
            <div className="flex flex-wrap gap-2">
              {(['success', 'error', 'info'] as const).map((kind) => (
                <button key={kind} type="button" className={secondaryButton} onClick={() => setDemoToast(kind)}>
                  {copy.toasts[kind]}
                </button>
              ))}
            </div>
            {demoToast ? (
              <div
                role="status"
                className={`mt-4 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${toastStyles[demoToast].box}`}
              >
                <span>{demoText[demoToast]}</span>
                <button type="button" onClick={() => setDemoToast(null)} className="text-xs font-semibold underline-offset-2 hover:underline">
                  {copy.toasts.dismiss}
                </button>
              </div>
            ) : null}
          </ContentCard>

          <ContentCard title={copy.validation.title}>
            <ContentField
              label={copy.validation.label}
              htmlFor="help-validate"
              required
              hint={copy.validation.hint}
              error={validationError}
            >
              <ContentTextInput
                id="help-validate"
                value={validationValue}
                invalid={Boolean(validationError)}
                placeholder={copy.validation.placeholder}
                onChange={(event) => setValidationValue(event.target.value)}
              />
            </ContentField>
            <button type="button" className={`${secondaryButton} mt-3`} onClick={() => setValidated(true)}>
              {copy.validation.check}
            </button>
          </ContentCard>

          <section className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <p className="px-6 pt-5 text-base font-bold text-navy">{copy.empty.title}</p>
            <ContentEmptyState icon={<FolderIcon className="h-6 w-6" />} title={copy.empty.heading} body={copy.empty.body}>
              <button type="button" className={primaryButton}>
                <PlusIcon className="h-4 w-4" />
                {copy.empty.cta}
              </button>
            </ContentEmptyState>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <p className="px-6 pt-5 text-base font-bold text-navy">{copy.error.title}</p>
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <AlertTriangleIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-navy">{copy.error.heading}</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">{copy.error.body}</p>
              <button
                type="button"
                className={`${secondaryButton} mt-5`}
                disabled={retrying}
                onClick={() => {
                  setRetrying(true)
                  setToast({ kind: 'info', text: copy.error.retried })
                  window.setTimeout(() => setRetrying(false), 1200)
                }}
              >
                <RefreshIcon className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
                {copy.error.retry}
              </button>
            </div>
          </section>

          <ContentCard title={copy.loading.title} description={copy.loading.body} className="lg:col-span-2">
            <div className="space-y-3" aria-busy="true">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex animate-pulse items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/5 rounded bg-slate-100" />
                    <div className="h-3 w-3/5 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      </section>
    </div>
  )
}
