"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"

export function AppScreenshotTailor() {
  return (
    <div className="w-full rounded-xl border-2 bg-background shadow-xl overflow-hidden">
      <div className="bg-card/50 backdrop-blur-sm p-4 border-b">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Tailor to Job Description</h3>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <Label className="text-xs font-medium mb-2 block">Missing Keywords</Label>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "API Design", "Agile"].map((keyword) => (
              <span
                key={keyword}
                className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium mb-2 block">Suggested Improvements</Label>
          <div className="space-y-3">
            <Card className="p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm">
                    Add mention of React and TypeScript expertise to align with job requirements
                  </p>
                </div>
                <Button size="sm" variant="outline" className="ml-2 h-7 text-xs bg-transparent">
                  Apply
                </Button>
              </div>
            </Card>

            <Card className="p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Experience • Bullet #2</p>
                  <p className="text-sm">
                    Highlight API design experience: "Designed and implemented RESTful APIs serving 1M+ requests/day"
                  </p>
                </div>
                <Button size="sm" variant="outline" className="ml-2 h-7 text-xs bg-transparent">
                  Apply
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
