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
