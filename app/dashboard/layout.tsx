import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppHeader } from "@/components/layout/app-header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <AppHeader user={user} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">{children}</main>
    </div>
  )
}
