"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { StoryOptions } from "@/components/chat/story-options";
import { SettingsSheet } from "@/components/ui/settings-drawer";
import { DecisionTreePanel } from "@/components/ui/decision-tree-panel";
import { useToast } from "@/hooks/use-toast";
import { useChat, Message } from "ai/react";
import { useDecisionTree } from "@/hooks/use-decision-tree";
import jsPDF from "jspdf";
import { DECISION_TREE_STORAGE_KEY } from "@/lib/decision-tree-types";
import { cn } from "@/lib/utils";

import {
  KNOWN_STYLES, STYLE_DESCRIPTIONS,
  KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS,
  KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS,
  KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS,
  KNOWN_PERSONS, PERSON_DESCRIPTIONS,
  KNOWN_TENSES, TENSE_DESCRIPTIONS,
  KNOWN_GENRES, GENRE_DESCRIPTIONS,
} from "@/lib/narrative-constants";

const DEFAULT_STYLE = "diderot";
const DEFAULT_PERSONALITY = "playful";
const DEFAULT_GENRE = "conte_philosophique";
const DEFAULT_RELATION = "heterodiegetic";
const DEFAULT_FOCALIZATION = "zero";
const DEFAULT_PERSON = "third_person";
const DEFAULT_TENSE = "past";

