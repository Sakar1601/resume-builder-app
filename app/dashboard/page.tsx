import { createClient } from "@/lib/supabase/server"
import { ResumeList } from "@/components/resume/resume-list"
import { CreateResumeDialog } from "@/components/resume/create-resume-dialog"
import { PageHeader } from "@/components/layout/page-header"
import { PageTransition } from "@/components/motion/reveal"

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
    <PageTransition className="space-y-10">
      <PageHeader title="My Resumes" description="Create, tailor and export your resumes" action={<CreateResumeDialog />} />
      <ResumeList resumes={resumes || []} />
    </PageTransition>
  )
}
