"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
}

export function ThemeToggle({ className, variant = "ghost" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size="icon"
        className={cn("h-9 w-9", className)}
        disabled
      >
        <span className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-9 w-9 transition-colors",
        className
      )}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      <Sun className={cn(
        "h-4 w-4 transition-all duration-300",
        isDark ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
      )} />
      <Moon className={cn(
        "h-4 w-4 transition-all duration-300",
        isDark ? "-rotate-90 scale-0 absolute" : "rotate-0 scale-100"
      )} />
      <span className="sr-only">
        {isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      </span>
    </Button>
  )
}
