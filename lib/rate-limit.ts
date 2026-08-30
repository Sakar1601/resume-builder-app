import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Lazily instantiated, not a module-level constant: Next.js evaluates route
// modules to collect page data at *build* time, before any env vars are
// necessarily available (e.g. a CI build step that doesn't need Supabase
// creds for anything else). A module-level createClient() call crashed the
// build for exactly this reason. Creating it on first use avoids that
// coupling entirely.
let supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabase
}

// Fails open: if the RPC call itself errors (network blip, DB hiccup), we log
// and allow the request rather than taking the whole AI feature down over a
// transient Supabase issue. The tradeoff is a brief window with no cap during
// an outage -- acceptable for a portfolio-scale app; revisit if traffic grows.

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds = 60,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const { data, error } = await getSupabase().rpc("check_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  })

  if (error) {
    console.error("Rate limit check failed, failing open:", error.message)
    return { allowed: true, retryAfterSeconds: 0 }
  }

  const row = data?.[0]
  return { allowed: row?.allowed ?? true, retryAfterSeconds: row?.retry_after_seconds ?? 0 }
}
