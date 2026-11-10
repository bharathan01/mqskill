import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  contentAdminNavGroups,
  contentAdminShell,
  contentSearchCopy,
  searchContentAdmin,
  type ContentSearchKind,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  AwardIcon,
  BellIcon,
  BookIcon,
  ChartIcon,
  ChatIcon,
  ChevronDownIcon,
  ClipboardIcon,
  FolderIcon,
  GearIcon,
  GridIcon,
  HelpCircleIcon,
  HistoryIcon,
  ImageIcon,
  LogOutIcon,
  SearchIcon,
} from '@/components/ui'

const navIcons = {
  dashboard: GridIcon,
  courses: BookIcon,
  scorm: FolderIcon,
  assessments: ClipboardIcon,
  cpd: AwardIcon,
  media: ImageIcon,
  qa: ChatIcon,
  analytics: ChartIcon,
  history: HistoryIcon,
}

function pageTitle(pathname: string) {
  if (pathname === paths.content.dashboard) return 'Dashboard'
  if (pathname.startsWith(paths.content.courses)) return 'Course Management'
  if (pathname.startsWith(paths.content.versions)) return 'Course Versions'
  if (pathname.startsWith(paths.content.drafts)) return 'Draft Courses'
  if (pathname.startsWith(paths.content.scorm)) return 'SCORM Content'
  if (pathname.startsWith(paths.content.assessments) || pathname.startsWith(paths.content.questionBank))
    return 'Assessments & Quizzes'
  if (pathname.startsWith(paths.content.cpd) || pathname.startsWith(paths.content.certificates))
    return 'CPD & Certification'
  if (pathname.startsWith(paths.content.media)) return 'Media Library'
  if (pathname.startsWith(paths.content.qa)) return 'Course Q&A'
  if (pathname.startsWith(paths.content.analytics)) return 'Course Analytics'
  if (pathname.startsWith(paths.content.history)) return 'Activity & Version History'
  if (pathname.startsWith(paths.content.profile)) return 'Profile & Settings'
  if (pathname.startsWith(paths.content.help)) return 'Help & Support'
  return 'Content Admin'
}

const searchKindTone: Record<ContentSearchKind, string> = {
  course: 'bg-[#EFF4FF] text-brand',
  draft: 'bg-amber-50 text-amber-700',
  media: 'bg-emerald-50 text-emerald-700',
  scorm: 'bg-violet-50 text-violet-700',
  qa: 'bg-sky-50 text-sky-700',
  question: 'bg-rose-50 text-rose-700',
  page: 'bg-slate-100 text-slate-600',
}

function ContentAdminSearch() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => searchContentAdmin(query, 8), [query])
  const showMenu = open && query.trim().length > 0

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function goTo(path: string) {
    setQuery('')
    setOpen(false)
    navigate(path)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    if (results[0]) {
      goTo(results[0].to)
      return
    }
    goTo(`${paths.content.courses}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div ref={wrapRef} className="relative mx-auto hidden min-w-0 max-w-md flex-1 md:block">
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoComplete="off"
          placeholder={contentAdminShell.searchPlaceholder}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-14 pl-10 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white"
        />
        <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
          {contentAdminShell.searchShortcut}
        </span>
      </form>

      {showMenu ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,40,80,0.12)]">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
              {contentSearchCopy.heading}
            </p>
          </div>
          {results.length ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.to)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${searchKindTone[item.kind]}`}
                    >
                      {contentSearchCopy.kinds[item.kind]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {item.subtitle}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-slate-500">{contentSearchCopy.empty}</p>
          )}
          <button
            type="button"
            onClick={() =>
              goTo(
                query.trim()
                  ? `${paths.content.courses}?q=${encodeURIComponent(query.trim())}`
                  : paths.content.courses,
              )
            }
            className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm font-semibold text-brand hover:bg-slate-50"
          >
            {contentSearchCopy.viewCourses}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

