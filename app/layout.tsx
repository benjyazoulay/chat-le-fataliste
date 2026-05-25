import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chat le Fataliste | Experience Litteraire Interactive",
  description: "Co-ecrivez une histoire avec une intelligence artificielle, a la maniere de Denis Diderot. Une experience litteraire interactive unique.",
  keywords: ["litterature", "IA", "ecriture", "Diderot", "Jacques le Fataliste", "histoire interactive"],
  authors: [{ name: "Benjamin Azoulay" }],
  generator: "BabelGallery",
  openGraph: {
    title: "Chat le Fataliste",
    description: "Co-ecrivez une histoire avec une intelligence artificielle, a la maniere de Denis Diderot.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#161311" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/diderot.jpg" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
