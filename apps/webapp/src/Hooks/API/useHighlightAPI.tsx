import { API, GET_REQUEST_MINIMUM_GAP_IN_MS, Highlight, mog } from '@mexit/core'

import { deserializeContent } from '../../Utils/serializer'

export const useHighlightAPI = () => {
  const getHighlight = async (id: string) => {
    const res = await API.highlight.get(id)

    return res
  }

  const saveHighlight = async (h: Highlight) => {
    const reqData = {
      // workspaceId: getWorkspaceId(),
      data: {
        properties: h.properties
      }
    }
    const res = await API.highlight.save(reqData)
    mog('We saved that highlight', { res })
    return res?.data
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllHighlights = async (): Promise<Highlight[] | undefined> => {
    const res = await API.highlight.getAll({
      enabled: true,
      expiry: GET_REQUEST_MINIMUM_GAP_IN_MS
    })
    try {
      const highlights = res
        ?.map((item: any) => {
          if (item.properties?.content) {
            const content = deserializeContent(item.properties.content)
            item.properties.content = content
          }

          return {
            properties: item?.properties,
            entityId: item?.entityRefID,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt
          } as Highlight
        })
        .filter((v: undefined | Highlight) => !!v)
      return highlights
    } catch (e) {
      mog('Error fetching highlights', { e })
    }
    return res
  }

  const deleteHighlight = async (highlightId: string) => {
    const res = await API.highlight.delete(highlightId)
    return res?.data
  }

  return {
    getHighlight,
    getAllHighlights,
    saveHighlight,
    deleteHighlight
  }
}
