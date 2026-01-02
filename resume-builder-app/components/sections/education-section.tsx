"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeSection } from "@/lib/types"

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

interface EducationSectionProps {
  resumeId: string
  section?: ResumeSection
  onUpdate: (section: ResumeSection) => void
}

export function EducationSection({ resumeId, section, onUpdate }: EducationSectionProps) {
  const [education, setEducation] = useState<Education[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (section?.content?.education) {
      setEducation(section.content.education)
    }
  }, [section])

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: crypto.randomUUID(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const content = { education }

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
          section_type: "education",
          content,
          display_order: 2,
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
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="space-y-4 p-4 border rounded-lg relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="space-y-2">
              <Label>School</Label>
              <Input
                placeholder="University Name"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                placeholder="e.g., Bachelor of Science"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                placeholder="e.g., Computer Science"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Education"}
        </Button>
      </CardContent>
    </Card>
  )
}
