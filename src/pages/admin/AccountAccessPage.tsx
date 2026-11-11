import { useState } from 'react'
import { Link } from 'react-router'
import { ContentNotice, ContentSelect } from '@/components/common'
import { BuildingIcon, SaveIcon, ShieldCheckIcon, UserIcon, UsersIcon } from '@/components/ui'
import { paths } from '@/routes/paths'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { UsersPerson } from './usersShared'

type Policy = {
  staffTwoFa: boolean
  orgTwoFa: boolean
  learnerTwoFa: boolean
  googleStudents: boolean
  enterpriseSso: boolean
  idle: string
  passwordLength: string
  lockAfter: string
  unlockAfter: string
}

type Session = {
  id: string
  name: string
  role: string
  device: string
  location: string
  signedIn: string
  current?: boolean
}

const INITIAL_POLICY: Policy = {
  staffTwoFa: true,
  orgTwoFa: true,
  learnerTwoFa: true,
  googleStudents: true,
  enterpriseSso: false,
  idle: '30 minutes idle',
  passwordLength: '10 characters',
  lockAfter: '5 failed attempts',
  unlockAfter: '30 minutes',
}

const INITIAL_SESSIONS: Session[] = [
  { id: 'ses-1', name: 'Faisal M.', role: 'Owner', device: 'Chrome · macOS', location: 'Kuwait City', signedIn: 'Today 9:12', current: true },
  { id: 'ses-2', name: 'Noura A.', role: 'Super Admin', device: 'Safari · iPhone', location: 'Kuwait City', signedIn: 'Today 8:40' },
  { id: 'ses-3', name: 'Sara Mahmoud', role: 'Content Admin', device: 'Edge · Windows', location: 'Salmiya, Kuwait', signedIn: 'Today 8:05' },
  { id: 'ses-4', name: 'Omar Haddad', role: 'Content Admin', device: 'Chrome · Windows', location: 'Dubai, UAE', signedIn: 'Yesterday' },
]

const ROLES = [
  { name: 'Super Admin', detail: 'Everything, including finance and settings', icon: ShieldCheckIcon, tint: 'bg-blue-50 text-brand' },
  { name: 'Content Admin', detail: 'Courses, SCORM, quizzes and Q&A', icon: ShieldCheckIcon, tint: 'bg-violet-50 text-violet-600' },
  { name: 'Organization Admin', detail: "Their own organization's seats and employees", icon: BuildingIcon, tint: 'bg-sky-50 text-sky-600' },
  { name: 'Employee', detail: 'Courses assigned by their organization', icon: UserIcon, tint: 'bg-emerald-50 text-emerald-600' },
  { name: 'Student', detail: 'Courses they bought', icon: UsersIcon, tint: 'bg-slate-100 text-slate-500' },
]

function samePolicy(a: Policy, b: Policy) {
  return (Object.keys(a) as (keyof Policy)[]).every((key) => a[key] === b[key])
}

function PolicySwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-semibold text-navy">{label}</p>
        {description ? <p className="text-xs text-slate-400">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-brand' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

function PolicySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <ContentSelect className="mt-1.5 font-medium" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </ContentSelect>
    </label>
  )
}

