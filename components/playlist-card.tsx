"use client"

import Image from "next/image"
import { usePlayerStore } from "@/store/player-store"
import { Play, Pause, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Song } from "@/types"
import { useState } from "react"

interface PlaylistCardProps {
  song: Song
  variant?: "default" | "large"
  showAddToQueue?: boolean
}

export function PlaylistCard({ song, variant = "default", showAddToQueue = false }: PlaylistCardProps) {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying, addToQueue, togglePlay } = usePlayerStore()
  const [imageError, setImageError] = useState(false)

  const isCurrentSong = currentSong?.id === song.id

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay()
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToQueue(song)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      className={cn(
        "group relative bg-card rounded-md p-2 md:p-4 transition-all hover:bg-card/80 cursor-pointer",
        variant === "large" ? "flex items-center gap-4" : "flex flex-col",
      )}
      onClick={handlePlay}
    >
      <div className={cn("relative aspect-square", variant === "large" ? "w-16 h-16 md:w-20 md:h-20" : "w-full")}>
        <Image
          src={imageError ? "/placeholder.svg" : song.cover || "/placeholder.svg"}
          alt={song.title}
          fill
          className="object-cover rounded-md"
          onError={handleImageError}
        />
        <Button
          size="icon"
          variant="default"
          className={cn(
            "absolute bottom-1 right-1 md:bottom-2 md:right-2 translate-y-4 opacity-0 transition-all",
            "bg-primary hover:bg-primary/90",
            "group-hover:translate-y-0 group-hover:opacity-100",
            isCurrentSong && "translate-y-0 opacity-100",
          )}
          onClick={handlePlay}
          aria-label={isCurrentSong && isPlaying ? "Pause" : "Play"}
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="h-3 w-3 md:h-4 md:w-4" />
          ) : (
            <Play className="h-3 w-3 md:h-4 md:w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 truncate mt-2">
        <h3 className="font-medium truncate text-xs md:text-sm">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>

      {showAddToQueue && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-1 right-1 md:top-2 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAddToQueue}
          aria-label="Add to queue"
        >
          <Plus className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      )}
    </div>
  )
}

