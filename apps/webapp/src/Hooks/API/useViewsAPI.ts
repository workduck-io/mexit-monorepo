import { API, GET_REQUEST_MINIMUM_GAP_IN_MS, mog } from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { useViewStore, View } from '../useTaskViews'

export const useViewAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setViews = useViewStore((store) => store.setViews)

  const saveView = async (view: View) => {
    const reqData = {
      workspaceId: getWorkspaceId(),
      properties: {
        title: view.title,
        description: view.description,
        globalJoin: view.globalJoin,
        sortOrder: view.sortOrder,
        sortType: view.sortType,
        viewType: view.viewType
      },
      entityId: view.id,
      filters: view.filters
    }

    const resp = await API.view.create(reqData)
    return resp
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllViews = async (): Promise<View[] | undefined> => {
    const resp = await API.view.getAll({ enabled: true, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS }).then((resp: any) => {
      if (!resp) return
      // mog('We fetched them view', { resp })
      const views = resp
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
      try {
        if (views !== undefined) {
          setViews(views)
        }
      } catch (e) {
        mog('Error fetching the views', { e })
      }

      return views
    })
    return resp
  }

  const deleteView = async (viewid: string) => {
    const resp = await API.view.delete(viewid).then((resp) => {
      mog('We deleted that view', { resp })
      return resp
    })

    return resp
  }

  return {
    saveView,
    getAllViews,
    deleteView
  }
}
