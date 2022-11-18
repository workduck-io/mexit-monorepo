import { mog } from '@mexit/core'
import { useCallback } from 'react'
import { useHighlightStore2 } from '../Stores/useHighlightStore'
import { useHighlightAPI } from './API/useHighlightAPI'

export const useHighlights = () => {
  const highlightBlockMap = useHighlightStore2((store) => store.highlightBlockMap)
  const getHighlightMap = useCallback(
    (highlighId: string) => {
      const highlightMap = highlightBlockMap[highlighId]
      return highlightMap
    },
    [highlightBlockMap]
  )

  return {
    getHighlightMap
  }
}

export const useHighlightSync = () => {
  const setHighlights = useHighlightStore2((store) => store.setHighlights)
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
