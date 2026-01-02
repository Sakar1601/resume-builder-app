"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createGuestResume } from "@/lib/guest-session"

interface CreateResumeDialogProps {
  isGuest?: boolean
}

export function CreateResumeDialog({ isGuest = false }: CreateResumeDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [template, setTemplate] = useState("modern")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!title.trim()) return

    setIsLoading(true)

    // Guest mode: create resume in localStorage
    if (isGuest) {
      const resume = createGuestResume(title.trim())
      setOpen(false)
      setTitle("")
      setIsLoading(false)
      router.push(`/guest/resume/${resume.id}`)
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event("guest-resumes-updated"))
      return
    }

    // Regular mode: create resume in database
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: title.trim(),
        template,
      })
      .select()
      .single()

    if (error) {
      alert("Failed to create resume")
      setIsLoading(false)
      return
    }

    setOpen(false)
    setTitle("")
    setIsLoading(false)
    router.push(`/dashboard/resume/${data.id}`)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Resume
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>Give your resume a name to get started</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleCreate()
                }
              }}
            />
          </div>
          {!isGuest && (
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <select
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading || !title.trim()}>
            {isLoading ? "Creating..." : "Create Resume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
