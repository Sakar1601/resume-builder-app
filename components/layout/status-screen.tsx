import type React from "react"
import { Logo } from "@/components/brand/logo"
import { ResumeFan } from "@/components/marketing/resume-paper"
import { ThemeToggle } from "@/components/theme/theme-toggle"

/** Full-page frame for 404 / error states, matching the auth screens. */
export function StatusScreen({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
      <div className="flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 py-12 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-display text-[clamp(6rem,22vw,14rem)] italic leading-[0.8] text-primary">{code}</p>
          <h1 className="mt-6 text-4xl sm:text-5xl">{title}</h1>
          <div className="mt-4 max-w-md text-lg text-muted-foreground">{children}</div>
        </div>
        <ResumeFan className="hidden max-w-sm md:block" />
      </div>
    </div>
  )
}
