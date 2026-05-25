"use client"

import { cn } from "@/lib/utils"
import type { Message } from "ai"

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "max-w-[85%] animate-fade-in-up",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "p-4 shadow-soft transition-all duration-300",
          isUser ? "message-bubble-user" : "message-bubble-assistant"
        )}
      >
        <div className={cn(
          "font-serif text-foreground leading-relaxed whitespace-pre-wrap break-words",
          isUser ? "text-right" : "text-left"
        )}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
