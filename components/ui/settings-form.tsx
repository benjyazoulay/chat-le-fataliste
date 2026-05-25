"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import {
  KNOWN_STYLES, STYLE_DESCRIPTIONS,
  KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS, PERSONALITY_DISPLAY_NAMES,
  KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS, NARRATOR_RELATION_DISPLAY_NAMES,
  KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS, FOCALIZATION_DISPLAY_NAMES,
  KNOWN_PERSONS, PERSON_DESCRIPTIONS, PERSON_DISPLAY_NAMES,
  KNOWN_TENSES, TENSE_DESCRIPTIONS, TENSE_DISPLAY_NAMES,
  KNOWN_GENRES, GENRE_DESCRIPTIONS, GENRE_DISPLAY_NAMES
} from "@/lib/narrative-constants"


interface SettingsFormProps {
  onSettingsSaved: () => void
  onClose?: () => void
}

export function SettingsForm({ onSettingsSaved, onClose }: SettingsFormProps) {
  const { toast } = useToast()

  // State
  const [apiKey, setApiKey] = useState("")
  const [literaryStyle, setLiteraryStyle] = useState("diderot")
  const [customLiteraryStyle, setCustomLiteraryStyle] = useState("")
  const [styleDescription, setStyleDescription] = useState(STYLE_DESCRIPTIONS.diderot)
  const [narratorPersonality, setNarratorPersonality] = useState("playful")
  const [customNarratorPersonality, setCustomNarratorPersonality] = useState("")
  const [personalityDescription, setPersonalityDescription] = useState(PERSONALITY_DESCRIPTIONS.playful)
  const [narratorRelation, setNarratorRelation] = useState("heterodiegetic")
  const [customNarratorRelation, setCustomNarratorRelation] = useState("")
  const [narratorRelationDescription, setNarratorRelationDescription] = useState(NARRATOR_RELATION_DESCRIPTIONS.heterodiegetic)
  const [focalization, setFocalization] = useState("zero")
  const [customFocalization, setCustomFocalization] = useState("")
  const [focalizationDescription, setFocalizationDescription] = useState(FOCALIZATION_DESCRIPTIONS.zero)
  const [narrativePerson, setNarrativePerson] = useState("third_person")
  const [customNarrativePerson, setCustomNarrativePerson] = useState("")
  const [narrativePersonDescription, setNarrativePersonDescription] = useState(PERSON_DESCRIPTIONS.third_person)
  const [narrativeTense, setNarrativeTense] = useState("past")
  const [customNarrativeTense, setCustomNarrativeTense] = useState("")
  const [narrativeTenseDescription, setNarrativeTenseDescription] = useState(TENSE_DESCRIPTIONS.past)
  const [literaryGenre, setLiteraryGenre] = useState("conte_philosophique")
  const [customLiteraryGenre, setCustomLiteraryGenre] = useState("")
  const [genreDescription, setGenreDescription] = useState(GENRE_DESCRIPTIONS.conte_philosophique)

  useEffect(() => {
    const loadSetting = (
      key: string,
      knownValues: string[],
      setter: (value: string) => void,
      customSetter: (value: string) => void,
      descriptionSetter: (value: string) => void,
      descriptions: Record<string, string>,
      defaultValue: string
    ) => {
      const savedValue = localStorage.getItem(key)
      const savedDesc = localStorage.getItem(`${key}_description`)
      let initialValue = defaultValue
      let initialCustomValue = ""
      let initialDescription = descriptions[defaultValue] || ""

      if (savedValue) {
        if (knownValues.includes(savedValue)) {
          initialValue = savedValue
          initialDescription = savedDesc || descriptions[savedValue] || ""
        } else {
          initialValue = "custom"
          initialCustomValue = savedValue
          initialDescription = savedDesc || savedValue || ""
        }
      }

      setter(initialValue)
      customSetter(initialCustomValue)
      descriptionSetter(initialDescription)
    }

    const savedApiKey = localStorage.getItem("openai_api_key")
    if (savedApiKey) setApiKey(savedApiKey)

    loadSetting("literary_style", KNOWN_STYLES, setLiteraryStyle, setCustomLiteraryStyle, setStyleDescription, STYLE_DESCRIPTIONS, "diderot")
    loadSetting("narrator_personality", KNOWN_PERSONALITIES, setNarratorPersonality, setCustomNarratorPersonality, setPersonalityDescription, PERSONALITY_DESCRIPTIONS, "playful")
    loadSetting("narrator_relation", KNOWN_RELATIONS, setNarratorRelation, setCustomNarratorRelation, setNarratorRelationDescription, NARRATOR_RELATION_DESCRIPTIONS, "heterodiegetic")
    loadSetting("focalization", KNOWN_FOCALIZATIONS, setFocalization, setCustomFocalization, setFocalizationDescription, FOCALIZATION_DESCRIPTIONS, "zero")
    loadSetting("narrative_person", KNOWN_PERSONS, setNarrativePerson, setCustomNarrativePerson, setNarrativePersonDescription, PERSON_DESCRIPTIONS, "third_person")
    loadSetting("narrative_tense", KNOWN_TENSES, setNarrativeTense, setCustomNarrativeTense, setNarrativeTenseDescription, TENSE_DESCRIPTIONS, "past")
    loadSetting("literary_genre", KNOWN_GENRES, setLiteraryGenre, setCustomLiteraryGenre, setGenreDescription, GENRE_DESCRIPTIONS, "conte_philosophique")
  }, [])

  const saveSettings = () => {
    const saveSetting = (
      key: string,
      selectedValue: string,
      customValue: string,
      descriptionStateSetter: (desc: string) => void,
      knownValues: string[],
      descriptions: Record<string, string>,
      defaultValue: string,
      settingName: string
    ) => {
      const finalValue = selectedValue === "custom" ? customValue.trim() : selectedValue
      let finalDescription = ""

      if (selectedValue === "custom") {
        finalDescription = customValue.trim() || descriptions[defaultValue]
      } else {
        finalDescription = descriptions[selectedValue] || descriptions[defaultValue]
      }

      if (selectedValue === "custom" && !customValue.trim()) {
        localStorage.setItem(key, defaultValue)
        localStorage.setItem(`${key}_description`, descriptions[defaultValue])
        descriptionStateSetter(descriptions[defaultValue])
        toast({
          title: `${settingName} personnalise vide`,
          description: `Retour a la valeur par defaut.`,
        })
        return defaultValue
      } else {
        localStorage.setItem(key, finalValue)
        localStorage.setItem(`${key}_description`, finalDescription)
        descriptionStateSetter(finalDescription)
        return finalValue
      }
    }

    localStorage.setItem("openai_api_key", apiKey)

    saveSetting("literary_style", literaryStyle, customLiteraryStyle, setStyleDescription, KNOWN_STYLES, STYLE_DESCRIPTIONS, "diderot", "Style")
    saveSetting("narrator_personality", narratorPersonality, customNarratorPersonality, setPersonalityDescription, KNOWN_PERSONALITIES, PERSONALITY_DESCRIPTIONS, "playful", "Personnalite")
    saveSetting("narrator_relation", narratorRelation, customNarratorRelation, setNarratorRelationDescription, KNOWN_RELATIONS, NARRATOR_RELATION_DESCRIPTIONS, "heterodiegetic", "Relation")
    saveSetting("focalization", focalization, customFocalization, setFocalizationDescription, KNOWN_FOCALIZATIONS, FOCALIZATION_DESCRIPTIONS, "zero", "Focalisation")
    saveSetting("narrative_person", narrativePerson, customNarrativePerson, setNarrativePersonDescription, KNOWN_PERSONS, PERSON_DESCRIPTIONS, "third_person", "Personne")
    saveSetting("narrative_tense", narrativeTense, customNarrativeTense, setNarrativeTenseDescription, KNOWN_TENSES, TENSE_DESCRIPTIONS, "past", "Temps")
    saveSetting("literary_genre", literaryGenre, customLiteraryGenre, setGenreDescription, KNOWN_GENRES, GENRE_DESCRIPTIONS, "conte_philosophique", "Genre")

    toast({
      title: "Parametres sauvegardes",
      description: "Vos preferences narratives ont ete enregistrees.",
    })

    onSettingsSaved()
  }

  const renderSettingSelect = (
    id: string,
    label: string,
    selectedValue: string,
    onValueChange: (value: string) => void,
    knownValues: string[],
    displayNames: Record<string, string>,
    descriptions: Record<string, string>,
    customValue: string,
    onCustomChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    placeholder: string,
    currentDescription: string,
    useTextarea: boolean = false
  ) => (
    <div className="space-y-3 py-4 border-t border-border first:pt-0 first:border-t-0">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <Select value={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className={cn(
            "border-input bg-background",
            "focus:ring-2 focus:ring-ring"
          )}
        >
          <SelectValue placeholder={`Choisir ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {knownValues.map((value) => (
            <SelectItem key={value} value={value}>
              {displayNames[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ")}
            </SelectItem>
          ))}
          <SelectItem value="custom">Autre (preciser)</SelectItem>
        </SelectContent>
      </Select>
      {selectedValue === "custom" && (
        useTextarea ? (
          <Textarea
            value={customValue}
            onChange={onCustomChange}
            placeholder={placeholder}
            className="mt-2 border-input bg-background focus:ring-2 focus:ring-ring"
            rows={2}
          />
        ) : (
          <Input
            value={customValue}
            onChange={onCustomChange}
            placeholder={placeholder}
            className="mt-2 border-input bg-background focus:ring-2 focus:ring-ring"
          />
        )
      )}
      <p className="text-sm text-muted-foreground italic">
        {selectedValue === "custom"
          ? (customValue.trim() || "Veuillez decrire votre choix personnalise.")
          : (descriptions[selectedValue] || "Description non disponible.")
        }
      </p>
    </div>
  )

  return (
    <div className="space-y-0">
      {/* API Key Section */}
      <div className="space-y-3 pb-4">
        <Label htmlFor="apiKeyForm" className="text-sm font-semibold text-foreground">
          Cle API OpenAI
        </Label>
        <Input
          id="apiKeyForm"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="border-input bg-background focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Cle stockee localement dans votre navigateur.
        </p>
      </div>

      {/* Settings Sections */}
      {renderSettingSelect(
        "genreForm", "Genre Litteraire", literaryGenre,
        setLiteraryGenre, KNOWN_GENRES, GENRE_DISPLAY_NAMES, GENRE_DESCRIPTIONS,
        customLiteraryGenre, (e) => setCustomLiteraryGenre(e.target.value),
        "Decrivez le genre (ex: Roman d'aventure post-apocalyptique)", genreDescription, true
      )}
      {renderSettingSelect(
        "styleForm", "Style Litteraire", literaryStyle,
        setLiteraryStyle, KNOWN_STYLES, KNOWN_STYLES.reduce((acc, style) => { acc[style] = style.charAt(0).toUpperCase() + style.slice(1); return acc; }, {} as Record<string, string>), STYLE_DESCRIPTIONS,
        customLiteraryStyle, (e) => setCustomLiteraryStyle(e.target.value),
        "Decrivez le style (ex: Minimaliste et poetique)", styleDescription, true
      )}
      {renderSettingSelect(
        "personalityForm", "Ton / Personnalite du Narrateur", narratorPersonality,
        setNarratorPersonality, KNOWN_PERSONALITIES, PERSONALITY_DISPLAY_NAMES, PERSONALITY_DESCRIPTIONS,
        customNarratorPersonality, (e) => setCustomNarratorPersonality(e.target.value),
        "Decrivez la personnalite (ex: Sarcastique et desabuse)", personalityDescription, true
      )}
      {renderSettingSelect(
        "narratorRelationForm", "Relation Narrateur/Histoire (Voix)", narratorRelation,
        setNarratorRelation, KNOWN_RELATIONS, NARRATOR_RELATION_DISPLAY_NAMES, NARRATOR_RELATION_DESCRIPTIONS,
        customNarratorRelation, (e) => setCustomNarratorRelation(e.target.value),
        "Decrivez la relation (ex: Narrateur temoin)", narratorRelationDescription, true
      )}
      {renderSettingSelect(
        "focalizationForm", "Focalisation (Perspective)", focalization,
        setFocalization, KNOWN_FOCALIZATIONS, FOCALIZATION_DISPLAY_NAMES, FOCALIZATION_DESCRIPTIONS,
        customFocalization, (e) => setCustomFocalization(e.target.value),
        "Decrivez la focalisation (ex: Interne variable)", focalizationDescription, true
      )}
      {renderSettingSelect(
        "narrativePersonForm", "Personne Narrative (Grammaire)", narrativePerson,
        setNarrativePerson, KNOWN_PERSONS, PERSON_DISPLAY_NAMES, PERSON_DESCRIPTIONS,
        customNarrativePerson, (e) => setCustomNarrativePerson(e.target.value),
        "Decrivez l'usage (ex: Premiere personne plurielle 'Nous')", narrativePersonDescription, true
      )}
      {renderSettingSelect(
        "narrativeTenseForm", "Temps Principal", narrativeTense,
        setNarrativeTense, KNOWN_TENSES, TENSE_DISPLAY_NAMES, TENSE_DESCRIPTIONS,
        customNarrativeTense, (e) => setCustomNarrativeTense(e.target.value),
        "Decrivez le temps (ex: Alternance passe/present)", narrativeTenseDescription, true
      )}

      {/* Save Button */}
      <div className="pt-6">
        <Button
          onClick={saveSettings}
          className={cn(
            "w-full bg-primary hover:bg-primary/90 text-primary-foreground",
            "font-serif text-base py-3"
          )}
        >
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder les parametres
        </Button>
      </div>
    </div>
  )
}
