import { useCallback } from 'react'

import { mog } from '@mexit/core'

import { useHighlightStore } from '../Stores/useHighlightStore'

import { useHighlightAPI } from './API/useHighlightAPI'

export const useHighlights = () => {
  const highlights = useHighlightStore((s) => s.highlights)
  const highlightBlockMap = useHighlightStore((store) => store.highlightBlockMap)
  const getHighlightMap = useCallback(
    (highlighId: string) => {
      const highlightMap = highlightBlockMap[highlighId]
      return highlightMap
    },
    [highlightBlockMap]
  )

  const getHighlight = useCallback(
    (highlightId: string) => {
      const highlight = highlights.find((h) => h.entityId === highlightId)
      return highlight
    },
    [highlights]
  )

  return {
    getHighlightMap,
    getHighlight
  }
}

export const useHighlightSync = () => {
  const setHighlights = useHighlightStore((store) => store.setHighlights)
  const highlightsAPI = useHighlightAPI()
  const fetchAllHighlights = async () => {
    await highlightsAPI
      .getAllHighlights()
      .then((highlights) => {
        if (highlights) {
          setHighlights(highlights)
        }
      })
      .catch((e) => {
        mog('Error fetching highlights', { e })
      })
  }

  return {
    fetchAllHighlights
  }
}
