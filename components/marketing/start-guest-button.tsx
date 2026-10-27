"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { setGuestSession } from "@/lib/guest-session"

type StartGuestButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick" | "asChild">

/** Starts a local guest session and drops the visitor straight into the app. */
export function StartGuestButton({ children = "Try as Guest", ...props }: StartGuestButtonProps) {
  const router = useRouter()

  return (
    <Button
      {...props}
      onClick={() => {
        setGuestSession()
        router.push("/guest/dashboard")
      }}
    >
      {children}
    </Button>
  )
}
