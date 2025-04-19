"use client"

import type React from "react";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// --- Constants (Copy all KNOWN_* and *_DESCRIPTIONS/DISPLAY_NAMES from original settings.tsx) ---
// Literary Styles
const KNOWN_STYLES = ["diderot", "balzac", "proust", "camus"];
const STYLE_DESCRIPTIONS: Record<string, string> = {
  diderot: "Inspiré du XVIIIe siècle, avec des digressions, une adresse au lecteur et un ton espiègle.",
  balzac: "Réaliste du XIXe siècle, avec des descriptions détaillées, un souci de la documentation sociale.",
  proust: "Phrases longues, introspection, exploration de la mémoire involontaire et du temps.",
  camus: "Style sobre, phrases courtes, ton neutre ou détaché, réflexions existentialistes.",
}

// Narrator Personality / Tone
const KNOWN_PERSONALITIES = ["playful", "philosophical", "ironic", "dramatic", "absurd", "neutral"];
const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  playful: "Espiègle et joueur, avec un humour léger et des clins d'œil.",
  philosophical: "Réfléchi, contemplatif, pose des questions existentielles ou morales.",
  ironic: "Ton détaché, critique implicite, décalage entre le dit et le non-dit.",
  dramatic: "Intense, met l'accent sur les conflits et les émotions fortes, sens du théâtral.",
  absurd: "Décalé, illogique, souligne le non-sens de l'existence ou des situations.",
  neutral: "Objectif, factuel, s'efface pour laisser parler les faits ou les personnages.",
}
const PERSONALITY_DISPLAY_NAMES: Record<string, string> = {
  playful: "Espiègle",
  philosophical: "Philosophique",
  ironic: "Ironique",
  dramatic: "Dramatique",
  absurd: "Absurde",
  neutral: "Neutre / Objectif"
}

// Narrative Voice: Relation to the Story (Who speaks?)
const KNOWN_RELATIONS = ["heterodiegetic", "homodiegetic", "autodiegetic"];
const NARRATOR_RELATION_DESCRIPTIONS: Record<string, string> = {
    heterodiegetic: "Le narrateur est extérieur à l'histoire qu'il raconte. Il n'y participe pas comme personnage.",
    homodiegetic: "Le narrateur est un personnage à l'intérieur de l'histoire qu'il raconte (principal ou secondaire).",
    autodiegetic: "Cas spécifique d'homodiégétique : le narrateur est le héros/protagoniste de sa propre histoire.",
}
const NARRATOR_RELATION_DISPLAY_NAMES: Record<string, string> = {
    heterodiegetic: "Hétérodiégétique (Extérieur)",
    homodiegetic: "Homodiégétique (Personnage)",
    autodiegetic: "Autodiégétique (Protagoniste)",
}

// Narrative Perspective: Focalization (Who sees?)
const KNOWN_FOCALIZATIONS = ["zero", "internal", "external"];
const FOCALIZATION_DESCRIPTIONS: Record<string, string> = {
    zero: "Focalisation zéro (Omniscience). Le narrateur sait tout, plus que n'importe quel personnage (pensées, sentiments, passé, futur).",
    internal: "Focalisation interne. Le récit est filtré par la conscience d'un personnage. Le narrateur ne dit que ce que ce personnage sait, pense ou perçoit.",
    external: "Focalisation externe. Le narrateur est un observateur neutre, comme une caméra. Il décrit actions et paroles mais n'accède pas aux pensées des personnages. Il en sait moins que les personnages.",
}
const FOCALIZATION_DISPLAY_NAMES: Record<string, string> = {
    zero: "Zéro / Omnisciente",
    internal: "Interne",
    external: "Externe",
}

// Narrative Person (Grammatical Choice)
const KNOWN_PERSONS = ["first_person", "third_person", "second_person"];
const PERSON_DESCRIPTIONS: Record<string, string> = {
    first_person: "Narration à la première personne ('Je'). Souvent liée à un narrateur homodiégétique ou autodiégétique.",
    third_person: "Narration à la troisième personne ('Il', 'Elle', 'Ils', 'Elles'). Souvent liée à un narrateur hétérodiégétique, mais peut aussi être utilisée avec une focalisation interne sur un personnage.",
    second_person: "Narration à la deuxième personne ('Tu', 'Vous'). Plus rare, crée une interpellation directe du lecteur ou du personnage.",
}
const PERSON_DISPLAY_NAMES: Record<string, string> = {
    first_person: "Première personne ('Je')",
    third_person: "Troisième personne ('Il/Elle')",
    second_person: "Deuxième personne ('Tu/Vous')",
}

