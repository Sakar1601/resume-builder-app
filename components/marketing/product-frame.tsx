"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { ResumePaper } from "@/components/marketing/resume-paper"

const TABS = ["Contact", "Summary", "Skills", "Experience", "Tailor"]

/** The app, drawn in HTML. Starts tilted back and settles flat as it scrolls into view. */
export function ProductFrame() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 35%"] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 16, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.93, 1])

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl [perspective:1400px]">
      <motion.div
        style={{ rotateX, scale, transformOrigin: "50% 0%" }}
        className="overflow-hidden rounded-2xl border bg-card shadow-[0_40px_90px_-30px_color-mix(in_oklab,var(--foreground)_45%,transparent)]"
      >
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b bg-secondary/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <div className="mx-auto hidden rounded-md border bg-background px-12 py-1 text-xs text-muted-foreground sm:block">
            resumebuilder.app/guest/resume
          </div>
        </div>

        <div className="grid md:grid-cols-[1.05fr_1fr]">
          {/* editor pane */}
          <div className="space-y-5 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Frontend Engineer</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-mint" /> All changes saved
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                83% ready
              </div>
            </div>

            <div className="flex gap-1 overflow-hidden rounded-lg bg-muted p-1 text-xs font-medium">
              {TABS.map((t, i) => (
                <span key={t} className={i === 3 ? "rounded-md bg-card px-2.5 py-1.5 shadow-sm" : "px-2.5 py-1.5 text-muted-foreground"}>
                  {t}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Bullet</p>
              <div className="rounded-xl border bg-background p-3.5 text-sm leading-relaxed">
                Built a library of reusable React and TypeScript components adopted by{" "}
                <mark className="rounded bg-warn px-1 text-warn-foreground">[N]</mark> product teams.
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                <Sparkles className="size-3.5" /> Rewrite with AI
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground">Job keywords</p>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {["React", "TypeScript", "design system"].map((k) => (
                  <span key={k} className="inline-flex items-center gap-1 rounded-full bg-ok px-2.5 py-1 font-medium text-ok-foreground">
                    <Check className="size-3" /> {k}
                  </span>
                ))}
                {["accessibility", "performance"].map((k) => (
                  <span key={k} className="rounded-full border border-dashed border-warn-border bg-warn px-2.5 py-1 font-medium text-warn-foreground">
                    {k} · add only if true
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* preview pane */}
          <div className="hidden items-start justify-center border-l bg-secondary/60 p-7 md:flex">
            <div className="w-full max-w-[17rem]">
              <ResumePaper />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
