import { z } from "zod"
import type { ResumeData } from "@/lib/types"
import { checkRateLimit, getClientKey } from "@/lib/rate-limit"
import { logAICall } from "@/lib/ai-log"
import { GROQ_MODEL } from "@/lib/groq"

const RATE_LIMIT_PER_MINUTE = 5
const MAX_JOB_DESCRIPTION_LENGTH = 8000

const tailorResultsSchema = z.object({
  missing_keywords: z
    .array(z.string())
    .describe("Keywords from the job description that are missing or underrepresented in the resume"),
  summary_suggestion: z
    .string()
    .describe(
      "A tailored professional summary based on existing resume content and job requirements. Must not invent experience.",
    ),
  bullet_suggestions: z
    .array(
      z.object({
        section: z.enum(["experience", "projects"]).describe("Which section the bullet belongs to"),
        itemIndex: z.number().describe("Index of the item (experience or project) in the array"),
        bulletIndex: z.number().describe("Index of the bullet point within that item"),
        suggestions: z
          .array(z.string())
          .length(3)
          .describe(
            "Exactly 3 rewritten versions of the bullet. Must preserve original meaning. Use placeholders like [X%] if specific metrics are needed but unknown. No hallucination.",
          ),
      }),
    )
    .describe("Suggestions for improving specific bullet points to match the job description"),
})

export async function POST(req: Request) {
  const startTime = Date.now()

  try {
    const { allowed, retryAfterSeconds } = checkRateLimit(getClientKey(req), RATE_LIMIT_PER_MINUTE)
    if (!allowed) {
      return Response.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
      )
    }

    const { jobDescription, resumeData } = (await req.json()) as {
      jobDescription: string
      resumeData: ResumeData
    }

    if (!jobDescription?.trim()) {
      return Response.json({ error: "Job description is required" }, { status: 400 })
    }

    if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return Response.json(
        { error: `Job description is too long (max ${MAX_JOB_DESCRIPTION_LENGTH} characters).` },
        { status: 400 },
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY environment variable is not configured. Please add it to use AI features." },
        { status: 500 },
      )
    }

    // Build a concise representation of the resume
    const resumeSummary = {
      contact: resumeData.contact,
      summary: resumeData.summary,
      skills: resumeData.skills?.map((s) => `${s.category}: ${s.skills}`).join("; "),
      experience:
        resumeData.experience?.map(
          (exp, idx) =>
            `[${idx}] ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})\nBullets:\n${exp.bullets.map((b, bidx) => `  [${bidx}] ${b}`).join("\n")}`,
        ) || [],
      projects:
        resumeData.projects?.map(
          (proj, idx) =>
            `[${idx}] ${proj.name}\nTech: ${proj.techStack}\nBullets:\n${proj.bullets.map((b, bidx) => `  [${bidx}] ${b}`).join("\n")}`,
        ) || [],
      education:
        resumeData.education?.map((edu) => `${edu.degree} from ${edu.school} (${edu.startDate} - ${edu.endDate})`) ||
        [],
    }

    const systemPrompt = `You are an expert resume optimization assistant. Your role is to help users tailor their resume to specific job descriptions.

STRICT RULES:
1. NEVER invent experience, metrics, or accomplishments that aren't in the original resume
2. Only suggest improvements based on existing content
3. Use placeholders like "[X%]" or "[specific metric]" if concrete data is needed but not provided
4. Preserve the truth and accuracy of all statements
5. Focus on reframing and emphasizing relevant aspects that already exist
6. If suggesting bullet improvements, provide exactly 3 alternatives per bullet
7. Identify missing keywords that could naturally fit based on existing experience

Your goal is to help the user present their REAL experience in the most effective way for the target role.

You must respond with valid JSON matching this exact structure:
{
  "missing_keywords": ["keyword1", "keyword2", ...],
  "summary_suggestion": "A tailored summary based on existing resume content",
  "bullet_suggestions": [
    {
      "section": "experience" or "projects",
      "itemIndex": 0,
      "bulletIndex": 0,
      "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
    }
  ]
}`

    const userPrompt = `Job Description:
${jobDescription}

Current Resume:
${JSON.stringify(resumeSummary, null, 2)}

Analyze the resume against this job description and provide:
1. Missing keywords from the job that could naturally fit
2. A tailored summary that highlights relevant existing experience
3. Suggestions for 2-3 bullet points that could be reframed to better match the job (choose the most impactful ones)

Remember: Only work with what exists in the resume. Do not invent anything.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ]

    let lastError: unknown
    // One retry on malformed output: a fresh sample from the model resolves most
    // one-off JSON/schema slips without the user having to manually retry.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages,
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error("Groq API error:", errorData)
          throw new Error(`Groq API error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content || "{}"
        const parsedObject = JSON.parse(content)
        const validatedObject = tailorResultsSchema.parse(parsedObject)

        logAICall({
          route: "tailor",
          model: GROQ_MODEL,
          latencyMs: Date.now() - startTime,
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          outcome: attempt === 0 ? "success" : "retry_success",
        })

        return Response.json(validatedObject)
      } catch (error) {
        lastError = error
        const isMalformed = error instanceof SyntaxError || error instanceof z.ZodError
        if (!isMalformed || attempt === 1) break
        logAICall({
          route: "tailor",
          model: GROQ_MODEL,
          latencyMs: Date.now() - startTime,
          outcome: "malformed_output",
        })
      }
    }

    throw lastError
  } catch (error) {
    logAICall({
      route: "tailor",
      model: GROQ_MODEL,
      latencyMs: Date.now() - startTime,
      outcome: "error",
    })
    // Never console.error a raw ZodError — its getters crash Node 24's util.inspect
    // ("Cannot read properties of undefined (reading 'value')"). Log a safe message instead.
    console.error("Tailor API error:", error instanceof z.ZodError ? error.issues : error instanceof Error ? error.message : error)
    return Response.json({ error: "Failed to analyze job description. Please try again." }, { status: 500 })
  }
}
