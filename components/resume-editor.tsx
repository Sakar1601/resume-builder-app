"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, FileDown } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Resume, ResumeData } from "@/lib/types"
import { ContactSection } from "@/components/sections/contact-section"
import { SummarySection } from "@/components/sections/summary-section"
import { SkillsEditorSection } from "@/components/sections/skills-editor-section"
import { ExperienceEditorSection } from "@/components/sections/experience-editor-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { EducationEditorSection } from "@/components/sections/education-editor-section"
import { TailorToJob } from "@/components/tailor-to-job"
import { ResumePreview } from "@/components/resume-preview"
import { cn } from "@/lib/utils"

interface ResumeEditorProps {
  resume: Resume & { data: ResumeData }
}

export function ResumeEditor({ resume: initialResume }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResume.data || {})
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (saveStatus === "idle") return

    const timer = setTimeout(async () => {
      setSaveStatus("saving")
      try {
        const supabase = createClient()
        const { error: updateError } = await supabase
          .from("resumes")
          .update({
            data: resumeData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialResume.id)

        if (updateError) throw updateError

        setSaveStatus("saved")
        setError(null)
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch (err) {
        console.error("Save error:", err)
        setError("Failed to save changes")
        setSaveStatus("idle")
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [resumeData, initialResume.id, saveStatus])

  const updateResumeData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setResumeData(updater)
    setSaveStatus("idle")
  }, [])

  const handleExportPDF = () => {
    window.open(`/print/resume/${initialResume.id}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{initialResume.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {saveStatus === "saving" && <span>Saving…</span>}
                {saveStatus === "saved" && <span className="text-green-600">Saved</span>}
                {error && <span className="text-destructive">{error}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleExportPDF} variant="outline" className="gap-2 bg-transparent">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>

            <div className="lg:hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "editor" | "preview")}>
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Editor Column */}
          <div className={cn("space-y-6", activeTab === "preview" && "hidden lg:block")}>
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="tailor">Tailor</TabsTrigger>
              </TabsList>

              <TabsContent value="contact" className="mt-6">
                <ContactSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="summary" className="mt-6">
                <SummarySection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <SkillsEditorSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="experience" className="mt-6">
                <ExperienceEditorSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <ProjectsSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <EducationEditorSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="tailor" className="mt-6">
                <TailorToJob data={resumeData} updateData={updateResumeData} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Column */}
          <div
            className={cn("lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]", activeTab === "editor" && "hidden lg:block")}
          >
            <Card className="h-full overflow-auto p-6">
              <ResumePreview data={resumeData} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
