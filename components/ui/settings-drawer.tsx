"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet, // Changé: Utiliser Sheet
  SheetClose, // Changé
  SheetContent, // Changé
  SheetDescription, // Changé
  SheetFooter, // Changé (si tu l'utilises)
  SheetHeader, // Changé
  SheetTitle, // Changé
  SheetTrigger, // Changé
} from "@/components/ui/sheet" // Changé: Importer depuis sheet
import { ScrollArea } from "@/components/ui/scroll-area"
import { SettingsForm } from "./settings-form" // Import the form
import { X } from "lucide-react"

interface SettingsSheetProps { // Renommé pour correspondre
    children: React.ReactNode; // The trigger element
    onSettingsSaved: () => void; // Callback passed down to SettingsForm
}

// Renommé le composant pour refléter l'utilisation de Sheet (optionnel mais recommandé)
export function SettingsSheet({ children, onSettingsSaved }: SettingsSheetProps) {

    const handleSave = () => {
        onSettingsSaved();
        // La fermeture peut être gérée par SheetClose ou programmatiquement si nécessaire
    }

    return (
        // Utiliser le composant Sheet racine
        <Sheet>
            {/* Le déclencheur reste similaire */}
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            {/* SheetContent contient le panneau latéral */}
            <SheetContent
                side="right" // <-- Spécifie que le panneau doit apparaître à droite
                className="w-[90vw] max-w-[550px] h-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-0" // Garde tes classes de largeur/hauteur. Ajout de p-0 pour contrôler le padding interne manuellement.
            >
                 {/* SheetHeader pour l'en-tête */}
                 <SheetHeader className="p-6 border-b border-amber-200">
                    <div className="flex justify-between items-center">
                         <div>
                            {/* SheetTitle et SheetDescription */}
                            <SheetTitle className="text-2xl font-serif text-amber-900">
                                Configuration Narrative
                            </SheetTitle>
                            <SheetDescription className="text-amber-700">
                                Ajustez les paramètres en temps réel.
                            </SheetDescription>
                         </div>
                         
                    </div>
                </SheetHeader>

                {/* La zone de défilement pour le contenu */}
                <ScrollArea className="flex-1 overflow-y-auto p-6"> {/* Ajouter le padding ici pour le contenu */}
                    {/* Le formulaire de paramètres */}
                    <SettingsForm
                        onSettingsSaved={handleSave}
                        // onClose peut être passé si nécessaire, mais SheetClose est souvent suffisant
                    />
                </ScrollArea>

                {/* Le pied de page (SheetFooter) reste optionnel */}
                {/* <SheetFooter className="p-4 border-t border-amber-200">
                     <SheetClose asChild>
                         <Button variant="outline">Annuler</Button>
                     </SheetClose>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    )
}