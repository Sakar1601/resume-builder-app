import type React from "react"
import { Logo } from "@/components/brand/logo"
import { PageTransition } from "@/components/motion/reveal"
import { ResumeFan } from "@/components/marketing/resume-paper"
import { ThemeToggle } from "@/components/theme/theme-toggle"

/** Split-screen frame shared by every /auth page: form on the left, brand panel on the right. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-12 sm:py-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <PageTransition className="w-full max-w-sm">{children}</PageTransition>
        </div>
      </div>

      <aside className="m-3 hidden overflow-hidden rounded-[2rem] bg-foreground px-14 pt-16 text-background lg:flex lg:flex-col lg:justify-between">
        <h2 className="max-w-md text-6xl leading-[0.98] tracking-tight">
          Say it better. <span className="italic text-primary">Never say it falsely.</span>
        </h2>
        <ResumeFan className="max-w-lg" />
      </aside>
    </div>
  )
}
