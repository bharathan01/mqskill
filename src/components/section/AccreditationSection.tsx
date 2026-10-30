import { Link } from 'react-router'
import { accreditationSection } from '@/constants/accreditation'
import { paths } from '@/routes/paths'
import { Container } from '@/components/ui'
import {
  CollegiateCouncilMark,
  GlobalBoardMark,
  GlobalInstituteMark,
  NationalUniversityMark,
  PremierCollegeMark,
} from './accreditationMarks'

const partnerMarks = {
  'global-board': GlobalBoardMark,
  'global-institute': GlobalInstituteMark,
  'national-university': NationalUniversityMark,
  'collegiate-council': CollegiateCouncilMark,
  'premier-college': PremierCollegeMark,
}

function DiamondIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M6 1.2 10.8 6 6 10.8 1.2 6 6 1.2Z" fill="currentColor" />
    </svg>
  )
}

function StatusCheckIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m4.8 8.1 2.1 2.1 4.3-4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PerkCheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="m6 10.2 2.4 2.4 5.6-5.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AccreditationSection() {
  return (
    <section className="bg-white pb-14 sm:pb-16">
      <Container>
        <div className="rounded-[32px] bg-gradient-to-br from-[#E7F8F0] via-[#EEF3FC] to-[#E4EBFC] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
            <DiamondIcon className="h-2.5 w-2.5" />
            {accreditationSection.badge}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {accreditationSection.title}
            <span className="mt-1 block w-fit border-b-[3px] border-brand pb-0.5">
              {accreditationSection.highlight}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            {accreditationSection.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {accreditationSection.partners.map((partner) => {
              const Mark = partnerMarks[partner.icon]
              return (
                <article
                  key={partner.id}
                  className="flex flex-col items-center rounded-2xl bg-white px-4 py-7 text-center shadow-[0_10px_30px_rgba(15,40,80,0.06)]"
                >
                  <Mark className="h-[4.5rem] w-[4.5rem]" />
                  <h3 className="mt-5 text-sm font-bold text-navy">{partner.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{partner.role}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <StatusCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                    {partner.status}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {accreditationSection.perks.map((perk) => (
                <li key={perk} className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                  <PerkCheckIcon className="h-5 w-5 text-navy" />
                  {perk}
                </li>
              ))}
            </ul>
            <Link
              to={paths.about}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white"
            >
              {accreditationSection.cta} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
