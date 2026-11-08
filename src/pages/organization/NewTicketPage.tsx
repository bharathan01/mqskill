import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { organizationNewTicketPage } from '@/constants'
import { paths } from '@/routes/paths'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  PaperclipIcon,
  SendIcon,
  UploadIcon,
} from '@/components/ui'

const copy = organizationNewTicketPage
const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy outline-none focus:border-brand'
const selectClass = `${inputClass} appearance-none pr-10`

export function OrganizationNewTicketPage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState(copy.defaults.topic)
  const [related, setRelated] = useState(copy.defaults.related)
  const [subject, setSubject] = useState(copy.defaults.subject)
  const [message, setMessage] = useState(copy.defaults.message)
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>(copy.defaults.urgency)
  const [fileName, setFileName] = useState('')
  const [toast, setToast] = useState('')

  function showToast(text: string) {
    setToast(text)
    window.setTimeout(() => setToast(''), 2200)
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setFileName(file.name)
  }

  function sendTicket() {
    if (!subject.trim() || !message.trim()) return
    showToast(copy.sentToast)
    window.setTimeout(() => navigate(paths.organization.help), 700)
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
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">{copy.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{copy.subtitle}</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.topic}</span>
              <div className="relative">
                <select
                  className={selectClass}
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                >
                  {copy.topics.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.related}</span>
              <div className="relative">
                <select
                  className={selectClass}
                  value={related}
                  onChange={(event) => setRelated(event.target.value)}
                >
                  {copy.relatedOptions.map((item) => (
                    <option key={item.id || 'none'} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.subject}</span>
              <input
                className={inputClass}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder={copy.subjectPlaceholder}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.message}</span>
              <textarea
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={copy.messagePlaceholder}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 text-navy outline-none focus:border-brand"
              />
            </label>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.attachments}</span>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:bg-slate-100">
                <UploadIcon className="h-5 w-5 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">
                  {copy.dropFiles}{' '}
                  <span className="font-semibold text-brand">{copy.browse}</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">{copy.fileHint}</p>
                {fileName ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy">
                    <PaperclipIcon className="h-3.5 w-3.5" />
                    {fileName}
                  </p>
                ) : null}
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFile}
                />
              </label>
            </div>

            <div>
              <span className="mb-2 block text-sm font-semibold text-navy">{copy.urgency}</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['normal', copy.normal, copy.normalDetail],
                    ['urgent', copy.urgent, copy.urgentDetail],
                  ] as const
                ).map(([id, label, detail]) => {
                  const active = urgency === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setUrgency(id)}
                      className={`rounded-xl border p-3.5 text-left transition ${
                        active
                          ? 'border-brand bg-[#F5F9FF] ring-1 ring-brand'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-sm font-semibold text-navy">{label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => navigate(paths.organization.help)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={sendTicket}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <SendIcon className="h-4 w-4" />
              {copy.send}
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <h2 className="text-sm font-bold text-navy">{copy.suggestionsTitle}</h2>
            <ul className="mt-3 space-y-2">
              {copy.suggestions.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-left text-sm font-semibold text-brand hover:text-blue-700"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
            {copy.notifyNote}
          </p>
        </aside>
      </div>
    </div>
  )
}
