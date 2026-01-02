"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ChevronLeft, FileDown, Maximize2, Minimize2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Resume, ResumeData } from "@/lib/types"
import { updateGuestResume, type GuestResume } from "@/lib/guest-session"
import { ContactSection } from "@/components/sections/contact-section"
import { SummarySection } from "@/components/sections/summary-section"
import { SkillsEditorSection } from "@/components/sections/skills-editor-section"
import { ExperienceEditorSection } from "@/components/sections/experience-editor-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { EducationEditorSection } from "@/components/sections/education-editor-section"
import { TailorToJob } from "@/components/tailor-to-job"
import { ResumePreview } from "@/components/resume-preview"
import { ResumeReadinessChecklist } from "@/components/resume-readiness-checklist"
import { cn } from "@/lib/utils"

interface ResumeEditorProps {
  resume: (Resume | GuestResume) & { data: ResumeData }
  isGuest?: boolean
}

export function ResumeEditor({ resume: initialResume, isGuest = false }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResume.data || {})
  const [resumeTitle, setResumeTitle] = useState(initialResume.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const [previewZoom, setPreviewZoom] = useState(100)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (saveStatus === "idle" && hasUnsavedChanges) {
      const timer = setTimeout(async () => {
        setSaveStatus("saving")
        try {
          if (isGuest) {
            updateGuestResume(initialResume.id, {
              title: resumeTitle,
              data: resumeData,
            })
            window.dispatchEvent(new Event("guest-resumes-updated"))
            setSaveStatus("saved")
            setHasUnsavedChanges(false)
            setError(null)
            setTimeout(() => setSaveStatus("idle"), 2000)
            return
          }

          const supabase = createClient()
          const { error: updateError } = await supabase
            .from("resumes")
            .update({
              title: resumeTitle,
              data: resumeData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", initialResume.id)

          if (updateError) throw updateError

          setSaveStatus("saved")
          setHasUnsavedChanges(false)
          setError(null)
          setTimeout(() => setSaveStatus("idle"), 2000)
        } catch (err) {
          console.error("Save error:", err)
          setError("Failed to save changes")
          setSaveStatus("idle")
        }
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [resumeData, resumeTitle, initialResume.id, saveStatus, hasUnsavedChanges, isGuest])

  const updateResumeData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setResumeData(updater)
    setSaveStatus("idle")
    setHasUnsavedChanges(true)
  }, [])

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (resumeTitle !== initialResume.title) {
      setSaveStatus("idle")
      setHasUnsavedChanges(true)
    }
  }

  const handleExportPDF = () => {
    if (isGuest) {
      window.open(`/guest/print/${initialResume.id}`, "_blank")
    } else {
      window.open(`/print/resume/${initialResume.id}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Link href={isGuest ? "/guest/dashboard" : "/dashboard"}>
              <Button variant="ghost" size="icon" className="hover:bg-accent transition-colors flex-shrink-0">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              {isEditingTitle ? (
                <Input
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleBlur()
                  }}
                  className="h-8 font-semibold max-w-md"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {resumeTitle}
                </h1>
              )}
              <div className="flex items-center gap-2 text-xs">
                {saveStatus === "saving" && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Saving…
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    All changes saved
                  </span>
                )}
                {hasUnsavedChanges && saveStatus === "idle" && (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Unsaved changes
                  </span>
                )}
                {error && <span className="text-destructive">{error}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsFullWidth(!isFullWidth)}
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              title={isFullWidth ? "Show editor" : "Full preview"}
            >
              {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

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
        <div
          className={cn(
            "lg:grid lg:gap-8 transition-all duration-300",
            isFullWidth ? "lg:grid-cols-1" : "lg:grid-cols-2",
          )}
        >
          <div className={cn("space-y-6", activeTab === "preview" && "hidden lg:block", isFullWidth && "hidden")}>
            <ResumeReadinessChecklist data={resumeData} />

            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
                <TabsTrigger value="contact" className="data-[state=active]:bg-primary/10">
                  Contact
                </TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:bg-primary/10">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-primary/10">
                  Skills
                </TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-primary/10">
                  Experience
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-primary/10">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-primary/10">
                  Education
                </TabsTrigger>
                <TabsTrigger value="tailor" className="data-[state=active]:bg-primary/10">
                  Tailor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contact" className="mt-6 space-y-4">
                <ContactSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="summary" className="mt-6 space-y-4">
                <SummarySection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="skills" className="mt-6 space-y-4">
                <SkillsEditorSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="experience" className="mt-6 space-y-4">
                <ExperienceEditorSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="projects" className="mt-6 space-y-4">
                <ProjectsSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="education" className="mt-6 space-y-4">
                <EducationEditorSection data={resumeData} updateData={updateResumeData} />
              </TabsContent>

              <TabsContent value="tailor" className="mt-6 space-y-4">
                <TailorToJob data={resumeData} updateData={updateResumeData} />
              </TabsContent>
            </Tabs>
          </div>

          <div
            className={cn("lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]", activeTab === "editor" && "hidden lg:block")}
          >
            <Card className="h-full flex flex-col shadow-lg border-2">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <span className="text-sm font-medium">Preview</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewZoom(90)}
                    className={cn("h-7 px-2 text-xs", previewZoom === 90 && "bg-primary/10")}
                  >
                    90%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewZoom(100)}
                    className={cn("h-7 px-2 text-xs", previewZoom === 100 && "bg-primary/10")}
                  >
                    100%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewZoom(110)}
                    className={cn("h-7 px-2 text-xs", previewZoom === 110 && "bg-primary/10")}
                  >
                    110%
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 bg-muted/10">
                <div
                  style={{
                    transform: `scale(${previewZoom / 100})`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <ResumePreview data={resumeData} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
