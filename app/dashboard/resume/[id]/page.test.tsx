import { describe, expect, it, vi } from "vitest"

// This test exists to catch a specific regression: the ownership filter
// (`.eq("user_id", user.id)`) getting dropped from the resume query, which
// would turn this route into an IDOR — any authenticated user could load any
// resume by guessing its id. RLS on the `resumes` table is the real backstop,
// but this asserts the application-layer check independently of the database.

const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`)
})
vi.mock("next/navigation", () => ({ redirect: redirectMock }))

function mockSupabase({ user, row }: { user: { id: string } | null; row: unknown }) {
  vi.resetModules()
  const single = vi.fn().mockResolvedValue(row ? { data: row, error: null } : { data: null, error: { message: "no rows" } })
  const eqUserId = vi.fn(() => ({ single }))
  const eqId = vi.fn(() => ({ eq: eqUserId }))
  const select = vi.fn(() => ({ eq: eqId }))
  const from = vi.fn(() => ({ select }))

  vi.doMock("@/lib/supabase/server", () => ({
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user } }) },
      from,
    }),
  }))

  return { from, select, eqId, eqUserId, single }
}

describe("ResumeEditPage authorization", () => {
  it("redirects to login when there is no authenticated user", async () => {
    mockSupabase({ user: null, row: null })
    const { default: ResumeEditPage } = await import("./page")

    await expect(ResumeEditPage({ params: Promise.resolve({ id: "resume-1" }) })).rejects.toThrow(
      "REDIRECT:/auth/login",
    )
  })

  it("filters the query by both id and the authenticated user's id", async () => {
    const { eqId, eqUserId } = mockSupabase({
      user: { id: "user-42" },
      row: { id: "resume-1", user_id: "user-42", title: "My Resume", data: {} },
    })
    const { default: ResumeEditPage } = await import("./page")

    await ResumeEditPage({ params: Promise.resolve({ id: "resume-1" }) })

    expect(eqId).toHaveBeenCalledWith("id", "resume-1")
    expect(eqUserId).toHaveBeenCalledWith("user_id", "user-42")
  })

  it("redirects to the dashboard when the row isn't found (wrong owner or missing)", async () => {
    mockSupabase({ user: { id: "user-42" }, row: null })
    const { default: ResumeEditPage } = await import("./page")

    await expect(ResumeEditPage({ params: Promise.resolve({ id: "not-mine" }) })).rejects.toThrow(
      "REDIRECT:/dashboard",
    )
  })
})
