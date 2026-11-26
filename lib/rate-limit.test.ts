import { afterEach, describe, expect, it, vi } from "vitest"

const rpcMock = vi.fn()
const createClientMock = vi.fn((..._args: unknown[]) => ({ rpc: rpcMock }))
vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => createClientMock(...args),
}))

afterEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  vi.unstubAllEnvs()
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

  it.each([
    ["service-key", "service-key"],
    ["", "anon-key"],
  ])("with service role key %j, connects using %s", async (serviceKey, expected) => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key")
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", serviceKey)
    rpcMock.mockResolvedValue({ data: [{ allowed: true, retry_after_seconds: 0 }], error: null })
    const { checkRateLimit } = await import("./rate-limit")

    await checkRateLimit("some-key", 10)

    expect(createClientMock.mock.calls[0][1]).toBe(expected)
  })
})
