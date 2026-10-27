"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import type { ResumeData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ReadinessChecklistProps {
  data: ResumeData
}

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ResumeReadinessChecklist({ data }: ReadinessChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
  const nextStep = checks.find((c) => !c.passed)

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-secondary/50"
      >
        <div className="relative size-12 shrink-0">
          <svg viewBox="0 0 48 48" className="size-full -rotate-90">
            <circle cx="24" cy="24" r={RADIUS} fill="none" strokeWidth="4" className="stroke-border" />
            <circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className="stroke-primary transition-all duration-700 ease-out"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percentage / 100)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold">{percentage}%</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Resume readiness</p>
          <p className="truncate text-xs text-muted-foreground">
            {nextStep ? `Next: ${nextStep.label.toLowerCase()}` : "Everything looks ready to send"}
          </p>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")} />
      </button>

      {isExpanded && (
        <ul className="grid gap-2 border-t p-4 sm:grid-cols-2">
          {checks.map((check) => (
            <li key={check.id} className="flex items-center gap-2.5 text-sm">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  check.passed ? "bg-primary text-primary-foreground" : "border border-dashed border-muted-foreground/60",
                )}
              >
                {check.passed && <Check className="size-3" strokeWidth={3.5} />}
              </span>
              <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
