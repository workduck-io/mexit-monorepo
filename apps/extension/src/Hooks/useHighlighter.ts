import toast from 'react-hot-toast'

import { mog } from '@mexit/core'

import { useHighlighterContext } from './useHighlighterContext'

export const useHighlighter = () => {
  const { highlighter } = useHighlighterContext()

  const removeHighlight = (blockId: string) => {
    if (highlighter && blockId) {
      highlighter?.remove(blockId)
    } else {
      mog('Something went wrong on highlight', { highlighter, blockId })
      toast('Please refresh to see updates')
    }
  }

  return { removeHighlight }
}
