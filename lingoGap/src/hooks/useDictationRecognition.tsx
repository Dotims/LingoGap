import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { type TranscriptSegment, createSegment } from '../lib/transcriptUtils'
import { translatePolishToEnglish } from '../lib/translationService'

type UseDictationRecognitionResult = {
    segments: TranscriptSegment[]
    setSegments: Dispatch<SetStateAction<TranscriptSegment[]>>
    isRecording: boolean
    isSupported: boolean
    isListening: boolean
    interimTranscript: string
    error: string | null
    isPolishMode: boolean
    isTranslating: boolean
    startRecording: () => void
    stopRecording: () => void
    clearTranscript: () => void
    togglePolishMode: () => void
}

export function useDictationRecognition(): UseDictationRecognitionResult {
    const [segments, setSegments] = useState<TranscriptSegment[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const [isSupported, setIsSupported] = useState(true)
    const [isListening, setIsListening] = useState(false)
    const [interimTranscript, setInterimTranscript] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPolishMode, setIsPolishMode] = useState(false)
    const [isTranslating, setIsTranslating] = useState(false)

    const recognitionRef = useRef<any>(null)
    const shouldRestartRef = useRef(false)
    const isPolishModeRef = useRef(false)

    useEffect(() => {
        isPolishModeRef.current = isPolishMode
    }, [isPolishMode])

    const createRecognition = (lang: string) => {
        const SpeechRecognitionCtor =
            window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognitionCtor) {
            setIsSupported(false)
            setError('Web Speech API is not supported in this browser')
            return null
        }

        const recognition = new SpeechRecognitionCtor()
        recognition.lang = lang
        recognition.continuous = true
        recognition.interimResults = true
        return recognition
    }

    const setupRecognition = (recognition: any) => {
        recognition.onstart = () => {
            setIsRecording(true)
            setIsListening(true)
            setError(null)
        }

        recognition.onend = () => {
            if (shouldRestartRef.current) {
                shouldRestartRef.current = false
                const newLang = isPolishModeRef.current ? 'pl-PL' : 'en-US'
                const newRecognition = createRecognition(newLang)
                if (newRecognition) {
                    setupRecognition(newRecognition)
                    recognitionRef.current = newRecognition
                    try {
                        newRecognition.start()
                    } catch {
                        setIsRecording(false)
                        setIsListening(false)
                    }
                }
                return
            }
            setIsRecording(false)
            setIsListening(false)
        }

        recognition.onerror = (event: any) => {
            if (event.error === 'aborted') return
            setError(event.error || 'Speech recognition error')
        }

        recognition.onresult = async (event: any) => {
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
                const trimmedFinal = finalText.trim()

                if (isPolishModeRef.current) {
                    setIsTranslating(true)
                    const result = await translatePolishToEnglish(trimmedFinal)
                    setIsTranslating(false)

                    if (result.success) {
                        setSegments((prev) => [
                            ...prev,
                            createSegment(result.translatedEnglish, result.originalPolish),
                        ])
                    } else {
                        setSegments((prev) => [...prev, createSegment(trimmedFinal, trimmedFinal)])
                    }
                } else {
                    setSegments((prev) => [...prev, createSegment(trimmedFinal)])
                }
            }

            setInterimTranscript(nextInterimText)
        }
    }

    const startRecording = () => {
        setInterimTranscript('')
        setIsPolishMode(false)
        isPolishModeRef.current = false

        const recognition = createRecognition('en-US')
        if (!recognition) return

        setupRecognition(recognition)
        recognitionRef.current = recognition

        try {
            recognition.start()
        } catch {
            setError('Could not start speech recognition')
        }
    }

    const stopRecording = () => {
        shouldRestartRef.current = false
        recognitionRef.current?.stop()
        setInterimTranscript('')
        setIsPolishMode(false)
        isPolishModeRef.current = false
    }

    const clearTranscript = () => {
        setSegments([])
        setInterimTranscript('')
    }

    const togglePolishMode = useCallback(() => {
        if (!isListening) return

        const nextMode = !isPolishModeRef.current
        setIsPolishMode(nextMode)
        isPolishModeRef.current = nextMode

        shouldRestartRef.current = true
        setInterimTranscript('')
        recognitionRef.current?.stop()
    }, [isListening])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt' && isListening) {
                e.preventDefault()
                togglePolishMode()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isListening, togglePolishMode])

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
                recognitionRef.current = null
            }
        }
    }, [])

    return {
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
    }
}
