"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Sparkles, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BulletRewriterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalBullet: string
  onSelect: (rewrittenBullet: string) => void
}

type Tone = "impact" | "concise" | "technical"

export function BulletRewriterModal({ open, onOpenChange, originalBullet, onSelect }: BulletRewriterModalProps) {
  const [bullet, setBullet] = useState(originalBullet)
  const [tone, setTone] = useState<Tone>("impact")
  const [targetRole, setTargetRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!bullet.trim()) {
      toast({
        title: "Error",
        description: "Please enter a bullet point to improve",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSuggestions([])
    setSelectedIndex(null)

    try {
      const response = await fetch("/api/ai/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: bullet.trim(),
          tone,
          targetRole: targetRole.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate suggestions")
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate suggestions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = () => {
    if (selectedIndex !== null && suggestions[selectedIndex]) {
      onSelect(suggestions[selectedIndex])
      onOpenChange(false)
      // Reset state
      setSuggestions([])
      setSelectedIndex(null)
      setTargetRole("")
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setBullet(originalBullet)
      setSuggestions([])
      setSelectedIndex(null)
      setTargetRole("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Improve Bullet Point
          </DialogTitle>
          <DialogDescription>Use AI to rewrite your bullet point with different tones and styles</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="bullet-input">Original Bullet Point</Label>
            <Textarea
              id="bullet-input"
              value={bullet}
              onChange={(e) => setBullet(e.target.value)}
              placeholder="Enter your bullet point here..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <RadioGroup value={tone} onValueChange={(value) => setTone(value as Tone)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="impact" id="impact" />
                <Label htmlFor="impact" className="font-normal cursor-pointer">
                  More Impact - Emphasize achievements and results
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concise" id="concise" />
                <Label htmlFor="concise" className="font-normal cursor-pointer">
                  More Concise - Shorter and to the point
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical" id="technical" />
                <Label htmlFor="technical" className="font-normal cursor-pointer">
                  More Technical - Highlight technical skills and tools
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-role">Target Role (Optional)</Label>
            <Input
              id="target-role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Software Engineer, Product Manager"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading || !bullet.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Suggestions
              </>
            )}
          </Button>

          {suggestions.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <Label>Select an Option</Label>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedIndex === index
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedIndex === index ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedIndex === index && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <p className="text-sm flex-1">{suggestion}</p>
                  </div>
                </div>
              ))}

              <Button onClick={handleSelect} disabled={selectedIndex === null} className="w-full" size="lg">
                Use Selected Bullet
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
