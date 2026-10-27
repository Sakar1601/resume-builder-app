"use client"

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
import { AnimatePresence, motion } from "framer-motion"
import { ResumePreview } from "@/components/resume/resume-preview"
import { FileText, MoreVertical, Pencil, Trash2, Copy, Search, FileX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import type { Resume } from "@/lib/types"
import { deleteGuestResume, duplicateGuestResume, type GuestResume } from "@/lib/guest-session"

interface ResumeListProps {
  resumes: Resume[] | GuestResume[]
  isGuest?: boolean
}

export function ResumeList({ resumes: initialResumes, isGuest = false }: ResumeListProps) {
  const router = useRouter()
  const [resumes, setResumes] = useState<(Resume | GuestResume)[]>(initialResumes)
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
      toast.error("Failed to delete resume")
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
        data: (resume as Resume).data,
      })
      .select()
      .single()

    if (error) {
      toast.error("Failed to duplicate resume")
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
      <div className="bg-dots relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed px-4 py-24 text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lift">
          <FileText className="size-10" />
        </div>
        <h2 className="mt-6 text-4xl">No resumes yet</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Create your first resume with the button above. You&apos;ll get a live preview, AI rewrites and one-click PDF export.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileX className="mb-3 size-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No resumes found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
        </div>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedResumes.map((resume) => {
              const href = isGuest ? `/guest/resume/${resume.id}` : `/dashboard/resume/${resume.id}`
              return (
                <motion.div
                  key={resume.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <Link href={href} className="relative block h-48 overflow-hidden bg-secondary" aria-label={`Edit ${resume.title}`}>
                    <div
                      className="pointer-events-none absolute left-1/2 top-5 w-[600px] origin-top -translate-x-1/2 scale-[0.42] rounded-md shadow-xl ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-[0.45]"
                      aria-hidden="true"
                    >
                      <ResumePreview data={resume.data ?? {}} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                  </Link>

                  <div className="flex items-start justify-between gap-2 p-4">
                    <Link href={href} className="min-w-0">
                      <h3 className="truncate font-sans text-base font-semibold group-hover:text-primary">{resume.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">Updated {formatDate(resume.updated_at)}</p>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={href} className="cursor-pointer">
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
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
