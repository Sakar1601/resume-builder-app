"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles } from "lucide-react"
import type { ResumeData, ProjectItem } from "@/lib/types"
import { BulletRewriterModal } from "@/components/bullet-rewriter-modal"
import { useState } from "react"
import { SectionGuidance } from "@/components/section-guidance"

interface ProjectsSectionProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

export function ProjectsSection({ data, updateData }: ProjectsSectionProps) {
  const projects = data.projects || []
  const [rewriterModal, setRewriterModal] = useState<{
    open: boolean
    projectId: string
    bulletIndex: number
    bullet: string
  }>({
    open: false,
    projectId: "",
    bulletIndex: -1,
    bullet: "",
  })

  const addProject = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: "",
      link: "",
      techStack: "",
      bullets: [""],
    }
    updateData((prev) => ({
      ...prev,
      projects: [...projects, newItem],
    }))
  }

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    updateData((prev) => ({
      ...prev,
      projects: projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeProject = (id: string) => {
    updateData((prev) => ({
      ...prev,
      projects: projects.filter((item) => item.id !== id),
    }))
  }

  const moveProject = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= projects.length) return

    const newProjects = [...projects]
    ;[newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]]

    updateData((prev) => ({
      ...prev,
      projects: newProjects,
    }))
  }

  const updateBullet = (id: string, bulletIndex: number, value: string) => {
    const item = projects.find((p) => p.id === id)
    if (!item) return

    const newBullets = [...item.bullets]
    newBullets[bulletIndex] = value
    updateProject(id, "bullets", newBullets)
  }

  const addBullet = (id: string) => {
    const item = projects.find((p) => p.id === id)
    if (!item) return

    updateProject(id, "bullets", [...item.bullets, ""])
  }

  const removeBullet = (id: string, bulletIndex: number) => {
    const item = projects.find((p) => p.id === id)
    if (!item || item.bullets.length <= 1) return

    updateProject(
      id,
      "bullets",
      item.bullets.filter((_, i) => i !== bulletIndex),
    )
  }

  const openRewriter = (projectId: string, bulletIndex: number, bullet: string) => {
    setRewriterModal({
      open: true,
      projectId,
      bulletIndex,
      bullet,
    })
  }

  const handleBulletSelect = (rewrittenBullet: string) => {
    updateBullet(rewriterModal.projectId, rewriterModal.bulletIndex, rewrittenBullet)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Showcase your personal or professional projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SectionGuidance
            tips={[
              "Include projects that demonstrate relevant skills",
              "Mention the tech stack used",
              "Highlight user impact or business value",
              "Add links to live demos or GitHub repos",
            ]}
            examples={[
              "Built full-stack e-commerce platform serving 10K+ users with 99.9% uptime",
              "Developed Chrome extension with 500+ active users and 4.8-star rating",
            ]}
          />

          {projects.map((item, index) => (
            <div
              key={item.id}
              className="space-y-3 p-4 border rounded-lg bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium">Project #{index + 1}</h4>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => moveProject(index, "up")} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveProject(index, "down")}
                    disabled={index === projects.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeProject(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label>Project Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateProject(item.id, "name", e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Link</Label>
                  <Input
                    value={item.link}
                    onChange={(e) => updateProject(item.id, "link", e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Tech Stack</Label>
                  <Input
                    value={item.techStack}
                    onChange={(e) => updateProject(item.id, "techStack", e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description & Impact</Label>
                  {item.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="space-y-2">
                      <div className="flex gap-2">
                        <Textarea
                          value={bullet}
                          onChange={(e) => updateBullet(item.id, bulletIndex, e.target.value)}
                          placeholder="Describe what the project does and the impact it created..."
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

          <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
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
