import { Navigate, useParams } from 'react-router'
import {
  CategoryCatalogSection,
  CategoryCoursesSection,
  CategoryCtaSection,
  CategoryExploreSection,
  CategoryHeroSection,
} from '@/components/section'
import { getCourseCategory } from '@/constants/courseCategories'
import { paths } from '@/routes/paths'

export function CategoryPage() {
  const { categoryId } = useParams()
  const category = getCourseCategory(categoryId)

  if (!category) {
    return <Navigate to={paths.courses} replace />
  }

  return (
    <>
      <CategoryHeroSection category={category} />
      <CategoryCoursesSection key={category.id} categoryId={category.id} />
      <CategoryExploreSection />
      <CategoryCatalogSection
        key={`${category.id}-catalog`}
        categoryId={category.id}
        categoryName={category.name}
      />
      <CategoryCtaSection categoryName={category.name} />
    </>
  )
}
