import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
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

    // Ajouter un message système à chaque requête pour renforcer les instructions
    const enhancedMessages = [
      {
        role: "system",
        content: `INSTRUCTIONS STRICTES:
1. NE JAMAIS t'adresser directement au lecteur. N'utilise jamais des phrases comme "Mais peut-être est-ce vous, lecteur..." ou "Que voulez-vous faire ?".
2. NE JAMAIS utiliser le mot "lecteur" ou faire référence à la personne qui lit.
3. NE JAMAIS poser de questions directes à l'utilisateur.
4. Raconter l'histoire à la troisième personne, comme un narrateur omniscient.
5. À la fin de chaque réponse, propose 2-3 options narratives possibles pour la suite, numérotées (1., 2., 3.).
6. Ces options doivent être des phrases complètes décrivant une direction possible pour l'histoire.
7. Présente simplement les options numérotées à la fin de ton message, sans phrase d'introduction.`,
      },
      ...messages,
    ]

    const result = streamText({
      model: userOpenAI("gpt-4o"),
      messages: enhancedMessages,
      temperature: 0.9, // Higher temperature for more creative responses
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "An error occurred while processing your request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
