"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ResumeData } from "@/lib/types"
import { SectionGuidance } from "@/components/section-guidance"

interface SummarySectionProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

export function SummarySection({ data, updateData }: SummarySectionProps) {
  const summary = data.summary || ""

  const handleChange = (value: string) => {
    updateData((prev) => ({
      ...prev,
      summary: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>A brief overview of your experience and goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SectionGuidance
          tips={[
            "Keep it to 2-4 sentences (50-150 words)",
            "Highlight your most relevant experience and skills",
            "Tailor it to your target role",
            "Include years of experience and key strengths",
          ]}
          examples={[
            "Experienced software engineer with 5+ years building scalable web applications using React and Node.js.",
            "Results-driven marketing professional with expertise in digital campaigns that increased ROI by 40%.",
          ]}
        />

        <div className="grid gap-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Experienced software engineer with 5+ years of experience..."
            rows={6}
            className="leading-relaxed"
          />
          <p className="text-xs text-muted-foreground text-right">
            {summary.length} characters {summary.length < 50 && summary.length > 0 && "(aim for 50+ characters)"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
