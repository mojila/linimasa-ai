import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add a system message to make responses more game-like
  const systemMessage = {
    role: "system",
    content:
      "You are an AI assistant in a gamified chat application. Be friendly, helpful, and occasionally mention game elements like XP, levels, and achievements. Keep responses concise and engaging.",
  }

  const allMessages = [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: allMessages,
  })

  return result.toDataStreamResponse()
}
