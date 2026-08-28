// Lightweight structured logging for AI calls: token usage, latency, and outcome.
// No external observability service is wired up yet, so this logs structured JSON
// to stdout — enough to grep/aggregate from Vercel's log drain, and a clear seam
// to swap in a real sink (Axiom, Datadog, etc.) later without touching call sites.

interface AICallLog {
  route: string
  model: string
  latencyMs: number
  promptTokens?: number
  completionTokens?: number
  outcome: "success" | "malformed_output" | "retry_success" | "error"
}

export function logAICall(entry: AICallLog) {
  console.log(JSON.stringify({ type: "ai_call", ...entry, timestamp: new Date().toISOString() }))
}
