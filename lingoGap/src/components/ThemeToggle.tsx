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
      className="rounded-full !bg-transparent text-zinc-900 border border-zinc-200 dark:text-zinc-100 dark:border-zinc-800"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}
