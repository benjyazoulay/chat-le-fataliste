"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SettingsForm } from "./settings-form"
import { cn } from "@/lib/utils"

interface SettingsSheetProps {
  children: React.ReactNode
  onSettingsSaved: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SettingsSheet({ 
  children, 
  onSettingsSaved,
  open,
  onOpenChange 
}: SettingsSheetProps) {

  const handleSave = () => {
    onSettingsSaved()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "w-[90vw] max-w-[550px] h-full flex flex-col p-0",
          "bg-background border-l border-border"
        )}
      >
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="text-xl font-serif text-foreground">
                Configuration Narrative
              </SheetTitle>
              <SheetDescription className="text-muted-foreground mt-1">
                Personnalisez votre experience d&apos;ecriture
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto p-6">
          <SettingsForm onSettingsSaved={handleSave} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
