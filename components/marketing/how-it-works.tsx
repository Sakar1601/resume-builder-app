"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Download, FileText, Sparkles } from "lucide-react"
import { SectionHeading } from "@/components/marketing/section-heading"
import { cn } from "@/lib/utils"

const STEPS = [
  { title: "Start in a click", body: "Hit “Try as Guest”: no email, no card. Name your resume and you’re in the editor." },
  { title: "Write with a live preview", body: "Fill in contact, summary, experience, skills, projects and education. The page updates as you type and autosaves." },
  { title: "Sharpen and tailor with AI", body: "Rewrite any bullet in three tones, or paste a job description to get gaps, a tailored summary and bullet alternatives." },
  { title: "Export and apply", body: "Download a clean, ATS-friendly PDF. Duplicate the resume and tailor it again for the next role." },
]

function Visual({ step }: { step: number }) {
  const frame = "flex h-full flex-col justify-center gap-4 p-6 sm:p-10"
  if (step === 0)
    return (
      <div className={frame}>
        <div className="rounded-xl border bg-background p-5">
          <p className="text-xs font-medium text-muted-foreground">Welcome</p>
          <p className="mt-2 font-display text-3xl">Start building.</p>
          <div className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Try as Guest →</div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {["no email", "no card", "no catch"].map((t) => (
            <span key={t} className="rounded-full border px-3 py-1">{t}</span>
          ))}
        </div>
      </div>
    )
  if (step === 1)
    return (
      <div className={cn(frame, "sm:flex-row sm:items-stretch")}>
        <div className="flex-1 space-y-3 rounded-xl border bg-background p-4">
          {["Full name", "Email", "Summary"].map((l, i) => (
            <div key={l}>
              <p className="text-[11px] font-medium text-muted-foreground">{l}</p>
              <div className="mt-1 h-8 rounded-md border bg-card px-2 text-xs leading-8 text-muted-foreground">{["Sarah Johnson", "sarah@email.com", "Frontend engineer…"][i]}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-sm bg-white p-4 text-neutral-900 shadow-lg">
          <p className="font-display text-xl leading-none">Sarah Johnson</p>
          <div className="mt-3 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-neutral-200" />
            <span className="block h-1.5 w-10/12 rounded-full bg-neutral-200" />
            <span className="block h-1.5 w-7/12 rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
    )
  if (step === 2)
    return (
      <div className={frame}>
        <p className="rounded-lg border bg-background p-4 text-sm text-muted-foreground line-through decoration-muted-foreground/40">Built reusable React components.</p>
        <div className="rounded-lg border border-primary/40 bg-accent p-4 text-sm text-accent-foreground">
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
            <Sparkles className="size-3" /> Technical
          </span>
          <p>Built a library of reusable React + TypeScript components adopted by <b className="rounded bg-warn px-1 font-mono text-warn-foreground">[N]</b> teams.</p>
        </div>
      </div>
    )
  return (
    <div className={cn(frame, "items-center")}>
      <div className="flex w-full max-w-xs items-center gap-4 rounded-xl border bg-background p-4 shadow-lift">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">sarah-johnson-resume.pdf</p>
          <p className="text-xs text-muted-foreground">1 page · ATS-ready</p>
        </div>
        <Download className="ml-auto size-5 text-muted-foreground" />
      </div>
    </div>
  )
}

export function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <section id="how" className="scroll-mt-20 bg-secondary/50 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How it works">
          From blank page to <span className="italic text-primary">tailored PDF</span> in four steps
        </SectionHeading>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[5/4] overflow-hidden rounded-3xl border bg-card shadow-lift">
              <div className="flex items-center gap-1.5 border-b px-4 py-3">
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="ml-3 text-xs text-muted-foreground">Step {active + 1} of 4</span>
              </div>
              <div className="h-[calc(100%-45px)]">
                <AnimatePresence mode="wait">
                  <motion.div key={active} className="h-full" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <Visual step={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <ol className="relative space-y-4 lg:space-y-0">
            <div className="absolute bottom-10 left-[1.35rem] top-10 hidden w-px bg-border lg:block" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className="relative flex gap-5 lg:min-h-[16rem] lg:items-center"
              >
                <span
                  className={cn(
                    "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300",
                    active === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className={cn("rounded-3xl border bg-card p-6 transition-all duration-300 sm:p-8", active === i ? "shadow-lift" : "lg:opacity-50")}>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
