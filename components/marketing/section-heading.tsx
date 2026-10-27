import { cn } from "@/lib/utils"

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", className)}>
      <span className="size-1.5 rounded-full bg-primary" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  children,
  body,
  align = "left",
}: {
  eyebrow: string
  children: React.ReactNode
  body?: string
  align?: "left" | "center"
}) {
  const center = align === "center"
  return (
    <div className={cn(center && "mx-auto max-w-3xl text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-4xl leading-[1.05] sm:text-6xl">{children}</h2>
      {body && <p className={cn("mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground", center && "mx-auto")}>{body}</p>}
    </div>
  )
}
