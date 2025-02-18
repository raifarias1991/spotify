import { create } from "zustand"
import { searchYouTube } from "@/lib/youtube-search"
import type { Song, PlayerState } from "@/types"

interface PlayerStore {
  currentSong: Song | null
  isPlaying: boolean
  playlist: Song[]
  queue: Song[]
  playerState: PlayerState
  setCurrentSong: (song: Song | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setPlayerState: (state: Partial<PlayerState>) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (songId: string) => void
  searchSongs: (query: string) => Promise<Song[]>
  loadInitialPlaylist: () => Promise<void>
  nextSong: () => void
  previousSong: () => void
  togglePlay: () => void
  setVolume: (volume: number) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  queue: [],
  playerState: {
    currentTime: 0,
    duration: 0,
    volume: 1,
  },
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlayerState: (state) =>
    set((store) => ({
      playerState: { ...store.playerState, ...state },
    })),
  addToQueue: (song) =>
    set((store) => ({
      queue: [...store.queue, song],
    })),
  removeFromQueue: (songId) =>
    set((store) => ({
      queue: store.queue.filter((song) => song.id !== songId),
    })),
  searchSongs: async (query) => {
    try {
      const results = await searchYouTube(query)
      const songs: Song[] = results.map((result) => ({
        ...result,
        artist: result.channelTitle,
        cover: `https://i.ytimg.com/vi/${result.id}/hqdefault.jpg`,
      }))
      set((state) => ({ playlist: [...songs, ...state.playlist] }))
      return songs
    } catch (error) {
      console.error("Erro ao buscar músicas:", error)
      return []
    }
  },
  loadInitialPlaylist: async () => {
    try {
      const initialSongs = await searchYouTube("popular music")
      const songs: Song[] = initialSongs.map((result) => ({
        ...result,
        artist: result.channelTitle,
        cover: `https://i.ytimg.com/vi/${result.id}/hqdefault.jpg`,
      }))
      set({ playlist: songs })
    } catch (error) {
      console.error("Erro ao carregar playlist inicial:", error)
    }
  },
  nextSong: () => {
    const { currentSong, playlist, queue } = get()
    if (!currentSong) return

    const nextInQueue = queue[0]
    if (nextInQueue) {
      set((store) => ({
        currentSong: nextInQueue,
        queue: store.queue.slice(1),
        isPlaying: true,
      }))
      return
    }

    const currentIndex = playlist.findIndex((song) => song.id === currentSong.id)
    const nextSong = playlist[(currentIndex + 1) % playlist.length]
    set({
      currentSong: nextSong,
      isPlaying: true,
    })
  },
  previousSong: () => {
    const { currentSong, playlist } = get()
    if (!currentSong) return

    const currentIndex = playlist.findIndex((song) => song.id === currentSong.id)
    const previousSong = playlist[(currentIndex - 1 + playlist.length) % playlist.length]
    set({
      currentSong: previousSong,
      isPlaying: true,
    })
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) =>
    set((state) => ({
      playerState: { ...state.playerState, volume: Math.max(0, Math.min(1, volume)) },
    })),
}))

