import { useState } from 'react'
import { organizationEmployeesPage } from '@/constants'
import {
  CheckCircleIcon,
  RepeatIcon,
  TicketIcon,
  UserXIcon,
} from '@/components/ui'

type DeactivateEmployeeModalProps = {
  name: string
  courses: number
  certificates: number
  onCancel: () => void
  onConfirm: (emailNotify: boolean) => void
}

function firstNameFrom(name: string) {
  return name.trim().split(/\s+/)[0] || name
}

export function DeactivateEmployeeModal({
  name,
  courses,
  certificates,
  onCancel,
  onConfirm,
}: DeactivateEmployeeModalProps) {
  const [emailNotify, setEmailNotify] = useState(true)
  const copy = organizationEmployeesPage.deactivateModal
  const firstName = firstNameFrom(name)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-employee-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,40,80,0.18)]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <UserXIcon className="h-5 w-5" />
        </div>

        <h2 id="deactivate-employee-title" className="mt-4 text-xl font-bold text-navy">
          {copy.title(name)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{copy.body(firstName)}</p>

        <ul className="mt-5 space-y-3 rounded-xl bg-slate-50 px-4 py-4">
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{copy.keepRecord(certificates)}</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <TicketIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span>{copy.seatsUsed(firstName, courses)}</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <RepeatIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{copy.seatsPool}</span>
          </li>
        </ul>

        <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={emailNotify}
            onChange={(event) => setEmailNotify(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-brand"
          />
          <span>{copy.emailNotify(firstName)}</span>
        </label>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(emailNotify)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-500 hover:bg-red-100"
          >
            <UserXIcon className="h-4 w-4" />
            {copy.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}