function groupOpenForPath(pathname: string, groupId: string) {
  if (groupId === 'dashboard') return pathname === paths.content.dashboard
  if (groupId === 'courses')
    return (
      pathname.startsWith(paths.content.courses) ||
      pathname.startsWith(paths.content.versions) ||
      pathname.startsWith(paths.content.drafts)
    )
  if (groupId === 'scorm') return pathname.startsWith(paths.content.scorm)
  if (groupId === 'assessments')
    return (
      pathname.startsWith(paths.content.assessments) ||
      pathname.startsWith(paths.content.questionBank)
    )
  if (groupId === 'cpd')
    return (
      pathname.startsWith(paths.content.cpd) || pathname.startsWith(paths.content.certificates)
    )
  if (groupId === 'media') return pathname.startsWith(paths.content.media)
  if (groupId === 'qa') return pathname.startsWith(paths.content.qa)
  if (groupId === 'analytics') return pathname.startsWith(paths.content.analytics)
  if (groupId === 'history') return pathname.startsWith(paths.content.history)
  return false
}

export function ContentAdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitle(location.pathname)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ dashboard: true })

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current }
      for (const group of contentAdminNavGroups) {
        if (groupOpenForPath(location.pathname, group.id)) next[group.id] = true
      }
      return next
    })
  }, [location.pathname])

  const activeGroupId = useMemo(
    () => contentAdminNavGroups.find((group) => groupOpenForPath(location.pathname, group.id))?.id,
    [location.pathname],
  )

  function toggleGroup(id: string) {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-slate-900">
      <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col justify-between bg-[#102A4C] px-3.5 pt-5 pb-4 text-white">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link to={paths.content.dashboard} className="mb-4 block px-2">
            <span className="flex items-center gap-2.5">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#61A6FA] to-[#2563EB] text-base font-semibold text-white">
                M
              </span>
              <span className="text-lg font-bold tracking-tight">{contentAdminShell.brand}</span>
            </span>
            <span className="mt-1.5 block text-[11px] font-semibold tracking-[0.12em] text-[#B9C6DA] uppercase">
              {contentAdminShell.brandTag}
            </span>
          </Link>

          <nav className="space-y-0.5">
            {contentAdminNavGroups.map((group) => {
              const Icon = navIcons[group.icon]
              const open = Boolean(openGroups[group.id])
              const parentActive = activeGroupId === group.id

              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition ${
                      parentActive && !open
                        ? 'bg-[#1B3A63] font-semibold text-white'
                        : parentActive
                          ? 'bg-[#1B3A63] font-semibold text-white'
                          : 'font-medium text-[#B9C6DA] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="min-w-0 flex-1">{group.label}</span>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {open ? (
                    <div className="mt-0.5 mb-1.5 space-y-0.5 pl-7">
                      {group.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.to}
                          end={'end' in child ? child.end : false}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-2 text-sm transition ${
                              isActive
                                ? 'bg-brand font-semibold text-white'
                                : 'font-medium text-[#B9C6DA] hover:bg-white/5 hover:text-white'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </nav>
        </div>

        <div className="mt-3 space-y-0.5 border-t border-[#2A4A75] pt-3">
          <NavLink
            to={paths.content.profile}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand text-white' : 'text-[#B9C6DA] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <GearIcon className="h-[18px] w-[18px]" />
            {contentAdminShell.profile}
          </NavLink>
          <NavLink
            to={paths.content.help}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand text-white' : 'text-[#B9C6DA] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <HelpCircleIcon className="h-[18px] w-[18px]" />
            {contentAdminShell.help}
          </NavLink>
          <button
            type="button"
            onClick={() => navigate(paths.admin.login)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium text-[#FDEEEE] hover:bg-white/5"
          >
            <LogOutIcon className="h-[18px] w-[18px]" />
            {contentAdminShell.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6 lg:px-8">
          <div className="shrink-0 text-sm text-slate-400">
            {contentAdminShell.breadcrumbRoot}
            <span className="mx-1.5">/</span>
            <span className="font-semibold text-navy">{title}</span>
          </div>

          <ContentAdminSearch />

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Help"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            >
              <HelpCircleIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <span className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />
            <button
              type="button"
              onClick={() => navigate(paths.content.profile)}
              className="flex items-center gap-2.5 rounded-full py-1 pr-1 pl-1 hover:bg-slate-50 sm:pl-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                {contentAdminShell.initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-navy">
                  {contentAdminShell.userName}
                </span>
                <span className="block text-xs text-slate-400">{contentAdminShell.userOrg}</span>
              </span>
              <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
