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

import {
    KNOWN_STYLES, STYLE_DESCRIPTIONS,
    KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS, PERSONALITY_DISPLAY_NAMES,
    KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS, NARRATOR_RELATION_DISPLAY_NAMES,
    KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS, FOCALIZATION_DISPLAY_NAMES,
    KNOWN_PERSONS, PERSON_DESCRIPTIONS, PERSON_DISPLAY_NAMES,
    KNOWN_TENSES, TENSE_DESCRIPTIONS, TENSE_DISPLAY_NAMES,
    KNOWN_GENRES, GENRE_DESCRIPTIONS, GENRE_DISPLAY_NAMES
  } from "@/lib/narrative-constants";


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
        <div className="p-2 space-y-0"> {/* Padding applied here */}
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