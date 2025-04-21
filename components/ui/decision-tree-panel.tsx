"use client"

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DecisionTree, DecisionNode } from "@/lib/decision-tree-types";
import { BookOpen, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

// ... (DecisionTreePanelProps et DecisionTreePanel restent les mêmes)
interface DecisionTreePanelProps {
  children: React.ReactNode;
  decisionTree: DecisionTree;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DecisionTreePanel({
  children,
  decisionTree,
  isOpen,
  setIsOpen
}: DecisionTreePanelProps) {
  // Vérifier si l'arbre est vide
  const isEmpty = !decisionTree.rootId || Object.keys(decisionTree.nodes).length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-[90vw] max-w-[350px] h-full flex flex-col bg-amber-50 p-0"
      >
        <SheetHeader className="p-4 border-b border-amber-200">
          <SheetTitle className="text-xl font-serif text-amber-900 flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Arbre narratif
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          {isEmpty ? (
            <div className="text-amber-800 italic text-center p-6">
              L'histoire n'a pas encore commencé...
            </div>
          ) : (
            <DecisionTreeRenderer decisionTree={decisionTree} />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}


// Composant récursif pour afficher l'arbre de décision
function DecisionTreeRenderer({ decisionTree }: { decisionTree: DecisionTree }) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  if (!decisionTree.rootId) return null;

  const renderNode = (nodeId: string, depth: number = 0) => {
    const node = decisionTree.nodes[nodeId];
    if (!node) return null;

    const isMessage = !node.isOption;
    const isSelected = node.isSelected;
    const isExpanded = !!expandedNodes[node.id];

    return (
      <div key={node.id} className="mb-1">
        <div
          className={clsx(
            "flex items-start p-2 rounded-md transition-colors duration-150",
            isMessage
              ? "bg-amber-100 text-amber-900 ml-0"
              : isSelected
                ? "bg-amber-200 border-l-4 border-amber-600 ml-6"
                : "text-gray-500 ml-6 border-l-2 border-dotted border-amber-300 hover:bg-gray-100",
            depth > 0 ? "mt-1" : ""
          )}
          style={{ marginLeft: isMessage ? `${depth * 8}px` : undefined }}
        >
          {isMessage ? (
            <div className="text-sm font-medium w-full overflow-hidden"> {/* Ajout overflow-hidden pour contexte */}
              <div className="flex items-center mb-1">
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="font-semibold flex-1 min-w-0">Message du narrateur</span>
              </div>
              {/* --- MODIFICATION ICI --- */}
              <div
                className={clsx(
                  "text-xs ml-5 text-amber-700 italic cursor-pointer",
                  "break-words",   // Garder pour les mots longs
                  "whitespace-normal", // <-- AJOUTER CETTE CLASSE pour le retour à la ligne standard
                  !isExpanded && "truncate" // Tronquer si non développé
                )}
                onClick={() => toggleNodeExpansion(node.id)}
                title={isExpanded ? "Cliquer pour réduire" : "Cliquer pour lire"}
              >
                {isExpanded ? node.content : `${node.content.substring(0, 60)}...`}
              </div>
            </div>
          ) : (
            <div
              className="flex items-start w-full cursor-pointer"
              onClick={() => toggleNodeExpansion(node.id)}
              title={isExpanded ? "Cliquer pour réduire" : "Cliquer pour lire"}
            >
              {isSelected ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 mr-2 text-amber-300 flex-shrink-0 mt-0.5" />
              )}
              {/* --- MODIFICATION ICI --- */}
              <span className={clsx(
                "text-sm flex-1 min-w-0", // flex-1 pour prendre l'espace restant
                "break-words",           // Garder pour les mots longs
                "whitespace-normal",     // <-- AJOUTER CETTE CLASSE pour le retour à la ligne standard
                !isExpanded && "truncate max-w-[220px]" // Appliquer seulement si non développé
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
                const nodeA = decisionTree.nodes[a];
                const nodeB = decisionTree.nodes[b];
                return (nodeA?.timestamp ?? 0) - (nodeB?.timestamp ?? 0);
              })
              .map(childId => renderNode(childId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-2">{renderNode(decisionTree.rootId)}</div>;
}