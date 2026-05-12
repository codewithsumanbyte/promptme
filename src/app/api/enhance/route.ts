import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key missing on server" }, { status: 500 })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a world-class prompt engineer. The user will provide a rough AI prompt draft. Expand and enhance this draft into a highly detailed, optimized prompt suited for high-performance image and art generators. ONLY return the final optimized prompt string. Do NOT include preamble, explanations, introductory text, or tags. Just the enhanced prompt itself.",
          },
          {
            role: "user",
            content: `Enhance this prompt: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Groq API Error:", err)
      return NextResponse.json({ error: "Groq service error" }, { status: response.status })
    }

    const data = await response.json()
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim() || prompt

    return NextResponse.json({ enhancedPrompt })
  } catch (error) {
    console.error("Enhance Route Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
