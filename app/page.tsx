import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Feather, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-24">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-2">
          <div className="text-center">
            <img src="/diderot.jpg" alt="Diderot" className="h-24 w-24 mx-auto" />
          </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">Chat le Fataliste</h1>
            <p className="text-xl md:text-2xl text-gray-700 font-serif italic">
              « Vous voyez, lecteur, que je suis en beau chemin, et qu'il ne tiendrait qu'à moi de vous faire attendre
              un an, deux ans, trois ans... »
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-amber-200">
            <p className="text-lg text-gray-800 mb-6">
              Co-écrivez une histoire avec une intelligence artificielle.
              À la manière de Diderot, commentez, interrompez et perturbez sans-cesse la narration. <br></br> C'est vous qui tirez les ficelles !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white font-serif text-lg py-6">
                  Commencer l'aventure
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-6">
            <div className="flex flex-col items-center text-amber-800">
              <BookOpen className="h-8 w-8 mb-2" />
              <span className="text-sm">Styles littéraires</span>
            </div>
            <div className="flex flex-col items-center text-amber-800">
              <Feather className="h-8 w-8 mb-2" />
              <span className="text-sm">Co-création narrative</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-gray-600 bg-amber-100">
        <p className="text-sm">Benjamin Azoulay - {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
