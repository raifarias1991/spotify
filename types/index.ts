export interface Song {
  id: string
  title: string
  artist: string
  cover: string
  thumbnail: string
  channelTitle: string
}

export interface PlayerState {
  currentTime: number
  duration: number
  volume: number
}

export interface Tab {
  id: string
  label: string
}

export interface YouTubeSearchResult {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
}

