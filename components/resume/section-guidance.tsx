"use client"

import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SectionGuidanceProps {
  tips: string[]
  examples?: string[]
}

export function SectionGuidance({ tips, examples }: SectionGuidanceProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className="relative rounded-2xl border-l-4 border-l-primary bg-accent/60 p-4 pr-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDismissed(true)}
        className="absolute right-1.5 top-1.5 size-7 rounded-full"
        aria-label="Dismiss tips"
      >
        <X className="size-3.5" />
      </Button>

      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-accent-foreground">Tips</p>
          <ul className="space-y-1 text-muted-foreground">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {examples && examples.length > 0 && (
            <div className="space-y-1 pt-2">
              <p className="text-xs font-medium text-foreground">Examples</p>
              <ul className="space-y-1">
                {examples.map((example, i) => (
                  <li key={i} className="text-xs italic text-muted-foreground">
                    &quot;{example}&quot;
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
