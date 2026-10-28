"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { House, LogOut, UserRound } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

type AppHeaderProps = { user: User; isGuest?: false } | { user?: undefined; isGuest: true }

/** Top bar for the signed-in dashboard and the guest dashboard. */
export function AppHeader(props: AppHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    router.push("/")
  }

  return (
    <header className="glass sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo href={props.isGuest ? "/guest/dashboard" : "/dashboard"} />
          {props.isGuest && (
            <span className="rounded-full border border-warn-border bg-warn px-2.5 py-0.5 text-xs font-medium text-warn-foreground">Guest</span>
          )}
        </div>

        <div className="flex items-center gap-2">
        <ThemeToggle />
        {props.isGuest ? (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href="/" aria-label="Back to home page">
                <House />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserRound />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{props.user.user_metadata?.full_name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{props.user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <House className="mr-2 h-4 w-4" />
                  <span>Home page</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        </div>
      </div>
    </header>
  )
}
