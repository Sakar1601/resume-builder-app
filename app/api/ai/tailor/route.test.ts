import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { checkRateLimitMock } = vi.hoisted(() => ({
  checkRateLimitMock: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
}))
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: checkRateLimitMock,
  getClientKey: (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
}))

import { POST } from "./route"

const validResumeData = {
  contact: { name: "Jane Doe", email: "jane@example.com" },
  summary: "Engineer",
  experience: [{ role: "Engineer", company: "Acme", startDate: "2020", endDate: "2023", bullets: ["Did things"] }],
}

function makeRequest(body: Record<string, unknown>, ip: string) {
  return new Request("http://localhost/api/ai/tailor", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  })
}

const validGroqResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          missing_keywords: ["kubernetes"],
          summary_suggestion: "Engineer with cloud experience.",
          bullet_suggestions: [
            { section: "experience", itemIndex: 0, bulletIndex: 0, suggestions: ["A", "B", "C"] },
          ],
        }),
      },
    },
  ],
  usage: { prompt_tokens: 100, completion_tokens: 50 },
}

describe("POST /api/ai/tailor", () => {
  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-key"
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 })
  })

  it("returns 400 when the job description is missing", async () => {
    const res = await POST(makeRequest({ jobDescription: "", resumeData: validResumeData }, "1.1.1.1"))
    expect(res.status).toBe(400)
  })

  it("returns 400 when the job description exceeds the max length", async () => {
    const res = await POST(
      makeRequest({ jobDescription: "x".repeat(8001), resumeData: validResumeData }, "1.1.1.2"),
    )
    expect(res.status).toBe(400)
  })

  it("validates output against the schema and returns it on the first successful attempt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => validGroqResponse }),
    )

    const res = await POST(makeRequest({ jobDescription: "We need a backend engineer.", resumeData: validResumeData }, "1.1.1.3"))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.missing_keywords).toEqual(["kubernetes"])
    expect(body.bullet_suggestions).toHaveLength(1)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("retries once on malformed output and succeeds on the second attempt", async () => {
    const malformedResponse = { ok: true, json: async () => ({ choices: [{ message: { content: "not json" } }] }) }
    const goodResponse = { ok: true, json: async () => validGroqResponse }

    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(malformedResponse).mockResolvedValueOnce(goodResponse))

    const res = await POST(makeRequest({ jobDescription: "We need a backend engineer.", resumeData: validResumeData }, "1.1.1.4"))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.missing_keywords).toEqual(["kubernetes"])
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("gives up after two malformed responses and returns a 500", async () => {
    const malformedResponse = { ok: true, json: async () => ({ choices: [{ message: { content: "not json" } }] }) }
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(malformedResponse))

    const res = await POST(makeRequest({ jobDescription: "We need a backend engineer.", resumeData: validResumeData }, "1.1.1.5"))

    expect(res.status).toBe(500)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("returns 429 with a Retry-After header when the rate limiter reports blocked", async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 15 })

    const res = await POST(
      makeRequest({ jobDescription: "We need a backend engineer.", resumeData: validResumeData }, "1.1.1.6"),
    )

    expect(res.status).toBe(429)
    expect(res.headers.get("Retry-After")).toBe("15")
  })
})
