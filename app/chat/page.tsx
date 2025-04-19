"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Settings, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useChat } from "ai/react"

export default function Chat() {
  const router = useRouter()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [apiKey, setApiKey] = useState("")
  const [literaryStyle, setLiteraryStyle] = useState("diderot")
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [storyOptions, setStoryOptions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key")
    const savedStyle = localStorage.getItem("literary_style")

    if (savedApiKey) {
      setApiKey(savedApiKey)
    } else {
      toast({
        title: "Clé API manquante",
        description: "Veuillez configurer votre clé API OpenAI dans les paramètres.",
        variant: "destructive",
      })
      router.push("/settings")
    }

    if (savedStyle) setLiteraryStyle(savedStyle)
  }, [router, toast])

  // Initialize chat with AI SDK
  const { messages, input, handleInputChange, handleSubmit, setMessages, append, isLoading } = useChat({
    api: "/api/chat",
    headers: {
      "x-api-key": apiKey,
    },
    initialMessages: [],
    onFinish: () => {
      setIsSubmitting(false)
    },
    onError: (error) => {
      setIsSubmitting(false)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la communication avec l'API.",
        variant: "destructive",
      })
    },
  })

  // Start the story when API key is available
  useEffect(() => {
    if (apiKey && isFirstMessage) {
      setIsFirstMessage(false)

      // Add system message to set the context and style
      setMessages([
        {
          id: "system-1",
          role: "system",
          content: `Tu es "Chat le Fataliste", un narrateur inspiré par le style de Denis Diderot dans "Jacques le Fataliste". 
        Tu dois adopter un style littéraire ${getStyleDescription(literaryStyle)}.
        
        INSTRUCTIONS STRICTES:
        1. NE JAMAIS t'adresser directement au lecteur avec des phrases comme "Mais peut-être est-ce vous, lecteur..." ou "Que voulez-vous faire ?".
        2. NE JAMAIS utiliser le mot "lecteur" ou faire référence à la personne qui lit.
        3. NE JAMAIS poser de questions directes à l'utilisateur.
        4. Raconter l'histoire à la troisième personne, comme un narrateur omniscient.
        5. À la fin de chaque réponse, propose 2-3 options narratives possibles pour la suite, numérotées (1., 2., 3.).
        6. Ces options doivent être des phrases complètes décrivant une direction possible pour l'histoire.
        7. Présente simplement les options numérotées à la fin de ton message, sans phrase d'introduction.
        
        Commence par une introduction qui présente le concept et propose des points de départ pour l'histoire.`,
        },
      ])
    }
  }, [apiKey, isFirstMessage, setMessages, literaryStyle])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Extraire les options et nettoyer le contenu du message
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      const lastMessage = messages[messages.length - 1].content
      const options: string[] = []

      // Regex pour extraire les options numérotées
      const optionRegex = /\d+\.\s+(.*?)(?=\n\d+\.|\n\n|$)/gs
      let match
      let cleanedContent = lastMessage

      // Collecter les options et les supprimer du contenu
      while ((match = optionRegex.exec(lastMessage)) !== null) {
        if (match[1]) {
          options.push(match[1].trim())
          // Marquer cette partie pour suppression
          cleanedContent = cleanedContent.replace(match[0], "")
        }
      }

      // Nettoyer les phrases d'introduction aux options et les adresses au lecteur
      cleanedContent = cleanedContent.replace(/Que (?:voulez|souhaitez|préférez)[^?]*\?/g, "")
      cleanedContent = cleanedContent.replace(/Que (?:choisissez|décidez)[^?]*\?/g, "")
      cleanedContent = cleanedContent.replace(/(?:Voici|Voilà)(?: quelques)? options[^:]*:/g, "")
      cleanedContent = cleanedContent.replace(/(?:Choisissez|Sélectionnez)[^:]*:/g, "")
      cleanedContent = cleanedContent.replace(/Mais peut-être est-ce vous, lecteur[^.]*\./g, "")
      cleanedContent = cleanedContent.replace(/[^.]*lecteur[^.]*\./g, "")

      // Supprimer les lignes vides consécutives
      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n")
      cleanedContent = cleanedContent.trim()

      // Mettre à jour le dernier message avec le contenu nettoyé
      if (options.length > 0) {
        setStoryOptions(options)

        // Mettre à jour le contenu du message sans modifier l'objet original
        const updatedMessages = [...messages]
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content: cleanedContent,
        }

        setMessages(updatedMessages)
      }
    }
  }, [messages, setMessages])

  // Helper function to get style description
  function getStyleDescription(style: string): string {
    switch (style) {
      case "diderot":
        return "du XVIIIe siècle, avec des digressions et un ton espiègle"
      case "balzac":
        return "réaliste du XIXe siècle, avec des descriptions détaillées"
      case "proust":
        return "proustien, avec de longues phrases et des réflexions sur la mémoire"
      case "camus":
        return "existentialiste, sobre et philosophique"
      case "vian":
        return "surréaliste et fantaisiste"
      case "contemporary":
        return "contemporain et accessible"
      default:
        return "littéraire classique"
    }
  }

  // Handle option selection
  const selectOption = (option: string) => {
    if (isSubmitting || isLoading) return

    setIsSubmitting(true)
    setStoryOptions([]) // Clear options immediately to prevent double-clicks

    // Use append instead of handleSubmit for more direct control
    append({
      role: "user",
      content: option,
    })
  }

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || isLoading || !input.trim()) return

    setIsSubmitting(true)
    setStoryOptions([]) // Clear options when submitting custom input
    handleSubmit(e)
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="bg-amber-800 text-white p-4">
        <div className="container max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-xl font-bold">
            Chat le Fataliste
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="text-white hover:bg-amber-700">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md border border-amber-200 h-[calc(100vh-12rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter((m) => m.role !== "system")
              .map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.role === "user" ? "bg-amber-100 ml-12" : "bg-white border border-amber-200"
                  } p-4 rounded-lg`}
                >
                  <div className="font-serif text-gray-800 whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          {storyOptions.length > 0 && (
            <div className="p-4 border-t border-amber-200 bg-amber-50">
              <p className="text-sm text-gray-600 mb-2">Directions possibles pour l'histoire :</p>
              <div className="flex flex-col gap-2">
                {storyOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="border-amber-500 text-amber-800 hover:bg-amber-100 justify-start h-auto py-2 px-4 font-normal"
                    onClick={() => selectOption(option)}
                    disabled={isSubmitting || isLoading}
                  >
                    <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="p-4 border-t border-amber-200 flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Écrivez votre réponse..."
              className="border-amber-200 focus:ring-amber-500"
              disabled={isSubmitting || isLoading}
            />
            <Button type="submit" className="bg-amber-800 hover:bg-amber-900" disabled={isSubmitting || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
