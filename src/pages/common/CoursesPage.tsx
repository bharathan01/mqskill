import { useSearchParams } from 'react-router'
import {
  CategoryCatalogSection,
  CategoryCoursesSection,
  CategoryCtaSection,
  CategoryExploreSection,
  CategoryHeroSection,
} from '@/components/section'
import { catalogListSection, type CatalogSort } from '@/constants/categoryCourses'
import { allCoursesCategory } from '@/constants/courseCategories'

function catalogSortFromQuery(value: string | null): CatalogSort {
  if (catalogListSection.sortOptions.some((option) => option.id === value)) {
    return value as CatalogSort
  }
  if (value === 'trending') return 'newest'
  return 'popular'
}

export function CoursesPage() {
  const [params] = useSearchParams()
  const topicId = params.get('skill')
  const initialSort = catalogSortFromQuery(params.get('sort'))

  return (
    <>
      <CategoryHeroSection category={allCoursesCategory} />
      <CategoryCoursesSection key={allCoursesCategory.id} categoryId={allCoursesCategory.id} />
      <CategoryExploreSection />
      <CategoryCatalogSection
        key={`${allCoursesCategory.id}-catalog-${topicId ?? 'all'}-${initialSort}`}
        categoryId={allCoursesCategory.id}
        topicId={topicId}
        initialSort={initialSort}
      />
      <CategoryCtaSection />
    </>
  )
}
