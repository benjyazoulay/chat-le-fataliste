"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  BookOpen, 
  Copy, 
  Download, 
  Settings, 
  Trash2,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatHeaderProps {
  onReset: () => void
  onCopy: () => void
  onDownload: () => void
  onOpenTree: () => void
  onOpenSettings: () => void
  className?: string
}

export function ChatHeader({
  onReset,
  onCopy,
  onDownload,
  onOpenTree,
  onOpenSettings,
  className
}: ChatHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full",
      "bg-background/80 backdrop-blur-md border-b border-border",
      "transition-all duration-300",
      className
    )}>
      <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / Title */}
        <Link 
          href="/" 
          className={cn(
            "flex items-center gap-2 font-serif text-lg font-semibold",
            "text-foreground hover:text-primary transition-colors"
          )}
        >
          <img 
            src="/diderot.jpg" 
            alt="" 
            className="h-8 w-8 rounded-full ring-2 ring-border" 
          />
          <span className="hidden sm:inline">Chat le Fataliste</span>
        </Link>

        {/* Actions */}
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenTree}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="sr-only">Arbre narratif</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Arbre narratif</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCopy}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copier</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copier le recit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDownload}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Telecharger</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Telecharger en PDF</TooltipContent>
            </Tooltip>

            <div className="w-px h-5 bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onReset}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Reinitialiser</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nouvelle histoire</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenSettings}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Parametres</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Parametres</TooltipContent>
            </Tooltip>

            <ThemeToggle className="text-muted-foreground hover:text-foreground" />
          </div>
        </TooltipProvider>
      </div>
    </header>
  )
}
