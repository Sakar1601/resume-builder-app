"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ResumeEditor } from "@/components/resume-editor"
import { isGuestSession, getGuestResume } from "@/lib/guest-session"
import type { GuestResume } from "@/lib/guest-session"

export default function GuestResumeEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [resume, setResume] = useState<GuestResume | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
  }, [id, router])

  if (isLoading || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return <ResumeEditor resume={resume} isGuest />
}
