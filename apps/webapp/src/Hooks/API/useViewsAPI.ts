import { API, generateFilterId, GET_REQUEST_MINIMUM_GAP_IN_MS, mog, useAuthStore, View } from '@mexit/core'

import { useViewStore } from '../../Stores/useViewStore'

export const useViewAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setViews = useViewStore((store) => store.setViews)

  const saveView = async (view: View) => {
    const { id: entityId, parent, filters, ...properties } = view

    const reqData = {
      workspaceId: getWorkspaceId(),
      properties,
      entityId,
      parent,
      filters
    }

    const res = await API.view.create(reqData)
    return res
  }

  const transformView = (view: any) => {
    const newFilters = []

    view.filters.forEach((filter) => {
      filter.values.forEach((val) => {
        let value = val.value

        if (filter.type === 'note') {
          value = val.id.startsWith('filter_node') ? val.id.slice(12) : val.id
        }

        newFilters.push({
          ...filter,
          id: generateFilterId(),
          values: [
            {
              ...val,
              value
            }
          ]
        })
      })
    })

    return {
      ...view.properties,
      title: view.properties.title,
      description: view.properties.description,
      filters: newFilters,
      path: view.path,
      id: view.entityId
    }
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
          return item.entity === 'view' ? transformView(item) : undefined
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
