"use client"

import { useState, type React } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query)
      setQuery("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="search"
        placeholder="Buscar músicas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-muted border-none text-foreground placeholder:text-muted-foreground text-sm md:text-base"
      />
      <Button type="submit" size="icon" variant="ghost">
        <Search className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </form>
  )
}

