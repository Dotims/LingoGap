/**
 * Translation service for Polish => English using MyMemory free API.
 * No API key required for reasonable usage (~5000 words/day).
 */

export type TranslationResult = {
  originalPolish: string
  translatedEnglish: string
  success: boolean
}

const translationCache = new Map<string, string>()

export async function translatePolishToEnglish(text: string): Promise<TranslationResult> {
  const trimmed = text.trim().toLowerCase()

  if (!trimmed) {
    return { originalPolish: text, translatedEnglish: text, success: false }
  }

  // Check cache first
  if (translationCache.has(trimmed)) {
    return {
      originalPolish: text,
      translatedEnglish: translationCache.get(trimmed)!,
      success: true,
    }
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=pl|en`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText.toLowerCase()

      // Don't treat it as translated if the API just returned the same text
      if (translated === trimmed) {
        return { originalPolish: text, translatedEnglish: text, success: false }
      }

      translationCache.set(trimmed, translated)
      return {
        originalPolish: text,
        translatedEnglish: translated,
        success: true,
      }
    }

    return { originalPolish: text, translatedEnglish: text, success: false }
  } catch (err) {
    console.warn('Translation failed:', err)
    return { originalPolish: text, translatedEnglish: text, success: false }
  }
}
