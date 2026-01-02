"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ResumeData } from "@/lib/types"
import { SectionGuidance } from "@/components/section-guidance"

interface ContactSectionProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

export function ContactSection({ data, updateData }: ContactSectionProps) {
  const contact = data.contact || {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    location: "",
  }

  const handleChange = (field: keyof typeof contact, value: string) => {
    updateData((prev) => ({
      ...prev,
      contact: { ...contact, [field]: value },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Your personal contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SectionGuidance
          tips={[
            "Use a professional email address",
            "Include your city and state for location relevance",
            "LinkedIn and GitHub URLs boost credibility",
          ]}
        />

        <div className="grid gap-2">
          <Label htmlFor="name" className="flex items-center gap-1">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={contact.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className={!contact.name ? "border-amber-300 focus-visible:ring-amber-400" : ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="flex items-center gap-1">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={contact.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            className={!contact.email ? "border-amber-300 focus-visible:ring-amber-400" : ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="flex items-center gap-1">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            value={contact.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={!contact.phone ? "border-amber-300 focus-visible:ring-amber-400" : ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={contact.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={contact.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={contact.github}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="github.com/johndoe"
          />
        </div>
      </CardContent>
    </Card>
  )
}
