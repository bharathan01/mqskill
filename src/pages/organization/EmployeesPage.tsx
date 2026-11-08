import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import {
  employeeImportTemplateHeaders,
  employeeImportTemplateRows,
  organizationAssignableCourses,
  organizationEmployeeCourses,
  organizationEmployeeDepartments,
  organizationEmployees,
  organizationEmployeesPage,
  type EmployeeStatus,
  type OrganizationEmployee,
} from '@/constants'
import { organizationEmployeePath } from '@/routes/paths'
import { DeactivateEmployeeModal } from '@/components/common'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DownloadIcon,
  MailIcon,
  MoreVerticalIcon,
  RefreshIcon,
  SearchIcon,
  UploadIcon,
  UserIcon,
} from '@/components/ui'

type StatusTab = 'all' | EmployeeStatus
type Panel = 'none' | 'add' | 'bulk' | 'assign'
type ConfirmAction = 'none' | 'resend' | 'deactivate'

const statusClass = {
  active: 'bg-emerald-50 text-emerald-700',
  invited: 'bg-amber-50 text-amber-700',
  deactivated: 'bg-slate-100 text-slate-500',
} as const

const statusDotClass = {
  active: 'bg-emerald-500',
  invited: 'bg-amber-500',
  deactivated: 'bg-slate-400',
} as const

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

const iconFieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'NA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function downloadEmployeeTemplate() {
  const rows = [
    employeeImportTemplateHeaders.join(','),
    ...employeeImportTemplateRows.map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
    ),
  ]
  const blob = new Blob([`\uFEFF${rows.join('\n')}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'maqskillz-employee-import-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function parseEmployeeCsv(text: string) {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length <= 1) return [] as Array<{
    name: string
    email: string
    department: string
    jobTitle: string
    employeeId: string
  }>

  return lines.slice(1).flatMap((line) => {
    const cells = line.match(/("([^"]|"")*"|[^,]*)/g)?.map((cell) =>
      cell.replace(/^"|"$/g, '').replaceAll('""', '"').trim(),
    )
    if (!cells || cells.length < 3) return []
    const [name = '', email = '', department = '', jobTitle = '', employeeId = ''] = cells
    if (!name || !email) return []
    return [{ name, email, department, jobTitle, employeeId }]
  })
}

export function OrganizationEmployeesPage() {
  const [employees, setEmployees] = useState<OrganizationEmployee[]>(() => [
    ...organizationEmployees,
  ])
  const [tab, setTab] = useState<StatusTab>('all')
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('all')
  const [course, setCourse] = useState('all')
  const [page, setPage] = useState(1)
  const [panel, setPanel] = useState<Panel>('none')
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; openUp: boolean } | null>(
    null,
  )
  const [actionTargetId, setActionTargetId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>('none')
  const [assignCourseIds, setAssignCourseIds] = useState<string[]>([])
  const [assignError, setAssignError] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [formDepartment, setFormDepartment] = useState(
    organizationEmployeeDepartments[0] ?? 'Operations',
  )
  const [jobTitle, setJobTitle] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [assignedCourses, setAssignedCourses] = useState<string[]>([])
  const [sendInvite, setSendInvite] = useState(true)
  const [formError, setFormError] = useState('')

  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkError, setBulkError] = useState('')
  const [bulkMessage, setBulkMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const pageSize = organizationEmployeesPage.pageSize

  function closeMenu() {
    setMenuOpenId(null)
    setMenuPos(null)
  }

  function openRowMenu(id: string, button: HTMLButtonElement) {
    const rect = button.getBoundingClientRect()
    const menuWidth = 192
    const estimatedHeight = 140
    const gap = 4
    const openUp = rect.bottom + estimatedHeight + gap > window.innerHeight - 12
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8,
    )
    setMenuPos({
      top: openUp ? rect.top - gap : rect.bottom + gap,
      left,
      openUp,
    })
    setMenuOpenId(id)
  }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!menuOpenId) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (menuButtonRefs.current[menuOpenId]?.contains(target)) return
      closeMenu()
    }

    function handleReposition() {
      const button = menuButtonRefs.current[menuOpenId]
      if (!button) {
        closeMenu()
        return
      }
      openRowMenu(menuOpenId, button)
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [menuOpenId])

  const counts = useMemo(() => {
    const active = employees.filter((item) => item.status === 'active').length
    const invited = employees.filter((item) => item.status === 'invited').length
    const deactivated = employees.filter((item) => item.status === 'deactivated').length
    return {
      all: employees.length,
      active,
      invited,
      deactivated,
    }
  }, [employees])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return employees.filter((employee) => {
      if (tab !== 'all' && employee.status !== tab) return false
      if (department !== 'all' && employee.department !== department) return false
      if (course !== 'all' && employee.courses === 0) return false
      if (!needle) return true
      return (
        employee.name.toLowerCase().includes(needle) ||
        employee.email.toLowerCase().includes(needle)
      )
    })
  }, [employees, tab, query, department, course])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)
  const actionEmployee = employees.find((employee) => employee.id === actionTargetId) ?? null
  const menuEmployee = employees.find((employee) => employee.id === menuOpenId) ?? null

  function resetAddForm() {
    setFullName('')
    setEmail('')
    setFormDepartment(organizationEmployeeDepartments[0] ?? 'Operations')
    setJobTitle('')
    setEmployeeId('')
    setAssignedCourses([])
    setSendInvite(true)
    setFormError('')
  }

  function closePanel() {
    setPanel('none')
    setFormError('')
    setBulkError('')
    setBulkMessage('')
    setBulkFile(null)
    setAssignCourseIds([])
    setAssignError('')
    setActionTargetId(null)
  }

  function closeConfirm() {
    setConfirmAction('none')
    setActionTargetId(null)
  }

  function openAssign(id: string) {
    setActionTargetId(id)
    setAssignCourseIds([])
    setAssignError('')
    closeMenu()
    setPanel('assign')
  }

  function openConfirm(id: string, action: 'resend' | 'deactivate') {
    closeMenu()
    setActionTargetId(id)
    setConfirmAction(action)
  }

  function handleAssignCourses(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!actionTargetId) return
    if (assignCourseIds.length === 0) {
      setAssignError(organizationEmployeesPage.actions.assignRequired)
      return
    }
    setEmployees((current) =>
      current.map((employee) => {
        if (employee.id !== actionTargetId) return employee
        if (employee.status === 'deactivated') return employee
        return {
          ...employee,
          courses: employee.courses + assignCourseIds.length,
          progress: employee.progress === 0 ? 8 : Math.min(employee.progress + 5, 100),
          lastActive: 'Today',
          status: employee.status === 'invited' ? 'active' : employee.status,
        }
      }),
    )
    closePanel()
    setToast(organizationEmployeesPage.actions.assignSuccess)
  }

  function confirmResendInvitation() {
    if (!actionEmployee || actionEmployee.status !== 'invited') {
      setToast(organizationEmployeesPage.actions.resendNone)
      closeConfirm()
      return
    }
    setToast(`${actionEmployee.name}: ${organizationEmployeesPage.actions.resendSuccess}`)
    closeConfirm()
  }

  function confirmDeactivate(_emailNotify: boolean) {
    if (!actionTargetId) return
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === actionTargetId
          ? { ...employee, status: 'deactivated' as const }
          : employee,
      ),
    )
    setToast(organizationEmployeesPage.actions.deactivateSuccess)
    closeConfirm()
  }

  function handleReactivate(id: string) {
    closeMenu()
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === id
          ? { ...employee, status: 'active' as const, lastActive: 'Today' }
          : employee,
      ),
    )
    setToast(organizationEmployeesPage.actions.reactivateSuccess)
  }

  function changeTab(next: StatusTab) {
    setTab(next)
    setPage(1)
  }

  function refreshList() {
    setRefreshing(true)
    window.setTimeout(() => {
      setEmployees((current) => [...current])
      setPage(1)
      setRefreshing(false)
      setToast('Employee list refreshed')
    }, 450)
  }

  function handleAddEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!fullName.trim() || !email.trim() || !formDepartment) {
      setFormError(organizationEmployeesPage.add.required)
      return
    }
    if (employees.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
      setFormError(organizationEmployeesPage.add.duplicate)
      return
    }

    const nextEmployee: OrganizationEmployee = {
      id: `local-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      initials: initialsFromName(fullName),
      department: formDepartment,
      courses: assignedCourses.length,
      progress: 0,
      certificates: 0,
      lastActive: sendInvite ? 'Never' : 'Today',
      status: sendInvite ? 'invited' : 'active',
    }

    setEmployees((current) => [nextEmployee, ...current])
    setTab('all')
    setPage(1)
    resetAddForm()
    closePanel()
    setToast(`${nextEmployee.name} added to employees`)
  }

  async function handleBulkImport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!bulkFile) {
      setBulkError(organizationEmployeesPage.bulk.requiredFile)
      return
    }

    try {
      const text = await bulkFile.text()
      const rows = parseEmployeeCsv(text)
      if (rows.length === 0) {
        setBulkError(organizationEmployeesPage.bulk.invalidFile)
        return
      }

      const existingEmails = new Set(employees.map((item) => item.email.toLowerCase()))
      const imported: OrganizationEmployee[] = []
      for (const row of rows) {
        const emailValue = row.email.toLowerCase()
        if (existingEmails.has(emailValue)) continue
        existingEmails.add(emailValue)
        imported.push({
          id: `import-${Date.now()}-${imported.length}`,
          name: row.name,
          email: emailValue,
          initials: initialsFromName(row.name),
          department: row.department || 'Operations',
          courses: 0,
          progress: 0,
          certificates: 0,
          lastActive: 'Never',
          status: 'invited',
        })
      }

      if (imported.length === 0) {
        setBulkError(organizationEmployeesPage.add.duplicate)
        return
      }

      setEmployees((current) => [...imported, ...current])
      setTab('all')
      setPage(1)
      setBulkFile(null)
      setBulkError('')
      setBulkMessage(`${imported.length} ${organizationEmployeesPage.bulk.success}`)
      closePanel()
      setToast(`${imported.length} ${organizationEmployeesPage.bulk.success}`)
    } catch {
      setBulkError(organizationEmployeesPage.bulk.invalidFile)
    }
  }

  return (
    <div className="relative space-y-5">
      {toast ? (
        <div className="fixed right-6 bottom-6 z-50 rounded-xl bg-navy px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
            {organizationEmployeesPage.eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {organizationEmployeesPage.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {counts.all} {organizationEmployeesPage.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={refreshList}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {organizationEmployeesPage.refresh}
          </button>
          <button
            type="button"
            onClick={() => {
              resetAddForm()
              setBulkError('')
              setBulkMessage('')
              setPanel('bulk')
            }}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {organizationEmployeesPage.bulkUpload}
          </button>
          <button
            type="button"
            onClick={() => {
              resetAddForm()
              setPanel('add')
            }}
            className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {organizationEmployeesPage.addEmployee}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {organizationEmployeesPage.tabs.map((item) => {
          const count = counts[item.id]
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => changeTab(item.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? 'bg-brand text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label} ({count})
            </button>
          )
        })}
      </div>

      <section
        className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)] transition ${
          refreshing ? 'opacity-60' : ''
        }`}
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-5">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder={organizationEmployeesPage.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <select
                value={department}
                onChange={(event) => {
                  setDepartment(event.target.value)
                  setPage(1)
                }}
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm text-slate-700 outline-none focus:border-brand"
              >
                <option value="all">{organizationEmployeesPage.allDepartments}</option>
                {organizationEmployeeDepartments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
            <label className="relative">
              <select
                value={course}
                onChange={(event) => {
                  setCourse(event.target.value)
                  setPage(1)
                }}
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm text-slate-700 outline-none focus:border-brand"
              >
                <option value="all">{organizationEmployeesPage.anyCourse}</option>
                {organizationEmployeeCourses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <DownloadIcon className="h-4 w-4" />
              {organizationEmployeesPage.export}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                {organizationEmployeesPage.headers.map((header) => (
                  <th
                    key={header}
                    className="px-3 py-3 font-semibold whitespace-nowrap first:pl-4 first:lg:pl-5"
                  >
                    {header}
                  </th>
                ))}
                <th className="w-12 px-4 py-3 lg:px-5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                    {organizationEmployeesPage.empty}
                  </td>
                </tr>
              ) : (
                pageRows.map((employee) => {
                  return (
                    <tr
                      key={employee.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-3 py-3.5 first:pl-4 first:lg:pl-5">
                        <Link
                          to={organizationEmployeePath(employee.id)}
                          className="flex min-w-[14rem] items-center gap-3 rounded-lg outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand/30"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-bold text-brand">
                            {employee.initials}
                          </span>
                          <span>
                            <span className="block font-semibold text-navy">{employee.name}</span>
                            <span className="block text-xs text-slate-400">{employee.email}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{employee.department}</td>
                      <td className="px-3 py-3.5 text-slate-600">{employee.courses}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex min-w-[8rem] items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-slate-100">
                            <div
                              className={`h-2 rounded-full ${
                                employee.progress === 100 ? 'bg-emerald-500' : 'bg-brand'
                              }`}
                              style={{ width: `${employee.progress}%` }}
                            />
                          </div>
                          <span className="w-9 text-right text-xs font-semibold text-slate-600">
                            {employee.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{employee.certificates}</td>
                      <td className="px-3 py-3.5 whitespace-nowrap text-slate-500">
                        {employee.lastActive}
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[employee.status]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDotClass[employee.status]}`}
                          />
                          {organizationEmployeesPage.statusLabels[employee.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 lg:px-5">
                        <button
                          type="button"
                          ref={(node) => {
                            menuButtonRefs.current[employee.id] = node
                          }}
                          onClick={(event) => {
                            if (menuOpenId === employee.id) {
                              closeMenu()
                              return
                            }
                            openRowMenu(employee.id, event.currentTarget)
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          aria-label={`Actions for ${employee.name}`}
                          aria-expanded={menuOpenId === employee.id}
                        >
                          <MoreVerticalIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-5">
          <p className="text-sm text-slate-500">
            {organizationEmployeesPage.showing}{' '}
            {filtered.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, filtered.length)}{' '}
            {organizationEmployeesPage.of} {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              {organizationEmployeesPage.previous}
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {organizationEmployeesPage.next}
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {panel !== 'none' ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-slate-900/30"
            onClick={closePanel}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-[-12px_0_40px_rgba(15,40,80,0.16)]">
            {panel === 'add' ? (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="text-xl font-bold text-navy">
                      {organizationEmployeesPage.add.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {organizationEmployeesPage.add.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <form
                  className="flex min-h-0 flex-1 flex-col"
                  onSubmit={handleAddEmployee}
                >
                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                    <label className="block text-sm font-semibold text-slate-900">
                      {organizationEmployeesPage.add.fullName}
                      <span className="relative mt-1.5 block">
                        <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(event) => {
                            setFullName(event.target.value)
                            setFormError('')
                          }}
                          placeholder={organizationEmployeesPage.add.fullNamePlaceholder}
                          className={iconFieldClass}
                        />
                      </span>
                    </label>

                    <label className="block text-sm font-semibold text-slate-900">
                      {organizationEmployeesPage.add.email}
                      <span className="relative mt-1.5 block">
                        <MailIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            setFormError('')
                          }}
                          placeholder={organizationEmployeesPage.add.emailPlaceholder}
                          className={iconFieldClass}
                        />
                      </span>
                      <span className="mt-1.5 block text-xs font-normal text-slate-400">
                        {organizationEmployeesPage.add.emailHint}
                      </span>
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        {organizationEmployeesPage.add.department}
                        <select
                          value={formDepartment}
                          onChange={(event) => setFormDepartment(event.target.value)}
                          className={`${fieldClass} mt-1.5`}
                        >
                          {organizationEmployeeDepartments.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-semibold text-slate-900">
                        {organizationEmployeesPage.add.jobTitle}
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(event) => setJobTitle(event.target.value)}
                          placeholder={organizationEmployeesPage.add.jobTitlePlaceholder}
                          className={`${fieldClass} mt-1.5`}
                        />
                      </label>
                    </div>

                    <label className="block text-sm font-semibold text-slate-900">
                      {organizationEmployeesPage.add.employeeId}
                      <span className="relative mt-1.5 block">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-slate-400">
                          #
                        </span>
                        <input
                          type="text"
                          value={employeeId}
                          onChange={(event) => setEmployeeId(event.target.value)}
                          placeholder={organizationEmployeesPage.add.employeeIdPlaceholder}
                          className={iconFieldClass}
                        />
                      </span>
                    </label>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {organizationEmployeesPage.add.assignCourses}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {organizationAssignableCourses.map((item) => {
                          const checked = assignedCourses.includes(item.id)
                          return (
                            <li key={item.id}>
                              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 hover:bg-slate-50">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    setAssignedCourses((current) =>
                                      checked
                                        ? current.filter((id) => id !== item.id)
                                        : [...current, item.id],
                                    )
                                  }
                                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-medium text-navy">
                                    {item.title}
                                  </span>
                                  <span className="mt-0.5 block text-xs text-slate-400">
                                    {item.freeSeats} {organizationEmployeesPage.add.freeSeats}
                                  </span>
                                </span>
                              </label>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3">
                      <span className="text-sm font-semibold text-slate-900">
                        {organizationEmployeesPage.add.sendInvite}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={sendInvite}
                        onClick={() => setSendInvite((current) => !current)}
                        className={`relative h-6 w-11 rounded-full transition ${
                          sendInvite ? 'bg-brand' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
                            sendInvite ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {formError ? (
                      <p className="text-sm font-medium text-red-600">{formError}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {organizationEmployeesPage.add.cancel}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      {organizationEmployeesPage.add.submit}
                    </button>
                  </div>
                </form>
              </>
            ) : panel === 'bulk' ? (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="text-xl font-bold text-navy">
                      {organizationEmployeesPage.bulk.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {organizationEmployeesPage.bulk.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleBulkImport}>
                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                    <button
                      type="button"
                      onClick={downloadEmployeeTemplate}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand bg-brand/5 px-4 py-3 text-sm font-semibold text-brand hover:bg-brand/10"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      {organizationEmployeesPage.bulk.downloadTemplate}
                    </button>

                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                      <UploadIcon className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="mt-3 text-sm font-semibold text-navy">
                        {organizationEmployeesPage.bulk.uploadLabel}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {organizationEmployeesPage.bulk.uploadHint}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls,text/csv"
                        className="hidden"
                        onChange={(event) => {
                          setBulkFile(event.target.files?.[0] ?? null)
                          setBulkError('')
                          setBulkMessage('')
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-white"
                      >
                        {organizationEmployeesPage.bulk.chooseFile}
                      </button>
                      {bulkFile ? (
                        <p className="mt-3 text-xs font-medium text-slate-600">
                          {organizationEmployeesPage.bulk.selectedFile}: {bulkFile.name}
                        </p>
                      ) : null}
                    </div>

                    {bulkError ? (
                      <p className="text-sm font-medium text-red-600">{bulkError}</p>
                    ) : null}
                    {bulkMessage ? (
                      <p className="text-sm font-medium text-emerald-600">{bulkMessage}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {organizationEmployeesPage.bulk.cancel}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      {organizationEmployeesPage.bulk.import}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="text-xl font-bold text-navy">
                      {organizationEmployeesPage.actions.assignTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {organizationEmployeesPage.actions.assignSubtitle}
                      {actionEmployee ? ` (${actionEmployee.name})` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleAssignCourses}>
                  <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                    {organizationAssignableCourses.map((item) => {
                      const checked = assignCourseIds.includes(item.id)
                      return (
                        <label
                          key={item.id}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setAssignError('')
                              setAssignCourseIds((current) =>
                                checked
                                  ? current.filter((id) => id !== item.id)
                                  : [...current, item.id],
                              )
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-navy">{item.title}</span>
                            <span className="mt-0.5 block text-xs text-slate-400">
                              {item.freeSeats} {organizationEmployeesPage.add.freeSeats}
                            </span>
                          </span>
                        </label>
                      )
                    })}
                    {assignError ? (
                      <p className="text-sm font-medium text-red-600">{assignError}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {organizationEmployeesPage.actions.cancel}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      {organizationEmployeesPage.actions.assignSubmit}
                    </button>
                  </div>
                </form>
              </>
            )}
          </aside>
        </div>
      ) : null}

      {menuEmployee && menuPos
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              className="fixed z-[80] w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_30px_rgba(15,40,80,0.14)]"
              style={{
                top: menuPos.top,
                left: menuPos.left,
                transform: menuPos.openUp ? 'translateY(-100%)' : undefined,
              }}
            >
              <Link
                to={organizationEmployeePath(menuEmployee.id)}
                role="menuitem"
                onClick={closeMenu}
                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                View profile
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => openAssign(menuEmployee.id)}
                className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {organizationEmployeesPage.assignCourse}
              </button>
              {menuEmployee.status === 'invited' ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openConfirm(menuEmployee.id, 'resend')}
                  className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {organizationEmployeesPage.resendInvitation}
                </button>
              ) : null}
              {menuEmployee.status === 'deactivated' ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleReactivate(menuEmployee.id)}
                  className="block w-full px-3.5 py-2.5 text-left text-sm text-brand hover:bg-slate-50"
                >
                  {organizationEmployeesPage.reactivate}
                </button>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openConfirm(menuEmployee.id, 'deactivate')}
                  className="block w-full px-3.5 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  {organizationEmployeesPage.deactivate}
                </button>
              )}
            </div>,
            document.body,
          )
        : null}

      {confirmAction === 'resend' && actionEmployee ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeConfirm}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-confirm-title"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="employee-confirm-title" className="text-lg font-bold text-navy">
              {organizationEmployeesPage.actions.resendConfirmTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {organizationEmployeesPage.actions.resendConfirmBody}
            </p>
            <p className="mt-3 text-sm font-semibold text-navy">{actionEmployee.name}</p>
            <p className="text-xs text-slate-400">{actionEmployee.email}</p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeConfirm}
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {organizationEmployeesPage.actions.cancel}
              </button>
              <button
                type="button"
                onClick={confirmResendInvitation}
                className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {organizationEmployeesPage.actions.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmAction === 'deactivate' && actionEmployee ? (
        <DeactivateEmployeeModal
          name={actionEmployee.name}
          courses={actionEmployee.courses}
          certificates={actionEmployee.certificates}
          onCancel={closeConfirm}
          onConfirm={confirmDeactivate}
        />
      ) : null}
    </div>
  )
}
