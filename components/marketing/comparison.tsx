import { Check, X } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/marketing/section-heading"

const ROWS = [
  ["Invents metrics to sound impressive", "Leaves [X%] blanks for your real numbers"],
  ["Rewrites everything in one opaque step", "Suggests per bullet; you accept or reject each"],
  ["Needs an account before you see anything", "Full editor in one click, no signup"],
  ["Stuffs in every keyword from the posting", "Flags gaps and says “add only if true”"],
  ["Multi-column layouts ATS can’t read", "Single-column, real-text PDF"],
]

export function Comparison() {
  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading align="center" eyebrow="Honest by design">
            Why it feels different from <span className="italic text-primary">other AI tools</span>
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border bg-secondary/50 p-7 sm:p-9">
            <p className="text-sm font-medium text-muted-foreground">Typical AI tools</p>
            <ul className="mt-6 space-y-5">
              {ROWS.map(([bad]) => (
                <li key={bad} className="flex gap-3 text-muted-foreground">
                  <X className="mt-1 size-4 shrink-0 text-destructive" /> {bad}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-primary/50 bg-card p-7 shadow-lift ring-4 ring-primary/10 sm:p-9">
            <p className="text-sm font-medium text-primary">ResumeBuilder</p>
            <ul className="mt-6 space-y-5">
              {ROWS.map(([, good]) => (
                <li key={good} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-primary" strokeWidth={3} /> {good}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
