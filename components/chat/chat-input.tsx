"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
  hasOptions?: boolean
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  hasOptions = false,
  className
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex gap-2 items-center", className)}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder={hasOptions ? "Ou ecrivez votre propre suite..." : "Commencez l'histoire..."}
        className={cn(
          "flex-1 bg-background border-border",
          "focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-shadow duration-200",
          "font-serif placeholder:font-sans placeholder:text-muted-foreground/60"
        )}
        disabled={disabled}
        aria-label="Votre message"
      />
      <Button
        type="submit"
        size="icon"
        className={cn(
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-all duration-200",
          "disabled:opacity-50"
        )}
        disabled={disabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Envoyer</span>
      </Button>
    </form>
  )
}
