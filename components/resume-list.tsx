"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import type { Resume } from "@/lib/types"

interface ResumeListProps {
  resumes: Resume[]
}

export function ResumeList({ resumes: initialResumes }: ResumeListProps) {
  const router = useRouter()
  const [resumes, setResumes] = useState(initialResumes)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    setDeletingId(id)
    const supabase = createClient()

    const { error } = await supabase.from("resumes").delete().eq("id", id)

    if (error) {
      alert("Failed to delete resume")
      setDeletingId(null)
      return
    }

    setResumes(resumes.filter((r) => r.id !== id))
    setDeletingId(null)
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <Card key={resume.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                  <CardDescription className="text-xs">Updated {formatDate(resume.updated_at)}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/resume/${resume.id}`} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{deletingId === resume.id ? "Deleting..." : "Delete"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground capitalize">Template: {resume.template}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/resume/${resume.id}`} className="w-full">
              <Button className="w-full bg-transparent" variant="outline">
                Edit Resume
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
