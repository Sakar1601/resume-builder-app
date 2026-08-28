// In-memory, per-instance sliding-window limiter. Guest mode has no session to key on,
// so this keys by client IP rather than requiring auth. Note: on serverless platforms
// (Vercel) each instance holds its own counters, so this caps abuse per-instance, not
// globally — a determined attacker spread across instances isn't fully stopped. That's
// an acceptable tradeoff for a portfolio project; a production deployment with real
// traffic should move this to Upstash Redis or similar shared store.

interface Bucket {
  count: number
  windowStart: number
}

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 60_000

// Periodically drop stale buckets so the map doesn't grow unbounded over the life
// of a warm serverless instance.
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(key)
  }
}, WINDOW_MS).unref?.()

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

export function checkRateLimit(key: string, limit: number): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (bucket.count >= limit) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - bucket.windowStart)) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  bucket.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}
