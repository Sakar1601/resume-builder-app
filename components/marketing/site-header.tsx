import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { StartGuestButton } from "@/components/marketing/start-guest-button"

const LINKS = [
  { href: "#different", label: "Why it’s different" },
  { href: "#how", label: "How it works" },
  { href: "#ai", label: "The AI" },
  { href: "#faq", label: "FAQ" },
]

/** A floating pill that detaches from the top edge, rather than a full-bleed bar. */
export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="glass mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full border pl-5 pr-2 shadow-lift">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle className="rounded-full" />
          <Button asChild variant="ghost" size="sm" className="hidden rounded-full sm:inline-flex">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <StartGuestButton size="sm" variant="ink" className="rounded-full">
            Try as Guest
          </StartGuestButton>
        </div>
      </div>
    </header>
  )
}
