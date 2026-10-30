import {
  AccreditationSection,
  CategoriesSection,
  HeroSection,
  PopularSkillsSection,
  TestimonialsSection,
  TrendingCoursesSection,
  WhyLearnSection,
} from '@/components/section'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <TrendingCoursesSection />
      <WhyLearnSection />
      <PopularSkillsSection />
      <AccreditationSection />
      <TestimonialsSection />
    </>
  )
}
