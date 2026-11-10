import { useRef, useState, type ChangeEvent } from 'react'
import {
  courseBuilderCategories,
  courseBuilderDeliveryModes,
  courseBuilderDetailsCopy,
  courseBuilderInstructors,
  courseBuilderLanguages,
  courseBuilderLevels,
} from '@/constants'
import {
  ContentCard,
  ContentField,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  useCourseBuilder,
} from '@/components/common'
import { CloseIcon, ImageIcon, PlusIcon, UploadIcon } from '@/components/ui'

const copy = courseBuilderDetailsCopy
const SHORT_LIMIT = 160

type ChipListProps = {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  addLabel: string
  id: string
}

function ChipEditor({ items, onChange, placeholder, addLabel, id }: ChipListProps) {
  const [draft, setDraft] = useState('')

  function add() {
    const value = draft.trim()
    if (!value || items.includes(value)) {
      setDraft('')
      return
    }
    onChange([...items, value])
    setDraft('')
  }

  return (
    <div>
      <div className="flex gap-2">
        <ContentTextInput
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-navy hover:bg-slate-50"
        >
          <PlusIcon className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
      {items.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF4FF] py-1 pr-1.5 pl-3 text-sm font-medium text-brand"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(items.filter((entry) => entry !== item))}
                className="rounded-full p-0.5 hover:bg-white"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function CourseBuilderDetailsPage() {
  const { details, updateDetails, detailsErrors } = useCourseBuilder()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(details.thumbnailPreviewUrl || '')

  function handleThumbnailUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !file.type.startsWith('image/')) return

    const previous = thumbnailPreview || details.thumbnailPreviewUrl || ''
    if (previous.startsWith('blob:')) URL.revokeObjectURL(previous)

    const objectUrl = URL.createObjectURL(file)
    setThumbnailPreview(objectUrl)
    updateDetails({
      thumbnailName: file.name,
      thumbnailPreviewUrl: objectUrl,
    })
  }

  const previewSrc = thumbnailPreview || details.thumbnailPreviewUrl || ''

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <ContentCard title={copy.sections.basics} description={copy.subtitle}>
          <div className="grid gap-4 md:grid-cols-2">
            <ContentField
              label={copy.fields.title}
              htmlFor="cb-title"
              required
              error={detailsErrors.title}
              className="md:col-span-2"
            >
              <ContentTextInput
                id="cb-title"
                value={details.title}
                invalid={Boolean(detailsErrors.title)}
                placeholder={copy.placeholders.title}
                onChange={(event) => updateDetails({ title: event.target.value })}
              />
            </ContentField>
            <ContentField
              label={copy.fields.code}
              htmlFor="cb-code"
              required
              error={detailsErrors.code}
            >
              <ContentTextInput
                id="cb-code"
                value={details.code}
                invalid={Boolean(detailsErrors.code)}
                placeholder={copy.placeholders.code}
                onChange={(event) => updateDetails({ code: event.target.value.toUpperCase() })}
              />
            </ContentField>
            <ContentField
              label={copy.fields.category}
              htmlFor="cb-category"
              required
              error={detailsErrors.category}
            >
              <ContentSelect
                id="cb-category"
                value={details.category}
                invalid={Boolean(detailsErrors.category)}
                onChange={(event) => updateDetails({ category: event.target.value })}
              >
                <option value="">Select category</option>
                {courseBuilderCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField label={copy.fields.level} htmlFor="cb-level">
              <ContentSelect
                id="cb-level"
                value={details.level}
                onChange={(event) => updateDetails({ level: event.target.value })}
              >
                <option value="">Select level</option>
                {courseBuilderLevels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField label={copy.fields.language} htmlFor="cb-language">
              <ContentSelect
                id="cb-language"
                value={details.language}
                onChange={(event) => updateDetails({ language: event.target.value })}
              >
                <option value="">Select language</option>
                {courseBuilderLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField label={copy.fields.instructor} htmlFor="cb-instructor">
              <ContentSelect
                id="cb-instructor"
                value={details.instructor}
                onChange={(event) => updateDetails({ instructor: event.target.value })}
              >
                <option value="">Select instructor</option>
                {courseBuilderInstructors.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </ContentSelect>
            </ContentField>
            <ContentField label={copy.fields.duration} htmlFor="cb-duration">
              <ContentTextInput
                id="cb-duration"
                type="number"
                min={0}
                step={0.5}
                value={details.duration}
                onChange={(event) => updateDetails({ duration: event.target.value })}
              />
            </ContentField>
          </div>

          <fieldset className="mt-5">
            <legend className="mb-1.5 text-sm font-semibold text-navy">
              {copy.fields.deliveryMode}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {courseBuilderDeliveryModes.map((mode) => {
                const active = details.deliveryMode === mode.id
                return (
                  <label
                    key={mode.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                      active ? 'border-brand bg-[#EFF4FF]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery-mode"
                      checked={active}
                      onChange={() => updateDetails({ deliveryMode: mode.id })}
                      className="mt-1 accent-[#004ea8]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-navy">{mode.label}</span>
                      <span className="block text-xs text-slate-500">{mode.hint}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </ContentCard>

        <ContentCard title={copy.sections.description}>
          <div className="space-y-4">
            <ContentField
              label={copy.fields.shortDescription}
              htmlFor="cb-short"
              required
              error={detailsErrors.shortDescription}
              hint={`${SHORT_LIMIT - details.shortDescription.length} ${copy.charactersLeft}`}
            >
              <ContentTextArea
                id="cb-short"
                rows={2}
                maxLength={SHORT_LIMIT}
                value={details.shortDescription}
                invalid={Boolean(detailsErrors.shortDescription)}
                placeholder={copy.placeholders.shortDescription}
                onChange={(event) => updateDetails({ shortDescription: event.target.value })}
              />
            </ContentField>
            <ContentField label={copy.fields.description} htmlFor="cb-description">
              <ContentTextArea
                id="cb-description"
                rows={6}
                value={details.description}
                placeholder={copy.placeholders.description}
                onChange={(event) => updateDetails({ description: event.target.value })}
              />
            </ContentField>
          </div>
        </ContentCard>

        <ContentCard title={copy.sections.outcomes}>
          <ContentField label={copy.fields.outcomes} htmlFor="cb-outcome">
            <ChipEditor
              id="cb-outcome"
              items={details.outcomes}
              placeholder={copy.placeholders.outcome}
              addLabel={copy.addOutcome}
              onChange={(outcomes) => updateDetails({ outcomes })}
            />
          </ContentField>
        </ContentCard>

        <ContentCard title={copy.sections.audience}>
          <div className="grid gap-4 md:grid-cols-2">
            <ContentField label={copy.fields.audience} htmlFor="cb-audience">
              <ContentTextInput
                id="cb-audience"
                value={details.audience}
                placeholder={copy.placeholders.audience}
                onChange={(event) => updateDetails({ audience: event.target.value })}
              />
            </ContentField>
            <ContentField label={copy.fields.prerequisites} htmlFor="cb-prereq">
              <ContentTextInput
                id="cb-prereq"
                value={details.prerequisites}
                placeholder={copy.placeholders.prerequisites}
                onChange={(event) => updateDetails({ prerequisites: event.target.value })}
              />
            </ContentField>
            <ContentField label={copy.fields.tags} htmlFor="cb-tag" className="md:col-span-2">
              <ChipEditor
                id="cb-tag"
                items={details.tags}
                placeholder={copy.placeholders.tag}
                addLabel={copy.addTag}
                onChange={(tags) => updateDetails({ tags })}
              />
            </ContentField>
          </div>
        </ContentCard>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <ContentCard title={copy.sections.thumbnail}>
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="relative block w-full overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-left transition hover:border-brand hover:bg-[#F8FBFF]"
          >
            <div className="relative aspect-video w-full">
              {previewSrc ? (
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt={details.thumbnailName || 'Course thumbnail preview'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <ImageIcon className="h-8 w-8" />
                  <span className="px-3 text-center text-xs font-medium text-slate-500">
                    Click to upload a PNG or JPG
                  </span>
                </div>
              )}
            </div>
          </button>
          {details.thumbnailName ? (
            <p className="mt-2 truncate text-xs font-medium text-navy" title={details.thumbnailName}>
              {details.thumbnailName}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-slate-400">{copy.thumbnailHint}</p>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
            className="sr-only"
            onChange={handleThumbnailUpload}
          />
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-navy hover:bg-slate-50"
          >
            <UploadIcon className="h-4 w-4" />
            {previewSrc || details.thumbnailName ? copy.thumbnailReplace : copy.thumbnailUpload}
          </button>
        </ContentCard>
      </aside>
    </div>
  )
}
