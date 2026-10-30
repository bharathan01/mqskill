import type { ComponentType } from 'react'
import type { CourseCredentialIcon, CourseDetail } from '@/constants/courseDetails'
import {
  BadgeCheckIcon,
  ChatIcon,
  CheckIcon,
  FileIcon,
  GlobeIcon,
  GraduationCapIcon,
  LinkedInIcon,
  PlayCircleIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from '@/components/ui'

const credentialIcons: Record<CourseCredentialIcon, ComponentType<{ className?: string }>> = {
  accredited: GraduationCapIcon,
  linkedin: LinkedInIcon,
  qr: QrCodeIcon,
  globe: GlobeIcon,
}

export function CourseInstructorSection({ course }: { course: CourseDetail }) {
  const { credential, instructor } = course

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-[#F3F7FF] via-[#EEF4FF] to-[#E8F0FF] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              {credential.badge}
            </p>
            <h2 className="mt-3 font-hero text-2xl font-bold text-navy sm:text-[1.85rem]">
              {credential.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{credential.description}</p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
          >
            <FileIcon className="h-4 w-4" />
            {credential.preview}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {credential.items.map((item) => {
            const Icon = credentialIcons[item.icon]
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white px-3 py-5 text-center shadow-sm"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2FF] text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-bold text-navy">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.subtitle}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-500">
                  <CheckIcon className="h-3 w-3" />
                  {item.chip}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div id="instructor" className="scroll-mt-28 rounded-2xl border border-slate-200 p-6 sm:p-8">
        <p className="text-[11px] font-bold tracking-[0.16em] text-brand uppercase">
          Your Instructor
        </p>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
          <img
            src={instructor.avatar}
            alt=""
            className="h-24 w-24 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-black">
              {instructor.name}
              {instructor.verified ? (
                <BadgeCheckIcon className="h-5 w-5 text-teal-500" />
              ) : null}
            </h3>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">{instructor.role}</p>
            <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <li className="inline-flex items-center gap-1.5">
                <StarIcon className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-black">{instructor.rating.toFixed(1)}</span>
                Rating
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ChatIcon className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-black">
                  {instructor.reviews.toLocaleString('en-US')}
                </span>
                Reviews
              </li>
              <li className="inline-flex items-center gap-1.5">
                <UsersIcon className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-black">{instructor.students}</span>
                Students
              </li>
              <li className="inline-flex items-center gap-1.5">
                <PlayCircleIcon className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-black">{instructor.courses}</span>
                Courses
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">{instructor.bio}</p>
      </div>
    </section>
  )
}
