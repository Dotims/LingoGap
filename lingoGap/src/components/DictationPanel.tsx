import { Button } from '@heroui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildHighlightedTokens, countPolishTokens } from '../lib/transcriptUtils'

type DictationPanelProps = {
  isDark: boolean
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function DictationPanel({ isDark }: DictationPanelProps) {
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recognitionLang, setRecognitionLang] = useState('en-US')

  const recognitionRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      setError('Web Speech API is not supported in this browser')
      return;
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = recognitionLang
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsRecording(true)
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsRecording(false)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      setError(event.error || 'Speech recognition error')
    }

    recognition.onresult = (event: any) => {
      let nextInterimText = ''
      let finalText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' '
        } else {
          nextInterimText += event.results[i][0].transcript + ' '
        }
      }

      if (finalText) {
        setTranscript(prev => (prev + ' ' + finalText).trim())
      }

      setInterimTranscript(nextInterimText)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [recognitionLang])

  const handleStart = () => {
    setInterimTranscript('')
    if (recognitionRef.current) {
      recognitionRef.current.lang = recognitionLang
    }
    recognitionRef.current?.start()
  }

  const handleStop = () => {
    recognitionRef.current?.stop()
    setInterimTranscript('')
  }

  const highlightedTokens = useMemo(() => {
    return buildHighlightedTokens(transcript)
  }, [transcript])

  const polishCount = useMemo(() => {
    return countPolishTokens(highlightedTokens)
  }, [highlightedTokens])

  return (
    <div className={`mt-8 ${isDark ? 'dark-mode-context' : 'light-mode-context'}`}>
      <div className="mb-3 flex items-center gap-3">
        <label htmlFor="recognition-lang" className="text-sm text-zinc-500">
          Recognition language
        </label>
        <select
          id="recognition-lang"
          value={recognitionLang}
          onChange={(e) => setRecognitionLang(e.target.value)}
          disabled={isListening}
          className={`rounded-md border px-2 py-1 text-sm outline-none transition-colors ${
            isDark
              ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-zinc-500'
              : 'border-zinc-300 bg-white text-zinc-900 focus:border-zinc-400'
          }`}
        >
          <option value="en-US">English (en-US)</option>
          <option value="pl-PL">Polish (pl-PL)</option>
        </select>
      </div>

      <textarea
        value={transcript}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTranscript(e.target.value)}
        placeholder="Speech transcript will appear here. You can also type manually."
        rows={10}
        className={`w-full resize-y rounded-xl border px-4 py-3 text-base leading-7 outline-none transition-colors ${
          isDark
            ? 'border-zinc-800 bg-zinc-950/50 text-zinc-100 focus:border-zinc-600'
            : 'border-zinc-200 bg-white/50 text-zinc-900 focus:border-zinc-400'
        }`}
      />
      
      
      {interimTranscript && (
        <p className="mt-2 text-sm text-zinc-500 italic">
          {interimTranscript}
        </p>
      )}

      <div className="mt-3 rounded-lg border border-zinc-200/60 p-3 text-sm dark:border-zinc-800">
        {highlightedTokens.map((t, i) => (
          <span key={i} className={t.isPolish ? 'rounded bg-yellow-300/40 px-1' : ''}>
            {t.text}
          </span>
        ))}
      </div>

      <p className="mt-2 text-xs text-zinc-500">Detected Polish words: {polishCount}</p>

      <div className="mt-3 min-h-6 text-sm">
        {!isSupported && (
          <p className="text-amber-600 dark:text-amber-400">
            Speech recognition is not supported in this browser.
          </p>
        )}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {isSupported && !error && (
          <p className={isListening ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'}>
            {isListening ? 'Listening...' : 'Ready to record'}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button 
          variant={isRecording ? "danger-soft" : "primary"} 
          size="lg" 
          className={`font-medium transition-all ${isRecording ? 'opacity-80' : ''}`}
          onPress={handleStart}
          isDisabled={isRecording}
        >
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Listening...
            </span>
          ) : (
            'Start Recording'
          )}
        </Button>
        <Button 
          size="lg" 
          variant={isRecording ? "danger" : "outline"} 
          className="font-medium transition-all"
          onPress={handleStop}
          isDisabled={!isRecording}
        >
          Stop Recording
        </Button>
      </div>
    </div>
  )
}
