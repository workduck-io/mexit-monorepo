import type { RangeType } from '../Hooks/useSputlitContext'

/**
 * Get text and range from trigger to cursor.
 * Starts with trigger and ends with non-whitespace character.
 */
export const getDibbaText = (range: RangeType, text: string) => {
  const wordStart = text.lastIndexOf(' ', range.startOffset) < 0 ? 0 : text.lastIndexOf(' ', range.startOffset) + 1
  const currentWord = text.slice(wordStart, range.endOffset)

  if (!range || !currentWord.match(/^\[\[/)) return

  return {
    range: {
      ...range,
      startOffset: wordStart
    },
    textAfterTrigger: currentWord.substring(2) || ''
  }
}
