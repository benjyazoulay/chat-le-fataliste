import { useState, useEffect, useCallback } from "react";
import { DecisionTree, DecisionNode, DECISION_TREE_STORAGE_KEY } from "@/lib/decision-tree-types";
import { v4 as uuidv4 } from 'uuid'; // Il faudra installer cette dépendance

// Hook personnalisé pour gérer l'arbre de décision
export function useDecisionTree() {
  // État local de l'arbre de décision
  const [decisionTree, setDecisionTree] = useState<DecisionTree>({
    nodes: {},
    rootId: null,
    currentNodeId: null,
    sessionId: uuidv4()
  });
  
  // État pour le panneau latéral
  const [isTreePanelOpen, setIsTreePanelOpen] = useState(false);
  
  // Charger l'arbre de décision depuis le localStorage au démarrage
  useEffect(() => {
    const storedTree = localStorage.getItem(DECISION_TREE_STORAGE_KEY);
    if (storedTree) {
      try {
        const parsedTree = JSON.parse(storedTree) as DecisionTree;
        setDecisionTree(parsedTree);
      } catch (e) {
        console.error("Erreur lors du chargement de l'arbre de décision:", e);
        // Si erreur, on réinitialise
        resetDecisionTree();
      }
    }
  }, []);
  
  // Sauvegarder l'arbre dans le localStorage quand il change
  useEffect(() => {
    if (decisionTree.rootId) { // Seulement si l'arbre a été initialisé
      localStorage.setItem(DECISION_TREE_STORAGE_KEY, JSON.stringify(decisionTree));
    }
  }, [decisionTree]);
  
  // Ajouter un message du bot à l'arbre
  // Ajouter un message du bot à l'arbre
  const addBotMessage = useCallback((content: string, options: string[]) => {
    setDecisionTree(prevTree => {
      const newNodeId = uuidv4();
      const timestamp = Date.now();
      const parentId = prevTree.currentNodeId; // The ID of the previously selected option (or null for root)

      // Créer le nouveau nœud pour le message du bot
      const newNode: DecisionNode = {
        id: newNodeId,
        content,
        parentId: parentId, // Correctly set
        children: [],
        isSelected: true, // Bot messages are part of the main path initially
        isOption: false,
        timestamp
      };

      // Créer des nœuds pour chaque option proposée
      const optionNodes: Record<string, DecisionNode> = {};
      const optionIds: string[] = [];

      options.forEach((option, index) => {
        const optionId = uuidv4();
        optionIds.push(optionId);

        optionNodes[optionId] = {
          id: optionId,
          content: option,
          parentId: newNodeId, // Options belong to the new bot message
          children: [],
          isSelected: false,
          isOption: true,
          timestamp: timestamp + index + 1
        };
      });

      // Mettre à jour le nœud du bot avec les options
      newNode.children = optionIds;

      // --- START CORRECTION ---
      // Créer un nouvel arbre avec tous les nouveaux nœuds
      const updatedNodes = {
        ...prevTree.nodes,
        [newNodeId]: newNode,
        ...optionNodes
      };

      // **Crucially, update the parent node (the selected option) to include this new bot message as a child**
      if (parentId && updatedNodes[parentId]) {
        const parentNode = updatedNodes[parentId];
        // Ensure children array exists and doesn't already include the newNodeId
        if (!parentNode.children.includes(newNodeId)) {
            updatedNodes[parentId] = {
              ...parentNode,
              children: [...parentNode.children, newNodeId],
            };
        }
      }
      // --- END CORRECTION ---

      // Si c'est le premier message, définir comme racine
      const rootId = prevTree.rootId || newNodeId;

      // Mettre à jour l'état
      return {
        ...prevTree,
        nodes: updatedNodes,
        rootId,
        currentNodeId: newNodeId // The new bot message becomes the current node
      };
    });
  }, []);
  
  // Ajouter un choix utilisateur à l'arbre
  const selectOption = useCallback((optionContent: string) => {
    setDecisionTree(prevTree => {
      if (!prevTree.currentNodeId) return prevTree;
      
      // Trouver l'option correspondante parmi les enfants du nœud courant
      const currentNode = prevTree.nodes[prevTree.currentNodeId];
      const optionNode = Object.values(prevTree.nodes)
        .find(node => 
          node.parentId === currentNode.id && 
          node.content === optionContent
        );
      
      if (!optionNode) {
        // Option non trouvée, créons-en une nouvelle
        const newOptionId = uuidv4();
        const newOption: DecisionNode = {
          id: newOptionId,
          content: optionContent,
          parentId: prevTree.currentNodeId,
          children: [],
          isSelected: true,
          isOption: true,
          timestamp: Date.now()
        };
        
        // Mettre à jour les enfants du nœud courant
        const updatedCurrentNode = {
          ...currentNode,
          children: [...currentNode.children, newOptionId]
        };
        
        return {
          ...prevTree,
          nodes: {
            ...prevTree.nodes,
            [prevTree.currentNodeId]: updatedCurrentNode,
            [newOptionId]: newOption
          },
          currentNodeId: newOptionId
        };
      } else {
        // Option trouvée, la marquer comme sélectionnée
        return {
          ...prevTree,
          nodes: {
            ...prevTree.nodes,
            [optionNode.id]: {
              ...optionNode,
              isSelected: true
            }
          },
          currentNodeId: optionNode.id
        };
      }
    });
  }, []);
  
  // Réinitialiser l'arbre de décision
  const resetDecisionTree = useCallback(() => {
    const newTree: DecisionTree = {
      nodes: {},
      rootId: null,
      currentNodeId: null,
      sessionId: uuidv4()
    };
    
    setDecisionTree(newTree);
    localStorage.removeItem(DECISION_TREE_STORAGE_KEY);
  }, []);
  
  return {
    decisionTree,
    addBotMessage,
    selectOption,
    resetDecisionTree,
    isTreePanelOpen,
    setIsTreePanelOpen
  };
}