import { Entities } from '@workduck-io/mex-search'

import { MIcon } from '@mexit/core'

import { getMIcon } from '../Components/Icons'

interface SearchEntityType {
  label: string
  icon: MIcon
}

type SearchGroupType = Entities | 'Ungrouped'

export const SearchEntities: Partial<Record<SearchGroupType, SearchEntityType>> = {
  [Entities.TASK]: {
    label: 'Task',
    icon: getMIcon('ICON', 'mex:task-progress')
  },
  [Entities.CONTENT_BLOCK]: {
    label: 'Contents',
    icon: getMIcon('ICON', 'ri:text')
  },
  Ungrouped: {
    label: 'Ungrouped',
    icon: getMIcon('ICON', 'bi:view-stacked')
  }
}
