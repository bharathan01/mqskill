import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  organizationAnnouncementCourses,
  organizationAnnouncementDepartments,
  organizationAnnouncementEveryoneCount,
  organizationAnnouncementPeople,
  organizationNewAnnouncementPage,
  organizationShell,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  BookIcon,
  BuildingIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  LinkIcon,
  ListIcon,
  PaperclipIcon,
  PlusIcon,
  SendIcon,
  UserIcon,
  UsersIcon,
} from '@/components/ui'

type AudienceMode = 'everyone' | 'departments' | 'people'

const copy = organizationNewAnnouncementPage

export function OrganizationNewAnnouncementPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState(copy.defaults.title)
  const [message, setMessage] = useState(copy.defaults.message)
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('departments')
  const [departmentIds, setDepartmentIds] = useState<string[]>([...copy.defaults.departmentIds])
  const [peopleIds, setPeopleIds] = useState<string[]>([])
  const [showDeptPicker, setShowDeptPicker] = useState(false)
  const [courseId, setCourseId] = useState(copy.defaults.courseId)
  const [when, setWhen] = useState(copy.defaults.when)
  const [showInPortal, setShowInPortal] = useState(copy.defaults.showInPortal)
  const [sendByEmail, setSendByEmail] = useState(copy.defaults.sendByEmail)
  const [toast, setToast] = useState('')

  const selectedDepartments = useMemo(
    () =>
      organizationAnnouncementDepartments.filter((item) => departmentIds.includes(item.id)),
    [departmentIds],
  )

  const availableDepartments = useMemo(
    () =>
      organizationAnnouncementDepartments.filter((item) => !departmentIds.includes(item.id)),
    [departmentIds],
  )

  const selectedPeople = useMemo(
    () => organizationAnnouncementPeople.filter((item) => peopleIds.includes(item.id)),
    [peopleIds],
  )

  const selectedCourse = organizationAnnouncementCourses.find((item) => item.id === courseId)

  const recipientCount = useMemo(() => {
    if (audienceMode === 'everyone') return organizationAnnouncementEveryoneCount
    if (audienceMode === 'departments') {
      return selectedDepartments.reduce((sum, item) => sum + item.count, 0)
    }
    return selectedPeople.length
  }, [audienceMode, selectedDepartments, selectedPeople.length])

  const previewDetail = useMemo(() => {
    if (audienceMode === 'everyone') return copy.everyonePreview
    if (audienceMode === 'departments') {
      if (!selectedDepartments.length) return 'No departments selected'
      return selectedDepartments.map((item) => `${item.name} (${item.count})`).join(' and ')
    }
    if (!selectedPeople.length) return 'No people selected'
    return selectedPeople.map((item) => item.name).join(', ')
  }, [audienceMode, selectedDepartments, selectedPeople])

  function showToast(messageText: string) {
    setToast(messageText)
    window.setTimeout(() => setToast(''), 2200)
  }

  function saveDraft() {
    showToast(copy.draftSavedToast)
    window.setTimeout(() => navigate(paths.organization.announcements), 700)
  }

  function sendAnnouncement() {
    if (recipientCount === 0) return
    showToast(copy.sentToast)
    window.setTimeout(() => navigate(paths.organization.announcements), 700)
  }

  function togglePerson(id: string) {
    setPeopleIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function removeDepartment(id: string) {
    setDepartmentIds((current) => current.filter((item) => item !== id))
  }

  function addDepartment(id: string) {
    setDepartmentIds((current) => [...current, id])
    setShowDeptPicker(false)
  }

  const audienceOptions: Array<{
    id: AudienceMode
    label: string
    detail: string
    Icon: typeof UsersIcon
  }> = [
    {
      id: 'everyone',
      label: copy.audience.everyone,
      detail: copy.audience.everyoneDetail,
      Icon: UsersIcon,
    },
    {
      id: 'departments',
      label: copy.audience.departments,
      detail: copy.audience.departmentsDetail,
      Icon: BuildingIcon,
    },
    {
      id: 'people',
      label: copy.audience.people,
      detail: copy.audience.peopleDetail,
      Icon: UserIcon,
    },
  ]

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">{copy.title}</h1>
        </header>
        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            type="button"
            onClick={saveDraft}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.saveDraft}
          </button>
          <button
            type="button"
            onClick={sendAnnouncement}
            disabled={recipientCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendIcon className="h-4 w-4" />
            {copy.sendTo(recipientCount)}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.titleLabel}</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={copy.titlePlaceholder}
              className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.messageLabel}</span>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm font-bold text-slate-600 hover:bg-white"
                >
                  B
                </button>
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm italic text-slate-600 hover:bg-white"
                >
                  I
                </button>
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm text-slate-600 underline hover:bg-white"
                >
                  U
                </button>
                <span className="mx-1 h-4 w-px bg-slate-200" />
                <button
                  type="button"
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-navy"
                  aria-label="Bullet list"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-navy"
                  aria-label="Insert link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-navy"
                  aria-label="Attach file"
                >
                  <PaperclipIcon className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={copy.messagePlaceholder}
                rows={8}
                className="w-full resize-y px-3.5 py-3 text-sm leading-6 text-navy outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-navy">{copy.sendToLabel}</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {audienceOptions.map((option) => {
                const active = audienceMode === option.id
                const Icon = option.Icon
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAudienceMode(option.id)}
                    className={`relative rounded-xl border p-3.5 text-left transition ${
                      active
                        ? 'border-brand bg-[#F5F9FF] ring-1 ring-brand'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {active ? (
                      <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                    ) : null}
                    <Icon className={`h-4 w-4 ${active ? 'text-brand' : 'text-slate-400'}`} />
                    <p className="mt-2 text-sm font-semibold text-navy">{option.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{option.detail}</p>
                  </button>
                )
              })}
            </div>

            {audienceMode === 'departments' ? (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedDepartments.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-semibold text-brand"
                    >
                      {item.name} · {item.count}
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeDepartment(item.id)}
                        className="rounded-full p-0.5 hover:bg-white/70"
                      >
                        <CloseIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDeptPicker((value) => !value)}
                    disabled={!availableDepartments.length}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    {copy.audience.addDepartment}
                  </button>
                  {showDeptPicker && availableDepartments.length ? (
                    <div className="absolute top-8 left-0 z-20 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      {availableDepartments.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => addDepartment(item.id)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span>{item.name}</span>
                          <span className="text-xs text-slate-400">{item.count}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {audienceMode === 'people' ? (
              <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {organizationAnnouncementPeople.map((person) => {
                  const checked = peopleIds.includes(person.id)
                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => togglePerson(person.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${
                        checked ? 'bg-[#F5F9FF]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          checked ? 'border-brand bg-brand text-white' : 'border-slate-300'
                        }`}
                      >
                        {checked ? <CheckIcon className="h-3 w-3" /> : null}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                        {person.initials}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-navy">{person.name}</span>
                        <span className="text-xs text-slate-500">{person.department}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              {copy.linkCourseLabel}
            </span>
            <div className="relative">
              <BookIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pr-10 pl-10 text-sm text-navy outline-none focus:border-brand"
              >
                <option value="">{copy.linkCoursePlaceholder}</option>
                {organizationAnnouncementCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">{copy.whenLabel}</span>
            <div className="relative">
              <ClockIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={when}
                onChange={(event) => setWhen(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pr-10 pl-10 text-sm text-navy outline-none focus:border-brand"
              >
                {copy.whenOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <div className="flex flex-wrap gap-5 border-t border-slate-100 pt-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={showInPortal}
                onChange={(event) => setShowInPortal(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {copy.showInPortal}
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={sendByEmail}
                onChange={(event) => setSendByEmail(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {copy.sendByEmail}
            </label>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,40,80,0.04)] xl:sticky xl:top-24">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
            {copy.preview}
          </p>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-navy">{organizationShell.orgName}</p>
              <p className="text-xs text-slate-400">{copy.previewJustNow}</p>
            </div>
            <h2 className="mt-3 text-base font-bold text-navy">
              {title.trim() || copy.titlePlaceholder}
            </h2>
            <p className="mt-2 line-clamp-4 text-sm leading-6 whitespace-pre-line text-slate-600">
              {message.trim() || copy.messagePlaceholder}
            </p>
            {selectedCourse ? (
              <button
                type="button"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white"
              >
                {copy.openCourse}
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#EAF2FF] px-3.5 py-3 text-sm text-brand">
            <UsersIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{copy.willGetThis(recipientCount, previewDetail)}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
