"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2, Check } from "lucide-react"

export function AppScreenshotAI() {
  return (
    <div className="w-full rounded-xl border-2 bg-background shadow-xl overflow-hidden">
      <div className="bg-card/50 backdrop-blur-sm p-4 border-b">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Bullet Improvement</h3>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Original</Label>
          <div className="p-3 rounded-lg bg-muted/50 text-sm">Worked on improving the application performance</div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">AI Suggestions</Label>
          <div className="space-y-2">
            <Card className="p-3 border-2 border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm">
                  Optimized application performance by identifying bottlenecks and implementing caching strategies,
                  reducing load time by 40%
                </p>
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              </div>
            </Card>
            <Card className="p-3 hover:border-primary/30 cursor-pointer transition-colors">
              <p className="text-sm">
                Enhanced system efficiency through performance optimization, achieving measurable improvements in
                response times
              </p>
            </Card>
            <Card className="p-3 hover:border-primary/30 cursor-pointer transition-colors">
              <p className="text-sm">
                Led performance improvement initiative resulting in faster page loads and improved user experience
                metrics
              </p>
            </Card>
          </div>
        </div>

        <Button className="w-full">Apply Selected</Button>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
