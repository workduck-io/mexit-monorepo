import { isElder, getReminderState } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useLinks } from './useLinks'

export const useGenericFilterFunctions = () => {
  const { getPathFromNodeid } = useLinks()
  return {
    note: (item, value) => {
      // return true
      const itemPath = getPathFromNodeid(item.id)
      // mog('itemPath being filtered', { item, itemPath, path })
      return isElder(itemPath, value) || itemPath === value
    },
    tag: (item, value) => {
      const tagsCache = useDataStore.getState().tagsCache
      const tags = tagsCache[value]
      return tags && tags.nodes.includes(item.id)
    }
  }
}

export const reminderFilterFunctions = {
  note: (item, value) => {
    return item.nodeid === value
  },
  state: (item, value) => {
    const state = getReminderState(item)
    return state === value
  },
  has: (item, value) => {
    return item.todoid !== undefined
  }
}

export const useTaskFilterFunctions = () => {
  const { getPathFromNodeid } = useLinks()
  return {
    note: (item, value) => {
      // filter: (item: TodoType) => {
      const itemPath = getPathFromNodeid(item.nodeid)
      if (!itemPath) return false
      // mog('itemPath being filtered', { item, itemPath, path })
      return isElder(itemPath, value) || itemPath === value
      // }
    },

    tag: (item, value) => {
      return item.tags?.includes(value)
    },

    mention: (item, value) => {
      return item.mentions?.includes(value)
    }
  }
}
