import { mog } from '@mexit/core'

import { useHighlighterContext } from './useHighlighterContext'

export const useHighlighter = () => {
  const { highlighter } = useHighlighterContext()

  const removeHighlight = (highlightId: string) => {
    if (highlighter && highlightId) {
      highlighter?.remove(highlightId)
    } else {
      mog('Something went wrong on highlight', { highlighter, highlightId })
      // toast('Please refresh to see updates')
    }
  }

  return { removeHighlight }
}
