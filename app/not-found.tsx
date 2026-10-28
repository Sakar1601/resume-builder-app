import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatusScreen } from "@/components/layout/status-screen"

export default function NotFound() {
  return (
    <StatusScreen code="404" title="This page wandered off.">
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </StatusScreen>
  )
}
