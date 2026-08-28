import { describe, expect, it } from "vitest"
import { checkRateLimit } from "@/lib/rate-limit"

describe("checkRateLimit", () => {
  it("allows requests up to the limit, then blocks the next one", () => {
    const key = `test-${crypto.randomUUID()}`

    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 3).allowed).toBe(true)
    }

    const blocked = checkRateLimit(key, 3)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("tracks separate keys independently", () => {
    const keyA = `test-${crypto.randomUUID()}`
    const keyB = `test-${crypto.randomUUID()}`

    checkRateLimit(keyA, 1)
    const blockedA = checkRateLimit(keyA, 1)
    const allowedB = checkRateLimit(keyB, 1)

    expect(blockedA.allowed).toBe(false)
    expect(allowedB.allowed).toBe(true)
  })
})
