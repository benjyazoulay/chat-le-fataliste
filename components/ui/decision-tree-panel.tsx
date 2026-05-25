"use client"

import React, { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DecisionTree, DecisionNode } from "@/lib/decision-tree-types"
import { BookOpen, ChevronRight, Circle, CheckCircle2, RotateCcw, PenLine, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DecisionTreePanelProps {
  children: React.ReactNode
  decisionTree: DecisionTree
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onNavigateToNode?: (nodeId: string) => void
  currentPath?: string[]
}

export function DecisionTreePanel({
  children,
  decisionTree,
  isOpen,
  setIsOpen,
  onNavigateToNode,
  currentPath = []
}: DecisionTreePanelProps) {
  const isEmpty = !decisionTree.rootId || Object.keys(decisionTree.nodes).length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          "w-[90vw] max-w-[380px] h-full flex flex-col p-0",
          "bg-background border-r border-border"
        )}
      >
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-serif text-foreground flex items-center">
            <GitBranch className="mr-2 h-5 w-5 text-primary" />
            Arbre narratif
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Cliquez sur une branche pour explorer un autre chemin
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4 custom-scrollbar">
          {isEmpty ? (
            <div className="text-muted-foreground italic text-center p-6 font-serif">
              L&apos;histoire n&apos;a pas encore commence...
            </div>
          ) : (
            <TooltipProvider>
              <DecisionTreeRenderer 
                decisionTree={decisionTree} 
                onNavigateToNode={onNavigateToNode}
                currentPath={currentPath}
              />
            </TooltipProvider>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              <span>Choix actuel</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="h-3 w-3 text-border" />
              <span>Alternative</span>
            </div>
            <div className="flex items-center gap-1">
              <PenLine className="h-3 w-3 text-accent-foreground" />
              <span>Personnalise</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


function DecisionTreeRenderer({ 
  decisionTree,
  onNavigateToNode,
  currentPath
}: { 
  decisionTree: DecisionTree
  onNavigateToNode?: (nodeId: string) => void
  currentPath: string[]
}) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const toggleNodeExpansion = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }))
  }

  const handleOptionClick = (node: DecisionNode, e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.isOption && onNavigateToNode) {
      onNavigateToNode(node.id)
    }
  }

  if (!decisionTree.rootId) return null

  const isInCurrentPath = (nodeId: string) => currentPath.includes(nodeId)

  const renderNode = (nodeId: string, depth: number = 0) => {
    const node = decisionTree.nodes[nodeId]
    if (!node) return null

    const isMessage = !node.isOption
    const isSelected = node.isSelected
    const isExpanded = !!expandedNodes[node.id]
    const isOnCurrentPath = isInCurrentPath(node.id)
    const isCustomOption = node.isCustom

    // Get option children for message nodes
    const optionChildren = isMessage 
      ? node.children.filter(childId => {
          const child = decisionTree.nodes[childId]
          return child?.isOption
        })
      : []

    // Get message children for selected options
    const messageChildren = node.isOption && isSelected
      ? node.children.filter(childId => {
          const child = decisionTree.nodes[childId]
          return child && !child.isOption
        })
      : []

    return (
      <div key={node.id} className="relative">
        {/* Vertical connector line */}
        {depth > 0 && (
          <div 
            className={cn(
              "absolute left-0 top-0 bottom-0 w-px",
              isOnCurrentPath ? "bg-primary/40" : "bg-border"
            )}
            style={{ marginLeft: `${(depth - 1) * 16 + 8}px` }}
          />
        )}

        <div
          className={cn(
            "relative flex items-start p-2 rounded-md transition-all duration-200 mb-1",
            isMessage
              ? cn(
                  "bg-primary/10 text-foreground",
                  isOnCurrentPath && "ring-1 ring-primary/30"
                )
              : isSelected
                ? cn(
                    "bg-primary/20 border-l-3 border-primary cursor-pointer",
                    "hover:bg-primary/25"
                  )
                : cn(
                    "text-muted-foreground border-l-2 border-dashed border-border",
                    "hover:bg-muted hover:text-foreground cursor-pointer",
                    "opacity-70 hover:opacity-100"
                  )
          )}
          style={{ marginLeft: `${depth * 16}px` }}
          onClick={(e) => !isMessage && handleOptionClick(node, e)}
        >
          {isMessage ? (
            <div className="text-sm font-medium w-full overflow-hidden">
              <div className="flex items-center mb-1">
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0 text-primary" />
                <span className="font-semibold flex-1 min-w-0 font-serif text-xs uppercase tracking-wider">
                  Chapitre {depth + 1}
                </span>
              </div>
              <div
                className={cn(
                  "text-xs ml-5 text-muted-foreground cursor-pointer leading-relaxed",
                  "break-words whitespace-normal",
                  !isExpanded && "line-clamp-2"
                )}
                onClick={(e) => toggleNodeExpansion(node.id, e)}
                title={isExpanded ? "Cliquer pour reduire" : "Cliquer pour developper"}
              >
                {node.content}
              </div>
              {node.content.length > 100 && (
                <button
                  onClick={(e) => toggleNodeExpansion(node.id, e)}
                  className="text-xs text-primary ml-5 mt-1 hover:underline"
                >
                  {isExpanded ? "Reduire" : "Lire la suite..."}
                </button>
              )}
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-start w-full gap-2">
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-border flex-shrink-0 mt-0.5 group-hover:text-primary" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-sm font-serif leading-relaxed",
                      "break-words whitespace-normal",
                      !isExpanded && "line-clamp-2",
                      isSelected && "font-medium"
                    )}>
                      {node.content}
                    </span>
                    {isCustomOption && (
                      <div className="flex items-center gap-1 mt-1">
                        <PenLine className="h-3 w-3 text-accent-foreground" />
                        <span className="text-xs text-accent-foreground italic">Votre texte</span>
                      </div>
                    )}
                  </div>
                  {!isSelected && (
                    <RotateCcw className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </TooltipTrigger>
              {!isSelected && (
                <TooltipContent side="right" className="max-w-[200px]">
                  <p className="text-xs">Cliquer pour explorer cette branche</p>
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>

        {/* Render option children for message nodes (all options, selected or not) */}
        {isMessage && optionChildren.length > 0 && (
          <div className="relative">
            {optionChildren
              .sort((a, b) => {
                const nodeA = decisionTree.nodes[a]
                const nodeB = decisionTree.nodes[b]
                // Put selected options first, then sort by timestamp
                if (nodeA?.isSelected && !nodeB?.isSelected) return -1
                if (!nodeA?.isSelected && nodeB?.isSelected) return 1
                return (nodeA?.timestamp ?? 0) - (nodeB?.timestamp ?? 0)
              })
              .map(childId => renderNode(childId, depth + 1))}
          </div>
        )}

        {/* Render message children for selected options */}
        {messageChildren.length > 0 && (
          <div className="relative">
            {messageChildren
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

  return <div className="space-y-1">{renderNode(decisionTree.rootId)}</div>
}
