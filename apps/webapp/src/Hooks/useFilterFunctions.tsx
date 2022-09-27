import { isElder, getReminderState, Filter, FilterJoin, FilterValue, SearchFilterFunctions } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useLinks } from './useLinks'

const joinNewRes = (acc: boolean, curRes: boolean, join: FilterJoin) => {
  if (join === 'all') {
    return acc && curRes
  } else if (join === 'any') {
    return acc || curRes
  } else if (join === 'notAny') {
    return acc || curRes
  } else if (join === 'none') {
    return acc && curRes
  }
}

const joinStartVal = (join: FilterJoin) => {
  if (join === 'all') {
    return true
  } else if (join === 'any') {
    return false
  } else if (join === 'notAny') {
    return false
  } else if (join === 'none') {
    return true
  }
}

const finalJoin = (join: FilterJoin, res: boolean) => {
  if (join === 'all' || join === 'any') {
    return res
  }
  if (join === 'notAny') {
    return !res
  }
  if (join === 'none') {
    return !res
  }
  return res
}

const joinReduce = (val: FilterValue[], join: FilterJoin, cond: (v: FilterValue) => boolean): boolean =>
  val.length > 0
    ? finalJoin(
        join,
        val.reduce((acc, v) => {
          const curRes = cond(v)
          // Merge with respect to join
          return joinNewRes(acc, curRes, join)
        }, joinStartVal(join))
      )
    : true

// Nice cool function
// Apply the match condition and join the results according to FilterJoin
const filterAndJoin = (filter: Filter, cond: (v: FilterValue) => boolean): boolean => {
  const { join, values } = filter
  // Put single values in array
  const val = Array.isArray(values) ? values : [values]
  return joinReduce(val, join, cond)
}

export const useGenericFilterFunctions = () => {
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const filterFunctions: SearchFilterFunctions = {
    note: (item: any, f: Filter) => {
      const itemPath = getPathFromNodeid(item.id)
      const res = filterAndJoin(f, (v) => isElder(itemPath, v.value) || itemPath === v.value)
      return res
    },

    tag: (item: any, f: Filter) => {
      const tagsCache = useDataStore.getState().tagsCache
      const res = filterAndJoin(f, (v) => tagsCache[v.value]?.nodes.includes(item.id))
      return res
    },

    space: (item: any, f: Filter) => {
      // mog('namespace', { item, value })
      const iLink = getILinkFromNodeid(item.id)
      const res = filterAndJoin(f, (v) => iLink?.namespace === v.value)
      return res
    }
  }
  return filterFunctions
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
