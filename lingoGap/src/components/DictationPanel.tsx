import { Button } from '@heroui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  createSegment,
  parseEditedText
} from '../lib/transcriptUtils'
import { useDictationRecognition } from '../hooks/useDictationRecognition'

type DictationPanelProps = {
  isDark: boolean
}

export function DictationPanel({ isDark }: DictationPanelProps) {
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const transcriptAreaRef = useRef<HTMLDivElement | null>(null)
  const {
    segments,
    setSegments,
    isRecording,
    isSupported,
    isListening,
    interimTranscript,
    error,
    isPolishMode,
    isTranslating,
    startRecording,
    stopRecording,
    clearTranscript,
    togglePolishMode,
  } = useDictationRecognition()

  const polishCount = useMemo(
    () => segments.filter((s) => s.isTranslated).length,
    [segments]
  )

  const enterEditMode = useCallback(() => {
    if (isEditing) return
    if (segments.length === 0) return
    setHoveredSegmentId(null)

    setEditText(segments.map((s) => {
      if (s.isTranslated) {
        return `[${s.originalPolish} | ${s.displayText}]`
      } else {
        return s.displayText
      }
    }).join(' ')
    )
    
    setIsEditing(true)
  }, [isEditing, segments])
  

  const leaveEditMode = useCallback(() => {
    if (!isEditing) return

    const newText = editText.trim()
    if (newText) {
      setSegments(parseEditedText(newText))
    } else {
      setSegments([])
    }

    setHoveredSegmentId(null)
    setIsEditing(false)
    setEditText('')
  }, [editText, isEditing, setSegments])

  useEffect(() => {
    if (!isEditing) return

    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (!targetNode) return
      const container = transcriptAreaRef.current
      if (container && !container.contains(targetNode)) {
        leaveEditMode()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isEditing, leaveEditMode])


  const handleCopy = useCallback(() => {
    const cleanText = segments.map(s => s.displayText).join(' ') + 
                      (interimTranscript ? ` ${interimTranscript}` : '')
    
    navigator.clipboard.writeText(cleanText.trim())
    
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }, [segments, interimTranscript])


  return (
    <div className={`mt-8 ${isDark ? 'dark-mode-context' : 'light-mode-context'}`}>
      {/* Language mode indicator */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isPolishMode
              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
              : isDark
              ? 'bg-zinc-800/60 text-zinc-400 ring-1 ring-zinc-700/50'
              : 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'
          }`}
        >
          <span className={`h-2 w-2 rounded-full transition-colors ${
            isPolishMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
          }`} />
          {isPolishMode ? 'Polish mode — say your word' : 'English mode'}
        </div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              size="sm"
              variant={isPolishMode ? 'primary' : 'outline'}
              className={`rounded-full px-5 py-2 font-medium transition-all duration-200 ${
                isPolishMode
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : isDark
                  ? 'border-amber-600/40 text-amber-400 hover:bg-amber-500/10'
                  : 'border-amber-500/40 text-amber-600 hover:bg-amber-50'
              }`}
              onPress={togglePolishMode}
            >
              {isPolishMode ? 'Back to English' : 'Switch to Polish'}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Action Bar that sits above the text input */}
      {segments.length > 0 && (
        <div className="mb-2 flex w-full justify-end gap-2">
          <button
            onClick={handleCopy}
            className={`flex min-w-[75px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              isCopied
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : isDark
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'
            }`}
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={isEditing ? leaveEditMode : enterEditMode}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              isDark
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      )}

      {/* Transcript display — rich segmented view / editable textarea */}
      <div className="relative" ref={transcriptAreaRef}>
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Edit your transcript here..."
            rows={8}
            className={`w-full resize-y rounded-xl border px-5 py-4 pt-10 text-base leading-8 outline-none transition-colors ${
              isDark
                ? 'border-zinc-700 bg-zinc-950/50 text-zinc-100 focus:border-zinc-500'
                : 'border-zinc-200 bg-white/50 text-zinc-900 focus:border-zinc-400'
            }`}
          />
        ) : (
        <div
          className={`relative min-h-45 w-full rounded-xl border px-5 py-4 text-base leading-8 transition-colors ${
            isDark
              ? 'border-zinc-800 bg-zinc-950/50 text-zinc-100'
              : 'border-zinc-200 bg-white/50 text-zinc-900'
          }`}
          onDoubleClick={enterEditMode}    
        >
        {segments.length === 0 && !interimTranscript && (
          <p className={`italic ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Press Start Recording and speak in English. When you forget a word, click
            Switch to Polish, say the word in Polish, and it will be auto-translated and
            highlighted.
          </p>
        )}

        <div className="block">
          {segments.map((segment) => (
            <span key={segment.id} className="inline">
              {segment.isTranslated ? (
                <span
                  className="translated-word-wrapper relative inline-block cursor-help"
                  onMouseEnter={() => setHoveredSegmentId(segment.id)}
                  onMouseLeave={() => setHoveredSegmentId(null)}
                >
                  <span
                    className={`rounded px-1 py-0.5 font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-amber-400/20 text-amber-300 decoration-amber-400/60'
                        : 'bg-amber-200/60 text-amber-800 decoration-amber-500/60'
                    } underline decoration-2 underline-offset-4`}
                  >
                    {segment.displayText}
                  </span>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredSegmentId === segment.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-2 text-sm shadow-xl ${
                          isDark
                            ? 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700'
                            : 'bg-white text-zinc-900 ring-1 ring-zinc-200 shadow-zinc-200/60'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                            Originally said (PL)
                          </span>
                          <span className="font-semibold text-amber-500">
                            „{segment.originalPolish}"
                          </span>
                        </div>
                        {/* Arrow */}
                        <div
                          className={`absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent ${
                            isDark ? 'border-t-zinc-800' : 'border-t-white'
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
              ) : (
                <span>{segment.displayText}</span>
              )}
              <span> </span>
            </span>
          ))}

          {/* Interim text */}
          {interimTranscript && (
            <span
              className={`italic ${
                isPolishMode
                  ? 'text-amber-500/70'
                  : isDark
                  ? 'text-zinc-500'
                  : 'text-zinc-400'
              }`}
            >
              {interimTranscript}
            </span>
          )}

          {/* Translating indicator */}
          {isTranslating && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-1 text-amber-500"
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '300ms' }} />
              <span className="ml-1 text-xs">translating…</span>
            </motion.span>
          )}
        </div>
      </div>
        )}
      </div>

      {/* Stats bar */}
      {segments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 flex items-center gap-4 rounded-lg px-3 py-2 text-xs ${
            isDark ? 'bg-zinc-900/50 text-zinc-500' : 'bg-zinc-50 text-zinc-500'
          }`}
        >
          <span>
            {segments.length} segment{segments.length !== 1 ? 's' : ''}
          </span>
          <span className="text-amber-500">
            {polishCount} translated
          </span>
          <button
            onClick={clearTranscript}
            className={`ml-auto rounded px-2 py-0.5 text-xs transition-colors ${
              isDark
                ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                : 'text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700'
            }`}
          >
            Clear all
          </button>
        </motion.div>
      )}

      {/* Status messages */}
      <div className="mt-3 min-h-6 text-sm">
        {!isSupported && (
          <p className="text-amber-600 dark:text-amber-400">
            Speech recognition is not supported in this browser. Please use Chrome or Edge.
          </p>
        )}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {isSupported && !error && (
          <p
            className={
              isListening
                ? isPolishMode
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
                : isDark
                ? 'text-zinc-600'
                : 'text-zinc-400'
            }
          >
            {isListening
              ? isPolishMode
                ? 'Listening in Polish — say your word, then switch back'
                : 'Listening in English...'
              : 'Ready to record'}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant={isRecording ? 'danger' : 'ghost'}
          size="lg"
          className={`rounded-xl px-6 py-3 font-medium transition-all ${
            isRecording
              ? 'opacity-60 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
          onPress={startRecording}
          isDisabled={isRecording}
        >
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Recording...
            </span>
          ) : (
            'Start Recording'
          )}
        </Button>

        <Button
          size="lg"
          variant={isRecording ? 'danger' : 'ghost'}
          className={`rounded-xl px-6 py-3 font-medium transition-all ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-500'
              : 'opacity-40 cursor-not-allowed'
          }`}
          onPress={stopRecording}
          isDisabled={!isRecording}
        >
          Stop Recording
        </Button>
      </div>

      {/* How to use tip */}
      {!isListening && segments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 rounded-xl border px-5 py-4 ${
            isDark
              ? 'border-zinc-800/60 bg-zinc-900/40'
              : 'border-zinc-200/60 bg-zinc-50/60'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}
          >
            How it works
          </p>
          <ol
            className={`mt-2 list-inside list-decimal space-y-1.5 text-sm ${
              isDark ? 'text-zinc-500' : 'text-zinc-500'
            }`}
          >
            <li>Click <strong>Start Recording</strong> and speak in English</li>
            <li>
              When you forget a word, click{' '}
              <strong className="text-amber-500">Switch to Polish</strong>
              {' '}or press <kbd className={`rounded border px-1.5 py-0.5 text-xs font-mono ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-zinc-300 bg-zinc-100 text-zinc-700'}`}>Alt</kbd>
            </li>
            <li>Say the word in Polish — it gets <span className={`rounded px-1 ${isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-200/60 text-amber-800'}`}>auto-translated</span> and highlighted</li>
            <li>Click <strong>Back to English</strong> (or press <kbd className={`rounded border px-1.5 py-0.5 text-xs font-mono ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-zinc-300 bg-zinc-100 text-zinc-700'}`}>Alt</kbd> again) to continue</li>
            <li>Hover over highlighted words to see what you originally said in Polish</li>
          </ol>
        </motion.div>
      )}
    </div>
  )
}
