import { FilterJoin, FilterType, MIcon, SHARED_NAMESPACE } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useNamespaces } from './useNamespaces'

export const getFilterJoinIcon = (join: FilterJoin): MIcon => {
  // mog('getTagFilterValueIcon', { join })
  switch (join) {
    case 'all':
      return { type: 'ICON', value: 'material-symbols:join-inner' }
    case 'any':
      return { type: 'ICON', value: 'material-symbols:join-full' }
    case 'notAny':
      return { type: 'ICON', value: 'material-symbols:join-outline' }
    case 'none':
      return { type: 'ICON', value: 'carbon:join-outer' }

    default:
      return { type: 'ICON', value: 'material-symbols:join-outline' }
  }
}

export const useFilterIcons = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const namespaces = useDataStore((state) => state.namespaces)
  const { getNamespaceIcon } = useNamespaces()

  const getFilterValueIcon = (type: FilterType, value: string): MIcon => {
    // mog('getFilterValueIcon', { type, value })
    switch (type) {
      case 'space': {
        const namespace = namespaces.find((n) => n.id === value)
        if (namespace) {
          return getNamespaceIcon(namespace)
        } else if (value === SHARED_NAMESPACE.id) {
          return { type: 'ICON', value: 'ri:share-line' }
        }
        return { type: 'ICON', value: 'heroicons-outline:view-grid' }
      }

      case 'note': {
        const ilink = ilinks.find((ilink) => ilink.nodeid === value)
        if (ilink) {
          return { type: 'ICON', value: ilink.icon }
        }
        return { type: 'ICON', value: 'ri:file-list-2-line' }
      }

      case 'mention':
        return { type: 'ICON', value: 'ri:at-line' }

      case 'tag':
        return { type: 'ICON', value: 'ri:hashtag' }

      case 'date':
        return { type: 'ICON', value: 'ri:calendar-2-line' }

      case 'state':
        return { type: 'ICON', value: 'ri:checkbox-circle-line' }

      case 'has':
        switch (value) {
          case 'todo':
            return { type: 'ICON', value: 'ri:checkbox-circle-line' }
          case 'highlights':
            return { type: 'ICON', value: 'ri:mark-pen-line' }
          case 'alias':
            return { type: 'ICON', value: 'ri:link-m' }
          default:
            return { type: 'ICON', value: 'ri:checkbox-circle-line' }
        }

      case 'domain':
        return { type: 'ICON', value: 'ri:earth-line' }

      default: {
        return { type: 'ICON', value: 'ri:filter-3-line' }
      }
    }
  }

  return { getFilterValueIcon }
}
