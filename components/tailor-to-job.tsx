"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, Loader2 } from "lucide-react"
import type { ResumeData } from "@/lib/types"

interface TailorToJobProps {
  data: ResumeData
  updateData: (updater: (prev: ResumeData) => ResumeData) => void
}

interface BulletSuggestion {
  section: "experience" | "projects"
  itemIndex: number
  bulletIndex: number
  suggestions: string[]
}

interface TailorResults {
  missing_keywords: string[]
  summary_suggestion: string
  bullet_suggestions: BulletSuggestion[]
}

export function TailorToJob({ data, updateData }: TailorToJobProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<TailorResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set())

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults(null)
    setAppliedSuggestions(new Set())

    try {
      const response = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeData: data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze job description")
      }

      const tailorResults = await response.json()
      setResults(tailorResults)
    } catch (err) {
      console.error("[v0] Tailor error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze job description")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applySummarySuggestion = () => {
    if (!results?.summary_suggestion) return

    updateData((prev) => ({
      ...prev,
      summary: results.summary_suggestion,
    }))

    setAppliedSuggestions((prev) => new Set(prev).add("summary"))
  }

  const applyBulletSuggestion = (suggestion: BulletSuggestion, selectedOption: string) => {
    updateData((prev) => {
      const newData = { ...prev }

      if (suggestion.section === "experience") {
        const experience = [...(newData.experience || [])]
        if (experience[suggestion.itemIndex]) {
          const item = { ...experience[suggestion.itemIndex] }
          const bullets = [...item.bullets]
          bullets[suggestion.bulletIndex] = selectedOption
          item.bullets = bullets
          experience[suggestion.itemIndex] = item
          newData.experience = experience
        }
      } else if (suggestion.section === "projects") {
        const projects = [...(newData.projects || [])]
        if (projects[suggestion.itemIndex]) {
          const item = { ...projects[suggestion.itemIndex] }
          const bullets = [...item.bullets]
          bullets[suggestion.bulletIndex] = selectedOption
          item.bullets = bullets
          projects[suggestion.itemIndex] = item
          newData.projects = projects
        }
      }

      return newData
    })

    const key = `${suggestion.section}-${suggestion.itemIndex}-${suggestion.bulletIndex}`
    setAppliedSuggestions((prev) => new Set(prev).add(key))
  }

  const getItemTitle = (section: "experience" | "projects", index: number) => {
    if (section === "experience") {
      const item = data.experience?.[index]
      return item ? `${item.role} at ${item.company}` : `Experience ${index + 1}`
    } else {
      const item = data.projects?.[index]
      return item?.name || `Project ${index + 1}`
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Tailor to Job Description
          </CardTitle>
          <CardDescription>
            Paste a job description to get AI-powered suggestions for optimizing your resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            className="resize-none"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !jobDescription.trim()} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze & Get Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Missing Keywords */}
          {results.missing_keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Missing Keywords</CardTitle>
                <CardDescription>Consider incorporating these keywords from the job description</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.missing_keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Suggestion */}
          {results.summary_suggestion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary Suggestion</CardTitle>
                <CardDescription>Tailored professional summary for this role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{results.summary_suggestion}</p>
                </div>
                <Button
                  onClick={applySummarySuggestion}
                  disabled={appliedSuggestions.has("summary")}
                  variant={appliedSuggestions.has("summary") ? "secondary" : "default"}
                  className="w-full"
                >
                  {appliedSuggestions.has("summary") ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    "Apply to Summary"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Bullet Suggestions */}
          {results.bullet_suggestions.map((suggestion, idx) => {
            const key = `${suggestion.section}-${suggestion.itemIndex}-${suggestion.bulletIndex}`
            const isApplied = appliedSuggestions.has(key)
            const itemTitle = getItemTitle(suggestion.section, suggestion.itemIndex)

            return (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {itemTitle} - Bullet {suggestion.bulletIndex + 1}
                  </CardTitle>
                  <CardDescription>Choose a suggestion to replace the current bullet point</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestion.suggestions.map((option, optionIdx) => (
                    <div key={optionIdx} className="space-y-2">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">{option}</p>
                      </div>
                      <Button
                        onClick={() => applyBulletSuggestion(suggestion, option)}
                        disabled={isApplied}
                        variant={isApplied ? "secondary" : "outline"}
                        size="sm"
                        className="w-full"
                      >
                        {isApplied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Applied
                          </>
                        ) : (
                          "Apply This Suggestion"
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
