import { MIcon, SuperBlocks } from '@mexit/core'

import { DefaultMIcons, getMIcon } from '../Components/Icons'

export interface SearchEntityType {
  id: string
  label: string
  icon: MIcon
}

export const SearchableEntities = [SuperBlocks.TASK, SuperBlocks.CONTENT, SuperBlocks.CAPTURE]

export const EntitiesInfo: Partial<Record<string, SearchEntityType>> = {
  [SuperBlocks.TASK]: {
    id: 'tasks',
    label: 'Task',
    icon: DefaultMIcons.TASK
  },
  [SuperBlocks.HIGHLIGHT]: {
    id: 'captures',
    label: 'Capture',
    icon: DefaultMIcons.HIGHLIGHT
  },
  [SuperBlocks.CAPTURE]: {
    id: 'smartCaptures',
    label: 'Public Info',
    icon: getMIcon('ICON', 'grommet-icons:contact-info')
  },
  [SuperBlocks.CONTENT]: {
    id: 'contents',
    label: 'Content',
    icon: getMIcon('ICON', 'ri:text')
  },
  Ungrouped: {
    id: 'ungrouped',
    label: 'Ungrouped',
    icon: getMIcon('ICON', 'bi:view-stacked')
  }
}
