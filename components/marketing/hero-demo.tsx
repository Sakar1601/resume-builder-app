"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check, Sparkles, TriangleAlert } from "lucide-react"

const ORIGINAL = "Built reusable React components for the team."
const REWRITTEN = "Built a library of reusable React and TypeScript components adopted by [N] product teams, improving UI consistency."
const PLACEHOLDER = "[N]"

type Phase = "original" | "thinking" | "typing" | "done"

function useDemoLoop(reduce: boolean | null) {
  const [phase, setPhase] = useState<Phase>(reduce ? "done" : "original")
  const [chars, setChars] = useState(reduce ? REWRITTEN.length : 0)

  useEffect(() => {
    if (reduce) return
    let timer: ReturnType<typeof setTimeout>
    const run = (next: Phase, ms: number, after?: () => void) => {
      timer = setTimeout(() => {
        setPhase(next)
        after?.()
      }, ms)
    }
    if (phase === "original") {
      run("thinking", 1800)
    } else if (phase === "thinking") {
      run("typing", 1100)
    } else if (phase === "typing") {
      if (chars < REWRITTEN.length) {
        timer = setTimeout(() => setChars((c) => c + 2), 22)
      } else {
        run("done", 200)
      }
    } else {
      run("original", 5200, () => setChars(0))
    }
    return () => clearTimeout(timer)
  }, [phase, chars, reduce])

  return { phase, chars }
}

function RewrittenText({ chars }: { chars: number }) {
  const shown = REWRITTEN.slice(0, chars)
  const idx = shown.indexOf(PLACEHOLDER)
  if (idx === -1 || shown.length < idx + PLACEHOLDER.length) {
    return <>{shown}</>
  }
  return (
    <>
      {shown.slice(0, idx)}
      <mark className="rounded bg-warn px-1 font-mono text-[0.92em] text-warn-foreground">{PLACEHOLDER}</mark>
      {shown.slice(idx + PLACEHOLDER.length)}
    </>
  )
}

export function HeroDemo() {
  const reduce = useReducedMotion()
  const { phase, chars } = useDemoLoop(reduce)
  const done = phase === "done"

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="overflow-hidden rounded-3xl border bg-card shadow-lift">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="ml-3 truncate rounded-md bg-background px-3 py-0.5 font-mono text-xs text-muted-foreground">
            resumebuilder.app / tailor
          </span>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2">
          {/* Job description */}
          <div className="bg-card p-6 sm:p-8">
            <p className="text-xs font-medium text-muted-foreground">1 · Paste the job</p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
              We&apos;re hiring a <b className="text-foreground">Senior Frontend Engineer</b> to own our{" "}
              <mark className="rounded bg-accent px-1 text-accent-foreground">design system</mark>. You&apos;ll ship{" "}
              <mark className="rounded bg-accent px-1 text-accent-foreground">React</mark> and{" "}
              <mark className="rounded bg-accent px-1 text-accent-foreground">TypeScript</mark>, champion{" "}
              <mark className="rounded bg-accent px-1 text-accent-foreground">accessibility</mark>, and keep{" "}
              <mark className="rounded bg-accent px-1 text-accent-foreground">performance</mark> budgets honest.
            </p>

            <p className="mt-6 text-xs font-medium text-muted-foreground">Keyword check</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["React", "TypeScript", "design system"].map((k) => (
                <span key={k} className="inline-flex items-center gap-1 rounded-full bg-ok px-3 py-1 text-xs font-medium text-ok-foreground">
                  <Check className="size-3" /> {k}
                </span>
              ))}
              <AnimatePresence>
                {done &&
                  ["accessibility", "performance"].map((k, i) => (
                    <motion.span
                      key={k}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.15 * i, type: "spring", stiffness: 300, damping: 18 }}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-warn-border bg-warn px-3 py-1 text-xs font-medium text-warn-foreground"
                    >
                      <TriangleAlert className="size-3" /> {k}: add only if true
                    </motion.span>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bullet rewrite */}
          <div className="bg-card p-6 sm:p-8">
            <p className="text-xs font-medium text-muted-foreground">2 · Sharpen your real bullet</p>

            <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground line-through decoration-muted-foreground/40">
              {ORIGINAL}
            </div>

            <div className="relative mt-3 min-h-[8.5rem] rounded-xl border border-primary/30 bg-accent/50 p-4 text-[15px] leading-relaxed">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                <Sparkles className="size-3" /> Impact tone
              </span>
              <div className="min-h-[3.5rem]">
                {phase === "original" && <span className="text-muted-foreground/70">Waiting for you to hit rewrite…</span>}
                {phase === "thinking" && (
                  <div className="space-y-2" aria-label="Rewriting">
                    <div className="h-3 w-11/12 animate-shimmer rounded bg-[linear-gradient(90deg,var(--muted),var(--accent),var(--muted))] bg-[length:200%_100%]" />
                    <div className="h-3 w-8/12 animate-shimmer rounded bg-[linear-gradient(90deg,var(--muted),var(--accent),var(--muted))] bg-[length:200%_100%]" />
                  </div>
                )}
                {(phase === "typing" || phase === "done") && (
                  <p>
                    <RewrittenText chars={chars} />
                    {phase === "typing" && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-blink bg-primary" />}
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence>
              {done && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warn-foreground" />
                  <span>
                    No number in your original? The AI leaves a <b className="font-mono">[N]</b> for you to fill in — it never makes one up.
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  )
}
