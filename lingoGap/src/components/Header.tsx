import { Button } from '@heroui/react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <span
            className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-bold tracking-wide ${
              isDark ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
            }`}
          >
            LG
          </span>
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              LingoGap
            </p>
            <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Dictation assistant for code-switching learners
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex items-center gap-3"
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
    </header>
  )
}
