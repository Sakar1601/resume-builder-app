"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, MoreVertical, Pencil, Trash2, Copy, Search, FileX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useMemo } from "react"
import type { Resume } from "@/lib/types"
import { deleteGuestResume, duplicateGuestResume, type GuestResume } from "@/lib/guest-session"

interface ResumeListProps {
  resumes: Resume[] | GuestResume[]
  isGuest?: boolean
}

export function ResumeList({ resumes: initialResumes, isGuest = false }: ResumeListProps) {
  const router = useRouter()
  const [resumes, setResumes] = useState(initialResumes)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"updated" | "name">("updated")

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    setDeletingId(id)

    if (isGuest) {
      deleteGuestResume(id)
      setResumes(resumes.filter((r) => r.id !== id))
      setDeletingId(null)
      window.dispatchEvent(new Event("guest-resumes-updated"))
      return
    }

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

  const handleDuplicate = async (resume: Resume | GuestResume) => {
    if (!confirm(`Duplicate "${resume.title}"?`)) return

    setDuplicatingId(resume.id)

    if (isGuest) {
      const duplicate = duplicateGuestResume(resume.id)
      if (duplicate) {
        setResumes([duplicate, ...resumes])
        window.dispatchEvent(new Event("guest-resumes-updated"))
      }
      setDuplicatingId(null)
      return
    }

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setDuplicatingId(null)
      return
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: `${resume.title} (Copy)`,
        template: (resume as Resume).template,
        data: resume.data,
      })
      .select()
      .single()

    if (error) {
      alert("Failed to duplicate resume")
      setDuplicatingId(null)
      return
    }

    setResumes([data, ...resumes])
    setDuplicatingId(null)
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredAndSortedResumes = useMemo(() => {
    let filtered = resumes

    if (searchQuery.trim()) {
      filtered = filtered.filter((resume) => resume.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "updated") {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })

    return sorted
  }, [resumes, searchQuery, sortBy])

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No resumes yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start building your professional resume today. Click the button above to create your first resume.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "updated" | "name") => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedResumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileX className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No resumes found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedResumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col hover:shadow-lg transition-shadow">
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
                        <Link
                          href={isGuest ? `/guest/resume/${resume.id}` : `/dashboard/resume/${resume.id}`}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(resume)} disabled={duplicatingId === resume.id}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>{duplicatingId === resume.id ? "Duplicating..." : "Duplicate"}</span>
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
                {!isGuest && (resume as Resume).template && (
                  <p className="text-sm text-muted-foreground capitalize">Template: {(resume as Resume).template}</p>
                )}
                {isGuest && <p className="text-sm text-muted-foreground">Local session resume</p>}
              </CardContent>
              <CardFooter>
                <Link
                  href={isGuest ? `/guest/resume/${resume.id}` : `/dashboard/resume/${resume.id}`}
                  className="w-full"
                >
                  <Button className="w-full bg-transparent hover:bg-primary/10" variant="outline">
                    Edit Resume
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
