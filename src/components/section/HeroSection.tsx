import { useState } from 'react'
import { Link } from 'react-router'
import learnerImage from '@/assets/Learner.png'
import { heroContent, heroStats } from '@/constants'
import { paths } from '@/routes/paths'
import {
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  PlayIcon,
  UsersIcon,
} from '@/components/ui'

const statIcons = {
  courses: BookIcon,
  instructors: UsersIcon,
  learners: GlobeIcon,
}

const slides = [{ ...heroContent, image: learnerImage }]

export function HeroSection() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  function showPrevious() {
    setIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  function showNext() {
    setIndex((current) => (current === slides.length - 1 ? 0 : current + 1))
  }

  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="relative w-full px-3 sm:px-4 lg:px-5">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-navy via-brand to-brand px-8 py-10 text-white shadow-[0_18px_50px_rgba(0,78,168,0.28)] sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={showPrevious}
            className="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:left-4 lg:left-5"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={showNext}
            className="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg sm:right-4 lg:right-5"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-14">
            <div className="relative z-10 max-w-xl px-6 sm:px-8 lg:px-10">
              <h1 className="font-hero text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-md text-base text-white/90 sm:text-lg">
                {slide.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  to={paths.courses}
                  className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900"
                >
                  {slide.primaryCta}
                </Link>
                <Link
                  to={paths.courses}
                  className="inline-flex items-center gap-1 text-sm font-medium text-white"
                >
                  {slide.secondaryCta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-10 flex flex-nowrap items-center gap-3 sm:gap-4 lg:gap-6">
                {heroStats.map((stat) => {
                  const Icon = statIcons[stat.icon]
                  return (
                    <div key={stat.label} className="flex shrink-0 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold leading-none whitespace-nowrap">
                          {stat.value}
                        </span>
                        <span className="mt-1 block text-[11px] leading-tight text-white/85 whitespace-nowrap">
                          {stat.label}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={slide.image}
                alt="Learner studying on a laptop"
                className="h-full max-h-[360px] w-full object-cover md:max-h-none md:min-h-[360px] lg:min-h-[400px]"
              />
              <button
                type="button"
                aria-label="Play preview"
                className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-lg"
              >
                <PlayIcon className="h-6 w-6 translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
