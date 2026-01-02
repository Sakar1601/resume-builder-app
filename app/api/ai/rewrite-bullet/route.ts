import { NextResponse } from "next/server"
import { z } from "zod"

const requestSchema = z.object({
  bullet: z.string().min(1),
  tone: z.enum(["impact", "concise", "technical"]),
  targetRole: z.string().optional(),
})

const TONE_INSTRUCTIONS = {
  impact:
    "Emphasize quantifiable achievements, results, and leadership. Use strong action verbs. Make the impact clear and compelling.",
  concise: "Make it shorter and more direct while preserving key information. Remove unnecessary words.",
  technical: "Highlight specific technologies, methodologies, and technical skills. Use industry-standard terminology.",
}

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    const body = await req.json()
    const validated = requestSchema.parse(body)

    const toneInstruction = TONE_INSTRUCTIONS[validated.tone]
    const roleContext = validated.targetRole ? `for a ${validated.targetRole} position` : ""

    const prompt = `You are a professional resume writer helping improve a resume bullet point.

Original bullet point: "${validated.bullet}"

Task: Rewrite this bullet point in 3 different ways ${roleContext}. ${toneInstruction}

CRITICAL RULES:
1. Preserve the original meaning and core achievement
2. DO NOT invent metrics, numbers, or facts that aren't in the original
3. If metrics would strengthen the bullet but aren't provided, use placeholders like "[X%]" or "[N users]"
4. Avoid exaggeration - stay truthful to the original intent
5. Keep each rewrite concise (1-2 lines maximum)
6. Start with strong action verbs
7. Make it ATS-friendly (no special characters or emojis)

Return EXACTLY 3 rewritten versions, each on a new line, without numbering or bullet points.`

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
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Groq API error:", errorData)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ""

    // Parse the response into 3 suggestions
    const suggestions = text
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 3)

    // Ensure we have exactly 3 suggestions
    if (suggestions.length < 3) {
      throw new Error("AI did not return 3 suggestions")
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error in rewrite-bullet API:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
