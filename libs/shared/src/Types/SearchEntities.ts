import { Entities } from '@workduck-io/mex-search'

import { MIcon } from '@mexit/core'

import { DefaultMIcons, getMIcon } from '../Components/Icons'

interface SearchEntityType {
  id: string
  label: string
  icon: MIcon
}

type SearchGroupType = Entities | 'Ungrouped'

export const SearchEntities: Partial<Record<SearchGroupType, SearchEntityType>> = {
  [Entities.TASK]: {
    id: 'tasks',
    label: 'Task',
    icon: DefaultMIcons.TASK
  },
  [Entities.REMINDER]: {
    id: 'reminders',
    label: 'Reminder',
    icon: DefaultMIcons.REMINDER
  },
  [Entities.HIGHLIGHT]: {
    id: 'highlights',
    label: 'Highlight',
    icon: DefaultMIcons.HIGHLIGHT
  },
  [Entities.CONTENT_BLOCK]: {
    id: 'contents',
    label: 'Contents',
    icon: getMIcon('ICON', 'ri:text')
  },
  Ungrouped: {
    id: 'ungrouped',
    label: 'Ungrouped',
    icon: getMIcon('ICON', 'bi:view-stacked')
  }
}
