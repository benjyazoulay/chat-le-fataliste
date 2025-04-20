"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react" // Added useCallback
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsSheet } from "@/components/ui/settings-drawer" // Import the drawer
import { Send, Settings, Sparkles, Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useChat } from "ai/react"
import jsPDF from "jspdf"

// --- Constants (Just for defaults, actual values loaded into state) ---
const DEFAULT_STYLE = "diderot";
const DEFAULT_PERSONALITY = "playful";
const DEFAULT_GENRE = "conte_philosophique";
const DEFAULT_RELATION = "heterodiegetic";
const DEFAULT_FOCALIZATION = "zero";
const DEFAULT_PERSON = "third_person";
const DEFAULT_TENSE = "past";

// Helper to get description (needed for system prompt) - include ALL description maps
import {
    KNOWN_STYLES, STYLE_DESCRIPTIONS,
    KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS, PERSONALITY_DISPLAY_NAMES,
    KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS, NARRATOR_RELATION_DISPLAY_NAMES,
    KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS, FOCALIZATION_DISPLAY_NAMES,
    KNOWN_PERSONS, PERSON_DESCRIPTIONS, PERSON_DISPLAY_NAMES,
    KNOWN_TENSES, TENSE_DESCRIPTIONS, TENSE_DISPLAY_NAMES,
    KNOWN_GENRES, GENRE_DESCRIPTIONS, GENRE_DISPLAY_NAMES
  } from "@/lib/narrative-constants"; // Assuming constants are exported or accessible

// --- End Constants ---


