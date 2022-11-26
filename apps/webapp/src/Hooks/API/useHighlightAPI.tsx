import { API, GET_REQUEST_MINIMUM_GAP_IN_MS, Highlight, mog } from '@mexit/core'

// import { isRequestedWithin } from '../../Stores/useApiStore'
// import '../../Utils/apiClient'

export const useHighlightAPI = () => {
  const saveHighlight = async (h: Highlight) => {
    const reqData = {
      // workspaceId: getWorkspaceId(),
      properties: h.properties,
      entityId: h.entityId
    }
    const res = await API.highlight.save(reqData, {
      cache: false
    })
    mog('We saved that highlight', { res })
    return res?.data
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllHighlights = async (): Promise<Highlight[] | undefined> => {
    const res = await API.highlight.getAll({
      cache: true,
      expiry: GET_REQUEST_MINIMUM_GAP_IN_MS
    })
    try {
      const highlights = res.data?.Items?.map((item: any) => {
        return {
          properties: item?.properties,
          entityId: item?.entityId
        } as Highlight
      }).filter((v: undefined | Highlight) => !!v)
      return highlights
    } catch (e) {
      mog('Error fetching highlights', { e })
    }
    return res
  }

  const deleteHighlight = async (highlightId: string) => {
    const res = await API.highlight.delete(highlightId, {
      cache: false
    })
    return res?.data
  }

  return {
    getAllHighlights,
    saveHighlight,
    deleteHighlight
  }
}
