import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StartGuestButton } from "@/components/marketing/start-guest-button"
import { ResumeFan } from "@/components/marketing/resume-paper"
import { Reveal } from "@/components/motion/reveal"

export function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <Reveal className="mx-auto grid max-w-6xl items-end gap-10 overflow-hidden rounded-[2rem] bg-foreground px-6 pt-16 text-background sm:px-14 md:grid-cols-[1.2fr_1fr] md:pt-20">
        <div className="pb-16 md:pb-20">
          <h2 className="text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
            One resume. <span className="italic text-primary">Every</span> role it fits.
          </h2>
          <p className="mt-6 max-w-md text-lg text-background/70">
            Try everything with no signup. Duplicate, tailor, export. Keep every word true.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <StartGuestButton size="lg" className="w-full sm:w-auto">
              Start building
              <ArrowRight className="size-4" />
            </StartGuestButton>
            <Button asChild size="lg" variant="ghost" className="w-full text-background hover:bg-background/10 hover:text-background sm:w-auto">
              <Link href="/auth/sign-up">Create free account</Link>
            </Button>
          </div>
        </div>
        <ResumeFan className="h-[20rem] sm:h-[24rem]" />
      </Reveal>
    </section>
  )
}
