/**
 * Get text and range from trigger to cursor.
 * Starts with trigger and ends with non-whitespace character.
 */
export const getDibbaText = (range: Range, text: string) => {
  const wordStart = text.lastIndexOf(' ', range.startOffset) < 0 ? 0 : text.lastIndexOf(' ', range.startOffset) + 1

  console.log(text, wordStart, range.endOffset)
  const currentWord = text.slice(wordStart, range.endOffset)

  console.log(`'${currentWord}'`, wordStart)

  if (!range || !currentWord.match(/^\[\[/)) return

  return {
    range,
    textAfterTrigger: currentWord.substring(2) || ''
  }
}
