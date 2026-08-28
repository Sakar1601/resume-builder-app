"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ResumePreview } from "@/components/resume-preview"
import { isGuestSession, getGuestResume } from "@/lib/guest-session"
import type { ResumeData } from "@/lib/types"

export default function GuestPrintPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  useEffect(() => {
    // Reading localStorage is a synchronous client-only side effect; deferring the
    // resulting setState call to a microtask callback (rather than calling it
    // directly in the effect body) keeps this a "sync from external system" read.
    queueMicrotask(() => {
      if (!isGuestSession()) {
        router.push("/auth/login")
        return
      }

      const resume = getGuestResume(id)

      if (!resume) {
        router.push("/guest/dashboard")
        return
      }

      setResumeData(resume.data || {})

      // Trigger print dialog after content loads
      setTimeout(() => {
        window.print()
      }, 500)
    })
  }, [id, router])

  if (!resumeData) {
    return null
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <ResumePreview data={resumeData} />
    </div>
  )
}
