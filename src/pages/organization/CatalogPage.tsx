import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router'
import {
  organizationCatalogCategories,
  organizationCatalogCourses,
  organizationCatalogLevels,
  organizationCatalogPage,
  parseKwdPrice,
  type OrganizationCatalogCourse,
  type OrganizationCatalogIcon,
  type OrganizationCatalogLevel,
  type OrganizationCatalogSort,
} from '@/constants'
import { paths } from '@/routes/paths'
import type { OrganizationOutletContext } from '@/components/common'
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CartIcon,
  ChatIcon,
  ChevronDownIcon,
  ClockIcon,
  MegaphoneIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui'

const pageSize = 6

const iconMap = {
  megaphone: MegaphoneIcon,
  shield: ShieldCheckIcon,
  badge: BadgeCheckIcon,
  briefcase: BriefcaseIcon,
  alert: AlertTriangleIcon,
  chat: ChatIcon,
} satisfies Record<
  OrganizationCatalogIcon,
  (props: { className?: string }) => ReactElement
>

type TrainingRequestState = {
  fromTrainingRequest?: {
    id: string
    course: string
    employeeName: string
  }
}

function CourseCard({
  course,
  highlighted,
  onAdd,
  onDetails,
}: {
  course: OrganizationCatalogCourse
  highlighted?: boolean
  onAdd: () => void
  onDetails: () => void
}) {
  const Icon = iconMap[course.icon]

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)] transition ${
        highlighted ? 'border-brand ring-2 ring-brand/20' : 'border-slate-200'
      }`}
    >
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${course.accent}`}>
        <Icon className="h-12 w-12 text-white/90" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {course.category}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-navy">{course.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <ClockIcon className="h-3.5 w-3.5" />
          {course.duration} · {course.cpdHours} CPD hours
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-base font-bold text-navy">{course.price}</p>
          {course.ownedSeats != null && course.freeSeats != null ? (
            <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[11px] font-semibold text-brand">
              {organizationCatalogPage.ownedSeats(course.ownedSeats, course.freeSeats)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onDetails}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {organizationCatalogPage.details}
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white hover:bg-blue-700"
          >
            {organizationCatalogPage.addToCart}
          </button>
        </div>
      </div>
    </article>
  )
}

