"use client"

import { useState } from "react"
import { usePlayerStore } from "@/store/player-store"
import { PlaylistCard } from "@/components/playlist-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LibraryPage() {
  const { playlist } = usePlayerStore()
  const [activeTab, setActiveTab] = useState("playlists")

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sua Biblioteca</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent w-full justify-start overflow-x-auto">
          <TabsTrigger
            value="playlists"
            className="bg-zinc-800 text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Playlists
          </TabsTrigger>
          <TabsTrigger
            value="podcasts"
            className="bg-zinc-800 text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Podcasts
          </TabsTrigger>
          <TabsTrigger
            value="artistas"
            className="bg-zinc-800 text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Artistas
          </TabsTrigger>
          <TabsTrigger
            value="albuns"
            className="bg-zinc-800 text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Álbuns
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
          {playlist.map((song) => (
            <PlaylistCard key={song.id} song={song} showAddToQueue />
          ))}
        </div>
      </section>
    </div>
  )
}

