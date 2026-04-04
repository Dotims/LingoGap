import { Button, Chip, TextArea } from '@heroui/react'
import { motion } from 'framer-motion'

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
      <Chip color="accent" variant="soft" className="mb-4 font-medium">
        Home Page
      </Chip>

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

      <div className="mt-8">
        <TextArea
          placeholder="Speech transcript will appear here. You can also type manually."
          rows={10}
          className="w-full"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" size="lg" className="font-medium">
          Start Recording
        </Button>
        <Button size="lg" variant="outline" className="font-medium">
          Stop Recording
        </Button>
      </div>
    </motion.section>
  )
}
