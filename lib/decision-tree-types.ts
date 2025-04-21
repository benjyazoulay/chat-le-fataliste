// Types pour l'arbre de décision
export interface DecisionNode {
    id: string;           // Identifiant unique du nœud
    content: string;      // Texte du choix ou contenu du message du bot
    parentId: string | null; // ID du nœud parent (null pour le nœud racine)
    children: string[];   // IDs des options/réponses disponibles à partir de ce nœud
    isSelected: boolean;  // Si ce nœud a été choisi par l'utilisateur
    isOption: boolean;    // Si ce nœud est une option (choix possible) ou un message de l'assistant
    timestamp: number;    // Horodatage pour l'ordre d'affichage
  }
  
  export interface DecisionTree {
    nodes: Record<string, DecisionNode>; // Map de tous les nœuds par ID
    rootId: string | null;               // ID du nœud racine
    currentNodeId: string | null;        // ID du nœud courant (dernier message)
    sessionId: string;                   // ID unique de la session courante
  }
  
  // Constantes pour le stockage
  export const DECISION_TREE_STORAGE_KEY = "chat_le_fataliste_decision_tree";