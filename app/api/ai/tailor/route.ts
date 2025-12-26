import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import type { ResumeData } from "@/lib/types"

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
  try {
    const { jobDescription, resumeData } = (await req.json()) as {
      jobDescription: string
      resumeData: ResumeData
    }

    if (!jobDescription?.trim()) {
      return Response.json({ error: "Job description is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY environment variable is not configured. Please add it to use AI features." },
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

    const { object } = await generateObject({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      schema: tailorResultsSchema,
      messages: [
        {
          role: "system",
          content: `You are an expert resume optimization assistant. Your role is to help users tailor their resume to specific job descriptions.

STRICT RULES:
1. NEVER invent experience, metrics, or accomplishments that aren't in the original resume
2. Only suggest improvements based on existing content
3. Use placeholders like "[X%]" or "[specific metric]" if concrete data is needed but not provided
4. Preserve the truth and accuracy of all statements
5. Focus on reframing and emphasizing relevant aspects that already exist
6. If suggesting bullet improvements, provide exactly 3 alternatives per bullet
7. Identify missing keywords that could naturally fit based on existing experience

Your goal is to help the user present their REAL experience in the most effective way for the target role.`,
        },
        {
          role: "user",
          content: `Job Description:
${jobDescription}

Current Resume:
${JSON.stringify(resumeSummary, null, 2)}

Analyze the resume against this job description and provide:
1. Missing keywords from the job that could naturally fit
2. A tailored summary that highlights relevant existing experience
3. Suggestions for 2-3 bullet points that could be reframed to better match the job (choose the most impactful ones)

Remember: Only work with what exists in the resume. Do not invent anything.`,
        },
      ],
    })

    return Response.json(object)
  } catch (error) {
    console.error("[v0] Tailor API error:", error)
    return Response.json({ error: "Failed to analyze job description. Please try again." }, { status: 500 })
  }
}
