"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { ResumeSection } from "@/lib/types"

interface PersonalInfoSectionProps {
  resumeId: string
  section?: ResumeSection
  onUpdate: (section: ResumeSection) => void
}

export function PersonalInfoSection({ resumeId, section, onUpdate }: PersonalInfoSectionProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [summary, setSummary] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (section?.content) {
      setFullName(section.content.fullName || "")
      setEmail(section.content.email || "")
      setPhone(section.content.phone || "")
      setLocation(section.content.location || "")
      setSummary(section.content.summary || "")
    }
  }, [section])

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const content = {
      fullName,
      email,
      phone,
      location,
      summary,
    }

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
          section_type: "personal",
          content,
          display_order: 0,
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
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Add your contact details and professional summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            placeholder="Brief overview of your professional background and goals..."
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Personal Info"}
        </Button>
      </CardContent>
    </Card>
  )
}
