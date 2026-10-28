"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatusScreen } from "@/components/layout/status-screen"

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusScreen code="500" title="Something broke on our end.">
      <p>Your resumes are safe. Try again, or head back to the start.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </StatusScreen>
  )
}
