import { Chip } from '@heroui/react'
import { motion } from 'framer-motion'

type FlashcardsPageProps = {
  isDark: boolean
}

export function FlashcardsPage({ isDark }: FlashcardsPageProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-2xl border p-5 sm:rounded-3xl sm:p-8 ${
        isDark ? 'border-zinc-800 bg-zinc-950/80' : 'border-zinc-200/80 bg-white/80'
      }`}
    >
      <Chip color="success" variant="soft" className="mb-4 font-medium">
        Flashcards
      </Chip>
      <h2 className={`text-2xl font-semibold sm:text-3xl ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
        Your saved vocabulary will appear here.
      </h2>
      <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        We will connect this page to your translation pipeline in the next steps.
      </p>
    </motion.section>
  )
}
