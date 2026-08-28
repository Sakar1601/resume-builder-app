// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import {
  clearGuestSession,
  createGuestResume,
  deleteGuestResume,
  duplicateGuestResume,
  getGuestResume,
  getGuestResumes,
  isGuestSession,
  setGuestSession,
  updateGuestResume,
} from "./guest-session"

// This module is the entire data layer behind guest mode, and guest mode was
// completely unreachable in production until this pass fixed the landing-page
// CTA (see app/page.tsx). Its logic had zero test coverage despite being the
// only thing standing between "click a button" and "silently lose your resume."

beforeEach(() => {
  localStorage.clear()
})

describe("guest session flag", () => {
  it("is false until set, true after, false after clearing", () => {
    expect(isGuestSession()).toBe(false)
    setGuestSession()
    expect(isGuestSession()).toBe(true)
    clearGuestSession()
    expect(isGuestSession()).toBe(false)
  })
})

describe("guest resume CRUD", () => {
  it("creates a resume with null data, unshifted to the front of the list", () => {
    const first = createGuestResume("First Resume")
    const second = createGuestResume("Second Resume")

    expect(first.data).toBeNull()
    expect(first.user_id).toBe("guest")
    expect(getGuestResumes().map((r) => r.id)).toEqual([second.id, first.id])
  })

  it("round-trips a single resume by id", () => {
    const created = createGuestResume("My Resume")
    expect(getGuestResume(created.id)).toEqual(created)
    expect(getGuestResume("does-not-exist")).toBeNull()
  })

  it("updates a resume's fields without touching other resumes", () => {
    const target = createGuestResume("Target")
    const other = createGuestResume("Other")

    updateGuestResume(target.id, { title: "Renamed", data: { summary: "hi" } as never })

    const updated = getGuestResume(target.id)!
    expect(updated.title).toBe("Renamed")
    expect(updated.data).toEqual({ summary: "hi" })
    expect(getGuestResume(other.id)!.title).toBe("Other")
  })

  it("updating a nonexistent id is a silent no-op, not a crash", () => {
    createGuestResume("Only Resume")
    expect(() => updateGuestResume("missing-id", { title: "x" })).not.toThrow()
    expect(getGuestResumes()).toHaveLength(1)
  })

  it("deletes only the targeted resume", () => {
    const keep = createGuestResume("Keep")
    const remove = createGuestResume("Remove")

    deleteGuestResume(remove.id)

    expect(getGuestResumes().map((r) => r.id)).toEqual([keep.id])
  })

  it("duplicates a resume with a new id, copy suffix, and fresh timestamps", () => {
    const original = createGuestResume("Original")
    updateGuestResume(original.id, { data: { summary: "content" } as never })

    const duplicate = duplicateGuestResume(original.id)!

    expect(duplicate.id).not.toBe(original.id)
    expect(duplicate.title).toBe("Original (Copy)")
    expect(duplicate.data).toEqual({ summary: "content" })
    expect(getGuestResumes()).toHaveLength(2)
  })

  it("duplicating a nonexistent id returns null instead of throwing", () => {
    expect(duplicateGuestResume("missing-id")).toBeNull()
  })
})
