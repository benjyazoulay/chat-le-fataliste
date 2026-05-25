import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, BookOpen, Feather, Github, Sparkles, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif text-lg font-semibold">
            <img 
              src="/diderot.jpg" 
              alt="" 
              className="h-8 w-8 rounded-full ring-2 ring-border" 
            />
            <span>Chat le Fataliste</span>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/benjyazoulay/chat-le-fataliste.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center py-16 md:py-24 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              {/* Portrait et titre */}
              <div className="space-y-6 animate-fade-in-up">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
                  <img 
                    src="/diderot.jpg" 
                    alt="Denis Diderot" 
                    className="relative h-28 w-28 md:h-36 md:w-36 mx-auto rounded-full ring-4 ring-border shadow-soft-lg" 
                  />
                </div>
                
                <h1 className="text-display-sm md:text-display font-serif font-bold tracking-tight text-foreground text-balance">
                  Chat le Fataliste
                </h1>
              </div>

              {/* Citation */}
              <div className="relative max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <Quote className="absolute -top-4 -left-2 h-8 w-8 text-primary/20 rotate-180" />
                <p className="text-lg md:text-xl text-muted-foreground font-serif italic leading-relaxed px-8">
                  Vous voyez, lecteur, que je suis en beau chemin, et qu&apos;il ne tiendrait qu&apos;a moi de vous faire attendre un an, deux ans, trois ans...
                </p>
                <p className="mt-3 text-sm text-muted-foreground/70">
                  — Denis Diderot, Jacques le Fataliste
                </p>
              </div>

              {/* Card principale */}
              <div 
                className="bg-card rounded-2xl shadow-soft-lg border border-border p-8 md:p-10 max-w-2xl mx-auto animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <p className="text-foreground text-lg leading-relaxed mb-8">
                  Co-ecrivez une histoire avec une intelligence artificielle.
                  A la maniere de Diderot, commentez, interrompez et perturbez sans cesse la narration.
                  <span className="block mt-2 font-medium text-primary">
                    C&apos;est vous qui tirez les ficelles !
                  </span>
                </p>

                <Link href="/chat" className="inline-block">
                  <Button 
                    size="lg"
                    className={cn(
                      "bg-primary hover:bg-primary/90 text-primary-foreground",
                      "font-serif text-lg px-8 py-6 h-auto",
                      "shadow-soft hover:shadow-soft-lg transition-all duration-300",
                      "group"
                    )}
                  >
                    Commencer l&apos;aventure
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div 
                className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex flex-col items-center text-center max-w-[140px]">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Styles litteraires</span>
                  <span className="text-xs text-muted-foreground mt-1">Diderot, Hugo, Proust...</span>
                </div>
                
                <div className="flex flex-col items-center text-center max-w-[140px]">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Feather className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Co-creation</span>
                  <span className="text-xs text-muted-foreground mt-1">Ecrivez ensemble</span>
                </div>
                
                <div className="flex flex-col items-center text-center max-w-[140px]">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Choix narratifs</span>
                  <span className="text-xs text-muted-foreground mt-1">Vous decidez</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 px-4">
          <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Cree par{" "}
              <a 
                href="https://github.com/benjyazoulay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                Benjamin Azoulay
              </a>
              {" "}— 2025
            </p>
            <a 
              href="https://github.com/benjyazoulay/chat-le-fataliste.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              Voir sur GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
