import { paths } from '@/routes/paths'
import { browseMenu } from './browseMenu'

export const searchPlaceholder = 'Search for anything'

export const searchSuggestions = {
  empty: 'No matching courses',
  viewAll: 'Browse all courses',
  heading: 'Suggested courses',
} as const

export const currentLanguage = 'EN'

export const notificationCount = 2

export const browseLinks = [
  { label: 'All courses', to: paths.courses },
  ...browseMenu.categories.items.map((item) => ({
    label: item.name,
    to: item.to,
  })),
]
