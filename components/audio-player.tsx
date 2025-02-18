"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { usePlayerStore } from "@/store/player-store"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import YouTube from "react-youtube"
import type { YouTubePlayer } from "react-youtube"

export function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    playerState,
    setIsPlaying,
    setPlayerState,
    nextSong,
    previousSong,
    togglePlay,
    setVolume,
  } = usePlayerStore()
  const [player, setPlayer] = useState<YouTubePlayer | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (player && currentSong) {
      setError(null)
      if (isPlaying) {
        player.loadVideoById(currentSong.id)
        player.playVideo()
      } else {
        player.pauseVideo()
      }
    }
  }, [isPlaying, player, currentSong])

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (player) {
          const currentTime = player.getCurrentTime()
          const duration = player.getDuration()
          setPlayerState({ currentTime, duration })
        }
      }, 1000)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, player, setPlayerState])

  const onReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target)
  }

  const onError = (event: { data: number }) => {
    setError("Erro ao carregar o vídeo. Por favor, tente outra música.")
    nextSong()
  }

  const handleVolumeChange = (value: number[]) => {
    if (player) {
      const volume = value[0]
      player.setVolume(volume * 100)
      setVolume(volume)
      setIsMuted(volume === 0)
    }
  }

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute()
        player.setVolume(playerState.volume * 100)
      } else {
        player.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  if (!currentSong) return null

  const progress = (playerState.currentTime / playerState.duration) * 100 || 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 md:p-4 z-50">
      <YouTube
        videoId={currentSong.id}
        opts={{
          height: "0",
          width: "0",
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
        onError={onError}
        onEnd={nextSong}
        className="hidden"
      />

      <div className="flex flex-col gap-2">
        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Image
              src={currentSong.cover || "/placeholder.svg"}
              alt={currentSong.title}
              width={40}
              height={40}
              className="rounded-md hidden sm:block"
            />
            <div className="flex-1 min-w-0 truncate">
              <p className="font-medium truncate text-sm">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={previousSong}
              className="hidden sm:inline-flex"
              aria-label="Previous song"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="hover:bg-primary/20"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5 text-primary" /> : <Play className="h-5 w-5 text-primary" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={nextSong}
              className="hidden sm:inline-flex"
              aria-label="Next song"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-2 min-w-[140px]">
            <Button size="icon" variant="ghost" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : playerState.volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  )
}

