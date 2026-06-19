import { HeroSection } from "@/components/hero-section"
import { ExamplesSection } from "@/components/examples-section"
import { FeaturesSection } from "@/components/features-section"
import { QuoteSection } from "@/components/quote-section"
import { FooterSection } from "@/components/footer-section"
import { Navbar } from "@/components/navbar"
export default function Home() {
  return (
    <main className="relative overflow-x-hidden horizons-bg min-h-screen">
      <Navbar />
      <HeroSection />
      <ExamplesSection />
      <FeaturesSection />
      <QuoteSection />
      <FooterSection />
    </main>
  )
}
