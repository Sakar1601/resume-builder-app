import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResumeEditor } from "@/components/resume-editor"

export default async function ResumeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !resume) {
    redirect("/dashboard")
  }

  return <ResumeEditor resume={resume} />
}
