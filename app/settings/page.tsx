"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [literaryStyle, setLiteraryStyle] = useState("diderot")
  const [narratorPersonality, setNarratorPersonality] = useState("playful")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load settings from localStorage if available
    const savedApiKey = localStorage.getItem("openai_api_key")
    const savedStyle = localStorage.getItem("literary_style")
    const savedPersonality = localStorage.getItem("narrator_personality")

    if (savedApiKey) setApiKey(savedApiKey)
    if (savedStyle) setLiteraryStyle(savedStyle)
    if (savedPersonality) setNarratorPersonality(savedPersonality)
  }, [])

  const saveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem("openai_api_key", apiKey)
    localStorage.setItem("literary_style", literaryStyle)
    localStorage.setItem("narrator_personality", narratorPersonality)

    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été enregistrées avec succès.",
    })
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
              <Label htmlFor="apiKey" className="text-base">
                Clé API OpenAI
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="border-amber-200 focus:ring-amber-500"
              />
              <p className="text-sm text-gray-500">
                Votre clé API est stockée uniquement dans votre navigateur et n'est jamais partagée.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style" className="text-base">
                Style littéraire
              </Label>
              <Select value={literaryStyle} onValueChange={setLiteraryStyle}>
                <SelectTrigger id="style" className="border-amber-200">
                  <SelectValue placeholder="Choisir un style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diderot">Diderot (XVIIIe siècle)</SelectItem>
                  <SelectItem value="balzac">Balzac (XIXe siècle)</SelectItem>
                  <SelectItem value="proust">Proust (Belle Époque)</SelectItem>
                  <SelectItem value="camus">Camus (Existentialisme)</SelectItem>
                  <SelectItem value="vian">Boris Vian (Surréalisme)</SelectItem>
                  <SelectItem value="contemporary">Contemporain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality" className="text-base">
                Personnalité du narrateur
              </Label>
              <Select value={narratorPersonality} onValueChange={setNarratorPersonality}>
                <SelectTrigger id="personality" className="border-amber-200">
                  <SelectValue placeholder="Choisir une personnalité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playful">Espiègle et joueur</SelectItem>
                  <SelectItem value="philosophical">Philosophique</SelectItem>
                  <SelectItem value="ironic">Ironique</SelectItem>
                  <SelectItem value="dramatic">Dramatique</SelectItem>
                  <SelectItem value="absurd">Absurde</SelectItem>
                </SelectContent>
              </Select>
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
