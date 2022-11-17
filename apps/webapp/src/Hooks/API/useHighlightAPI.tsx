import { client } from '@workduck-io/dwindle'

import { apiURLs, mog } from '@mexit/core'

import { isRequestedWithin } from '../../Stores/useApiStore'
import { useAuthStore } from '../../Stores/useAuth'
import '../../Utils/apiClient'
import { useAPIHeaders } from './useAPIHeaders'

type Highlight = any // FIXME

const API_CACHE_LOG = `\nAPI has been requested before, cancelling.\n`

export const useHighlightAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const { workspaceHeaders } = useAPIHeaders()
  const setHighlights = (highlights: any) => {
    // FIXME
    //pass
  }

  const saveHighlight = async (h: Highlight) => {
    const reqData = {
      // workspaceId: getWorkspaceId(),
      properties: {
        title: h.title,
        description: h.description
      },
      entityId: h.id
    }

    const resp = await client
      .post(apiURLs.highlights.saveHighlight, reqData, { headers: workspaceHeaders() })
      .then((resp) => {
        mog('We saved that highlight', { resp })
        return resp.data
      })

    return resp
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllHighlights = async (): Promise<Highlight[] | undefined> => {
    const url = apiURLs.highlights.all

    if (isRequestedWithin(5, url)) {
      console.log(API_CACHE_LOG)
      return
    }

    const resp = await client.get(url, { headers: workspaceHeaders() }).then((resp: any) => {
      // mog('We fetched them view', { resp })
      const highlights = resp.data
        .map((item: any) => {
          return {
            // FIXME
            title: item.properties.title,
            description: item.properties.description,
            filters: item.filters,
            id: item.entityId,
            globalJoin: item.properties.globalJoin ?? 'all'
          } as Highlight
        })
        .filter((v: undefined | Highlight) => !!v)
      try {
        if (highlights !== undefined) {
          setHighlights(highlights)
        }
      } catch (e) {
        mog('Error fetching the views', { e })
      }

      return highlights
    })
    return resp
  }

  const deleteHighlight = async (highlightId: string) => {
    const tempUrl = apiURLs.highlights.byId(highlightId)
    const resp = await client.delete(tempUrl).then((resp) => {
      mog('We deleted that view', { resp })
      return resp.data
    })

    return resp
  }

  return {
    getAllHighlights,
    saveHighlight,
    deleteHighlight
  }
}
