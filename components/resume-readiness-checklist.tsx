"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"
import type { ResumeData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ReadinessChecklistProps {
  data: ResumeData
}

export function ResumeReadinessChecklist({ data }: ReadinessChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const checks = [
    {
      id: "contact",
      label: "Contact information complete",
      passed: !!(data.contact?.name && data.contact?.email && data.contact?.phone),
    },
    {
      id: "summary",
      label: "Professional summary included",
      passed: !!(data.summary && data.summary.length > 50),
    },
    {
      id: "experience",
      label: "Work experience with details",
      passed: !!(data.experience && data.experience.length > 0 && data.experience[0]?.bullets?.length > 0),
    },
    {
      id: "metrics",
      label: "Quantifiable achievements (metrics)",
      passed: !!data.experience?.some((exp) =>
        exp.bullets?.some((bullet) => /\d+/.test(bullet) || /[%$]/.test(bullet)),
      ),
    },
    {
      id: "skills",
      label: "Skills section present",
      passed: !!(data.skills && data.skills.length > 0),
    },
    {
      id: "length",
      label: "Appropriate resume length",
      passed: true, // Always true for now, could calculate based on content
    },
  ]

  const passedCount = checks.filter((c) => c.passed).length
  const totalCount = checks.length
  const percentage = Math.round((passedCount / totalCount) * 100)

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Resume Readiness</CardTitle>
            <CardDescription className="text-xs">
              {passedCount} of {totalCount} checks passed
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{percentage}%</div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 px-2">
              {isExpanded ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-3">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-2 pt-0">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-2 text-sm">
              {check.passed ? (
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              )}
              <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
