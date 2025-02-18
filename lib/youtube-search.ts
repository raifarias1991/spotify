import axios from "axios"
import type { YouTubeSearchResult } from "@/types"

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ""

if (!YOUTUBE_API_KEY) {
  console.warn("YouTube API key is not set. Please set NEXT_PUBLIC_YOUTUBE_API_KEY in your .env.local file.")
}

interface YouTubeApiResponse {
  items: Array<{
    id: {
      videoId: string
    }
    snippet: {
      title: string
      thumbnails: {
        default: {
          url: string
        }
      }
      channelTitle: string
    }
  }>
}

export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API key is not set. Unable to perform search.")
    return []
  }
  try {
    const response = await axios.get<YouTubeApiResponse>("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        maxResults: 10,
        q: query,
        type: "video",
        key: YOUTUBE_API_KEY,
        videoEmbeddable: true,
      },
    })

    if (!response.data.items) {
      console.error("Resposta da API não contém items")
      return []
    }

    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
    }))
  } catch (error) {
    console.error("Erro ao buscar no YouTube:", error)
    return []
  }
}

