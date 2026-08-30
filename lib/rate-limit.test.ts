import { afterEach, describe, expect, it, vi } from "vitest"

const rpcMock = vi.fn()
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ rpc: rpcMock }),
}))

afterEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe("checkRateLimit", () => {
  it("allows the request when the RPC reports allowed: true", async () => {
    rpcMock.mockResolvedValue({ data: [{ allowed: true, retry_after_seconds: 0 }], error: null })
    const { checkRateLimit } = await import("./rate-limit")

    const result = await checkRateLimit("some-key", 10)

    expect(result).toEqual({ allowed: true, retryAfterSeconds: 0 })
  })

  it("blocks the request and surfaces retry_after_seconds when the RPC reports allowed: false", async () => {
    rpcMock.mockResolvedValue({ data: [{ allowed: false, retry_after_seconds: 42 }], error: null })
    const { checkRateLimit } = await import("./rate-limit")

    const result = await checkRateLimit("some-key", 10)

    expect(result).toEqual({ allowed: false, retryAfterSeconds: 42 })
  })

  it("fails open (allows the request) when the RPC call errors", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "connection reset" } })
    const { checkRateLimit } = await import("./rate-limit")

    const result = await checkRateLimit("some-key", 10)

    expect(result.allowed).toBe(true)
  })
})
