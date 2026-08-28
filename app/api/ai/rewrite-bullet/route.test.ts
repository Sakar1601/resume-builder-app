import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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

  it("rate-limits after 10 requests from the same client within the window", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => validGroqResponse }))
    const ip = "2.2.2.4"

    let last
    for (let i = 0; i < 11; i++) {
      last = await POST(makeRequest({ bullet: "Shipped a feature", tone: "impact" }, ip))
    }

    expect(last!.status).toBe(429)
  })
})
