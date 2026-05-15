import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { FlashcardsPage } from './pages/FlashcardsPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { Header } from './components/Header.tsx'

function App() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen relative z-0 ${
          isDark
            ? 'bg-zinc-950 text-zinc-100 bg-dot-white'
            : 'bg-zinc-50 text-zinc-900 bg-dot-black'
        }`}
      >
        <Header />

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/flashcards" element={<FlashcardsPage isDark={isDark} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
