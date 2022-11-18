import { mog } from '@mexit/core'
import { useHighlightStore2 } from '../Stores/useHighlightStore'
import { useHighlightAPI } from './API/useHighlightAPI'

export const useHighlights = () => {
  const addHighlight = () => {
    //Pass
  }
  const removeHighlight = () => {
    //Pass
  }

  return {
    addHighlight,
    removeHighlight
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