export function AdminAccountAccessPage() {
  const [saved, setSaved] = useState<Policy>(INITIAL_POLICY)
  const [policy, setPolicy] = useState<Policy>(INITIAL_POLICY)
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS)
  const [notice, setNotice] = useState<string | null>(null)
  const dirty = !samePolicy(policy, saved)

  const patch = (next: Partial<Policy>) => setPolicy((current) => ({ ...current, ...next }))

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Users & Permissions
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-500">Account Access</span>
          </p>
          <h1 className="mt-2 text-[28px] leading-8 font-bold tracking-tight text-navy">Account Access</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sign-in rules for every account type, and active staff sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-semibold text-slate-500 hover:text-navy disabled:opacity-40"
            disabled={!dirty}
            onClick={() => {
              setPolicy(saved)
              setNotice('Changes discarded.')
            }}
          >
            Discard
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setSaved(policy)
              setNotice('Sign-in policy saved.')
            }}
          >
            <SaveIcon className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </header>

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Sign-in policy</h2>
            <div className="mt-3 divide-y divide-slate-100">
              <PolicySwitch
                label="Require 2-step verification for staff"
                description="Super Admins and Content Admins"
                checked={policy.staffTwoFa}
                onChange={(staffTwoFa) => patch({ staffTwoFa })}
              />
              <PolicySwitch
                label="Require 2-step verification for Organization Admins"
                checked={policy.orgTwoFa}
                onChange={(orgTwoFa) => patch({ orgTwoFa })}
              />
              <PolicySwitch
                label="Offer 2-step verification to students and employees"
                description="Optional for learners"
                checked={policy.learnerTwoFa}
                onChange={(learnerTwoFa) => patch({ learnerTwoFa })}
              />
              <PolicySwitch
                label="Allow Google sign-in for students"
                checked={policy.googleStudents}
                onChange={(googleStudents) => patch({ googleStudents })}
              />
              <PolicySwitch
                label="Single sign-on for Enterprise organizations"
                description="Not set up yet"
                checked={policy.enterpriseSso}
                onChange={(enterpriseSso) => patch({ enterpriseSso })}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PolicySelect
                label="Sign out staff after"
                value={policy.idle}
                options={['15 minutes idle', '30 minutes idle', '1 hour idle', '4 hours idle', 'Never']}
                onChange={(idle) => patch({ idle })}
              />
              <PolicySelect
                label="Minimum password length"
                value={policy.passwordLength}
                options={['8 characters', '10 characters', '12 characters', '14 characters']}
                onChange={(passwordLength) => patch({ passwordLength })}
              />
              <PolicySelect
                label="Lock account after"
                value={policy.lockAfter}
                options={['3 failed attempts', '5 failed attempts', '10 failed attempts']}
                onChange={(lockAfter) => patch({ lockAfter })}
              />
              <PolicySelect
                label="Unlock after"
                value={policy.unlockAfter}
                options={['15 minutes', '30 minutes', '1 hour', 'Manual unlock']}
                onChange={(unlockAfter) => patch({ unlockAfter })}
              />
            </div>
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <h2 className="px-5 pt-5 text-base font-bold text-navy">Active staff sessions</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-slate-100 text-xs font-semibold text-slate-400">
                    <th className="px-5 py-2.5 font-semibold">User</th>
                    <th className="px-3 py-2.5 font-semibold">Device</th>
                    <th className="px-3 py-2.5 font-semibold">Location</th>
                    <th className="px-3 py-2.5 font-semibold">Signed in</th>
                    <th className="px-5 py-2.5 text-right font-semibold"> </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-t border-slate-100">
                      <td className="px-5 py-3">
                        <UsersPerson name={session.name} email={session.role} />
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-600">{session.device}</td>
                      <td className="px-3 py-3 text-sm text-slate-600">{session.location}</td>
                      <td className="px-3 py-3 text-sm text-slate-600">{session.signedIn}</td>
                      <td className="px-5 py-3 text-right">
                        {session.current ? (
                          <span className="text-sm text-slate-400">This device</span>
                        ) : (
                          <button
                            type="button"
                            className="text-sm font-semibold text-brand hover:underline"
                            onClick={() => {
                              setSessions((current) => current.filter((item) => item.id !== session.id))
                              setNotice(`${session.name} signed out.`)
                            }}
                          >
                            Sign out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                        No active staff sessions.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className={`${cardClass} p-4`}>
            <h2 className="text-base font-bold text-navy">Access by role</h2>
            <ul className="mt-3 space-y-3">
              {ROLES.map((role) => (
                <li key={role.name} className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${role.tint}`}>
                    <role.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy">{role.name}</span>
                    <span className="block text-xs text-slate-400">{role.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <Link to={paths.admin.roles} className={`${btnOutline} w-full`}>
            <span aria-hidden className="text-base leading-none">
              ↗
            </span>
            Open Role Permissions
          </Link>
          <p className="flex items-start gap-1.5 text-xs text-slate-400">
            <span className="mt-0.5 inline-grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 text-[10px]">i</span>
            There is no Instructor role. Live classes are hosted by Content Admins.
          </p>
        </aside>
      </div>
    </div>
  )
}
