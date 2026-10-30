type MarkProps = {
  className?: string
}

export function GlobalBoardMark({ className = 'h-16 w-16' }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M20 16.5 32 11l12 5.5-12 5.2-12-5.2Z" fill="#0A2744" />
      <path d="M44 16.5v3.2c0 1.2-5.4 2.2-12 2.2s-12-1-12-2.2v-3.2" stroke="#0A2744" strokeWidth="1.6" />
      <rect x="29.2" y="8.2" width="5.6" height="3.2" rx="0.6" fill="#0A2744" />
      <path d="M32 16.5v4" stroke="#0A2744" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="32" cy="38" r="13.5" stroke="#0A2744" strokeWidth="2" />
      <ellipse cx="32" cy="38" rx="6" ry="13.5" stroke="#0A2744" strokeWidth="1.5" />
      <path d="M19 38h26M21.5 32.2h21M21.5 43.8h21" stroke="#0A2744" strokeWidth="1.5" />
      <path
        d="M17.5 42.5c9 6.2 19.5 6.2 29 0l1.8 4.2c-10.8 7-21.8 7-32.6 0l1.8-4.2Z"
        fill="#E11D48"
      />
    </svg>
  )
}

export function GlobalInstituteMark({ className = 'h-16 w-16' }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle
        cx="32"
        cy="30"
        r="20"
        stroke="#0A2744"
        strokeWidth="1.6"
        strokeDasharray="1.6 3.2"
      />
      <path
        d="M32 12.5c-8.2 0-14.5 6.4-14.5 14.8 0 10.2 14.5 24.2 14.5 24.2s14.5-14 14.5-24.2C46.5 18.9 40.2 12.5 32 12.5Z"
        stroke="#0A2744"
        strokeWidth="2"
      />
      <path
        d="M32 16.2c-6.4 0-11.2 5-11.2 11.4 0 8.2 11.2 19.2 11.2 19.2s11.2-11 11.2-19.2c0-6.4-4.8-11.4-11.2-11.4Z"
        fill="#E11D48"
      />
      <circle cx="32" cy="24.5" r="3.4" fill="#0A2744" />
      <path d="M24.8 36.2c1.4-4.2 4.2-6.4 7.2-6.4s5.8 2.2 7.2 6.4" fill="#0A2744" />
      <circle cx="22" cy="14.5" r="1.3" fill="#E11D48" />
      <circle cx="42" cy="14.5" r="1.3" fill="#E11D48" />
      <circle cx="48.5" cy="28" r="1.3" fill="#E11D48" />
      <circle cx="15.5" cy="28" r="1.3" fill="#E11D48" />
    </svg>
  )
}

export function NationalUniversityMark({ className = 'h-16 w-16' }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 8c-10 0-17.5 7.8-17.5 18 0 12.6 17.5 30 17.5 30s17.5-17.4 17.5-30C49.5 15.8 42 8 32 8Z"
        fill="#E11D48"
      />
      <path
        d="M32 12.2c-7.8 0-13.8 6.2-13.8 14 0 10 13.8 23.8 13.8 23.8s13.8-13.8 13.8-23.8c0-7.8-6-14-13.8-14Z"
        fill="#fff"
        stroke="#0A2744"
        strokeWidth="1.6"
      />
      <circle cx="32" cy="24" r="4" fill="#0A2744" />
      <path d="M23.5 38.5c1.8-5.4 5.2-8 8.5-8s6.7 2.6 8.5 8" fill="#0A2744" />
      <path d="M28.2 27.4h7.6" stroke="#0A2744" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="26.2" cy="13.2" r="1.4" fill="#E11D48" />
      <circle cx="32" cy="10.8" r="1.4" fill="#E11D48" />
      <circle cx="37.8" cy="13.2" r="1.4" fill="#E11D48" />
    </svg>
  )
}

export function CollegiateCouncilMark({ className = 'h-16 w-16' }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 8 14 14.5v16.2c0 11.6 7.6 18.8 18 21.3 10.4-2.5 18-9.7 18-21.3V14.5L32 8Z"
        stroke="#0A2744"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="27.2" cy="24.5" r="4" stroke="#0A2744" strokeWidth="1.8" />
      <circle cx="38.2" cy="24.5" r="4" stroke="#0A2744" strokeWidth="1.8" />
      <path
        d="M20.8 37.5c2-5 5.4-7.4 8.4-7.4 2.2 0 4 1.2 5.6 3.2 1.6-2 3.4-3.2 5.6-3.2 3 0 6.4 2.4 8.4 7.4"
        stroke="#0A2744"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 41.5c10.5 6.4 21.5 6.4 32 0l1.6 3.8c-11.6 7.2-23.6 7.2-35.2 0L16 41.5Z"
        fill="#E11D48"
      />
      <circle cx="24.5" cy="12.5" r="1.4" fill="#E11D48" />
      <circle cx="32" cy="10.2" r="1.4" fill="#E11D48" />
      <circle cx="39.5" cy="12.5" r="1.4" fill="#E11D48" />
    </svg>
  )
}

export function PremierCollegeMark({ className = 'h-16 w-16' }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 10c-9 0-15.8 7-15.8 16.2 0 11.4 15.8 26.8 15.8 26.8s15.8-15.4 15.8-26.8C47.8 17 41 10 32 10Z"
        stroke="#0A2744"
        strokeWidth="2"
      />
      <circle cx="27.4" cy="24.2" r="3.2" fill="#0A2744" />
      <circle cx="37.4" cy="24.2" r="3.2" fill="#0A2744" />
      <path d="M20.8 36.5c1.6-4.4 4.4-6.6 7.4-6.6 2 0 3.6 1 5 2.6 1.4-1.6 3-2.6 5-2.6 3 0 5.8 2.2 7.4 6.6" fill="#0A2744" />
      <path
        d="M18 41.8c9.4 6 18.6 6 28 0l1.7 4c-10.4 6.8-20.8 6.8-31.4 0l1.7-4Z"
        fill="#E11D48"
      />
      <path
        d="M16 28c2.4-6 6.2-10 9.2-11.6M48 28c-2.4-6-6.2-10-9.2-11.6"
        stroke="#0A2744"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
