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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
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

    // Validate with zod schema
    const validatedObject = tailorResultsSchema.parse(parsedObject)

    return Response.json(validatedObject)
  } catch (error) {
    console.error("Tailor API error:", error)
    return Response.json({ error: "Failed to analyze job description. Please try again." }, { status: 500 })
  }
}
