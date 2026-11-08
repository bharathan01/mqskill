import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import {
  organizationSettingsAdmins,
  organizationSettingsCountries,
  organizationSettingsDepartments,
  organizationSettingsHeads,
  organizationSettingsIdleOptions,
  organizationSettingsIndustries,
  organizationSettingsPage,
  organizationSettingsPasswordAskOptions,
  organizationSettingsPermissions,
  type SettingsTab,
} from '@/constants'
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  FileIcon,
  InfoIcon,
  MailIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
} from '@/components/ui'

const copy = organizationSettingsPage

function Toggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? 'bg-brand' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-sm font-semibold text-navy">{children}</span>
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy outline-none focus:border-brand'
const selectClass = `${inputClass} appearance-none pr-10`

export function OrganizationSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('profile')
  const [toast, setToast] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoName, setLogoName] = useState('')
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contact, setContact] = useState({
    name: copy.defaults.contactName,
    role: copy.defaults.contactRole,
    email: copy.defaults.contactEmail,
    phone: copy.defaults.contactPhone,
  })
  const [contactDraft, setContactDraft] = useState(contact)

  const [companyName, setCompanyName] = useState(copy.defaults.companyName)
  const [website, setWebsite] = useState(copy.defaults.website)
  const [country, setCountry] = useState(copy.defaults.country)
  const [industry, setIndustry] = useState(copy.defaults.industry)

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl)
    }
  }, [logoUrl])

  const [departments, setDepartments] = useState(
    () => organizationSettingsDepartments.map((item) => ({ ...item })),
  )
  const [newDeptName, setNewDeptName] = useState('Customer Service')
  const [newDeptHead, setNewDeptHead] = useState('')
  const [editingDept, setEditingDept] = useState<(typeof departments)[number] | null>(null)
  const [editDeptName, setEditDeptName] = useState('')
  const [editDeptHead, setEditDeptHead] = useState('')

  const [minPassword, setMinPassword] = useState(copy.defaults.minPassword)
  const [requireSymbol, setRequireSymbol] = useState(copy.defaults.requireSymbol)
  const [askChange, setAskChange] = useState(copy.defaults.askChange)
  const [idleTimeout, setIdleTimeout] = useState(copy.defaults.idleTimeout)
  const [companyEmailOnly, setCompanyEmailOnly] = useState(copy.defaults.companyEmailOnly)
  const [twoStep, setTwoStep] = useState<'off' | 'admins' | 'everyone'>(copy.defaults.twoStep)

  const [notificationPrefs, setNotificationPrefs] = useState({
    ...copy.defaults.notifications,
  })
  const [admins, setAdmins] = useState(() =>
    organizationSettingsAdmins.map((item) => ({ ...item })),
  )
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [removeAdmin, setRemoveAdmin] = useState<(typeof admins)[number] | null>(null)

  const tabs = useMemo(
    () =>
      [
        { id: 'profile' as const, label: copy.tabs.profile },
        {
          id: 'departments' as const,
          label: `${copy.tabs.departments} (${departments.length})`,
        },
        {
          id: 'admins' as const,
          label: `${copy.tabs.admins} (${admins.filter((a) => a.role === 'admin').length})`,
        },
        { id: 'security' as const, label: copy.tabs.security },
        { id: 'notifications' as const, label: copy.tabs.notifications },
      ] as const,
    [admins, departments.length],
  )

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function saveChanges() {
    showToast(copy.savedToast)
  }

  function openLogoPicker() {
    logoInputRef.current?.click()
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast(copy.profile.logoInvalidToast)
      return
    }
    setLogoUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
    setLogoName(file.name)
    showToast(copy.profile.logoUploadedToast)
  }

  function removeLogo() {
    setLogoUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
    setLogoName('')
    showToast(copy.profile.logoRemovedToast)
  }

  function contactInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  function openContactModal() {
    setContactDraft(contact)
    setContactModalOpen(true)
  }

  function saveContact() {
    const next = {
      name: contactDraft.name.trim() || contact.name,
      role: contactDraft.role.trim() || contact.role,
      email: contactDraft.email.trim() || contact.email,
      phone: contactDraft.phone.trim() || contact.phone,
    }
    setContact(next)
    setContactModalOpen(false)
    showToast(copy.profile.contactModal.successToast)
  }

  function addDepartment() {
    if (!newDeptName.trim()) return
    const head = organizationSettingsHeads.find((item) => item.id === newDeptHead)
    setDepartments((current) => [
      ...current,
      {
        id: `d${Date.now()}`,
        name: newDeptName.trim(),
        head: head?.name ?? '—',
        initials: head
          ? head.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
          : '—',
        people: 0,
        progress: 0,
      },
    ])
    setNewDeptName('')
    setNewDeptHead('')
    showToast(copy.departments.addedToast)
  }

  function removeDepartment(id: string) {
    setDepartments((current) => current.filter((item) => item.id !== id))
    showToast(copy.departments.deletedToast)
  }

  function openEditDepartment(dept: (typeof departments)[number]) {
    const matchedHead = organizationSettingsHeads.find((item) => item.name === dept.head)
    setEditingDept(dept)
    setEditDeptName(dept.name)
    setEditDeptHead(matchedHead?.id ?? '')
  }

  function saveEditDepartment() {
    if (!editingDept) return
    const head = organizationSettingsHeads.find((item) => item.id === editDeptHead)
    const name = editDeptName.trim() || editingDept.name
    setDepartments((current) =>
      current.map((item) =>
        item.id === editingDept.id
          ? {
              ...item,
              name,
              head: head?.name ?? (editDeptHead ? item.head : '—'),
              initials: head
                ? head.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                : editDeptHead
                  ? item.initials
                  : '—',
              }
          : item,
      ),
    )
    setEditingDept(null)
    showToast(copy.departments.updatedToast)
  }

  function openInviteModal() {
    setInviteName('')
    setInviteEmail('')
    setInviteModalOpen(true)
  }

  function sendAdminInvite() {
    const name = inviteName.trim()
    const email = inviteEmail.trim()
    if (!name || !email) return
    setAdmins((current) => [
      ...current,
      {
        id: `a${Date.now()}`,
        name,
        email,
        initials: contactInitials(name),
        role: 'admin' as const,
        lastSignIn: `Invite sent ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
        twoStep: 'pending' as const,
      },
    ])
    setInviteModalOpen(false)
    showToast(copy.admins.inviteToast)
  }

  function confirmRemoveAdmin() {
    if (!removeAdmin) return
    setAdmins((current) => current.filter((item) => item.id !== removeAdmin.id))
    setRemoveAdmin(null)
    showToast(copy.admins.removedToast)
  }

  async function copyLoginLink() {
    try {
      await navigator.clipboard.writeText(`https://${copy.security.signInUrl}`)
    } catch {
      /* ignore */
    }
    showToast(copy.security.copiedToast)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <header>
        <h1 className="text-3xl font-bold text-navy">{copy.title}</h1>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'profile' ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
            <div>
              <FieldLabel>{copy.profile.logo}</FieldLabel>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleLogoChange}
              />
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={logoName || copy.defaults.companyName}
                    className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white">
                    {copy.profile.logoFallback}
                  </span>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={openLogoPicker}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UploadIcon className="h-4 w-4" />
                      {copy.profile.uploadLogo}
                    </button>
                    {logoUrl ? (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="h-10 rounded-lg px-3 text-sm font-semibold text-slate-500 hover:text-red-600"
                      >
                        {copy.profile.removeLogo}
                      </button>
                    ) : null}
                  </div>
                  {logoName ? (
                    <p className="mt-1.5 text-xs text-slate-500">{logoName}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <FieldLabel>{copy.profile.companyName}</FieldLabel>
                <input
                  className={inputClass}
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </label>
              <label className="block sm:col-span-2">
                <FieldLabel>{copy.profile.website}</FieldLabel>
                <input
                  className={inputClass}
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.profile.country}</FieldLabel>
                <SelectWrap>
                  <select
                    className={selectClass}
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    {organizationSettingsCountries.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
              <label className="block">
                <FieldLabel>{copy.profile.industry}</FieldLabel>
                <SelectWrap>
                  <select
                    className={selectClass}
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                  >
                    {organizationSettingsIndustries.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
            </div>

            <div className="mt-5">
              <FieldLabel>{copy.profile.tradeLicense}</FieldLabel>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand ring-1 ring-slate-200">
                    <FileIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">{copy.defaults.licenseName}</p>
                    <p className="text-xs text-slate-500">{copy.defaults.licenseSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckIcon className="h-3 w-3" />
                    {copy.profile.checked}
                  </span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand hover:text-blue-700"
                  >
                    {copy.profile.replace}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={saveChanges}
                className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {copy.save}
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h2 className="text-sm font-bold text-navy">{copy.profile.mainContact}</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                  {contactInitials(contact.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{contact.email}</p>
              <p className="mt-1 text-sm text-slate-600">{contact.phone}</p>
              <button
                type="button"
                onClick={openContactModal}
                className="mt-3 text-sm font-semibold text-brand hover:text-blue-700"
              >
                {copy.profile.changeContact}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h2 className="text-sm font-bold text-navy">{copy.profile.account}</h2>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{copy.profile.orgId}</dt>
                  <dd className="font-semibold text-navy">{copy.defaults.orgId}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{copy.profile.memberSince}</dt>
                  <dd className="font-semibold text-navy">{copy.defaults.memberSince}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{copy.profile.employeeLimit}</dt>
                  <dd className="font-semibold text-navy">{copy.defaults.employeeLimit}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{copy.profile.billing}</dt>
                  <dd className="font-semibold text-navy">{copy.defaults.billing}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-slate-500">{copy.profile.closeHint}</p>
            </div>
          </aside>
        </div>
      ) : null}

      {tab === 'departments' ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {copy.departments.headers.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="px-5 py-3 font-semibold whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5 font-semibold text-navy">{dept.name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                            {dept.initials}
                          </span>
                          <span className="text-slate-700">{dept.head}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{dept.people}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-[8rem] items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <div
                              className="h-1.5 rounded-full bg-brand"
                              style={{ width: `${dept.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {dept.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            aria-label="Edit department"
                            onClick={() => openEditDepartment(dept)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete department"
                            onClick={() => removeDepartment(dept.id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
              <h2 className="text-base font-bold text-navy">{copy.departments.addTitle}</h2>
              <label className="mt-4 block">
                <FieldLabel>{copy.departments.name}</FieldLabel>
                <input
                  className={inputClass}
                  value={newDeptName}
                  onChange={(event) => setNewDeptName(event.target.value)}
                  placeholder={copy.departments.namePlaceholder}
                />
              </label>
              <label className="mt-3 block">
                <FieldLabel>{copy.departments.head}</FieldLabel>
                <SelectWrap>
                  <select
                    className={selectClass}
                    value={newDeptHead}
                    onChange={(event) => setNewDeptHead(event.target.value)}
                  >
                    <option value="">{copy.departments.headPlaceholder}</option>
                    {organizationSettingsHeads.map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.name}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
              <button
                type="button"
                onClick={addDepartment}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.departments.add}
              </button>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-500">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p>{copy.departments.tip}</p>
            </div>
          </aside>
        </div>
      ) : null}

      {tab === 'admins' ? (
        <div className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-navy">{copy.admins.title}</h2>
              <button
                type="button"
                onClick={openInviteModal}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.admins.invite}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {copy.admins.headers.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="px-5 py-3 font-semibold whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                            {admin.initials}
                          </span>
                          <div>
                            <p className="font-semibold text-navy">{admin.name}</p>
                            <p className="text-xs text-slate-500">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            admin.role === 'owner'
                              ? 'bg-navy text-white'
                              : 'bg-[#EAF2FF] text-brand'
                          }`}
                        >
                          {admin.role === 'owner' ? copy.admins.owner : copy.admins.admin}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{admin.lastSignIn}</td>
                      <td className="px-5 py-3.5">
                        {admin.twoStep === 'pending' ? (
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {copy.admins.twoStepPending}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-emerald-600">
                            {copy.admins.twoStepOn}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {admin.role === 'owner' ? null : (
                          <div className="flex items-center justify-end gap-3">
                            {admin.twoStep === 'pending' ? (
                              <button
                                type="button"
                                onClick={() => showToast(copy.admins.resendToast)}
                                className="text-sm font-semibold text-brand hover:text-blue-700"
                              >
                                {copy.admins.resend}
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => setRemoveAdmin(admin)}
                              className="text-sm font-semibold text-red-600 hover:text-red-700"
                            >
                              {copy.admins.removeAccess}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-navy">{copy.admins.rolesTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                    {copy.admins.roleHeaders.map((header) => (
                      <th key={header} className="px-5 py-3 font-semibold whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {organizationSettingsPermissions.map((permission) => (
                    <tr key={permission.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3 text-slate-700">{permission.label}</td>
                      <td className="px-5 py-3">
                        {permission.owner ? (
                          <CheckIcon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {permission.admin ? (
                          <CheckIcon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}

      {tab === 'security' ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-bold text-navy">{copy.security.signInTitle}</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-navy ring-1 ring-slate-200">
                {copy.security.signInUrl}
              </code>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyLoginLink}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <CopyIcon className="h-4 w-4" />
                  {copy.security.copyLink}
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <MailIcon className="h-4 w-4" />
                  {copy.security.emailEmployees}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-navy">{copy.security.passwordsTitle}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>{copy.security.minLength}</FieldLabel>
                <input
                  className={inputClass}
                  value={minPassword}
                  onChange={(event) => setMinPassword(event.target.value)}
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.security.askChange}</FieldLabel>
                <SelectWrap>
                  <select
                    className={selectClass}
                    value={askChange}
                    onChange={(event) => setAskChange(event.target.value)}
                  >
                    {organizationSettingsPasswordAskOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-700">{copy.security.requireSymbol}</p>
              <Toggle on={requireSymbol} onChange={setRequireSymbol} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-navy">{copy.security.sessionsTitle}</h2>
            <label className="mt-4 block max-w-sm">
              <FieldLabel>{copy.security.idleTimeout}</FieldLabel>
              <SelectWrap>
                <select
                  className={selectClass}
                  value={idleTimeout}
                  onChange={(event) => setIdleTimeout(event.target.value)}
                >
                  {organizationSettingsIdleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </label>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-700">{copy.security.companyEmailOnly}</p>
                {companyEmailOnly ? (
                  <span className="mt-1 inline-flex rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-semibold text-brand">
                    {copy.defaults.companyDomain}
                  </span>
                ) : null}
              </div>
              <Toggle on={companyEmailOnly} onChange={setCompanyEmailOnly} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-navy">{copy.security.twoStepTitle}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ['off', copy.security.twoStepOff],
                  ['admins', copy.security.twoStepAdmins],
                  ['everyone', copy.security.twoStepEveryone],
                ] as const
              ).map(([id, label]) => {
                const active = twoStep === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTwoStep(id)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-brand text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={saveChanges}
              className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {copy.save}
            </button>
          </div>
        </section>
      ) : null}

      {tab === 'notifications' ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] sm:p-6">
          <h2 className="text-base font-bold text-navy">{copy.notifications.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{copy.notifications.subtitle}</p>
          <ul className="mt-5 divide-y divide-slate-100">
            {copy.notifications.rules.map((rule) => (
              <li
                key={rule.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold text-navy">{rule.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{rule.detail}</p>
                </div>
                <Toggle
                  on={notificationPrefs[rule.id as keyof typeof notificationPrefs]}
                  onChange={(value) =>
                    setNotificationPrefs((current) => ({ ...current, [rule.id]: value }))
                  }
                />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={saveChanges}
              className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {copy.save}
            </button>
          </div>
        </section>
      ) : null}

      {inviteModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close invite admin"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setInviteModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-admin-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,40,80,0.18)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="invite-admin-title" className="text-lg font-bold text-navy">
                  {copy.admins.inviteModal.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{copy.admins.inviteModal.subtitle}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setInviteModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block">
                <FieldLabel>{copy.admins.inviteModal.name}</FieldLabel>
                <input
                  className={inputClass}
                  value={inviteName}
                  onChange={(event) => setInviteName(event.target.value)}
                  placeholder={copy.admins.inviteModal.namePlaceholder}
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.admins.inviteModal.email}</FieldLabel>
                <input
                  type="email"
                  className={inputClass}
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder={copy.admins.inviteModal.emailPlaceholder}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.admins.inviteModal.cancel}
              </button>
              <button
                type="button"
                onClick={sendAdminInvite}
                disabled={!inviteName.trim() || !inviteEmail.trim()}
                className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.admins.inviteModal.send}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {removeAdmin ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close remove access"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setRemoveAdmin(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-admin-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,40,80,0.18)]"
          >
            <h2 id="remove-admin-title" className="text-lg font-bold text-navy">
              {copy.admins.removeModal.title(removeAdmin.name)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {copy.admins.removeModal.body(removeAdmin.name)}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRemoveAdmin(null)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.admins.removeModal.cancel}
              </button>
              <button
                type="button"
                onClick={confirmRemoveAdmin}
                className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              >
                {copy.admins.removeModal.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingDept ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close edit department"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setEditingDept(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-department-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,40,80,0.18)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="edit-department-title" className="text-lg font-bold text-navy">
                  {copy.departments.editTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{copy.departments.editSubtitle}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setEditingDept(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <FieldLabel>{copy.departments.name}</FieldLabel>
                <input
                  className={inputClass}
                  value={editDeptName}
                  onChange={(event) => setEditDeptName(event.target.value)}
                  placeholder={copy.departments.namePlaceholder}
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.departments.head}</FieldLabel>
                <SelectWrap>
                  <select
                    className={selectClass}
                    value={editDeptHead}
                    onChange={(event) => setEditDeptHead(event.target.value)}
                  >
                    <option value="">{copy.departments.headPlaceholder}</option>
                    {organizationSettingsHeads.map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.name}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.departments.editCancel}
              </button>
              <button
                type="button"
                onClick={saveEditDepartment}
                className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {copy.departments.editSave}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {contactModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close change contact"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setContactModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-contact-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,40,80,0.18)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-brand">
                  <UserIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="change-contact-title" className="text-lg font-bold text-navy">
                    {copy.profile.contactModal.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {copy.profile.contactModal.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setContactModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <FieldLabel>{copy.profile.contactModal.name}</FieldLabel>
                <input
                  className={inputClass}
                  value={contactDraft.name}
                  onChange={(event) =>
                    setContactDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.profile.contactModal.role}</FieldLabel>
                <input
                  className={inputClass}
                  value={contactDraft.role}
                  onChange={(event) =>
                    setContactDraft((current) => ({ ...current, role: event.target.value }))
                  }
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.profile.contactModal.email}</FieldLabel>
                <input
                  type="email"
                  className={inputClass}
                  value={contactDraft.email}
                  onChange={(event) =>
                    setContactDraft((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>
              <label className="block">
                <FieldLabel>{copy.profile.contactModal.phone}</FieldLabel>
                <input
                  type="tel"
                  className={inputClass}
                  value={contactDraft.phone}
                  onChange={(event) =>
                    setContactDraft((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.profile.contactModal.cancel}
              </button>
              <button
                type="button"
                onClick={saveContact}
                className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {copy.profile.contactModal.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
