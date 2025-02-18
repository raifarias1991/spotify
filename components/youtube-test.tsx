"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { searchYouTube } from "@/lib/youtube-search"

export function YouTubeTest() {
  const [results, setResults] = useState<Array<{ title: string; id: string }>>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    try {
      setLoading(true)
      setError("")
      const searchResults = await searchYouTube("teste")
      setResults(searchResults)
      if (searchResults.length === 0) {
        setError("Nenhum resultado encontrado. Verifique se a chave da API está correta.")
      }
    } catch (err) {
      setError("Erro ao testar a API do YouTube. Verifique o console para mais detalhes.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-zinc-800 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Teste da API do YouTube</h2>
      <div className="space-y-4">
        <Button onClick={handleTest} disabled={loading} className="w-full">
          {loading ? "Testando..." : "Testar Conexão"}
        </Button>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Resultados do teste:</h3>
            <ul className="space-y-1">
              {results.map((result) => (
                <li key={result.id} className="text-sm text-zinc-300">
                  {result.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

