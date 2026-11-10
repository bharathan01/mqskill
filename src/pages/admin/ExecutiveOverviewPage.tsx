import { useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { ContentBadge, ContentNotice, ContentSelect } from '@/components/common'
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  CartIcon,
  ChartIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  CreditCardIcon,
  DownloadIcon,
  GraduationCapIcon,
  InfoIcon,
  RefreshIcon,
  UsersIcon,
} from '@/components/ui'
import {
  SUPER_ADMIN_ALL_COUNTRIES,
  superAdminExecutiveAttention,
  superAdminExecutiveBusinessOptions,
  superAdminExecutiveCountries,
  superAdminExecutiveCountryOptions,
  superAdminExecutiveCompactMoney,
  superAdminExecutiveCurrencies,
  superAdminExecutiveDefaultFilters,
  superAdminExecutiveFinance,
  superAdminExecutiveGeo,
  superAdminExecutiveGeoTabs,
  superAdminExecutiveGrains,
  superAdminExecutiveInfoLine,
  superAdminExecutiveInt,
  superAdminExecutiveKpis,
  superAdminExecutiveLearning,
  superAdminExecutiveMoney,
  superAdminExecutiveMoneyState,
  superAdminExecutiveOrgPerformance,
  superAdminExecutiveRanges,
  superAdminExecutiveSeries,
  superAdminExecutiveTransactions,
  superAdminExecutiveTrending,
  superAdminExecutiveTrendingCategories,
  type SuperAdminExecutiveBusiness,
  type SuperAdminExecutiveCurrency,
  type SuperAdminExecutiveFilters,
  type SuperAdminExecutiveGrain,
  type SuperAdminExecutiveKpi,
  type SuperAdminExecutiveRangeId,
  type SuperAdminGeoTab,
  type SuperAdminTrendingRow,
} from '@/constants'
import { paths } from '@/routes/paths'
import { StatusBadge } from './catalogShared'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'

/* ------------------------------ presentation ------------------------------ */

const kpiIcons: Record<SuperAdminExecutiveKpi['icon'], ComponentType<{ className?: string }>> = {
  revenue: CreditCardIcon,
  purchases: CartIcon,
  students: GraduationCapIcon,
  orgs: BuildingIcon,
  employees: UsersIcon,
  courses: BookIcon,
  refunds: RefreshIcon,
  aov: ChartIcon,
}

const tileStyles: Record<SuperAdminExecutiveKpi['tile'], { bg: string; text: string }> = {
  blue: { bg: '#EFF4FF', text: 'text-brand' },
  sky: { bg: '#E0F4FD', text: 'text-sky-600' },
  purple: { bg: '#F4EFFE', text: 'text-purple-600' },
  green: { bg: '#E8F6EE', text: 'text-emerald-600' },
  amber: { bg: '#FEF4E4', text: 'text-amber-600' },
}

const pillStyles = {
  up: 'bg-emerald-50 text-emerald-700',
  down: 'bg-rose-50 text-rose-700',
  warn: 'bg-amber-50 text-amber-700',
} as const

const geoColors = ['#102A4C', '#2563EB', '#60A5FA', '#0EA5A4', '#7C3AED', '#F59E0B', '#94A3B8']

type TrendKey = 'course' | 'category' | 'views' | 'purchases' | 'enrolments' | 'revenue' | 'growth'

const trendColumns: { key: TrendKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'course', label: 'Course', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'views', label: 'Views', align: 'right' },
  { key: 'purchases', label: 'Purchases', align: 'right' },
  { key: 'enrolments', label: 'Enrolments', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
  { key: 'growth', label: 'Purchase growth', align: 'right' },
]

const thClass = 'px-4 py-3 text-xs font-semibold tracking-wide text-slate-400 uppercase whitespace-nowrap'

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

function Tabs<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { id: T; label: string }[]
  onChange: (id: T) => void
  label: string
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label={label}>
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              active ? 'bg-white font-semibold text-navy shadow-sm' : 'font-medium text-slate-500 hover:text-navy'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function ViewAll({ to, children = 'View all' }: { to: string; children?: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
      {children} <ChevronRightIcon className="h-3.5 w-3.5" />
    </Link>
  )
}

