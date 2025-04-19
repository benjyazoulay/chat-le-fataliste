"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define known preset values outside the component for reuse
const KNOWN_STYLES = ["diderot", "balzac", "proust", "camus"];
const KNOWN_PERSONALITIES = ["playful", "philosophical", "ironic", "dramatic", "absurd"];
// Add Known Narrator Types
const KNOWN_NARRATOR_TYPES = [
    "homodiegetic",
    "autodiegetic",
    "heterodiegetic",
    "omniscient",
    "focalisation_interne",
    "focalisation_externe",
    "temoin" // Using a simplified key
];

// Define default descriptions for styles, personalities, and narrator types
const STYLE_DESCRIPTIONS: Record<string, string> = {
  diderot: "du XVIIIe siècle, avec des digressions et un ton espiègle",
  balzac: "réaliste du XIXe siècle, avec des descriptions détaillées",
  proust: "proustien, avec de longues phrases et des réflexions sur la mémoire",
  camus: "existentialiste, sobre et philosophique",
}

const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  playful: "espiègle et joueur, avec un humour léger et des digressions amusantes",
  philosophical: "réfléchi et contemplatif, posant des questions existentielles",
  ironic: "ironique avec un ton détaché et une perspective critique sur les événements",
  dramatic: "dramatique et intense, avec un sens du théâtral",
  absurd: "absurde et décalé, défiant les attentes et la logique conventionnelle"
}

// Define descriptions for Narrator Types
const NARRATOR_TYPE_DESCRIPTIONS: Record<string, string> = {
    homodiegetic: "Le narrateur fait partie de l’histoire, est un personnage (principal ou secondaire) du récit. Narration à la première personne.",
    autodiegetic: "Le narrateur est le personnage principal de l’histoire qu’il raconte.",
    heterodiegetic: "Le narrateur ne fait pas partie de l’histoire, est extérieur au récit.",
    omniscient: "Le narrateur sait tout sur les personnages : pensées, passé, avenir, lieux, événements.",
    focalisation_interne : "le récit est filtré à travers la vision d’un personnage, souvent à la troisième personne. Le narrateur ne sait que ce que ce personnage sait.",
    focalisation_externe: "le narrateur observe de l’extérieur. Il décrit les actions, les paroles, mais ne connaît pas les pensées des personnages.",
    temoin: "Le narrateur est présent dans l’histoire mais ne raconte pas sa propre histoire : il est un observateur, souvent secondaire."
}

// Define display names for Narrator Types in the dropdown
const NARRATOR_TYPE_DISPLAY_NAMES: Record<string, string> = {
    homodiegetic: "Homodiégétique",
    autodiegetic: "Autodiégétique",
    heterodiegetic: "Hétérodiégétique",
    omniscient: "Omniscient",
    focalisation_interne : "Focalisation interne",
    focalisation_externe: "Focalisation externe",
    temoin: "Témoin"
}


