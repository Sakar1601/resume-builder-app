"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { UserRound, AlignLeft, Wrench, Briefcase, FolderGit2, GraduationCap, Sparkles, ChevronLeft, FileDown, Maximize2, Minimize2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Resume, ResumeData } from "@/lib/types"
import { updateGuestResume, type GuestResume } from "@/lib/guest-session"
import { ContactSection } from "@/components/resume/sections/contact-section"
import { SummarySection } from "@/components/resume/sections/summary-section"
import { SkillsEditorSection } from "@/components/resume/sections/skills-editor-section"
import { ExperienceEditorSection } from "@/components/resume/sections/experience-editor-section"
import { ProjectsSection } from "@/components/resume/sections/projects-section"
import { EducationEditorSection } from "@/components/resume/sections/education-editor-section"
import { TailorToJob } from "@/components/resume/tailor-to-job"
import { ResumePreview } from "@/components/resume/resume-preview"
import { ResumeReadinessChecklist } from "@/components/resume/resume-readiness-checklist"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"

interface ResumeEditorProps {
  resume: (Resume | GuestResume) & { data: ResumeData | null }
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
      <div className="glass sticky top-0 z-20 border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-2 px-3 sm:px-5">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Link href={isGuest ? "/guest/dashboard" : "/dashboard"}>
              <Button variant="ghost" size="icon" className="flex-shrink-0" aria-label="Back to resumes">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <LogoMark className="hidden size-7 shrink-0 sm:block" />
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
                  className="font-sans text-lg font-semibold tracking-tight truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {resumeTitle}
                </h1>
              )}
              <div className="flex items-center gap-2 text-xs">
                {saveStatus === "saving" && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-spark animate-pulse" />
                    Saving…
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-ok-foreground flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-mint" />
                    All changes saved
                  </span>
                )}
                {hasUnsavedChanges && saveStatus === "idle" && (
                  <span className="text-warn-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Unsaved changes
                  </span>
                )}
                {error && <span className="text-destructive">{error}</span>}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
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

      <div className="mx-auto max-w-[96rem] px-5 py-8">
        <div
          className={cn(
            "lg:grid lg:gap-8 transition-all duration-300",
            isFullWidth ? "lg:grid-cols-1" : "lg:grid-cols-2",
          )}
        >
          <div className={cn("space-y-6", activeTab === "preview" && "hidden lg:block", isFullWidth && "hidden")}>
            <ResumeReadinessChecklist data={resumeData} />

            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1.5 [scrollbar-width:none]">
                <TabsTrigger value="contact">
                  <UserRound className="hidden sm:block" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="summary">
                  <AlignLeft className="hidden sm:block" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Wrench className="hidden sm:block" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="experience">
                  <Briefcase className="hidden sm:block" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="projects">
                  <FolderGit2 className="hidden sm:block" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="hidden sm:block" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="tailor">
                  <Sparkles className="hidden sm:block" />
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
            <Card className="h-full flex flex-col gap-0 overflow-hidden py-0 shadow-lift">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <span className="flex items-center gap-2 text-sm font-medium"><span className="size-1.5 rounded-full bg-primary" />Live preview</span>
                <div className="flex items-center rounded-lg bg-secondary p-0.5">
                  {[90, 100, 110].map((z) => (
                    <button
                      key={z}
                      onClick={() => setPreviewZoom(z)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                        previewZoom === z ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {z}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-dots flex-1 overflow-auto bg-secondary/60 p-6">
                <div
                  style={{
                    transform: `scale(${previewZoom / 100})`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <div className="shadow-xl ring-1 ring-black/5">
                    <ResumePreview data={resumeData} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
