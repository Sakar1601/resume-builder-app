"use client"

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Check, FileText, X } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/marketing/section-heading"
import { cn } from "@/lib/utils"

function Tile({ className, title, body, children }: { className?: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <div className={cn("group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-shadow duration-500 hover:shadow-lift", className)}>
      <div className="flex-1 border-b bg-secondary/50 p-6 sm:p-8">{children}</div>
      <div className="p-6 sm:p-8">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

function ReadinessRing() {
  const reduce = useReducedMotion()
  const r = 38
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-6">
      <div className="relative size-28 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-border" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={c}
            initial={{ strokeDashoffset: reduce ? c * 0.17 : c }}
            whileInView={{ strokeDashoffset: c * 0.17 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-3xl">83%</span>
      </div>
      <ul className="space-y-2 text-sm">
        {[
          ["Contact complete", true],
          ["Summary included", true],
          ["Metrics in bullets", false],
        ].map(([l, ok]) => (
          <li key={l as string} className="flex items-center gap-2">
            <span className={cn("flex size-4 items-center justify-center rounded-full", ok ? "bg-primary text-primary-foreground" : "border border-dashed border-muted-foreground")}>
              {ok && <Check className="size-2.5" strokeWidth={3.5} />}
            </span>
            <span className={ok ? "" : "text-muted-foreground"}>{l as string}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Differentiators() {
  return (
    <section id="different" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Why it’s different"
            body="Hiring managers can smell invented achievements, and you’re the one who has to defend them in the interview."
          >
            Most AI resume tools write fiction. This one <span className="italic text-primary">edits fact.</span>
          </SectionHeading>
        </Reveal>

        <Stagger className="mt-16 grid gap-4 md:grid-cols-12">
          <StaggerItem className="md:col-span-7">
            <Tile title="A no-fabrication rule" body="The AI may only reword what you wrote. When a bullet would be stronger with a number you didn’t give, it leaves a blank like [X%] instead of guessing.">
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 rounded-2xl border bg-card p-4 opacity-70">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <p>“Increased revenue by <b>340%</b> across <b>12 markets</b>.”</p>
                </div>
                <div className="flex gap-3 rounded-2xl border border-primary/40 bg-card p-4 shadow-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                  <p>
                    “Grew revenue by <mark className="rounded bg-warn px-1 font-mono text-warn-foreground">[X%]</mark> across the markets I managed.”
                  </p>
                </div>
              </div>
            </Tile>
          </StaggerItem>

          <StaggerItem className="md:col-span-5">
            <Tile title="Keyword gaps, not keyword stuffing" body="See which terms from the posting you already cover and which you don’t, each flagged “add only if true.”">
              <p className="text-sm font-medium">5 of 7 keywords covered</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "71%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5 text-xs">
                {["React", "TypeScript", "GraphQL", "CI/CD", "design system"].map((k) => (
                  <span key={k} className="rounded-full bg-ok px-2.5 py-1 font-medium text-ok-foreground">{k}</span>
                ))}
                {["a11y", "performance"].map((k) => (
                  <span key={k} className="rounded-full border border-dashed border-warn-border bg-warn px-2.5 py-1 font-medium text-warn-foreground">{k}</span>
                ))}
              </div>
            </Tile>
          </StaggerItem>

          <StaggerItem className="md:col-span-4">
            <Tile title="Start with zero signup" body="Guest mode opens the full editor instantly. Drafts live in your browser until you choose to sync them.">
              <div className="space-y-2.5 text-sm">
                {["No email", "No card", "Saved on this device"].map((t) => (
                  <div key={t} className="flex items-center justify-between rounded-xl border bg-card px-4 py-2.5">
                    {t}
                    <Check className="size-4 text-primary" strokeWidth={3} />
                  </div>
                ))}
              </div>
            </Tile>
          </StaggerItem>

          <StaggerItem className="md:col-span-4">
            <Tile title="A live readiness check" body="Summary, metrics, skills, length: see what’s missing before a recruiter does.">
              <ReadinessRing />
            </Tile>
          </StaggerItem>

          <StaggerItem className="md:col-span-4">
            <Tile title="ATS-clean PDF" body="Single column, real selectable text, standard headings. Parsers read it the way you wrote it.">
              <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FileText className="size-6" />
                </div>
                <div className="min-w-0 text-sm">
                  <p className="truncate font-medium">sarah-johnson.pdf</p>
                  <p className="text-xs text-muted-foreground">1 page · text selectable</p>
                </div>
              </div>
            </Tile>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
