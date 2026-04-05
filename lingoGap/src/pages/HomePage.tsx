import { motion } from 'framer-motion'
import { DictationPanel } from '../components/DictationPanel'

type HomePageProps = {
  isDark: boolean
}

export function HomePage({ isDark }: HomePageProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className={`rounded-3xl border p-8 ${
        isDark ? 'border-zinc-800 bg-zinc-950/80' : 'border-zinc-200/80 bg-white/80'
      }`}
    >
      <h1
        className={`max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl ${
          isDark ? 'text-zinc-100' : 'text-zinc-900'
        }`}
      >
        Speak naturally. Keep your flow. Learn from every Polish fallback.
      </h1>

      <p className={`mt-4 max-w-2xl text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        Your app now has routing and theme switching. Next, we can plug speech-to-text
        into this transcript area.
      </p>

      <DictationPanel isDark={isDark} />
    </motion.section>
  )
}
