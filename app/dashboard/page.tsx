import { createClient } from "@/lib/supabase/server"
import { ResumeList } from "@/components/resume-list"
import { CreateResumeDialog } from "@/components/create-resume-dialog"
import { FileText } from "lucide-react"

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

      {resumes && resumes.length > 0 ? (
        <ResumeList resumes={resumes} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No resumes yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start building your professional resume today. Click the button above to create your first resume.
          </p>
        </div>
      )}
    </div>
  )
}
