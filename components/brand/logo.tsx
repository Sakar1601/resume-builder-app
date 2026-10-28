import Link from "next/link"
import { cn } from "@/lib/utils"

/** A folded-corner page with a signal-colored tab: reads as "resume" at 16px. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" className="fill-foreground" />
      <path d="M9.5 7.5h9.2l4.8 4.8v12.2a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" className="fill-background" />
      <path d="M18.7 7.5v4.8h4.8" className="fill-primary" />
      <path d="M12 16.5h8M12 19.5h8M12 22h4.5" className="stroke-foreground" strokeWidth="1.4" strokeLinecap="round" opacity=".75" />
    </svg>
  )
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="text-lg font-semibold leading-none tracking-tight">
        Resume<span className="text-primary">Builder</span>
      </span>
    </Link>
  )
}
