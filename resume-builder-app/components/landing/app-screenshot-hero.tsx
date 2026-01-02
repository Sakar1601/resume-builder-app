"use client"

import { ResumePreview } from "@/components/resume-preview"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import type { ResumeData } from "@/lib/types"

const demoResumeData: ResumeData = {
  contact: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarahjohnson",
  },
  summary:
    "Senior Software Engineer with 5+ years of experience building scalable web applications and leading cross-functional teams.",
  skills: [
    { id: "1", category: "Languages", skills: "JavaScript, TypeScript, Python, SQL" },
    { id: "2", category: "Frameworks", skills: "React, Next.js, Node.js, Express" },
  ],
  experience: [
    {
      id: "1",
      company: "Tech Company",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      bullets: [
        "Led team of 5 engineers to deliver new feature, increasing user engagement by 35%",
        "Optimized database queries reducing page load time from 3s to 800ms",
      ],
    },
  ],
  projects: [],
  education: [
    {
      id: "1",
      school: "University of California",
      degree: "B.S. Computer Science",
      startDate: "2016",
      endDate: "2020",
      details: "GPA: 3.8/4.0",
    },
  ],
}

export function AppScreenshotHero() {
  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl border-2 bg-background shadow-2xl overflow-hidden">
      {/* App header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-semibold">My Software Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">Saved 2s ago</div>
          <Button size="sm" className="h-8">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Split view */}
      <div className="grid lg:grid-cols-2 h-[calc(100%-60px)]">
        {/* Editor panel */}
        <div className="border-r bg-muted/20 p-4 overflow-auto">
          <Card className="p-4 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Full Name</Label>
              <Input value="Sarah Johnson" className="h-8 text-sm" readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email</Label>
              <Input value="sarah.johnson@email.com" className="h-8 text-sm" readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Professional Summary</Label>
              <div className="text-xs text-muted-foreground p-2 bg-background rounded border">
                Senior Software Engineer with 5+ years...
              </div>
            </div>
          </Card>
        </div>

        {/* Preview panel */}
        <div className="bg-white overflow-auto p-4">
          <div className="max-w-[600px] mx-auto transform scale-[0.7] origin-top">
            <ResumePreview data={demoResumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}
