"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ResumeEditor } from "@/components/resume/resume-editor"
import { isGuestSession, getGuestResume } from "@/lib/guest-session"
import type { GuestResume } from "@/lib/guest-session"

export default function GuestResumeEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [resume, setResume] = useState<GuestResume | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reading localStorage is a synchronous client-only side effect; deferring the
    // resulting setState calls to a microtask callback (rather than calling them
    // directly in the effect body) keeps this a "sync from external system" read.
    queueMicrotask(() => {
      if (!isGuestSession()) {
        router.push("/auth/login")
        return
      }

      const guestResume = getGuestResume(id)

      if (!guestResume) {
        router.push("/guest/dashboard")
        return
      }

      setResume(guestResume)
      setIsLoading(false)
    })
  }, [id, router])

  if (isLoading || !resume) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" role="status" aria-label="Loading" />
      </div>
    )
  }

  return <ResumeEditor resume={resume} isGuest />
}
