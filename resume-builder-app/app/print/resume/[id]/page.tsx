import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResumePreview } from "@/components/resume-preview"
import type { ResumeData } from "@/lib/types"

export default async function PrintResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Server-side authentication and ownership validation
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch resume and validate ownership
  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !resume) {
    redirect("/dashboard")
  }

  const resumeData: ResumeData = resume.data || {}

  return (
    <>
      <div className="print-container">
        <ResumePreview data={resumeData} />
      </div>
      <PrintTrigger />
    </>
  )
}

function PrintTrigger() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.onload = function() {
            window.print();
          };
        `,
      }}
    />
  )
}
