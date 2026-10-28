"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { AppHeader } from "@/components/layout/app-header"
import { PageHeader } from "@/components/layout/page-header"
import { PageTransition } from "@/components/motion/reveal"
import { CreateResumeDialog } from "@/components/resume/create-resume-dialog"
import { ResumeList } from "@/components/resume/resume-list"
import { isGuestSession, getGuestResumes, seedGuestSampleData, type GuestResume } from "@/lib/guest-session"

export default function GuestDashboardPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<GuestResume[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isGuestSession()) {
      router.push("/auth/login")
      return
    }

    seedGuestSampleData()

    const loadResumes = () => {
      setResumes(getGuestResumes())
      setIsLoading(false)
    }

    loadResumes()

    // "storage" covers other tabs; the custom event covers updates from this tab.
    window.addEventListener("storage", loadResumes)
    window.addEventListener("guest-resumes-updated", loadResumes)

    return () => {
      window.removeEventListener("storage", loadResumes)
      window.removeEventListener("guest-resumes-updated", loadResumes)
    }
  }, [router])

  return (
    <div className="min-h-screen">
      <AppHeader isGuest />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-muted" aria-label="Loading" />
        ) : (
          <PageTransition className="space-y-10">
            <div className="flex items-start gap-3 rounded-2xl border border-warn-border bg-warn p-4 text-sm text-warn-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>
                You&apos;re in Guest Mode. Resumes are stored in this browser and are lost if you clear site data.{" "}
                <Link href="/auth/sign-up" className="font-semibold underline underline-offset-4">
                  Create an account
                </Link>{" "}
                to keep your work.
              </p>
            </div>

            <PageHeader title="My Resumes" description="Create, tailor and export your resumes" action={<CreateResumeDialog isGuest />} />
            <ResumeList resumes={resumes} isGuest />
          </PageTransition>
        )}
      </main>
    </div>
  )
}
