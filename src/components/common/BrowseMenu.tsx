import { Link } from 'react-router'
import { browseMenu } from '@/constants/browseMenu'
import {
  AtomIcon,
  BoltIcon,
  BrainIcon,
  ChartIcon,
  ChevronRightIcon,
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  FlameIcon,
  GridIcon,
  LayersIcon,
  MegaphoneIcon,
  MonitorIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StarIcon,
  TrophyIcon,
} from '@/components/ui'

const itemIcons = {
  code: CodeIcon,
  monitor: MonitorIcon,
  database: DatabaseIcon,
  layers: LayersIcon,
  chart: ChartIcon,
  megaphone: MegaphoneIcon,
  sparkle: SparkleIcon,
  cloud: CloudIcon,
  brain: BrainIcon,
  atom: AtomIcon,
  shield: ShieldCheckIcon,
}

const tones = {
  blue: 'bg-blue-50 text-blue-500',
  green: 'bg-emerald-50 text-emerald-500',
  teal: 'bg-teal-50 text-teal-600',
  purple: 'bg-violet-50 text-violet-500',
  orange: 'bg-orange-50 text-orange-500',
  pink: 'bg-rose-50 text-rose-500',
  cyan: 'bg-sky-50 text-sky-500',
  indigo: 'bg-indigo-50 text-indigo-500',
}

type BrowseMenuProps = {
  onNavigate: () => void
}

function IconBadge({
  icon,
  tone,
}: {
  icon: keyof typeof itemIcons
  tone: keyof typeof tones
}) {
  const Icon = itemIcons[icon]
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
    >
      <Icon className="h-4 w-4" />
    </span>
  )
}

export function BrowseMenu({ onNavigate }: BrowseMenuProps) {
  return (
    <div
      role="menu"
      className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_24px_60px_rgba(15,40,80,0.12)]"
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-4">
        <section className="flex flex-col border-slate-100 p-5 md:border-r">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand">
              <GridIcon className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-brand">{browseMenu.categories.title}</h3>
          </div>
          <ul className="flex flex-1 flex-col gap-1">
            {browseMenu.categories.items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  role="menuitem"
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-slate-50"
                >
                  <IconBadge icon={item.icon} tone={item.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy">{item.name}</span>
                    <span className="block text-xs text-slate-400">{item.topics}</span>
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={browseMenu.categories.viewAllTo}
            onClick={onNavigate}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-50 py-2.5 text-sm font-semibold text-brand"
          >
            {browseMenu.categories.viewAll} →
          </Link>
        </section>

        <section className="flex flex-col border-slate-100 p-5 md:border-r">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <FlameIcon className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-brand">{browseMenu.trending.title}</h3>
          </div>
          <ul className="flex flex-1 flex-col gap-1">
            {browseMenu.trending.items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  role="menuitem"
                  onClick={onNavigate}
                  className="flex items-start gap-3 rounded-xl px-1 py-2 hover:bg-slate-50"
                >
                  <IconBadge icon={item.icon} tone={item.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy">{item.title}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <StarIcon className="h-3 w-3 text-amber-400" />
                      <span className="font-semibold text-amber-500">{item.rating}</span>
                      <span>· {item.meta}</span>
                    </span>
                  </span>
                  <ChevronRightIcon className="mt-1 h-4 w-4 text-slate-300" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={browseMenu.trending.viewAllTo}
            onClick={onNavigate}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-50 py-2.5 text-sm font-semibold text-brand"
          >
            {browseMenu.trending.viewAll} →
          </Link>
        </section>

        <section className="flex flex-col border-slate-100 p-5 xl:border-r">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <TrophyIcon className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-brand">{browseMenu.popular.title}</h3>
          </div>
          <ul className="flex flex-1 flex-col gap-1">
            {browseMenu.popular.items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  role="menuitem"
                  onClick={onNavigate}
                  className="flex items-start gap-3 rounded-xl px-1 py-2 hover:bg-slate-50"
                >
                  <IconBadge icon={item.icon} tone={item.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy">{item.title}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <StarIcon className="h-3 w-3 text-amber-400" />
                      <span className="font-semibold text-amber-500">{item.rating}</span>
                      <span>· {item.meta}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={browseMenu.popular.viewAllTo}
            onClick={onNavigate}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-50 py-2.5 text-sm font-semibold text-brand"
          >
            {browseMenu.popular.viewAll} →
          </Link>
        </section>

        <section className="flex flex-col p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
              <BoltIcon className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-brand">{browseMenu.recent.title}</h3>
          </div>
          <ul className="flex flex-1 flex-col gap-1">
            {browseMenu.recent.items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  role="menuitem"
                  onClick={onNavigate}
                  className="flex items-start gap-3 rounded-xl px-1 py-2 hover:bg-slate-50"
                >
                  <IconBadge icon={item.icon} tone={item.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-navy">{item.title}</span>
                      {item.isNew ? (
                        <span className="shrink-0 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                          NEW
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-xs text-emerald-600">{item.meta}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={browseMenu.recent.viewAllTo}
            onClick={onNavigate}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand py-2.5 text-sm font-semibold text-white"
          >
            {browseMenu.recent.viewAll} →
          </Link>
        </section>
      </div>
    </div>
  )
}
