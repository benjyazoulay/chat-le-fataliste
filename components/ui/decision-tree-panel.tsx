"use client"

import React, { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DecisionTree, DecisionNode } from "@/lib/decision-tree-types"
import { BookOpen, ChevronRight, Circle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DecisionTreePanelProps {
  children: React.ReactNode
  decisionTree: DecisionTree
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function DecisionTreePanel({
  children,
  decisionTree,
  isOpen,
  setIsOpen
}: DecisionTreePanelProps) {
  const isEmpty = !decisionTree.rootId || Object.keys(decisionTree.nodes).length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          "w-[90vw] max-w-[350px] h-full flex flex-col p-0",
          "bg-background border-r border-border"
        )}
      >
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-serif text-foreground flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-primary" />
            Arbre narratif
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4 custom-scrollbar">
          {isEmpty ? (
            <div className="text-muted-foreground italic text-center p-6 font-serif">
              L&apos;histoire n&apos;a pas encore commence...
            </div>
          ) : (
            <DecisionTreeRenderer decisionTree={decisionTree} />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}


function DecisionTreeRenderer({ decisionTree }: { decisionTree: DecisionTree }) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }))
  }

  if (!decisionTree.rootId) return null

  const renderNode = (nodeId: string, depth: number = 0) => {
    const node = decisionTree.nodes[nodeId]
    if (!node) return null

    const isMessage = !node.isOption
    const isSelected = node.isSelected
    const isExpanded = !!expandedNodes[node.id]

    return (
      <div key={node.id} className="mb-1">
        <div
          className={cn(
            "flex items-start p-2 rounded-md transition-colors duration-150",
            isMessage
              ? "bg-primary/10 text-foreground ml-0"
              : isSelected
                ? "bg-primary/20 border-l-4 border-primary ml-6"
                : "text-muted-foreground ml-6 border-l-2 border-dotted border-border hover:bg-muted",
            depth > 0 ? "mt-1" : ""
          )}
          style={{ marginLeft: isMessage ? `${depth * 8}px` : undefined }}
        >
          {isMessage ? (
            <div className="text-sm font-medium w-full overflow-hidden">
              <div className="flex items-center mb-1">
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0 text-primary" />
                <span className="font-semibold flex-1 min-w-0 font-serif">Message du narrateur</span>
              </div>
              <div
                className={cn(
                  "text-xs ml-5 text-muted-foreground italic cursor-pointer",
                  "break-words whitespace-normal",
                  !isExpanded && "truncate"
                )}
                onClick={() => toggleNodeExpansion(node.id)}
                title={isExpanded ? "Cliquer pour reduire" : "Cliquer pour lire"}
              >
                {isExpanded ? node.content : `${node.content.substring(0, 60)}...`}
              </div>
            </div>
          ) : (
            <div
              className="flex items-start w-full cursor-pointer"
              onClick={() => toggleNodeExpansion(node.id)}
              title={isExpanded ? "Cliquer pour reduire" : "Cliquer pour lire"}
            >
              {isSelected ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 mr-2 text-border flex-shrink-0 mt-0.5" />
              )}
              <span className={cn(
                "text-sm flex-1 min-w-0 font-serif",
                "break-words whitespace-normal",
                !isExpanded && "truncate max-w-[220px]"
              )}>
                {node.content}
              </span>
            </div>
          )}
        </div>

        {(isMessage || isSelected) && node.children.length > 0 && (
          <div className="ml-4">
            {node.children
              .sort((a, b) => {
                const nodeA = decisionTree.nodes[a]
                const nodeB = decisionTree.nodes[b]
                return (nodeA?.timestamp ?? 0) - (nodeB?.timestamp ?? 0)
              })
              .map(childId => renderNode(childId, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return <div className="space-y-2">{renderNode(decisionTree.rootId)}</div>
}