export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [literaryStyle, setLiteraryStyle] = useState("diderot") // Dropdown value
  const [customLiteraryStyle, setCustomLiteraryStyle] = useState("") // Input value if style is custom
  const [styleDescription, setStyleDescription] = useState(STYLE_DESCRIPTIONS.diderot)

  const [narratorPersonality, setNarratorPersonality] = useState("playful") // Dropdown value
  const [customNarratorPersonality, setCustomNarratorPersonality] = useState("") // Input value if personality is custom
  const [personalityDescription, setPersonalityDescription] = useState(PERSONALITY_DESCRIPTIONS.playful)

  // State for Narrator Type
  const [narratorType, setNarratorType] = useState("heterodiegetic"); // Default value
  const [customNarratorType, setCustomNarratorType] = useState(""); // Input value if type is custom
  const [narratorTypeDescription, setNarratorTypeDescription] = useState(NARRATOR_TYPE_DESCRIPTIONS.heterodiegetic); // Description

  const { toast } = useToast()

  // Effect to load settings from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key")
    const savedStyleValue = localStorage.getItem("literary_style")
    const savedPersonalityValue = localStorage.getItem("narrator_personality")
    const savedNarratorTypeValue = localStorage.getItem("narrator_type") // Load narrator type

    // Load descriptions
    const savedStyleDesc = localStorage.getItem("style_description")
    const savedPersonalityDesc = localStorage.getItem("personality_description")
    const savedNarratorTypeDesc = localStorage.getItem("narrator_type_description") // Load narrator type description


    if (savedApiKey) setApiKey(savedApiKey)

    // --- Load Literary Style Value and Set Dropdown/Custom Input ---
    let initialStyle = "diderot"; // Default value
    let initialCustomStyle = "";
    if (savedStyleValue) {
        if (KNOWN_STYLES.includes(savedStyleValue)) {
            initialStyle = savedStyleValue;
            initialCustomStyle = "";
        } else {
            initialStyle = "custom";
            initialCustomStyle = savedStyleValue;
        }
    }
    setLiteraryStyle(initialStyle);
    setCustomLiteraryStyle(initialCustomStyle);

    // --- Load Narrator Personality Value and Set Dropdown/Custom Input ---
    let initialPersonality = "playful"; // Default value
    let initialCustomPersonality = "";
    if (savedPersonalityValue) {
        if (KNOWN_PERSONALITIES.includes(savedPersonalityValue)) {
            initialPersonality = savedPersonalityValue;
            initialCustomPersonality = "";
        } else {
            initialPersonality = "custom";
            initialCustomPersonality = savedPersonalityValue;
        }
    }
    setNarratorPersonality(initialPersonality);
    setCustomNarratorPersonality(initialCustomPersonality);

    // --- Load Narrator Type Value and Set Dropdown/Custom Input ---
    let initialNarratorType = "heterodiegetic"; // Default value for narrator type
    let initialCustomNarratorType = "";
    if (savedNarratorTypeValue) {
        if (KNOWN_NARRATOR_TYPES.includes(savedNarratorTypeValue)) {
            initialNarratorType = savedNarratorTypeValue;
            initialCustomNarratorType = "";
        } else {
            initialNarratorType = "custom";
            initialCustomNarratorType = savedNarratorTypeValue;
        }
    }
    setNarratorType(initialNarratorType);
    setCustomNarratorType(initialCustomNarratorType);


    // --- Load descriptions ---
    // Prioritize saved description if it exists, otherwise use default for the determined initial value
    if (savedStyleDesc) {
      setStyleDescription(savedStyleDesc);
    } else {
      setStyleDescription(STYLE_DESCRIPTIONS[initialStyle] || initialCustomStyle || ""); // Use custom value if style is custom and no desc saved
    }

    if (savedPersonalityDesc) {
      setPersonalityDescription(savedPersonalityDesc);
    } else {
      setPersonalityDescription(PERSONALITY_DESCRIPTIONS[initialPersonality] || initialCustomPersonality || ""); // Use custom value if personality is custom and no desc saved
    }

     if (savedNarratorTypeDesc) {
        setNarratorTypeDescription(savedNarratorTypeDesc);
    } else {
        // Use custom value if type is custom and no desc saved, otherwise use default for preset
        setNarratorTypeDescription(NARRATOR_TYPE_DESCRIPTIONS[initialNarratorType] || initialCustomNarratorType || "");
    }


  }, []) // Empty dependency array means this runs once on mount


  const saveSettings = () => {
    // Save API Key
    localStorage.setItem("openai_api_key", apiKey);

    // Determine the style value to save
    const styleToSave = literaryStyle === "custom" ? customLiteraryStyle.trim() : literaryStyle;
     if (styleToSave) {
      localStorage.setItem("literary_style", styleToSave);
      // For description, if 'custom' style was saved, use the custom input's text as description if available,
      // otherwise use the state description (which might be a default or previously saved custom desc)
      const descToSaveForStyle = literaryStyle === 'custom' && customLiteraryStyle.trim() ? customLiteraryStyle.trim() : styleDescription;
      localStorage.setItem("style_description", descToSaveForStyle);
    } else if (literaryStyle === 'custom') {
      // Handle case where custom is selected but input is empty
      localStorage.setItem("literary_style", "diderot"); // Fallback to default
      localStorage.setItem("style_description", STYLE_DESCRIPTIONS.diderot); // Save default desc
      toast({ title: "Style personnalisé vide", description: "Le style personnalisé était vide, retour au style par défaut (Diderot).", variant: "destructive" });
    } else {
       // Handle case where a preset was selected
       localStorage.setItem("literary_style", literaryStyle);
       localStorage.setItem("style_description", styleDescription); // Save the description corresponding to the preset
    }


    // Determine the personality value to save
    const personalityToSave = narratorPersonality === "custom" ? customNarratorPersonality.trim() : narratorPersonality;
     if (personalityToSave) {
      localStorage.setItem("narrator_personality", personalityToSave);
       // For description, if 'custom' personality was saved, use the custom input's text as description if available
       const descToSaveForPersonality = narratorPersonality === 'custom' && customNarratorPersonality.trim() ? customNarratorPersonality.trim() : personalityDescription;
      localStorage.setItem("personality_description", descToSaveForPersonality);
    } else if (narratorPersonality === 'custom') {
      // Handle case where custom is selected but input is empty
      localStorage.setItem("narrator_personality", "playful"); // Fallback to default
      localStorage.setItem("personality_description", PERSONALITY_DESCRIPTIONS.playful); // Save default desc
      toast({ title: "Personnalité personnalisée vide", description: "La personnalité personnalisée était vide, retour à la personnalité par défaut (Espiègle).", variant: "destructive" });
    } else {
       // Handle case where a preset was selected
       localStorage.setItem("narrator_personality", narratorPersonality);
       localStorage.setItem("personality_description", personalityDescription); // Save the description corresponding to the preset
    }

    // Determine the narrator type value to save
    const narratorTypeToSave = narratorType === "custom" ? customNarratorType.trim() : narratorType;
     if (narratorTypeToSave) {
      localStorage.setItem("narrator_type", narratorTypeToSave);
        // For description, if 'custom' type was saved, use the custom input's text as description if available
        const descToSaveForNarratorType = narratorType === 'custom' && customNarratorType.trim() ? customNarratorType.trim() : narratorTypeDescription;
        localStorage.setItem("narrator_type_description", descToSaveForNarratorType);
    } else if (narratorType === 'custom') {
        // Handle case where custom is selected but input is empty
        localStorage.setItem("narrator_type", "heterodiegetic"); // Fallback to default
        localStorage.setItem("narrator_type_description", NARRATOR_TYPE_DESCRIPTIONS.heterodiegetic); // Save default desc
        toast({ title: "Type de narrateur personnalisé vide", description: "Le type de narrateur personnalisé était vide, retour au type par défaut (Hétérodiégétique).", variant: "destructive" });
    } else {
        // Handle case where a preset was selected
        localStorage.setItem("narrator_type", narratorType);
        localStorage.setItem("narrator_type_description", narratorTypeDescription); // Save the description corresponding to the preset
    }


    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <div className="flex-1 container max-w-3xl mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-amber-800 hover:text-amber-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>

        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Configuration</CardTitle>
            <CardDescription>Personnalisez votre expérience narrative et configurez votre clé API</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-base">Clé API OpenAI</Label>
              <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="border-amber-200 focus:ring-amber-500" />
              <p className="text-sm text-gray-500">Votre clé API est stockée uniquement dans votre navigateur et n'est jamais partagée.</p>
            </div>

            {/* Literary Style Section */}
            <div className="space-y-2">
              <Label htmlFor="style" className="text-base">Style littéraire</Label>
              <Select value={literaryStyle} onValueChange={(value) => {
                setLiteraryStyle(value); // Update the dropdown value state
                if (value === 'custom') {
                  setCustomLiteraryStyle(''); // Clear custom input when switching to custom
                   // When switching to custom, clear description state so the user can potentially type one if input becomes visible
                  setStyleDescription('');
                } else {
                  setCustomLiteraryStyle(''); // Clear custom input
                   // Set default description for the selected preset
                  setStyleDescription(STYLE_DESCRIPTIONS[value] || '');
                }
              }}>
                <SelectTrigger id="style" className="border-amber-200">
                  <SelectValue placeholder="Choisir un style" />
                </SelectTrigger>
                <SelectContent>
                  {KNOWN_STYLES.map(style => (
                    <SelectItem key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</SelectItem>
                  ))}
                  <SelectItem value="custom">Autre (décrire en dessous)</SelectItem>
                </SelectContent>
              </Select>
              {literaryStyle === 'custom' && (
                <Input
                  value={customLiteraryStyle}
                  onChange={(e) => setCustomLiteraryStyle(e.target.value)}
                  placeholder="Nom de votre style personnalisé"
                  className="mt-2 border-amber-200 focus:ring-amber-500"
                />
              )}
              {/* Description input kept hidden as per original code, but state is managed */}
              <div className="mt-2 hidden">
                <Label htmlFor="styleDescription" className="text-sm">Description du style</Label>
                <Input
                  id="styleDescription"
                  value={styleDescription}
                  onChange={(e) => setStyleDescription(e.target.value)}
                  placeholder="Décrivez les caractéristiques de ce style littéraire"
                  className="mt-1 border-amber-200 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Narrator Personality Section */}
            <div className="space-y-2">
              <Label htmlFor="personality" className="text-base">Personnalité du narrateur</Label>
              <Select value={narratorPersonality} onValueChange={(value) => {
                setNarratorPersonality(value); // Update the dropdown value state
                if (value === 'custom') {
                  setCustomNarratorPersonality(''); // Clear custom input
                   // When switching to custom, clear description state
                  setPersonalityDescription('');
                } else {
                  setCustomNarratorPersonality(''); // Clear custom input
                  // Set default description for the selected preset
                  setPersonalityDescription(PERSONALITY_DESCRIPTIONS[value] || '');
                }
              }}>
                <SelectTrigger id="personality" className="border-amber-200">
                  <SelectValue placeholder="Choisir une personnalité" />
                </SelectTrigger>
                <SelectContent>
                   {Object.entries(PERSONALITY_DESCRIPTIONS).map(([key, description]) => (
                      <SelectItem key={key} value={key}>
                         {description.split(',')[0].trim()} {/* Use first part of desc for display */}
                      </SelectItem>
                   ))}
                  <SelectItem value="custom">Autre (décrire en dessous)</SelectItem>
                </SelectContent>
              </Select>
              {narratorPersonality === 'custom' && (
                <Input
                  value={customNarratorPersonality}
                  onChange={(e) => setCustomNarratorPersonality(e.target.value)}
                  placeholder="Nom de votre personnalité personnalisée"
                  className="mt-2 border-amber-200 focus:ring-amber-500"
                />
              )}
               {/* Description input kept hidden as per original code, but state is managed */}
              <div className="mt-2 hidden">
                <Label htmlFor="personalityDescription" className="text-sm">Description de la personnalité</Label>
                <Input
                  id="personalityDescription"
                  value={personalityDescription}
                  onChange={(e) => setPersonalityDescription(e.target.value)}
                  placeholder="Décrivez les traits de cette personnalité"
                  className="mt-1 border-amber-200 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* NEW: Narrator Type Section */}
            <div className="space-y-2">
              <Label htmlFor="narratorType" className="text-base">Type de narrateur</Label>
              <Select value={narratorType} onValueChange={(value) => {
                setNarratorType(value); // Update the dropdown value state
                if (value === 'custom') {
                  setCustomNarratorType(''); // Clear custom input
                   // When switching to custom, clear description state
                  setNarratorTypeDescription('');
                } else {
                  setCustomNarratorType(''); // Clear custom input
                  // Set default description for the selected preset type
                  setNarratorTypeDescription(NARRATOR_TYPE_DESCRIPTIONS[value] || '');
                }
              }}>
                <SelectTrigger id="narratorType" className="border-amber-200">
                  <SelectValue placeholder="Choisir un type de narrateur" />
                </SelectTrigger>
                <SelectContent>
                  {KNOWN_NARRATOR_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                         {NARRATOR_TYPE_DISPLAY_NAMES[type] || type} {/* Use display name if available */}
                      </SelectItem>
                   ))}
                  <SelectItem value="custom">Autre (décrire en dessous)</SelectItem>
                </SelectContent>
              </Select>
              {narratorType === 'custom' && (
                <Input
                  value={customNarratorType}
                  onChange={(e) => setCustomNarratorType(e.target.value)}
                  placeholder="Nom de votre type de narrateur personnalisé"
                  className="mt-2 border-amber-200 focus:ring-amber-500"
                />
              )}
              {/* Description input kept hidden, but state is managed */}
              <div className="mt-2 hidden">
                 <Label htmlFor="narratorTypeDescription" className="text-sm">Description du type</Label>
                <Input
                  id="narratorTypeDescription"
                  value={narratorTypeDescription}
                  onChange={(e) => setNarratorTypeDescription(e.target.value)}
                  placeholder="Décrivez les caractéristiques de ce type de narrateur"
                  className="mt-1 border-amber-200 focus:ring-amber-500"
                />
              </div>
            </div>

          </CardContent>

          <CardFooter>
            <Button onClick={saveSettings} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-serif">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les paramètres
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}