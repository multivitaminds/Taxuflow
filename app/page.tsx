import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { AIFeaturesSection } from "@/components/ai-features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <AIFeaturesSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  )
}
