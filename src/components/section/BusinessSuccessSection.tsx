import { useState } from 'react'
import { businessSuccessSection } from '@/constants/business'
import { ChevronLeftIcon, ChevronRightIcon, Container } from '@/components/ui'

export function BusinessSuccessSection() {
  const stories = businessSuccessSection.stories
  const [index, setIndex] = useState(0)
  const story = stories[index]

  function showPrevious() {
    setIndex((current) => (current === 0 ? stories.length - 1 : current - 1))
  }

  function showNext() {
    setIndex((current) => (current === stories.length - 1 ? 0 : current + 1))
  }

  return (
    <section className="bg-white py-10 sm:py-14">
      <Container>
        <div className="overflow-visible rounded-[32px] bg-[#F4F7FF] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="max-w-xl">
              <span className="inline-flex rounded-md bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                {businessSuccessSection.badge}
              </span>
              <blockquote>
                <p className="mt-6 text-2xl font-extrabold tracking-tight text-navy sm:text-[32px] sm:leading-[1.25]">
                  “{story.quote}”
                </p>
                <p className="mt-5 text-sm leading-6 text-slate-500 sm:text-base">
                  {story.body}
                </p>
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-navy">{story.name}</p>
                  <p className="text-xs text-slate-500">{story.role}</p>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="relative">
                <div className="overflow-hidden rounded-[24px] border-[6px] border-white shadow-[0_16px_40px_rgba(15,40,80,0.08)]">
                  <img
                    src={story.image}
                    alt=""
                    className="aspect-[4/5] h-auto w-full object-cover object-top"
                  />
                </div>
                <div className="absolute top-8 left-0 max-w-[150px] -translate-x-2 rounded-2xl bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,40,80,0.12)] sm:max-w-[168px] sm:-translate-x-6">
                  <span className="font-hero text-2xl leading-none text-slate-300">“</span>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-navy">
                    {story.statValue}
                  </p>
                  <p className="mt-1 text-xs leading-4 text-slate-500">{story.statLabel}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Previous story"
                  onClick={showPrevious}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_8px_20px_rgba(15,40,80,0.08)]"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {stories.map((item, itemIndex) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Show story ${itemIndex + 1}`}
                      aria-current={itemIndex === index ? true : undefined}
                      onClick={() => setIndex(itemIndex)}
                      className={`h-1.5 rounded-full ${
                        itemIndex === index ? 'w-6 bg-navy' : 'w-1.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next story"
                  onClick={showNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_8px_20px_rgba(15,40,80,0.08)]"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
