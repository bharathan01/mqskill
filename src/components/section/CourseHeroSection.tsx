import {
  courseHeroCopy,
  type CourseDetail,
  type CoursePerkIcon,
} from '@/constants/courseDetails'
import {
  BriefcaseIcon,
  CaptionsIcon,
  CheckCircleIcon,
  Container,
  GlobeIcon,
  GraduationCapIcon,
  LayersIcon,
  SmileIcon,
  StarIcon,
  TrophyIcon,
} from '@/components/ui'

const perkIcons: Record<CoursePerkIcon, typeof GraduationCapIcon> = {
  diploma: GraduationCapIcon,
  kit: LayersIcon,
  community: SmileIcon,
}

function formatCount(value: number) {
  return value.toLocaleString('en-US')
}

function RatingStars({ value }: { value: number }) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, value - index))
        return (
          <span key={index} className="relative h-4 w-4">
            <StarIcon className="h-4 w-4 text-white/20" />
            {fill > 0 ? (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon className="h-4 w-4 text-amber-400" />
              </span>
            ) : null}
          </span>
        )
      })}
    </span>
  )
}

export function CourseHeroSection({ course }: { course: CourseDetail }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#06153D] via-[#0B2A72] to-[#1D4ED8] py-12 text-white sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_50%,rgba(96,165,250,0.35),transparent_55%)]" />
      <Container className="relative">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {course.bestseller ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#7CFFC4] px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-900 uppercase">
                <TrophyIcon className="h-3.5 w-3.5" />
                {courseHeroCopy.bestseller}
              </span>
            ) : null}
            {course.accredited ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-cyan-100 uppercase">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                {courseHeroCopy.accredited}
              </span>
            ) : null}
            <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
              {course.updated}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.12]">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            {course.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <a
              href="#reviews"
              className="flex items-center gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
            >
              <span className="font-semibold text-amber-400">{course.rating.toFixed(1)}</span>
              <RatingStars value={course.rating} />
              <span className="text-sky-300 underline underline-offset-2">
                ({formatCount(course.reviews)} {courseHeroCopy.ratings})
              </span>
            </a>
            <span className="text-white/40">•</span>
            <span className="text-slate-200">
              {formatCount(course.learners)} {courseHeroCopy.learners}
            </span>
            {course.jobGuarantee ? (
              <>
                <span className="text-white/40">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                  <BriefcaseIcon className="h-4 w-4" />
                  {courseHeroCopy.jobGuarantee}
                </span>
              </>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <img
                src={course.instructor.avatar}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />
              <span>
                {courseHeroCopy.createdBy}{' '}
                <a href="#instructor" className="font-medium text-white underline underline-offset-2">
                  {course.instructor.name}
                </a>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GlobeIcon className="h-4 w-4 text-slate-300" />
              {course.language}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CaptionsIcon className="h-4 w-4 text-slate-300" />
              {course.subtitles}
            </span>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {course.perks.map((perk) => {
              const Icon = perkIcons[perk.icon]
              return (
                <li
                  key={perk.id}
                  className="inline-flex items-center gap-2 rounded-full bg-[#071433]/55 px-3 py-2 text-sm text-white ring-1 ring-white/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {perk.label}
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
