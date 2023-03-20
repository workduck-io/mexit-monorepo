import { capitalize, getNameFromPath, SEPARATOR, useDataStore } from '@mexit/core'
import { EntitiesInfo } from '@mexit/shared'

import { useUserService } from './API/useUserAPI'
import { getFilterTypeIcon } from './useFilterValueIcons'

const useGroupHelper = () => {
  const { getUserDetailsUserId } = useUserService()

  const getGroupFromType = (label: string, group: string) => {
    return {
      id: group,
      label: capitalize(label),
      icon: getFilterTypeIcon(group as any, label)
    }
  }

  const getResultGroup = async (label: string, groupBy: string) => {
    if (!groupBy) return

    const group = groupBy.split(SEPARATOR).at(-1)

    if (label === 'Ungrouped') return EntitiesInfo[label]

    switch (group) {
      case 'parent':
        // eslint-disable-next-line no-case-declarations
        const notePath = useDataStore.getState().ilinks.find((i) => i.nodeid === label)?.path

        return {
          id: group,
          label: notePath ? getNameFromPath(notePath) : 'Private/Missing',
          icon: getFilterTypeIcon('note', label)
        }

      case 'lastEditedBy':
      case 'createdBy':
      case 'updatedBy':
        // eslint-disable-next-line no-case-declarations
        const user = await getUserDetailsUserId(label)

        // eslint-disable-next-line no-case-declarations
        let userLabel = user?.alias ?? ''
        if (user?.name) userLabel += `: ${user?.name}`

        return {
          id: group,
          label: userLabel ?? 'User',
          icon: getFilterTypeIcon('mention', label)
        }
      case 'priority':
      case 'status':
        return getGroupFromType(label, group)
      case 'entity':
        return EntitiesInfo[label]
    }
  }

  return {
    getResultGroup
  }
}

export default useGroupHelper
