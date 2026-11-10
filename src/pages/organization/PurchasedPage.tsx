import { useMemo, type ReactElement } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  organizationPurchasedCourses,
  organizationPurchasedPage,
  type OrganizationPurchasedCourse,
} from '@/constants'
import { organizationPurchasedCoursePath, paths } from '@/routes/paths'
import {
  AlertTriangleIcon,
  AwardIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CartIcon,
  ChatIcon,
  InfoIcon,
  MegaphoneIcon,
  PlusIcon,
  ShieldCheckIcon,
  TicketIcon,
  UserIcon,
} from '@/components/ui'

const iconMap = {
  megaphone: MegaphoneIcon,
  shield: ShieldCheckIcon,
  badge: BadgeCheckIcon,
  briefcase: BriefcaseIcon,
  alert: AlertTriangleIcon,
  chat: ChatIcon,
} as const

function MetricCard({
  label,
  value,
  detail,
  icon,
  iconClass,
}: {
  label: string
  value: string
  detail: string
  icon: ReactElement
  iconClass: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-navy">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </span>
      </div>
    </div>
  )
}

function SeatUseBar({ assigned, bought }: { assigned: number; bought: number }) {
  const percent = bought === 0 ? 0 : Math.round((assigned / bought) * 100)
  const full = assigned >= bought && bought > 0

  return (
    <div className="flex min-w-[8rem] items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${full ? 'bg-orange-400' : 'bg-brand'}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-semibold text-slate-600">
        {assigned}/{bought}
      </span>
    </div>
  )
}

function CourseRow({ course }: { course: OrganizationPurchasedCourse }) {
  const Icon = iconMap[course.icon]
  const navigate = useNavigate()

  if (course.status === 'awaiting_payment') {
    return (
      <tr className="border-b border-amber-100 bg-amber-50/70 last:border-0">
        <td className="px-5 py-4" colSpan={6}>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.accent}`}
            >
              <Icon className="h-5 w-5 text-white" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-navy">{course.title}</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Order {course.orderId}
                {course.orderNote ? ` · ${course.orderNote}` : ''}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {organizationPurchasedPage.awaitingPayment}
            </span>
          </div>
        </td>
        <td className="px-5 py-4 text-right">
          <p className="text-sm text-slate-500">{organizationPurchasedPage.unlocksAfterPayment}</p>
          <Link
            to={paths.organization.billing}
            className="mt-1 inline-block text-sm font-semibold text-brand hover:text-blue-700"
          >
            {organizationPurchasedPage.viewOrder}
          </Link>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <Link
          to={organizationPurchasedCoursePath(course.id)}
          className="flex min-w-[14rem] items-center gap-3 hover:opacity-90"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.accent}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </span>
          <span className="text-sm font-semibold text-navy">{course.title}</span>
        </Link>
      </td>
      <td className="px-5 py-4 text-sm font-medium text-slate-700">{course.bought}</td>
      <td className="px-5 py-4 text-sm font-medium text-slate-700">{course.assigned}</td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            course.free > 0 ? 'bg-[#EAF2FF] text-brand' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {organizationPurchasedPage.freeLabel(course.free)}
        </span>
      </td>
      <td className="px-5 py-4 text-sm font-medium text-slate-700">{course.done}</td>
      <td className="px-5 py-4">
        <SeatUseBar assigned={course.assigned} bought={course.bought} />
      </td>
      <td className="px-5 py-4 text-right">
        {course.free > 0 ? (
          <Link
            to={organizationPurchasedCoursePath(course.id)}
            className="inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {organizationPurchasedPage.assignSeats}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => navigate(paths.organization.catalog)}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {organizationPurchasedPage.buyMore}
          </button>
        )}
      </td>
    </tr>
  )
}

export function OrganizationPurchasedPage() {
  const navigate = useNavigate()
  const courses = organizationPurchasedCourses

  const metrics = useMemo(() => {
    const active = courses.filter((item) => item.status === 'active')
    const seatsBought = active.reduce((sum, item) => sum + item.bought, 0)
    const assigned = active.reduce((sum, item) => sum + item.assigned, 0)
    const free = active.reduce((sum, item) => sum + item.free, 0)
    const completed = active.reduce((sum, item) => sum + item.done, 0)
    const assignedPercent = seatsBought === 0 ? 0 : Math.round((assigned / seatsBought) * 100)
    return {
      seatsBought,
      courseCount: active.length,
      assigned,
      assignedPercent,
      free,
      completed,
    }
  }, [courses])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
            {organizationPurchasedPage.eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy">{organizationPurchasedPage.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            {organizationPurchasedPage.subtitle}
          </p>
        </header>
        <button
          type="button"
          onClick={() => navigate(paths.organization.catalog)}
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <CartIcon className="h-4 w-4" />
          {organizationPurchasedPage.buyMoreSeats}
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={organizationPurchasedPage.metrics.seatsBought}
          value={String(metrics.seatsBought)}
          detail={organizationPurchasedPage.metrics.seatsBoughtDetail(metrics.courseCount)}
          icon={<TicketIcon className="h-5 w-5" />}
          iconClass="bg-[#EAF2FF] text-brand"
        />
        <MetricCard
          label={organizationPurchasedPage.metrics.assigned}
          value={String(metrics.assigned)}
          detail={organizationPurchasedPage.metrics.assignedDetail(metrics.assignedPercent)}
          icon={<UserIcon className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          label={organizationPurchasedPage.metrics.free}
          value={String(metrics.free)}
          detail={organizationPurchasedPage.metrics.freeDetail}
          icon={<PlusIcon className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-600"
        />
        <MetricCard
          label={organizationPurchasedPage.metrics.completed}
          value={String(metrics.completed)}
          detail={organizationPurchasedPage.metrics.completedDetail}
          icon={<AwardIcon className="h-5 w-5" />}
          iconClass="bg-[#EAF2FF] text-brand"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,40,80,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-400 uppercase">
                {organizationPurchasedPage.headers.map((header, index) => (
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
              {courses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-2.5 border-t border-slate-100 bg-[#EAF2FF]/60 px-5 py-3 text-sm text-slate-600">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p>{organizationPurchasedPage.footer}</p>
        </div>
      </section>
    </div>
  )
}
