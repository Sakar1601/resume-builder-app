"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/marketing/section-heading"
import { cn } from "@/lib/utils"

const ORIGINAL = "Helped speed up our checkout page and fixed bugs."

const TONES = [
  {
    id: "impact",
    label: "Impact",
    hint: "Leads with results and leadership.",
    outputs: [
      "Cut checkout load time by [X%] by diagnosing and fixing render bottlenecks.",
      "Drove faster, more reliable checkout by resolving the bugs behind [N] customer complaints.",
      "Improved checkout speed and stability, lifting completed orders by [X%].",
    ],
  },
  {
    id: "concise",
    label: "Concise",
    hint: "Shorter and more direct.",
    outputs: ["Sped up checkout and fixed bugs.", "Improved checkout performance; resolved defects.", "Made checkout faster and more stable."],
  },
  {
    id: "technical",
    label: "Technical",
    hint: "Names the methods and tools.",
    outputs: [
      "Profiled and optimized the checkout render path, then resolved [N] production defects.",
      "Reduced checkout latency via performance profiling and targeted bug fixes.",
      "Optimized checkout page performance and debugged cross-browser issues.",
    ],
  },
] as const

function withPlaceholders(text: string) {
  return text.split(/(\[[A-Z%]+\])/g).map((part, i) =>
    /^\[[A-Z%]+\]$/.test(part) ? (
      <mark key={i} className="rounded bg-warn px-1 font-mono text-[0.9em] text-warn-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function AiShowcase() {
  const [active, setActive] = useState<(typeof TONES)[number]["id"]>("impact")
  const tone = TONES.find((t) => t.id === active)!

  return (
    <section id="ai" className="scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            eyebrow="The AI, up close"
            body="Pick a tone, get three options, and apply the one that sounds like you. Nothing changes until you say so."
          >
            Three rewrites per bullet. <span className="italic text-primary">You</span> choose.
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-3xl border bg-card shadow-lift">
          <div className="flex flex-col gap-4 border-b bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Your bullet</p>
              <p className="mt-1 text-[15px]">{ORIGINAL}</p>
            </div>
            <div role="tablist" aria-label="Rewrite tone" className="flex shrink-0 rounded-full bg-background p-1 ring-1 ring-border">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active === t.id}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    active === t.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active === t.id && (
                    <motion.span layoutId="tone-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">{tone.hint}</p>
            <AnimatePresence mode="wait">
              <motion.ul
                key={tone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-4 space-y-3"
              >
                {tone.outputs.map((o, i) => (
                  <li key={o} className="flex gap-4 rounded-xl border bg-background p-4 text-[15px] leading-relaxed transition-colors hover:border-primary/40">
                    <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                    <span>{withPlaceholders(o)}</span>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
            <p className="mt-6 text-sm text-muted-foreground">
              <mark className="rounded bg-warn px-1 font-mono text-warn-foreground">[X%]</mark> marks a number only you know.
              Replace it with your real figure — or delete it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
