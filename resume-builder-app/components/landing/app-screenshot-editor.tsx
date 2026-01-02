"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"

export function AppScreenshotEditor() {
  return (
    <div className="w-full rounded-xl border-2 bg-background shadow-xl overflow-hidden">
      <Card className="p-6 space-y-4 border-0 rounded-none">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Work Experience #1</h3>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label className="text-xs">Company</Label>
              <Input value="Tech Company Inc." className="h-9 text-sm" readOnly />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs">Role</Label>
              <Input value="Senior Software Engineer" className="h-9 text-sm" readOnly />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-xs">Start Date</Label>
                <Input value="Jan 2021" className="h-9 text-sm" readOnly />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">End Date</Label>
                <Input value="Present" className="h-9 text-sm" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Achievements</Label>
              <Textarea
                value="Led team of 5 engineers to deliver new feature, increasing user engagement by 35%"
                rows={3}
                className="text-sm resize-none"
                readOnly
              />
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Sparkles className="mr-2 h-3 w-3" />
                Improve with AI
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Bullet Point
        </Button>
      </Card>
    </div>
  )
}