// Narrative Tense (Primary tense for the narration)
const KNOWN_TENSES = ["past", "present"];
const TENSE_DESCRIPTIONS: Record<string, string> = {
    past: "Narration au temps du passé (passé simple, imparfait principalement). Crée une distance temporelle, récit rétrospectif classique.",
    present: "Narration au temps présent (présent de l'indicatif). Crée un effet d'immédiateté, le lecteur découvre les événements en même temps qu'ils semblent se dérouler.",
}
const TENSE_DISPLAY_NAMES: Record<string, string> = {
    past: "Passé (classique)",
    present: "Présent (immédiateté)",
}

// Literary Genres (Expanded list for narrative fiction)
const KNOWN_GENRES = [
    "conte_philosophique", "roman_realiste", "roman_naturaliste", "roman_historique",
    "roman_epistolaire", "roman_apprentissage", "science_fiction", "fantasy", "fantastique",
    "policier", "thriller", "nouvelle", "autobiographie", "memoires"
];
const GENRE_DESCRIPTIONS: Record<string, string> = {
    conte_philosophique: "Récit bref visant à illustrer une idée philosophique, souvent avec ironie et personnages stylisés.",
    roman_realiste: "Vise à représenter la réalité sociale, historique et humaine de manière fidèle et détaillée.",
    roman_naturaliste: "Pousse le réalisme plus loin, influence du déterminisme social et biologique, souvent milieux populaires.",
    roman_historique: "Intrigue se déroulant dans un contexte historique passé réel, avec mélange de personnages fictifs et réels.",
    roman_epistolaire: "Récit composé de lettres échangées entre personnages.",
    roman_apprentissage: "Suit l'évolution et la formation (Bildung) d'un personnage principal, souvent de l'enfance à l'âge adulte.",
    science_fiction: "Explore des thèmes liés à la science, la technologie, le futur, l'espace, les sociétés alternatives.",
    fantasy: "Met en scène des éléments surnaturels acceptés comme normaux dans l'univers du récit (magie, créatures...).",
    fantastique: "Intrusion du surnaturel dans un cadre réaliste, provoquant le doute et l'hésitation chez le personnage et le lecteur.",
    policier: "Centré sur la résolution d'une énigme criminelle, souvent une enquête menée par un détective.",
    thriller: "Suspense intense, rythme rapide, menace souvent physique ou psychologique pour le protagoniste.",
    nouvelle: "Récit bref, concentré sur une intrigue unique, peu de personnages, chute souvent significative.",
    autobiographie: "Récit rétrospectif que fait une personne réelle de sa propre existence.",
    memoires: "Récit d'événements historiques ou sociaux auxquels l'auteur a participé ou été témoin."
}
const GENRE_DISPLAY_NAMES: Record<string, string> = {
    conte_philosophique: "Conte philosophique",
    roman_realiste: "Roman réaliste",
    roman_naturaliste: "Roman naturaliste",
    roman_historique: "Roman historique",
    roman_epistolaire: "Roman épistolaire",
    roman_apprentissage: "Roman d'apprentissage",
    science_fiction: "Science-Fiction",
    fantasy: "Fantasy",
    fantastique: "Fantastique",
    policier: "Policier / Détection",
    thriller: "Thriller / Suspense",
    nouvelle: "Nouvelle",
    autobiographie: "Autobiographie",
    memoires: "Mémoires"
}
// --- End Constants ---

interface SettingsFormProps {
    onSettingsSaved: () => void; // Callback to notify parent when settings are saved
    onClose?: () => void; // Optional callback to request drawer close
}

