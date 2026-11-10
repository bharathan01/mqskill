import {
  contentLibraryAssignments,
  contentLibraryQuizzes,
  courseBuilderSettingsCopy,
} from '@/constants'
import {
  ContentCard,
  ContentField,
  ContentSelect,
  ContentTextInput,
  ContentToggle,
  useCourseBuilder,
} from '@/components/common'

const copy = courseBuilderSettingsCopy
const fields = copy.fields

function OptionCards<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string
  value: T | ''
  options: readonly { id: T; label: string; hint?: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const active = value === option.id
        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
              active ? 'border-brand bg-[#EFF4FF]' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name={name}
              checked={active}
              onChange={() => onChange(option.id)}
              className="mt-1 accent-[#004ea8]"
            />
            <span>
              <span className="block text-sm font-semibold text-navy">{option.label}</span>
              {option.hint ? (
                <span className="block text-xs text-slate-500">{option.hint}</span>
              ) : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export function CourseBuilderSettingsPage() {
  const { settings, updateSettings } = useCourseBuilder()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy">{copy.title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{copy.subtitle}</p>
      </div>

      <ContentCard title={copy.sections.access}>
        <div className="space-y-5">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-navy">{fields.visibility}</p>
            <OptionCards
              name="visibility"
              value={settings.visibility}
              options={copy.visibilityOptions}
              onChange={(visibility) => updateSettings({ visibility })}
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-navy">{fields.enrolment}</p>
            <OptionCards
              name="enrolment"
              value={settings.enrolment}
              options={copy.enrolmentOptions}
              onChange={(enrolment) => updateSettings({ enrolment })}
            />
          </div>
        </div>
      </ContentCard>

      <ContentCard title={copy.sections.completion}>
        <div className="grid gap-4 md:grid-cols-2">
          <ContentField label={fields.completionRule} htmlFor="cs-rule">
            <ContentSelect
              id="cs-rule"
              value={settings.completionRule}
              onChange={(event) =>
                updateSettings({ completionRule: event.target.value as typeof settings.completionRule })
              }
            >
              <option value="">Select completion rule</option>
              {copy.completionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </ContentSelect>
          </ContentField>
          {settings.completionRule === 'percentage' ? (
            <ContentField label={fields.completionPercent} htmlFor="cs-percent">
              <ContentTextInput
                id="cs-percent"
                type="number"
                min={1}
                max={100}
                value={settings.completionPercent}
                onChange={(event) =>
                  updateSettings({
                    completionPercent:
                      event.target.value === ''
                        ? ''
                        : Math.min(100, Math.max(1, Number(event.target.value) || 1)),
                  })
                }
              />
            </ContentField>
          ) : null}
          <div className="md:col-span-2">
            <ContentToggle
              checked={settings.sequential}
              label={fields.sequential}
              onChange={(sequential) => updateSettings({ sequential })}
            />
          </div>
          <div className="md:col-span-2">
            <ContentToggle
              checked={settings.finalAssessment}
              label={fields.finalAssessment}
              onChange={(finalAssessment) =>
                updateSettings({
                  finalAssessment,
                  ...(finalAssessment
                    ? {}
                    : {
                        finalQuizId: '',
                        finalAssignmentId: '',
                        finalQuizMandatory: false,
                        finalAssignmentMandatory: false,
                      }),
                })
              }
            />
          </div>
          {settings.finalAssessment ? (
            <>
              <ContentField label={fields.finalPassMark} htmlFor="cs-final-pass">
                <ContentTextInput
                  id="cs-final-pass"
                  type="number"
                  min={0}
                  max={100}
                  value={settings.finalPassMark}
                  onChange={(event) =>
                    updateSettings({
                      finalPassMark:
                        event.target.value === ''
                          ? ''
                          : Math.min(100, Math.max(0, Number(event.target.value) || 0)),
                    })
                  }
                />
              </ContentField>
              <ContentField label={fields.finalAttempts} htmlFor="cs-final-attempts">
                <ContentTextInput
                  id="cs-final-attempts"
                  type="number"
                  min={1}
                  value={settings.finalAttempts}
                  onChange={(event) =>
                    updateSettings({
                      finalAttempts:
                        event.target.value === ''
                          ? ''
                          : Math.max(1, Number(event.target.value) || 1),
                    })
                  }
                />
              </ContentField>
            </>
          ) : null}
        </div>
      </ContentCard>

      <ContentCard title={copy.sections.endAssessments}>
        <div className="grid gap-4 md:grid-cols-2">
          <ContentField
            label={fields.finalQuiz}
            htmlFor="cs-final-quiz"
            hint={fields.finalQuizHint}
            className="md:col-span-2"
          >
            <ContentSelect
              id="cs-final-quiz"
              value={settings.finalQuizId}
              onChange={(event) =>
                updateSettings({
                  finalQuizId: event.target.value,
                  finalAssessment: Boolean(event.target.value || settings.finalAssignmentId),
                })
              }
            >
              <option value="">{fields.finalQuizNone}</option>
              {contentLibraryQuizzes
                .filter((item) => item.status === 'ready')
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                    {item.usedInCourses.length
                      ? ` · ${item.usedInCourses.map((c) => c.title).join(', ')}`
                      : ''}
                  </option>
                ))}
            </ContentSelect>
          </ContentField>
          {settings.finalQuizId ? (
            <div className="md:col-span-2">
              <ContentToggle
                checked={settings.finalQuizMandatory}
                label={fields.finalQuizMandatory}
                onChange={(finalQuizMandatory) => updateSettings({ finalQuizMandatory })}
              />
            </div>
          ) : null}
          <ContentField
            label={fields.finalAssignment}
            htmlFor="cs-final-asg"
            hint={fields.finalAssignmentHint}
            className="md:col-span-2"
          >
            <ContentSelect
              id="cs-final-asg"
              value={settings.finalAssignmentId}
              onChange={(event) =>
                updateSettings({
                  finalAssignmentId: event.target.value,
                  finalAssessment: Boolean(event.target.value || settings.finalQuizId),
                })
              }
            >
              <option value="">{fields.finalAssignmentNone}</option>
              {contentLibraryAssignments
                .filter((item) => item.status === 'ready')
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                    {item.usedInCourses.length
                      ? ` · ${item.usedInCourses.map((c) => c.title).join(', ')}`
                      : ''}
                  </option>
                ))}
            </ContentSelect>
          </ContentField>
          {settings.finalAssignmentId ? (
            <div className="md:col-span-2">
              <ContentToggle
                checked={settings.finalAssignmentMandatory}
                label={fields.finalAssignmentMandatory}
                onChange={(finalAssignmentMandatory) =>
                  updateSettings({ finalAssignmentMandatory })
                }
              />
            </div>
          ) : null}
        </div>
      </ContentCard>

      <ContentCard title={copy.sections.certification}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <ContentToggle
              checked={settings.certificateEnabled}
              label={fields.certificate}
              onChange={(certificateEnabled) => updateSettings({ certificateEnabled })}
            />
          </div>
          {settings.certificateEnabled ? (
            <>
              <ContentField label={fields.certificateTemplate} htmlFor="cs-template">
                <ContentSelect
                  id="cs-template"
                  value={settings.certificateTemplate}
                  onChange={(event) => updateSettings({ certificateTemplate: event.target.value })}
                >
                  <option value="">Select template</option>
                  {copy.certificateTemplates.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </ContentSelect>
              </ContentField>
              <ContentField label={fields.validityMonths} htmlFor="cs-validity">
                <ContentTextInput
                  id="cs-validity"
                  type="number"
                  min={0}
                  value={settings.validityMonths}
                  onChange={(event) => updateSettings({ validityMonths: event.target.value })}
                />
              </ContentField>
            </>
          ) : null}
          <div className="md:col-span-2">
            <ContentToggle
              checked={settings.cpdEnabled}
              label={fields.cpd}
              onChange={(cpdEnabled) => updateSettings({ cpdEnabled })}
            />
          </div>
          {settings.cpdEnabled ? (
            <>
              <ContentField label={fields.cpdHours} htmlFor="cs-cpd-hours">
                <ContentTextInput
                  id="cs-cpd-hours"
                  type="number"
                  min={0}
                  step={0.5}
                  value={settings.cpdHours}
                  onChange={(event) => updateSettings({ cpdHours: event.target.value })}
                />
              </ContentField>
              <ContentField label={fields.accreditationBody} htmlFor="cs-accreditation">
                <ContentSelect
                  id="cs-accreditation"
                  value={settings.accreditationBody}
                  onChange={(event) => updateSettings({ accreditationBody: event.target.value })}
                >
                  <option value="">Select body</option>
                  {copy.accreditationBodies.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </ContentSelect>
              </ContentField>
            </>
          ) : null}
        </div>
      </ContentCard>

      <ContentCard title={copy.sections.engagement}>
        <div className="grid gap-3 md:grid-cols-2">
          <ContentToggle
            checked={settings.qaEnabled}
            label={fields.qa}
            onChange={(qaEnabled) => updateSettings({ qaEnabled })}
          />
          <ContentToggle
            checked={settings.downloadsEnabled}
            label={fields.downloads}
            onChange={(downloadsEnabled) => updateSettings({ downloadsEnabled })}
          />
          <ContentToggle
            checked={settings.notifyOnEnrol}
            label={fields.notifyOnEnrol}
            onChange={(notifyOnEnrol) => updateSettings({ notifyOnEnrol })}
          />
        </div>
      </ContentCard>

      <ContentCard title={copy.sections.publishing}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={settings.scheduledPublish ? '' : 'md:col-span-2'}>
            <ContentToggle
              checked={settings.scheduledPublish}
              label={fields.scheduledPublish}
              onChange={(scheduledPublish) => updateSettings({ scheduledPublish })}
            />
          </div>
          {settings.scheduledPublish ? (
            <ContentField label={fields.publishDate} htmlFor="cs-publish-date">
              <ContentTextInput
                id="cs-publish-date"
                type="date"
                value={settings.publishDate}
                onChange={(event) => updateSettings({ publishDate: event.target.value })}
              />
            </ContentField>
          ) : null}
        </div>
      </ContentCard>
    </div>
  )
}
