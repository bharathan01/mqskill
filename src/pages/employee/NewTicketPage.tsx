import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { employeeNewTicketPage, employeeUser } from '@/constants'
import { paths } from '@/routes/paths'
import { ChevronLeftIcon, PaperclipIcon } from '@/components/ui'

const copy = employeeNewTicketPage

export function EmployeeNewTicketPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<string>(copy.defaults.category)
  const [relatedCourse, setRelatedCourse] = useState<string>(copy.defaults.relatedCourse)
  const [subject, setSubject] = useState<string>(copy.defaults.subject)
  const [message, setMessage] = useState<string>(copy.defaults.message)
  const [priority, setPriority] = useState<'normal' | 'high'>(copy.defaults.priority)
  const [attachmentName, setAttachmentName] = useState('')
  const [toast, setToast] = useState('')

  function handleAttach(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setAttachmentName(file.name)
  }

  function sendTicket() {
    if (!subject.trim() || !message.trim()) return
    setToast(copy.sentToast)
    window.setTimeout(() => {
      navigate(paths.employee.help)
    }, 900)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
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

      <header>
        <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{copy.subtitle}</p>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-navy">{copy.category}</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy outline-none focus:border-brand"
          >
            {copy.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-navy">{copy.relatedCourse}</span>
          <select
            value={relatedCourse}
            onChange={(event) => setRelatedCourse(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy outline-none focus:border-brand"
          >
            {copy.relatedCourses.map((item) => (
              <option key={item.id || 'none'} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-navy">{copy.subject}</span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder={copy.subjectPlaceholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-navy">{copy.message}</span>
          <textarea
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={copy.messagePlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-navy outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </label>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-navy">{copy.attachments}</p>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center hover:bg-slate-100">
            <PaperclipIcon className="h-5 w-5 text-slate-400" />
            <p className="mt-2 text-sm text-slate-600">
              {copy.dropFiles} <span className="font-semibold text-brand">{copy.browse}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">{copy.fileHint}</p>
            <input type="file" className="hidden" onChange={handleAttach} />
          </label>
          {attachmentName ? (
            <p className="text-xs font-semibold text-navy">{attachmentName}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-navy">{copy.priority}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                { id: 'normal' as const, title: copy.normal, detail: copy.normalDetail },
                { id: 'high' as const, title: copy.high, detail: copy.highDetail },
              ]
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPriority(option.id)}
                className={`rounded-xl border px-4 py-3 text-left ${
                  priority === option.id
                    ? 'border-brand bg-[#F5F9FF]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <p className="text-sm font-semibold text-navy">{option.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{option.detail}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">{copy.notifyNote(employeeUser.email)}</p>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Link
            to={paths.employee.help}
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.cancel}
          </Link>
          <button
            type="button"
            onClick={sendTicket}
            className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copy.send}
          </button>
        </div>
      </div>
    </div>
  )
}
