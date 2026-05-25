"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StoryOptionsProps {
  options: string[]
  isExpanded: boolean
  onToggle: () => void
  onSelect: (option: string) => void
  disabled?: boolean
}

export function StoryOptions({
  options,
  isExpanded,
  onToggle,
  onSelect,
  disabled = false
}: StoryOptionsProps) {
  if (options.length === 0) return null

  return (
    <div className="p-4 border-t border-border bg-muted/30">
      {/* Header with toggle */}
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 w-full text-left cursor-pointer group",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 -m-1"
        )}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls="story-options-content"
      >
        <div className="transition-transform duration-200">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-primary" />
          )}
        </div>
        <span
          className={cn(
            "text-sm font-medium font-serif select-none transition-colors",
            isExpanded ? "text-muted-foreground" : "text-primary"
          )}
        >
          Et maintenant ?
        </span>
        {!isExpanded && (
          <span className="ml-auto text-xs text-muted-foreground">
            {options.length} options
          </span>
        )}
      </button>

      {/* Options list */}
      {isExpanded && (
        <div
          id="story-options-content"
          className="mt-3 flex flex-col gap-2 stagger-animation"
        >
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "justify-start h-auto py-3 px-4 font-normal whitespace-normal text-left",
                "border-border hover:border-primary/50 hover:bg-primary/5",
                "transition-all duration-200 group"
              )}
              onClick={() => onSelect(option)}
              disabled={disabled}
            >
              <Sparkles className={cn(
                "h-4 w-4 mr-3 flex-shrink-0 self-start mt-0.5",
                "text-primary/60 group-hover:text-primary transition-colors"
              )} />
              <span className="flex-1 break-words font-serif">{option}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
