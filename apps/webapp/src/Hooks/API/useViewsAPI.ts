import { client } from '@workduck-io/dwindle'

import { apiURLs, mog, WORKSPACE_HEADER } from '@mexit/core'

import { isRequestedWithin } from '../../Stores/useApiStore'
import { useAuthStore } from '../../Stores/useAuth'
import '../../Utils/apiClient'
import type { View } from '../useTaskViews'

const API_CACHE_LOG = `\nAPI has been requested before, cancelling.\n`

export const useViewAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  const viewHeaders = () => ({
    ...workspaceHeaders(),
    'mex-api-ver': 'v2'
  })

  const saveView = async (view: View) => {
    const reqData = {
      workspaceId: getWorkspaceId(),
      properties: {
        title: view.title,
        description: view.description,
        globalJoin: view.globalJoin
      },
      entityId: view.id,
      filters: view.filters
    }

    const resp = await client.post(apiURLs.view.saveView, reqData, { headers: viewHeaders() }).then((resp) => {
      mog('We saved that view', { resp })
      return resp.data
    })

    return resp
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllViews = async (): Promise<View[] | undefined> => {
    const url = apiURLs.view.getAllViews

    if (isRequestedWithin(5, url)) {
      console.log(API_CACHE_LOG)
      return
    }

    const resp = await client.get(url, { headers: viewHeaders() }).then((resp: any) => {
      // mog('We fetched them view', { resp })
      const views = resp.data
        .map((item: any) => {
          return item.entity === 'view'
            ? ({
                title: item.properties.title,
                description: item.properties.description,
                filters: item.filters,
                id: item.entityId,
                globalJoin: item.properties.globalJoin ?? 'all'
              } as View)
            : undefined
        })
        .filter((v: undefined | View) => !!v)
      return views
    })

    return resp
  }

  const deleteView = async (viewid: string) => {
    const resp = await client.delete(apiURLs.view.deleteView(viewid), { headers: viewHeaders() }).then((resp) => {
      mog('We deleted that view', { resp })
      return resp.data
    })

    return resp
  }

  return {
    saveView,
    getAllViews,
    deleteView
  }
}
