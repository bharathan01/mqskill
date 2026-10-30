import { Link } from 'react-router'
import type { CourseDetail, CourseIncludeIcon } from '@/constants/courseDetails'
import {
  AwardIcon,
  BuildingIcon,
  CartIcon,
  ClockIcon,
  DevicesIcon,
  FileIcon,
  FolderIcon,
  GiftIcon,
  InfinityIcon,
  PlayIcon,
  ShareIcon,
  VideoIcon,
} from '@/components/ui'

const includeIcons: Record<CourseIncludeIcon, typeof VideoIcon> = {
  video: VideoIcon,
  files: FileIcon,
  projects: FolderIcon,
  devices: DevicesIcon,
  lifetime: InfinityIcon,
  certificate: AwardIcon,
}

function formatPrice(prefix: string, value: number) {
  return `${prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function CoursePurchaseCard({ course }: { course: CourseDetail }) {
  const { offer } = course

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,40,80,0.08)]">
      <button type="button" className="group relative block w-full text-left">
        <img src={offer.image} alt="" className="h-48 w-full object-cover" />
        <span className="absolute top-3 left-3 rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white">
          {offer.previewLabel}
        </span>
        <span className="absolute inset-0 flex flex-col items-center justify-center bg-navy/25">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy shadow-lg">
            <PlayIcon className="ml-0.5 h-6 w-6" />
          </span>
          <span className="mt-3 text-xs font-bold tracking-[0.16em] text-white uppercase">
            {offer.previewCta}
          </span>
        </span>
      </button>

      <div className="p-5">
        <div className="flex flex-wrap items-end gap-2">
          <p className="text-3xl font-extrabold tracking-tight text-navy">
            {formatPrice(offer.prefix, offer.price)}
          </p>
          <p className="text-base text-slate-400 line-through">
            {formatPrice(offer.prefix, offer.originalPrice)}
          </p>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-500">
            {offer.discountLabel}
          </span>
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-rose-500">
          <ClockIcon className="h-4 w-4" />
          {offer.urgency}
        </p>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-navy py-3 text-sm font-semibold text-white"
        >
          <CartIcon className="h-4 w-4" />
          {offer.addToCart}
        </button>
        <button
          type="button"
          className="mt-3 w-full rounded-full border-2 border-navy py-2.5 text-sm font-semibold text-navy"
        >
          {offer.buyNow}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          {offer.guarantee} • {offer.trial}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-sm font-bold text-navy">{offer.includesTitle}</p>
          <ul className="mt-3 space-y-2.5">
            {offer.includes.map((item) => {
              const Icon = includeIcons[item.icon]
              return (
                <li key={item.id} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  {item.label}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500">
          <button type="button" className="inline-flex items-center gap-1.5 hover:text-navy">
            <ShareIcon className="h-4 w-4" />
            {offer.share}
          </button>
          <span>•</span>
          <button type="button" className="inline-flex items-center gap-1.5 hover:text-navy">
            <GiftIcon className="h-4 w-4" />
            {offer.gift}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <BuildingIcon className="h-4 w-4" />
            {offer.team}
          </p>
          <Link to={offer.teamTo} className="text-sm font-semibold text-brand">
            {offer.teamCta}
          </Link>
        </div>
      </div>
    </aside>
  )
}
