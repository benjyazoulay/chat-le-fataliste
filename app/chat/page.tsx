"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsSheet } from "@/components/ui/settings-drawer";
import { DecisionTreePanel } from "@/components/ui/decision-tree-panel"; // Import du nouveau composant
import {
  Send,
  Settings,
  Sparkles,
  Download,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "ai/react";
import { useDecisionTree } from "@/hooks/use-decision-tree"; // Import du hook personnalisé
import jsPDF from "jspdf";
import clsx from "clsx";
import { DECISION_TREE_STORAGE_KEY } from "@/lib/decision-tree-types";

// --- Constants and Imports --- (keep as is)
import {
    KNOWN_STYLES, STYLE_DESCRIPTIONS,
    KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS, PERSONALITY_DISPLAY_NAMES,
    KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS, NARRATOR_RELATION_DISPLAY_NAMES,
    KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS, FOCALIZATION_DISPLAY_NAMES,
    KNOWN_PERSONS, PERSON_DESCRIPTIONS, PERSON_DISPLAY_NAMES,
    KNOWN_TENSES, TENSE_DESCRIPTIONS, TENSE_DISPLAY_NAMES,
    KNOWN_GENRES, GENRE_DESCRIPTIONS, GENRE_DISPLAY_NAMES
  } from "@/lib/narrative-constants";

const DEFAULT_STYLE = "diderot";
const DEFAULT_PERSONALITY = "playful";
const DEFAULT_GENRE = "conte_philosophique";
const DEFAULT_RELATION = "heterodiegetic";
const DEFAULT_FOCALIZATION = "zero";
const DEFAULT_PERSON = "third_person";
const DEFAULT_TENSE = "past";
// --- End Constants ---

export default function Chat() {
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook pour l'arbre de décision
  const {
    decisionTree,
    addBotMessage,
    selectOption,
    resetDecisionTree,
    isTreePanelOpen,
    setIsTreePanelOpen,
  } = useDecisionTree();

  // State (keep as is)
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
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [storyOptions, setStoryOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false); // Flag
  const [isExpanded, setIsExpanded] = useState(true); // State for options expansion

  // --- loadSettings, handleSettingsSaved, useChat setup, useEffects, handlers (keep as is) ---
    // (Assuming these parts are correct based on the previous context)
  const loadSettings = useCallback(() => {
        console.log("Chat component: Loading settings from localStorage...");
        const savedApiKey = localStorage.getItem("openai_api_key")
        setApiKey(savedApiKey || ""); // Set API key state

        if (!savedApiKey) {
             toast({
                title: "Clé API manquante",
                description: "Veuillez configurer votre clé API OpenAI dans les paramètres (icône engrenage).",
                variant: "destructive",
            })
            // Don't redirect, allow user to open drawer
        }

        const getSetting = (key: string, defaultValue: string): [string, string] => {
            const savedValue = localStorage.getItem(key) || defaultValue;
            const savedDesc = localStorage.getItem(`${key}_description`) || "";
            // Attempt to get a default description if savedDesc is missing
            let description = savedDesc;
            if (!description) {
                // Need to access the correct description map based on the key
                // This is a bit verbose, could be refactored with a map of maps
                if (key === 'literary_style') description = STYLE_DESCRIPTIONS[savedValue] || savedValue;
                else if (key === 'narrator_personality') description = PERSONALITY_DESCRIPTIONS[savedValue] || savedValue;
                else if (key === 'literary_genre') description = GENRE_DESCRIPTIONS[savedValue] || savedValue;
                else if (key === 'narrator_relation') description = NARRATOR_RELATION_DESCRIPTIONS[savedValue] || savedValue;
                else if (key === 'focalization') description = FOCALIZATION_DESCRIPTIONS[savedValue] || savedValue;
                else if (key === 'narrative_person') description = PERSON_DESCRIPTIONS[savedValue] || savedValue;
                else if (key === 'narrative_tense') description = TENSE_DESCRIPTIONS[savedValue] || savedValue;
                else description = savedValue; // Fallback to the value itself
            }
            // console.log(`Loaded ${key}: ${savedValue}, Desc: ${description}`);
            return [savedValue, description];
        };

        const [style, styleDesc] = getSetting("literary_style", DEFAULT_STYLE);
        setLiteraryStyle(style); setStyleDescription(styleDesc);

        const [personality, personalityDesc] = getSetting("narrator_personality", DEFAULT_PERSONALITY);
        setNarratorPersonality(personality); setPersonalityDescription(personalityDesc);

        const [genre, genreDesc] = getSetting("literary_genre", DEFAULT_GENRE);
        setLiteraryGenre(genre); setGenreDescription(genreDesc);

        const [relation, relationDesc] = getSetting("narrator_relation", DEFAULT_RELATION);
        setNarratorRelation(relation); setNarratorRelationDescription(relationDesc);

        const [foc, focDesc] = getSetting("focalization", DEFAULT_FOCALIZATION);
        setFocalization(foc); setFocalizationDescription(focDesc);

        const [person, personDesc] = getSetting("narrative_person", DEFAULT_PERSON);
        setNarrativePerson(person); setNarrativePersonDescription(personDesc);

        const [tense, tenseDesc] = getSetting("narrative_tense", DEFAULT_TENSE);
        setNarrativeTense(tense); setNarrativeTenseDescription(tenseDesc);

        setSettingsLoaded(true); // Mark settings as loaded
        console.log("Chat component: Settings loaded.");

    }, [toast]); // Added toast as dependency

    // Load settings on initial mount
    useEffect(() => {
        loadSettings();
    }, [loadSettings]); // Depend on the memoized loadSettings function

    // Callback function passed to the drawer
    const handleSettingsSaved = useCallback(() => {
        console.log("Chat component: Settings saved callback triggered. Reloading settings...");
        loadSettings(); // Reload settings from localStorage into Chat state
        // Optional: Display a toast or message indicating settings are updated for the next turn
        toast({ title: "Paramètres mis à jour", description:"Les nouveaux paramètres seront appliqués à la prochaine interaction."});
        // Resetting the system prompt or chat history here can be complex.
        // For simplicity, the next API call will use the updated settings implicitly
        // where possible (e.g., apiKey in headers, potentially others if API endpoint reads them).
        // The *displayed* system message will remain the original one unless manually updated.
        window.location.reload();
    }, [loadSettings, toast]);

    // Initialize chat with AI SDK
    const { messages, input, handleInputChange, handleSubmit, setMessages, append, isLoading } = useChat({
        api: "/api/chat",
        // Headers are now dynamic based on the apiKey state
        headers: {
            "x-api-key": apiKey,
        },
        // Pass settings in the body for the API route to use
        body: {
            literaryStyle, styleDescription,
            narratorPersonality, personalityDescription,
            literaryGenre, genreDescription,
            narratorRelation, narratorRelationDescription,
            focalization, focalizationDescription,
            narrativePerson, narrativePersonDescription,
            narrativeTense, narrativeTenseDescription
        },
        initialMessages: [],
        onFinish: (message) => { // message is the AI's response
            setIsSubmitting(false);
            // Process message *after* it's fully received and loading stops
            const lastMessageContent = message.content;
            const options: string[] = [];
            const optionRegex = /\d+\.\s+(.*?)(?=\n\d+\.|\n\n|$)/gs;
            let match;
            let cleanedContent = lastMessageContent;

            while ((match = optionRegex.exec(lastMessageContent)) !== null) {
                if (match[1]) {
                    options.push(match[1].trim());
                    cleanedContent = cleanedContent.replace(match[0], "").trim();
                }
            }

             // Additional Cleaning (optional, apply if needed)
            cleanedContent = cleanedContent.replace(/Que (?:voulez|souhaitez|préférez)[^?]*\?/gi, "");
            cleanedContent = cleanedContent.replace(/Que (?:choisissez|décidez)[^?]*\?/gi, "");
            cleanedContent = cleanedContent.replace(/(?:Voici|Voilà)(?: quelques)? options[^:]*:/gi, "");
            cleanedContent = cleanedContent.replace(/(?:Choisissez|Sélectionnez)[^:]*:/gi, "");
            cleanedContent = cleanedContent.replace(/Mais peut-être est-ce vous, lecteur[^.]*\./gi, "");
            cleanedContent = cleanedContent.replace(/[^.]*lecteur[^.]*\./gi, ""); // More general reader address removal
            cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n").trim(); // Trim trailing/leading whitespace again


            // Update Decision Tree
            if (options.length > 0 || !lastMessageContent.match(/\d+\.\s+/)) { // Add even if no options (end node)
                addBotMessage(cleanedContent || lastMessageContent, options); // Use original if cleaning removed everything
            }

            // Update UI State
            setStoryOptions(options);

            // Update the last message in the state if cleaning occurred
             if (cleanedContent !== lastMessageContent && messages.length > 0) {
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages];
                    // Find the actual last assistant message to update
                    const lastAssistantIndex = updatedMessages.map(m => m.role).lastIndexOf('assistant');
                    if(lastAssistantIndex !== -1) {
                         updatedMessages[lastAssistantIndex] = {
                            ...updatedMessages[lastAssistantIndex],
                            content: cleanedContent || lastMessageContent, // Use original if empty
                         };
                    }
                    return updatedMessages;
                });
            }
        },
        onError: (error) => {
            setIsSubmitting(false)
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la communication avec l'API.",
                variant: "destructive",
            })
        },
    })

    // Generate and set the *initial* system message once settings are loaded
    useEffect(() => {
        // Ensure all required settings and descriptions are loaded AND it's the first message
        const allDescriptionsAvailable = styleDescription && personalityDescription && genreDescription && narratorRelationDescription && focalizationDescription && narrativePersonDescription && narrativeTenseDescription;

        if (settingsLoaded && apiKey && isFirstMessage && allDescriptionsAvailable && messages.length === 0) { // Ensure messages is empty too
            console.log("Chat component: Setting initial system prompt.");
            const persistedTree = localStorage.getItem(DECISION_TREE_STORAGE_KEY);
            if (persistedTree) {
                console.log("Chat component: Found persisted decision tree while chat is empty. Resetting tree.");
                resetDecisionTree(); // Reset the tree state and clear localStorage for it
            }
            setIsFirstMessage(false) // Prevent this from running again

            const systemMessageContent = `
Tu es un maître écrivain chargé de générer une histoire interactive.
Ta mission ABSOLUE est de te conformer STRICTEMENT aux directives suivantes :

1.  **STYLE LITTÉRAIRE IMPÉRATIF :** Adopte *uniquement* et *précisément* le style littéraire de **${literaryStyle}**. Chaque phrase doit refléter ce style. Définition: "${styleDescription}". NE PAS dévier.
2.  **GENRE LITTÉRAIRE IMPÉRATIF :** L'histoire doit être *exclusivement* de type **${literaryGenre}**, défini comme : "${genreDescription}". Respecte ce genre à chaque instant.
3.  **RELATION NARRATEUR/HISTOIRE IMPÉRATIVE (Voix) :** Le narrateur doit être **${narratorRelation}**. Cela signifie : "${narratorRelationDescription}". Respecte ce positionnement.
4.  **FOCALISATION IMPÉRATIVE (Perspective) :** La perspective narrative doit être **${focalization}**. Cela signifie : "${focalizationDescription}". Respecte ce point de vue.
5.  **PERSONNE NARRATIVE IMPÉRATIVE :** La narration doit utiliser la **${narrativePerson}**. Cela signifie : "${narrativePersonDescription}". Respecte ce choix grammatical.
6.  **TEMPS NARRATIF IMPÉRATIF :** Le temps principal de la narration doit être le **${narrativeTense}**. Cela signifie : "${narrativeTenseDescription}". Respecte ce temps dominant.
7.  **PERSONNALITÉ DU NARRATEUR IMPÉRATIVE :** Le narrateur doit incarner la personnalité **${narratorPersonality}**, décrite comme : "${personalityDescription}". Son ton et ses remarques (si permises par la relation et la focalisation) doivent correspondre.
8.  **INTERDICTION FORMELLE D'INTERACTION DIRECTE :** NE JAMAIS, sous aucun prétexte, t'adresser au lecteur/utilisateur avec des phrases comme "Que choisissez-vous ?", "Et vous, lecteur...", "Imaginez que...", ou des questions directes sur ses intentions. Le récit doit rester immersif.
9.  **INTERDICTION FORMELLE DE QUESTIONS :** NE JAMAIS poser de questions directes à l'utilisateur à la fin de ta réponse ou ailleurs.
10. **PROPOSITION D'OPTIONS NARRATIVES :** À la *toute fin* de CHAQUE réponse, propose 2 ou 3 options narratives claires et distinctes pour la suite de l'histoire.
11. **FORMAT DES OPTIONS :** Présente ces options UNIQUEMENT sous forme de liste numérotée (1., 2., 3.). Chaque option doit être une phrase complète décrivant une action ou un développement potentiel. N'ajoute AUCUNE phrase d'introduction avant la liste (pas de "Voici les options:", "Que faire ensuite:", etc.). Commence directement par "1. ...".
12. **CONTENU DU RÉCIT :** Concentre-toi sur l'avancement de l'histoire, les descriptions, les pensées des personnages (si la focalisation le permet), et les événements, tout en respectant le style, le genre, la voix, la perspective, la personne, le temps et la personnalité définis.

Vérifie ta réponse avant de la finaliser pour t'assurer qu'elle respecte TOUTES ces instructions à la lettre.
      `;

            const systemMessage = {
                id: `system-${Date.now()}`, // Unique ID
                role: "system" as const, // Ensure role is 'system'
                content: systemMessageContent,
            };

            console.log("System Prompt being set:", systemMessage.content);
            setMessages([systemMessage]); // Set only the system message initially
        }
    }, [
        resetDecisionTree,
        messages.length, // Add this dependency
        settingsLoaded, apiKey, isFirstMessage, setMessages, // Core dependencies
        literaryStyle, styleDescription, // Style
        narratorPersonality, personalityDescription, // Personality
        literaryGenre, genreDescription, // Genre
        narratorRelation, narratorRelationDescription, // Relation
        focalization, focalizationDescription, // Focalization
        narrativePerson, narrativePersonDescription, // Person
        narrativeTense, narrativeTenseDescription // Tense
    ]);


    // Scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]); // Trigger scroll whenever messages update


    // Handle option selection
    const selectOptionHandler = (option: string) => {
        if (isSubmitting || isLoading) return

        setIsSubmitting(true)
        setStoryOptions([]) // Clear options immediately

        // Update decision tree with the user's choice
        selectOption(option);

        // Send the chosen option to the API
        append({
            role: "user",
            content: option,
        })
    }

    // Handle chat reset
    const handleResetChat = () => {
        resetDecisionTree(); // Reset the tree state
        // Reloading might be too drastic if you want settings preserved
        // Instead, reset chat state and potentially re-trigger initial message logic
        setMessages([]); // Clear messages
        setStoryOptions([]);
        setInput(""); // Clear input field
        setIsFirstMessage(true); // Allow system prompt regeneration
        // The useEffect for the system prompt should run again now
         toast({ title: "Conversation réinitialisée." });
         // Optionally, call loadSettings again if needed, though it should persist
         // loadSettings(); // Re-ensure settings are loaded for the new prompt
    };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || isLoading || !input.trim()) return

    setIsSubmitting(true)
    setStoryOptions([]) // Clear options when submitting custom input

    // Manually add user message to decision tree if needed (optional, depends on desired tree structure)
    // selectOption(input); // Treat custom input like an option selection for the tree?

    handleSubmit(e) // Use Vercel AI hook's submit
  }


  // Copy responses function (keep as is)
    const copyResponses = () => {
      const assistantMessages = messages
        .filter((m) => m.role === "assistant")
        .map((m) => m.content)
        .join("\n\n");
      if (!assistantMessages) {
          toast({ title: "Aucune réponse à copier.", variant: "destructive"});
          return;
      }
      navigator.clipboard.writeText(assistantMessages)
        .then(() => {
          toast({
            title: "Réponses copiées",
            description: "Les réponses du chatbot ont été copiées dans le presse‑papier.",
          });
        })
       .catch(() => {
         toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de copier les réponses.",
          });
        });
    };

  // Download PDF function (keep as is)
  const downloadPdf = () => {
    const assistantMessages = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content);

    if (assistantMessages.length === 0) {
        toast({ title: "Aucune réponse à télécharger.", variant: "destructive"});
        return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let cursorY = 40;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 40;
    const availableHeight = pageHeight - cursorY - marginBottom;
    const lineSpacing = 6; // Additional spacing between lines
    doc.setFont("times", "normal"); // Use a serif font like Times
    doc.setFontSize(12); // Standard text size

    assistantMessages.forEach((text, index) => {
      const lines = doc.splitTextToSize(text, 500); // 500 points width approx
      let textBlockHeight = (lines.length * (doc.getFontSize() + lineSpacing));

      // Check if the block fits on the current page
      if (cursorY + textBlockHeight > pageHeight - marginBottom) {
        doc.addPage();
        cursorY = 40; // Reset cursor for new page
      }

      // Add the text block
      doc.text(lines, 40, cursorY);
      cursorY += textBlockHeight + 10; // Add extra space between messages

      // Add a separator between messages, except for the last one
    //   if (index < assistantMessages.length - 1) {
    //       if (cursorY + 10 > pageHeight - marginBottom) { // Check space for separator
    //             doc.addPage();
    //             cursorY = 40;
    //       }
    //       doc.setLineWidth(0.5);
    //       doc.line(40, cursorY, 555, cursorY); // Line from margin to margin
    //       cursorY += 10; // Space after separator
    //   }
    });
    doc.save("Chat_le_Fataliste_Recit.pdf");
  };

  // Toggle options expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // --- JSX Structure ---
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="bg-amber-800 text-white p-4 sticky top-0 z-10 shadow"> {/* Added sticky and z-index */}
        <div className="container max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-xl font-bold flex items-center">
            <img src="/diderot.jpg" alt="Diderot" className="h-6 w-6 mr-2 rounded-full" /> {/* Added rounded-full */}
            Chat le Fataliste
          </Link>
          {/* Moved controls to the header for better mobile visibility */}
            
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto py-6 px-4 flex flex-col"> {/* Added flex flex-col */}
         <div className="bg-white rounded-lg shadow-md border border-amber-200 flex flex-col flex-1 overflow-hidden"> {/* Added flex-1 and overflow-hidden */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages
               .filter((m) => m.role !== "system") // Don't display system message
               .map((message) => (
                 <div
                   key={message.id}
                   className={clsx(
                     "p-3 rounded-lg shadow-sm max-w-[85%] break-words", // Added break-words
                     message.role === "user"
                       ? "bg-amber-100 ml-auto"
                       : "bg-white border border-amber-200 mr-auto"
                   )}
                 >
                   <div className="font-serif text-gray-800 whitespace-pre-wrap">
                     {message.content}
                   </div>
                 </div>
               ))}
             <div ref={messagesEndRef} />
           </div>

           {/* Story Options Rendering */}
          {storyOptions.length > 0 && !isLoading && (
               <div className="p-4 border-t border-amber-200 bg-amber-50">
                 {/* Header for expansion toggle */}
                 <div
                    className="flex items-center gap-2 cursor-pointer mb-2 group"
                    onClick={toggleExpansion}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-controls="story-options-content"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpansion()}
                 >
                   {isExpanded ? (
                     <ChevronDown className="h-4 w-4 text-gray-600 flex-shrink-0 transition-transform duration-200"/>
                   ) : (
                     <ChevronRight className="h-4 w-4 text-amber-600 flex-shrink-0 transition-transform duration-200"/>
                   )}
                   <p className={clsx(
                     "text-sm font-medium select-none",
                     !isExpanded && "rainbow-text-effect", // Apply effect only when collapsed
                     isExpanded && "text-gray-600"
                   )}>
                    Et maintenant ?
                   </p>
                 </div>

                 {/* Conditional Options Content */}
                 {isExpanded && (
                   <div
                    id="story-options-content"
                    className="flex flex-col gap-2 mt-2 animate-fade-in"
                   >
                     {storyOptions.map((option, index) => (
                       <Button
                        key={index}
                        variant="outline"
                        className="border-amber-500 text-amber-800 hover:bg-amber-100 justify-start h-auto py-2 px-4 font-normal whitespace-normal text-left transition-colors duration-150 ease-in-out"
                        onClick={() => selectOptionHandler(option)}
                        disabled={isSubmitting || isLoading}
                       >
                         <Sparkles className="h-4 w-4 mr-2 flex-shrink-0 self-start mt-1 text-amber-600" />
                         <span className="flex-1 break-words">{option}</span>
                       </Button>
                     ))}
                   </div>
                 )}
               </div>
             )}


             {/* Input Form */}
           <form
                onSubmit={handleFormSubmit}
                className="p-4 border-t border-amber-200 flex flex-col sm:flex-row gap-2 sm:items-center" // Ensure background for form area
            >
                <div className="flex gap-2 items-center w-full sm:flex-1">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={storyOptions.length > 0 ? "Ou écrivez votre propre suite..." : "Commencez l'histoire..."}
                    className="border-amber-300 focus:ring-amber-500 focus:border-amber-500 flex-1 bg-white disabled:bg-gray-100"
                    disabled={isSubmitting || isLoading}
                    aria-label="Chat input"
                />
                <Button type="submit" className="bg-amber-800 hover:bg-amber-700 disabled:opacity-50" disabled={isSubmitting || isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
                </div>
                <div className="flex items-center justify-center sm:justify-end space-x-2">
                    <DecisionTreePanel
                        decisionTree={decisionTree}
                        isOpen={isTreePanelOpen}
                        setIsOpen={setIsTreePanelOpen}
                    >
                        <Button
                            variant="ghost"
                            title="Arbre narratif"
                            className="bg-amber-800 hover:bg-amber-700 text-white hover:text-white"
                            >
                            <BookOpen className="h-5 w-5" />
                        </Button>
                    </DecisionTreePanel>
                            <Button
                                variant="ghost"
                                onClick={() => window.location.reload()}
                                title="Réinitialiser la conversation"
                                className="bg-amber-800 hover:bg-amber-700 text-white hover:text-white"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={copyResponses}
                                title="Copier les réponses"
                                className="bg-amber-800 hover:bg-amber-700 text-white hover:text-white"
                            >
                                <Copy className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                                onClick={downloadPdf}
                                title="Télécharger les réponses"
                                className="bg-amber-800 hover:bg-amber-700 text-white hover:text-white"
                            >
                                <Download className="h-5 w-5" />
                            </Button>
                            <SettingsSheet onSettingsSaved={handleSettingsSaved}>
                                <Button variant="ghost" className="bg-amber-800 hover:bg-amber-700 text-white hover:text-white">
                                  <Settings className="h-5 w-5" />
                                </Button>
                            </SettingsSheet>
                        </div>

            </form>
           </div>

        {/* Decision Tree Panel definition remains here, but the trigger button is passed from the header */}
         {/* The <DecisionTreePanel> itself doesn't render anything visible until opened */}
         {/* Its trigger is now correctly passed as a child in the header section */}

      </main>
    </div>
  );
}