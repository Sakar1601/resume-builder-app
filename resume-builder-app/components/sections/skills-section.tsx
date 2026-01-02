"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { X } from "lucide-react"
import type { ResumeSection } from "@/lib/types"

interface SkillsSectionProps {
  resumeId: string
  section?: ResumeSection
  onUpdate: (section: ResumeSection) => void
}

export function SkillsSection({ resumeId, section, onUpdate }: SkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (section?.content?.skills) {
      setSkills(section.content.skills)
    }
  }, [section])

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      setSkills([...skills, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const content = { skills }

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
          section_type: "skills",
          content,
          display_order: 3,
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
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add your professional skills and competencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skill-input">Add Skill</Label>
          <div className="flex gap-2">
            <Input
              id="skill-input"
              placeholder="e.g., JavaScript, Project Management"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addSkill} type="button" variant="outline">
              Add
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-lg">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet. Start adding your skills above.</p>
          ) : (
            skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Skills"}
        </Button>
      </CardContent>
    </Card>
  )
}
