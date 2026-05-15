import { useTheme } from 'next-themes'
import { Button } from '@heroui/react'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return placeholder with same sizing to avoid layout shift
    return <div className="h-10 w-10" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      isIconOnly
      variant="ghost"
      aria-label="Toggle Dark Mode"
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-full p-0 text-sm transition !bg-transparent hover:!bg-transparent ${
        isDark
          ? 'text-zinc-200 hover:text-white'
          : 'text-zinc-700 hover:text-zinc-900'
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center leading-none">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </Button>
  )
}