export default function Chat() {
  const { toast } = useToast();

  // Decision tree hook
  const {
    decisionTree,
    addBotMessage,
    selectOption,
    navigateToNode,
    getCurrentPath,
    getMessagesFromPath,
    getOptionsForNode,
    resetDecisionTree,
    isTreePanelOpen,
    setIsTreePanelOpen,
  } = useDecisionTree();

  // Settings state
  const [apiKey, setApiKey] = useState("");
  const [literaryStyle, setLiteraryStyle] = useState(DEFAULT_STYLE);
  const [styleDescription, setStyleDescription] = useState("");
  const [narratorPersonality, setNarratorPersonality] = useState(DEFAULT_PERSONALITY);
  const [personalityDescription, setPersonalityDescription] = useState("");
  const [literaryGenre, setLiteraryGenre] = useState(DEFAULT_GENRE);
  const [genreDescription, setGenreDescription] = useState("");
  const [narratorRelation, setNarratorRelation] = useState(DEFAULT_RELATION);
  const [narratorRelationDescription, setNarratorRelationDescription] = useState("");
  const [focalization, setFocalization] = useState(DEFAULT_FOCALIZATION);
  const [focalizationDescription, setFocalizationDescription] = useState("");
  const [narrativePerson, setNarrativePerson] = useState(DEFAULT_PERSON);
  const [narrativePersonDescription, setNarrativePersonDescription] = useState("");
  const [narrativeTense, setNarrativeTense] = useState(DEFAULT_TENSE);
  const [narrativeTenseDescription, setNarrativeTenseDescription] = useState("");

  // UI state
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [storyOptions, setStoryOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generate system message content
  const generateSystemMessage = useCallback(() => {
    return `
Tu es un maitre ecrivain charge de generer une histoire interactive.
Ta mission ABSOLUE est de te conformer STRICTEMENT aux directives suivantes :

1.  **STYLE LITTERAIRE IMPERATIF :** Adopte *uniquement* et *precisement* le style litteraire de **${literaryStyle}**. Chaque phrase doit refleter ce style. Definition: "${styleDescription}". NE PAS devier.
2.  **GENRE LITTERAIRE IMPERATIF :** L'histoire doit etre *exclusivement* de type **${literaryGenre}**, defini comme : "${genreDescription}". Respecte ce genre a chaque instant.
3.  **RELATION NARRATEUR/HISTOIRE IMPERATIVE (Voix) :** Le narrateur doit etre **${narratorRelation}**. Cela signifie : "${narratorRelationDescription}". Respecte ce positionnement.
4.  **FOCALISATION IMPERATIVE (Perspective) :** La perspective narrative doit etre **${focalization}**. Cela signifie : "${focalizationDescription}". Respecte ce point de vue.
5.  **PERSONNE NARRATIVE IMPERATIVE :** La narration doit utiliser la **${narrativePerson}**. Cela signifie : "${narrativePersonDescription}". Respecte ce choix grammatical.
6.  **TEMPS NARRATIF IMPERATIF :** Le temps principal de la narration doit etre le **${narrativeTense}**. Cela signifie : "${narrativeTenseDescription}". Respecte ce temps dominant.
7.  **PERSONNALITE DU NARRATEUR IMPERATIVE :** Le narrateur doit incarner la personnalite **${narratorPersonality}**, decrite comme : "${personalityDescription}". Son ton et ses remarques (si permises par la relation et la focalisation) doivent correspondre.
8.  **INTERDICTION FORMELLE D'INTERACTION DIRECTE :** NE JAMAIS, sous aucun pretexte, t'adresser au lecteur/utilisateur avec des phrases comme "Que choisissez-vous ?", "Et vous, lecteur...", "Imaginez que...", ou des questions directes sur ses intentions. Le recit doit rester immersif.
9.  **INTERDICTION FORMELLE DE QUESTIONS :** NE JAMAIS poser de questions directes a l'utilisateur a la fin de ta reponse ou ailleurs.
10. **PROPOSITION D'OPTIONS NARRATIVES :** A la *toute fin* de CHAQUE reponse, propose 2 ou 3 options narratives claires et distinctes pour la suite de l'histoire.
11. **FORMAT DES OPTIONS :** Presente ces options UNIQUEMENT sous forme de liste numerotee (1., 2., 3.). Chaque option doit etre une phrase complete decrivant une action ou un developpement potentiel. N'ajoute AUCUNE phrase d'introduction avant la liste (pas de "Voici les options:", "Que faire ensuite:", etc.). Commence directement par "1. ...".
12. **CONTENU DU RECIT :** Concentre-toi sur l'avancement de l'histoire, les descriptions, les pensees des personnages (si la focalisation le permet), et les evenements, tout en respectant le style, le genre, la voix, la perspective, la personne, le temps et la personnalite definis.

Verifie ta reponse avant de la finaliser pour t'assurer qu'elle respecte TOUTES ces instructions a la lettre.
    `;
  }, [
    literaryStyle, styleDescription,
    narratorPersonality, personalityDescription,
    literaryGenre, genreDescription,
    narratorRelation, narratorRelationDescription,
    focalization, focalizationDescription,
    narrativePerson, narrativePersonDescription,
    narrativeTense, narrativeTenseDescription,
  ]);

  // Load settings from localStorage
  const loadSettings = useCallback(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    setApiKey(savedApiKey || "");

    if (!savedApiKey) {
      toast({
        title: "Cle API manquante",
        description: "Veuillez configurer votre cle API OpenAI dans les parametres.",
        variant: "destructive",
      });
    }

    const getSetting = (key: string, defaultValue: string): [string, string] => {
      const savedValue = localStorage.getItem(key) || defaultValue;
      const savedDesc = localStorage.getItem(`${key}_description`) || "";
      let description = savedDesc;
      if (!description) {
        if (key === "literary_style") description = STYLE_DESCRIPTIONS[savedValue] || savedValue;
        else if (key === "narrator_personality") description = PERSONALITY_DESCRIPTIONS[savedValue] || savedValue;
        else if (key === "literary_genre") description = GENRE_DESCRIPTIONS[savedValue] || savedValue;
        else if (key === "narrator_relation") description = NARRATOR_RELATION_DESCRIPTIONS[savedValue] || savedValue;
        else if (key === "focalization") description = FOCALIZATION_DESCRIPTIONS[savedValue] || savedValue;
        else if (key === "narrative_person") description = PERSON_DESCRIPTIONS[savedValue] || savedValue;
        else if (key === "narrative_tense") description = TENSE_DESCRIPTIONS[savedValue] || savedValue;
        else description = savedValue;
      }
      return [savedValue, description];
    };

    const [style, styleDesc] = getSetting("literary_style", DEFAULT_STYLE);
    setLiteraryStyle(style);
    setStyleDescription(styleDesc);

    const [personality, personalityDesc] = getSetting("narrator_personality", DEFAULT_PERSONALITY);
    setNarratorPersonality(personality);
    setPersonalityDescription(personalityDesc);

    const [genre, genreDesc] = getSetting("literary_genre", DEFAULT_GENRE);
    setLiteraryGenre(genre);
    setGenreDescription(genreDesc);

    const [relation, relationDesc] = getSetting("narrator_relation", DEFAULT_RELATION);
    setNarratorRelation(relation);
    setNarratorRelationDescription(relationDesc);

    const [foc, focDesc] = getSetting("focalization", DEFAULT_FOCALIZATION);
    setFocalization(foc);
    setFocalizationDescription(focDesc);

    const [person, personDesc] = getSetting("narrative_person", DEFAULT_PERSON);
    setNarrativePerson(person);
    setNarrativePersonDescription(personDesc);

    const [tense, tenseDesc] = getSetting("narrative_tense", DEFAULT_TENSE);
    setNarrativeTense(tense);
    setNarrativeTenseDescription(tenseDesc);

    setSettingsLoaded(true);
  }, [toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSettingsSaved = useCallback(() => {
    loadSettings();
    toast({
      title: "Parametres mis a jour",
      description: "Les nouveaux parametres seront appliques a la prochaine interaction.",
    });
    window.location.reload();
  }, [loadSettings, toast]);

  // Parse options from bot message
  const parseOptionsFromMessage = useCallback((content: string): { cleanedContent: string; options: string[] } => {
    const options: string[] = [];
    const optionRegex = /\d+\.\s+(.*?)(?=\n\d+\.|\n\n|$)/gs;
    let match;
    let cleanedContent = content;

    while ((match = optionRegex.exec(content)) !== null) {
      if (match[1]) {
        options.push(match[1].trim());
        cleanedContent = cleanedContent.replace(match[0], "").trim();
      }
    }

    cleanedContent = cleanedContent.replace(/Que (?:voulez|souhaitez|preferez)[^?]*\?/gi, "");
    cleanedContent = cleanedContent.replace(/Que (?:choisissez|decidez)[^?]*\?/gi, "");
    cleanedContent = cleanedContent.replace(/(?:Voici|Voila)(?: quelques)? options[^:]*:/gi, "");
    cleanedContent = cleanedContent.replace(/(?:Choisissez|Selectionnez)[^:]*:/gi, "");
    cleanedContent = cleanedContent.replace(/Mais peut-etre est-ce vous, lecteur[^.]*\./gi, "");
    cleanedContent = cleanedContent.replace(/[^.]*lecteur[^.]*\./gi, "");
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

    return { cleanedContent: cleanedContent || content, options };
  }, []);

  // Initialize chat with AI SDK
  const { messages, input, handleInputChange, handleSubmit, setMessages, append, isLoading } = useChat({
    api: "/api/chat",
    headers: {
      "x-api-key": apiKey,
    },
    body: {
      literaryStyle, styleDescription,
      narratorPersonality, personalityDescription,
      literaryGenre, genreDescription,
      narratorRelation, narratorRelationDescription,
      focalization, focalizationDescription,
      narrativePerson, narrativePersonDescription,
      narrativeTense, narrativeTenseDescription,
    },
    initialMessages: [],
    onFinish: (message) => {
      setIsSubmitting(false);
      const { cleanedContent, options } = parseOptionsFromMessage(message.content);

      if (options.length > 0 || !message.content.match(/\d+\.\s+/)) {
        addBotMessage(cleanedContent, options);
      }

      setStoryOptions(options);

      if (cleanedContent !== message.content && messages.length > 0) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastAssistantIndex = updatedMessages.map((m) => m.role).lastIndexOf("assistant");
          if (lastAssistantIndex !== -1) {
            updatedMessages[lastAssistantIndex] = {
              ...updatedMessages[lastAssistantIndex],
              content: cleanedContent,
            };
          }
          return updatedMessages;
        });
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la communication avec l'API.",
        variant: "destructive",
      });
    },
  });

  // Generate initial system message
  useEffect(() => {
    const allDescriptionsAvailable =
      styleDescription &&
      personalityDescription &&
      genreDescription &&
      narratorRelationDescription &&
      focalizationDescription &&
      narrativePersonDescription &&
      narrativeTenseDescription;

    if (settingsLoaded && apiKey && isFirstMessage && allDescriptionsAvailable && messages.length === 0) {
      const persistedTree = localStorage.getItem(DECISION_TREE_STORAGE_KEY);
      if (persistedTree) {
        resetDecisionTree();
      }
      setIsFirstMessage(false);

      const systemMessage = {
        id: `system-${Date.now()}`,
        role: "system" as const,
        content: generateSystemMessage(),
      };

      setMessages([systemMessage]);
    }
  }, [
    resetDecisionTree,
    messages.length,
    settingsLoaded,
    apiKey,
    isFirstMessage,
    setMessages,
    generateSystemMessage,
    styleDescription,
    personalityDescription,
    genreDescription,
    narratorRelationDescription,
    focalizationDescription,
    narrativePersonDescription,
    narrativeTenseDescription,
  ]);

  // Handle navigation to a different branch in the tree
  const handleNavigateToNode = useCallback((nodeId: string) => {
    const node = decisionTree.nodes[nodeId];
    if (!node) return;

    // Navigate in the tree
    navigateToNode(nodeId);

    // Rebuild messages from this path
    const pathMessages = getMessagesFromPath(nodeId);
    
    // Create new messages array with system message + path messages
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: "system" as const,
      content: generateSystemMessage(),
    };

    const newMessages: Message[] = [systemMessage];
    
    pathMessages.forEach((msg, index) => {
      newMessages.push({
        id: `msg-${Date.now()}-${index}`,
        role: msg.role,
        content: msg.content,
      });
    });

    setMessages(newMessages);

    // Update story options based on the current position
    // If we navigated to an option, look for its children (should be bot messages with options)
    // If we navigated to a bot message, get its options
    if (node.isOption) {
      // Check if this option has children (bot responses)
      const botChildId = node.children.find(childId => {
        const child = decisionTree.nodes[childId];
        return child && !child.isOption;
      });

      if (botChildId) {
        const botChild = decisionTree.nodes[botChildId];
        if (botChild) {
          const options = getOptionsForNode(botChildId);
          setStoryOptions(options.map(o => o.content));
        }
      } else {
        // No bot response yet for this option, need to generate one
        setStoryOptions([]);
        setIsSubmitting(true);
        // The message is already in the chat, so we append a request for continuation
        append({ role: "user", content: node.content });
      }
    } else {
      // It's a bot message, get its options
      const options = getOptionsForNode(nodeId);
      setStoryOptions(options.map(o => o.content));
    }

    // Close the panel
    setIsTreePanelOpen(false);

    toast({
      title: "Navigation dans l'histoire",
      description: "Vous explorez maintenant une autre branche narrative.",
    });
  }, [
    decisionTree.nodes,
    navigateToNode,
    getMessagesFromPath,
    getOptionsForNode,
    generateSystemMessage,
    setMessages,
    append,
    setIsTreePanelOpen,
    toast,
  ]);

  // Handlers
  const selectOptionHandler = (option: string) => {
    if (isSubmitting || isLoading) return;
    setIsSubmitting(true);
    setStoryOptions([]);
    selectOption(option, false);
    append({ role: "user", content: option });
  };

  const handleResetChat = () => {
    resetDecisionTree();
    setMessages([]);
    setStoryOptions([]);
    setIsFirstMessage(true);
    toast({ title: "Conversation reinitialisee." });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isLoading || !input.trim()) return;
    
    const customInput = input.trim();
    setIsSubmitting(true);
    setStoryOptions([]);
    
    // Mark as custom option in the tree
    selectOption(customInput, true);
    
    handleSubmit(e);
  };

  const copyResponses = () => {
    const assistantMessages = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content)
      .join("\n\n");
    if (!assistantMessages) {
      toast({ title: "Aucune reponse a copier.", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(assistantMessages).then(() => {
      toast({
        title: "Recit copie",
        description: "Le recit a ete copie dans le presse-papier.",
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le recit.",
      });
    });
  };

  const downloadPdf = () => {
    const assistantMessages = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content);

    if (assistantMessages.length === 0) {
      toast({ title: "Aucune reponse a telecharger.", variant: "destructive" });
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let cursorY = 40;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 40;
    const lineSpacing = 6;
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    assistantMessages.forEach((text) => {
      const lines = doc.splitTextToSize(text, 500);
      const textBlockHeight = lines.length * (doc.getFontSize() + lineSpacing);

      if (cursorY + textBlockHeight > pageHeight - marginBottom) {
        doc.addPage();
        cursorY = 40;
      }

      doc.text(lines, 40, cursorY);
      cursorY += textBlockHeight + 10;
    });
    doc.save("Chat_le_Fataliste_Recit.pdf");
  };

  const currentPath = getCurrentPath();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DecisionTreePanel
        decisionTree={decisionTree}
        isOpen={isTreePanelOpen}
        setIsOpen={setIsTreePanelOpen}
        onNavigateToNode={handleNavigateToNode}
        currentPath={currentPath}
      >
        <span />
      </DecisionTreePanel>

      <SettingsSheet onSettingsSaved={handleSettingsSaved} open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <span />
      </SettingsSheet>

      <ChatHeader
        onReset={handleResetChat}
        onCopy={copyResponses}
        onDownload={downloadPdf}
        onOpenTree={() => setIsTreePanelOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 container max-w-4xl mx-auto py-4 px-4 flex flex-col">
        <div className={cn(
          "bg-card rounded-xl shadow-soft border border-border",
          "flex flex-col flex-1 overflow-hidden"
        )}>
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
          />

          {storyOptions.length > 0 && !isLoading && (
            <StoryOptions
              options={storyOptions}
              isExpanded={isOptionsExpanded}
              onToggle={() => setIsOptionsExpanded(!isOptionsExpanded)}
              onSelect={selectOptionHandler}
              disabled={isSubmitting || isLoading}
            />
          )}

          <div className="p-4 border-t border-border bg-background/50">
            <ChatInput
              value={input}
              onChange={handleInputChange}
              onSubmit={handleFormSubmit}
              disabled={isSubmitting || isLoading}
              hasOptions={storyOptions.length > 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
