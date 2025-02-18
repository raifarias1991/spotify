"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePlayerStore } from "@/store/player-store"
import { PlaylistCard } from "@/components/playlist-card"
import { SearchBar } from "@/components/search-bar"
import { ErrorBoundary } from "@/components/error-boundary"
import type { Song, Tab } from "@/types"

const tabs: Tab[] = [
  { id: "tudo", label: "Tudo" },
  { id: "musica", label: "Música" },
  { id: "podcasts", label: "Podcasts" },
]

export default function HomePage() {
  const { playlist, loadInitialPlaylist } = usePlayerStore()
  const [activeTab, setActiveTab] = useState("tudo")
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPlaylist = async () => {
      await loadInitialPlaylist()
      setIsLoading(false)
    }
    loadPlaylist()
  }, [loadInitialPlaylist])

  const handleSearch = async (query: string) => {
    const results = await usePlayerStore.getState().searchSongs(query)
    setSearchResults(results)
  }

  if (isLoading) {
    return <div className="p-4 md:p-6">Carregando...</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Bem-vindo de volta</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent w-full justify-start overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="bg-muted text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm px-3 py-1.5"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <SearchBar onSearch={handleSearch} />

      <ErrorBoundary>
        {searchResults.length > 0 ? (
          <section>
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Resultados da busca</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {searchResults.map((song) => (
                <PlaylistCard key={song.id} song={song} showAddToQueue />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Playlists em destaque</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {playlist.slice(0, 12).map((song) => (
                  <PlaylistCard key={song.id} song={song} showAddToQueue />
                ))}
              </div>
            </section>

            {playlist.length > 0 && (
              <>
                <section>
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Escolhido para você</h2>
                  <div className="bg-card/50 rounded-lg p-3 md:p-4">
                    <PlaylistCard song={playlist[0]} variant="large" />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Suas músicas estão com saudade</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                    {playlist.slice(1, 7).map((song) => (
                      <PlaylistCard key={song.id} song={song} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  )
}

