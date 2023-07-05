import { MIcon, SuperBlocks } from '@mexit/core'

import { DefaultMIcons, getMIcon } from '../Components/Icons'

export interface SearchEntityType {
  id: string
  label: string
  icon: MIcon
}

export const SearchableEntities = [SuperBlocks.TASK, SuperBlocks.CONTENT]

export const EntitiesInfo: Partial<Record<string, SearchEntityType>> = {
  [SuperBlocks.TASK]: {
    id: 'tasks',
    label: 'Tasks',
    icon: DefaultMIcons.TASK
  },
  // [SuperBlocks.REMINDER]: {
  //   id: 'reminders',
  //   label: 'Reminders',
  //   icon: DefaultMIcons.REMINDER
  // },
  // [SuperBlocks.IMAGE]: {
  //   id: 'images',
  //   label: 'Images',
  //   icon: DefaultMIcons.IMAGE
  // },
  [SuperBlocks.CONTENT]: {
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
