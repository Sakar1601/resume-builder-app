"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData, SkillCategory } from "@/lib/types"

interface SkillsEditorSectionProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

export function SkillsEditorSection({ data, updateData }: SkillsEditorSectionProps) {
  const skills = data.skills || []

  const addCategory = () => {
    const newCategory: SkillCategory = {
      id: crypto.randomUUID(),
      category: "",
      skills: "",
    }
    updateData((prev) => ({
      ...prev,
      skills: [...skills, newCategory],
    }))
  }

  const updateCategory = (id: string, field: keyof SkillCategory, value: string) => {
    updateData((prev) => ({
      ...prev,
      skills: skills.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)),
    }))
  }

  const removeCategory = (id: string) => {
    updateData((prev) => ({
      ...prev,
      skills: skills.filter((cat) => cat.id !== id),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Organize your skills by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((category) => (
          <div key={category.id} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input
                    value={category.category}
                    onChange={(e) => updateCategory(category.id, "category", e.target.value)}
                    placeholder="e.g., Programming Languages"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Skills (comma-separated)</Label>
                  <Input
                    value={category.skills}
                    onChange={(e) => updateCategory(category.id, "skills", e.target.value)}
                    placeholder="e.g., JavaScript, TypeScript, Python"
                  />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCategory(category.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={addCategory} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </CardContent>
    </Card>
  )
}
