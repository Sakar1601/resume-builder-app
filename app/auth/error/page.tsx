import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <AuthShell>
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <TriangleAlert className="size-8 text-destructive" />
      </div>
      <h1 className="mt-6 text-5xl tracking-normal">Something went wrong</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {params?.error ? `Error: ${params.error}` : "An unexpected error occurred. Please try again."}
      </p>
      <Button asChild size="lg" className="mt-8 w-full">
        <Link href="/auth/login">Return to Sign In</Link>
      </Button>
    </AuthShell>
  )
}
