import {
  BusinessCtaSection,
  BusinessHeroSection,
  BusinessHowItWorksSection,
  BusinessPartnerSection,
  BusinessSolutionsSection,
  BusinessSuccessSection,
} from '@/components/section'

export function BusinessPage() {
  return (
    <>
      <BusinessHeroSection />
      <BusinessPartnerSection />
      <BusinessSolutionsSection />
      <BusinessHowItWorksSection />
      <BusinessSuccessSection />
      <BusinessCtaSection />
    </>
  )
}