export function OrganizationCatalogPage() {
  const { cartItems, addToCart } = useOutletContext<OrganizationOutletContext>()
  const navigate = useNavigate()
  const location = useLocation()
  const requestState = (location.state as TrainingRequestState | null)?.fromTrainingRequest

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState<'all' | OrganizationCatalogLevel>('all')
  const [sort, setSort] = useState<OrganizationCatalogSort>('popular')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [toast, setToast] = useState('')
  const [detailCourse, setDetailCourse] = useState<OrganizationCatalogCourse | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!requestState?.course) return
    setQuery(requestState.course)
    setCategory('all')
    setVisibleCount(pageSize)
  }, [requestState])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: organizationCatalogCourses.length }
    for (const course of organizationCatalogCourses) {
      counts[course.category] = (counts[course.category] ?? 0) + 1
    }
    return counts
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let rows = organizationCatalogCourses.filter((course) => {
      if (category !== 'all' && course.category !== category) return false
      if (level !== 'all' && course.level !== level) return false
      if (!needle) return true
      return (
        course.title.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle)
      )
    })

    rows = [...rows].sort((a, b) => {
      if (sort === 'popular') return Number(b.popular) - Number(a.popular) || a.title.localeCompare(b.title)
      if (sort === 'newest') return b.title.localeCompare(a.title)
      const priceA = Number.parseFloat(a.price)
      const priceB = Number.parseFloat(b.price)
      if (sort === 'price-asc') return priceA - priceB
      return priceB - priceA
    })

    return rows
  }, [query, category, level, sort])

  const visible = filtered.slice(0, visibleCount)

  function handleAddToCart(course: OrganizationCatalogCourse) {
    addToCart({
      id: course.id,
      title: course.title,
      shortLabel: course.title.split(' ').slice(0, 2).join(' '),
      seats: 1,
      unitPrice: parseKwdPrice(course.price),
      priceLabel: course.price,
      modules: Math.max(4, course.cpdHours + 2),
      hours: `${course.cpdHours + Math.max(1, Math.floor(course.cpdHours / 2))} hrs`,
      cpdHours: course.cpdHours,
      icon: course.icon,
      accent: course.accent,
      detail: requestState ? `for ${requestState.employeeName}` : undefined,
    })
    navigate(paths.organization.cart)
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <h1 className="text-3xl font-bold text-navy">{organizationCatalogPage.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{organizationCatalogPage.subtitle}</p>
        </header>
        <button
          type="button"
          onClick={() => navigate(paths.organization.cart)}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <CartIcon className="h-4 w-4" />
          {organizationCatalogPage.cart} · {cartItems.length}
        </button>
      </div>

      {requestState ? (
        <div className="rounded-xl border border-blue-100 bg-[#EAF2FF]/70 px-4 py-3 text-sm text-slate-600">
          {organizationCatalogPage.requestHint(requestState.course, requestState.employeeName)}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,40,80,0.04)] lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setVisibleCount(pageSize)
            }}
            placeholder={organizationCatalogPage.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </label>

        <label className="relative">
          <select
            value={category === 'all' ? 'all' : category}
            onChange={(event) => {
              setCategory(event.target.value)
              setVisibleCount(pageSize)
            }}
            className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm text-slate-700 outline-none focus:border-brand"
          >
            <option value="all">{organizationCatalogPage.allCategories}</option>
            {organizationCatalogCategories
              .filter((item) => item.id !== 'all')
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>

        <label className="relative">
          <select
            value={level}
            onChange={(event) => {
              setLevel(event.target.value as 'all' | OrganizationCatalogLevel)
              setVisibleCount(pageSize)
            }}
            className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm text-slate-700 outline-none focus:border-brand"
          >
            <option value="all">{organizationCatalogPage.anyLevel}</option>
            {organizationCatalogLevels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>

        <label className="relative">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as OrganizationCatalogSort)}
            className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm text-slate-700 outline-none focus:border-brand"
          >
            <option value="popular">{organizationCatalogPage.sortPopular}</option>
            <option value="newest">{organizationCatalogPage.sortNewest}</option>
            <option value="price-asc">{organizationCatalogPage.sortPriceAsc}</option>
            <option value="price-desc">{organizationCatalogPage.sortPriceDesc}</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {organizationCatalogCategories.map((item) => {
          const active = category === item.id
          const count = categoryCounts[item.id] ?? 0
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategory(item.id)
                setVisibleCount(pageSize)
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-brand text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.id === 'all' ? organizationCatalogCourses.length : count}
              </span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          {organizationCatalogPage.empty}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              highlighted={
                !!requestState &&
                course.title.toLowerCase() === requestState.course.toLowerCase()
              }
              onAdd={() => handleAddToCart(course)}
              onDetails={() => setDetailCourse(course)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {organizationCatalogPage.showing} {visible.length} {organizationCatalogPage.of}{' '}
          {filtered.length} {organizationCatalogPage.courses}
        </p>
        {visibleCount < filtered.length ? (
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + pageSize)}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {organizationCatalogPage.loadMore}
          </button>
        ) : null}
      </div>

      {detailCourse ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDetailCourse(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div
              className={`flex h-40 items-center justify-center bg-gradient-to-br ${detailCourse.accent}`}
            >
              {(() => {
                const Icon = iconMap[detailCourse.icon]
                return <Icon className="h-14 w-14 text-white/90" />
              })()}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {detailCourse.category}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {detailCourse.level}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-navy">{detailCourse.title}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {detailCourse.duration} · {detailCourse.cpdHours} CPD hours
              </p>
              <p className="mt-3 text-lg font-bold text-navy">{detailCourse.price}</p>
              {detailCourse.ownedSeats != null && detailCourse.freeSeats != null ? (
                <p className="mt-1 text-sm text-brand">
                  {organizationCatalogPage.ownedSeats(
                    detailCourse.ownedSeats,
                    detailCourse.freeSeats,
                  )}
                </p>
              ) : null}
              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDetailCourse(null)}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(detailCourse)
                    setDetailCourse(null)
                  }}
                  className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {organizationCatalogPage.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
