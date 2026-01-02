import { createClient } from "@/lib/supabase/server"
import { ResumeList } from "@/components/resume-list"
import { CreateResumeDialog } from "@/components/create-resume-dialog"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-muted-foreground mt-2">Create and manage your professional resumes</p>
        </div>
        <CreateResumeDialog />
      </div>

      <ResumeList resumes={resumes || []} />
    </div>
  )
}
