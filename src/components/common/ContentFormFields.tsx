import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { ChevronDownIcon } from '@/components/ui'

const baseControl =
  'w-full rounded-lg border bg-white text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10'

type FieldProps = {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}

export function ContentField({ label, htmlFor, required, hint, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

export function ContentTextInput({
  invalid,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      className={`${baseControl} h-10 px-3 ${invalid ? 'border-rose-300' : 'border-slate-200'} ${className}`}
    />
  )
}

export function ContentTextArea({
  invalid,
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      className={`${baseControl} resize-y px-3 py-2.5 ${invalid ? 'border-rose-300' : 'border-slate-200'} ${className}`}
    />
  )
}

export function ContentSelect({
  invalid,
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <span className="relative block">
      <select
        {...props}
        className={`${baseControl} h-10 appearance-none pr-9 pl-3 ${invalid ? 'border-rose-300' : 'border-slate-200'} ${className}`}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </span>
  )
}

type ToggleProps = {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}

export function ContentToggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-navy">{label}</span>
        {description ? <span className="block text-xs text-slate-500">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? 'bg-brand' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}

export function ContentCard({
  title,
  description,
  action,
  children,
  className = '',
}: {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,40,80,0.04)] ${className}`}
    >
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-slate-400">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}
