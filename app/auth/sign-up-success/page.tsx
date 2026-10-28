import Link from "next/link"
import { MailCheck } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <AuthShell>
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
        <MailCheck className="size-8 text-primary" />
      </div>
      <h1 className="mt-6 text-5xl tracking-normal">Check your email</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        We&apos;ve sent you a confirmation link. Click it to activate your account, then sign in and start building your resume.
      </p>
      <Button asChild variant="outline" size="lg" className="mt-8 w-full">
        <Link href="/auth/login">Return to Sign In</Link>
      </Button>
    </AuthShell>
  )
}
