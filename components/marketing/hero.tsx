import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StartGuestButton } from "@/components/marketing/start-guest-button"
import { ProductFrame } from "@/components/marketing/product-frame"
import { Eyebrow } from "@/components/marketing/section-heading"
import { Reveal } from "@/components/motion/reveal"

export function Hero() {
  return (
    <section className="px-4 pb-8 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal y={10}>
          <Eyebrow>The AI resume builder that won’t make things up</Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-7 text-[clamp(3.25rem,9.5vw,8rem)] leading-[0.92] tracking-[-0.035em]">
            Land your dream job <span className="italic text-primary">faster</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Paste any job description. Your <span className="highlight font-medium">real experience</span> is reworded to match it,
            keyword gaps are flagged, and every number only you know is left blank.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <StartGuestButton size="lg" className="w-full sm:w-auto">
              Try as Guest
              <ArrowRight className="size-4" />
            </StartGuestButton>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/auth/sign-up">Create free account</Link>
            </Button>
          </div>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No signup to start", "ATS-friendly layout", "Free PDF export"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={0.3} y={30} className="mt-16 sm:mt-20">
        <ProductFrame />
      </Reveal>
    </section>
  )
}