export function SettingsForm({ onSettingsSaved, onClose }: SettingsFormProps) {
    const { toast } = useToast();

    // State variables for the form inputs - these are managed internally by the form
    const [apiKey, setApiKey] = useState("");
    const [literaryStyle, setLiteraryStyle] = useState("diderot");
    const [customLiteraryStyle, setCustomLiteraryStyle] = useState("");
    const [styleDescription, setStyleDescription] = useState(STYLE_DESCRIPTIONS.diderot);
    const [narratorPersonality, setNarratorPersonality] = useState("playful");
    const [customNarratorPersonality, setCustomNarratorPersonality] = useState("");
    const [personalityDescription, setPersonalityDescription] = useState(PERSONALITY_DESCRIPTIONS.playful);
    const [narratorRelation, setNarratorRelation] = useState("heterodiegetic");
    const [customNarratorRelation, setCustomNarratorRelation] = useState("");
    const [narratorRelationDescription, setNarratorRelationDescription] = useState(NARRATOR_RELATION_DESCRIPTIONS.heterodiegetic);
    const [focalization, setFocalization] = useState("zero");
    const [customFocalization, setCustomFocalization] = useState("");
    const [focalizationDescription, setFocalizationDescription] = useState(FOCALIZATION_DESCRIPTIONS.zero);
    const [narrativePerson, setNarrativePerson] = useState("third_person");
    const [customNarrativePerson, setCustomNarrativePerson] = useState("");
    const [narrativePersonDescription, setNarrativePersonDescription] = useState(PERSON_DESCRIPTIONS.third_person);
    const [narrativeTense, setNarrativeTense] = useState("past");
    const [customNarrativeTense, setCustomNarrativeTense] = useState("");
    const [narrativeTenseDescription, setNarrativeTenseDescription] = useState(TENSE_DESCRIPTIONS.past);
    const [literaryGenre, setLiteraryGenre] = useState("conte_philosophique");
    const [customLiteraryGenre, setCustomLiteraryGenre] = useState("");
    const [genreDescription, setGenreDescription] = useState(GENRE_DESCRIPTIONS.conte_philosophique);

    // Effect to load settings from localStorage on mount *of this component*
    useEffect(() => {
        console.log("SettingsForm mounted, loading settings...");
        const loadSetting = (key: string, knownValues: string[], setter: (value: string) => void, customSetter: (value: string) => void, descriptionSetter: (value: string) => void, descriptions: Record<string, string>, defaultValue: string) => {
            const savedValue = localStorage.getItem(key);
            const savedDesc = localStorage.getItem(`${key}_description`);
            let initialValue = defaultValue;
            let initialCustomValue = "";
            let initialDescription = descriptions[defaultValue] || ""; // Default description

            if (savedValue) {
                 if (knownValues.includes(savedValue)) {
                    initialValue = savedValue;
                    initialDescription = savedDesc || descriptions[savedValue] || ""; // Use saved desc if available
                } else {
                    // It's a custom value
                    initialValue = "custom";
                    initialCustomValue = savedValue;
                    initialDescription = savedDesc || savedValue || ""; // Use saved desc, or the value itself as desc
                }
            }

            setter(initialValue);
            customSetter(initialCustomValue);
            descriptionSetter(initialDescription);

            // Debug log
            // console.log(`Loaded ${key}: value=${initialValue}, custom=${initialCustomValue}, desc=${initialDescription}`);

        };

        const savedApiKey = localStorage.getItem("openai_api_key");
        if (savedApiKey) setApiKey(savedApiKey);

        loadSetting("literary_style", KNOWN_STYLES, setLiteraryStyle, setCustomLiteraryStyle, setStyleDescription, STYLE_DESCRIPTIONS, "diderot");
        loadSetting("narrator_personality", KNOWN_PERSONALITIES, setNarratorPersonality, setCustomNarratorPersonality, setPersonalityDescription, PERSONALITY_DESCRIPTIONS, "playful");
        loadSetting("narrator_relation", KNOWN_RELATIONS, setNarratorRelation, setCustomNarratorRelation, setNarratorRelationDescription, NARRATOR_RELATION_DESCRIPTIONS, "heterodiegetic");
        loadSetting("focalization", KNOWN_FOCALIZATIONS, setFocalization, setCustomFocalization, setFocalizationDescription, FOCALIZATION_DESCRIPTIONS, "zero");
        loadSetting("narrative_person", KNOWN_PERSONS, setNarrativePerson, setCustomNarrativePerson, setNarrativePersonDescription, PERSON_DESCRIPTIONS, "third_person");
        loadSetting("narrative_tense", KNOWN_TENSES, setNarrativeTense, setCustomNarrativeTense, setNarrativeTenseDescription, TENSE_DESCRIPTIONS, "past");
        loadSetting("literary_genre", KNOWN_GENRES, setLiteraryGenre, setCustomLiteraryGenre, setGenreDescription, GENRE_DESCRIPTIONS, "conte_philosophique");

    }, []); // Empty dependency array means this runs once when the form mounts (e.g., when drawer opens)

    const saveSettings = () => {
        console.log("Saving settings from SettingsForm...");
        const saveSetting = (key: string, selectedValue: string, customValue: string, descriptionStateSetter: (desc: string) => void, knownValues: string[], descriptions: Record<string, string>, defaultValue: string, settingName: string) => {
            const finalValue = selectedValue === "custom" ? customValue.trim() : selectedValue;
            let finalDescription = "";

            if (selectedValue === 'custom') {
                 // For custom, the description IS the custom value unless it's empty
                 finalDescription = customValue.trim() || descriptions[defaultValue]; // Fallback description to default's if custom is empty
            } else {
                 // For predefined, use the canonical description
                 finalDescription = descriptions[selectedValue] || descriptions[defaultValue];
            }

            // Validate custom input: if 'custom' is selected but the input is empty, revert to default
            if (selectedValue === 'custom' && !customValue.trim()) {
                localStorage.setItem(key, defaultValue);
                localStorage.setItem(`${key}_description`, descriptions[defaultValue]);
                 descriptionStateSetter(descriptions[defaultValue]); // Update local state desc
                toast({ title: `${settingName} personnalisé(e) vide`, description: `Retour à la valeur par défaut (${descriptions[defaultValue]}).`, variant: "warning" });
                 return defaultValue; // Return the value actually saved
            } else {
                localStorage.setItem(key, finalValue);
                localStorage.setItem(`${key}_description`, finalDescription);
                descriptionStateSetter(finalDescription); // Update local state desc
                return finalValue; // Return the value saved
            }
        };

        localStorage.setItem("openai_api_key", apiKey);

        saveSetting("literary_style", literaryStyle, customLiteraryStyle, setStyleDescription, KNOWN_STYLES, STYLE_DESCRIPTIONS, "diderot", "Style");
        saveSetting("narrator_personality", narratorPersonality, customNarratorPersonality, setPersonalityDescription, KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS, "playful", "Personnalité");
        saveSetting("narrator_relation", narratorRelation, customNarratorRelation, setNarratorRelationDescription, KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS, "heterodiegetic", "Relation");
        saveSetting("focalization", focalization, customFocalization, setFocalizationDescription, KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS, "zero", "Focalisation");
        saveSetting("narrative_person", narrativePerson, customNarrativePerson, setNarrativePersonDescription, KNOWN_PERSONS, PERSON_DESCRIPTIONS, "third_person", "Personne");
        saveSetting("narrative_tense", narrativeTense, customNarrativeTense, setNarrativeTenseDescription, KNOWN_TENSES, TENSE_DESCRIPTIONS, "past", "Temps");
        saveSetting("literary_genre", literaryGenre, customLiteraryGenre, setGenreDescription, KNOWN_GENRES, GENRE_DESCRIPTIONS, "conte_philosophique", "Genre");

        toast({
            title: "Paramètres sauvegardés",
            description: "Vos préférences narratives ont été enregistrées.",
        });

        onSettingsSaved(); // Notify parent component
        if (onClose) { // If an onClose callback is provided (e.g., by the Drawer), call it
             console.log("Requesting drawer close after save.");
            // onClose(); // Let the drawer handle its own closing for now.
        }
    };

    // Helper to render a setting section (simplified, assumes allowCustomDescription=true for all)
    const renderSettingSelect = (
        id: string, label: string,
        selectedValue: string, onValueChange: (value: string) => void,
        knownValues: string[], displayNames: Record<string, string>, descriptions: Record<string, string>,
        customValue: string, onCustomChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
        placeholder: string, currentDescription: string, // Use state for description
        useTextarea: boolean = false // Flag to use Textarea instead of Input for custom field
    ) => (
        <div className="space-y-2 border-t border-amber-100 pt-4 first:pt-0 first:border-t-0">
            <Label htmlFor={id} className="text-base font-semibold">{label}</Label>
            <Select value={selectedValue} onValueChange={(value) => {
                onValueChange(value); // Update the selected value state
                // Update description state based on new selection
                if (value === 'custom') {
                     // Keep custom value if switching back to custom, otherwise clear it? Let's keep it.
                     // Set description to custom value OR placeholder if custom value is empty
                     // descriptionStateSetter(customValue || placeholder); // This might be confusing, let's handle description update within save/load
                } else {
                     // Update description to the selected preset's description
                     // descriptionStateSetter(descriptions[value] || "");
                }
            }}>
                <SelectTrigger id={id} className="border-amber-300 bg-white">
                    <SelectValue placeholder={`Choisir ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {knownValues.map(value => (
                        <SelectItem key={value} value={value}>
                            {displayNames[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                    <SelectItem value="custom">Autre (préciser)</SelectItem>
                </SelectContent>
            </Select>
            {selectedValue === 'custom' && (
                useTextarea ? (
                    <Textarea
                        value={customValue}
                        onChange={onCustomChange}
                        placeholder={placeholder}
                        className="mt-2 border-amber-300 focus:ring-amber-500 bg-white"
                        rows={2}
                    />
                ) : (
                    <Input
                        value={customValue}
                        onChange={onCustomChange}
                        placeholder={placeholder}
                        className="mt-2 border-amber-300 focus:ring-amber-500 bg-white"
                    />
                )
            )}
            <p className="text-sm text-gray-600 italic mt-1">
                {/* Display the description based on current selection or custom input */}
                {selectedValue === 'custom'
                    ? (customValue.trim() || "Veuillez décrire votre choix personnalisé.")
                    : (descriptions[selectedValue] || "Description non disponible.")
                }
            </p>
        </div>
    );

    return (
        <div className="p-6 space-y-8"> {/* Padding applied here */}
             {/* API Key Section */}
            <div className="space-y-2">
                <Label htmlFor="apiKeyForm" className="text-base font-semibold">Clé API OpenAI</Label>
                <Input id="apiKeyForm" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="border-amber-300 focus:ring-amber-500 bg-white" />
                <p className="text-sm text-gray-500">Clé stockée localement.</p>
            </div>

             {/* Settings Sections */}
            {renderSettingSelect(
                "genreForm", "Genre Littéraire", literaryGenre,
                setLiteraryGenre, KNOWN_GENRES, GENRE_DISPLAY_NAMES, GENRE_DESCRIPTIONS,
                customLiteraryGenre, (e) => setCustomLiteraryGenre(e.target.value),
                "Décrivez le genre (ex: Roman d'aventure post-apocalyptique)", genreDescription, true
            )}
            {renderSettingSelect(
                "styleForm", "Style Littéraire", literaryStyle,
                setLiteraryStyle, KNOWN_STYLES, KNOWN_STYLES.reduce((acc, style) => { acc[style] = style.charAt(0).toUpperCase() + style.slice(1); return acc; }, {} as Record<string, string>), STYLE_DESCRIPTIONS,
                customLiteraryStyle, (e) => setCustomLiteraryStyle(e.target.value),
                "Décrivez le style (ex: Minimaliste et poétique)", styleDescription, true
            )}
            {renderSettingSelect(
                "personalityForm", "Ton / Personnalité du Narrateur", narratorPersonality,
                setNarratorPersonality, KNOWN_PERSONALITIES, PERSONALITY_DISPLAY_NAMES, PERSONALITY_DESCRIPTIONS,
                customNarratorPersonality, (e) => setCustomNarratorPersonality(e.target.value),
                "Décrivez la personnalité (ex: Sarcastique et désabusé)", personalityDescription, true
            )}
            {renderSettingSelect(
                "narratorRelationForm", "Relation Narrateur/Histoire (Voix)", narratorRelation,
                setNarratorRelation, KNOWN_RELATIONS, NARRATOR_RELATION_DISPLAY_NAMES, NARRATOR_RELATION_DESCRIPTIONS,
                customNarratorRelation, (e) => setCustomNarratorRelation(e.target.value),
                "Décrivez la relation (ex: Narrateur témoin)", narratorRelationDescription, true
            )}
            {renderSettingSelect(
                "focalizationForm", "Focalisation (Perspective)", focalization,
                setFocalization, KNOWN_FOCALIZATIONS, FOCALIZATION_DISPLAY_NAMES, FOCALIZATION_DESCRIPTIONS,
                customFocalization, (e) => setCustomFocalization(e.target.value),
                "Décrivez la focalisation (ex: Interne variable)", focalizationDescription, true
            )}
            {renderSettingSelect(
                "narrativePersonForm", "Personne Narrative (Grammaire)", narrativePerson,
                setNarrativePerson, KNOWN_PERSONS, PERSON_DISPLAY_NAMES, PERSON_DESCRIPTIONS,
                customNarrativePerson, (e) => setCustomNarrativePerson(e.target.value),
                "Décrivez l'usage (ex: Première personne plurielle 'Nous')", narrativePersonDescription, true
            )}
            {renderSettingSelect(
                "narrativeTenseForm", "Temps Principal", narrativeTense,
                setNarrativeTense, KNOWN_TENSES, TENSE_DISPLAY_NAMES, TENSE_DESCRIPTIONS,
                customNarrativeTense, (e) => setCustomNarrativeTense(e.target.value),
                "Décrivez le temps (ex: Alternance passé/présent)", narrativeTenseDescription, true
            )}

            {/* Save Button */}
            <Button onClick={saveSettings} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-serif text-lg py-3 mt-8">
                <Save className="mr-2 h-5 w-5" />
                Sauvegarder
            </Button>
        </div>
    );
}