export default function Chat() {
    const router = useRouter()
    const { toast } = useToast()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // State for API Key and Narrative Settings - LIVES IN CHAT COMPONENT
    const [apiKey, setApiKey] = useState("")
    const [literaryStyle, setLiteraryStyle] = useState(DEFAULT_STYLE)
    const [styleDescription, setStyleDescription] = useState("")
    const [narratorPersonality, setNarratorPersonality] = useState(DEFAULT_PERSONALITY)
    const [personalityDescription, setPersonalityDescription] = useState("")
    const [literaryGenre, setLiteraryGenre] = useState(DEFAULT_GENRE)
    const [genreDescription, setGenreDescription] = useState("")
    const [narratorRelation, setNarratorRelation] = useState(DEFAULT_RELATION);
    const [narratorRelationDescription, setNarratorRelationDescription] = useState("");
    const [focalization, setFocalization] = useState(DEFAULT_FOCALIZATION);
    const [focalizationDescription, setFocalizationDescription] = useState("");
    const [narrativePerson, setNarrativePerson] = useState(DEFAULT_PERSON);
    const [narrativePersonDescription, setNarrativePersonDescription] = useState("");
    const [narrativeTense, setNarrativeTense] = useState(DEFAULT_TENSE);
    const [narrativeTenseDescription, setNarrativeTenseDescription] = useState("");

    const [isFirstMessage, setIsFirstMessage] = useState(true)
    const [storyOptions, setStoryOptions] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [settingsLoaded, setSettingsLoaded] = useState(false); // Flag

    // Function to load all settings from localStorage into state
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
        onFinish: () => {
            setIsSubmitting(false)
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

        if (settingsLoaded && apiKey && isFirstMessage && allDescriptionsAvailable) {
            console.log("Chat component: Setting initial system prompt.");
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
        settingsLoaded, apiKey, isFirstMessage, setMessages, // Core dependencies
        literaryStyle, styleDescription, // Style
        narratorPersonality, personalityDescription, // Personality
        literaryGenre, genreDescription, // Genre
        narratorRelation, narratorRelationDescription, // Relation
        focalization, focalizationDescription, // Focalization
        narrativePerson, narrativePersonDescription, // Person
        narrativeTense, narrativeTenseDescription // Tense
    ]);


    // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Extraire les options et nettoyer le contenu du message
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      const lastMessage = messages[messages.length - 1].content
      const options: string[] = []

      // Regex pour extraire les options numérotées
      const optionRegex = /\d+\.\s+(.*?)(?=\n\d+\.|\n\n|$)/gs
      let match
      let cleanedContent = lastMessage

      // Collecter les options et les supprimer du contenu
      while ((match = optionRegex.exec(lastMessage)) !== null) {
        if (match[1]) {
          options.push(match[1].trim())
          // Marquer cette partie pour suppression
          cleanedContent = cleanedContent.replace(match[0], "")
        }
      }

      // Nettoyer les phrases d'introduction aux options et les adresses au lecteur
      cleanedContent = cleanedContent.replace(/Que (?:voulez|souhaitez|préférez)[^?]*\?/g, "")
      cleanedContent = cleanedContent.replace(/Que (?:choisissez|décidez)[^?]*\?/g, "")
      cleanedContent = cleanedContent.replace(/(?:Voici|Voilà)(?: quelques)? options[^:]*:/g, "")
      cleanedContent = cleanedContent.replace(/(?:Choisissez|Sélectionnez)[^:]*:/g, "")
      cleanedContent = cleanedContent.replace(/Mais peut-être est-ce vous, lecteur[^.]*\./g, "")
      cleanedContent = cleanedContent.replace(/[^.]*lecteur[^.]*\./g, "")

      // Supprimer les lignes vides consécutives
      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n")
      cleanedContent = cleanedContent.trim()

      // Mettre à jour le dernier message avec le contenu nettoyé
      if (options.length > 0) {
        setStoryOptions(options)

        // Mettre à jour le contenu du message sans modifier l'objet original
        const updatedMessages = [...messages]
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content: cleanedContent,
        }

        setMessages(updatedMessages)
      }
    }
  }, [messages, setMessages])

  // Handle option selection
  const selectOption = (option: string) => {
    if (isSubmitting || isLoading) return

    setIsSubmitting(true)
    setStoryOptions([]) // Clear options immediately to prevent double-clicks

    // Use append instead of handleSubmit for more direct control
    append({
      role: "user",
      content: option,
    })
  }

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || isLoading || !input.trim()) return

    setIsSubmitting(true)
    setStoryOptions([]) // Clear options when submitting custom input
    handleSubmit(e)
  }


  // Fonction pour copier les réponses du bot dans le presse‑papier
    const copyResponses = () => {
      // Récupère uniquement les messages du bot
      const assistantMessages = messages
        .filter((m) => m.role === "assistant")
        .map((m) => m.content)
        .join("\n\n");
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
  // Fonction pour générer et télécharger le PDF des seules réponses du bot
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    // Récupère uniquement les messages du bot
    const assistantMessages = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content);
    let cursorY = 40;
    doc.setFontSize(14);
    assistantMessages.forEach((text) => {
      const lines = doc.splitTextToSize(text, 500);
      doc.text(lines, 40, cursorY);
      cursorY += lines.length * 16;
      // Nouvelle page si on dépasse le bas
      if (cursorY > doc.internal.pageSize.height - 40) {
        doc.addPage();
        cursorY = 40;
      }
    });
    doc.save("chatbot_reponses.pdf");
  };
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col">
            <header className="bg-amber-800 text-white p-4">
                <div className="container max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="font-serif text-xl font-bold">
                        Chat le Fataliste
                    </Link>
                    {/* Replace Link with SettingsDrawer */}
                    
                </div>
            </header>

            <main className="flex-1 container max-w-4xl mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-md border border-amber-200 h-[calc(100vh-12rem)] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages
                            .filter((m) => m.role !== "system") // Don't display system message
                            .map((message) => (
                                <div
                                    key={message.id}
                                    className={`${
                                        message.role === "user" ? "bg-amber-100 ml-auto max-w-[85%]" : "bg-white border border-amber-200 mr-auto max-w-[85%]" // Adjusted alignment
                                    } p-4 rounded-lg shadow-sm`} // Added shadow-sm
                                >
                                    <div className="font-serif text-gray-800 whitespace-pre-wrap break-words">{message.content}</div>
                                </div>
                            ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* --- Story Options Rendering (keep as is) --- */}
                    {storyOptions.length > 0 && !isLoading && (
                        <div className="p-4 border-t border-amber-200 bg-amber-50">
                            <p className="text-sm text-gray-600 mb-2 font-medium">Et maintenant ?</p>
                            <div className="flex flex-col gap-2">
                                {storyOptions.map((option, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="border-amber-500 text-amber-800 hover:bg-amber-100 justify-start h-auto py-2 px-4 font-normal whitespace-normal text-left transition-colors duration-150 ease-in-out"
                                        onClick={() => selectOption(option)}
                                        disabled={isSubmitting || isLoading}
                                    >
                                        <Sparkles className="h-4 w-4 mr-2 flex-shrink-0 self-start mt-1 text-amber-600" />
                                        <span className="flex-1 break-words">{option}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                     {/* --- Input Form Rendering (minor adjustment for options body) --- */}
                    <form onSubmit={handleFormSubmit} className="p-4 border-t border-amber-200 flex gap-2 items-center">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder={storyOptions.length > 0 ? "Ou écrivez votre propre suite..." : "Commencez ou continuez l'histoire..."}
                            className="border-amber-300 focus:ring-amber-500 focus:border-amber-500 flex-1 bg-white disabled:bg-gray-100"
                            disabled={isSubmitting || isLoading}
                            aria-label="Chat input"
                        />
                        <Button type="submit" className="bg-amber-800 hover:bg-amber-700 disabled:opacity-50" disabled={isSubmitting || isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                   <div className="flex items-center space-x-2">
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
            </main>
        </div>
    )
}