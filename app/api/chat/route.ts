// app/api/chat/route.ts
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

// Define the Vercel AI SDK runtime
// export const runtime = 'edge'; // Optional: Use edge runtime if preferred

export async function POST(req: Request) {
  try {
    // IMPORTANT: Extract messages from the request body.
    // The frontend (useChat hook) will send the entire message history,
    // including the system prompt you added initially.
    const { messages } = await req.json()
    const apiKey = req.headers.get("x-api-key")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create a custom OpenAI instance with the user's API key
    const userOpenAI = createOpenAI({
      apiKey,
    })

    // ---------------------------------------------------------------------
    // REMOVED: No longer adding a static system prompt here.
    // We rely on the frontend sending the correct system prompt within 'messages'.
    // const enhancedMessages = [
    //   {
    //     role: "system",
    //     content: `INSTRUCTIONS STRICTES: ...`, // Static content removed
    //   },
    //   ...messages,
    // ]
    // ---------------------------------------------------------------------

    // Call the AI model with the messages received from the frontend
    const result = await streamText({
      model: userOpenAI("gpt-4o"), // Ensure you are using the model you intend
      // Pass the messages array directly as received from the frontend
      messages: messages,
      temperature: 1, // Keep your desired settings
      maxTokens: 1000, // Keep your desired settings
      // Add other parameters like system prompt if the library API changes
      // or if you want to override/add system instructions differently,
      // but for now, we assume the system prompt is the first message.
    })

    // Respond with the stream
    return result.toDataStreamResponse()
  } catch (error: any) { // Add type annotation for error
    console.error("Error in chat API:", error)
    // Improved error reporting
    const errorMessage = error.message || "An error occurred while processing your request"
    const errorStatus = error.status || 500
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: errorStatus,
      headers: { "Content-Type": "application/json" },
    })
  }
}