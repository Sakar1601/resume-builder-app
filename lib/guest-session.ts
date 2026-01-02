"use client"

import type { ResumeData } from "./types"

const GUEST_SESSION_KEY = "guest_session"
const GUEST_RESUMES_KEY = "guest_resumes"

export interface GuestResume {
  id: string
  title: string
  data: ResumeData | null
  created_at: string
  updated_at: string
  user_id: string
}

export function setGuestSession() {
  if (typeof window === "undefined") return
  localStorage.setItem(GUEST_SESSION_KEY, "true")
}

export function isGuestSession(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(GUEST_SESSION_KEY) === "true"
}

export function clearGuestSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(GUEST_SESSION_KEY)
}

export function getGuestResumes(): GuestResume[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(GUEST_RESUMES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveGuestResumes(resumes: GuestResume[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes))
}

export function createGuestResume(title: string): GuestResume {
  const resume: GuestResume = {
    id: crypto.randomUUID(),
    title,
    data: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "guest",
  }

  const resumes = getGuestResumes()
  resumes.unshift(resume)
  saveGuestResumes(resumes)

  return resume
}

export function getGuestResume(id: string): GuestResume | null {
  const resumes = getGuestResumes()
  return resumes.find((r) => r.id === id) || null
}

export function updateGuestResume(id: string, updates: Partial<GuestResume>) {
  const resumes = getGuestResumes()
  const index = resumes.findIndex((r) => r.id === id)

  if (index !== -1) {
    resumes[index] = {
      ...resumes[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    saveGuestResumes(resumes)
  }
}

export function deleteGuestResume(id: string) {
  const resumes = getGuestResumes()
  const filtered = resumes.filter((r) => r.id !== id)
  saveGuestResumes(filtered)
}

export function duplicateGuestResume(id: string): GuestResume | null {
  const resume = getGuestResume(id)
  if (!resume) return null

  const duplicate: GuestResume = {
    ...resume,
    id: crypto.randomUUID(),
    title: `${resume.title} (Copy)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const resumes = getGuestResumes()
  resumes.unshift(duplicate)
  saveGuestResumes(resumes)

  return duplicate
}
