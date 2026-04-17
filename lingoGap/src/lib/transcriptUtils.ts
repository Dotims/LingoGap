export type HighlightedToken = {
  text: string
  normalized: string
  isPolish: boolean
}

export const POLISH_WORDS = new Set([
  'jest',
  'dobra',
  'czesc',
  'dziekuje',
  'prosze',
  'tak',
  'nie',
])

export function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-ząćęłńóśźż]/gi, '')
}

export function splitTranscript(text: string): string[] {
  return text.split(/(\s+|[.,!?;:])/)
}

export function buildHighlightedTokens(text: string): HighlightedToken[] {
  return splitTranscript(text).map((token) => {
    const normalized = normalizeToken(token)
    return {
      text: token,
      normalized,
      isPolish: normalized.length > 0 && POLISH_WORDS.has(normalized),
    }
  })
}

export function countPolishTokens(tokens: HighlightedToken[]): number {
  return tokens.filter((token) => token.isPolish).length
}
