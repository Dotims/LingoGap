import { Button, TextArea } from '@heroui/react'
import { useState } from 'react'

type DictationPanelProps = {
  isDark: boolean
}

export function DictationPanel({ isDark }: DictationPanelProps) {
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleStart = () => {
    setIsRecording(true)
    // TODO: You will trigger Web Speech API here
  }

  const handleStop = () => {
    setIsRecording(false)
    // TODO: You will stop Web Speech API here
  }

  return (
    <div className={`mt-8 ${isDark ? 'dark-mode-context' : 'light-mode-context'}`}>
      <TextArea
        value={transcript}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTranscript(e.target.value)}
        placeholder="Speech transcript will appear here. You can also type manually."
        rows={10}
        className={`w-full rounded-xl transition-all duration-300 ${
          isRecording ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/50' : ''
        }`}
      />

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
