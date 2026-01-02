"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles } from "lucide-react"
import type { ResumeData, ExperienceItem } from "@/lib/types"
import { BulletRewriterModal } from "@/components/bullet-rewriter-modal"
import { useState } from "react"
import { SectionGuidance } from "@/components/section-guidance"

interface ExperienceEditorSectionProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

export function ExperienceEditorSection({ data, updateData }: ExperienceEditorSectionProps) {
  const experience = data.experience || []
  const [rewriterModal, setRewriterModal] = useState<{
    open: boolean
    experienceId: string
    bulletIndex: number
    bullet: string
  }>({
    open: false,
    experienceId: "",
    bulletIndex: -1,
    bullet: "",
  })

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    }
    updateData((prev) => ({
      ...prev,
      experience: [...experience, newItem],
    }))
  }

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    updateData((prev) => ({
      ...prev,
      experience: experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeExperience = (id: string) => {
    updateData((prev) => ({
      ...prev,
      experience: experience.filter((item) => item.id !== id),
    }))
  }

  const moveExperience = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= experience.length) return

    const newExperience = [...experience]
    ;[newExperience[index], newExperience[newIndex]] = [newExperience[newIndex], newExperience[index]]

    updateData((prev) => ({
      ...prev,
      experience: newExperience,
    }))
  }

  const updateBullet = (id: string, bulletIndex: number, value: string) => {
    const item = experience.find((e) => e.id === id)
    if (!item) return

    const newBullets = [...item.bullets]
    newBullets[bulletIndex] = value
    updateExperience(id, "bullets", newBullets)
  }

  const addBullet = (id: string) => {
    const item = experience.find((e) => e.id === id)
    if (!item) return

    updateExperience(id, "bullets", [...item.bullets, ""])
  }

  const removeBullet = (id: string, bulletIndex: number) => {
    const item = experience.find((e) => e.id === id)
    if (!item || item.bullets.length <= 1) return

    updateExperience(
      id,
      "bullets",
      item.bullets.filter((_, i) => i !== bulletIndex),
    )
  }

  const openRewriter = (experienceId: string, bulletIndex: number, bullet: string) => {
    setRewriterModal({
      open: true,
      experienceId,
      bulletIndex,
      bullet,
    })
  }

  const handleBulletSelect = (rewrittenBullet: string) => {
    updateBullet(rewriterModal.experienceId, rewriterModal.bulletIndex, rewrittenBullet)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>Your professional work history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SectionGuidance
            tips={[
              "Start each bullet with a strong action verb (Led, Built, Improved, Achieved)",
              "Include quantifiable results when possible (increased by 40%, saved 10 hours/week)",
              "Focus on impact and results, not just responsibilities",
              "List 3-5 bullets per position",
            ]}
            examples={[
              "Led team of 5 engineers to deliver new feature, increasing user engagement by 35%",
              "Optimized database queries reducing page load time from 3s to 800ms",
            ]}
          />

          {experience.map((item, index) => (
            <div
              key={item.id}
              className="space-y-3 p-4 border rounded-lg bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveExperience(index, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveExperience(index, "down")}
                    disabled={index === experience.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeExperience(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label>Company</Label>
                  <Input
                    value={item.company}
                    onChange={(e) => updateExperience(item.id, "company", e.target.value)}
                    placeholder="Company Name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Input
                    value={item.role}
                    onChange={(e) => updateExperience(item.id, "role", e.target.value)}
                    placeholder="Job Title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input
                    value={item.location}
                    onChange={(e) => updateExperience(item.id, "location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Input
                      value={item.startDate}
                      onChange={(e) => updateExperience(item.id, "startDate", e.target.value)}
                      placeholder="Jan 2020"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <Input
                      value={item.endDate}
                      onChange={(e) => updateExperience(item.id, "endDate", e.target.value)}
                      placeholder="Present"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Responsibilities & Achievements</Label>
                  {item.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="space-y-2">
                      <div className="flex gap-2">
                        <Textarea
                          value={bullet}
                          onChange={(e) => updateBullet(item.id, bulletIndex, e.target.value)}
                          placeholder="Led development of... • Achieved X% improvement in... • Built feature that..."
                          rows={3}
                          className="flex-1 leading-relaxed"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBullet(item.id, bulletIndex)}
                          disabled={item.bullets.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {bullet.trim() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRewriter(item.id, bulletIndex, bullet)}
                          className="w-full"
                        >
                          <Sparkles className="mr-2 h-3 w-3" />
                          Improve with AI
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button onClick={() => addBullet(item.id)} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bullet Point
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      <BulletRewriterModal
        open={rewriterModal.open}
        onOpenChange={(open) => setRewriterModal((prev) => ({ ...prev, open }))}
        originalBullet={rewriterModal.bullet}
        onSelect={handleBulletSelect}
      />
    </>
  )
}
