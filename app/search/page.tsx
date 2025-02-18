"use client"

import { useState } from "react"
import { usePlayerStore } from "@/store/player-store"
import { PlaylistCard } from "@/components/playlist-card"
import { SearchBar } from "@/components/search-bar"
import type { Song } from "@/types"

export default function SearchPage() {
  const { playlist, searchSongs } = usePlayerStore()
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    const results = await searchSongs(query)
    setSearchResults(results)
    setIsLoading(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Buscar</h1>

      <SearchBar onSearch={handleSearch} />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold mb-4">Resultados da busca</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {searchResults.map((song) => (
              <PlaylistCard key={song.id} song={song} showAddToQueue />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-xl font-bold mb-4">Navegar por todas as seções</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {playlist.slice(0, 12).map((song) => (
              <PlaylistCard key={song.id} song={song} showAddToQueue />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

