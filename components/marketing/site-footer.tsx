import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function SiteFooter() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ResumeBuilder. Honest resumes, faster.</p>
        <ThemeToggle />
      </div>
    </footer>
  )
}
