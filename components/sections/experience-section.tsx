"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeSection } from "@/lib/types"

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface ExperienceSectionProps {
  resumeId: string
  section?: ResumeSection
  onUpdate: (section: ResumeSection) => void
}

export function ExperienceSection({ resumeId, section, onUpdate }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (section?.content?.experiences) {
      setExperiences(section.content.experiences)
    }
  }, [section])

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const content = { experiences }

    if (section?.id) {
      const { data, error } = await supabase
        .from("resume_sections")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", section.id)
        .select()
        .single()

      if (!error && data) {
        onUpdate(data)
      }
    } else {
      const { data, error } = await supabase
        .from("resume_sections")
        .insert({
          resume_id: resumeId,
          section_type: "experience",
          content,
          display_order: 1,
        })
        .select()
        .single()

      if (!error && data) {
        onUpdate(data)
      }
    }

    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Add your professional work history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                placeholder="Job Title"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                I currently work here
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Experience"}
        </Button>
      </CardContent>
    </Card>
  )
}
