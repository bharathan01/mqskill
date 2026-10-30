import { useEffect, useMemo, useState } from 'react'
import {
  catalogListSection,
  getCatalogCourses,
  type CatalogCourse,
  type CatalogFilters,
  type CatalogSort,
} from '@/constants/categoryCourses'
import { CategoryCatalogRow } from '@/components/common/CategoryCatalogRow'
import {
  ChevronDownIcon,
  Container,
  SkipEndIcon,
  SkipStartIcon,
  StarIcon,
} from '@/components/ui'

type CategoryCatalogSectionProps = {
  categoryId: string
  categoryName: string
}

const emptyFilters: CatalogFilters = {
  rating: 4.5,
  durations: [],
  levels: [],
  languages: [],
  prices: [],
  subtitles: [],
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function paginationItems(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const span = 5
  const start = Math.min(Math.max(1, current - 2), Math.max(1, total - span + 1))
  const end = Math.min(total, start + span - 1)
  const items: Array<number | 'gap'> = []

  if (start > 1) {
    items.push(1)
    if (start > 2) items.push('gap')
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < total) {
    if (end < total - 1) items.push('gap')
    items.push(total)
  }

  return items
}

function pageCourses(courses: CatalogCourse[], page: number, size: number) {
  if (courses.length === 0) return []

  const start = (page - 1) * size
  return Array.from({ length: size }, (_, offset) => {
    const index = (start + offset) % courses.length
    const course = courses[index]
    const round = Math.floor((start + offset) / courses.length)
    if (round === 0) return course
    return { ...course, id: `${course.id}-r${round}-${offset}` }
  })
}

function RatingStars({ value }: { value: number }) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, value - index))
        return (
          <span key={index} className="relative h-3.5 w-3.5">
            <StarIcon className="h-3.5 w-3.5 text-slate-200" />
            {fill > 0 ? (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon className="h-3.5 w-3.5 text-amber-400" />
              </span>
            ) : null}
          </span>
        )
      })}
    </span>
  )
}

export function CategoryCatalogSection({
  categoryId,
  categoryName,
}: CategoryCatalogSectionProps) {
  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters)
  const [sort, setSort] = useState<CatalogSort>('popular')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState({
    level: false,
    language: false,
    price: false,
    subtitles: false,
  })

  const courses = useMemo(
    () => getCatalogCourses(categoryId, filters, sort),
    [categoryId, filters, sort],
  )
  const totalPages = courses.length > 0 ? catalogListSection.totalPages : 0
  const visibleCourses = useMemo(
    () => pageCourses(courses, page, catalogListSection.pageSize),
    [courses, page],
  )

  useEffect(() => {
    setPage(1)
  }, [categoryId, filters, sort])

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages)
    setPage(clamped)
    document.getElementById('category-catalog')?.scrollIntoView({ block: 'start' })
  }

  function clearAll() {
    setFilters({
      rating: null,
      durations: [],
      levels: [],
      languages: [],
      prices: [],
      subtitles: [],
    })
  }

  return (
    <section id="category-catalog" className="scroll-mt-24 bg-white py-10 sm:py-12">
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              {catalogListSection.titlePrefix} {categoryName} {catalogListSection.titleSuffix}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {categoryId.startsWith('it') ||
              categoryId === 'hardware' ||
              categoryId === 'operating-systems-servers' ||
              categoryId === 'network-security'
                ? catalogListSection.subtitle
                : `Discover the best ${categoryName.toLowerCase()} courses to grow your career`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-500">
              {catalogListSection.sortLabel}
              <span className="relative">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as CatalogSort)}
                  className="appearance-none rounded-full border border-slate-200 bg-white py-2 pr-8 pl-3 text-sm font-medium text-navy outline-none"
                >
                  {catalogListSection.sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
            <span className="text-sm text-slate-400">{catalogListSection.totalLabel}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-navy">{catalogListSection.filtersTitle}</h3>
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-navy"
              >
                {catalogListSection.clearAll}
              </button>
            </div>

            <div className="mt-5 border-b border-slate-100 pb-5">
              <p className="text-sm font-semibold text-navy">Ratings</p>
              <ul className="mt-3 space-y-2.5">
                {catalogListSection.ratings.map((option) => (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                      <input
                        type="radio"
                        name="catalog-rating"
                        checked={filters.rating === option.value}
                        onChange={() => setFilters((current) => ({ ...current, rating: option.value }))}
                        className="accent-brand"
                      />
                      <RatingStars value={option.value} />
                      <span>{option.label}</span>
                      <span className="text-slate-400">({option.count.toLocaleString('en-US')})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-b border-slate-100 py-5">
              <p className="text-sm font-semibold text-navy">Video Duration</p>
              <ul className="mt-3 space-y-2.5">
                {catalogListSection.durations.map((option) => (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                      <input
                        type="checkbox"
                        checked={filters.durations.includes(option.id)}
                        onChange={() =>
                          setFilters((current) => ({
                            ...current,
                            durations: toggleValue(current.durations, option.id),
                          }))
                        }
                        className="accent-brand"
                      />
                      <span>{option.label}</span>
                      <span className="text-slate-400">({option.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {(
              [
                ['level', 'Level', 'levels', catalogListSection.levels],
                ['language', 'Language', 'languages', catalogListSection.languages],
                ['price', 'Price', 'prices', catalogListSection.prices],
                ['subtitles', 'Subtitles', 'subtitles', catalogListSection.subtitles],
              ] as const
            ).map(([key, label, filterKey, options]) => (
              <div key={key} className="border-b border-slate-100">
                <button
                  type="button"
                  aria-expanded={open[key]}
                  onClick={() => setOpen((current) => ({ ...current, [key]: !current[key] }))}
                  className="flex w-full items-center justify-between py-4 text-sm font-semibold text-navy"
                >
                  {label}
                  <ChevronDownIcon
                    className={`h-4 w-4 text-slate-400 ${open[key] ? 'rotate-180' : ''}`}
                  />
                </button>
                {open[key] ? (
                  <ul className="space-y-2.5 pb-4">
                    {options.map((option) => (
                      <li key={option.id}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-navy">
                          <input
                            type="checkbox"
                            checked={filters[filterKey].includes(option.id)}
                            onChange={() =>
                              setFilters((current) => ({
                                ...current,
                                [filterKey]: toggleValue(current[filterKey], option.id),
                              }))
                            }
                            className="accent-brand"
                          />
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </aside>

          <div className="space-y-4">
            {visibleCourses.map((course) => (
              <CategoryCatalogRow key={course.id} course={course} />
            ))}
            {courses.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                No courses match these filters.
              </p>
            ) : null}
          </div>
        </div>

        {totalPages > 0 ? (
          <nav
            aria-label="Course pages"
            className="mt-10 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-label={catalogListSection.firstPage}
              disabled={page === 1}
              onClick={() => goToPage(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-navy disabled:opacity-40"
            >
              <SkipStartIcon className="h-4 w-4" />
            </button>
            {paginationItems(page, totalPages).map((item, index) =>
              item === 'gap' ? (
                <span key={`gap-${index}`} className="px-1 text-sm text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => goToPage(item)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium ${
                    item === page
                      ? 'bg-brand text-white'
                      : 'text-slate-500 hover:text-navy'
                  }`}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label={catalogListSection.lastPage}
              disabled={page === totalPages}
              onClick={() => goToPage(totalPages)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-navy disabled:opacity-40"
            >
              <SkipEndIcon className="h-4 w-4" />
            </button>
          </nav>
        ) : null}
      </Container>
    </section>
  )
}
