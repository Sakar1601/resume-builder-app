"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreateResumeDialog } from "@/components/create-resume-dialog"
import { ResumeList } from "@/components/resume-list"
import { isGuestSession, getGuestResumes } from "@/lib/guest-session"
import type { GuestResume } from "@/lib/guest-session"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GuestDashboardPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<GuestResume[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isGuestSession()) {
      router.push("/auth/login")
      return
    }

    const loadResumes = () => {
      const guestResumes = getGuestResumes()
      setResumes(guestResumes)
      setIsLoading(false)
    }

    loadResumes()

    // Listen for storage changes to update the list
    const handleStorageChange = () => {
      loadResumes()
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for updates from same tab
    window.addEventListener("guest-resumes-updated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("guest-resumes-updated", handleStorageChange)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">ResumeBuilder</span>
              <span className="text-sm text-muted-foreground">(Guest Mode)</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/sign-up">
                <Button variant="outline" size="sm">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              You&apos;re using Guest Mode. Your resumes are stored locally and will be lost if you clear browser data.{" "}
              <Link href="/auth/sign-up" className="underline font-medium">
                Create an account
              </Link>{" "}
              to save your work permanently.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
              <p className="text-muted-foreground mt-2">Create and manage your professional resumes</p>
            </div>
            <CreateResumeDialog isGuest />
          </div>

          <ResumeList resumes={resumes} isGuest />
        </div>
      </main>
    </div>
  )
}
