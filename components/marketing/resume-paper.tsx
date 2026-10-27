import { cn } from "@/lib/utils"

const ROLES = {
  frontend: { role: "Frontend Engineer", bullet: "design system", tools: ["React", "TypeScript"] },
  platform: { role: "Platform Engineer", bullet: "CI pipeline", tools: ["Kubernetes", "Terraform"] },
  product: { role: "Product Engineer", bullet: "onboarding flow", tools: ["Next.js", "Postgres"] },
} as const

export type PaperVariant = keyof typeof ROLES

/** A small static sheet of paper. Always white, in both themes: it stands in for the printed page. */
export function ResumePaper({ variant = "frontend", className }: { variant?: PaperVariant; className?: string }) {
  const v = ROLES[variant]
  return (
    <div className={cn("aspect-[8.5/11] w-full rounded-md bg-white p-5 text-neutral-900 shadow-xl ring-1 ring-black/10", className)} aria-hidden="true">
      <p className="font-display text-xl leading-none">Sarah Johnson</p>
      <p className="mt-1 text-[9px] text-neutral-500">{v.role} · San Francisco, CA</p>
      <div className="mt-3 h-px bg-neutral-200" />
      <p className="mt-3 text-[8px] font-semibold tracking-wider text-neutral-400">EXPERIENCE</p>
      <p className="mt-1.5 text-[10px] font-semibold">{v.role}, Northwind</p>
      <p className="mt-1 text-[9px] leading-snug text-neutral-600">
        Built <span className="highlight">{v.tools[0]}</span> and <span className="highlight">{v.tools[1]}</span> tooling behind the{" "}
        {v.bullet}, used by <span className="rounded bg-amber-200 px-0.5 text-amber-900">[N]</span> teams.
      </p>
      <div className="mt-3 space-y-1.5">
        <span className="block h-1 w-full rounded-full bg-neutral-100" />
        <span className="block h-1 w-10/12 rounded-full bg-neutral-100" />
        <span className="block h-1 w-8/12 rounded-full bg-neutral-100" />
      </div>
      <p className="mt-4 text-[8px] font-semibold tracking-wider text-neutral-400">SKILLS</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {v.tools.map((t) => (
          <span key={t} className="rounded-sm bg-neutral-100 px-1 py-0.5 text-[8px]">{t}</span>
        ))}
      </div>
    </div>
  )
}

/** Three tailored versions of the same resume, fanned out; they spread on hover. */
export function ResumeFan({ className }: { className?: string }) {
  return (
    <div className={cn("group relative mx-auto h-[22rem] w-full max-w-lg", className)}>
      {(["product", "platform", "frontend"] as const).map((variant, i) => (
        <div
          key={variant}
          className="absolute bottom-0 left-1/2 w-48 origin-bottom transition-transform duration-500 ease-out sm:w-56"
          style={{
            transform: `translateX(calc(-50% + ${(i - 1) * 78}px)) rotate(${(i - 1) * 8}deg) translateY(${Math.abs(i - 1) * 14}px)`,
          }}
        >
          <div className="transition-transform duration-500 group-hover:[transform:translateY(-8px)]">
            <ResumePaper variant={variant} />
          </div>
        </div>
      ))}
    </div>
  )
}
