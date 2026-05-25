"use client"

import { Feather } from "lucide-react"
import { cn } from "@/lib/utils"

interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg bg-card border border-border",
        "animate-fade-in-up",
        className
      )}
    >
      <div className="relative">
        <Feather className="h-5 w-5 text-primary animate-writing" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground font-serif italic">
          Le narrateur compose
        </span>
        <span className="flex gap-0.5 ml-1">
          <span className="typing-dot h-1 w-1 rounded-full bg-primary/60" />
          <span className="typing-dot h-1 w-1 rounded-full bg-primary/60" />
          <span className="typing-dot h-1 w-1 rounded-full bg-primary/60" />
        </span>
      </div>
    </div>
  )
}
