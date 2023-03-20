import { Entities } from '@workduck-io/mex-search'

import { MIcon } from '@mexit/core'

import { DefaultMIcons, getMIcon } from '../Components/Icons'

export interface SearchEntityType {
  id: string
  label: string
  icon: MIcon
}

export const SearchableEntities = [Entities.TASK, Entities.REMINDER, Entities.CONTENT_BLOCK]

export const EntitiesInfo: Partial<Record<string, SearchEntityType>> = {
  [Entities.TASK]: {
    id: 'tasks',
    label: 'Tasks',
    icon: DefaultMIcons.TASK
  },
  [Entities.REMINDER]: {
    id: 'reminders',
    label: 'Reminders',
    icon: DefaultMIcons.REMINDER
  },
  [Entities.IMAGE]: {
    id: 'images',
    label: 'Images',
    icon: DefaultMIcons.IMAGE
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
