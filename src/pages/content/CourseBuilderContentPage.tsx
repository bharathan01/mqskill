import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  courseBuilderContentCopy,
  createBuilderModule,
  createBuilderSubmodule,
  type BuilderModule,
  type BuilderSubmodule,
  type SubmoduleType,
} from '@/constants'
import { paths } from '@/routes/paths'
import {
  ContentCard,
  ContentEmptyState,
  ContentField,
  ContentSelect,
  ContentTextArea,
  ContentTextInput,
  ContentToggle,
  CourseBuilderTabs,
  useCourseBuilder,
} from '@/components/common'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClipboardIcon,
  FileIcon,
  FolderIcon,
  LayersIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  VideoIcon,
} from '@/components/ui'

const copy = courseBuilderContentCopy
const editorCopy = copy.editor

type Selection = { moduleId: string; submoduleId: string | null }

function hasVideo(submodule: BuilderSubmodule) {
  return Boolean(
    submodule.video.previewUrl.trim() ||
      submodule.video.fileName.trim() ||
      submodule.video.url.trim(),
  )
}

function previewSrc(submodule: BuilderSubmodule) {
  if (submodule.video.previewUrl.trim()) return submodule.video.previewUrl.trim()
  if (submodule.video.source === 'url' && submodule.video.url.trim()) return submodule.video.url.trim()
  return ''
}

function revokePreview(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url)
}

