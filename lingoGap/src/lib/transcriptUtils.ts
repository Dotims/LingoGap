export type HighlightedToken = {
  text: string
  normalized: string
  isPolish: boolean
  /** The English translation (populated after async translation) */
  translation?: string
}

/**
 * A segment in the final transcript.
 * Each segment is either plain English text or a Polish insertion
 * that has been translated.
 */
export type TranscriptSegment = {
  id: string
  /** The text as displayed (English or translated English) */
  displayText: string
  /** If this was originally Polish, the original Polish text */
  originalPolish?: string
  /** Whether this segment was auto-translated from Polish */
  isTranslated: boolean
}

export function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-ząćęłńóśźż]/gi, '')
}

export function splitTranscript(text: string): string[] {
  return text.split(/(\s+|[.,!?;:])/)
}

/**
 * Check if a string contains Polish-specific characters.
 */
export function hasPolishCharacters(text: string): boolean {
  return /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(text)
}

// Comprehensive set of common Polish words that don't contain diacritics
// but are clearly Polish (used for detection in Polish-mode transcripts)
export const POLISH_COMMON_WORDS = new Set([
  // Common nouns
  'dom', 'kot', 'pies', 'mama', 'tata', 'brat', 'siostra', 'dziecko',
  'kobieta', 'szkoła', 'praca', 'czas', 'dzien', 'noc', 'rok',
  'woda', 'jedzenie', 'chleb', 'mleko', 'piwo', 'auto', 'samochod',
  'ulica', 'miasto', 'sklep', 'telefon', 'komputer', 'ksiazka',
  'pilka', 'nozna', 'mecz', 'gra', 'zabawa',
  // Common verbs
  'jest', 'jestem', 'jestes', 'mam', 'masz', 'miec', 'chce', 'chcialbym',
  'moge', 'musze', 'wiem', 'widze', 'robie', 'ide', 'idz',
  'daj', 'zrob', 'powiedz', 'sluchaj', 'patrz', 'czekaj',
  'lubic', 'kupic', 'robic', 'jesc', 'pic', 'spac',
  // Common adjectives
  'dobry', 'dobra', 'dobre', 'zly', 'duzy', 'maly', 'nowy', 'stary',
  'ladny', 'brzydki', 'szybki', 'wolny', 'drogi', 'tani',
  // Pronouns and function words
  'ja', 'ty', 'on', 'ona', 'ono', 'my', 'wy', 'oni', 'one',
  'ten', 'ta', 'to', 'te', 'ci', 'tamten', 'tamta',
  'co', 'kto', 'gdzie', 'kiedy', 'jak', 'dlaczego', 'ile',
  // Common expressions
  'tak', 'nie', 'dobrze', 'okej', 'prosze', 'dziekuje', 'przepraszam',
  'czesc', 'witam', 'hej', 'pa', 'dobranoc', 'dziendobry',
  'bardzo', 'troche', 'tylko', 'jeszcze', 'juz', 'teraz', 'potem',
  'tutaj', 'tam', 'zawsze', 'nigdy', 'czasami', 'moze',
  // Prepositions and conjunctions
  'na', 'do', 'od', 'za', 'po', 'przed', 'nad', 'pod', 'przy',
  'bo', 'ale', 'albo', 'lub', 'ani', 'wiec', 'ze', 'zeby',
  // Numbers
  'jeden', 'dwa', 'trzy', 'cztery', 'piec', 'szesc', 'siedem',
  'osiem', 'dziewiec', 'dziesiec', 'sto', 'tysiac',
])

export function buildHighlightedTokens(text: string): HighlightedToken[] {
  return splitTranscript(text).map((token) => {
    const normalized = normalizeToken(token)
    const isPolish =
      normalized.length > 0 &&
      (hasPolishCharacters(token) || POLISH_COMMON_WORDS.has(normalized))
    return {
      text: token,
      normalized,
      isPolish,
    }
  })
}

export function countPolishTokens(tokens: HighlightedToken[]): number {
  return tokens.filter((token) => token.isPolish).length
}

let segmentIdCounter = 0

export function createSegment(
  displayText: string,
  originalPolish?: string
): TranscriptSegment {
  return {
    id: `seg-${segmentIdCounter++}`,
    displayText,
    originalPolish,
    isTranslated: !!originalPolish,
  }
}
