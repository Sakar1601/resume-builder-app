"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ResumeData } from "@/lib/types"

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
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Experienced software engineer with 5+ years of experience..."
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  )
}
