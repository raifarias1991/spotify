"use client"

import Link from "next/link"
import { Home, Search, Library, PlusSquare, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out md:block bg-card w-64 p-6 flex flex-col h-full z-40`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Spotify</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-white flex items-center gap-4 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Home size={24} />
                <span>Início</span>
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-white flex items-center gap-4 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Search size={24} />
                <span>Buscar</span>
              </Link>
            </li>
            <li>
              <Link
                href="/library"
                className="text-muted-foreground hover:text-white flex items-center gap-4 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Library size={24} />
                <span>Sua Biblioteca</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button className="text-muted-foreground hover:text-white flex items-center gap-4 transition-colors duration-200">
            <PlusSquare size={24} />
            <span>Criar playlist</span>
          </button>
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar} />}
    </>
  )
}

