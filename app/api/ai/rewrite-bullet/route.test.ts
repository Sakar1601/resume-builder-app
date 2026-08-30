import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { checkRateLimitMock } = vi.hoisted(() => ({
  checkRateLimitMock: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
}))
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: checkRateLimitMock,
  getClientKey: (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
}))

import { POST } from "./route"

function makeRequest(body: Record<string, unknown>, ip: string) {
  return new Request("http://localhost/api/ai/rewrite-bullet", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  })
}

const validGroqResponse = {
  choices: [{ message: { content: "Rewrite one\nRewrite two\nRewrite three" } }],
  usage: { prompt_tokens: 40, completion_tokens: 20 },
}

describe("POST /api/ai/rewrite-bullet", () => {
  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-key"
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 })
  })

  it("rejects a bullet that's too long instead of forwarding it to the model", async () => {
    const res = await POST(makeRequest({ bullet: "x".repeat(1001), tone: "impact" }, "2.2.2.1"))
    expect(res.status).toBe(400)
  })

  it("rejects an invalid tone", async () => {
    const res = await POST(makeRequest({ bullet: "Shipped a feature", tone: "shouty" }, "2.2.2.2"))
    expect(res.status).toBe(400)
  })

  it("returns exactly 3 suggestions on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => validGroqResponse }))

    const res = await POST(makeRequest({ bullet: "Shipped a feature", tone: "impact" }, "2.2.2.3"))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.suggestions).toHaveLength(3)
  })

  it("returns 429 with a Retry-After header when the rate limiter reports blocked", async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 30 })

    const res = await POST(makeRequest({ bullet: "Shipped a feature", tone: "impact" }, "2.2.2.4"))

    expect(res.status).toBe(429)
    expect(res.headers.get("Retry-After")).toBe("30")
  })
})
