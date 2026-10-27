"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const subscribe = () => () => {}

/** Flips between light and dark; renders a neutral placeholder until mounted to avoid hydration mismatch. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Sun className="scale-100 rotate-0 transition-transform duration-500 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition-transform duration-500 dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