function SubmoduleIcon({ type }: { type: SubmoduleType }) {
  if (type === 'video') return <VideoIcon className="h-4 w-4" />
  if (type === 'scorm') return <FolderIcon className="h-4 w-4" />
  return <FileIcon className="h-4 w-4" />
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-500' : 'text-slate-400 hover:bg-slate-100 hover:text-navy'
      }`}
    >
      {children}
    </button>
  )
}

function swap<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export function CourseBuilderContentPage() {
  const { modules, updateModules } = useCourseBuilder()
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [selection, setSelection] = useState<Selection>(() => ({
    moduleId: modules[0]?.id ?? '',
    submoduleId: modules[0]?.submodules[0]?.id ?? null,
  }))

  const activeModule = modules.find((module) => module.id === selection.moduleId) ?? modules[0]
  const activeSubmodule =
    activeModule?.submodules.find((item) => item.id === selection.submoduleId) ?? null
  const activePreview = activeSubmodule ? previewSrc(activeSubmodule) : ''

  function patchModule(moduleId: string, patch: Partial<BuilderModule>) {
    updateModules((current) =>
      current.map((module) => (module.id === moduleId ? { ...module, ...patch } : module)),
    )
  }

  function patchSubmodule(
    moduleId: string,
    submoduleId: string,
    patch: Partial<Omit<BuilderSubmodule, 'video'>> & { video?: Partial<BuilderSubmodule['video']> },
  ) {
    updateModules((current) =>
      current.map((module) =>
        module.id !== moduleId
          ? module
          : {
              ...module,
              submodules: module.submodules.map((item) => {
                if (item.id !== submoduleId) return item
                const nextVideo = { ...item.video, ...patch.video }
                if (
                  patch.video?.previewUrl !== undefined &&
                  item.video.previewUrl &&
                  item.video.previewUrl !== nextVideo.previewUrl
                ) {
                  revokePreview(item.video.previewUrl)
                }
                return { ...item, ...patch, video: nextVideo }
              }),
            },
      ),
    )
  }

  function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !activeModule || !activeSubmodule) return

    const previewUrl = URL.createObjectURL(file)
    const durationMin = activeSubmodule.durationMin
    patchSubmodule(activeModule.id, activeSubmodule.id, {
      video: {
        source: 'upload',
        fileName: file.name,
        previewUrl,
        url: '',
      },
    })

    const probe = document.createElement('video')
    probe.preload = 'metadata'
    probe.src = previewUrl
    probe.onloadedmetadata = () => {
      const minutes = Math.max(1, Math.round(probe.duration / 60) || durationMin)
      patchSubmodule(activeModule.id, activeSubmodule.id, { durationMin: minutes })
      probe.removeAttribute('src')
      probe.load()
    }
  }

  function addModule() {
    const module = createBuilderModule(`New module ${modules.length + 1}`)
    const submodule = createBuilderSubmodule('New submodule')
    module.submodules = [submodule]
    updateModules((current) => [...current, module])
    setSelection({ moduleId: module.id, submoduleId: submodule.id })
  }

  function addSubmodule(moduleId: string) {
    const module = modules.find((item) => item.id === moduleId)
    const submodule = createBuilderSubmodule(`New submodule ${(module?.submodules.length ?? 0) + 1}`)
    patchModule(moduleId, { submodules: [...(module?.submodules ?? []), submodule] })
    setSelection({ moduleId, submoduleId: submodule.id })
  }

  function removeModule(moduleId: string) {
    const remaining = modules.filter((module) => module.id !== moduleId)
    updateModules(() => remaining)
    if (selection.moduleId === moduleId) {
      setSelection({
        moduleId: remaining[0]?.id ?? '',
        submoduleId: remaining[0]?.submodules[0]?.id ?? null,
      })
    }
  }

  function removeSubmodule(moduleId: string, submoduleId: string) {
    const module = modules.find((item) => item.id === moduleId)
    if (!module) return
    const remaining = module.submodules.filter((item) => item.id !== submoduleId)
    patchModule(moduleId, { submodules: remaining })
    if (selection.submoduleId === submoduleId) {
      setSelection({ moduleId, submoduleId: remaining[0]?.id ?? null })
    }
  }

  function moveModule(index: number, delta: number) {
    updateModules((current) => swap(current, index, index + delta))
  }

  function moveSubmodule(moduleId: string, index: number, delta: number) {
    const module = modules.find((item) => item.id === moduleId)
    if (!module) return
    patchModule(moduleId, { submodules: swap(module.submodules, index, index + delta) })
  }

  const moduleNumber = activeModule ? modules.findIndex((item) => item.id === activeModule.id) + 1 : 0
  const submoduleNumber = activeSubmodule
    ? (activeModule?.submodules.findIndex((item) => item.id === activeSubmodule.id) ?? 0) + 1
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">{copy.title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{copy.subtitle}</p>
        </div>
        <CourseBuilderTabs />
      </div>

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <ContentCard
          title={copy.outline}
          action={
            <button
              type="button"
              onClick={addModule}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              {copy.addModule}
            </button>
          }
          className="self-start p-4"
        >
          {modules.length ? (
            <ul className="space-y-3">
              {modules.map((module, moduleIndex) => {
                const moduleActive = activeModule?.id === module.id
                return (
                  <li
                    key={module.id}
                    className={`rounded-xl border ${
                      moduleActive ? 'border-brand/40 bg-[#F8FAFF]' : 'border-slate-200'
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setSelection({
                          moduleId: module.id,
                          submoduleId: module.submodules[0]?.id ?? null,
                        })
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelection({
                            moduleId: module.id,
                            submoduleId: module.submodules[0]?.id ?? null,
                          })
                        }
                      }}
                      className="flex cursor-pointer items-center gap-2 px-3 py-2.5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                        {moduleIndex + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-navy">
                        {module.title || `${copy.modulePrefix} ${moduleIndex + 1}`}
                      </span>
                      <IconButton
                        label={copy.moveUp}
                        disabled={moduleIndex === 0}
                        onClick={() => moveModule(moduleIndex, -1)}
                      >
                        <ChevronDownIcon className="h-4 w-4 rotate-180" />
                      </IconButton>
                      <IconButton
                        label={copy.moveDown}
                        disabled={moduleIndex === modules.length - 1}
                        onClick={() => moveModule(moduleIndex, 1)}
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton label={copy.remove} danger onClick={() => removeModule(module.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>

                    <ul className="space-y-0.5 px-2 pb-2">
                      {module.submodules.map((submodule, index) => {
                        const active = selection.submoduleId === submodule.id && moduleActive
                        const missing = submodule.type === 'video' && !hasVideo(submodule)
                        return (
                          <li key={submodule.id}>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                setSelection({ moduleId: module.id, submoduleId: submodule.id })
                              }
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault()
                                  setSelection({ moduleId: module.id, submoduleId: submodule.id })
                                }
                              }}
                              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                                active
                                  ? 'bg-brand text-white'
                                  : 'text-slate-600 hover:bg-white hover:text-navy'
                              }`}
                            >
                              <span className={active ? 'text-white' : 'text-slate-400'}>
                                <SubmoduleIcon type={submodule.type} />
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                <span className="mr-1.5 text-xs opacity-70">
                                  {moduleIndex + 1}.{index + 1}
                                </span>
                                {submodule.title}
                              </span>
                              {missing ? (
                                <AlertTriangleIcon
                                  className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-white' : 'text-amber-500'}`}
                                />
                              ) : null}
                              <span className="flex shrink-0 items-center">
                                <IconButton
                                  label={copy.moveUp}
                                  disabled={index === 0}
                                  onClick={() => moveSubmodule(module.id, index, -1)}
                                >
                                  <ChevronDownIcon className="h-3.5 w-3.5 rotate-180" />
                                </IconButton>
                                <IconButton
                                  label={copy.moveDown}
                                  disabled={index === module.submodules.length - 1}
                                  onClick={() => moveSubmodule(module.id, index, 1)}
                                >
                                  <ChevronDownIcon className="h-3.5 w-3.5" />
                                </IconButton>
                                <IconButton
                                  label={copy.remove}
                                  danger
                                  onClick={() => removeSubmodule(module.id, submodule.id)}
                                >
                                  <TrashIcon className="h-3.5 w-3.5" />
                                </IconButton>
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => addSubmodule(module.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-blue-700"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                        {copy.addSubmodule}
                      </button>
                      <Link
                        to={`${paths.content.courseQuiz}?module=${module.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          module.quiz.enabled
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500 hover:text-navy'
                        }`}
                      >
                        <ClipboardIcon className="h-3.5 w-3.5" />
                        {module.quiz.enabled
                          ? `${copy.quizBadge} · ${module.quiz.questions.length}`
                          : copy.addQuiz}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <ContentEmptyState
              icon={<LayersIcon className="h-6 w-6" />}
              title={copy.emptyOutlineTitle}
              body={copy.emptyOutlineBody}
            >
              <button
                type="button"
                onClick={addModule}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                {copy.addModule}
              </button>
            </ContentEmptyState>
          )}
        </ContentCard>

        <div className="space-y-6">
          {activeModule ? (
            <ContentCard
              title={`${copy.modulePrefix} ${moduleNumber}`}
              description={activeModule.submodules.length + ' submodules'}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ContentField label={copy.moduleTitle} htmlFor="cb-module-title">
                  <ContentTextInput
                    id="cb-module-title"
                    value={activeModule.title}
                    onChange={(event) => patchModule(activeModule.id, { title: event.target.value })}
                  />
                </ContentField>
                <ContentField label={copy.moduleSummary} htmlFor="cb-module-summary">
                  <ContentTextInput
                    id="cb-module-summary"
                    value={activeModule.summary}
                    placeholder={copy.moduleSummaryPlaceholder}
                    onChange={(event) =>
                      patchModule(activeModule.id, { summary: event.target.value })
                    }
                  />
                </ContentField>
              </div>
            </ContentCard>
          ) : null}

          {activeModule && activeSubmodule ? (
            <ContentCard
              title={`${editorCopy.title} · ${moduleNumber}.${submoduleNumber}`}
              action={
                activeSubmodule.type === 'video' && !hasVideo(activeSubmodule) ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <AlertTriangleIcon className="h-3.5 w-3.5" />
                    {copy.noVideo}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Ready
                  </span>
                )
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ContentField
                  label={editorCopy.submoduleTitle}
                  htmlFor="cb-sub-title"
                  className="md:col-span-2"
                >
                  <ContentTextInput
                    id="cb-sub-title"
                    value={activeSubmodule.title}
                    onChange={(event) =>
                      patchSubmodule(activeModule.id, activeSubmodule.id, { title: event.target.value })
                    }
                  />
                </ContentField>
                <ContentField label={editorCopy.type} htmlFor="cb-sub-type">
                  <ContentSelect
                    id="cb-sub-type"
                    value={activeSubmodule.type}
                    onChange={(event) =>
                      patchSubmodule(activeModule.id, activeSubmodule.id, {
                        type: event.target.value as SubmoduleType,
                      })
                    }
                  >
                    {copy.submoduleTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </ContentSelect>
                </ContentField>
                <ContentField label={editorCopy.duration} htmlFor="cb-sub-duration">
                  <ContentTextInput
                    id="cb-sub-duration"
                    type="number"
                    min={0}
                    value={activeSubmodule.durationMin}
                    onChange={(event) =>
                      patchSubmodule(activeModule.id, activeSubmodule.id, {
                        durationMin: Math.max(0, Number(event.target.value) || 0),
                      })
                    }
                  />
                </ContentField>
                <ContentField
                  label={editorCopy.description}
                  htmlFor="cb-sub-description"
                  className="md:col-span-2"
                >
                  <ContentTextArea
                    id="cb-sub-description"
                    rows={3}
                    value={activeSubmodule.description}
                    placeholder={editorCopy.descriptionPlaceholder}
                    onChange={(event) =>
                      patchSubmodule(activeModule.id, activeSubmodule.id, {
                        description: event.target.value,
                      })
                    }
                  />
                </ContentField>
              </div>

              <div className="mt-4">
                <ContentToggle
                  checked={activeSubmodule.required}
                  label={editorCopy.required}
                  onChange={(value) =>
                    patchSubmodule(activeModule.id, activeSubmodule.id, { required: value })
                  }
                />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-navy">{editorCopy.video}</h3>
                {activeSubmodule.type !== 'video' ? (
                  <p className="mt-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    {editorCopy.typeNotVideo}
                  </p>
                ) : (
                  <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
                    <div className="space-y-4">
                      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                        {(['upload', 'url'] as const).map((source) => (
                          <button
                            key={source}
                            type="button"
                            onClick={() =>
                              patchSubmodule(activeModule.id, activeSubmodule.id, {
                                video: { source },
                              })
                            }
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                              activeSubmodule.video.source === source
                                ? 'bg-white text-brand shadow-sm'
                                : 'text-slate-500 hover:text-navy'
                            }`}
                          >
                            {source === 'upload' ? editorCopy.sourceUpload : editorCopy.sourceUrl}
                          </button>
                        ))}
                      </div>

                      {activeSubmodule.video.source === 'upload' ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                          {activeSubmodule.video.fileName ? (
                            <p className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-navy">
                              <VideoIcon className="h-4 w-4 text-brand" />
                              {activeSubmodule.video.fileName}
                            </p>
                          ) : (
                            <p className="mb-3 text-sm text-slate-500">{editorCopy.uploadHint}</p>
                          )}
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/mp4,video/quicktime,video/*"
                            className="sr-only"
                            onChange={handleVideoUpload}
                          />
                          <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-navy hover:bg-slate-50"
                          >
                            <UploadIcon className="h-4 w-4" />
                            {activeSubmodule.video.fileName || activeSubmodule.video.previewUrl
                              ? editorCopy.replace
                              : editorCopy.upload}
                          </button>
                        </div>
                      ) : (
                        <ContentField label={editorCopy.url} htmlFor="cb-video-url">
                          <ContentTextInput
                            id="cb-video-url"
                            type="url"
                            value={activeSubmodule.video.url}
                            placeholder={editorCopy.urlPlaceholder}
                            onChange={(event) =>
                              patchSubmodule(activeModule.id, activeSubmodule.id, {
                                video: {
                                  url: event.target.value,
                                  previewUrl: event.target.value.trim(),
                                  fileName: '',
                                },
                              })
                            }
                          />
                        </ContentField>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        <ContentToggle
                          checked={activeSubmodule.video.captions}
                          label={editorCopy.captions}
                          onChange={(value) =>
                            patchSubmodule(activeModule.id, activeSubmodule.id, {
                              video: { captions: value },
                            })
                          }
                        />
                        <ContentToggle
                          checked={activeSubmodule.video.allowDownload}
                          label={editorCopy.allowDownload}
                          onChange={(value) =>
                            patchSubmodule(activeModule.id, activeSubmodule.id, {
                              video: { allowDownload: value },
                            })
                          }
                        />
                      </div>

                      <ContentField label={editorCopy.transcript} htmlFor="cb-video-transcript">
                        <ContentTextArea
                          id="cb-video-transcript"
                          rows={4}
                          value={activeSubmodule.video.transcript}
                          placeholder={editorCopy.transcriptPlaceholder}
                          onChange={(event) =>
                            patchSubmodule(activeModule.id, activeSubmodule.id, {
                              video: { transcript: event.target.value },
                            })
                          }
                        />
                      </ContentField>
                    </div>

                    <div>
                      <p className="mb-1.5 text-sm font-semibold text-navy">{editorCopy.preview}</p>
                      <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-[#102A4C] to-[#1B3A63] text-white">
                        {activePreview ? (
                          <video
                            key={activePreview}
                            src={activePreview}
                            controls
                            playsInline
                            className="h-full w-full object-contain bg-black"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#B9C6DA]">
                            {editorCopy.videoMissing}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {activeSubmodule.durationMin} min
                        {activeSubmodule.video.captions ? ' · Captions' : ''}
                        {activeSubmodule.video.fileName
                          ? ` · ${activeSubmodule.video.fileName}`
                          : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ContentCard>
          ) : (
            <ContentCard className="p-0">
              <ContentEmptyState
                icon={<VideoIcon className="h-6 w-6" />}
                title={copy.emptyEditorTitle}
                body={copy.emptyEditorBody}
              />
            </ContentCard>
          )}
        </div>
      </div>
    </div>
  )
}
