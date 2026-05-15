import { Button } from '@heroui/react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <header className="border-b border-zinc-800/80 bg-zinc-950/70 h-20 w-full" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <header
      className={`border-b backdrop-blur-md sticky top-0 z-50 ${
        isDark ? 'border-zinc-800/80 bg-zinc-950/70' : 'border-zinc-200/70 bg-zinc-50/70'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex w-full items-center justify-between gap-3 sm:w-auto"
        >
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              LingoGap
            </p>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm transition ${
                isDark
                  ? 'text-zinc-300 hover:bg-zinc-900/50'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <span className="sr-only">Toggle menu</span>
              <span className="relative h-4 w-4">
                <span
                  className={`absolute left-0 right-0 h-0.5 rounded-full transition-transform ${
                    isDark ? 'bg-zinc-300' : 'bg-zinc-700'
                  } ${
                    isMenuOpen
                      ? 'top-1/2 -translate-y-1/2 rotate-45'
                      : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-0.5 rounded-full transition-opacity ${
                    isDark ? 'bg-zinc-300' : 'bg-zinc-700'
                  } ${
                    isMenuOpen
                      ? 'opacity-0'
                      : 'top-1/2 -translate-y-1/2'
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-0.5 rounded-full transition-transform ${
                    isDark ? 'bg-zinc-300' : 'bg-zinc-700'
                  } ${
                    isMenuOpen
                      ? 'top-1/2 -translate-y-1/2 -rotate-45'
                      : 'bottom-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="hidden items-center gap-3 sm:flex"
        >
          <nav className="flex items-center gap-2">
            <NavLink to="/">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'primary' : 'ghost'}
                  className="rounded-full font-medium"
                >
                  Home
                </Button>
              )}
            </NavLink>
            <NavLink to="/flashcards">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'primary' : 'ghost'}
                  className="rounded-full font-medium"
                >
                  Flashcards
                </Button>
              )}
            </NavLink>
          </nav>

          <ThemeToggle />
        </motion.div>
      </div>

      <div
        id="mobile-nav"
        className={`w-full px-4 pb-4 sm:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className={`rounded-2xl border p-3 ${
            isDark ? 'border-zinc-800/80 bg-zinc-950/80' : 'border-zinc-200/80 bg-white/90'
          }`}
        >
          <nav className="flex flex-col gap-2">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'primary' : 'ghost'}
                  className="w-full justify-start rounded-xl font-medium"
                >
                  Home
                </Button>
              )}
            </NavLink>
            <NavLink to="/flashcards" onClick={() => setIsMenuOpen(false)}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'primary' : 'ghost'}
                  className="w-full justify-start rounded-xl font-medium"
                >
                  Flashcards
                </Button>
              )}
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
