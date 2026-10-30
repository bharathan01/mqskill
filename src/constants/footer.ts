import { paths } from '@/routes/paths'

export const footerContent = {
  brand: 'maqskillz',
  motto: 'Skill up • Stand out',
  description: 'Learn the skills you need to stand out and achieve your goals.',
  copyright: 'All rights reserved.',
  language: 'English',
} as const

export const footerNewsletter = {
  title: 'Stay updated',
  description: 'Get the latest courses and offers.',
  placeholder: 'Enter your email',
} as const

export const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'All courses', to: paths.courses },
      { label: 'Free courses', to: `${paths.courses}?price=free` },
      { label: 'Categories', to: paths.courses },
      { label: 'Popular skills', to: paths.courses },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: paths.about },
      { label: 'Contact us', to: paths.contact },
      { label: 'Careers', to: paths.careers },
      { label: 'Blog', to: paths.blog },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', to: paths.help },
      { label: 'FAQs', to: paths.faqs },
      { label: 'Terms of service', to: paths.terms },
      { label: 'Privacy policy', to: paths.privacy },
    ],
  },
] as const

export const footerSocial = [
  { id: 'facebook', label: 'Facebook', href: '#' },
  { id: 'twitter', label: 'Twitter', href: '#' },
  { id: 'linkedin', label: 'LinkedIn', href: '#' },
  { id: 'instagram', label: 'Instagram', href: '#' },
  { id: 'youtube', label: 'YouTube', href: '#' },
] as const
