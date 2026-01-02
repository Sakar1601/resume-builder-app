"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData, EducationItem } from "@/lib/types"

interface EducationEditorSectionProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

export function EducationEditorSection({ data, updateData }: EducationEditorSectionProps) {
  const education = data.education || []

  const addEducation = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      details: "",
    }
    updateData((prev) => ({
      ...prev,
      education: [...education, newItem],
    }))
  }

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    updateData((prev) => ({
      ...prev,
      education: education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeEducation = (id: string) => {
    updateData((prev) => ({
      ...prev,
      education: education.filter((item) => item.id !== id),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Your academic background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((item, index) => (
          <div key={item.id} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium">Education #{index + 1}</h4>
              <Button variant="ghost" size="icon" onClick={() => removeEducation(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>School</Label>
                <Input
                  value={item.school}
                  onChange={(e) => updateEducation(item.id, "school", e.target.value)}
                  placeholder="University Name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Degree</Label>
                <Input
                  value={item.degree}
                  onChange={(e) => updateEducation(item.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input
                    value={item.startDate}
                    onChange={(e) => updateEducation(item.id, "startDate", e.target.value)}
                    placeholder="Aug 2016"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input
                    value={item.endDate}
                    onChange={(e) => updateEducation(item.id, "endDate", e.target.value)}
                    placeholder="May 2020"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Details</Label>
                <Textarea
                  value={item.details}
                  onChange={(e) => updateEducation(item.id, "details", e.target.value)}
                  placeholder="GPA, honors, relevant coursework, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}

        <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  )
}
