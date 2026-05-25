import { useState, useEffect, useCallback } from "react";
import { DecisionTree, DecisionNode, DECISION_TREE_STORAGE_KEY } from "@/lib/decision-tree-types";
import { v4 as uuidv4 } from 'uuid';

export function useDecisionTree() {
  const [decisionTree, setDecisionTree] = useState<DecisionTree>({
    nodes: {},
    rootId: null,
    currentNodeId: null,
    sessionId: uuidv4()
  });
  
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
        resetDecisionTree();
      }
    }
  }, []);
  
  // Sauvegarder l'arbre dans le localStorage quand il change
  useEffect(() => {
    if (decisionTree.rootId) {
      localStorage.setItem(DECISION_TREE_STORAGE_KEY, JSON.stringify(decisionTree));
    }
  }, [decisionTree]);
  
  // Ajouter un message du bot à l'arbre
  const addBotMessage = useCallback((content: string, options: string[]) => {
    setDecisionTree(prevTree => {
      const newNodeId = uuidv4();
      const timestamp = Date.now();
      const parentId = prevTree.currentNodeId;

      const newNode: DecisionNode = {
        id: newNodeId,
        content,
        parentId: parentId,
        children: [],
        isSelected: true,
        isOption: false,
        timestamp
      };

      const optionNodes: Record<string, DecisionNode> = {};
      const optionIds: string[] = [];

      options.forEach((option, index) => {
        const optionId = uuidv4();
        optionIds.push(optionId);

        optionNodes[optionId] = {
          id: optionId,
          content: option,
          parentId: newNodeId,
          children: [],
          isSelected: false,
          isOption: true,
          timestamp: timestamp + index + 1
        };
      });

      newNode.children = optionIds;

      const updatedNodes = {
        ...prevTree.nodes,
        [newNodeId]: newNode,
        ...optionNodes
      };

      if (parentId && updatedNodes[parentId]) {
        const parentNode = updatedNodes[parentId];
        if (!parentNode.children.includes(newNodeId)) {
          updatedNodes[parentId] = {
            ...parentNode,
            children: [...parentNode.children, newNodeId],
          };
        }
      }

      const rootId = prevTree.rootId || newNodeId;

      return {
        ...prevTree,
        nodes: updatedNodes,
        rootId,
        currentNodeId: newNodeId
      };
    });
  }, []);
  
  // Sélectionner une option (existante ou personnalisée)
  const selectOption = useCallback((optionContent: string, isCustom: boolean = false) => {
    setDecisionTree(prevTree => {
      if (!prevTree.currentNodeId) return prevTree;
      
      const currentNode = prevTree.nodes[prevTree.currentNodeId];
      
      // Chercher si l'option existe déjà
      const existingOption = Object.values(prevTree.nodes)
        .find(node => 
          node.parentId === currentNode.id && 
          node.content === optionContent &&
          node.isOption
        );
      
      if (existingOption) {
        // Option trouvée, la marquer comme sélectionnée
        return {
          ...prevTree,
          nodes: {
            ...prevTree.nodes,
            [existingOption.id]: {
              ...existingOption,
              isSelected: true
            }
          },
          currentNodeId: existingOption.id
        };
      } else {
        // Nouvelle option (personnalisée), l'ajouter à l'arbre
        const newOptionId = uuidv4();
        const newOption: DecisionNode = {
          id: newOptionId,
          content: optionContent,
          parentId: prevTree.currentNodeId,
          children: [],
          isSelected: true,
          isOption: true,
          isCustom: isCustom,
          timestamp: Date.now()
        };
        
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
      }
    });
  }, []);

  // Naviguer vers un nœud spécifique (pour revenir en arrière)
  const navigateToNode = useCallback((nodeId: string) => {
    setDecisionTree(prevTree => {
      const node = prevTree.nodes[nodeId];
      if (!node) return prevTree;

      // Si c'est une option, on la sélectionne
      if (node.isOption) {
        // Désélectionner les autres options du même parent
        const updatedNodes = { ...prevTree.nodes };
        const parentNode = node.parentId ? prevTree.nodes[node.parentId] : null;
        
        if (parentNode) {
          parentNode.children.forEach(childId => {
            const child = updatedNodes[childId];
            if (child && child.isOption && child.id !== nodeId) {
              updatedNodes[childId] = { ...child, isSelected: false };
            }
          });
        }
        
        // Sélectionner cette option
        updatedNodes[nodeId] = { ...node, isSelected: true };
        
        return {
          ...prevTree,
          nodes: updatedNodes,
          currentNodeId: nodeId
        };
      }
      
      // Si c'est un message bot, on y navigue simplement
      return {
        ...prevTree,
        currentNodeId: nodeId
      };
    });
  }, []);

  // Obtenir le chemin actuel depuis la racine
  const getCurrentPath = useCallback((): string[] => {
    const path: string[] = [];
    let currentId = decisionTree.currentNodeId;
    
    while (currentId) {
      path.unshift(currentId);
      const node = decisionTree.nodes[currentId];
      currentId = node?.parentId || null;
    }
    
    return path;
  }, [decisionTree]);

  // Obtenir les messages pour reconstruire le chat depuis un nœud
  const getMessagesFromPath = useCallback((targetNodeId: string): Array<{role: 'user' | 'assistant', content: string}> => {
    const messages: Array<{role: 'user' | 'assistant', content: string}> = [];
    const path: DecisionNode[] = [];
    
    // Construire le chemin depuis la racine jusqu'au nœud cible
    let currentId: string | null = targetNodeId;
    while (currentId) {
      const node = decisionTree.nodes[currentId];
      if (node) {
        path.unshift(node);
        currentId = node.parentId;
      } else {
        break;
      }
    }
    
    // Convertir le chemin en messages
    path.forEach(node => {
      if (node.isOption) {
        messages.push({ role: 'user', content: node.content });
      } else {
        messages.push({ role: 'assistant', content: node.content });
      }
    });
    
    return messages;
  }, [decisionTree]);

  // Obtenir les options disponibles pour un nœud de message bot
  const getOptionsForNode = useCallback((nodeId: string): DecisionNode[] => {
    const node = decisionTree.nodes[nodeId];
    if (!node || node.isOption) return [];
    
    return node.children
      .map(childId => decisionTree.nodes[childId])
      .filter((child): child is DecisionNode => child !== undefined && child.isOption)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [decisionTree]);
  
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
    navigateToNode,
    getCurrentPath,
    getMessagesFromPath,
    getOptionsForNode,
    resetDecisionTree,
    isTreePanelOpen,
    setIsTreePanelOpen
  };
}
