import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { AudioPlayer } from "@/components/audio-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Um clone do Spotify usando Next.js e YouTube API",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex flex-col h-screen`}>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto spotify-gradient pb-24 md:pb-28 pt-16 md:pt-0">{children}</main>
        </div>
        <AudioPlayer />
      </body>
    </html>
  )
}



import './globals.css'