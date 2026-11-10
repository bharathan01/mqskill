import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ContentField,
  ContentNotice,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
} from '@/components/common'
import { LightbulbIcon } from '@/components/ui'
import {
  formatLiveDate,
  superAdminLiveAudiences,
  superAdminLiveCourses,
  superAdminLiveInstructors,
  superAdminLiveRecentlyScheduled,
  superAdminLiveScheduleDefaults,
  superAdminLiveScheduleSubtitle,
  superAdminLiveTip,
  superAdminLiveToday,
  type SuperAdminLiveScheduledItem,
  type SuperAdminLiveScheduleValues,
} from '@/constants'
import { paths } from '@/routes/paths'
import { btnOutline, btnPrimary, cardClass } from './catalogUtils'
import { LivePageHeader } from './liveShared'

type Errors = Partial<Record<keyof SuperAdminLiveScheduleValues, string>>

function validate(values: SuperAdminLiveScheduleValues): Errors {
  const errors: Errors = {}
  if (!values.title.trim()) errors.title = 'Enter a class title.'
  if (!values.date) errors.date = 'Choose a date.'
  else if (values.date < superAdminLiveToday) errors.date = 'Date cannot be in the past.'
  if (!values.startTime) errors.startTime = 'Choose a start time.'
  const duration = Number(values.duration)
  if (!values.duration || Number.isNaN(duration) || duration < 15) errors.duration = 'Minimum duration is 15 minutes.'
  const capacity = Number(values.capacity)
  if (!values.capacity || Number.isNaN(capacity) || capacity < 1) errors.capacity = 'Capacity must be at least 1.'
  if (values.zoom.trim() && !/^https?:\/\//i.test(values.zoom.trim())) errors.zoom = 'Enter a link starting with https://'
  return errors
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className={`${cardClass} p-5`}>
      <h2 className="text-base font-bold text-navy">{title}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function AdminScheduleLiveClassPage() {
  const [values, setValues] = useState<SuperAdminLiveScheduleValues>(superAdminLiveScheduleDefaults)
  const [errors, setErrors] = useState<Errors>({})
  const [recent, setRecent] = useState<SuperAdminLiveScheduledItem[]>(superAdminLiveRecentlyScheduled)
  const [notice, setNotice] = useState<string | null>(null)

  const update = <K extends keyof SuperAdminLiveScheduleValues>(key: K, value: SuperAdminLiveScheduleValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      setNotice(null)
      return
    }
    setRecent((current) => [
      {
        id: `rs-${Date.now()}`,
        title: values.title.trim(),
        instructor: values.instructor,
        isoDate: values.date,
        startTime: values.startTime,
      },
      ...current,
    ])
    setNotice(
      `Live class “${values.title.trim()}” scheduled for ${formatLiveDate(values.date)} at ${values.startTime} AST. Learners will be notified.`,
    )
    setValues(superAdminLiveScheduleDefaults)
  }

  const reset = () => {
    setValues(superAdminLiveScheduleDefaults)
    setErrors({})
    setNotice(null)
  }

  return (
    <div className="space-y-5">
      <LivePageHeader
        page="Schedule Live Class"
        subtitle={superAdminLiveScheduleSubtitle}
        actions={
          <Link to={paths.admin.liveClasses} className={btnOutline}>
            All live classes
          </Link>
        }
      />

      {notice ? <ContentNotice onDismiss={() => setNotice(null)}>{notice}</ContentNotice> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Section title="Class details" description="What learners will see on their dashboard.">
            <ContentField label="Class title" htmlFor="live-title" required error={errors.title} className="sm:col-span-2">
              <ContentTextInput
                id="live-title"
                value={values.title}
                invalid={Boolean(errors.title)}
                onChange={(event) => update('title', event.target.value)}
                placeholder="e.g. ISO 45001 Implementation Workshop"
              />
            </ContentField>
            <ContentField label="Course" htmlFor="live-course" required>
              <ContentSelect id="live-course" value={values.course} onChange={(event) => update('course', event.target.value)}>
                {superAdminLiveCourses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField label="Instructor" htmlFor="live-instructor" required>
              <ContentSelect
                id="live-instructor"
                value={values.instructor}
                onChange={(event) => update('instructor', event.target.value)}
              >
                {superAdminLiveInstructors.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField label="Description" htmlFor="live-description" className="sm:col-span-2">
              <ContentTextArea
                id="live-description"
                rows={3}
                value={values.description}
                onChange={(event) => update('description', event.target.value)}
                placeholder="What will learners cover?"
              />
            </ContentField>
          </Section>

          <Section title="Schedule" description="All times are in Arabia Standard Time (AST, UTC+3).">
            <ContentField label="Date" htmlFor="live-date" required error={errors.date}>
              <ContentTextInput
                id="live-date"
                type="date"
                min={superAdminLiveToday}
                value={values.date}
                invalid={Boolean(errors.date)}
                onChange={(event) => update('date', event.target.value)}
              />
            </ContentField>
            <ContentField label="Start time (AST)" htmlFor="live-start" required error={errors.startTime}>
              <ContentTextInput
                id="live-start"
                type="time"
                value={values.startTime}
                invalid={Boolean(errors.startTime)}
                onChange={(event) => update('startTime', event.target.value)}
              />
            </ContentField>
            <ContentField label="Duration (minutes)" htmlFor="live-duration" required error={errors.duration} hint="Minimum 15 minutes.">
              <ContentTextInput
                id="live-duration"
                type="number"
                min={15}
                value={values.duration}
                invalid={Boolean(errors.duration)}
                onChange={(event) => update('duration', event.target.value)}
              />
            </ContentField>
            <ContentField label="Capacity" htmlFor="live-capacity" required error={errors.capacity}>
              <ContentTextInput
                id="live-capacity"
                type="number"
                min={1}
                value={values.capacity}
                invalid={Boolean(errors.capacity)}
                onChange={(event) => update('capacity', event.target.value)}
              />
            </ContentField>
          </Section>

          <Section title="Audience & Zoom" description="Who can join and how the meeting is created.">
            <ContentField label="Audience" htmlFor="live-audience">
              <ContentSelect id="live-audience" value={values.audience} onChange={(event) => update('audience', event.target.value)}>
                {superAdminLiveAudiences.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField
              label="Zoom meeting link"
              htmlFor="live-zoom"
              error={errors.zoom}
              hint="A unique Zoom link is generated if left blank."
            >
              <ContentTextInput
                id="live-zoom"
                type="url"
                value={values.zoom}
                invalid={Boolean(errors.zoom)}
                onChange={(event) => update('zoom', event.target.value)}
                placeholder="Leave blank to auto-generate"
              />
            </ContentField>
            <div className="sm:col-span-2">
              <ContentToggle
                checked={values.record}
                onChange={(value) => update('record', value)}
                label="Record session"
                description="Recording is published to learners after processing."
              />
            </div>
            <div className="sm:col-span-2">
              <ContentToggle
                checked={values.reminders}
                onChange={(value) => update('reminders', value)}
                label="Send 24h and 1h reminders"
                description="Registered learners get an email and in-app reminder."
              />
            </div>
          </Section>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button type="button" onClick={reset} className={btnOutline}>
              Reset
            </button>
            <button type="submit" className={btnPrimary}>
              Schedule class
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-base font-bold text-navy">Recently scheduled</h2>
            <p className="mt-0.5 text-sm text-slate-500">Newest first</p>
            <ul className="mt-4 space-y-3">
              {recent.map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.instructor}</p>
                  <p className="mt-1 text-xs font-semibold text-brand">
                    {formatLiveDate(item.isoDate)} · {item.startTime} AST
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="flex items-start gap-2">
              <LightbulbIcon className="mt-0.5 h-4 w-4 text-amber-500" />
              <div>
                <h2 className="text-base font-bold text-navy">Tip</h2>
                <p className="mt-1 text-sm text-slate-500">{superAdminLiveTip}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
