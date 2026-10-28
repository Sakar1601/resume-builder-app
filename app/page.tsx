import { SiteHeader } from "@/components/marketing/site-header"
import { Hero } from "@/components/marketing/hero"
import { ProofStrip } from "@/components/marketing/proof-strip"
import { HeroDemo } from "@/components/marketing/hero-demo"
import { Differentiators } from "@/components/marketing/differentiators"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { AiShowcase } from "@/components/marketing/ai-showcase"
import { Comparison } from "@/components/marketing/comparison"
import { Faq } from "@/components/marketing/faq"
import { FinalCta } from "@/components/marketing/final-cta"
import { SiteFooter } from "@/components/marketing/site-footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <ProofStrip />
        <section className="px-4 py-24 sm:px-6 sm:py-32" aria-label="Live demo">
          <HeroDemo />
        </section>
        <Differentiators />
        <HowItWorks />
        <AiShowcase />
        <Comparison />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
