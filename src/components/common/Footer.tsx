import type { FormEvent } from 'react'
import { Link } from 'react-router'
import {
  footerColumns,
  footerContent,
  footerNewsletter,
  footerSocial,
} from '@/constants/footer'
import { paths } from '@/routes/paths'
import {
  ChevronRightIcon,
  Container,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  YouTubeIcon,
} from '@/components/ui'

const socialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
}

export function Footer() {
  const year = new Date().getFullYear()

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <footer className="bg-navy text-white">
      <Container className="py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,0.7fr)_1.2fr]">
          <div>
            <Link to={paths.home} className="inline-block">
              <span className="block text-2xl font-bold tracking-tight">
                {footerContent.brand}
              </span>
              <span className="mt-1 block text-[10px] font-medium tracking-[0.22em] text-white/70 uppercase">
                {footerContent.motto}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
              {footerContent.description}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {footerSocial.map((item) => {
                const Icon = socialIcons[item.id]
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold tracking-[0.16em] text-white uppercase">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white uppercase">
              {footerNewsletter.title}
            </p>
            <p className="mt-4 max-w-[220px] text-sm leading-6 text-slate-300">
              {footerNewsletter.description}
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex max-w-[240px]">
              <label className="sr-only" htmlFor="footer-email">
                {footerNewsletter.placeholder}
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder={footerNewsletter.placeholder}
                className="min-w-0 flex-1 rounded-l-md bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="rounded-r-md bg-brand px-3 text-white"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            © {year} Maqskillz. {footerContent.copyright}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-slate-300"
          >
            <GlobeIcon className="h-4 w-4" />
            {footerContent.language}
          </button>
        </div>
      </Container>
    </footer>
  )
}
