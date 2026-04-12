import { Button } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'

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
  const [interimTranscript, setInterimTranscript] = useState('');

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
    recognition.lang = 'en-US'
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

      setInterimTranscript(nextInterimText);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  const handleStart = () => {
    setInterimTranscript('')
    recognitionRef.current?.start()
  }

  const handleStop = () => {
    recognitionRef.current?.stop()
    setInterimTranscript('')
  }

  return (
    <div className={`mt-8 ${isDark ? 'dark-mode-context' : 'light-mode-context'}`}>
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
