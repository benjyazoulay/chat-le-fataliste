"use client"

import { useRef, useEffect } from "react"
import type { Message } from "ai"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { cn } from "@/lib/utils"

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
  className?: string
}

export function ChatMessages({ messages, isLoading, className }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter out system messages
  const visibleMessages = messages.filter((m) => m.role !== "system")

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar",
        className
      )}
    >
      {visibleMessages.length === 0 && !isLoading && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-3 animate-fade-in">
            <div className="text-4xl font-serif text-primary/20">
              &ldquo;
            </div>
            <p className="text-muted-foreground font-serif italic max-w-md">
              Comment commencerait votre histoire ? Ecrivez quelques mots pour debuter l&apos;aventure...
            </p>
          </div>
        </div>
      )}

      {visibleMessages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLatest={index === visibleMessages.length - 1}
        />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  )
}
