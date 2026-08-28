// Single source of truth for which Groq-hosted model the AI routes call, so a
// provider-side model retirement (this app previously hardcoded the now-retired
// `llama-3.3-70b-versatile` in 8 separate places across two files, all silently
// 404ing) only needs to be fixed here.
export const GROQ_MODEL = "openai/gpt-oss-120b"