function Spark({ points, positive = true }: { points: number[]; positive?: boolean }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const step = 64 / (points.length - 1)
  const coords = points.map((point, i) => `${(i * step).toFixed(1)},${(22 - ((point - min) / (max - min || 1)) * 20 - 1).toFixed(1)}`)
  return (
    <svg viewBox="0 0 64 22" className="h-[22px] w-16" aria-hidden>
      <polyline fill="none" stroke={positive ? '#16A34A' : '#E11D48'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={coords.join(' ')} />
    </svg>
  )
}

function niceCeil(value: number) {
  if (value <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const unit = [1, 2, 2.5, 5, 10].find((step) => step * magnitude >= value) ?? 10
  return unit * magnitude
}

/* --------------------------------- page ---------------------------------- */

export function AdminExecutiveOverviewPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<SuperAdminExecutiveFilters>(superAdminExecutiveDefaultFilters)
  const [applied, setApplied] = useState<SuperAdminExecutiveFilters>(superAdminExecutiveDefaultFilters)
  const [notice, setNotice] = useState<{ text: string; tone: 'green' | 'amber' | 'blue' } | null>(null)
  const [grain, setGrain] = useState<SuperAdminExecutiveGrain>('day')
  const [geoTab, setGeoTab] = useState<SuperAdminGeoTab>('students')
  const [trendRange, setTrendRange] = useState<SuperAdminExecutiveRangeId>('30d')
  const [trendCountry, setTrendCountry] = useState(SUPER_ADMIN_ALL_COUNTRIES)
  const [trendBusiness, setTrendBusiness] = useState<SuperAdminExecutiveBusiness>('all')
  const [trendCategory, setTrendCategory] = useState('All categories')
  const [trendVersion, setTrendVersion] = useState('latest')
  const [trendSort, setTrendSort] = useState<{ key: TrendKey; dir: 'asc' | 'desc' }>({ key: 'growth', dir: 'desc' })
  const [dismissed, setDismissed] = useState<string[]>([])

  const range = superAdminExecutiveRanges.find((item) => item.id === applied.range) ?? superAdminExecutiveRanges[1]
  const currency = applied.currency
  const money = (kwd: number, signed = false) => superAdminExecutiveMoney(kwd, currency, signed)
  const dirty = JSON.stringify(draft) !== JSON.stringify(applied)

  const kpis = useMemo(() => superAdminExecutiveKpis(applied), [applied])
  const moneyState = useMemo(() => superAdminExecutiveMoneyState(applied), [applied])
  const series = useMemo(() => superAdminExecutiveSeries(applied, grain), [applied, grain])
  const geoRows = useMemo(() => superAdminExecutiveGeo(applied, geoTab), [applied, geoTab])
  const org = useMemo(() => superAdminExecutiveOrgPerformance(applied), [applied])
  const finance = useMemo(() => superAdminExecutiveFinance(applied), [applied])
  const learning = useMemo(() => superAdminExecutiveLearning(applied), [applied])
  const trending = useMemo(
    () => superAdminExecutiveTrending(trendRange, trendCountry, trendBusiness),
    [trendRange, trendCountry, trendBusiness],
  )

  const trendRangeInfo = superAdminExecutiveRanges.find((item) => item.id === trendRange) ?? superAdminExecutiveRanges[1]
  const trendRows = useMemo(() => {
    const rows = trending.rows.filter((row) => trendCategory === 'All categories' || row.category === trendCategory)
    const factor = trendSort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = a[trendSort.key as keyof SuperAdminTrendingRow]
      const bv = b[trendSort.key as keyof SuperAdminTrendingRow]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
      return String(av).localeCompare(String(bv)) * factor
    })
  }, [trending, trendCategory, trendSort])

  const transactions = useMemo(
    () =>
      superAdminExecutiveTransactions.filter(
        (row) =>
          (applied.country === SUPER_ADMIN_ALL_COUNTRIES || row.country === applied.country) &&
          (applied.business === 'all' || row.type.toLowerCase() === applied.business),
      ),
    [applied.country, applied.business],
  )

  const attention = superAdminExecutiveAttention.filter((item) => !dismissed.includes(item.id))

  function say(text: string, tone: 'green' | 'amber' | 'blue' = 'green') {
    setNotice({ text, tone })
  }

  function patchDraft(patch: Partial<SuperAdminExecutiveFilters>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function syncTrending(filters: SuperAdminExecutiveFilters) {
    setTrendRange(filters.range)
    setTrendCountry(filters.country)
    setTrendBusiness(filters.business)
  }

  function applyFilters() {
    setApplied(draft)
    syncTrending(draft)
    const business = draft.business === 'all' ? 'B2C + B2B' : draft.business.toUpperCase()
    const next = superAdminExecutiveRanges.find((item) => item.id === draft.range)
    say(`Filters applied: ${next?.label} · ${draft.country} · ${business} · ${draft.currency}${draft.compare ? ' · vs previous period' : ''}.`)
  }

  function resetFilters() {
    setDraft(superAdminExecutiveDefaultFilters)
    setApplied(superAdminExecutiveDefaultFilters)
    syncTrending(superAdminExecutiveDefaultFilters)
    setTrendCategory('All categories')
    say('Filters reset to Last 30 days · All countries · B2C + B2B · KWD.', 'blue')
  }

  function toggleSort(key: TrendKey) {
    setTrendSort((current) =>
      current.key === key
        ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'course' || key === 'category' ? 'asc' : 'desc' },
    )
  }

  /* chart maths */
  const totals = series.map((point) => point.b2c + point.b2b)
  const axisMax = niceCeil(Math.max(...totals, 1) * 1.05)
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((fraction) => axisMax * fraction)
  const labelEvery = Math.max(1, Math.ceil(series.length / 10))
  const grainInfo = superAdminExecutiveGrains.find((item) => item.id === grain) ?? superAdminExecutiveGrains[0]

  const geoTabInfo = superAdminExecutiveGeoTabs.find((item) => item.id === geoTab) ?? superAdminExecutiveGeoTabs[0]
  const geoMax = Math.max(...geoRows.map((row) => row.value), 1)
  const learningCompare = applied.compare ? `vs ${range.prevDays}` : undefined

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[28px] leading-8 font-bold tracking-tight text-navy">Executive Overview</h1>
            <ContentBadge tone="slate">Sample data</ContentBadge>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Monitor your platform, revenue, learners, and business performance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => say(`Executive overview for ${range.current} exported as PDF (sample).`)}
            className={btnOutline}
          >
            <DownloadIcon className="h-4 w-4" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => say('Report scheduled: the executive overview will be emailed every Monday at 08:00 (sample).', 'blue')}
            className={btnPrimary}
          >
            <CalendarIcon className="h-4 w-4" />
            Schedule report
          </button>
        </div>
      </header>

      {notice ? (
        <ContentNotice tone={notice.tone} onDismiss={() => setNotice(null)}>
          {notice.text}
        </ContentNotice>
      ) : null}

      {/* 2. Filters */}
      <section className={`${cardClass} p-4`} aria-label="Filters">
        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end">
          <label className="block min-w-40">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Date range</span>
            <ContentSelect
              aria-label="Date range"
              value={draft.range}
              onChange={(event) => patchDraft({ range: event.target.value as SuperAdminExecutiveRangeId })}
            >
              {superAdminExecutiveRanges.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </ContentSelect>
          </label>
          <label className="block min-w-40">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Country</span>
            <ContentSelect
              aria-label="Country"
              value={draft.country}
              onChange={(event) => patchDraft({ country: event.target.value })}
            >
              {superAdminExecutiveCountryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </ContentSelect>
          </label>
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Business type</span>
            <Tabs
              label="Business type"
              value={draft.business}
              options={superAdminExecutiveBusinessOptions}
              onChange={(business) => patchDraft({ business })}
            />
          </div>
          <label className="block min-w-28">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Currency</span>
            <ContentSelect
              aria-label="Currency"
              value={draft.currency}
              onChange={(event) => patchDraft({ currency: event.target.value as SuperAdminExecutiveCurrency })}
            >
              {superAdminExecutiveCurrencies.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </ContentSelect>
          </label>
          <div className="flex h-10 items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={draft.compare}
              aria-label="Comparison: previous period"
              onClick={() => patchDraft({ compare: !draft.compare })}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${draft.compare ? 'bg-brand' : 'bg-slate-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${draft.compare ? 'translate-x-5' : ''}`}
              />
            </button>
            <span className="text-sm font-medium text-navy">Previous period</span>
          </div>
          <div className="flex items-center gap-2.5 xl:ml-auto">
            <button type="button" onClick={resetFilters} className={btnOutline}>
              Reset
            </button>
            <button type="button" onClick={applyFilters} className={btnPrimary}>
              Apply filters
              {dirty ? <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-label="Unapplied changes" /> : null}
            </button>
          </div>
        </div>
        <p className="mt-3.5 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <InfoIcon className="mt-px h-3.5 w-3.5 shrink-0 text-slate-400" />
          {superAdminExecutiveInfoLine(applied)}
        </p>
      </section>

      {/* 3. KPI grid */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {kpis.map((kpi) => {
          const Icon = kpiIcons[kpi.icon]
          const tile = tileStyles[kpi.tile]
          return (
            <article key={kpi.id} className={`${cardClass} flex flex-col p-4`}>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${tile.text}`}
                  style={{ backgroundColor: tile.bg }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {kpi.badge ? (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{kpi.badge}</span>
                ) : null}
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">{kpi.label}</p>
              <p className="mt-0.5 text-2xl leading-8 font-bold tracking-tight text-navy">{kpi.value}</p>
              {applied.compare && kpi.change ? (
                <span
                  className={`mt-2 inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${pillStyles[kpi.changeTone]}`}
                >
                  {kpi.changeTone === 'down' ? <ArrowDownIcon className="h-3 w-3" /> : <ArrowUpIcon className="h-3 w-3" />}
                  {kpi.change}
                </span>
              ) : (
                <span className="mt-2 h-[22px]" />
              )}
              <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">{kpi.detail}</p>
              <Link
                to={kpi.to}
                className="mt-3 inline-flex items-center gap-1 border-t border-slate-100 pt-3 text-sm font-semibold text-brand hover:underline"
              >
                {kpi.linkLabel} <ChevronRightIcon className="h-3.5 w-3.5" />
              </Link>
            </article>
          )
        })}
      </section>

      {/* 4. Revenue performance */}
      <section className={`${cardClass} p-5`} aria-label="Revenue performance">
        <SectionHeader
          title="Revenue Performance"
          subtitle={`Net sales per ${grainInfo.unit} · ${currency} · completed payments less discounts and refunds`}
          action={
            <Tabs
              label="Chart granularity"
              value={grain}
              options={superAdminExecutiveGrains}
              onChange={(next) => setGrain(next)}
            />
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-medium text-slate-500">Total net sales</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-2 text-lg font-bold text-navy">
              {money(moneyState.net)}
              {applied.compare ? (
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                  +{moneyState.netChange.toFixed(1)}%
                </span>
              ) : null}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-sm bg-[#102A4C]" /> B2C
            </p>
            <p className="mt-1 text-lg font-bold text-navy">{money(moneyState.b2c)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-sm bg-[#60A5FA]" /> B2B
            </p>
            <p className="mt-1 text-lg font-bold text-navy">{money(moneyState.b2b)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <p className="text-xs font-medium text-slate-500">Previous period</p>
            <p className="mt-1 text-lg font-bold text-navy">{applied.compare ? money(moneyState.previous) : '—'}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <div className="flex h-60 w-10 shrink-0 flex-col justify-between text-right text-[11px] text-slate-400" aria-hidden>
            {ticks.map((tick) => (
              <span key={tick} className="leading-none">
                {superAdminExecutiveCompactMoney(tick, currency)}
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="relative h-60">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden>
                {ticks.map((tick) => (
                  <span key={tick} className="border-t border-dashed border-slate-100" />
                ))}
              </div>
              <div className="relative flex h-full items-end gap-1 sm:gap-1.5" role="img" aria-label={`Net sales by ${grainInfo.unit}, B2C and B2B`}>
                {series.map((point) => {
                  const total = point.b2c + point.b2b
                  return (
                    <div
                      key={point.label}
                      className="group relative flex h-full flex-1 items-end justify-center"
                      title={`${point.label}: B2C ${money(point.b2c)} · B2B ${money(point.b2b)}`}
                    >
                      <div
                        className="flex w-full max-w-10 flex-col-reverse overflow-hidden rounded-t-md transition group-hover:opacity-80"
                        style={{ height: `${(total / axisMax) * 100}%` }}
                      >
                        <div className="w-full bg-[#102A4C]" style={{ height: `${total ? (point.b2c / total) * 100 : 0}%` }} />
                        <div className="w-full bg-[#60A5FA]" style={{ height: `${total ? (point.b2b / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-2 flex gap-1 sm:gap-1.5 text-[11px] text-slate-500">
              {series.map((point, i) => (
                <span key={point.label} className="min-w-0 flex-1 text-center whitespace-nowrap">
                  {i % labelEvery === 0 ? point.label : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#102A4C]" />B2C
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#60A5FA]" />B2B
          </span>
          <span className="ml-auto text-slate-400">
            {grain === 'day' ? range.current : grain === 'week' ? 'Trailing weeks at the current run rate' : grain === 'month' ? 'Trailing months at the current run rate' : '2024 – 2026 YTD'}
          </span>
        </div>
      </section>

      {/* 5. Trending courses */}
      <section className={`${cardClass} overflow-hidden`} aria-label="Trending courses">
        <div className="p-5 pb-4">
          <SectionHeader
            title="Trending Courses"
            subtitle="Discover which courses are gaining demand across MaqSkillz."
            action={<ViewAll to={`${paths.admin.courseIntelligence}?tab=trending`} />}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <div className="w-36">
              <ContentSelect aria-label="Period" value={trendRange} onChange={(event) => setTrendRange(event.target.value as SuperAdminExecutiveRangeId)} className="!h-9">
                {superAdminExecutiveRanges.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </ContentSelect>
            </div>
            <div className="w-40">
              <ContentSelect aria-label="Country" value={trendCountry} onChange={(event) => setTrendCountry(event.target.value)} className="!h-9">
                {superAdminExecutiveCountryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </ContentSelect>
            </div>
            <div className="w-48">
              <ContentSelect aria-label="Category" value={trendCategory} onChange={(event) => setTrendCategory(event.target.value)} className="!h-9">
                {superAdminExecutiveTrendingCategories.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </ContentSelect>
            </div>
            <div className="w-32">
              <ContentSelect aria-label="Business type" value={trendBusiness} onChange={(event) => setTrendBusiness(event.target.value as SuperAdminExecutiveBusiness)} className="!h-9">
                <option value="all">B2C+B2B</option>
                <option value="b2c">B2C</option>
                <option value="b2b">B2B</option>
              </ContentSelect>
            </div>
            <div className="w-36">
              <ContentSelect aria-label="Version" value={trendVersion} onChange={(event) => setTrendVersion(event.target.value)} className="!h-9">
                <option value="latest">Version: latest</option>
                <option value="all">Version: all</option>
              </ContentSelect>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <InfoIcon className="h-3.5 w-3.5 text-slate-400" />
            Ranked by purchase growth vs the {trendRangeInfo.prevDays} · min. {trending.minPurchases} purchases
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-left">
                <th className={`${thClass} w-12`}>#</th>
                {trendColumns.map((column) => (
                  <th key={column.key} className={`${thClass} ${column.align === 'right' ? 'text-right' : ''}`}>
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex items-center gap-1 uppercase hover:text-navy"
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      {trendSort.key === column.key ? (
                        trendSort.dir === 'asc' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
                      ) : null}
                    </button>
                  </th>
                ))}
                <th className={`${thClass} text-right`}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {trendRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No trending courses in this category for the selected filters.
                  </td>
                </tr>
              ) : (
                trendRows.map((row, i) => (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    onClick={() => say(`Opening the course report for ${row.course} (sample).`, 'blue')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') say(`Opening the course report for ${row.course} (sample).`, 'blue')
                    }}
                    className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/70 focus:bg-slate-50 focus:outline-none"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-navy">{row.course}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{row.category}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{superAdminExecutiveInt(row.views)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{superAdminExecutiveInt(row.purchases)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{superAdminExecutiveInt(row.enrolments)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-slate-600">{money(row.revenue)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <ArrowUpIcon className="h-3 w-3" />+{row.growth.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex justify-end">
                        <Spark points={row.spark} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Geographic intelligence */}
      <section className={`${cardClass} p-5`} aria-label="Geographic intelligence">
        <SectionHeader
          title="Students & Revenue by Country"
          subtitle="New registrations, purchases and revenue are for the selected period; students are cumulative."
          action={<Tabs label="Geographic metric" value={geoTab} options={superAdminExecutiveGeoTabs} onChange={setGeoTab} />}
        />
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-sm font-semibold text-navy">{geoTabInfo.heading}</h3>
            <ul className="mt-3 divide-y divide-slate-100">
              {geoRows.map((row, i) => {
                const selected = applied.country === row.name
                const dim = applied.country !== SUPER_ADMIN_ALL_COUNTRIES && !selected
                return (
                  <li key={row.code} className={`flex items-center gap-3 py-2.5 ${dim ? 'opacity-50' : ''}`}>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: geoColors[i % geoColors.length] }}
                    >
                      {row.code}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-navy">{row.name}</span>
                    <span className="text-sm font-semibold text-navy">{row.label}</span>
                    <span className="w-14 text-right text-xs text-slate-500">{row.share.toFixed(1)}%</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy">Share by country</h3>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
              {geoRows.map((row, i) => (
                <span key={row.code} title={`${row.name} ${row.share.toFixed(1)}%`} style={{ width: `${row.share}%`, backgroundColor: geoColors[i % geoColors.length] }} />
              ))}
            </div>
            <div className="mt-5 flex h-52 items-end gap-2.5 border-b border-slate-100 pb-px" role="img" aria-label={`${geoTabInfo.heading} bar chart`}>
              {geoRows.map((row, i) => (
                <div key={row.code} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" title={`${row.name}: ${row.label}`}>
                  <span className="text-[11px] font-semibold text-slate-500">{row.share.toFixed(0)}%</span>
                  <div className="w-full max-w-10 rounded-t-md" style={{ height: `${Math.max(3, (row.value / geoMax) * 82)}%`, backgroundColor: geoColors[i % geoColors.length] }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2.5 text-[11px] font-semibold text-slate-500">
              {geoRows.map((row) => (
                <span key={row.code} className="flex-1 text-center">
                  {row.code}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {superAdminExecutiveCountries.length - 1} GCC markets plus other countries · {geoTab === 'revenue' ? `net sales in ${currency}` : geoTab === 'students' ? 'cumulative registered students' : 'active B2B organizations'}
            </p>
          </div>
        </div>
      </section>

      {/* 7. Organization performance */}
      <section className={`${cardClass} overflow-hidden`} aria-label="Organization performance">
        <div className="p-5 pb-4">
          <SectionHeader
            title="Organization Performance"
            subtitle="B2B accounts, course-seat purchases and seat utilization"
            action={<ViewAll to={paths.admin.organizations} />}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {org.stats.map((stat) => (
              <div key={stat.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-navy">{stat.value}</p>
                {stat.sub ? (
                  <p
                    className={`mt-0.5 text-xs font-semibold ${
                      stat.tone === 'green' ? 'text-emerald-600' : stat.tone === 'amber' ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {stat.sub}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <h3 className="mt-5 text-sm font-semibold text-navy">Top Organizations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-left">
                <th className={thClass}>Organization</th>
                <th className={thClass}>Country</th>
                <th className={thClass}>Plan</th>
                <th className={`${thClass} text-right`}>Employees</th>
                <th className={`${thClass} text-right`}>Seats purchased</th>
                <th className={`${thClass} text-right`}>Assigned</th>
                <th className={`${thClass} text-right`}>Unused</th>
                <th className={`${thClass} text-right`}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {org.rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No organizations to show for {applied.country}.
                  </td>
                </tr>
              ) : (
                org.rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-navy">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.country}</td>
                    <td className="px-4 py-3">
                      <ContentBadge tone={row.plan === 'Enterprise' ? 'blue' : 'slate'}>{row.plan}</ContentBadge>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{superAdminExecutiveInt(row.employees)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{superAdminExecutiveInt(row.purchased)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{superAdminExecutiveInt(row.assigned)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${row.unused / row.purchased > 0.15 ? 'text-amber-600' : 'text-slate-600'}`}>
                      {superAdminExecutiveInt(row.unused)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap text-navy">{money(row.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Financial snapshot + learning performance */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className={`${cardClass} p-5`} aria-label="Financial snapshot">
          <SectionHeader
            title="Financial Snapshot"
            subtitle={`${range.current} · ${currency} · completed orders`}
            action={<ViewAll to={paths.admin.finance}>Financial report</ViewAll>}
          />
          <dl className="mt-4">
            {finance.map((line) => (
              <div
                key={line.id}
                className={`flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0 ${line.strong ? 'bg-slate-50/70 px-3 -mx-3 rounded-lg border-transparent' : ''}`}
              >
                <dt className={`text-sm ${line.strong ? 'font-bold text-navy' : 'text-slate-600'}`}>{line.label}</dt>
                <dd className="text-right">
                  <span className={`text-sm ${line.strong ? 'font-bold text-navy' : 'font-semibold text-navy'}`}>{line.value}</span>
                  {line.note ? <span className="ml-2 text-xs text-slate-400">{line.note}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Course profitability is not shown because course and CPD costs are not set up yet.{' '}
              <Link to={paths.admin.costs} className="font-semibold underline-offset-2 hover:underline">
                Set up costs
              </Link>{' '}
              to see margin by course.
            </p>
          </div>
        </div>

        <div className={`${cardClass} p-5`} aria-label="Learning performance">
          <SectionHeader
            title="Learning Performance"
            subtitle={`${range.current} · unique learners, completions and certificates`}
            action={<ViewAll to={paths.admin.learningAnalytics}>Learning analytics</ViewAll>}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {learning.kpis.map((kpi) => (
              <div key={kpi.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                <p className="mt-1 text-xl font-bold text-navy">{kpi.value}</p>
                {kpi.change ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <ArrowUpIcon className="h-3 w-3" />
                    {kpi.change}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          {learningCompare ? <p className="mt-2 text-xs text-slate-400">Change {learningCompare}</p> : null}
          <ul className="mt-5 space-y-5">
            {learning.bars.map((bar) => (
              <li key={bar.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-navy">{bar.label}</span>
                  <span className="text-sm font-bold text-navy">{bar.value.toFixed(1)}%</span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={bar.label}
                  aria-valuenow={Math.round(bar.value)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, bar.value)}%`, backgroundColor: bar.color }} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{bar.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. Recent transactions */}
      <section className={`${cardClass} overflow-hidden`} aria-label="Recent transactions">
        <div className="p-5 pb-4">
          <SectionHeader
            title="Recent Transactions"
            subtitle="Click a row to open the order details."
            action={<ViewAll to={paths.admin.orders} />}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70 text-left">
                <th className={thClass}>Transaction ID</th>
                <th className={thClass}>Customer / Organization</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Course or order</th>
                <th className={thClass}>Country</th>
                <th className={`${thClass} text-right`}>Amount ({currency})</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No recent transactions match these filters.
                  </td>
                </tr>
              ) : (
                transactions.map((row) => (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    onClick={() => navigate(paths.admin.orderDetail)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') navigate(paths.admin.orderDetail)
                    }}
                    className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/70 focus:bg-slate-50 focus:outline-none"
                  >
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-brand">{row.id}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-navy">{row.customer}</td>
                    <td className="px-4 py-3">
                      <ContentBadge tone={row.type === 'B2B' ? 'blue' : 'slate'}>{row.type}</ContentBadge>
                    </td>
                    <td className="max-w-64 truncate px-4 py-3 text-slate-600" title={row.item}>
                      {row.item}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{row.country}</td>
                    <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${row.amount < 0 ? 'text-rose-600' : 'text-navy'}`}>
                      {money(row.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{row.method}</td>
                    <td className="px-4 py-3">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. Action required */}
      <section className={`${cardClass} p-5`} aria-label="Action required">
        <SectionHeader
          title="Action Required"
          subtitle="Issues that need attention across payments, support, content and organizations."
          action={
            <div className="flex items-center gap-3">
              <ContentBadge tone={attention.length ? 'amber' : 'green'}>
                {attention.length ? `${attention.length} open` : 'All clear'}
              </ContentBadge>
              {dismissed.length ? (
                <button
                  type="button"
                  onClick={() => {
                    setDismissed([])
                    say('Dismissed items restored.', 'blue')
                  }}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Restore all
                </button>
              ) : null}
            </div>
          }
        />
        {attention.length === 0 ? (
          <p className="mt-5 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">Nothing needs your attention right now.</p>
        ) : (
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {attention.map((item) => (
              <li key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <span
                  className={`flex h-10 min-w-10 items-center justify-center rounded-[10px] px-2 text-sm font-bold ${
                    item.severity === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.count}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-navy">{item.title}</p>
                    <ContentBadge tone={item.severity === 'High' ? 'red' : 'amber'}>{item.severity}</ContentBadge>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                  <Link to={item.to} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                    {item.cta} <ChevronRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <button
                  type="button"
                  aria-label={`Dismiss ${item.title}`}
                  onClick={() => {
                    setDismissed((current) => [...current, item.id])
                    say(`“${item.title}” dismissed from Action Required.`)
                  }}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
          <ClockIcon className="h-3.5 w-3.5" />
          Last checked 08 Nov 2026 · 10:45 (sample)
        </p>
      </section>
    </div>
  )
}
