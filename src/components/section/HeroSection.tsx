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
    <section className="bg-white py-6 sm:py-8">
      <div className="relative mx-auto w-full max-w-page px-6 sm:px-10 lg:px-14">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={showPrevious}
          className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md sm:left-4"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={showNext}
          className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md sm:right-4"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-navy via-brand to-brand px-8 py-10 text-white shadow-[0_18px_50px_rgba(0,78,168,0.28)] sm:px-12 sm:py-12 lg:px-16">
          <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
            <div>
              <h1 className="font-hero text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl">
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
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
                {heroStats.map((stat) => {
                  const Icon = statIcons[stat.icon]
                  return (
                    <div key={stat.label} className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-lg font-semibold leading-none">
                          {stat.value}
                        </span>
                        <span className="mt-1 block text-sm text-white/85">
                          {stat.label}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <img
                src={slide.image}
                alt="Learner studying on a laptop"
                className="h-full max-h-[360px] w-full object-cover md:max-h-none md:min-h-[320px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
