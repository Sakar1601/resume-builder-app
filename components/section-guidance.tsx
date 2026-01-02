"use client"

import { Info, X } from "lucide-react"
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
    <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-muted-foreground/20 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 h-6 w-6"
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="flex items-start gap-2 pr-8">
        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="space-y-2 text-sm">
          <p className="font-medium text-foreground">Tips:</p>
          <ul className="space-y-1 text-muted-foreground">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {examples && examples.length > 0 && (
            <div className="pt-2 space-y-1">
              <p className="font-medium text-foreground">Examples:</p>
              <ul className="space-y-1">
                {examples.map((example, i) => (
                  <li key={i} className="text-muted-foreground italic text-xs">
                    "{example}"
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
