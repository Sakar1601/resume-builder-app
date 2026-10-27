import { Reveal } from "@/components/motion/reveal"

const STATS = [
  { value: "0", label: "numbers invented by the AI" },
  { value: "3", label: "rewrite tones per bullet" },
  { value: "1", label: "click to start, no signup" },
  { value: "1", label: "clean column ATS can parse" },
]

export function ProofStrip() {
  return (
    <Reveal className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
      <dl className="grid grid-cols-2 gap-y-10 border-y py-10 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className={i > 0 ? "md:border-l md:pl-8" : ""}>
            <dt className="font-display text-7xl leading-none">{s.value}</dt>
            <dd className="mt-3 max-w-[12rem] text-sm text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
