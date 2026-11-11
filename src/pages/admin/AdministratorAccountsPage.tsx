import { useMemo, useState } from 'react'
import {
  superAdminAdministrators,
  superAdminAdminRoles,
  superAdminAdminSignIns,
  type SuperAdminAdministrator,
  type SuperAdminAdminRole,
} from '@/constants'
import { ContentSelect, ContentTextInput, ContentToggle } from '@/components/common'
import { btnPrimary, cardClass } from './catalogUtils'
import {
  cellClass,
  firstCellClass,
  isValidEmail,
  trClass,
  updateById,
  UsersChartCard,
  UsersField,
  UsersLineChart,
  UsersNote,
  UsersPageShell,
  UsersPerson,
  UsersTable,
  useUsersList,
  usersKpi,
} from './usersShared'

const statusLabel = (status: SuperAdminAdministrator['status']) => (status === 'Invited' ? 'Invite sent' : status)

export function AdminAdministratorAccountsPage() {
  const [rows, setRows] = useState<SuperAdminAdministrator[]>(superAdminAdministrators)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<SuperAdminAdminRole>('Super Admin')
  const [requireTwoFa, setRequireTwoFa] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const list = useUsersList(rows, (row) => `${row.name} ${row.email} ${row.role}`, [])
  const { setNotice } = list

  const kpis = useMemo(() => {
    const active = rows.filter((row) => row.status === 'Active')
    const withTwoFa = active.filter((row) => row.twoFa).length
    const pending = rows.filter((row) => row.status === 'Invited').length
    return [
      usersKpi('total', 'Administrators', String(rows.length), 'Owner and Super Admin accounts'),
      usersKpi('active', 'Active', String(active.length), 'Can sign in today'),
      usersKpi('2fa', '2-step verification', `${withTwoFa} of ${active.length || 0} active`, 'Required before finance and settings'),
      usersKpi('pending', 'Invites pending', String(pending), 'Waiting for the invite email'),
    ]
  }, [rows])

  const send = () => {
    const cleanEmail = email.trim().toLowerCase()
    if (!isValidEmail(cleanEmail)) return setError('Enter a work email like name@maqskillz.com.')
    if (rows.some((row) => row.email === cleanEmail)) return setError(`${cleanEmail} already has an account.`)
    const name = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    setRows((current) => [
      ...current,
      {
        id: `adm-${current.length + 1}`,
        name,
        email: cleanEmail,
        role,
        twoFa: requireTwoFa,
        lastLogin: null,
        lastSeen: 'Never',
        status: 'Invited',
      },
    ])
    setEmail('')
    setError(null)
    setNotice(`Invite sent to ${cleanEmail} as ${role}.`)
  }

  return (
    <UsersPageShell
      page="Administrator Accounts"
      subtitle="Super Admin accounts with owner-level access to finance and settings."
      exportNotice="Administrator accounts exported as CSV (sample)."
      showExport={false}
      notice={list.notice}
      onNotice={setNotice}
      kpis={kpis}
      primary={{ label: 'Invite administrator', onClick: () => document.getElementById('invite-email')?.focus() }}
    >
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={`${cardClass} overflow-hidden`}>
          <UsersTable
            minWidth="min-w-[720px]"
            columns={[
              { label: 'Administrator' },
              { label: 'Role' },
              { label: 'Last sign-in' },
              { label: '2-step' },
              { label: 'Status' },
            ]}
            isEmpty={rows.length === 0}
            emptyText="No administrator accounts yet."
          >
            {rows.map((row) => (
              <tr key={row.id} className={trClass}>
                <td className={firstCellClass}>
                  <UsersPerson name={row.name} email={row.email} />
                </td>
                <td className={cellClass}>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.role === 'Owner' ? 'bg-navy text-white' : 'bg-blue-50 text-brand'
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className={cellClass}>{row.lastSeen}</td>
                <td className={cellClass}>
                  <span className={row.twoFa ? 'font-semibold text-emerald-600' : 'text-slate-300'}>{row.twoFa ? 'On' : '—'}</span>
                </td>
                <td className="px-3 py-3.5">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : row.status === 'Suspended'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {statusLabel(row.status)}
                    </span>
                    {row.status === 'Active' && row.role !== 'Owner' ? (
                      <button
                        type="button"
                        className="text-xs font-semibold text-rose-600 hover:underline"
                        onClick={() => {
                          setRows((current) => updateById(current, row.id, { status: 'Suspended' }))
                          setNotice(`${row.name} suspended. They can no longer sign in.`)
                        }}
                      >
                        Suspend
                      </button>
                    ) : null}
                    {row.status === 'Suspended' ? (
                      <button
                        type="button"
                        className="text-xs font-semibold text-brand hover:underline"
                        onClick={() => {
                          setRows((current) => updateById(current, row.id, { status: 'Active' }))
                          setNotice(`${row.name} reactivated.`)
                        }}
                      >
                        Reactivate
                      </button>
                    ) : null}
                    {row.status === 'Invited' ? (
                      <button
                        type="button"
                        className="text-xs font-semibold text-brand hover:underline"
                        onClick={() => setNotice(`Invite re-sent to ${row.email}.`)}
                      >
                        Resend
                      </button>
                    ) : null}
                  </span>
                </td>
              </tr>
            ))}
          </UsersTable>
        </section>

        <aside className="space-y-4">
          <section className={`${cardClass} p-4`}>
            <h2 className="text-base font-bold text-navy">Invite administrator</h2>
            <div className="mt-4 space-y-3">
              <UsersField label="Work email">
                <ContentTextInput
                  id="invite-email"
                  value={email}
                  invalid={!!error}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@maqskillz.com"
                />
              </UsersField>
              <UsersField label="Role">
                <ContentSelect value={role} onChange={(event) => setRole(event.target.value as SuperAdminAdminRole)}>
                  {superAdminAdminRoles.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </ContentSelect>
              </UsersField>
              <ContentToggle checked={requireTwoFa} onChange={setRequireTwoFa} label="Require 2-step verification" />
              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
              <button type="button" onClick={send} className={`${btnPrimary} w-full`}>
                Send invite
              </button>
              <UsersNote tone="blue">Only the Owner can invite or remove Super Admins, and there is no self-signup.</UsersNote>
            </div>
          </section>
          <UsersChartCard title="Sign-ins this week" subtitle="Administrator sign-ins, Mon to Sun">
            <UsersLineChart
              fill
              points={superAdminAdminSignIns.map((item) => ({ label: item.label, values: [item.value] }))}
              series={[{ label: 'Sign-ins', color: '#2563EB' }]}
            />
          </UsersChartCard>
        </aside>
      </div>
    </UsersPageShell>
  )
}
